import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { ChangeDetectorRef } from '@angular/core'; // opcional, pero útil
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-publicaciones',
  standalone: true,
  templateUrl: './publicaciones.component.html',
  styleUrls: ['./publicaciones.component.scss'],
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class PublicacionesComponent  implements OnInit {

  publicaciones: any;
  publicacionSeleccionada: any = null;
  publiForm!: FormGroup;
  userUid: string;

  constructor(
    public auth: AuthService,
    public db: DatabaseService,
    public cdr: ChangeDetectorRef,
    public formBuilder: FormBuilder,
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
    this.publiForm = this.formBuilder.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
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
}
