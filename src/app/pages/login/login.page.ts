import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { Router } from '@angular/router';
import { AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit, AfterViewInit {

  registerForm:FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    public db: DatabaseService,
    public auth: AuthService,
    public router: Router,
  ) { 
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
  }
  register() {
    if (this.registerForm.valid) {
      const { email, password, username } = this.registerForm.value;
  
      const defaultProfile = {
        name: username,
        username: username,
        usertype: 'freemium',
        foto_perfil: '',
        descripcion: '',
        phone: '',
        seguidores: 0,
        seguidos: 0,
        estadoPago: 'gratis',
        metodoPago: '',
        fechaSuscripcion: new Date().toISOString(),
        fechaVencimiento: '',
        planSuscripcion: 'freemium',
        precioPageado: 0
      };
  
      // 👇 Llamada al servicio auth con promesa que devuelve el UID
      this.auth.registerUser(email, password, defaultProfile)
        .then((uid) => {
          console.log('✅ Usuario registrado correctamente con UID:', uid);
          this.router.navigate(['/principal']); // Redirigís después de registrar
        })
        .catch((error: any) => {
          console.error('❌ Error al registrar usuario:', error);
        });
  
    } else {
      this.registerForm.markAllAsTouched();
      console.log('⚠️ Formulario inválido');
    }
  }
  
  
  ngAfterViewInit() {
    // Quita el foco de cualquier elemento activo (como botones del login/signup)
    const activeEl = document.activeElement as HTMLElement;
    if (activeEl && typeof activeEl.blur === 'function') {
      activeEl.blur();
    }
  }
  

}
