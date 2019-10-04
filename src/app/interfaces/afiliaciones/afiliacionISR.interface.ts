import { CondicionEspecialDato } from "../datos-representante/condicion-especial-dato.interface";

export interface AfiliacionISR {
    codigoImpuesto: number;
    nombreImpuesto: string;
    periodoImpositivo: string|null;
    tipoContribuyente: number|null;
    tipoRenta: number;
    regimen: number;
    SistemaInventario: number;
    SistemaContable: number;
    formaCalculo: CondicionEspecialDato|null;
    frecuenciaPago: CondicionEspecialDato|null;
    indicadorObligacion: CondicionEspecialDato|null;
    sector: number|null;
    rentaImponible: number|null;
}