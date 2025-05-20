import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-publicaciones',
  standalone: true,
  templateUrl: './publicaciones.component.html',
  styleUrls: ['./publicaciones.component.scss'],
  imports: [IonicModule, CommonModule],
})
export class PublicacionesComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
