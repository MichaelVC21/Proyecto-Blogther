import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { Router } from '@angular/router';
import { AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
  standalone: false,
})
export class SignUpPage implements OnInit, AfterViewInit {

  loginForm:FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    public db: DatabaseService,
    public auth: AuthService,
    public router: Router,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    const user = localStorage.getItem('profile');
   }

  ngOnInit() {
    const profile = localStorage.getItem('profile');
    if (profile) {
      this.auth.profile = JSON.parse(profile);
    } else {
      this.auth.profile = null;
    }
  }
  login() {
    if (this.loginForm.valid) {
      console.log('formulario valido',this.loginForm.value);
      const { email, password } = this.loginForm.value;
      this.auth.loginUser(email, password)
        .then(() => {
          console.log('Usuario logueado correctamente');
          this.router.navigate(['/perfil']);
        })
        .catch((error) => {
          console.error('Error al loguear usuario:', error);
        });
    } else {
      this.loginForm.markAllAsTouched();
      console.log('Formulario inválido');
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
