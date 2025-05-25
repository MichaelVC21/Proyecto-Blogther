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
    location?: string;
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
    getImageUrl(image?: string): string {
      // Si la imagen es una URL válida, devuélvela. Si es falsy, usa placeholder.
      if (image && (image.startsWith('http://') || image.startsWith('https://'))) {
        return image;
      }
      if (image && image.trim() !== '') {
        // Si es una ruta relativa o de assets
        return image;
      }
      return 'assets/placeholder.svg';
    }
    getLastUpdate(): Date {
      if (!this.entries?.length) return new Date();
      const timestamps = this.entries
        .map(e => new Date(e.date).getTime());
      return new Date(Math.max(...timestamps));
    }
    
    // construye un array con las ubicaciones únicas
    uniqueLocations(): string[] {
      return Array.from(
        new Set(this.entries.map(e => e.location || 'Sin ubicación'))
      );
    }
    
    // opcional: manejar selección de ubicación
    selectedLocation = '';
    selectLocation(loc: string) {
      this.selectedLocation = loc;
      // aquí podrías filtrar entries según la ubicación
    }
    getLocationImage(loc: string): string {
      // Ejemplo: archivo por nombre
      return `assets/images/location-${loc.toLowerCase()}.jpg`;
    }
  }
  