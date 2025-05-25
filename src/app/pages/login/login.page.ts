import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {

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
      console.log('formulario valido',this.registerForm.value);
      const { email, password, username } = this.registerForm.value;
      const additionalData = {
        name: username,
        username: username,
        usertype: 'freemium',
        foto_perfil: '',
      };
      this.auth.registerUser(email, password, additionalData)
        .then(() => {
          console.log('Usuario registrado correctamente');
          this.registerForm.reset();
          this.router.navigate(['/principal']);
        })
        .catch((error) => {
          console.error('Error al registrar usuario:', error);
        });
    } else {
      this.registerForm.markAllAsTouched();
      console.log('Formulario inválido');
    }
  }

}
