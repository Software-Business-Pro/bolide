import { Injectable } from '@angular/core';
import axios from 'axios';
import * as xml2js from 'xml2js';

@Injectable({
  providedIn: 'root'
})

export class IdentificationService {

  URL_SERVICE: string = 'https://cors-anywhere.herokuapp.com/http://webservices.hermesapps.com/ws_connect.asmx';
  BODY_XML: string = '<?xml version="1.0" encoding="utf-8"?>\
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
    <soap:Body>\
    <GetSession xmlns="http://tempuri.org/">\
    <_sAccount>CBEAUSSIRE</_sAccount>\
    <_sLogin>beaussire.connect</_sLogin>\
    <_sPassword>Bconnect1254!</_sPassword>\
    </GetSession>\
    </soap:Body>\
    </soap:Envelope>';

  constructor() { }

  getSession() {
    axios.post(this.URL_SERVICE,
      this.BODY_XML,
      {
        headers:
          {
            'Content-Type': 'text/xml; charset=utf-8',
            'SOAPAction': 'http://tempuri.org/GetSession'
          }
      }).then((result) => {
        console.log('from IdentificationService.getSession() : ' + result.data);
        xml2js.parseString(result.data, function (err, res) {
          console.dir(res);
        })
        return result;
    }).catch((error) => {
      console.error(error);
    })
  }
}
