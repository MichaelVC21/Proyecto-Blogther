import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pincipal',
  standalone: true,
  templateUrl: './pincipal.component.html',
  styleUrls: ['./pincipal.component.scss'],
  imports: [IonicModule, CommonModule], // <-- importa lo necesario
})
export class PincipalComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
