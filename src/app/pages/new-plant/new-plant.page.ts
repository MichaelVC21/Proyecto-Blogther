import { Component, OnInit } from '@angular/core';
import { Data, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { NavController } from '@ionic/angular';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo
} from '@capacitor/camera';
import { DatabaseService } from 'src/app/services/database.service';

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
  family = '';
  clima = '';

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private navCtrl: NavController,
    public db: DatabaseService,
  ) {}

  ngOnInit(): void {}

  back() {
    this.navCtrl.back();
  }

  /** Toma los datos del formulario y crea un nuevo documento en Firestore */
  async handleSubmit() {
  const user = await this.afAuth.currentUser;
  if (!user) {
    console.error('Usuario no autenticado');
    return;
  }

  const plantaId = new Date().getTime().toString(); // o usa uuid
  const data = {
    name: this.name,
    description: this.description,
    location: this.location,
    day: this.day,
    clima: this.clima,
    family: this.family,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    image: this.imageSrc || '', // guardá la imagen principal también aquí
  };

  try {
    await this.db.addUserSubcollectionDocumentWithId(user.uid, 'mis-plantas', plantaId, data);
    this.router.navigate(['/plantas']);
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
