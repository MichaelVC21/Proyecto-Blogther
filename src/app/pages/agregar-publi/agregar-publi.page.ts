import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agregar-publi',
  templateUrl: './agregar-publi.page.html',
  styleUrls: ['./agregar-publi.page.scss'],
  standalone: false,
})
export class AgregarPubliPage implements OnInit {

  publiForm: FormGroup;
  publicacionSeleccionada: any = null;

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

  guardarPublicacion() {
    if (this.publiForm.valid) {
      const uid = this.auth.profile?.id;
      const newId = this.db.firestore.createId();
  
      const datos = {
        ...this.publiForm.value,
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
          this.router.navigate(['/mis-publi']);
        })
        .catch(err => console.error('Error en subcolección:', err));
    } else {
      this.publiForm.markAllAsTouched();
      console.log('Formulario inválido');
    }
  }
}
