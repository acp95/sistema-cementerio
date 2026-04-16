import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly cls: ClsService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET') || 'your-secret-key-change-in-production',
        });
    }

    async validate(payload: any) {
        // Guardar userId en CLS (Continuation Local Storage) para que el Subscriber de Auditoría lo vea
        this.cls.set('userId', payload.sub);

        // El payload contiene la información decodificada del JWT
        // Este objeto se adjuntará a request.user
        return {
            userId: payload.sub,
            username: payload.username,
            rolId: payload.rolId,
            permisos: payload.permisos,
        };
    }
}
