import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WeatherstackService {

  constructor(private http: HttpClient) { }

  private url = 'http://localhost:8080/temperatura';

  postTemperature(lat:any,lon:any){
    let cuerpo={
      'lat':lat,
      'lon':lon
    }
    return this.http.post(this.url,cuerpo);
  }

  getEventsByQuery(query: String){
    var urlQuery = this.url + "?" + query
    return this.http.get(urlQuery);
  }

}
