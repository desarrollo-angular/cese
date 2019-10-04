export interface ConsultaOmisoImpuesto {
	tipo: string;
	codigo: string;
	mensaje: string;
	operacion: {
		esOmiso: boolean;
	}
}

