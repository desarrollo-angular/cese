import { CargaArchivo } from "app/formulario-inscripcion/interfaces/archivo/cargaArchivo.interface";

export class IdentificacionEmpresa {
  tipoPersoneria: number;
  descPersoneria: string;
  razonSocial: string;
  fechaConstitucion: string;
  tipoDoctoConstitucion: number;
  numeroDoctoConstitucion: number;
  anioDoctoConstitucion: number;
  nitNotario: string;
  nombreNotario: string;
  fechaInscripcion: string;
  registroExterno: number;
  sectorEconomico: number;
  participacionGremial: string;
  camaraEmpresarial: number;
  documentoConstitucion: CargaArchivo;
  documentoPatente: CargaArchivo;
  tipoFiduciaria: number;
  descTipoFiduciaria: string;
  participacionEmpresarial: string;
  gremial: number;
  
  public inicializar() {
    this.tipoPersoneria = null;
    this.descPersoneria = null;
    this.razonSocial = null;
    this.fechaConstitucion = null;
    this.tipoDoctoConstitucion = null;
    this.numeroDoctoConstitucion = null;
    this.anioDoctoConstitucion = null;
    this.nitNotario = null;
    this.nombreNotario = null;
    this.fechaInscripcion = null;
    this.registroExterno = null;
    this.sectorEconomico = null;
    this.participacionGremial = null;
    this.camaraEmpresarial = null;
    this.documentoConstitucion = null;
    this.documentoPatente = null;
    this.tipoFiduciaria = null;
    this.descTipoFiduciaria = null;
  }

};