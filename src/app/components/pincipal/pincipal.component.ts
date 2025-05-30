import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-pincipal',
  standalone: true,
  templateUrl: './pincipal.component.html',
  styleUrls: ['./pincipal.component.scss'],
  imports: [IonicModule, CommonModule], // <-- importa lo necesario
})
export class PincipalComponent  implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit() {}
  ngAfterViewInit() {
    // Quita el foco de cualquier elemento activo (como botones del login/signup)
    const activeEl = document.activeElement as HTMLElement;
    if (activeEl && typeof activeEl.blur === 'function') {
      activeEl.blur();
    }
  }
}
