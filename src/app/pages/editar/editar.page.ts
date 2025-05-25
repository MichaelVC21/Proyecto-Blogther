import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.page.html',
  styleUrls: ['./editar.page.scss'],
  standalone: false,
})
export class EditarPage implements OnInit {

  changeProfile: FormGroup;
  imageSrc: string | null = null;
  imagenDataUrl: string | undefined;
  imagen: any;
  imagenPerfil: any;
  fotoPerfilUrl: string | undefined;
  base64Image: string | null = null;
  
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
  async handleCameraClick() {
    try {
      const image = await Camera.getPhoto({
        quality: 60, // menos calidad = menos peso
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        width: 300, // más pequeño
        height: 300
      });
  
      const imageDataUrl = image?.dataUrl || '';
      if (!imageDataUrl) {
        console.error('No se pudo obtener el dataUrl de la imagen');
        return;
      }
  
      this.base64Image = imageDataUrl;  // Guarda base64 localmente
      this.imagenDataUrl = imageDataUrl; // Para previsualizar en el HTML
  
    } catch (error: any) {
      if (error.message?.includes('User cancelled')) {
        console.log('Usuario canceló la cámara');
      } else {
        console.error('Error al tomar la foto', error);
      }
    }
  }
  
  
  async chgProfile() {
    if (this.changeProfile.valid) {
      const uid = this.auth.profile.id;
      const { username, descripcion } = this.changeProfile.value;
  
      const additionalData = {
        name: username,
        phone: '',
        foto_perfil: this.base64Image || this.auth.profile?.foto_perfil || '',
        username: username,
        descripcion: descripcion
      };
  
      this.db.updateFireStoreDocument('users', uid, additionalData)
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
  }
  
  
  
}
