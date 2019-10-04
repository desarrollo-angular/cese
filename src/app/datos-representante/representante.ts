import { CargaArchivo } from "app/formulario-inscripcion/interfaces/archivo/cargaArchivo.interface";

export class Representante {
  nit: string;
  nombre: string;
  tipo: number;
  fechaNombramiento: Date;
  fechaInscripcion: Date;
  aniosRepresentacion: number;
  fechaVigenteHasta: Date;
  estado: string;
  descEstado: string;
  documentoAdjunto: CargaArchivo;
  correlativo: number;
  correoElectronico: string;
}
