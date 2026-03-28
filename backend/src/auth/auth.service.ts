import {
    Injectable,
    UnauthorizedException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Usuario } from './entities/usuario.entity';
import { RolesService } from './roles.service';
import { LoginDto, AuthResponseDto } from './dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Usuario)
        private readonly usuarioRepository: Repository<Usuario>,
        private readonly rolesService: RolesService,
        private readonly jwtService: JwtService,
    ) { }

    /**
     * Obtiene los permisos (slugs) de un rol reutilizando RolesService
     */
    private async getPermissionSlugs(rolId: number): Promise<string[]> {
        const permisos = await this.rolesService.getPermisosByRol(rolId);
        return permisos.map(p => p.slug);
    }

    /**
     * Valida las credenciales del usuario
     */
    async validateUser(usernameOrEmail: string, password: string): Promise<any> {
        const usuario = await this.usuarioRepository.findOne({
            where: [
                { username: usernameOrEmail },
                { email: usernameOrEmail }
            ],
            relations: ['rol'],
        });

        if (!usuario) {
            throw new NotFoundException('Usuario no encontrado');
        }

        if (!usuario.activo) {
            throw new UnauthorizedException('Usuario inactivo');
        }

        // Comparar password con hash
        const isPasswordValid = await bcrypt.compare(
            password,
            usuario.passwordHash,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        // Retornar usuario sin el passwordHash
        const { passwordHash, ...result } = usuario;
        return result;
    }

    /**
     * Genera el token JWT y retorna la respuesta de autenticación
     */
    async login(loginDto: LoginDto): Promise<AuthResponseDto> {
        if (!loginDto.username && !loginDto.email) {
            throw new UnauthorizedException('Debe proporcionar username o email');
        }

        const identifier = loginDto.username || loginDto.email;

        const usuario = await this.validateUser(
            identifier!,
            loginDto.password,
        );

        // Obtener permisos del rol (reutilizando RolesService)
        const permisos = await this.getPermissionSlugs(usuario.rolId);

        // Crear payload del JWT
        const payload = {
            sub: usuario.id,
            username: usuario.username,
            rolId: usuario.rolId,
            permisos: permisos,
        };

        // Generar token
        const access_token = this.jwtService.sign(payload);

        // Actualizar último login
        await this.usuarioRepository.update(usuario.id, {
            ultimoLogin: new Date(),
        });

        // Retornar respuesta con permisos
        return {
            access_token,
            user: {
                id: usuario.id,
                username: usuario.username,
                nombreCompleto: usuario.nombreCompleto,
                email: usuario.email,
                rol: {
                    id: usuario.rol.id,
                    nombre: usuario.rol.nombre,
                },
                permisos: permisos,
            },
        };
    }

    /**
     * Obtiene el perfil del usuario autenticado
     */
    async getProfile(userId: number): Promise<any> {
        const usuario = await this.usuarioRepository.findOne({
            where: { id: userId },
            relations: ['rol'],
        });

        if (!usuario) {
            throw new NotFoundException('Usuario no encontrado');
        }

        const permisos = await this.getPermissionSlugs(usuario.rolId);

        const { passwordHash, ...result } = usuario;
        return {
            ...result,
            permisos,
        };
    }
}
