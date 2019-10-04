import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenOauth2 } from './../shared/models/tokenoauth2.model';
import { Servicios } from 'app/servicios/servicios.service';

@Component({
  selector: 'app-form-recaptcha',
  templateUrl: './form-recaptcha.component.html',
  styleUrls: ['./form-recaptcha.component.scss']
})
export class FormRecaptchaComponent implements OnInit {

  token: TokenOauth2;
  //aalruanoe  30.10.18 se modifica porcentralizador de servicios
  constructor(private data: Servicios, private router: Router) {}

  public resolved(captchaResponse: string) {   
    
    this.data.getToken(captchaResponse).subscribe(
      data => {
        
        this.token = data;
        console.log(this.token);
      window.sessionStorage.removeItem('accessToken');
      window.sessionStorage.setItem('accessToken',this.token.access_token);
        
      this.router.navigate([sessionStorage.getItem('pageRedirect')]);
    },
    dataerror=>{
      console.log("Error al consultar el Token "+JSON.stringify(dataerror));      
      this.router.navigate([sessionStorage.getItem('pageRedirect')]);
      

    },
    ()=>{
      console.log("Get Token Finalizado");
      this.router.navigate([sessionStorage.getItem('pageRedirect')]);
    }
   );
  }

  ngOnInit() {
  }

}
