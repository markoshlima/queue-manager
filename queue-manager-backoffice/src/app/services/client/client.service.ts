import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/internal/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  HOST = environment.host_api;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  save(data) : Observable<any>{
    return this.http.post(this.HOST+'/v1/client', data, this.httpOptions);
  }

  remove(id){
    return this.http.delete(this.HOST+'/v1/client/'+id, this.httpOptions);
  }

  getClientQueue(id): Observable<any>{
    return this.http.get(this.HOST+'/v1/client/'+id+'/queue', this.httpOptions);
  }

}
