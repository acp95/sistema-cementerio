import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import {
    DataSource,
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
    UpdateEvent,
    RemoveEvent,
} from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { Auditoria } from '../entities/auditoria.entity';

@Injectable()
@EventSubscriber()
export class AuditoriaSubscriber implements EntitySubscriberInterface {
    constructor(
        @InjectDataSource() readonly dataSource: DataSource,
        private readonly cls: ClsService,
    ) {
        dataSource.subscribers.push(this);
    }

    // Tablas que NO queremos auditar para evitar bucles o ruido
    private excludedTables = ['auditoria'];

    private shouldProcess(tableName: string): boolean {
        return !this.excludedTables.includes(tableName);
    }

    private async log(
        accion: 'INSERT' | 'UPDATE' | 'DELETE',
        event: InsertEvent<any> | UpdateEvent<any> | RemoveEvent<any>,
        datosAnteriores?: any,
        datosNuevos?: any,
    ) {
        const tableName = event.metadata.tableName;
        if (!this.shouldProcess(tableName)) return;

        const userId = this.cls.get('userId');
        
        let registroId: number | undefined = undefined;
        if (event.entity) {
            registroId = (event.entity as any).id;
        }

        const logEntry = new Auditoria();
        if (userId) {
            logEntry.usuarioId = userId as number;
        }
        logEntry.accion = accion;
        logEntry.tablaAfectada = tableName;
        if (registroId) {
            logEntry.registroId = registroId;
        }
        logEntry.datosAnteriores = datosAnteriores;
        logEntry.datosNuevos = datosNuevos;

        try {
            await event.manager.insert(Auditoria, logEntry);
        } catch (error) {
            console.error('Error al guardar auditoria:', error);
        }
    }

    async afterInsert(event: InsertEvent<any>) {
        await this.log('INSERT', event, null, event.entity);
    }

    async afterUpdate(event: UpdateEvent<any>) {
        await this.log('UPDATE', event, event.databaseEntity, event.entity);
    }

    async afterRemove(event: RemoveEvent<any>) {
        await this.log('DELETE', event, event.databaseEntity, null);
    }
}
