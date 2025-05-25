import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ToastController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transferencia',
  templateUrl: './transferencia.page.html',
  styleUrls: ['./transferencia.page.scss'],
  standalone: false,
})
export class TransferenciaPage implements OnInit {

  pagoForm!: FormGroup;
  isProcessing: boolean = false;
  aceptarTerminos: boolean = false;
  
  // Plan fijo
  monto = 89.99;
  moneda = 'Bs';
  planNombre = 'Plan Premium Mensual';

  constructor(
    public db: DatabaseService,
    public auth: AuthService,
    public cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private router: Router,
    private navController: NavController
  ) { 
    const user = localStorage.getItem('profile');
    if (user) {
      this.auth.profile = JSON.parse(user);
    }
    
    this.initForm();
  }

  ngOnInit() {
  }

  initForm() {
    this.pagoForm = this.formBuilder.group({
      numeroTarjeta: ['', [Validators.required, Validators.minLength(16)]],
      nombreTitular: ['', [Validators.required, Validators.minLength(2)]],
      fechaVencimiento: ['', [Validators.required]],
      cvv: ['', [Validators.required, Validators.minLength(3)]],
      email: [this.auth.profile?.email || '', [Validators.required, Validators.email]]
    });
  }

  // Formatear número de tarjeta mientras se escribe
  formatearNumeroTarjeta(event: any) {
    let valor = event.target.value.replace(/\s/g, '').replace(/\D/g, '');
    valor = valor.replace(/(\d{4})(?=\d)/g, '$1 ');
    event.target.value = valor;
    this.pagoForm.patchValue({ numeroTarjeta: valor.replace(/\s/g, '') });
  }

  // Formatear fecha de vencimiento
  formatearFecha(event: any) {
    let valor = event.target.value.replace(/\D/g, '');
    if (valor.length >= 2) {
      valor = valor.substring(0, 2) + '/' + valor.substring(2, 4);
    }
    event.target.value = valor;
    this.pagoForm.patchValue({ fechaVencimiento: valor });
  }

  // Procesar el pago
  async procesarPago() {
    if (!this.pagoForm.valid || !this.aceptarTerminos) {
      this.mostrarToast('Por favor, completa todos los campos y acepta los términos', 'warning');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Procesando pago...',
      spinner: 'crescent'
    });
    await loading.present();

    this.isProcessing = true;

    try {
      // Simular procesamiento de pago (siempre exitoso)
      await this.simularProcesoPago();
      
      // Cambiar usuario a premium
      await this.cambiarASuscripcionPremium();
      
      await loading.dismiss();
      await this.mostrarAlertaExito();
      
    } catch (error) {
      await loading.dismiss();
      console.error('Error en el pago:', error);
      this.mostrarToast('Error al procesar el pago. Intenta nuevamente.', 'danger');
    } finally {
      this.isProcessing = false;
    }
  }

  // Simular proceso de pago (siempre exitoso)
  private simularProcesoPago(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  }

  // Cambiar usuario a premium
  cambiarASuscripcionPremium(): Promise<void> {
    return new Promise((resolve, reject) => {
      const uid = this.auth.profile.id;
      const fechaSuscripcion = new Date();
      const fechaVencimiento = new Date();
      fechaVencimiento.setMonth(fechaVencimiento.getMonth() + 1);

      const datosActualizacion = {
        usertype: 'premium',
        planSuscripcion: 'mensual',
        fechaSuscripcion: fechaSuscripcion.toISOString(),
        fechaVencimiento: fechaVencimiento.toISOString(),
        precioPageado: this.monto,
        ultimoPago: fechaSuscripcion.toISOString(),
        metodoPago: 'tarjeta_credito',
        estadoPago: 'completado'
      };

      this.db.updateFireStoreDocument('users', uid, datosActualizacion)
        .then(() => {
          // Actualizar localStorage
          const perfilActualizado = { 
            ...this.auth.profile, 
            usertype: 'premium',
            planSuscripcion: 'mensual'
          };
          
          localStorage.setItem('profile', JSON.stringify(perfilActualizado));
          this.auth.profile = perfilActualizado;

          this.cdr.detectChanges();
          console.log('✅ Usuario actualizado a premium');
          resolve();
        })
        .catch(error => {
          console.error('❌ Error al cambiar a premium:', error);
          reject(error);
        });
    });
  }

  // Mostrar alerta de éxito
  async mostrarAlertaExito() {
    const alert = await this.alertController.create({
      header: '¡Pago Exitoso!',
      message: `¡Felicidades! Tu suscripción premium ha sido activada correctamente.`,
      buttons: [
        {
          text: 'Continuar',
          handler: () => {
            this.router.navigate(['/principal']);
          }
        }
      ],
      backdropDismiss: false
    });

    await alert.present();
  }

  // Mostrar toast de notificación
  async mostrarToast(mensaje: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: color,
      position: 'top'
    });
    toast.present();
  }

  // Cancelar y volver
  cancelar() {
    this.navController.back();
  }
}