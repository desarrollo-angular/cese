/**
 * Interfaz de opciones de tipos de cese para Empresa/Organizacion
 */
export interface OPCIONES {
    cod: string,
    value: string
}
/**
 * Interfaz para nit y tipo de persona
 */
export interface CONTRIBUYENTE {
    nit: string | null,
    persona: string | null,
    razonSocial?: string | null,
    numeroDocumentoConstitucion?: string | null,
    fechaConstitucion?: string | Date | null,
    nitNotario?: string | null,
    nombreNotario?: string | null,
    nitRepresentante?: string | null,
    nombreRepresentante?: string | null
}
