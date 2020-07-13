import { Component, OnInit } from '@angular/core';
import {MachineService} from "../../services/machine.service";
import {Machine} from "../../models/machine";
import { element } from 'protractor';

@Component({
  selector: 'app-machines-view',
  templateUrl: './machines-view.component.html',
  styleUrls: ['./machines-view.component.scss']
})
export class MachinesViewComponent implements OnInit {

  machines: Machine[] = [];
  chargement: boolean = false;

  constructor(private machineService: MachineService) { }

  ngOnInit(): void {
    this.chargement = true;
    if (this.machineService.GetMachines().length == 0)
      this.machineService.loadMachines(1439, 7814607, 696)
      .then((result) => {
        this.initData();
      });
    else
      this.initData();
  }

  initData(): void {
    this.machines = this.machineService.GetMachines();
    this.chargement = false;
  }

  filter() {
    var input, filter, type;
    input = document.getElementById("myInput");
    type = document.querySelector('input[name="dispo"]:checked').getAttribute("value");
    filter = input.value.toUpperCase();
    this.machines = this.machineService.GetMachines()
    .filter(ma => ma.matLibelle.toUpperCase().indexOf(filter) > -1 || filter == "");
    if (type != "tout")
      this.machines = this.machines.filter(elem => elem.isDisponible == (type == "disp"));
  }
}
