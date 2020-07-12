import { Component, OnInit } from '@angular/core';
import {MachineService} from "../../services/machine.service";
import {Machine} from "../../models/machine";

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
}
