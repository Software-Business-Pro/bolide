import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MachineService } from "../../../machines/services/machine.service";
import { Machine } from "../../../machines/models/machine";
import {ThemePalette} from '@angular/material/core';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  private map;
  machines: Machine[] = [];
  chargement: boolean = false;

  constructor(private machineService: MachineService) { }

  ngOnInit(): void {
    this.chargement = true;
    this.machineService.loadMachines(1439, 7814607, 696)
      .then((result) => {
        this.machines = result;
        this.initMap();
      })
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [46.9, 2],
      zoom: 7
    })

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    
    for(let machine of this.machines) {
      L.marker([machine.dLocLati, machine.dLocLongi])
      .bindPopup('Vehicule : ' + machine.matLibelle + '<br>Ref : '+ machine.matRef +
      '<br>Position : '+ machine.ville + ' - ' + machine.codePostal +
      '<br><a href="/machine/' + machine.iVehId +'">Detail</a>')
      .addTo(this.map);
    }

    tiles.addTo(this.map);    
    this.chargement = false;
  }
}
