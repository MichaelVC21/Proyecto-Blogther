import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';
import { ChangeDetectorRef } from '@angular/core'; // opcional, pero útil
import { Router } from '@angular/router';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
  standalone: false,
})
export class FavoritosPage implements OnInit {

  favoritos: any;;
  publicaciones: any;
  userUid: string;
  articulos: any;

  constructor(
    public db: DatabaseService,
    public auth: AuthService,
    public cdr: ChangeDetectorRef,
    public router: Router,
  ) { 
    const profile = JSON.parse(localStorage.getItem('profile')!);
    this.userUid = profile.id;
    if (profile) {
      this.auth.profile = profile;
      this.db.getSubcollection(`users/${this.auth.profile.id}`, 'favoritos').subscribe((data) => {
        console.log(data);
        this.favoritos = data;
        this.cdr.detectChanges(); // Detecta cambios para actualizar la vista
      });
    }
  }

  ngOnInit() {
    const profile = JSON.parse(localStorage.getItem('profile')!);
    this.userUid = profile.id;
  
    // Cargar favoritos desde subcolección del usuario
    this.db.getSubcollection(`users/${this.userUid}`, 'favoritos').subscribe((favoritosData: any[]) => {
      this.favoritos = favoritosData; // Guarda los favoritos "raw"
      const favoritoIds = favoritosData.map(f => f.id);
  
      // Cargar publicaciones y filtrar solo las favoritas
      this.db.fetchFirestoreCollection('Publicaciones').subscribe((publicacionesData: any[]) => {
        this.publicaciones = publicacionesData.filter(p => favoritoIds.includes(p.id));
        this.cdr.detectChanges();
      });
  
      // Cargar artículos y filtrar solo los favoritos
      this.db.fetchFirestoreCollection('Articulos').subscribe((articulosData: any[]) => {
        this.articulos = articulosData.filter(a => favoritoIds.includes(a.id));
        this.cdr.detectChanges();
      });
    });
  }

  private safeBlurActiveElement(): void {
    const activeEl = document.activeElement;
    if (activeEl instanceof HTMLElement && typeof activeEl.blur === 'function') {
      activeEl.blur();
    }
  }

  eliminarFavorito(favorito: any) {
    const uid = this.auth.profile.id;
    this.db.deleteDocument(`users/${uid}/favoritos`, favorito.id).then(() => {
      console.log('Favorito eliminado:', favorito);
      
      // Quitarlo de las listas locales
      this.publicaciones = this.publicaciones.filter((f: any) => f.id !== favorito.id);
      this.articulos = this.articulos.filter((f: any) => f.id !== favorito.id);
      this.cdr.detectChanges();
    }).catch(error => {
      console.error('Error al eliminar favorito:', error);
    });
  }
  onCardClick(publiId: string): void {
    this.safeBlurActiveElement(); // 👈 desenfoca
    this.router.navigate(['/publi', publiId]);
  }
}
