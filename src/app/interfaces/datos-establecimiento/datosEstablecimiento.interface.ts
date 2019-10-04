export interface IdActividadEconomica{
  ciiu: string;
  codigo: string;
  subTipo: string;
  tipoActividad:string;
  tipoPersona:string;
  tipoNit:string;
}

export interface CargaArchivo {
  identificador: string|null;
  nombre: string;
  documento: null|File;
  tipoDocumento: string|null;
  idDocumento: string|null;
  carpetaArchivo: string;
  cargado: boolean;
}

export interface ActividadComerical {
  codigoActividadEconomica: string;
  codigoSector: string;
  codigoSubsector: string;
  nombre: string;

}

export interface IClasificacionEstablecimiento {
    codigo: string;
    nombre: string;
}

export interface ITipoEstablecimiento {
    codigo: string;
    nombre: string;
}

export interface ActividadEconomica{
  id: IdActividadEconomica;
  nombre: string;
  tipoContribuyente: string;

}


export interface IDatosEstablecimientoC {
    noEstablecimiento: string | null;
    nombreComercialEstablecimiento: string;
    actividadEconomica: ActividadEconomica;
    actividadComercial: ActividadComerical;
    clasificacionEstablecimiento: IClasificacionEstablecimiento;
    fechaInicioOperaciones: Date | string;
    direccion: string | null;
    tipoEstablecimiento: string;
    estado: string;
  }

export interface IDatosTablaEstablecimiento {
    nombreEstablecimiento: string;
    direccion: string | null;
    idActividadEconomica: string | null;
    nombreActividadEconomica: string | null;
    idActividadComercial: string | null;
    nombreActividadComercial: string | null;
    idClasificacionEstablecimento: string | null;
    nombreClasificacionEstablecimiento: string | null;
    idTipoEstablecimiento: string | null;
    nombreTipoEstablecimiento: string | null;
    fechaInicioOperaciones: Date | string | null;
    fechaInicioExento: Date | string | null;
    documentoResolucionExento: CargaArchivo | null;
    telefonoCelular: string | null;
    lineaFija: string | null;
    direccionCompleta: string | null;
}
