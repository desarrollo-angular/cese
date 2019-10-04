export interface CatDatoByCatalogo{
    codigo: number;
    codigoDatoPadre: number | null;
    codigoCatalogo: number;
    codigoIngresado: string;
    nombre: string;
    descripcion: string;
    estado: number | null;
    usuarioAgrega: string | null;
    fechaAgrega: string | null;
    usuarioModifica: string | null;
    fechaModifica: string | null;
}