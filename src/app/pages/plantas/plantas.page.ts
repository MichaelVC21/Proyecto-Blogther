import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';

interface PlantEntry {
  id?: string;
  nombre: string;
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

  constructor(
    private db: DatabaseService,
    private auth: AuthService,
    private navCtrl: NavController,
    private cdr: ChangeDetectorRef
  ) {
    // Obtener el uid del usuario (igual que en tu CalendarioPage)
    const profileString = localStorage.getItem('profile');
    this.userUid = profileString ? JSON.parse(profileString).id : 'demo-user';

    // Suscribirnos a toda la colección “plantas”
    this.db.fetchFirestoreCollection('plantas')
      .subscribe(pls => {
        this.allPlants = pls;
        this.groupByFamily();
        this.cdr.detectChanges();
      });
  }

  ngOnInit() {}

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

  goToNewPlant() {
    this.navCtrl.navigateForward(['/new-plant']);
  }
  back() {
    this.navCtrl.back();
  }
}
