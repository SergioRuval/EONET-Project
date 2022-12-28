import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EnoetService {

  constructor(private http: HttpClient) { }

  private urlEventos = 'http://localhost:8080/events';
  private urlCategorias = 'http://localhost:8080/categories';

  getEvents(){
    return this.http.get(this.urlEventos);
  }

  getCategories(){
    return this.http.get(this.urlCategorias)
  }

  getEventsByQuery(query: String){
    var urlQuery = this.urlEventos + "?" + query
    return this.http.get(urlQuery);
  }
}
