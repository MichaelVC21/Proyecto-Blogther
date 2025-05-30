import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { ChangeDetectorRef } from '@angular/core'; // opcional, pero útil
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-publicaciones',
  standalone: true,
  templateUrl: './publicaciones.component.html',
  styleUrls: ['./publicaciones.component.scss'],
  imports: [IonicModule, CommonModule, ReactiveFormsModule, RouterModule],
})
export class PublicacionesComponent  implements OnInit {

  publicaciones: any;
  publicacionSeleccionada: any = null;
  publiForm!: FormGroup;
  userUid: string;
  iconosActivos: { [publicacionId: string]: { heart: boolean, star: boolean, share: boolean } } = {};

  constructor(
    public auth: AuthService,
    public db: DatabaseService,
    public cdr: ChangeDetectorRef,
    public fb: FormBuilder,
    public router: Router,
  ) { 
    const profileData = localStorage.getItem('profile');
    if (profileData) {
      const profile = JSON.parse(profileData);
      this.userUid = profile.id;
    } else {
      console.warn('⚠️ No se encontró el perfil. El usuario podría no estar logueado.');
      this.userUid = ''; // O redirigí al login, o mostrale un mensaje.
    }
    this.db.fetchFirestoreCollection('Publicaciones').subscribe((data) => {
      this.publicaciones = data;
    
      for (const pub of this.publicaciones) {
        if (!this.iconosActivos[pub.id]) {
          this.iconosActivos[pub.id] = {
            heart: false,
            star: false,
            share: false
          };
        }
      }
    
      this.cdr.detectChanges();
    });
  }

  ngOnInit() {
    this.publiForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
    this.db.fetchFirestoreCollection('Publicaciones').subscribe((data) => {
      this.publicaciones = data;
    
      const uid = this.auth.profile?.id;
      if (uid) {
        this.db.fetchUserSubcollection(uid, 'interacciones').subscribe((interacciones: any[]) => {
          for (const pub of data) {
            const interaccion = interacciones.find(i => i.publicacionId === pub.id);
            this.iconosActivos[pub.id] = interaccion || { heart: false, star: false, share: false };
          }
    
          this.cdr.detectChanges();
        });
      }
    });
  }
  
  private safeBlurActiveElement(): void {
    const activeEl = document.activeElement;
    if (activeEl instanceof HTMLElement && typeof activeEl.blur === 'function') {
      activeEl.blur();
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
  
  
  editarPublicacion(publi: any) {
    this.publicacionSeleccionada = publi;
    this.publiForm.patchValue({
      titulo: publi.titulo,
      contenido: publi.contenido
    });
    this.cdr.detectChanges();
  }
  guardarCambios() {
    if (this.publiForm.valid) {
      const uid = this.auth.profile?.id; // Obtener el UID del usuario
  
      // Los datos que se van a guardar, incluyendo la fecha
      const datos = {
        ...this.publiForm.value,
        fecha: new Date(),
      };
  
      // 1. Actualizamos la publicación en la colección principal 'Publicaciones'
      this.db.updateFireStoreDocument('Publicaciones', this.publicacionSeleccionada.id, datos)
        .then(() => {
          console.log('Publicación actualizada en la colección general');
  
          // 2. Actualizamos la publicación en la subcolección 'mis-publicaciones'
          this.db.updateUserSubcollectionDocument(
            uid,                           // El UID del usuario
            'mis-publicaciones',           // La subcolección 'mis-publicaciones'
            this.publicacionSeleccionada.id, // El ID del documento a actualizar
            datos                          // Los nuevos datos de la publicación
          )
          .then(() => {
            console.log('Publicación actualizada en la subcolección mis-publicaciones');
            this.router.navigate(['/mis-publi']);
          })
          .catch(error => {
            console.error('Error al actualizar en la subcolección mis-publicaciones:', error);
          });
        })
        .catch(error => {
          console.error('Error al actualizar la publicación en la colección general:', error);
        });
    } else {
      this.publiForm.markAllAsTouched();
      console.log('Formulario inválido');
    }
  }
  
  
  cancelarEdicion() {
    this.publicacionSeleccionada = null;
    this.publiForm.reset();
  }


  eliminarPublicacion(publi: any) {
    const confirmacion = confirm('¿Estás seguro de que querés eliminar esta publicación?');
    if (!confirmacion) return;
  
    const uid = this.auth.profile?.id;
    const id = publi.id;
  
    // 1. Eliminar de la colección general
    this.db.deleteFirestoreDocument('Publicaciones', id)
      .then(() => {
        console.log('Eliminado de Publicaciones');
  
        // 2. Eliminar de la subcolección personal
        this.db.deleteUserSubcollectionDocument(uid, 'mis-publicaciones', id)
          .then(() => {
            console.log('Eliminado de mis-publicaciones');
            // Opcional: recargar publicaciones
            this.publicaciones = this.publicaciones.filter((p: any) => p.id !== id);
            this.cdr.detectChanges();
          })
          .catch(err => console.error('Error al eliminar de subcolección:', err));
      })
      .catch(err => console.error('Error al eliminar de Publicaciones:', err));
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
  onCardClick(publiId: string): void {
  this.safeBlurActiveElement(); // 👈 desenfoca
  this.router.navigate(['/publi', publiId]);
  }
}
