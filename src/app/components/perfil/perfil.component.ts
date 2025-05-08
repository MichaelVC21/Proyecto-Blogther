import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular'; // importa Ionic
import { CommonModule } from '@angular/common'; // opcional, pero útil

@Component({
  selector: 'app-perfilcomponent',
  standalone: true, // <-- importante
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  imports: [IonicModule, CommonModule], // <-- importa lo necesario
})
export class PerfilComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
