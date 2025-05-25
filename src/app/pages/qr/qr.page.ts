import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NavController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.page.html',
  styleUrls: ['./qr.page.scss'],
    standalone: false,

})
export class QrPage implements OnInit {
  qrCodeDataURL: SafeUrl = '';
  aceptarTerminos = false;
  isProcessing = false;
  cuenta = '71234567';
  monto = 89.99;
  moneda = 'Bs';

  constructor(
    private sanitizer: DomSanitizer,
    private navCtrl: NavController,
    private toastController: ToastController,
    public auth: AuthService,
    private db: DatabaseService
  ) {}

  ngOnInit() {
    this.generarQR();
  }

  generarQR() {
    const textoFalso = `Pago a Blogther App\nMonto: ${this.monto} ${this.moneda}\nCuenta: ${this.cuenta}`;
    QRCode.toDataURL(textoFalso).then(url => {
      this.qrCodeDataURL = this.sanitizer.bypassSecurityTrustUrl(url);
    });
  }

  async suscribirse() {
    if (!this.aceptarTerminos || this.isProcessing) {
      this.mostrarToast('Debes aceptar los términos para continuar.', 'warning');
      return;
    }

    this.isProcessing = true;

    const uid = this.auth.profile.id;
    const fechaActual = new Date();
    const vencimiento = new Date();
    vencimiento.setMonth(vencimiento.getMonth() + 1);

    const datos = {
      usertype: 'premium',
      planSuscripcion: 'mensual',
      fechaSuscripcion: fechaActual.toISOString(),
      fechaVencimiento: vencimiento.toISOString(),
      precioPageado: this.monto,
      metodoPago: 'QR ',
      estadoPago: 'pagado'
    };

    try {
      await this.db.updateFireStoreDocument('users', uid, datos);
      const perfilActualizado = {
        ...this.auth.profile,
        ...datos
      };
      localStorage.setItem('profile', JSON.stringify(perfilActualizado));
      this.auth.profile = perfilActualizado;

      this.mostrarToast('Suscripción activada exitosamente.');
      this.navCtrl.navigateRoot('/principal');
    } catch (error) {
      console.error(error);
      this.mostrarToast('Error al actualizar suscripción.', 'danger');
    } finally {
      this.isProcessing = false;
    }
  }

  cancelar() {
    this.navCtrl.back();
  }

  toggleTerminos() {
    this.aceptarTerminos = !this.aceptarTerminos;
  }

  async mostrarToast(mensaje: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      position: 'top',
      color: color
    });
    await toast.present();
  }
}
