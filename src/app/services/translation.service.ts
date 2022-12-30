import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  constructor(private http: HttpClient) { }

  private url = 'http://localhost:8080/traducir';

  postTranslation(texto: string){
    let cuerpo={
      'texto': texto
    }
    return this.http.post(this.url,cuerpo);
  }
  
}
