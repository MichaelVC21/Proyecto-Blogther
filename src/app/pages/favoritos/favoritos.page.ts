import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';
import { ChangeDetectorRef } from '@angular/core'; // opcional, pero útil

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
  standalone: false,
})
export class FavoritosPage implements OnInit {

  favoritos: any;;

  constructor(
    public db: DatabaseService,
    public auth: AuthService,
    public cdr: ChangeDetectorRef,
  ) { 
    const profile = JSON.parse(localStorage.getItem('profile')!);
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
  }
  eliminarFavorito(favorito: any) {
    const uid = this.auth.profile.id;
    this.db.deleteDocument(`users/${uid}/favoritos`, favorito.id).then(() => {
      console.log('Favorito eliminado:', favorito);
      this.favoritos = this.favoritos.filter((f: any) => f.id !== favorito.id);
      this.cdr.detectChanges(); // Detecta cambios para actualizar la vista
    }).catch(error => {
      console.error('Error al eliminar favorito:', error);
    });
  }
}
