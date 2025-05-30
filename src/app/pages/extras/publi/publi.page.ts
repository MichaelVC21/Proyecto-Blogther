import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';
import { ChangeDetectorRef } from '@angular/core'; // opcional, pero útil

@Component({
  selector: 'app-publi',
  templateUrl: './publi.page.html',
  styleUrls: ['./publi.page.scss'],
  standalone: false,
})
export class PubliPage implements OnInit {

  publicacion: any = null;
  publicaciones: any[] = [];
  iconosActivos: { [publicacionId: string]: { heart: boolean, star: boolean, share: boolean } } = {};
  
  constructor(
    public route: ActivatedRoute,
    public db: DatabaseService,
    public auth: AuthService,
    public cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.db.getDocumentById('Publicaciones', id).subscribe(data => {
        this.publicacion = data;
  
        const pubId = this.publicacion?.id;
        if (pubId && !this.iconosActivos[pubId]) {
          this.iconosActivos[pubId] = { heart: false, star: false, share: false };
        }
  
        const uid = this.auth.profile?.id;
        if (uid && pubId) {
          this.db.getDocument(`users/${uid}/interacciones`, pubId).subscribe(interaccion => {
            if (interaccion) {
              this.iconosActivos[pubId] = {
                heart: interaccion.heart || false,
                star: interaccion.star || false,
                share: interaccion.share || false,
              };
            } else {
              this.iconosActivos[pubId] = { heart: false, star: false, share: false };
            }
  
            // 👉 Forzar actualización de la vista
            this.cdr.detectChanges();
          });
        }
      });
    }
  }
  
  toggleIcon(pubId: string, icon: 'heart' | 'star' | 'share') {
    if (!this.iconosActivos[pubId]) {
      this.iconosActivos[pubId] = { heart: false, star: false, share: false };
    }
  
    this.iconosActivos[pubId][icon] = !this.iconosActivos[pubId][icon];
  
    const uid = this.auth.profile?.id;
    if (!uid) return;
  
    const datosAGuardar = {
      ...this.iconosActivos[pubId],
      publicacionId: pubId
    };
    // Guardar interacción
    this.db.addUserSubcollectionDocumentWithId(uid, 'interacciones', pubId, datosAGuardar)
      .then(() => {
        console.log(`Interacción guardada para ${pubId}`);
      })
      .catch(err => {
        console.error('Error al guardar interacción:', err);
      });
  
    // Manejar favoritos solo si es estrella
    if (icon === 'star') {
      if (this.iconosActivos[pubId].star) {
        // guardar favorito
        const publi = this.publicaciones.find((p: any) => p.id === pubId);
        if (publi) {
          const datosFavorito = {
            ...publi,
            publicacionId: publi.id,
            fechaGuardado: new Date()
          };
          this.db.addUserSubcollectionDocumentWithId(uid, 'favoritos', pubId, datosFavorito)
            .then(() => console.log('Favorito guardado'))
            .catch(err => console.error('Error al guardar favorito:', err));
        }
      } else {
        // ✅ nuevo método que verifica antes de borrar
        this.db.eliminarFavoritoSiExiste(uid, pubId)
          .catch(err => console.error('Error eliminando favorito:', err));
      }
    }
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
