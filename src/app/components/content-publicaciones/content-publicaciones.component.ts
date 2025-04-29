import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-content-publicaciones',
  standalone: true,
  templateUrl: './content-publicaciones.component.html',
  styleUrls: ['./content-publicaciones.component.scss'],
  imports: [IonicModule, CommonModule],
})
export class ContentPublicacionesComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
