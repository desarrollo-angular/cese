import { CargaArchivo } from "app/interfaces/datos-establecimiento/datosEstablecimiento.interface";

export class ubicacion {
  departamento: number;
  municipio: number;
  zona: string;
  grupoHabitacional: number;
  grupoHabitacionalDesc: string;
  vialidad: number;
  vialidadNumero: string;
  vialidadNombre: string;
  casaNumero: string;
  casaLetra: string;
  apartamentoNumero: string;
  apartamentoLetra: string;
  celularArea: string;
  celularNumero: string;
  celularCompania: string;
  lineaFijaArea: string;
  lineaFijaNumero: string;
  lineaFijaCompania: string;
  apartadoPostal: string;
  otros: string;
  documentoAdjunto: CargaArchivo;
  correoElectronico: string;
  vistaPrevia: string;
  tipoDireccion: number;
  localizada: boolean;
  descTipoDireccion: string;
  pais: number;

  public inicializar() {
    this.departamento = null;
    this.municipio = null;
    this.zona = null;
    this.grupoHabitacional = null;
    this.grupoHabitacionalDesc = null;
    this.vialidad = null;
    this.vialidadNumero = null;
    this.vialidadNombre = null;
    this.casaNumero = null;
    this.casaLetra = null;
    this.apartamentoNumero = null;
    this.apartamentoLetra = null;
    this.celularArea = null;
    this.celularNumero = null;
    this.celularCompania = null;
    this.lineaFijaArea = null;
    this.lineaFijaNumero = null;
    this.lineaFijaCompania = null;
    this.apartadoPostal = null;
    this.otros = null;
    this.documentoAdjunto = null;
    this.correoElectronico = null;
    this.vistaPrevia = null;
    this.tipoDireccion = null;
    this.localizada = false;
    this.descTipoDireccion = null;
    this.pais = null;
  }

};