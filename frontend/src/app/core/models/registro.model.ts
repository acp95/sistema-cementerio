import { Espacio } from './infraestructura.model';

// Titular Models
export interface Titular {
    id: number;
    nombres: string;
    apellidos: string;
    tipoDocumento: 'DNI' | 'CE' | 'PASAPORTE';
    numeroDocumento: string;
    telefono?: string;
    email?: string;
    direccion?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateTitularDto {
    nombres: string;
    apellidos: string;
    tipoDocumento: 'DNI' | 'CE' | 'PASAPORTE';
    numeroDocumento: string;
    telefono?: string;
    email?: string;
    direccion?: string;
}

export interface UpdateTitularDto extends Partial<CreateTitularDto> { }

// Difunto Models
export interface Difunto {
    id: number;
    nombres: string;
    apellidos: string;
    tipoDocumento: 'DNI' | 'CE' | 'PASAPORTE';
    numeroDocumento: string;
    fechaNacimiento: Date;
    fechaFallecimiento: Date;
    edad: number;
    lugarFallecimiento?: string;
    causaMuerte?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateDifuntoDto {
    nombres: string;
    apellidos: string;
    tipoDocumento: 'DNI' | 'CE' | 'PASAPORTE';
    numeroDocumento: string;
    fechaNacimiento: string;
    fechaFallecimiento: string;
    lugarFallecimiento?: string;
    causaMuerte?: string;
}

export interface UpdateDifuntoDto extends Partial<CreateDifuntoDto> { }

// Inhumacion Models
export interface Inhumacion {
    id: number;
    difuntoId: number;
    difunto?: Difunto;
    espacioId: number;
    espacio?: Espacio;
    titularId: number;
    titular?: Titular;
    fechaInhumacion: Date;
    numeroCertificado: string;
    observaciones?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateInhumacionDto {
    difuntoId: number;
    espacioId: number;
    titularId: number;
    fechaInhumacion: string;
    numeroCertificado: string;
    observaciones?: string;
}

export interface UpdateInhumacionDto extends Partial<CreateInhumacionDto> { }
