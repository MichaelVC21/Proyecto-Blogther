import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-agregar-publi',
  templateUrl: './agregar-publi.page.html',
  styleUrls: ['./agregar-publi.page.scss'],
  standalone: false,
})
export class AgregarPubliPage implements OnInit {

  publiForm: FormGroup;
  publicacionSeleccionada: any = null;
  imagenBase64: string | null = null;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    public auth: AuthService,
    public db: DatabaseService,
    public cdr: ChangeDetectorRef,
    public fb: FormBuilder,
    public router: Router
  ) {
    this.publiForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required]
    });

    const user = localStorage.getItem('profile');
    if (user) {
      this.auth.profile = JSON.parse(user);
      this.db.getDocumentById("users", this.auth.profile.id).subscribe((data) => {
        console.log(data);
        this.cdr.detectChanges();
      });
    }
  }

  ngOnInit() {}

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  cargarImagen(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenBase64 = reader.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  guardarPublicacion() {
    if (this.publiForm.valid) {
      const uid = this.auth.profile?.id;
      const newId = this.db.firestore.createId();

      const datos = {
        ...this.publiForm.value,
        imagen: this.imagenBase64,  // Guardamos la imagen base64 aquí
        uid: uid,
        fecha: new Date(),
        id: newId
      };

      this.db.addFirestoreDocumentWithId('Publicaciones', newId, datos)
        .then(() => console.log('Guardado en Publicaciones'))
        .catch(err => console.error('Error en Publicaciones:', err));

      this.db.addUserSubcollectionDocumentWithId(uid, 'mis-publicaciones', newId, datos)
        .then(() => {
          console.log('Guardado en subcolección');
          this.publiForm.reset();
          this.imagenBase64 = null;  // Limpiar la imagen seleccionada
          this.router.navigate(['/mis-publi']);
        })
        .catch(err => console.error('Error en subcolección:', err));
    } else {
      this.publiForm.markAllAsTouched();
      console.log('Formulario inválido');
    }
  }
}
