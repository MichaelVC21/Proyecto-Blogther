import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  selector: 'app-new-plant-historial',
  templateUrl: './new-plant-historial.page.html',
  styleUrls: ['./new-plant-historial.page.scss'],
  standalone: false,
})
export class NewPlantHistorialPage implements OnInit {

  name = '';
  description = '';
  imageSrc: string | null = null;
  location = '';      // <-- nuevo: lugar en la casa
  day = '';           // <-- nuevo: día (por ejemplo, "Lunes" o fecha)
  familia = '';
  clima = '';

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private navCtrl: NavController,
    public db: DatabaseService,
  ) {}

  ngOnInit(): void {
    const planta = history.state.planta;
    if (planta) {
      this.familia = planta.familia;
      this.location = planta.location || '';
      this.clima = planta.clima || '';
      this.name = planta.name || '';
      this.description = planta.description || '';
      this.imageSrc = planta.image || '';
    } else {
      console.warn('No se recibieron datos de la planta para editar.');
    }
  }
  
  

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
  
    const plantaId = new Date().getTime().toString(); // o usa uuid si preferís
    const data = {
      name: this.name,
      description: this.description,
      location: this.location,
      clima: this.clima,
      familia: this.familia,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      image: this.imageSrc || '',
    };
  
    try {
      // 1. Guardar la planta en mis-plantas
      await this.db.addUserSubcollectionDocumentWithId(user.uid, 'mis-plantas', plantaId, data);
  
      // 2. Crear primer historial automáticamente
      const historialData = {
        description: this.description,
        date: new Date(),
        image: this.imageSrc || '',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      };
      await this.db.addPlantHistory(user.uid, plantaId, historialData);
  
      // 3. Redirigir a plant-days/:id
      if (this.familia) {
        this.router.navigate(['/plant-days', this.familia]);
      } else {
        console.warn('No se puede redirigir porque falta la familia');
      }
    } catch (error) {
      console.error('Error al agregar la planta o historial:', error);
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
