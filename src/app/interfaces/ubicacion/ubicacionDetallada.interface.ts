import { ubicacion } from './ubicacion';
export interface UbicacionDetallada {
    correoPrincipal: string;
    correoNotificaciones: string;
    correoAdicional: string;
    contraseña: string;
    confContra: string;
    tipoMedio: string;
    usuario: string;
    ubicacion: ubicacion[];
}