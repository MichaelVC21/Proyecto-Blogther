import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular'; // importa Ionic
import { CommonModule } from '@angular/common'; // opcional, pero útil

@Component({
  selector: 'app-menu',
  standalone: true, // <-- importante
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  imports: [IonicModule, CommonModule], // <-- importa lo necesario
})
export class MenuComponent implements OnInit {

  constructor() {}

  ngOnInit() {}

}