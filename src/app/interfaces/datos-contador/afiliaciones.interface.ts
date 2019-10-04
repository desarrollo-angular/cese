export interface DatosAfiliaciones {
    id: {
        nit: string,
        correlativo: number
    },
    codigoImpuesto: number,
    tipoContribuyente: number,
    clasificacionEstablecimiento: number,
    estimadoIngresoAnual: number,
    regimen: number,
    periodoImpositivo: number,
    frecuenciaPago: number,
    codigoFormulario: number,
    numeroVersion: number,
    estado: number,
    usuarioAdiciono: string,
    usuarioModifico: string,
    fechaAdiciono: Date,
    fechaModifico: Date
}



