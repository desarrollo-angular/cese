import { TipoContribuyente } from "./tipoContribuyente.interface";
import { Contribuyente } from "./contribuyente.interface";
import { ActividadEconomica } from "../seccion/actvidadEconomica.interface";
//import { Direccion } from "app/admin-ubicaciones/interfaces/seccion/direccion.interface";
import { UbicacionDetallada} from 'app/interfaces/ubicacion/ubicacionDetallada.interface';
import { IDatosTablaEstablecimiento } from '../../../interfaces/datos-establecimiento/datosEstablecimiento.interface';
import { IdentificacionEmpresa } from "app/identificacion-empresa/identificacion-empresa";
import { Representante } from '../../../datos-representante/representante';
import { RegistroSocioAccionista } from "../../../interfaces/registro-socio-accionista.interface";
import { ContadorAuditor } from '../../../interfaces/datos-contador/contadorAuditor.interface';
import { AfiliacionImpuesto } from "app/interfaces/afiliaciones/afiliacionImpuesto.interface";

export interface Datos {
    tipoContribuyente: TipoContribuyente;
    contribuyente: Contribuyente;
    empresa: IdentificacionEmpresa;
    actividadEconomica: ActividadEconomica;
    ubicacion: UbicacionDetallada;
    establecimiento: IDatosTablaEstablecimiento[];
    representante: Representante[];
    accionista: RegistroSocioAccionista[];
    contador: ContadorAuditor;
    afiliacionImpuesto: AfiliacionImpuesto;
}
