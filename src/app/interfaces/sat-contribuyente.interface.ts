export interface SatContribuyente{

   ciiu: string;
  codigoClasificacion: number;
  codigoTipo: number;
  fechaAdiciono: Date |null;
  fechaCambioDomicilio: Date |null;
  fechaCambioRazon: Date |null;
  fechaModifico: Date |string|null;
  fechaNacimiento:Date | string ;
  fechaNombraContador: Date |null;
  fechaStatus: Date |string;
  nit: string;
  nitAbogado: string|null;
  nitContador: string|null;
  status: string;
  tipoNit: number;
  usuarioAdiciono: string;
  usuarioModifico: string|null;

    
}
