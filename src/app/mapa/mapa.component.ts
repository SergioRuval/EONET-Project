import { Component, OnInit } from '@angular/core';
import { EnoetService } from '../services/enoet.service';
import { WeatherstackService } from '../services/weatherstack.service';
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

  public name1:string = ""
  public temp1:string = ""
  public st1:string = ""
  public hum1:string = ""
  public city:string = ""
  public errorTemp: boolean = false

  constructor(private service: EnoetService, private http: HttpClient, private service1: WeatherstackService) {}


  ngOnInit(): void {
    this.mapa = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        zoom: 2,
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
      console.log(element);
      
      
      var fecha = new Date(element.geometry[0].date)
      var coordinates = { lat: element.geometry[0].coordinates[1], lng: element.geometry[0].coordinates[0]}
      var marcador = new google.maps.Marker({
        position: coordinates,
        map: this.mapa,
        title: element.title
      })

      marcador.addListener("click", () => {
        // this.service1.postTemperature(marcador.getPosition()?.lat(),marcador.getPosition()?.lng()).subscribe((res:any)=>{
        //   if(res.hasOwnProperty("error")){
        //     this.errorTemp = true
        //   }else{
        //     console.log(res);
            
        //     this.name1=res["location"]["name"];
        //     this.temp1=res["current"]["temperature"];
        //     this.st1=res["current"]["feelslike"];
        //     this.hum1=res["current"]["humidity"];
        //     this.errorTemp = false
        //   }
        // });
        
        console.log(fecha.toUTCString());
        
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

  buscarClima(){
    console.log(this.city)
    let lat= this.eventos.events[0].geometry[0].coordinates[1]
    let lon= this.eventos.events[0].geometry[0].coordinates[0]
    this.service1.postTemperature(lat,lon).subscribe((res:any)=>{
      console.log(res);
      this.name1=res["location"]["name"];
      this.temp1=res["current"]["temperature"];
      this.st1=res["current"]["feelslike"];
      this.hum1=res["current"]["humidity"];
    });
  }

}
