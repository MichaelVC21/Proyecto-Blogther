import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo
} from '@capacitor/camera';

@Component({
  selector: 'app-new-plant',
  templateUrl: './new-plant.page.html',
  styleUrls: ['./new-plant.page.scss'],
  standalone: false
})
export class NewPlantPage implements OnInit {
  name = '';
  description = '';
  imageSrc: string | null = null;
  location = '';      // <-- nuevo: lugar en la casa
  day = '';           // <-- nuevo: día (por ejemplo, "Lunes" o fecha)

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore
  ) {}

  ngOnInit(): void {}

  back() {
    this.router.navigate(['/tabs/plantas']);
  }

  /** Toma los datos del formulario y crea un nuevo documento en Firestore */
  async handleSubmit() {
    const user = await this.afAuth.currentUser;
    if (!user) {
      console.error('Usuario no autenticado');
      return;
    }

    const plantData = {
      name: this.name,
      description: this.description,
      location: this.location,
      day: this.day,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      entries: this.imageSrc
        ? [
            {
              image: this.imageSrc,
              date: firebase.firestore.FieldValue.serverTimestamp()
            }
          ]
        : []
    };

    try {
      await this.afs
        .collection(`users/${user.uid}/plants`)
        .add(plantData);
      // Una vez guardada, regresar al listado
      this.router.navigate(['/tabs/plantas']);
    } catch (error) {
      console.error('Error al agregar la planta:', error);
    }
  }

  /** Abre la cámara, toma la foto y la muestra en el template */
  async handleCameraClick() {
    try {
      const photo: Photo = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        quality: 90,
      });
      this.imageSrc = photo.dataUrl!;
    } catch (err) {
      console.error('Error al tomar la foto', err);
    }
  }
}
