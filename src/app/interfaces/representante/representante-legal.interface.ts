export interface RepresentanteLegal{
    nitRepresentante: string,
    nitRepresentado: string,
    status: string,
    fechaStatus: string | Date,
    fechaInscripcionRegistro: string,
    fechaNombramiento: string,
    fechaVencimiento: string,
    principal: boolean,
    usuarioAdiciono: string,
    usuarioModifico: string,
    fechaAdiciono: string | Date,
    fechaModifico: string
}