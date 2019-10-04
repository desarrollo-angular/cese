import { Binary } from "selenium-webdriver/firefox";

export interface CargaArchivo{
    
        identificador: string|null;
        nombre: string;
        documento: null|File;
        tipoDocumento: string|null;
        idDocumento: string|null;
        carpetaArchivo: string;
        cargado: boolean;
       
}