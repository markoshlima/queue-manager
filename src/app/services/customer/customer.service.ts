import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/internal/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  HOST = environment.host_api;
  
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  register(data) : Observable<any>{
    return this.http.post(this.HOST+'/v1/customer', data, this.httpOptions);
  }

  validate(data) : Observable<any>{
    return this.http.post(this.HOST+'/v1/customer/validate', data, this.httpOptions);
  }

  getCustomer(){
    return this.http.get(this.HOST+'/v1/customer', this.httpOptions);
  }

  setCustomer(data){
    localStorage.setItem('username', data.name); 
    localStorage.setItem('useremail', data.email); 
  }

  getCustomerName(){
    return localStorage.getItem('username');
  }

  getCustomerEmail(){
    return localStorage.getItem('useremail');
  }

}
