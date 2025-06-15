import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';
import { AfterViewInit } from '@angular/core';
  
  interface PlantEntry {
    id?: string;
    image?: string;
    date?: any;        // Timestamp o Date
    familia?: string;
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
export class PlantDaysPage implements OnInit, AfterViewInit {

  
    familia = '';
    nombrePlanta = '';
    userUid = '';
    filteredEntries: PlantEntry[] = [];
    selectedLocation = '';
    entries: PlantEntry[] = [];
    plantId = '';
  
    constructor(
      private route: ActivatedRoute,
      private db: DatabaseService,
      private auth: AuthService,
      private navCtrl: NavController,
      private cdr: ChangeDetectorRef
    ) { }
  
    ngOnInit() {
      this.plantId = this.route.snapshot.paramMap.get('id') || '';
    
      const profile = localStorage.getItem('profile');
      this.userUid = profile ? JSON.parse(profile).id : '';
    
      // ✅ Paso 1: Obtener los datos base de la planta
      this.db.getDocument(`users/${this.userUid}/mis-plantas`, this.plantId)
        .subscribe(planta => {
          if (planta) {
            this.familia = planta.familia || '';
            this.nombrePlanta = planta.name || '';
          }
        });
    
      // ✅ Paso 2: Obtener sólo el historial (no duplicado)
      this.db.getPlantHistory(this.userUid, this.plantId).subscribe(historial => {
        this.entries = historial.map(e => {
          let d: Date;
          if (e.date?.toDate) {
            d = e.date.toDate();
          } else if (typeof e.date === 'string') {
            d = new Date(e.date);
          } else {
            d = new Date(); // fallback
          }
      
          return {
            ...e,
            date: d,
            location: e.location || 'Sin ubicación', // Asegúrate de que siempre tenga un valor
          };
        }).sort((a, b) => b.date.getTime() - a.date.getTime());
      
        this.filteredEntries = this.entries;
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
      this.navCtrl.navigateForward(['/plant-detalle', this.plantId, entryId]);
    }
  
    /**
     * Navegar a crear una nueva entrada, pasando la familia por parámetro
     */
    goToNewEntry() {
      this.navCtrl.navigateForward(['/new-plant-historial'], {
        state: {
          planta: {
            id: this.route.snapshot.paramMap.get('id'),
            familia: this.familia,
            name: this.nombrePlanta,
            userUid: this.userUid,
          }
        }
      });
    }    
    
    
    detalle(entryId: string) {
      this.navCtrl.navigateForward(['/plant-detalle', this.plantId, entryId]);
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
    selectLocation(loc: string) {
      this.selectedLocation = loc;
      this.filteredEntries = this.entries.filter(e => e.location === loc);
      this.cdr.detectChanges(); // fuerza actualización de la vista
    }
    
    
    getLocationImage(loc: string): string {
      // Ejemplo: archivo por nombre
      return `assets/images/location-${loc.toLowerCase()}.jpg`;
    }
    ngAfterViewInit() {
      // Quita el foco de cualquier elemento activo (como botones del login/signup)
      const activeEl = document.activeElement as HTMLElement;
      if (activeEl && typeof activeEl.blur === 'function') {
        activeEl.blur();
      }
    }
  }
  