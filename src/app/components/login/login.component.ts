import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular'; // importa Ionic
import { CommonModule } from '@angular/common'; // opcional, pero útil

@Component({
  selector: 'app-logincomponent',
  standalone: true, // <-- importante
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [IonicModule, CommonModule], // <-- importa lo necesario
})
export class LoginComponent  implements OnInit {

  nombre: string = 'David Gonzalez';

  constructor() { }

  ngOnInit() {}

}
