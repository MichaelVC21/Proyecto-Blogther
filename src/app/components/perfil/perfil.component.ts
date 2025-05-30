import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular'; // importa Ionic
import { CommonModule } from '@angular/common'; // opcional, pero útil
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { ChangeDetectorRef } from '@angular/core'; // opcional, pero útil
import { AfterViewInit } from '@angular/core';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-perfilcomponent',
  standalone: true, // <-- importante
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  imports: [IonicModule, CommonModule, AngularFirestoreModule], // <-- importa lo necesario
})
export class PerfilComponent  implements OnInit, AfterViewInit {

  descripcion: any;
  userUid: string = ''; // Inicializamos como cadena vacía

  constructor(
    public auth: AuthService,
    public db: DatabaseService,
    public cdr: ChangeDetectorRef,
  ) { 

  }

  ngOnInit() {
    const profileData = localStorage.getItem('profile');
    if (profileData) {
      const profile = JSON.parse(profileData);
      this.userUid = profile.id;
      this.db.getDocument('users', this.userUid).subscribe((data) => {
        this.descripcion = data.descripcion; // Asignamos los datos del perfil a la variable
        this.cdr.detectChanges(); // Detecta cambios para actualizar la vista
      });
    } else {
      console.warn('⚠️ No se encontró el perfil. El usuario podría no estar logueado.');
      this.userUid = ''; // O redirigí al login, o mostrale un mensaje.
    }
  }
  
  ngAfterViewInit() {
    // Quita el foco de cualquier elemento activo (como botones del login/signup)
    const activeEl = document.activeElement as HTMLElement;
    if (activeEl && typeof activeEl.blur === 'function') {
      activeEl.blur();
    }
  }

  logout() {
    this.auth.logout();
  }
}
