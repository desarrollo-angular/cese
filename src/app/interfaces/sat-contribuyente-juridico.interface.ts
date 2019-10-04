export interface SatContribuyenteJuridico{
    nit: string;
    tipoNit: number;
    tipoRazonSocial: number;
    razonSocial: string;
    tipoDocumentoConstitucion: number;
    numeroDocumentoConstitucion: number;
    fechaConstitucion: string;
    numeroInscripcion: number;
    fechaInscripcionRegistro: string;
    fechaInscripcionCivil: string;
    fechaInscripcionDefinitiva: string;
    numeroEscritura: number;
    fechaEscritura: string;
    registroExterno: number;
    sectorEconomico: number;
    participacionCamaraEmpresarial: number;
    camaraEmpresarial: number;
    usuarioAdiciono: string;
    usuarioModifico: string;
    fechaAdiciono: string | Date;
    fechaModifico: string;
}