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
  plantId: string | null = null; // ID de la planta, recibido desde la página anterior

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private navCtrl: NavController,
    public db: DatabaseService,
  ) {}

  ngOnInit(): void {
    const planta = history.state.planta;
    this.plantId = planta?.id; 

    if (planta) {
      this.plantId = planta.id;
      this.familia = planta.familia;
      this.location = planta.location || '';
      this.clima = planta.clima || '';
      this.name = planta.name || '';
      this.description = '';
      this.imageSrc = '';
    } else {
      console.warn('No se recibieron datos de la planta.');
    }
  }  
  

  back() {
    this.navCtrl.back();
  }

  /** Toma los datos del formulario y crea un nuevo documento en Firestore */
  async handleSubmit() {
    const user = await this.afAuth.currentUser;
    if (!user || !this.plantId) {
      console.error('Falta el usuario o el ID de planta');
      return;
    }
  
    const historialInicial = {
      date: new Date().toISOString(),
      description: 'Registro inicial',
      image: this.imageSrc || '',
      location: this.location || '',   // <-- Agregado
      familia: this.familia || '',     // <-- Opcional
      clima: this.clima || '',         // <-- Opcional
      day: this.day || '',             // <-- Opcional
    };
    
  
    try {
      await this.db.addPlantHistory(user.uid, this.plantId, historialInicial);
      this.router.navigate(['/plant-days', this.plantId]);
    } catch (error) {
      console.error('Error al agregar historial:', error);
    }
  }
   
  

  

  /** Abre la cámara, toma la foto y la muestra en el template */
  async handleCameraClick() {
    try {
      const photo: Photo = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt,
        quality: 90,
      });
      this.imageSrc = photo.dataUrl!;
    } catch (err) {
      console.error('Error al tomar la foto', err);
    }
  }
}
