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
import { RolPermiso } from './entities/rol-permiso.entity';
import { Permiso } from './entities/permiso.entity';
import { LoginDto, AuthResponseDto } from './dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Usuario)
        private readonly usuarioRepository: Repository<Usuario>,
        @InjectRepository(RolPermiso)
        private readonly rolPermisoRepository: Repository<RolPermiso>,
        @InjectRepository(Permiso)
        private readonly permisoRepository: Repository<Permiso>,
        private readonly jwtService: JwtService,
    ) { }

    /**
     * Obtiene los permisos de un rol
     */
    async getPermissionsByRolId(rolId: number): Promise<string[]> {
        const rolPermisos = await this.rolPermisoRepository.find({
            where: { rolId },
        });

        if (rolPermisos.length === 0) {
            return [];
        }

        // Fetch each permiso individually
        const permisosResult: string[] = [];
        for (const rp of rolPermisos) {
            const permiso = await this.permisoRepository.findOneBy({ id: rp.permisoId });
            if (permiso) {
                permisosResult.push(permiso.slug);
            }
        }

        return permisosResult;
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

        // Obtener permisos del rol
        const permisos = await this.getPermissionsByRolId(usuario.rolId);

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

        const permisos = await this.getPermissionsByRolId(usuario.rolId);

        const { passwordHash, ...result } = usuario;
        return {
            ...result,
            permisos,
        };
    }
}
