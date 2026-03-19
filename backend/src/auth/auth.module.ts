import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Usuario } from './entities/usuario.entity';
import { Rol } from './entities/rol.entity';
import { Permiso } from './entities/permiso.entity';
import { RolPermiso } from './entities/rol-permiso.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { PermisosController } from './permisos.controller';
import { PermisosService } from './permisos.service';
import { PermissionsGuard } from './guards/permissions.guard';

@Module({
    imports: [
        TypeOrmModule.forFeature([Usuario, Rol, Permiso, RolPermiso]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET') || 'your-secret-key-change-in-production',
                signOptions: {
                    expiresIn: (configService.get<string>('JWT_EXPIRES_IN') || '24h') as any,
                },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController, RolesController, UsuariosController, PermisosController],
    providers: [AuthService, JwtStrategy, RolesService, UsuariosService, PermisosService, PermissionsGuard],
    exports: [AuthService, RolesService, UsuariosService, PermisosService, PermissionsGuard],
})
export class AuthModule { }
