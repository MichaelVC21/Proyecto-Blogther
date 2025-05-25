import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ToastController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-transferencia',
  templateUrl: './transferencia.page.html',
  styleUrls: ['./transferencia.page.scss'],
  standalone: false,
})
export class TransferenciaPage implements OnInit {

  pagoForm!: FormGroup;
  usertype: string = 'freemium';
  isProcessing: boolean = false;
  
  // Planes disponibles
  planes = [
    {
      id: 'mensual',
      nombre: 'Plan Mensual',
      precio: 9.99,
      descripcion: 'Acceso completo por 30 días',
      moneda: 'USD'
    },
    {
      id: 'anual',
      nombre: 'Plan Anual',
      precio: 99.99,
      descripcion: 'Acceso completo por 12 meses (2 meses gratis)',
      moneda: 'USD',
      descuento: '17% OFF'
    }
  ];
  
  planSeleccionado = this.planes[0];

  constructor(
    public db: DatabaseService,
    public auth: AuthService,
    public cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private router: Router,
    private location: Location,
    private navController: NavController
  ) { 
    const user = localStorage.getItem('profile');
    if (user) {
      this.auth.profile = JSON.parse(user);
      this.db.getDocumentById("users", this.auth.profile.id).subscribe((data) => {
        console.log(data);
        this.cdr.detectChanges();
      });
    }
    
    this.initForm();
  }

  ngOnInit() {
  }

  initForm() {
    this.pagoForm = this.formBuilder.group({
      // Información de la tarjeta
      numeroTarjeta: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      nombreTitular: ['', [Validators.required, Validators.minLength(2)]],
      fechaVencimiento: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      
      // Información de facturación
      email: [this.auth.profile?.email || '', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-\(\)]+$/)]],
      pais: ['', Validators.required],
      ciudad: ['', Validators.required],
      direccion: ['', Validators.required],
      codigoPostal: ['', Validators.required],
      
      // Términos y condiciones
      aceptarTerminos: [false, Validators.requiredTrue]
    });
  }

  seleccionarPlan(plan: any) {
    this.planSeleccionado = plan;
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

  // Validar si el formulario es válido
  get esFormularioValido(): boolean {
    return this.pagoForm.valid;
  }

  // Procesar el pago
  async procesarPago() {
    if (!this.esFormularioValido) {
      this.mostrarToast('Por favor, completa todos los campos correctamente', 'warning');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Procesando pago...',
      spinner: 'crescent'
    });
    await loading.present();

    this.isProcessing = true;

    try {
      // Simular procesamiento de pago (aquí integrarías con Stripe, PayPal, etc.)
      await this.simularProcesoPago();
      
      // Si el pago es exitoso, cambiar usuario a premium
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

  // Simular proceso de pago (reemplazar con integración real)
  private simularProcesoPago(): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simular éxito del pago (90% de probabilidad)
        if (Math.random() > 0.1) {
          resolve();
        } else {
          reject(new Error('Pago rechazado'));
        }
      }, 3000);
    });
  }

  // Tu función original adaptada
  cambiarASuscripcionPremium(): Promise<void> {
    return new Promise((resolve, reject) => {
      const uid = this.auth.profile.id;
      const fechaSuscripcion = new Date();
      const fechaVencimiento = new Date();
      
      // Calcular fecha de vencimiento según el plan
      if (this.planSeleccionado.id === 'mensual') {
        fechaVencimiento.setMonth(fechaVencimiento.getMonth() + 1);
      } else {
        fechaVencimiento.setFullYear(fechaVencimiento.getFullYear() + 1);
      }

      const datosActualizacion = {
        usertype: 'premium',
        planSuscripcion: this.planSeleccionado.id,
        fechaSuscripcion: fechaSuscripcion.toISOString(),
        fechaVencimiento: fechaVencimiento.toISOString(),
        precioPageado: this.planSeleccionado.precio,
        ultimoPago: fechaSuscripcion.toISOString()
      };

      this.db.updateFireStoreDocument('users', uid, datosActualizacion)
        .then(() => {
          this.usertype = 'premium';
          
          // Actualizar localStorage
          const perfilActualizado = { 
            ...this.auth.profile, 
            estado: 'premium',
            usertype: 'premium',
            planSuscripcion: this.planSeleccionado.id
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
      message: `¡Felicidades! Tu suscripción ${this.planSeleccionado.nombre} ha sido activada correctamente.`,
      buttons: [
        {
          text: 'Continuar',
          handler: () => {
            this.router.navigate(['/home']); // Redirigir a la página principal
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