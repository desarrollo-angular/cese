export interface SatContribuyenteDatos {
    afiliacionISR: boolean | null,
    afiliacionISRAsalariado: boolean | null,
    afiliacionIVA: boolean | null,
    afiliacionIVAGeneral: boolean | null,
    afiliacionIVAPeque: boolean | null,
    ciiu: string | null,
    esOmiso: boolean | null,
    esOmisoIVA: boolean | null,
    fechaFallecimiento: Date | null,
    nit: string | null,
    poseeFacturas:  boolean | null,
    posseEstablecimiento:  boolean | null
}
