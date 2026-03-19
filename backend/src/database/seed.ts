import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { DatabaseSeeder } from './seeder';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const dataSource = app.get(DataSource);

    const seeder = new DatabaseSeeder(dataSource);
    await seeder.seed();

    await app.close();
}

bootstrap().catch((error) => {
    console.error('Error ejecutando seed:', error);
    process.exit(1);
});
