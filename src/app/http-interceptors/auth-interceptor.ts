import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs-compat/add/operator/catch';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let authToken = window.sessionStorage.getItem('accessToken');
    let authReq = req;
    if (authToken) {

      authReq = req.clone({
        headers: req.headers.append('Authorization', 'Bearer ' + authToken)
      });
    }
    return next.handle(authReq).catch((err: any) =>
        {
        //  console.log(authReq)
          if (err instanceof HttpErrorResponse)
          {
            
            if (err.status===200)
            {//aalruanoe 02.11.18 se agrega para que indique que el error 200 no es erro
              console.log("no es error es estatus 200 ");
              return Observable.throw(err);
            }
            if (err.status===404)
            {
            
              return Observable.throw(err);
              
            }
            if (err.status===401)
            {
            //  sessionStorage.removeItem('accessToken');
           // this.router.navigate(['/form-recaptcha']);
              return Observable.throw(err);
            }
          }
        }
      );
    }
}
