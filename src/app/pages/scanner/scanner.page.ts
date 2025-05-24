import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { NavController } from '@ionic/angular';
import { TabBarComponent } from '../../components/tab-bar/tab-bar.component';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.page.html',
  styleUrls: ['./scanner.page.scss'],
  standalone: false,
})

export class ScannerPage  {
  fotoBase64: string | null = null;
  botonActivo: string = '';
  constructor(
    private navCtrl: NavController,
   
  ) {}

  async tomarFoto() {
    const image = await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });
    this.fotoBase64 = 'data:image/jpeg;base64,' + image;

    // 2. (Opcional) Procesas la imagen, haces un match…
    //    await this.buscaCoincidencias(this.fotoBase64);

    // 3. Y por último navegas
    this.navCtrl.navigateForward(['/buscador-scanner']);
   
  }

  async abrirGaleria() {
    const image = await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos
    });
    this.fotoBase64 = 'data:image/jpeg;base64,' + image;

    // 2. (Opcional) Procesas la imagen, haces un match…
    //    await this.buscaCoincidencias(this.fotoBase64);

    // 3. Y por último navegas
    this.navCtrl.navigateForward(['/buscador-scanner']);
   
  }
}
