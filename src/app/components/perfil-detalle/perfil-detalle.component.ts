import { Component, OnInit, ChangeDetectorRef, NgZone, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatabaseService } from 'src/app/services/database.service';
import { Subscription } from 'rxjs';

interface Planta {
  id: string;
  nombre: string;
  imagen: string;
}

interface Perfil {
  id: string;
  nombre: string;
  foto: string;
  descripcion: string;
  seguidores: number;
  seguidos: number;
  plantas: Planta[];
}

@Component({
  selector: 'app-perfil-detalle',
  standalone: true,
  templateUrl: './perfil-detalle.component.html',
  styleUrls: ['./perfil-detalle.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
})
export class PerfilDetalleComponent implements OnInit, OnDestroy {
  perfil: Perfil | null = null;
  loading: boolean = true;
  error: boolean = false;
  notFound: boolean = false;
  perfilId: string = '';
  private subscription: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private db: DatabaseService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.perfilId = this.route.snapshot.paramMap.get('id') || '';

    if (this.perfilId) {
      this.fetchPerfil();
    } else {
      console.error('No se proporcionó ID del perfil');
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  fetchPerfil() {
    this.loading = true;
    this.error = false;
    this.notFound = false;
    this.cdr.detectChanges();
    
    console.log('Cargando perfil:', this.perfilId);

    const perfilSub = this.db
      .getDocumentById('perfil', this.perfilId)
      .subscribe({
        next: (data: any) => {
          this.ngZone.run(() => {
            if (data && Object.keys(data).length > 0) {
              // Procesar las plantas para asegurar que las URLs de imágenes sean válidas
              const plantasProcessed = this.processPlantas(data.plantas || []);
              
              this.perfil = {
                id: data.id || this.perfilId,
                nombre: data.nombre || 'Usuario',
                foto: data.foto || '',
                descripcion: data.descripcion || '',
                seguidores: data.seguidores || 0,
                seguidos: data.seguidos || 0,
                plantas: plantasProcessed
              };
              this.loading = false;
              this.error = false;
              this.notFound = false;
              console.log('Perfil cargado:', this.perfil);
              console.log('Plantas procesadas:', this.perfil.plantas);
            } else {
              this.perfil = null;
              this.loading = false;
              this.error = false;
              this.notFound = true;
              console.log('Perfil no encontrado');
            }
            this.cdr.detectChanges();
          });
        },
        error: (error) => {
          this.ngZone.run(() => {
            console.error('Error al cargar el perfil:', error);
            this.perfil = null;
            this.loading = false;
            this.error = true;
            this.notFound = false;
            this.cdr.detectChanges();
          });
        }
      });

    this.subscription.add(perfilSub);
  }

  // Método para procesar las plantas y validar/corregir las URLs de imágenes
  private processPlantas(plantas: any[]): Planta[] {
    if (!Array.isArray(plantas)) {
      return [];
    }

    return plantas.map((planta, index) => {
      // Si la planta no tiene imagen o la imagen no es válida, usar una imagen por defecto
      let imagenUrl = planta.imagen || planta.foto || '';
      
      // Validar que la URL sea válida
      if (!imagenUrl || !this.isValidUrl(imagenUrl)) {
        // Usar una imagen por defecto o una imagen de placeholder
        imagenUrl = `https://via.placeholder.com/300x300/a8e6cf/ffffff?text=${encodeURIComponent(planta.nombre || 'Planta')}`;
      }

      return {
        id: planta.id || `planta-${index}`,
        nombre: planta.nombre || `Planta ${index + 1}`,
        imagen: imagenUrl
      };
    });
  }

  // Método para validar URLs
  private isValidUrl(string: string): boolean {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  // Método para manejar errores de carga de imágenes
  onImageError(event: any, planta: Planta) {
    console.warn(`Error cargando imagen para ${planta.nombre}, usando imagen por defecto`);
    event.target.src = `https://via.placeholder.com/300x300/a8e6cf/ffffff?text=${encodeURIComponent(planta.nombre)}`;
  }

  // Método para manejar errores de carga de foto de perfil
  onProfileImageError(event: any) {
    console.warn('Error cargando foto de perfil, usando imagen por defecto');
    event.target.style.display = 'none';
    // La plantilla manejará mostrar el ícono por defecto
  }

  retryLoad() {
    this.fetchPerfil();
  }

  // Método para el trackBy de Angular para mejor rendimiento
  trackByPlantId(index: number, planta: Planta): string {
    return planta.id || index.toString();
  }

  goBack() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.router.navigate(['/perfiles']);
    }
  }
}

// perfil-detalle.component.scss (actualizaciones necesarias)
/*
Agregar estos estilos adicionales para mejorar la visualización de imágenes:
*/

