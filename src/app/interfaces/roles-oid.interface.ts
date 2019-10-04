export interface RolesOID {
    tipo: string,
    codigo: number,
    mensaje: string,
    operacion: {
        login: string,
        listaRolesOID: string[]
    },
    poseeRol: boolean
}