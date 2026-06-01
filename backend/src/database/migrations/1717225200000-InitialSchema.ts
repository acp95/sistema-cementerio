import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1717225200000 implements MigrationInterface {
  name = 'InitialSchema1717225200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Auth tables
    await queryRunner.query(
      `CREATE TABLE "rol" ("id" SERIAL NOT NULL, "nombre" character varying NOT NULL, "descripcion" character varying, "activo" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_rol_id" PRIMARY KEY ("id"))`,
    );

    await queryRunner.query(
      `CREATE TABLE "permiso" ("id" SERIAL NOT NULL, "nombre" character varying NOT NULL, "descripcion" character varying, "activo" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_permiso_id" PRIMARY KEY ("id"))`,
    );

    await queryRunner.query(
      `CREATE TABLE "rol_permiso" ("id" SERIAL NOT NULL, "rolId" integer NOT NULL, "permisoId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_rol_permiso_id" PRIMARY KEY ("id"), CONSTRAINT "FK_rol_permiso_rolId" FOREIGN KEY ("rolId") REFERENCES "rol"("id") ON DELETE CASCADE, CONSTRAINT "FK_rol_permiso_permisoId" FOREIGN KEY ("permisoId") REFERENCES "permiso"("id") ON DELETE CASCADE)`,
    );

    await queryRunner.query(
      `CREATE TABLE "usuario" ("id" SERIAL NOT NULL, "nombre" character varying NOT NULL, "apellido" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "activo" boolean NOT NULL DEFAULT true, "rolId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_usuario_email" UNIQUE ("email"), CONSTRAINT "PK_usuario_id" PRIMARY KEY ("id"), CONSTRAINT "FK_usuario_rolId" FOREIGN KEY ("rolId") REFERENCES "rol"("id"))`,
    );

    // Infraestructura tables
    await queryRunner.query(
      `CREATE TABLE "sector" ("id" SERIAL NOT NULL, "nombre" character varying NOT NULL, "descripcion" character varying, "activo" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_sector_id" PRIMARY KEY ("id"))`,
    );

    await queryRunner.query(
      `CREATE TABLE "espacio" ("id" SERIAL NOT NULL, "numero" character varying NOT NULL, "fila" character varying NOT NULL, "columna" character varying NOT NULL, "tipo" character varying NOT NULL, "estado" character varying NOT NULL DEFAULT 'disponible', "sectorId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_espacio_id" PRIMARY KEY ("id"), CONSTRAINT "FK_espacio_sectorId" FOREIGN KEY ("sectorId") REFERENCES "sector"("id"))`,
    );

    // Registro tables
    await queryRunner.query(
      `CREATE TABLE "titular" ("id" SERIAL NOT NULL, "nombre" character varying NOT NULL, "apellido" character varying NOT NULL, "cedula" character varying NOT NULL, "telefono" character varying, "email" character varying, "direccion" character varying, "activo" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_titular_cedula" UNIQUE ("cedula"), CONSTRAINT "PK_titular_id" PRIMARY KEY ("id"))`,
    );

    await queryRunner.query(
      `CREATE TABLE "difunto" ("id" SERIAL NOT NULL, "nombre" character varying NOT NULL, "apellido" character varying NOT NULL, "cedula" character varying, "fechaNacimiento" TIMESTAMP, "fechaFallecimiento" TIMESTAMP NOT NULL, "titularId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_difunto_id" PRIMARY KEY ("id"), CONSTRAINT "FK_difunto_titularId" FOREIGN KEY ("titularId") REFERENCES "titular"("id"))`,
    );

    await queryRunner.query(
      `CREATE TABLE "inhumacion" ("id" SERIAL NOT NULL, "fechaInhumacion" TIMESTAMP NOT NULL, "difuntoId" integer NOT NULL, "espacioId" integer NOT NULL, "observaciones" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_inhumacion_id" PRIMARY KEY ("id"), CONSTRAINT "FK_inhumacion_difuntoId" FOREIGN KEY ("difuntoId") REFERENCES "difunto"("id"), CONSTRAINT "FK_inhumacion_espacioId" FOREIGN KEY ("espacioId") REFERENCES "espacio"("id"))`,
    );

    // Caja tables
    await queryRunner.query(
      `CREATE TABLE "concepto_pago" ("id" SERIAL NOT NULL, "nombre" character varying NOT NULL, "descripcion" character varying, "monto" numeric NOT NULL, "activo" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_concepto_pago_id" PRIMARY KEY ("id"))`,
    );

    await queryRunner.query(
      `CREATE TABLE "pago" ("id" SERIAL NOT NULL, "fecha" TIMESTAMP NOT NULL, "monto" numeric NOT NULL, "metodoPago" character varying NOT NULL, "referencia" character varying, "titularId" integer NOT NULL, "usuarioId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_pago_id" PRIMARY KEY ("id"), CONSTRAINT "FK_pago_titularId" FOREIGN KEY ("titularId") REFERENCES "titular"("id"), CONSTRAINT "FK_pago_usuarioId" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id"))`,
    );

    await queryRunner.query(
      `CREATE TABLE "detalle_pago" ("id" SERIAL NOT NULL, "cantidad" integer NOT NULL, "subtotal" numeric NOT NULL, "pagoId" integer NOT NULL, "conceptoPagoId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_detalle_pago_id" PRIMARY KEY ("id"), CONSTRAINT "FK_detalle_pago_pagoId" FOREIGN KEY ("pagoId") REFERENCES "pago"("id") ON DELETE CASCADE, CONSTRAINT "FK_detalle_pago_conceptoPagoId" FOREIGN KEY ("conceptoPagoId") REFERENCES "concepto_pago"("id"))`,
    );

    // Auditoria table
    await queryRunner.query(
      `CREATE TABLE "auditoria" ("id" SERIAL NOT NULL, "entidad" character varying NOT NULL, "accion" character varying NOT NULL, "cambios" jsonb, "usuarioId" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_auditoria_id" PRIMARY KEY ("id"), CONSTRAINT "FK_auditoria_usuarioId" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id"))`,
    );

    // Create indexes
    await queryRunner.query(`CREATE INDEX "IDX_usuario_email" ON "usuario" ("email")`);
    await queryRunner.query(`CREATE INDEX "IDX_titular_cedula" ON "titular" ("cedula")`);
    await queryRunner.query(`CREATE INDEX "IDX_espacio_sectorId" ON "espacio" ("sectorId")`);
    await queryRunner.query(`CREATE INDEX "IDX_inhumacion_espacioId" ON "inhumacion" ("espacioId")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX "IDX_inhumacion_espacioId"`);
    await queryRunner.query(`DROP INDEX "IDX_espacio_sectorId"`);
    await queryRunner.query(`DROP INDEX "IDX_titular_cedula"`);
    await queryRunner.query(`DROP INDEX "IDX_usuario_email"`);

    // Drop tables in reverse order
    await queryRunner.query(`DROP TABLE "auditoria"`);
    await queryRunner.query(`DROP TABLE "detalle_pago"`);
    await queryRunner.query(`DROP TABLE "pago"`);
    await queryRunner.query(`DROP TABLE "concepto_pago"`);
    await queryRunner.query(`DROP TABLE "inhumacion"`);
    await queryRunner.query(`DROP TABLE "difunto"`);
    await queryRunner.query(`DROP TABLE "titular"`);
    await queryRunner.query(`DROP TABLE "espacio"`);
    await queryRunner.query(`DROP TABLE "sector"`);
    await queryRunner.query(`DROP TABLE "usuario"`);
    await queryRunner.query(`DROP TABLE "rol_permiso"`);
    await queryRunner.query(`DROP TABLE "permiso"`);
    await queryRunner.query(`DROP TABLE "rol"`);
  }
}

