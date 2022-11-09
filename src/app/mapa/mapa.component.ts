import { Component, OnInit } from '@angular/core';
import { EnoetService } from '../services/enoet.service';
import {HttpClientModule} from '@angular/common/http';
import {HttpClient} from '@angular/common/http'
import { query } from '@angular/animations';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit {

  eventos: any = [];
  coordenadas: any;
  mapa: google.maps.Map | undefined
  marcadores: google.maps.Marker[] = []

  fechaInicio: any
  fechaFin: any

  constructor(private service: EnoetService, private http: HttpClient) {}


  ngOnInit(): void {
    this.mapa = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        zoom: 4,
        center: {
            lat: 24,
            lng: 12
        }
      }
    )

    this.service.getEvents()
      .subscribe(response => {
        this.eventos = response;
        this.actualizarMarcadores()
      });
  }

  obtenerEventos(){
    var queryEventos: String = ""

    if(this.fechaInicio != null && this.fechaFin != null){
      queryEventos += `start=${this.fechaInicio}&end=${this.fechaFin}`
      
    }

    this.service.getEventsByQuery(queryEventos)
      .subscribe(response => {
        this.eventos = response
        this.actualizarMarcadores()
    })

  }

  actualizarMarcadores(){
    this.limpiarMarcadores()
    this.eventos.events.forEach((element: any) => {

      var coordinates = { lat: element.geometry[0].coordinates[1], lng: element.geometry[0].coordinates[0]}
      var marcador = new google.maps.Marker({
        position: coordinates,
        map: this.mapa,
        title: element.title
      })

      this.marcadores.push(marcador)
      
    });
  }

  limpiarMarcadores(){
    for(let i = 0; i < this.marcadores.length; i++){
      this.marcadores[i].setMap(null)
    }
    this.marcadores = []
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
