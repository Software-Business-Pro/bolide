import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import { Machine } from "../../models/machine";
import { MachineService } from "../../services/machine.service";
import { ActivatedRoute, Router } from "@angular/router";
import { LienImage } from '../../models/lienImage';
import { Planning } from '../../models/planning';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { Subject } from 'rxjs';
import { CalendarView, CalendarEventAction, CalendarEvent, CalendarEventTimesChangedEvent } from 'angular-calendar';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

class ImageSnippet {
  pending: boolean = false;
  status: string = 'init';

  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'app-single-machine',
  templateUrl: './single-machine.component.html',
  styleUrls: ['./single-machine.component.scss']
})
export class SingleMachineComponent implements OnInit {

  machine: Machine;
  chargement: boolean = false;
  selectedFile: ImageSnippet;
  lienImages: Array<LienImage>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  refresh: Subject<any> = new Subject();

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = false;


  constructor(private machineService: MachineService,
              private activatedRoute: ActivatedRoute,
              private router: Router) { }

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
    const id = this.activatedRoute.snapshot.params.id;
    this.machine = this.machineService.getOneMachine(id);
    this.machineService.getVehiculePlanningDB(this.machine.matRef).then((result: Planning[]) =>{
      for (let plan of result) {
        let cE: CalendarEvent = {
          start: addHours(new Date(Date.parse(plan.date)), Number(plan.heureDebutAM.slice(0, 2))+ Number(plan.heureDebutAM.slice(-2))/60),
          end: plan.heureDebut == 'N/A' ? addHours(new Date(Date.parse(plan.date)), Number(plan.heureFinPM.slice(0, 2))+ Number(plan.heureFinPM.slice(-2))/60):
          addHours(new Date(Date.parse(plan.date)), Number(plan.heureFinAM.slice(0, 2))+ Number(plan.heureFinAM.slice(-2))/60),
          title: 'Reservation, ' + (plan.heureDebut == 'N/A' ? 
          plan.heureDebutAM + " a " + plan.heureFinAM + " / " + plan.heureDebutPM + " a " + plan.heureFinPM
          : plan.heureDebutAM + " a " + plan.heureFinAM)
          + " durée: " + plan.dureeJournee + "h",
          color: colors.red,
        };
        this.events.push(cE);
      }
      this.refresh.next();
    });
    this.machineService.getVehiculeImageLinksDB(this.machine.matRef).then((result: LienImage[]) =>{
      this.lienImages = result;
    });    
    this.chargement = false;
    if(this.machine === null || this.machine === undefined) {
      this.router.navigate(['']);
    }
  }

  //GESTION IMAGE UPLOAD
  private onSuccess() {
    this.selectedFile.pending = false;
    this.selectedFile.status = 'ok';
    this.machineService.getVehiculeImageLinksDB(this.machine.matRef).then((result: LienImage[]) =>{
      this.lienImages = result;
    });
  }

  private onError() {
    this.selectedFile.pending = false;
    this.selectedFile.status = 'fail';
    this.selectedFile.src = '';
  }

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new ImageSnippet(event.target.result, file);
      this.selectedFile.pending = true;
      this.machineService.uploadImage(this.selectedFile.file, this.machine.matRef).subscribe(
        (res) => {
          this.onSuccess();
        },
        (err) => {
          this.onError();
        })
    });
    reader.readAsDataURL(file);
  }

  //GESTION CALENDRIER

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    /*this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });*/
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

}
