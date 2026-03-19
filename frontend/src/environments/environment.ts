// Detecta automáticamente la IP del servidor
const getApiUrl = () => {
    // Si estamos en el navegador, usar el hostname actual
    if (typeof window !== 'undefined') {
        return `http://${window.location.hostname}:3000/api`;
    }
    return 'http://localhost:3000/api';
};

export const environment = {
    production: false,
    apiUrl: getApiUrl()
};
