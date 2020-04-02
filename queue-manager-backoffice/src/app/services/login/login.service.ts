import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/internal/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  HOST = environment.host_api;
  
  constructor(private http: HttpClient) { }

  login(data) : Observable<any>{
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':'application/json',
        'username':data.username,
        'password':data.password
      })
    };
    return this.http.post(this.HOST+'/v1/login', {}, httpOptions);
  }

  logout(){
    localStorage.clear();
  }

  setAuthToken(token, type){
    localStorage.setItem('token', token); 
    localStorage.setItem('type', type); 
  }

  getAuthToken(){
    let token = localStorage.getItem('token');
    let type = localStorage.getItem('type');
    if(token){
      return type + ' ' + token;
    }else{
      return false;
    }
  }

}
