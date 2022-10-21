import { Component, OnInit } from '@angular/core';
import { EnoetService } from '../services/enoet.service';
import {HttpClientModule} from '@angular/common/http';
import {HttpClient} from '@angular/common/http'

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit {

  eventos: any = [];
  coordenadas: any;

  constructor(private service: EnoetService, private http: HttpClient) { }

  ngOnInit(): void {
    this.service.getEvents()
      .subscribe(response => {
        this.eventos = response;
        console.log(this.eventos);
      });
  }

  display: any;
    center: google.maps.LatLngLiteral = {
        lat: 24,
        lng: 12
    };
    zoom = 4;
    moveMap(event: google.maps.MapMouseEvent) {
        if (event.latLng != null) this.center = (event.latLng.toJSON());
    }
    move(event: google.maps.MapMouseEvent) {
        if (event.latLng != null) this.display = event.latLng.toJSON();
    }

  obtenerCoordenadas(){
    
  }
  public name1:string = ""
  public temp1:string = ""
  public st1:string = ""
  public hum1:string = ""
  public city:string = ""
  buscarClima(){
    console.log(this.city)
    const url='http://api.weatherstack.com/current?access_key=540219d6872b08bbbdad73466a7cd114&query=Aguascalientes';
    this.http.get(url).subscribe((res:any)=>{
      console.log(res)
      console.log(res["location"]["name"]);
      this.name1=res["location"]["name"];
      this.temp1=res["current"]["temperature"];
      this.st1=res["current"]["feelslike"];
      this.hum1=res["current"]["humidity"];
    });
  }
}
