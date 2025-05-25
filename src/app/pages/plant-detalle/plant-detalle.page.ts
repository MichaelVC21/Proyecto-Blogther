import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatabaseService } from 'src/app/services/database.service';

interface PlantEntry {
  id?: string;
  name?: string;
  familia?: string;
  day?: string;
  image?: string;
  description?: string;
  date?: any;
  userUid?: string;
}

@Component({
  selector: 'app-plant-detalle',
  templateUrl: './plant-detalle.page.html',
  styleUrls: ['./plant-detalle.page.scss'],
  standalone: false
})
export class PlantDetallePage implements OnInit {

  entryId!: string;
  entry?: PlantEntry;

  // Para el formulario
  entryForm!: FormGroup;
  showForm = false;

  userUid = '';

  constructor(
    private route: ActivatedRoute,
    private db: DatabaseService,
    private fb: FormBuilder,
    private navCtrl: NavController,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const profile = localStorage.getItem('profile');
    this.userUid = profile ? JSON.parse(profile).id : '';
    this.entryId = this.route.snapshot.paramMap.get('id')!;
  
    // inicializar el formulario
    this.entryForm = this.fb.group({
      description: ['', Validators.required],
      date: ['', Validators.required],
      name:      ['', Validators.required],
      familia:     [''],
      day:         [''],
      location:    [''],
      clima:       ['']
    });
  
    // Suscríbete a la colección entera y filtra por el id
    this.db.getDocument(`users/${this.userUid}/mis-plantas`, this.entryId)
    .subscribe(doc => {
    this.entry = doc;
    this.entryForm.patchValue({
      name:      doc.name    || '',
          familia:     doc.family    || '',
          day:         doc.day       || '',
          location:    doc.location  || '',
          clima:       doc.clima     || '',
          description: doc.description || '',
          date:        doc.date?.substring(0,10) || ''
    });
    this.cdr.detectChanges();
    });
    console.log('perfil', this.userUid);
  }

  back() {
    this.navCtrl.back();
  }

  /** Muestra el formulario de edición */
  editar() {
    console.log('Editar activado');
    this.showForm = true;
    this.cdr.detectChanges();
  }

  /** Cancela la edición */
  cancelar() {
    this.showForm = false;
    this.entryForm.reset({
      description: this.entry?.description || '',
      date: this.entry?.date ? this.entry.date.substring(0,10) : ''
    });
  }

  /** Guarda en Firestore y oculta form */
  guardar() {
    if (this.entryForm.invalid) {
      this.entryForm.markAllAsTouched();
      return;
    }
  
    const datos = {
      name:        this.entryForm.value.name,
      familia:     this.entryForm.value.familia,
      day:         this.entryForm.value.day,
      location:    this.entryForm.value.location,
      clima:       this.entryForm.value.clima,
      description: this.entryForm.value.description,
      date: this.entryForm.value.date,
      userUid: this.userUid
    };
  
    // Aquí llamamos al método de tu servicio para actualizar subcolección
    this.db.updateUserSubcollectionDocument(this.userUid, 'mis-plantas', this.entryId, datos)
      .then(() => {
        // actualizar localmente para reflejar cambios
        if (this.entry) {
          this.entry.description = datos.description;
          this.entry.name = datos.name;
          this.entry.familia = datos.familia;
          this.entry.day = datos.day;

        }
        this.showForm = false;
        this.cdr.detectChanges();
      })
      .catch(err => console.error('Error actualizando entrada:', err));
  }
  
}