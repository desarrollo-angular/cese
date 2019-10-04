
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { servicioBody } from 'app/interfaces/servicioBody.interface';
import { CargaArchivo } from 'app/interfaces/cargaArchivo.interface';
import { Observable, throwError } from 'rxjs';
import { Credencial } from 'app/interfaces/bancario/credencial.interface'
import { ParametrosConsulta } from 'app/interfaces/bancario/parametrosConsulta.interface'
import { VEHICULOS_ASOCIADOS } from 'app/datos/Datos';
import { ActividadComerical } from 'app/interfaces/actividadComercial.interface';
import { Constantes } from 'app/util/constantes';
import { DECLA_POSTERIORES } from '../datos/Datos';
import { MatStepper } from '@angular/material';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';

@Injectable({
    providedIn: 'root'
})

export class Servicios {
	
    // lo trae del enviroment dependiendo del ambiente
	BASE_API_SAT          = environment.BASE_API_SAT;
    URL_RTU               = this.BASE_API_SAT + '/sat_rtu';

    URL_SAT_RTU: string   = this.URL_RTU;
    URL_CATALOGOS         = this.BASE_API_SAT + '/sat_catalogo';
    URL_SAT_GENERAL       = this.BASE_API_SAT + '/sat_general';
    URL_SAT_FISCALIZACION = this.BASE_API_SAT + '/sat_fiscalizacion';

	URL_DOCUMENTO_S3 = 'https://g7qmj1ebgf.execute-api.us-east-1.amazonaws.com/desarrollo/docinscriprtu';
	URL_DOCUMENTOS   = "http://10.99.1.138:48080/documentos/privado/";
    URL_TOKEN        = this.URL_RTU + '/reconocimientoFacial/tokens';

  // Microservicios Especiales
	URL_RECONOCIMIENTO 			  = this.BASE_API_SAT + '/reconocimientoFacial/privado';
	URL_EMAIL_AV            	  = this.BASE_API_SAT + '/solicitudesagenciavirtual/solicitudesAgenciaVirtual';
	URL_COMPANIA_TEL        	  = this.BASE_API_SAT + '/companiaTelefonica/privado/nombreCompania';

  // METODOS DE SAT-RTU
	URL_COORDENADAS_UBICACION     = this.URL_RTU + '/coordenadas';
	URL_CONTRIBUYENTE 			  = this.URL_RTU + '/contribuyente';
	URL_ESTABLECIMIENTO 		  = this.URL_RTU + '/establecimientos';
	URL_AFILIACIONES 			  = this.URL_RTU + '/afiliaciones';
	URL_ABOGADO 			      = this.URL_RTU + '/abogados';
	URL_CONTADOR                  = this.URL_RTU + '/contadores';
	URL_CONTRIBUYENTE_JURIDICO    = this.URL_RTU + '/contribuyentesJuridicos';
	URL_CONTRIBUYENTE_INDIVIDUAL  = this.URL_RTU + '/contribuyentesIndividuales';
	URL_ACTIVIDAD_ECONOMICA 	  = this.URL_RTU + '/actividadesEconomicas';
	URL_SAT_CONTRIBUYENTES 		  = this.URL_RTU + '/contribuyentes';
    URL_DIRECCION 				  = this.URL_RTU + '/coordenadas';
	URL_RTU_REPRESENTANTE 		  = this.URL_RTU + '/representantes';
	URL_SAT_CONTRIBUYENTES_DATOS  = this.URL_RTU + '/contribuyentes';
	URL_ENVIO_EMAIL 			  = this.URL_RTU + '/consultas_oid_ws/email';
	URL_ENCRIPTA 				  = this.URL_RTU + '/consultas_oid_ws';
	URL_CONSULTAS				  = this.URL_RTU + '/consultas';
    URL_CARACTERISTICAS			  = this.URL_RTU + '/caracteristicasEspeciales';
    URL_SAT_ABOGADOS              = this.URL_RTU + '/contribAbogados';
    URL_NITS                      = this.URL_RTU + '/nits';

    // METODOS DE SAT-GENERAL
    URL_NOTIFICACIONES_CONTRIBUYENTE = this.BASE_API_SAT + 'sat_general';

    // METODOS DE SAT-FISCALIZACION
	URL_ACTIVIDAD_COMERCIAL = this.URL_SAT_FISCALIZACION + '/actividadComercial/privado/actividades';
  
	// METODOS DE CATALOGOS
	URL_pathCatCatalogo     	  = this.URL_CATALOGOS + '/cat_catalogo';  
	URL_CONDICION_ESPECIAL_DATO   = this.URL_CATALOGOS + '/condiciones';
    URL_ESTADO_DATO 			  = this.URL_CATALOGOS + '/estado_dato';	
  
    CONSTANTES: Constantes = new Constantes;

    URL_SESSION_RTU = 'https://b5rmsdzfv5.execute-api.us-east-1.amazonaws.com/desarrollo/sesionrtu';
    URL_AWS_PINPOINT = 'http://pinpoint.us-east-1.amazonaws.com/v1/phone/number/verify/';

    URL_VALIDA_EMAIL = this.BASE_API_SAT + '/solicitudesagenciavirtual/solicitudesAgenciaVirtual';
    URL_CONDICION_ESPECIAL = 'http://microserviciosrtu.getsandbox.com';
    URL_DATO = this.URL_CATALOGOS;
    URL_AFILIACION = this.URL_RTU;
    URL_CONSULTA_BANCARIO_DECLARACIONES = 'https://prefarm3.sat.gob.gt/consultas-bancario-ws/rest/privado/consulta/consultarDeclaracionesIVA';
    URL_CREA_AV = 'https://prefarm3.sat.go/privado/consultas_oid_ws/creaAV';
    URL_FACTURAS = this.URL_RTU;
    URL_VEHICULOS = this.URL_RTU + '/vehiculos-Asociados';
    URL_DECLARACIONES = 'http://apdesatom03:38081/cancelacion-establecimiento-ws/rest/privado/consulta/consultarDeclaracionesPosteriores';
    URL_CATALOGO_ESTADO = this.URL_CATALOGOS + '/cat_dato_by_catalogo/58';
    URL_CATALOGO_CLASIFICACION = this.URL_CATALOGOS + '/cat_dato_by_catalogo/' + this.CONSTANTES.CODIGO_CAT_CLASIFICACION_ESTABLECIMIENTO;
    URL_CATALOGO_TIPO_ESTABLECIMIENTO = this.URL_CATALOGOS + '/cat_dato_by_catalogo/' + this.CONSTANTES.CODIGO_CAT_TIPO_ESTABLECIMIENTO;
    URL_DECLARACIONES_POSTERIORES = this.URL_RTU + '/consultas/Declaraciones-posteriores';
    URL_RETENCIONES_IVA = this.URL_RTU + '/consultas/retenciones-IVA';
    URL_DECLARACIONES_CERO = this.URL_RTU + '/consultas/declaraciones-cero';
    URL_OMISIONES = this.URL_RTU + '/consultas/consulta-omisiones';
    URL_PLAN_OPERATIVO = this.URL_RTU + '/consultas/consultar-Plan-Operativo';
    URL_CONVENIOS = this.URL_RTU + '/consultas/consulta-convenios';
    URL_LIBROS = this.URL_RTU + '/consultas/consulta-libros';
    URL_EXPEDIENTES = this.URL_RTU + '/consultas/consulta-expedientes';
    URL_REPRESENTANTE_LEGAL = this.URL_RTU + '/representantes';
    URL_TIPO_CONTRIBUYENTE = this.URL_RTU + '/contribuyente/codtipo';
    URL_DIRECCION_VIGENTE = this.URL_RTU + '/direcciones/establecimiento/vigente';

    NIT: string = '91326214';

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            "Accept": "*/*"
        })
    };

    servicios: any;

    constructor(private http: HttpClient) {
        console.log("Ingresa a Servicios.");
    }
    /**
     * Metodo que realiza un get a un microservicio haciendo uso de un solo parametro 
     * enviando el valor en la url ejemplo http://host.microservicio/metodoGet/parametro
     * @param pUrl url del microservicio ejemplo http://host.microservicio/metodoGet
     * @param pNombreServicio nombre del servicio a llamar. Puede ser null
     * @param pParametro parametro que se envia al servicio este puede ser null si no se envia parametro
     */
    getData(pUrl: string, pNombreServicio: string | null, pParametro: string | null, pJSON: boolean): Observable<any> {

        if (pNombreServicio == null) {
            if (pParametro === null) {
                console.log(`SERVICE: ${pUrl}`);
                if (!pJSON) {
                    return this.http.get(`${pUrl}`).map(res => res);
                }
                else {
                    return this.http.get(`${pUrl}`, this.httpOptions).map(res => res);
                }
            } else {
                console.log(`SERVICE: ${pUrl}/${pParametro}`);
                if (!pJSON) {
                    return this.http.get(`${pUrl}/${pParametro}`).map(res => res);
                }
                else {
                    return this.http.get(`${pUrl}/${pParametro}`, this.httpOptions).map(res => res);
                }
            }
        } else {
            if (pParametro === null) {
                console.log(`SERVICE: ${pUrl}/${pNombreServicio}`)
                if (!pJSON) {
                    return this.http.get(`${pUrl}/${pNombreServicio}`).map(res => res);
                }
                else {
                    return this.http.get(`${pUrl}/${pNombreServicio}`, this.httpOptions).map(res => res);
                }

            } else {
                console.log(`SERVICE: ${pUrl}/${pNombreServicio}/${pParametro}`)
                if (!pJSON) {
                    return this.http.get(`${pUrl}/${pNombreServicio}/${pParametro}`).map(res => res);
                }
                else {
                    return this.http.get(`${pUrl}/${pNombreServicio}/${pParametro}`, this.httpOptions).map(res => res);
                }
            }
        }
    }


    /**
     * Metodo que realiza un get a un microservicio enviando en el url el nombre del parámetro
     * y el valor del parametro en la url ejempo http://host.microservicio/metodoGet?NombreParametro=ValorParametro
     * @param pUrl url del microservicio http://host.microservicio/metodoGet
     * @param pNombreParametro nombre del parametro a enviar
     * @param pParametro parametro a enviar
     */
    public getDataParametro(pUrl: string, pNombreParametro: string, pParametro: string) {
        console.log(`servicio:  ${pUrl}?${pNombreParametro}=${pParametro}`);
        return this.http.get(`${pUrl}?${pNombreParametro}=${pParametro}`);

    }

    /**
   * Metodo que realiza un get a un microservicio enviando en el url el nombre del parámetro
   * y el valor del parametro en la url ejemplo 
   * http://host.microservicio/metodoGet?NombreParametro=ValorParametro, retornando2
   * @param pUrl url del microservicio http://host.microservicio/metodoGet
   * @param pNombreParametro nombre del parametro a enviar
   * @param pParametro parametro a enviar
   */
    public getDataParametroJson(pUrl: string, pNombreParametro: string, pParametro: string) {
        console.log(`servicio:  ${pUrl}?${pNombreParametro}=${pParametro}`);
        return this.http.get(`${pUrl}?${pNombreParametro}=${pParametro}`, this.httpOptions);

    }

    /**
     * 
     * @param pUrl url del microservicio a consumir ejemplo http://host.microservicio/metodoPost
     * @param pParametro parametro del metodo post este puede ser null si no lleva parametro
     * @param pBody body del servicio con la estructura de la interface servicioBody obtiene la variable 
     *              body de la interface que debe contener la estructura de envio del microservicio si se
     *              necesita agregar una nueva estructura se debe agregar en la interface
     * @param pJSON true cuando el metodo tiene content-type application-json, false si no tiene content-type
     */
    public postData(pUrl: string, pParametro: string | null, pBody: servicioBody, pJSON: boolean) {
        let body = null;
        if (pBody)
            body = JSON.stringify(pBody.body);
        console.log(body);

        if (pBody === null && pParametro != null) {
            let bodyJSON = JSON.parse(pParametro);
            body = JSON.stringify(bodyJSON);
            if (!pJSON) {
                return this.http.post(pUrl, body).map(
                    res => {
                        return res;
                    }
                )
            } else {
                console.log(body);
                return this.http.post(pUrl, body, this.httpOptions).map(
                    res => {
                        return res;
                    }
                )
            }
        } else {
            if (pParametro === null) {
                if (!pJSON) {
                    return this.http.post(pUrl, body).map(
                        res => {
                            return res;
                        }
                    )
                } else {
                    return this.http.post(pUrl, body, this.httpOptions).map(
                        res => {
                            return res;
                        }
                    )
                }

            } else {
                if (!pJSON) {
                    return this.http.post(`${pUrl}/${pParametro}`, body).map(
                        res => {
                            return res;
                        }
                    )
                } else {
                    return this.http.post(`${pUrl}/${pParametro}`, body, this.httpOptions).map(
                        res => {
                            return res;
                        }
                    )
                }
            }
        }
    }


    public postCredenciales(pUrl: string, pCredenciales: Credencial, pBody: ParametrosConsulta) {

        console.log("postCredenciales");
        let body = null;

        body = JSON.stringify(pBody);
        console.log(body);

        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                "Accept": "application/json",
                "Authorization": 'Basic ' + btoa(pCredenciales.user + ':' + pCredenciales.password)
            })
        };
        return this.http.post(`${pUrl}`, body, this.httpOptions).map(
            res => {
                return res;
            }
        )



    }
    /**
     * Metodo que realiza el patch de un microservicio 
     * @param pUrl url del microservicio y metodo patch ejemplo https://host.microservicio/metodopatch
     * @param pParametro parametro que recibe el micro servicio en el metodo patch
     * @param pBody body del servicio con la estructura de la interface servicioBody obtiene la variable 
     *              body de la interface que debe contener la estructura de envio del microservicio si se
     *              necesita agregar una nueva estructura se debe agregar en la interface
     */
    public patchData(pUrl: string, pParametro: string, pBody: servicioBody) {
        let body = JSON.stringify(pBody.body);
        if (pParametro === null) {
            return this.http.patch(`${pUrl}`, body, this.httpOptions).map(
                response => {
                    return response;
                },
                () => {
                    console.log("El patch se ejecutó sin error.");
                }
            )
        }
        else {
            return this.http.patch(`${pUrl}/${pParametro}`, body, this.httpOptions).map(
                response => {
                    return response;
                },
                () => {
                    console.log("El patch se ejecutó sin error.");
                }
            );
        }
    }


    public putData(pUrl: string, pParametro: string, pBody: servicioBody) {
        let body = null;
        if (pBody)
            body = JSON.stringify(pBody.body);
        if (pBody === null && pParametro != null) {
            let bodyJSON = JSON.parse(pParametro);
            body = JSON.stringify(bodyJSON);
            return this.http.put(`${pUrl}`, body, this.httpOptions).map(
                response => {
                    return response;
                },
                () => {
                    console.log("El put se ejecutó sin error.");
                }
            )

        } else {
            if (pParametro === null) {
                return this.http.put(`${pUrl}`, body, this.httpOptions).map(
                    response => {
                        return response;
                    },
                    () => {
                        console.log("El put se ejecutó sin error.");
                    }
                )
            }
            else {
                return this.http.put(`${pUrl}/${pParametro}`, body, this.httpOptions).map(
                    response => {
                        return response;
                    },
                    () => {
                        console.log("El put se ejecutó sin error.");
                    }
                );
            }
        }


    }

    /**
     * Metodo que realiza el post de los datos de la solicitud
     * @param data json de los datos de la solicitud
    */
    public postArchivo(archivo: File, servicio: string, parametro: string) {
        const formData: FormData = new FormData();
        formData.append('pDocumento', archivo, archivo.name);
        return this.http.post(`${this.URL_RECONOCIMIENTO}/${servicio}`, formData).map(
            res => {
                return res;
            },
            error => {
                console.log("Error al enviar el documento " + JSON.stringify(error));
            }
        )
    }

    /**
     * Metodo que obtiene el token de seguridad
     * @param captcha captcha
     */
    getToken(captcha: string): Observable<any> {
        console.log("getToken "+this.URL_TOKEN + captcha);
        return this.http.get(this.URL_TOKEN + captcha);
    }

    /**
     * Metodo que permite subir archivos al S3 de AWS
     * @param pUrl Url del microservicio de carga de archivos ejemplo: https://g7qmj1ebgf.execute-api.us-east-1.amazonaws.com/desarrollo/docinscriprtu
     * @param pNombreFolder nombre del folder en el S3 donde se va a guardar el documento
     * @param pArchivo Archivo que se va a guardar
     */
    putArchivoS3(pUrl: string, pNombreFolder: string, pArchivo: CargaArchivo) {
        console.log('pArchivo.type ' + pArchivo.tipoDocumento);
        console.log('pArchivo.nombre ' + pArchivo.nombre)
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': pArchivo.tipoDocumento
            })
        };
        return this.http.put(`${pUrl}/${pNombreFolder}/${pArchivo.nombre}`, pArchivo.documento, this.httpOptions);

    }


    /**
     * Método para obtener el archivo del S3 AWS
     * @param pUrl Url del microservicio de carga de archivos ejemplo: https://g7qmj1ebgf.execute-api.us-east-1.amazonaws.com/desarrollo/docinscriprtu
     * @param pNombreFolder nombre del folder en el S3 donde se encuentra el documento
     * @param pNombreArchivo nombre del archivo que se desea descargar
     */
    getArchivoS3(pUrl: string, pNombreFolder: string, pNombreArchivo: string) {
        console.log('pNombreArchivo ' + pNombreArchivo);
        console.log(`${pUrl}/${pNombreFolder}/${pNombreArchivo}`);
        return this.http.get(`${pUrl}/${pNombreFolder}/${pNombreArchivo}`, { responseType: 'blob' }
            // return this.http.get('https://picsum.photos/200/300/?random', { responseType: 'blob' }
        );
    }


    /**
    * Método para obtener el archivo desde el microservicio
    * @param pCodigo codigo de la imagen
    */
    public getArchivo(pCodigo: String) {

        console.log(`${this.URL_DOCUMENTOS}documento/${pCodigo}`);
        return this.http.get('http://10.99.1.138:48080/documentos/privado/documento/17', this.httpOptions);

    }

    /**
     * Metodo que elimina un documento de la S3 AWS
     * @param pUrl Url del microservicio de carga de archivos ejemplo: https://g7qmj1ebgf.execute-api.us-east-1.amazonaws.com/desarrollo/docinscriprtu
     * @param pNombreFolder nombre del folder en el S3 donde se se encuentra el documento
     * @param pNombreArchivo nombre del archivo que se desea eliminar
     */
    deleteArchivoS3(pUrl: string, pNombreFolder: string, pNombreArchivo: string) {
        console.log('pNombreArchivo ' + pNombreArchivo);
        console.log(`${pUrl}/${pNombreFolder}/${pNombreArchivo}`);
        return this.http.delete(`${pUrl}/${pNombreFolder}/${pNombreArchivo}`, { observe: 'response' }
        );
    }

    public getEstablecimientos(nit: string) {
        return this.http.get<any[]>(`${this.URL_ESTABLECIMIENTO}/${nit}`)
            .map(res => res);
    }

    public getEstadosEstablecimientos(): Observable<any[]> {
        return this.http.get<any[]>(this.URL_CATALOGO_ESTADO)
            .map(res => res);
    }

    public getActividadesCoE(): Observable<ActividadComerical[]> {
        return this.http.get<ActividadComerical[]>(this.URL_ACTIVIDAD_COMERCIAL)
            .map(res => res);
    }

    public getClasificacion(): Observable<any[]> {
        return this.http.get<any[]>(this.URL_CATALOGO_CLASIFICACION)
            .map(res => res);
    }

    public getTipoEstablecimiento(): Observable<any[]> {
        return this.http.get<any[]>(this.URL_CATALOGO_TIPO_ESTABLECIMIENTO)
            .map(res => res);
    }


    public obtenerNIT(): string {
        const nit  = prompt('Ingrese NIT para las pruebas', this.NIT);
        if (nit) {
            return nit;
        } else {
            alert('no ingreso ningun nit');
            return '';
        }
    }

    public getUltimaDeclaracion(fechaC): boolean {
        // console.log(`Validacion de la ultima declaracion ${fecha} fecha invalida ${fechaI}`);
        return false;
    }

    public getDeclaracionesIva (nit: string, fechaCancelacion: Date): Observable<any> {

        const param: any = { nit, fechaCancelacion, DECLA_POSTERIORES };
        return this.http.post<any>(this.URL_DECLARACIONES_POSTERIORES, param)
            .map(res => res);
    }

    public getDeclaracionesCero (nit: string): Observable<any> {
        const param = { nit };
        return this.http.post<any>(this.URL_DECLARACIONES_CERO, param)
            .map(res => res);
    }

    public getRetenciones (periodoDe: string, periodoHasta: string, nit: string): Observable<any> {
        const param = { periodoDe, periodoHasta, nit };
        return this.http.post<any>(this.URL_RETENCIONES_IVA, param)
            .map(res => res);
    }

    public getVehiculosAsociados (nit: string): Observable<any> {
        const param = { nit, VEHICULOS_ASOCIADOS };
        return this.http.post<any>(this.URL_VEHICULOS, param)
            .map(res => res);
    }

    public getOmisiones (nit: string): Observable<any> {
        const param = { nit };
        return this.http.post<any>(this.URL_OMISIONES, param)
            .map(res => res);
    }

    public getPlanOperativo (nit: string): Observable<any> {
        const param = { nit };
        return this.http.post<any>(this.URL_PLAN_OPERATIVO, param)
            .map(res => res);
    }

    public getConvenios (nit: string): Observable<any> {
        const param = { nit };
        return this.http.post<any>(this.URL_CONVENIOS, param)
            .map(res => res);
    }

    public getLibros (nit: string): Observable<any> {
        const param = { nit };
        return this.http.post<any>(this.URL_LIBROS, param)
            .map(res => res);
    }

    public getExpedientes (nit: string): Observable<any> {
        const param = { nit };
        return this.http.post<any>(this.URL_EXPEDIENTES, param)
            .map(res => res);
    }

    public getRepresentantesLegales (nit: string): Observable<any> {
        return this.http.get<any>(`${this.URL_REPRESENTANTE_LEGAL}/${nit}`)
            .map(res => res);
    }

    public getTipoContribuyente(nit: string): Observable<any> {
        return this.http.get<any>(`${this.URL_TIPO_CONTRIBUYENTE}/${nit}`)
            .map(res => res);
    }

    public handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
          // A client-side or network error occurred. Handle it accordingly.
          if (error.status === 200) {
            console.log('carga-archivo: sin error HttpErrorResponse');
          } else {
            console.error('carga-archivo: Ocurrio un error:', error.error.message);
          }

        } else {
          if (error.status === 200) {
            console.log('carga-archivo: sin error HttpErrorResponse');
          } else {
            console.error(
              'carga-archivo::Código de respuesta ' + error.status +
              ', body was: ' + error.error);
          }
        }
        return throwError(
          'carga-archivo: Algo malo paso, por favor intente mas tarde.');
    };

    public limpiarStepper(stepper: MatStepper): void {
        stepper.reset();
    }
    getinforcontrib(nit) {
        return this.http.get(`${this.URL_CONTRIBUYENTE_INDIVIDUAL}/${nit}`);
    }

}
