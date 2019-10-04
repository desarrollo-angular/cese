export interface IDatosContribuyente {
    nit: string;
    codigoTipo: string | null;
    status: string;
    primerNombre: string;
    segundoNombre: string | null;
    tercerNombre: string | null;
    primerApellido: string;
    segundoApellido: string | null;
    apellidoCasada: string | null;
    nitConyuge: string | null;
    nitPadre: string | null;
    nitMadre: string | null;
    razonSocial: string | null;
}

// cree una nueva interface porque faltaban datos :
// tiene nombre status : estado: 0,
// falta fechaestado : fechaEstado: 2019-04-16T19:44:00.629Z,
export interface IDatosContribuyente2 {
    nit: string;
    codigoTipo: number;
    estado: number;
    fechaEstado: Date;
    primerNombre: string;
    segundoNombre: string | null;
    tercerNombre: string | null;
    primerApellido: string;
    segundoApellido: string | null;
    apellidoCasada: string | null;
    nitConyuge: string | null;
    nitPadre: string | null;
    nitMadre: string | null;
    razonSocial: string | null;
}
