import { AfiliacionISR } from "./afiliacionISR.interface";
import { AfiliacionISO } from "./afiliacion-iso/afiliacionISO.interface";
import { AfiliacionIVA } from "./afiliacionIVA.interface";

export interface AfiliacionImpuesto{
    
    isr: AfiliacionISR;
    tieneISR: boolean;
    tieneIvaGeneral: boolean;
    tieneISO: boolean;
    iso: AfiliacionISO;
    iva: AfiliacionIVA;
}