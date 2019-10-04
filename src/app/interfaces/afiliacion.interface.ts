export interface Afiliacion {
  clasificacionEstablecimiento: number;
  codigoFormulario: number;
  codigoImpuesto: number;
  estado: number;
  estimadoIngresoAnual: number;
  fechaAdiciono: Date;
  fechaModifico: Date;
  formaCalculo: number;
  frecuenciaPago: number;
  id: {
    correlativo: number;
    nit: string
  },
  indicadorObligacion: number;
  numeroVersion: number;
  periodoImpositivo: number;
  regimen: number;
  rentaActividadLucrativa: number;
  rentaTrabajo: number;
  sistemaContable: number;
  sistemaValuacionInventario: number;
  tipoContribuyente: number;
  tipoRenta: number;
  usuarioAdiciono: string,
  usuarioModifico: string
}