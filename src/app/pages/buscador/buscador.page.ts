import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { Subscription, combineLatest, of, BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';
import { PerfilComponent } from 'src/app/components/perfil/perfil.component';

interface SearchResult {
  id: string;
  tipo: 'perfil' | 'publicacion' | 'articulo';
  titulo: string;
  subtitulo?: string;
  imagen?: string;
  data: any;
}

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.page.html',
  styleUrls: ['./buscador.page.scss'],
  standalone: false,
})
export class BuscadorPage implements OnInit, OnDestroy {
  searchTerm: string = '';
  selectedFilter: string = 'todos';
  loading: boolean = false;
  hasSearched: boolean = false;
  
  // Resultados separados por tipo
  perfil: SearchResult[] = [];
  publicaciones: SearchResult[] = [];
  articulos: SearchResult[] = [];
  
  // Resultados filtrados para mostrar
  filteredResults: SearchResult[] = [];
  
  // Subject para manejar búsquedas con debounce
  private searchSubject = new BehaviorSubject<string>('');
  private subscriptions = new Subscription();

  constructor(
    private db: DatabaseService,
    private router: Router
  ) { }

  ngOnInit() {
    this.setupSearch();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  setupSearch() {
    const searchSub = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        if (term.trim().length === 0) {
          return of(null);
        }
        return this.performSearch(term.trim());
      })
    ).subscribe(results => {
      if (results) {
        this.updateResults(results);
      } else {
        this.clearResults();
      }
      this.loading = false;
    });

    this.subscriptions.add(searchSub);
  }

  onSearchChange(event: any) {
    const term = event.detail.value || '';
    this.searchTerm = term;
    
    if (term.trim().length === 0) {
      this.clearResults();
      this.hasSearched = false;
      return;
    }

    this.loading = true;
    this.hasSearched = true;
    this.searchSubject.next(term);
  }

  performSearch(term: string) {
    const termLower = term.toLowerCase();
    
    // Búsquedas simultáneas en las 3 colecciones
    const perfilSearch = this.db.fetchFirestoreCollection('perfil').pipe(
      map(perfil => perfil.filter(perfil => 
        this.matchesPerfilSearch(perfil, termLower)
      ).map(perfil => this.mapToSearchResult(perfil, 'perfil')))
    );

    const publicacionesSearch = this.db.fetchFirestoreCollection('Publicaciones').pipe(
      map(publicaciones => publicaciones.filter(publicacion => 
        this.matchesPublicacionSearch(publicacion, termLower)
      ).map(publicacion => this.mapToSearchResult(publicacion, 'publicacion')))
    );

    const articulosSearch = this.db.fetchFirestoreCollection('Articulos').pipe(
      map(articulos => articulos.filter(articulo => 
        this.matchesArticuloSearch(articulo, termLower)
      ).map(articulo => this.mapToSearchResult(articulo, 'articulo')))
    );

    return combineLatest([perfilSearch, publicacionesSearch, articulosSearch]).pipe(
      map(([perfil, publicaciones, articulos]) => ({
        perfil,
        publicaciones,
        articulos
      }))
    );
  }

  matchesPerfilSearch(perfil: any, term: string): boolean {
    const searchFields = [
      perfil.nombre,
      perfil.apellido,
      perfil.username,
      perfil.email,
      perfil.bio
    ];

    return searchFields.some(field => 
      field && field.toLowerCase().includes(term)
    );
  }

  matchesPublicacionSearch(publicacion: any, term: string): boolean {
    const searchFields = [
      publicacion.titulo,
      publicacion.descripcion,
      publicacion.categoria,
      publicacion.tags,
      publicacion.autor
    ];

    return searchFields.some(field => 
      field && field.toLowerCase().includes(term)
    );
  }

  matchesArticuloSearch(articulo: any, term: string): boolean {
    const searchFields = [
      articulo.nombre,
      articulo.categoria,
      articulo.informacion,
      articulo.curiosidades,
      articulo.plagas,
      articulo.interior,
      articulo.exterior
    ];

    return searchFields.some(field => 
      field && field.toLowerCase().includes(term)
    );
  }

  mapToSearchResult(item: any, tipo: 'perfil' | 'publicacion' | 'articulo'): SearchResult {
    switch (tipo) {
      case 'perfil':
        return {
          id: item.id,
          tipo: 'perfil',
          titulo: `${item.nombre || ''} ${item.apellido || ''}`.trim() || item.username || 'Usuario',
          subtitulo: item.bio || item.email || '',
          imagen: item.avatar || item.foto,
          data: item
        };
      
      case 'publicacion':
        return {
          id: item.id,
          tipo: 'publicacion',
          titulo: item.titulo || 'Publicación sin título',
          subtitulo: item.descripcion || `Por ${item.autor || 'Autor desconocido'}`,
          imagen: item.imagen || item.foto,
          data: item
        };
      
      case 'articulo':
        return {
          id: item.id,
          tipo: 'articulo',
          titulo: item.nombre || 'Artículo sin nombre',
          subtitulo: item.categoria || 'Sin categoría',
          imagen: item.imagen || item.foto,
          data: item
        };
      
      default:
        return {
          id: item.id,
          tipo,
          titulo: 'Sin título',
          subtitulo: '',
          data: item
        };
    }
  }

  updateResults(results: any) {
    this.perfil = results.perfil || [];
    this.publicaciones = results.publicaciones || [];
    this.articulos = results.articulos || [];
    this.filterResults();
  }

  clearResults() {
    this.perfil = [];
    this.publicaciones = [];
    this.articulos = [];
    this.filteredResults = [];
  }

  onFilterChange(event: any) {
    this.selectedFilter = event.detail.value;
    this.filterResults();
  }

  filterResults() {
    switch (this.selectedFilter) {
      case 'perfil':
        this.filteredResults = this.perfil;
        break;
      case 'publicaciones':
        this.filteredResults = this.publicaciones;
        break;
      case 'articulos':
        this.filteredResults = this.articulos;
        break;
      default:
        this.filteredResults = [
          ...this.perfil,
          ...this.publicaciones,
          ...this.articulos
        ];
    }
  }

  getResultCount(tipo?: string): number {
    switch (tipo) {
      case 'perfil':
        return this.perfil.length;
      case 'publicaciones':
        return this.publicaciones.length;
      case 'articulos':
        return this.articulos.length;
      default:
        return this.perfil.length + this.publicaciones.length + this.articulos.length;
    }
  }

  onResultClick(result: SearchResult) {
    switch (result.tipo) {
      case 'perfil':
        // Navegar al perfil de la persona
        this.router.navigate(['/perfil-detalle/', result.id]);
        break;
      case 'publicacion':
        // Navegar a la publicación
        this.router.navigate(['/publi/'+ result.id]);
        break;
      case 'articulo':
        // Navegar al artículo
        this.router.navigate(['/articulos/'+result.id]);
        break;
    }
  }

  getTypeIcon(tipo: string): string {
    switch (tipo) {
      case 'perfil':
        return 'person-circle-outline';
      case 'publicacion':
        return 'document-text-outline';
      case 'articulo':
        return 'leaf-outline';
      default:
        return 'search-outline';
    }
  }

  getTypeColor(tipo: string): string {
    switch (tipo) {
      case 'perfil':
        return 'primary';
      case 'publicacion':
        return 'secondary';
      case 'articulo':
        return 'success';
      default:
        return 'medium';
    }
  }

  clearSearch() {
    this.searchTerm = '';
    this.clearResults();
    this.hasSearched = false;
    this.selectedFilter = 'todos';
  }

  trackByFn(index: number, item: SearchResult): string {
    return item.id;
  }

  getDefaultImage(tipo: string): string {
    switch (tipo) {
      case 'perfil':
        return 'assets/img/default-avatar.jpeg';
      case 'publicacion':
        return 'assets/img/default-post.jpeg';
      case 'articulo':
        return 'assets/img/default-plant.jpeg';
      default:
        return 'assets/img/default-avatar.jpeg';
    }
  }

  onImageError(event: any, tipo: string) {
    event.target.src = this.getDefaultImage(tipo);
  }
}