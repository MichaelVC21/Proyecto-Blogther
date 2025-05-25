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
              this.perfil = {
                id: data.id || this.perfilId,
                nombre: data.nombre || 'Usuario',
                foto: data.foto || '',
                descripcion: data.descripcion || '',
                seguidores: data.seguidores || 0,
                seguidos: data.seguidos || 0,
                plantas: data.plantas || []
              };
              this.loading = false;
              this.error = false;
              this.notFound = false;
              console.log('Perfil cargado:', this.perfil);
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

  retryLoad() {
    this.fetchPerfil();
  }

  goBack() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.router.navigate(['/perfiles']);
    }
  }
}
