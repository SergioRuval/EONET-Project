import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnoetService } from '../services/enoet.service';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.css']
})
export class ResourcesComponent implements OnInit {
  categorias: any = []
  
  constructor(private service: EnoetService,private http: HttpClient, private translationService: TranslationService) { }

  ngOnInit(): void {
    this.service.getCategories()
      .subscribe(response => {
        var objeto: any = response
        this.categorias = objeto["categories"]  

        var categorias: [] = objeto["categories"] 
        var categoriasTraducidas: any = []

        categorias.forEach((categoria, i) => {
          var categoriaTraducida = {
            'id': categoria["id"],
            'title': "",
            'description': ""
          }
          this.translationService.postTranslation(categoria["title"])
            .subscribe(response => {
              var traduccion: any = response
              categoriaTraducida.title = traduccion["traduccion"]
              
            })
          this.translationService.postTranslation(categoria["description"])
          .subscribe(response => {
            var traduccion: any = response
            categoriaTraducida.description = traduccion["traduccion"]
          })

            categoriasTraducidas.push(categoriaTraducida)  
        });

        // this.categorias = objeto["categories"]  
        this.categorias = categoriasTraducidas

        console.log(this.categorias);
      })
      
  }

}
