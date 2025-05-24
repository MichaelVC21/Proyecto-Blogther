import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatabaseService } from 'src/app/services/database.service';

interface PlantEntry {
  id?: string;
  nombre?: string;
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
    this.entryId = this.route.snapshot.paramMap.get('id')!;
  
    // inicializar el formulario
    this.entryForm = this.fb.group({
      description: ['', Validators.required],
      date: ['', Validators.required]
    });
  
    // Suscríbete a la colección entera y filtra por el id
    this.db.fetchFirestoreCollection('plantas')
      .subscribe(list => {
        const found = list.find(item => item.id === this.entryId);
        if (found) {
          this.entry = found;
          // parchea el form usando substring(0,10) si date es string ISO
          this.entryForm.patchValue({
            description: found.description,
            date: found.date ? found.date.substring(0,10) : ''
          });
          this.cdr.detectChanges();
        }
      });
  }

  back() {
    this.navCtrl.back();
  }

  /** Muestra el formulario de edición */
  editar() {
    this.showForm = true;
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
      description: this.entryForm.value.description,
      date: this.entryForm.value.date,
      userUid: this.userUid
    };

    this.db.updateFireStoreDocument('plantas', this.entryId, datos)
      .then(() => {
        // refrescar local
        if (this.entry) {
          this.entry.description = datos.description;
          this.entry.date = datos.date;
        }
        this.showForm = false;
      })
      .catch(err => console.error('Error actualizando entrada:', err));
  }
}
