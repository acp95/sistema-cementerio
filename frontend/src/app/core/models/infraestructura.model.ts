// Sector Models
export interface Sector {
    id: number;
    nombre: string;
    descripcion?: string;
    tipo?: string;
    tipoEspacio: 'nicho' | 'fosa';
    capacidadTotal: number;
    coordenadasGeo?: string;
    espacios?: Espacio[];
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateSectorDto {
    nombre: string;
    descripcion?: string;
    tipo?: string;
    tipoEspacio: 'nicho' | 'fosa';
    capacidadTotal: number;
    coordenadasGeo?: string;
}

export interface UpdateSectorDto extends Partial<CreateSectorDto> { }

// Espacio Models
export interface Espacio {
    id: number;
    sectorId: number;
    sector?: Sector;
    codigo: string;
    fila?: string;
    columna?: string;
    numero?: string;
    tipo: 'nicho' | 'fosa';
    ubicacion: string;
    estado: 'LIBRE' | 'OCUPADO' | 'MANTENIMIENTO' | 'RESERVADO';
    precioAnual: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateEspacioDto {
    sectorId: number;
    codigo: string;
    fila?: string;
    columna?: string;
    numero?: string;
    tipo: 'nicho' | 'fosa';
    ubicacion: string;
    estado?: 'LIBRE' | 'OCUPADO' | 'MANTENIMIENTO';
    precioAnual: number;
}

export interface UpdateEspacioDto extends Partial<CreateEspacioDto> { }

// Espacio Mapa Models (for visual map)
export interface EspacioMapa {
    id: number;
    codigo?: string;
    fila: string | null;
    columna: string | null;
    numero: string | null;
    tipoEspacio: string;
    estado: 'LIBRE' | 'OCUPADO' | 'MANTENIMIENTO' | 'RESERVADO';
    sector?: {
        id: number;
        nombre: string;
    } | null;
    ocupado: boolean;
    ocupante: {
        difunto: string;
        titular: string;
        fechaInhumacion: Date | null | string;
    } | null;
}
