export interface ConsultaDocumentos {
	tipo: string;
	codigo: string;
	mensaje: string;
	operacion: {
		poseeFacturas: boolean;
	}
}

