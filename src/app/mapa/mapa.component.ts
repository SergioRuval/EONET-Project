import { Component, OnInit } from '@angular/core';
import { EnoetService } from '../services/enoet.service';
import { WeatherstackService } from '../services/weatherstack.service';
import {HttpClientModule} from '@angular/common/http';
import {HttpClient} from '@angular/common/http'
import { query } from '@angular/animations';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit {

  categorias: any = []

  eventos: any = [];
  coordenadas: any;
  mapa: google.maps.Map | undefined
  marcadores: google.maps.Marker[] = []

  fechaInicio: any
  fechaFin: any
  categoria: any

  public name1:string = ""
  public temp1:string = ""
  public st1:string = ""
  public hum1:string = ""
  public city:string = ""
  public fechae: string = ""
  public errorTemp: boolean = false
  public infoWindowAnt: any=null

  constructor(private service: EnoetService, private http: HttpClient, private service1: WeatherstackService, private translationService: TranslationService) {}


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

    this.service.getCategories()
      .subscribe(response => {
        var objeto: any = response

        var categorias: [] = objeto["categories"] 
        var categoriasTraducidas: any = []

        categorias.forEach((categoria, i) => {
          this.translationService.postTranslation(categoria["title"])
            .subscribe(response => {
              var traduccion: any = response
              console.log("Traducido " + traduccion["traduccion"]);
              var categoriaTraducida = {
                'id': categoria["id"],
                'title': traduccion["traduccion"]
              }
              categoriasTraducidas.push(categoriaTraducida)
            })
        });

        this.categorias = categoriasTraducidas

        // this.categorias = objeto["categories"]  
        
      })

    
  }

  obtenerEventos(){
    var queryEventos: String = ""
    
    if(this.categoria != "0"){
      queryEventos += `category=${this.categoria}&`
    }

    console.log(this.fechaInicio);
    

    if(this.fechaInicio != null && this.fechaFin != null){
      queryEventos += `start=${this.fechaInicio}&end=${this.fechaFin}&`
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
      // console.log(element);

      var titulo: string = element.title
      this.translationService.postTranslation(element.title)
        .subscribe(response => {
          var traduccion: any = response
          console.log("Traducido " + traduccion["traduccion"]);
          titulo = this.toTitleCase(traduccion["traduccion"]);
          var categoria = this.toTitleCase(this.buscarCategoria(element.categories[0].id))
          var fecha = new Date(element.geometry[0].date)
          var coordinates = { lat: element.geometry[0].coordinates[1], lng: element.geometry[0].coordinates[0]}
          
          var marcador = new google.maps.Marker({
            position: coordinates,
            map: this.mapa,
            title: titulo
          })

          console.log(categoria);
          

          marcador.addListener("click", () => {
            if(this.infoWindowAnt!=null){
              this.infoWindowAnt.close()
            }
            this.service1.postTemperature(marcador.getPosition()?.lat(),marcador.getPosition()?.lng()).subscribe((res:any)=>{
              var contentString:string
              if(res.hasOwnProperty("error")){
                this.errorTemp = true
                this.fechae=fecha.toUTCString();
                contentString =
                '<div id="content">' +
                '<div id="siteNotice">' +
                "</div>" +
                '<h4 id="firstHeading" class="firstHeading">'+titulo+'</h4>' +
                '<h6 id="firstHeading" class="firstHeading">'+this.fechae+'</h6>' +
                '<div id="bodyContent">' +
                "<p><b>Category: </b>"+categoria+"</p>" +
                "<p><b>No hay informaci??n disponible</b>"+"</p>" +
                "</div>" +
                "</div>";
              }else{
                console.log(res);
                
                this.name1=res["location"]["name"];
                this.temp1=res["current"]["temperature"];
                this.st1=res["current"]["feelslike"];
                this.hum1=res["current"]["humidity"];
                this.fechae=fecha.toUTCString();
                this.errorTemp = false
                var magnitud:string
                var unidad:string
                var lugar:string
                var temperatura:string
                var sensacion:string
                var humedad:string

                if(element.geometry[0].magnitudeValue==null){
                  magnitud=""
                  unidad= "No hay informaci??n disponible"

                }else{
                  magnitud=element.geometry[0].magnitudeValue
                  unidad=element.geometry[0].magnitudeUnit
                }
                if(this.name1==null){
                  lugar="No hay informaci??n disponible"

                }else{
                  lugar=this.name1;
                }
                if(this.temp1==null){
                  temperatura="No hay informaci??n disponible"

                }else{
                  temperatura=this.temp1;
                }
                if(this.st1==null){
                  sensacion="No hay informaci??n disponible"

                }else{
                  sensacion=this.st1;
                }
                if(this.hum1==null){
                  humedad="No hay informaci??n disponible"

                }else{
                  humedad=this.hum1;
                }
                contentString =
                '<div id="content">' +
                '<div id="siteNotice">' +
                "</div>" +
                '<h4 id="firstHeading" class="firstHeading">'+titulo+'</h4>' +
                '<h6 id="firstHeading" class="firstHeading">'+this.fechae+'</h6>' +
                '<div id="bodyContent">' +
                "<p><b>Categor??a: </b>"+categoria+"</p>" +
                "<p><b>Magnitud: </b>"+magnitud+" "+unidad+"</p>" +
                "<p><b>Lugar: </b>"+lugar+"</p>" +
                "<p><b>Temperatura: </b>"+temperatura+"</p>" +
                "<p><b>Sensaci??n t??rmica: </b>"+sensacion+"</p>" +
                "<p><b>Humedad: </b>"+humedad+"</p>" +
                "</div>" +
                "</div>";
            
              }
              const infowindow = new google.maps.InfoWindow({
                content: contentString,
                ariaLabel: element.title,
              });
              infowindow.open({
                anchor: marcador
              });
              infowindow.addListener('closeclick', ()=>{
                this.infoWindowAnt=null
            });
            this.infoWindowAnt=infowindow
            });
            
            // console.log(fecha.toUTCString());
            console.log(element.description);
            
          })

          this.marcadores.push(marcador)
        })
    });
  }

  limpiarMarcadores(){
    for(let i = 0; i < this.marcadores.length; i++){
      this.marcadores[i].setMap(null)
    }
    this.marcadores = []
  }

  // buscarClima(){
  //   console.log(this.city)
  //   let lat= this.eventos.events[0].geometry[0].coordinates[1]
  //   let lon= this.eventos.events[0].geometry[0].coordinates[0]
  //   this.service1.postTemperature(lat,lon).subscribe((res:any)=>{
  //     console.log(res);
  //     this.name1=res["location"]["name"];
  //     this.temp1=res["current"]["temperature"];
  //     this.st1=res["current"]["feelslike"];
  //     this.hum1=res["current"]["humidity"];
  //   });
  // }

  toTitleCase(str:string) {
    return str.replace(
      /\w\S*/g,
      (txt:string) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

  buscarCategoria(id: any){
    for(var i=0; i < this.categorias.length; i++){
      if(this.categorias[i]["id"] == id){
        return this.categorias[i]["title"]
      }
    }
  }

}
