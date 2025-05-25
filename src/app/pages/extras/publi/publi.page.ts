import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-publi',
  templateUrl: './publi.page.html',
  styleUrls: ['./publi.page.scss'],
  standalone: false,
})
export class PubliPage implements OnInit {

  publicacion: any = null;
  iconosActivos: { [publicacionId: string]: { heart: boolean, star: boolean, share: boolean } } = {};
  
  constructor(
    public route: ActivatedRoute,
    public db: DatabaseService,
    public auth: AuthService,
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.db.getDocumentById('Publicaciones', id).subscribe(data => {
        this.publicacion = data;
        console.log('📄 Publicación cargada:', this.publicacion);
      });
    }
  }
  toggleIcon(pubId: string, icon: 'heart' | 'star' | 'share') {
    if (!this.iconosActivos[pubId]) {
      this.iconosActivos[pubId] = { heart: false, star: false, share: false };
    }
  
    this.iconosActivos[pubId][icon] = !this.iconosActivos[pubId][icon];
  }
  guardarEnFavoritos(publi: any) {
    const uid = this.auth.profile?.id;
  
    if (!uid) {
      console.error('Usuario no autenticado');
      return;
    }
  
    const datos = {
      ...publi,
      fechaGuardado: new Date()
    };
  
    this.db.addUserSubcollectionDocumentWithId(uid, 'favoritos', publi.id, datos)
      .then(() => {
        console.log('Publicación guardada en favoritos');
        // Opcional: feedback visual o mensaje
      })
      .catch(err => {
        console.error('Error al guardar en favoritos:', err);
      });
  }

}
