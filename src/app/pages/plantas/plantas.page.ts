import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavController, AlertController, ToastController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';

interface PlantEntry {
  id?: string;
  name: string;
  familia: string;
  image?: string;
  userUid?: string;
}

interface PlantCategory {
  name: string;
  entries: PlantEntry[];
}

@Component({
  selector: 'app-plantas',
  templateUrl: './plantas.page.html',
  styleUrls: ['./plantas.page.scss'],
  standalone: false
})
export class PlantasPage implements OnInit {
  plantCategories: PlantCategory[] = [];
  userUid = '';
  allPlants: PlantEntry[] = [];
  
  // Restricciones para usuarios no premium
  readonly MAX_PLANTAS_GRATUITAS = 2;
  isPremium = false;
  plantasDisponibles = 0;

  constructor(
    private db: DatabaseService,
    private auth: AuthService,
    private navCtrl: NavController,
    private cdr: ChangeDetectorRef,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    // Obtener el uid del usuario
    const profileString = localStorage.getItem('profile');
    if (profileString) {
      const profile = JSON.parse(profileString);
      this.userUid = profile.id || 'demo-user';
      this.isPremium = profile.usertype === 'premium';
    } else {
      this.userUid = 'demo-user';
      this.isPremium = false;
    }

    // Suscribirnos a toda la colección "plantas"
    this.db.getSubcollection(`users/${this.userUid}`, 'mis-plantas')
      .subscribe(pls => {
        this.allPlants = pls;
        this.calcularPlantasDisponibles();
        this.groupByFamily();
        this.cdr.detectChanges();
      });
  }

  ngOnInit() {}

  private calcularPlantasDisponibles() {
    const plantasActuales = this.allPlants
      .filter(p => !p.userUid || p.userUid === this.userUid).length;
    
    if (this.isPremium) {
      this.plantasDisponibles = -1; // Ilimitado
    } else {
      this.plantasDisponibles = this.MAX_PLANTAS_GRATUITAS - plantasActuales;
    }
  }

  private groupByFamily() {
    const mapFam: Record<string, PlantEntry[]> = {};
    this.allPlants
      // filtramos sólo las del usuario actual
      .filter(p => !p.userUid || p.userUid === this.userUid)
      .forEach(p => {
        const fam = p.familia || 'Sin familia';
        if (!mapFam[fam]) { mapFam[fam] = []; }
        mapFam[fam].push(p);
      });

    this.plantCategories = Object.keys(mapFam).map(fam => ({
      name: fam,
      entries: mapFam[fam]
    }));
  }

  goToDetail(plantId: string) {
    this.navCtrl.navigateForward(['/plant-days', plantId]);
  }

  async goToNewPlant() {
    // Verificar si el usuario puede añadir más plantas
    if (!this.isPremium && this.plantasDisponibles <= 0) {
      await this.mostrarAlertaLimitePlantas();
      return;
    }
    this.navCtrl.navigateForward(['/new-plant']);
  }

  // Mostrar alerta cuando se alcanza el límite de plantas
  async mostrarAlertaLimitePlantas() {
    const alert = await this.alertController.create({
      header: '¡Límite Alcanzado!',
      message: `Has alcanzado el límite de ${this.MAX_PLANTAS_GRATUITAS} plantas para usuarios gratuitos. ¡Hazte Premium para añadir plantas ilimitadas!`,
      buttons: [
        {
          text: 'Tal vez luego',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: '¡Hacerme Premium!',
          cssClass: 'premium-button',
          handler: () => {
            this.irAPremium();
          }
        }
      ],
      cssClass: 'limit-alert'
    });

    await alert.present();
  }

  // Navegar a la suscripción premium
  irAPremium() {
    this.navCtrl.navigateForward(['/metodo-pago']);
  }

  // Mostrar toast informativo
  async mostrarToast(mensaje: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: color,
      position: 'top'
    });
    await toast.present();
  }

  back() {
    this.navCtrl.back();
  }

  // Getter para mostrar información del estado de la cuenta
  get estadoCuenta(): string {
    if (this.isPremium) {
      return 'Premium';
    }
    return `Gratuito (${this.plantasDisponibles}/${this.MAX_PLANTAS_GRATUITAS} plantas disponibles)`;
  }

  // Getter para verificar si se puede añadir plantas
  get puedeAñadirPlantas(): boolean {
    return this.isPremium || this.plantasDisponibles > 0;
  }
}