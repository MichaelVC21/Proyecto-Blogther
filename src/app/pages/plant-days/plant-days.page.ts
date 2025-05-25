import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
  import { NavController } from '@ionic/angular';
  import { DatabaseService } from 'src/app/services/database.service';
  import { AuthService } from 'src/app/services/auth.service';
  import firebase from 'firebase/compat/app';
  
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
        // 1) filtrar y ordenar…
        const filtered = all.filter(p => p.family === this.family);
        // 2) normalizar date: puede ser Timestamp de Firestore o string ISO
        this.entries = filtered.map(e => {
          let d: Date;
          if (e.date?.toDate) {
            // Firebase Timestamp
            d = e.date.toDate();
          } else if (typeof e.date === 'string') {
            d = new Date(e.date);
          } else {
            d = new Date();       // fallback hoy
          }
          return {
            ...e,
            date: d
          };
        })
        // 3) ordenar por createdAt o por date si lo prefieres
        .sort((a, b) => {
          const ta = a.date.getTime();
          const tb = b.date.getTime();
          return tb - ta;
        });

        this.selectedLocation = this.uniqueLocations()[0] || '';
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
  