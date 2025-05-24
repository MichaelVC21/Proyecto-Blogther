import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
  import { NavController } from '@ionic/angular';
  import { DatabaseService } from 'src/app/services/database.service';
  import { AuthService } from 'src/app/services/auth.service';
  
  interface PlantEntry {
    id?: string;
    image?: string;
    date?: any;        // Timestamp o Date
    familia?: string;
    userUid?: string;
    // cualquier otro campo que uses
  }
@Component({
  selector: 'app-plant-days',
  templateUrl: './plant-days.page.html',
  styleUrls: ['./plant-days.page.scss'],
  standalone: false
})
export class PlantDaysPage implements OnInit {

  
    family = '';
    userUid = '';
    entries: PlantEntry[] = [];
  
    constructor(
      private route: ActivatedRoute,
      private db: DatabaseService,
      private auth: AuthService,
      private navCtrl: NavController,
      private cdr: ChangeDetectorRef
    ) { }
  
    ngOnInit() {
      // 1. Capturamos la familia de la ruta
      this.family = this.route.snapshot.paramMap.get('familia') || '';
  
      // 2. Recuperamos el UID del usuario (igual que en PlantasPage)
      const profile = localStorage.getItem('profile');
      this.userUid = profile ? JSON.parse(profile).id : '';
  
      // 3. Nos suscribimos a la colección, filtramos y ordenamos
      this.db.fetchFirestoreCollection('plantas')
        .subscribe(all => {
          this.entries = all
            // sólo del usuario actual y de la familia seleccionada
            .filter(p =>
              p.familia === this.family &&
              (!p.userUid || p.userUid === this.userUid)
            )
            // ordenamos por fecha descendente
            .sort((a, b) => {
              const ta = a.date?.seconds ?? a.date ?? 0;
              const tb = b.date?.seconds ?? b.date ?? 0;
              return tb - ta;
            });
          this.cdr.detectChanges();
        });
    }
    back() {
      this.navCtrl.back();
    }
    /**
     * Navegar al detalle de una entrada concreta
     */
    goToEntry(entryId: string) {
      this.navCtrl.navigateForward(['/entry-detail', entryId]);
    }
  
    /**
     * Navegar a crear una nueva entrada, pasando la familia por parámetro
     */
    goToNewEntry() {
      this.navCtrl.navigateForward(['/new-plant']);
    }
    detalle(entryId: string) {
      this.navCtrl.navigateForward(['/plant-detalle', entryId]);
    }
  }
  