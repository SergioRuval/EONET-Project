import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapaComponent } from './mapa/mapa.component';
import { AboutComponent } from './about/about.component';
import { ResourcesComponent } from './resources/resources.component';

const routes: Routes = [
  { path: '', component: MapaComponent },
  {path: 'about', component: AboutComponent},
  { path: 'resources', component: ResourcesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
