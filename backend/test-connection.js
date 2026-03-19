// Test de conexión directa a PostgreSQL
import { Client } from 'pg';

const client = new Client({
    host: 'localhost',
    port: 5433,
    user: 'admin',
    password: 'admin123',
    database: 'cementerio_db',
});

async function testConnection() {
    try {
        console.log('🔍 Intentando conectar a PostgreSQL...');
        console.log('Host:', 'localhost');
        console.log('Port:', 5433);
        console.log('User:', 'admin');
        console.log('Database:', 'cementerio_db');
        console.log('');

        await client.connect();
        console.log('✅ CONEXIÓN EXITOSA!');

        const result = await client.query('SELECT version(), current_user, current_database()');
        console.log('');
        console.log('📊 Información de la conexión:');
        console.log(result.rows[0]);

        await client.end();
        console.log('');
        console.log('✅ PostgreSQL funciona correctamente en puerto 5433');
    } catch (error) {
        console.log('❌ ERROR DE CONEXIÓN:');
        console.error(error.message);
        process.exit(1);
    }
}

testConnection();
