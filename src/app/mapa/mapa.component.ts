import { Component, OnInit } from '@angular/core';
import { EnoetService } from '../services/enoet.service';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit {

  eventos: any = [];
  coordenadas: any;

  constructor(private service: EnoetService) { }

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

}
