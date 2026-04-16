import { Module } from '@nestjs/common';
import { BackupService } from './backup.service';
import { BackupController } from './backup.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule],
    controllers: [BackupController],
    providers: [BackupService],
    exports: [BackupService],
})
export class BackupModule { }
