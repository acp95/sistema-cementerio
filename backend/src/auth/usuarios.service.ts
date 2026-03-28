import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
    constructor(
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
    ) { }

    async findAll(): Promise<Usuario[]> {
        return await this.usuarioRepository.find({
            relations: ['rol'],
            order: { id: 'DESC' },
        });
    }

    async findOne(id: number): Promise<Usuario> {
        const usuario = await this.usuarioRepository.findOne({
            where: { id },
            relations: ['rol'],
        });
        if (!usuario) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }
        return usuario;
    }

    async create(createUsuarioDto: any): Promise<Usuario> {
        const { password, ...userData } = createUsuarioDto;

        if (!password) {
            throw new BadRequestException('La contraseña es requerida');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUsuario = this.usuarioRepository.create({
            ...userData,
            passwordHash: hashedPassword,
        } as Usuario);

        return await this.usuarioRepository.save(newUsuario);
    }

    async update(id: number, updateUsuarioDto: any): Promise<Usuario> {
        const usuario = await this.findOne(id);
        const { password, ...userData } = updateUsuarioDto;

        if (password && password.trim() !== '') {
            usuario.passwordHash = await bcrypt.hash(password, 10);
        }

        this.usuarioRepository.merge(usuario, userData);
        return await this.usuarioRepository.save(usuario);
    }

    async remove(id: number): Promise<void> {
        const usuario = await this.findOne(id);
        await this.usuarioRepository.remove(usuario);
    }
}
