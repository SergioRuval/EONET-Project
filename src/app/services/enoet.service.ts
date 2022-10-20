import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EnoetService {

  constructor(private http: HttpClient) { }

  private url = 'http://localhost:8080/events';

  getEvents(){
    return this.http.get(this.url);
  }
}
