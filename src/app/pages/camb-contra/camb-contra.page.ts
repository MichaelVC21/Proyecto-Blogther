import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { getAuth, updatePassword } from 'firebase/auth';
import { NavController } from '@ionic/angular';
import { DatabaseService } from '../../services/database.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';


@Component({
  selector: 'app-camb-contra',
  templateUrl: './camb-contra.page.html',
  styleUrls: ['./camb-contra.page.scss'],
  standalone: false,
})
export class CambContraPage implements OnInit {

  changeProfile: FormGroup;

  constructor(
    public auth: AuthService,
    public db: DatabaseService,
    public fb: FormBuilder,
    public alertController: AlertController,
    public navCtrl: NavController,
    public afAuth: AngularFireAuth,
    public router: Router,
  ) {
    this.changeProfile = this.fb.group({
      usuario: ['', [Validators.required, Validators.minLength(6)]],
      contraseñaActual: ['', [Validators.required, Validators.minLength(6)]],
      contraseña: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContraseña: ['', [Validators.required, Validators.minLength(6)]],
    });
    const user = localStorage.getItem('profile');
    if (user) {
      this.changeProfile.patchValue({
        usuario: JSON.parse(user).username,
      });
    }
  }

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        console.log("✅ Usuario autenticado:", user);
      } else {
        console.log("❌ Usuario no autenticado");
        this.mostrarAlerta('Error', 'Por seguridad, por favor vuelve a iniciar sesión.');
        this.router.navigate(['/login']);
      }
    });
  }
  async cambiarContrasena() {
    const actual = this.changeProfile.value.contraseñaActual;
    const nombreUsuarioInput = this.changeProfile.value.usuario;
    const perfilGuardado = JSON.parse(localStorage.getItem('profile') || '{}');
    
    if (!perfilGuardado.username || perfilGuardado.username !== nombreUsuarioInput) {
      this.mostrarAlerta('Error', 'El nombre de usuario ingresado no coincide con el usuario actual.');
      return;
    }
  
    const nueva = this.changeProfile.value.contraseña;
    const confirmar = this.changeProfile.value.confirmarContraseña;
  
    if (nueva !== confirmar) {
      this.mostrarAlerta('Error', 'Las contraseñas no coinciden');
      return;
    }
  
    const user = await this.afAuth.currentUser;
  
    if (!user || !user.email) {
      this.mostrarAlerta('Error', 'No se detectó un usuario autenticado con email.');
      return;
    }
  
    try {
      // Reautenticación
      const credential = EmailAuthProvider.credential(user.email, actual);
      await reauthenticateWithCredential(user, credential);
      console.log('✅ Reautenticación exitosa');
  
      // Cambiar contraseña
      await updatePassword(user, nueva);
      this.mostrarAlerta('Éxito', 'La contraseña fue actualizada correctamente');
      this.changeProfile.reset();
  
    } catch (error: any) {
      console.error('❌ Error en el cambio de contraseña:', error);
      if (error.code === 'auth/wrong-password') {
        this.mostrarAlerta('Error', 'La contraseña actual es incorrecta.');
      } else if (error.code === 'auth/weak-password') {
        this.mostrarAlerta('Error', 'La nueva contraseña es demasiado débil.');
      } else {
        this.mostrarAlerta('Error', error.message || 'Ocurrió un error inesperado.');
      }
    }
    console.log('Contraseña actual ingresada:', actual);
    console.log('Email del usuario actual:', user.email);
  }
  

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }
  
}
