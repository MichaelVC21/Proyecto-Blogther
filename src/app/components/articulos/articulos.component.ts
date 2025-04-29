import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-articulos',
  standalone: true,
  templateUrl: './articulos.component.html',
  styleUrls: ['./articulos.component.scss'],
  imports: [IonicModule, CommonModule],
})
export class ArticulosComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
