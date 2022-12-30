import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnoetService } from '../services/enoet.service';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.css']
})
export class ResourcesComponent implements OnInit {
  categorias: any = []
  
  constructor(private service: EnoetService,private http: HttpClient) { }

  ngOnInit(): void {
    this.service.getCategories()
      .subscribe(response => {
        var objeto: any = response
        this.categorias = objeto["categories"]  
        console.log(this.categorias);
      })
      
  }

}
