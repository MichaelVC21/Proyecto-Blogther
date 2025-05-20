import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  standalone: false,
})
export class NewPlantPage implements OnInit {
  name = '';
  description = '';

  /** contendrá el DataUrl o webPath de la foto */
  imageSrc: string | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  back() {
    this.router.navigate(['/tabs/plantas']);
  }

  handleSubmit() {
    this.router.navigate(['/tabs/plantas']);
  }

  /** Abre la cámara, toma la foto y la muestra en el template */
  async handleCameraClick() {
    try {
      const photo: Photo = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,  // DataUrl permite bind directo al src
        source: CameraSource.Camera,
        quality: 90,
      });
      this.imageSrc = photo.dataUrl!;
    } catch (err) {
      console.error('Error al tomar la foto', err);
    }
  }
}
