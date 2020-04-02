import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/internal/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QueueService {

  HOST = environment.host_api;
  
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  getAllQueue() : Observable<any>{
    return this.http.get(this.HOST+'/v1/queue', this.httpOptions);
  }

  save(data){
    return this.http.post(this.HOST+'/v1/queue', data, this.httpOptions);
  }

  getQueue(id){
    return this.http.get(this.HOST+'/v1/queue/'+id, this.httpOptions);
  }

  getClients(id){
    return this.http.get(this.HOST+'/v1/queue/'+id+'/client', this.httpOptions);
  }

}

