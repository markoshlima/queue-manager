import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginService } from 'src/app/services/login/login.service';
import { tap } from 'rxjs/internal/operators';
import { Router } from '@angular/router';

@Injectable()
export class InterceptorService implements HttpInterceptor {

  constructor(private loginService: LoginService,
              private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.loginService.getAuthToken();
    let newHeaders = req.headers;
    if (token) {
       newHeaders = newHeaders.append('Authorization', token);
    }
    const authReq = req.clone({headers: newHeaders});
    return next.handle(authReq)
    .pipe(
        tap(event => {
          if (event instanceof HttpResponse) {}
        }, error => {
          if(error.status == 0 || error.status == 401){
            if(this.router.url !== '/login'){
              this.loginService.logout();
              window.location.href = "/login"; 
            }
            
          }
        })
      )
  }
}