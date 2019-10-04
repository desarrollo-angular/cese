export interface IBuzonSAT {
    idNotificacion: string;
    nitContribuyente: string;
    idTipoAsunto: string;
    descripcionAsunto: string;
    mensajeAsunto: string;
    nombreTipoAsunto: string;    
    fechaAsunto: Date | string;    
    mensajeLeido: boolean | null;
}

export interface IFiltroBuzonSAT {
    fechaInicio: Date | null;
    fechaFin: Date | null;
    idTipoAsunto: string | null;
    nit: string;
}