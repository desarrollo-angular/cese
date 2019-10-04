export interface RegistroSocioAccionista{
    // nit: string;
    // nombre: string;
    // acciones: number;
    // participacion: number;
    // pais: number;
    // tipoDocID: number;
    // numID: string;
    // domicilioFiscal: string;
    // nitRepresentante: string;
    // nombreRepresentante: string;
    
    col_0: null | {  
        isText: boolean,
        val:{  
            value: number,
            viewValue: string
        }
    },
    col_1: {  
        isText: boolean,
        val: {  
            value: number,
            viewValue: string
        } | string
    },
    col_2: {  
        val: string | {  
            value: number,
            viewValue: string
        },
        isText: boolean
    },
    col_3: {  
        val: string | number | {  
            value: number,
            viewValue: string
        },
        isText: boolean
    },
    col_4:{  
        val: string | number,
        isText: boolean
    },
    col_5: null | {  
        val: string | number,
        isText: boolean
    },
    col_6: null,
    col_7: null | number //radioSeccion
}