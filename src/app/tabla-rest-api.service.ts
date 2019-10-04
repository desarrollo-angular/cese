import { Injectable } from '@angular/core';
import { HttpClient } from  '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TablaRestApiService {

	API_URL  =  'https://ec2-13-58-61-170.us-east-2.compute.amazonaws.com:8443/demo3/public';
	VEHICULO_URL  =  'https://ec2-13-58-61-170.us-east-2.compute.amazonaws.com:8443/demo3/public';

	/*API_URL  =  '/demo3/public';
	VEHICULO_URL  =  '/demo3/public';*/
	
	constructor(private  httpClient:  HttpClient) {}
	public getContacts(){
		return  this.httpClient.get(`${this.API_URL}/users`);
	}
	
	
	public getVehiculo(anioAlza : String, identificador:String, digitoVerificador:String){
		return  this.httpClient.get(`${this.VEHICULO_URL}/vehiculo?anioAlza=${anioAlza}&identificador=${identificador}&digitoVerificador=${digitoVerificador}`);
	}
}
