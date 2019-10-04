import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class ApiProxyService {

	BASE_URL_APS          = environment.BASE_URL_APS + '/api';
	//BASE_URL_APS = 'http://localhost:8888/api';
	//BASE_URL_APS = 'https://alfresco.desa.sat.gob.gt/api';
	URL_SUBIR_ARCHIVO = `${this.BASE_URL_APS}/update/file-instance`;
	NAME_APP = 'APP_CanEst';
	files: FileList = null;

	constructor(private http: HttpClient) { }

	/**
	 * cra un string de url para los metodos de apirest
	 * @param path 
	 * @returns URL 
	 */
	createUrl(path) { 
		return `${this.BASE_URL_APS}/${path}`;
	}

	/**
     * metodo para iniciar un proceso enviando el nombre clave de la app definido en BaseController.java
     * @param varialbesRequest variables a instanciar en el inicio del flujo
     * @return Observable JSON con processInstanceId y variables instanciadas que retorna el aps
     */
	iniciarProceso(variables: Object): Observable<any> {
		
		if (!variables) {
			variables = {};
		}
		return this.http.post<Object>(this.createUrl('startprocess/' + this.NAME_APP), variables).map(res => res);
	}

    /**
     * api res para obtener la tarea actual
     * @author cesalgue
     * @param processInstanceId es el id de la instancia 
     * @return taskid es el id de la tarea encriptado
     * @return Observable Json de detalle de el formulario
     */
	getTarea(processInstanceId: String): Observable<any> {
		if(processInstanceId === '') {
			alert('no hay numero de instancia')
		}
		return this.http.get<any>(this.createUrl(`update/next-tasks/${processInstanceId}`))
			.map(res => res);
	}
	
    /**
     * api res para cambiar de tasks por formulario enviando action
     * @author cesalgue
     * @param variables variables del formulario a almacenar
     * @param taskid id de la tarea a guardar
     * @param outcome accion (botones del formulario)
     * @return Observable mensaje de exito
     */
	siguienteTarea(variables: Object, taskid: String, outcome: String = 'default'): Observable<any> {
		if (!taskid) {
			alert('taskid invalido');
			return;
		}
		if (!variables) {
			variables = {};
		}
		return this.http.get<any>(this.createUrl(`update/next-tasks/${taskid}`), variables)
			.map(res => res);
	}

    /**
     * api res para obtener las variables de una instancia
     * @author cesalgue
     * @param processInstanceId es el id de la instancia 
     * @return Observable JSONarray de variables
     */
	getVariables(processInstanceId: String): Observable<any> {
		return this.http.get(this.createUrl(`update/variables/${processInstanceId}`))
			.map(res => res);
	}

	public ejecutarTarea(taskId: String, param: Object): Observable<any> {
		return this.http.post<any>(`${this.createUrl('update/tasks-forms')}/${taskId}`, param)
			.map(res => res);
	}

	public subirDocAps(processId): Observable<any> {

        const formData = new FormData();
        formData.append('file', this.files[this.files.length - 1], this.files[this.files.length - 1].name)

        return this.http.post<any>(`${this.URL_SUBIR_ARCHIVO}/${processId}`, formData)
            .map(res => res);
    }

}
