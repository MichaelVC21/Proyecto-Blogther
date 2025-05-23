// articulo-detalle.component.ts
import { Component, OnInit, ChangeDetectorRef, NgZone, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatabaseService } from 'src/app/services/database.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-articulo-detalle',
  standalone: true,
  templateUrl: './articulo-detalle.component.html',
  styleUrls: ['./articulo-detalle.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
})
export class ArticuloDetalleComponent implements OnInit, OnDestroy {
  articulo: any = null;
  loading: boolean = true;
  error: boolean = false;
  notFound: boolean = false;
  articuloId: string = '';
  selectedSegment: string = 'descripcion';
  private subscription: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private db: DatabaseService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.articuloId = this.route.snapshot.paramMap.get('id') || '';

    if (this.articuloId) {
      this.fetchArticulo();
    } else {
      console.error('No se proporcionó ID del artículo');
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  fetchArticulo() {
    this.loading = true;
    this.error = false;
    this.notFound = false;
    this.cdr.detectChanges();
    
    console.log('Iniciando carga del artículo:', this.articuloId);

    const articleSub = this.db
      .getDocumentById('Articulos', this.articuloId)
      .subscribe({
        next: (data) => {
          this.ngZone.run(() => {
            if (data && Object.keys(data).length > 0) {
              this.articulo = data;
              this.loading = false;
              this.error = false;
              this.notFound = false;
              console.log('📄 Artículo cargado:', this.articulo);
            } else {
              // No se encontró el artículo
              this.articulo = null;
              this.loading = false;
              this.error = false;
              this.notFound = true;
              console.log('❌ Artículo no encontrado');
            }
            this.cdr.detectChanges();
          });
        },
        error: (error) => {
          this.ngZone.run(() => {
            console.error('❌ Error al cargar el artículo:', error);
            this.articulo = null;
            this.loading = false;
            this.error = true;
            this.notFound = false;
            this.cdr.detectChanges();
          });
        },
        complete: () => {
          console.log('✅ Carga del artículo completada');
        }
      });

    this.subscription.add(articleSub);
  }

  // Método para reintentar la carga
  retryLoad() {
    this.fetchArticulo();
  }

  onSegmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
    // No es necesario forzar detección aquí ya que los eventos de Ionic 
    // se ejecutan dentro de la zona de Angular
  }

  goBack() {
    //go to the previous page 
    // Try to use the browser's history if available
    if (window.history.length > 1) {
        window.history.back();
    } else {
        // If no history is available, navigate to a default route
        this.router.navigate(['/articulos']);
    }
  }
}