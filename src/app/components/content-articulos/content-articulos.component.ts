import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-content-articulos',
  standalone: true,
  templateUrl: './content-articulos.component.html',
  styleUrls: ['./content-articulos.component.scss'],
  imports: [IonicModule, CommonModule],
})
export class ContentArticulosComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
