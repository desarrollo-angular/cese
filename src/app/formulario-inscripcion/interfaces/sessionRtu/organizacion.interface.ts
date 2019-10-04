import { LovContribuyente } from "./lov-contribuyente.interface";

export interface Organizacion {

    Tipo_Personeria: LovContribuyente;
    Razon_Social: string;
    Fecha_Constitucion: string;
    Tipo_Doc_Constitucion: LovContribuyente;
    Numero_Doc_Constitucion: string; //Numero de Acta
    Ano_Doc_Constitucion: string;
    Nombre_Notario: string;
    Path_Doc_Constitucion: string;
    Fecha_Inscripcion_Registro: string; //Registro mercantil
    Sector_Economico: LovContribuyente;
    Participacion_Camara_Empresarial: LovContribuyente;
    Nombre_Camara_Empresarial: string;

}