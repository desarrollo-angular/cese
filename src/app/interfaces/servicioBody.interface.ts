import { Data } from "app/formulario-inscripcion/interfaces/sessionRtu/data.interface";
import { SatContribuyente } from 'app/interfaces/sat-contribuyente.interface';
import { SatContribuyenteIndividual } from 'app/interfaces/sat_contribuyente-individual.interface';
import { SatContribuyenteJuridico } from 'app/interfaces/sat-contribuyente-juridico.interface';
import { Afiliacion } from 'app/interfaces/afiliacion.interface';
import { RepresentanteLegal } from 'app/interfaces/representante/representante-legal.interface';
import { Contador } from 'app/interfaces/contador.interface';
import { ContadorContribuyente } from 'app/interfaces/contador-contribuyente.interface';
import { Establecimiento } from 'app/interfaces/establecimiento.interface';
import { ParametrosAV } from 'app/interfaces/parametrosAV.interface';
import { GestionDatosBiometricos } from "./gestionDatosBiometricos.interface";
import { IFiltroBuzonSAT } from '../interfaces/buzon-sat/buzonSAT.interface';
import { EnvioCorreo } from "./envioCorreo.interface";
import { IBuzonSAT } from './buzon-sat/buzonSAT.interface';
import { IDatosContribuyente2 } from "./datosContribuyente.interface";


export interface servicioBody {
    //variable que contiene los tipos de bodys que se pueden enviar
    body: Data |
    SatContribuyente |
    SatContribuyenteIndividual | 
    SatContribuyenteJuridico | 
    Afiliacion | 
    RepresentanteLegal | 
    Contador | 
    ContadorContribuyente |
    Establecimiento | 
    ParametrosAV |
    GestionDatosBiometricos |
    IFiltroBuzonSAT |
    IBuzonSAT |
    EnvioCorreo |
    IDatosContribuyente2 |
    null;
}