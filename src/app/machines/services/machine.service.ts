import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Machine} from "../models/machine";
import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MachineService {

  private URL = 'https://cors-anywhere.herokuapp.com/http://webservices.hermesapps.com/ws_connect.asmx';
  machinestemp: Array<Machine>;
  machines: Machine[] = [];

  constructor(private http: HttpClient) { }

  getOneMachine(id) {
    return this.machines.find(element => element.iVehId == id);
  }

  GetMachines() {
    return this.machines;
  }

  private PrepareData(xml: string) {
    xml = xml.substring(267, xml.length - 50);
    let result = parseStringPromise(xml);
    for (let obj of result.__zone_symbol__value.GetVehiclesResult.CNTVehicle)
    {
      var m = this.machinestemp.find(element => element.matRef == obj.sName[0]);
      if (m) {
        m.ville = obj.sLocLocality[0] == "" ? "Ville inconnue": obj.sLocLocality[0];
        m.codePostal = obj.sLocZipCode[0] == "" ? "Code Postal inconnue": obj.sLocZipCode[0];
        m.dLocLati = obj.dLocLati[0];
        m.dLocLongi = obj.dLocLongi[0];
        m.iVehId = obj.iVehId[0];
        this.machines.push(m);
      }
    }
    return this.machines;
  }

  async loadMachines(iUserId, iSessionId, iAccountId) {
    this.machinestemp = await this.getVehiclesDB()
    
    let xmls = '<?xml version="1.0" encoding="utf-8"?>\
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
      <soap:Body>\
        <GetVehicles xmlns="http://tempuri.org/">\
          <_session>\
            <iUserId>'+iUserId+'</iUserId>\
            <iSessionId>'+iSessionId+'</iSessionId>\
            <iAccountId>'+iAccountId+'</iAccountId>\
          </_session>\
        </GetVehicles>\
      </soap:Body>\
    </soap:Envelope>';

    var res = await axios.post(this.URL,
      xmls,
      {headers:
          {
            'Content-Type': 'text/xml; charset=utf-8',
            'SOAPAction': 'http://tempuri.org/GetVehicles'
          }
      })
    return this.PrepareData(res.data);
  }

  getVehiclesDB() {
    return this.http.get<Machine[]>("https://sbpesgi.azurewebsites.net/Api/SBP/Vehicule").toPromise();
  }

  getVehiculeImageLinksDB(ref: string) {
    return this.http.get("https://sbpesgi.azurewebsites.net/Api/SBP/Image/" + ref).toPromise();
  }

  getVehiculePlanningDB(ref: string) {
    return this.http.get("https://sbpesgi.azurewebsites.net/Api/SBP/Planning/" + ref).toPromise();
  }

  uploadImage(image: File, id: string): Observable<object> {
    const formData = new FormData();
    formData.append('file', image);
    return this.http.post('https://sbpesgi.azurewebsites.net/Api/SBP/Image/' + id, formData);
  }
}
