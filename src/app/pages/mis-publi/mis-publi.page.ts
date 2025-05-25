import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { ChangeDetectorRef } from '@angular/core'; // opcional, pero útil
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mis-publi',
  templateUrl: './mis-publi.page.html',
  styleUrls: ['./mis-publi.page.scss'],
  standalone: false,
})
export class MisPubliPage implements OnInit {

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
    const profile = JSON.parse(localStorage.getItem('profile')!);
    this.userUid = profile.id;
    this.db.fetchFirestoreCollection('Publicaciones').subscribe((data) => {
      console.log(data);
      console.log('🧾 Publicaciones:', data); 
      
      this.publicaciones = data;
      this.cdr.detectChanges(); // Detecta cambios para actualizar la vista
    })
  }

  ngOnInit() {
    const uid = JSON.parse(localStorage.getItem('profile')!).id;
    if (uid) {
      this.db.getSubcollection(`users/${uid}`, 'mis-publicaciones').subscribe((data) => {
        console.log(data);
        this.publicaciones = data;

        // ✅ Inicializa los íconos al cargar publicaciones
        data.forEach(pub => {
          if (!this.iconosActivos[pub.id]) {
            this.iconosActivos[pub.id] = {
              heart: false,
              star: false,
              share: false
            };
          }
        });

        this.cdr.detectChanges();
      });
    }

    this.publiForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
  }
  toggleIcon(pubId: string, icon: 'heart' | 'star' | 'share') {
    if (!this.iconosActivos[pubId]) {
      this.iconosActivos[pubId] = { heart: false, star: false, share: false };
    }
  
    this.iconosActivos[pubId][icon] = !this.iconosActivos[pubId][icon];
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
}
