import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (sessionStorage.getItem('accessToken')==null)
    {
      sessionStorage.setItem('pageRedirect',state.url.split('?')[0]);
      sessionStorage.setItem('guard','Authorization');
      var tempUrl=window.location.href.split('?')[0];
      window.location.href='https://desafarm3.sat.gob.gt/oauth2/auth?client_id=admin&redirect_uri='+tempUrl.substr(0,tempUrl.lastIndexOf('/'))+'/callback'+'&response_type=code&scope=hydra+offline+openid&state=tihgqgesqxgqlbocohincoke&nonce=tihgqgesqxgqlbocohincoke';
      return false;
    }
    else
    {
      return true;
    }
  }
}
