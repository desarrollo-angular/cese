export interface GestionDatosBiometricos {
    codigoGestion: string,
    estadoGestion: number,
    fechaConfirmacionSolicitud: string|Date|null,
    fechaCreacionSolicitud: string|Date|null,
    urlFoto: string|null,
    urlHuella: string|null,
    usuario: string|null
}