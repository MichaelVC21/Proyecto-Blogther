import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.page.html',
  styleUrls: ['./editar.page.scss'],
  standalone: false,
})
export class EditarPage implements OnInit {

  changeProfile: FormGroup;
  
  constructor(
    public db: DatabaseService,
    public auth: AuthService,
    public fb: FormBuilder,
    public router: Router,
  ) { 
    this.changeProfile = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(6)]],
    });
    const user = localStorage.getItem('profile');
    if(user){
      this.changeProfile.patchValue({
        username: JSON.parse(user).username,
        descripcion: JSON.parse(user).descripcion,
      });
    }
  }

  ngOnInit() {
  }
  chgProfile() {
    if (this.changeProfile.valid) {
      console.log('formulario valido',this.changeProfile.value);
      const uid = this.auth.profile.id;
      const { username, descripcion } = this.changeProfile.value;
      const additionalData = {
        name: username,
        phone: '',
        username: username,
        descripcion: descripcion
      };
      this.db.updateFireStoreDocument("users",uid, additionalData)
        .then(() => {
          console.log('Usuario actualizado correctamente');
          this.changeProfile.reset();
          this.router.navigate(['/perfil']);
        })
        .catch((error) => {
          console.error('Error al actualizar usuario:', error);
        });
    } else {
      this.changeProfile.markAllAsTouched();
      console.log('Formulario inválido');
    }
    console.log("Valid:", this.changeProfile.valid);
console.log("Valores:", this.changeProfile.value);
console.log("Errores:", this.changeProfile.errors);
  }
  
}
