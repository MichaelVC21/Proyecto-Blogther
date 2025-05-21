import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo
} from '@capacitor/camera';

@Component({
  selector: 'app-gallery-view',
  templateUrl: './gallery-view.page.html',
  styleUrls: ['./gallery-view.page.scss'],
  standalone: false,
})
export class GalleryViewPage {
  photos: Photo[] = [];

  constructor(private plt: Platform) {}

  // Cuando la vista entra en escena, inmediatamente abrimos la galería
  async ionViewDidEnter() {
    await this.openGallery();
  }

  // Abre la galería nativa
  async openGallery() {
    try {
      const photo = await Camera.getPhoto({
        quality: 80,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
      });
      // Insertamos la nueva foto al principio del array
      this.photos.unshift(photo);
    } catch (e) {
      // Si el usuario cancela o hay un error, simplemente lo ignoramos
      console.log('Galería cancelada o error:', e);
    }
  }

  // Determina si estamos en un dispositivo para mostrar/hide UI nativa
  isHybrid() {
    return this.plt.is('hybrid');
  }
}
