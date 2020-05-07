import { Component } from '@angular/core';
import * as firebase from "firebase";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'page-perso';
  constructor() {
    const firebaseConfig = {
      apiKey: "AIzaSyAhXHNspAM0-gKeb10RplyFComwlIGHVBQ",
      authDomain: "page-perso-92c2e.firebaseapp.com",
      databaseURL: "https://page-perso-92c2e.firebaseio.com",
      projectId: "page-perso-92c2e",
      storageBucket: "page-perso-92c2e.appspot.com",
      messagingSenderId: "765812661984",
      appId: "1:765812661984:web:7608b4f1c2ab2c68cdfa85",
      measurementId: "G-6WCEE8T007"
    };
    firebase.initializeApp(firebaseConfig);
  }
}
