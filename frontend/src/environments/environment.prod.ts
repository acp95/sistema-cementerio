export const environment = {
    production: true,
    // Detecta automáticamente: si está en Railway usa esa URL, si no usa localhost
    apiUrl: typeof window !== 'undefined' && window.location.hostname !== 'localhost'
        ? `${window.location.protocol}//${window.location.hostname}/api`
        : 'http://localhost:3000/api'
};
