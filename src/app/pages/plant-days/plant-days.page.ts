import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
  import { NavController } from '@ionic/angular';
  import { DatabaseService } from 'src/app/services/database.service';
  import { AuthService } from 'src/app/services/auth.service';
  
  interface PlantEntry {
    id?: string;
    image?: string;
    date?: any;        // Timestamp o Date
    family?: string;
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
      this.family = this.route.snapshot.paramMap.get('familia') || '';

      const profile = localStorage.getItem('profile');
      this.userUid = profile ? JSON.parse(profile).id : '';

      this.db.getSubcollection(`users/${this.userUid}`, 'mis-plantas')
        .subscribe(all => {
          this.entries = all
            .filter(p => p.family === this.family)  // ojo: en tu código es "family", no "familia"
            .sort((a, b) => {
              const ta = a.createdAt?.seconds ?? 0;
              const tb = b.createdAt?.seconds ?? 0;
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
      this.navCtrl.navigateForward(['/plant-detalle', entryId]);
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
  