import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-suscripcion',
  templateUrl: './suscripcion.page.html',
  styleUrls: ['./suscripcion.page.scss'],
  standalone: false,
})
export class SuscripcionPage implements OnInit {

usertype: string = 'freemium';

  constructor(
    public db: DatabaseService,
    public auth: AuthService,
    public cdr: ChangeDetectorRef,
  ) { 
    const user = localStorage.getItem('profile');
    if (user) {
      this.auth.profile = JSON.parse(user);
      this.db.getDocumentById("users", this.auth.profile.id).subscribe((data) => {
        console.log(data);
        this.cdr.detectChanges();
      });
    }
  }

  ngOnInit() {
  }
  cambiarASuscripcionPremium() {
    const uid = this.auth.profile.id; // UID del usuario logueado
  
    this.db.updateFireStoreDocument('users', uid, { usertype: 'premium' })
      .then(() => {
        this.usertype = 'premium';
        localStorage.setItem('profile', JSON.stringify({ ...this.auth.profile, estado: 'premium' }));
        this.auth.profile.estado = 'premium'; // Actualiza el perfil en el servicio también
  
        this.cdr.detectChanges();
        console.log('✅ Usuario actualizado a premium');
      })
      .catch(error => {
        console.error('❌ Error al cambiar a premium:', error);
      });
  }
  cancelarSuscripcionPremium() {
    const uid = this.auth.profile.id;
  
    this.db.updateFireStoreDocument('users', uid, { usertype: 'freemium' })
      .then(() => {
        this.usertype = 'freemium';
        localStorage.setItem('profile', JSON.stringify({ ...this.auth.profile, estado: 'freemium' }));
        this.auth.profile.estado = 'freemium';
  
        this.cdr.detectChanges();
        console.log('🟢 Suscripción cancelada. Usuario ahora es freemium');
      })
      .catch(error => {
        console.error('❌ Error al cancelar la suscripción:', error);
      });
  }

}
