import { Component, EventEmitter, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-camera-picker',
  standalone: true,
  imports: [IonicModule],
  templateUrl: './camera-picker.component.html',
  styleUrls: ['./camera-picker.component.scss'],
})
export class CameraPickerComponent {
  @Output() photo = new EventEmitter<string>();

  async takePhoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera
    });
    this.photo.emit(image.base64String);
  }

  async openGallery() {
    const image = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos
    });
    this.photo.emit(image.base64String);
  }
}
