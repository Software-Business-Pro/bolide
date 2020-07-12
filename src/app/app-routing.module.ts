import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MapComponent} from "./map/components/map/map.component";
import {MachinesViewComponent} from "./machines/components/machines-view/machines-view.component";
import {SingleMachineComponent} from "./machines/components/single-machine/single-machine.component";


const routes: Routes = [
  {path: 'map', component: MapComponent},
  {path: 'machines', component: MachinesViewComponent},
  {path: 'machine/:id', component: SingleMachineComponent},
  {path: '', pathMatch: 'full', redirectTo: 'map'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
