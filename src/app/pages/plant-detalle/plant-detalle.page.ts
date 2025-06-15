import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatabaseService } from 'src/app/services/database.service';

interface PlantEntry {
  id?: string;
  name?: string;
  familia?: string;
  image?: string;
  description?: string;
  userUid?: string;
  location?: string;
  clima?: string;
  date?: string;
}

@Component({
  selector: 'app-plant-detalle',
  templateUrl: './plant-detalle.page.html',
  styleUrls: ['./plant-detalle.page.scss'],
  standalone: false
})
export class PlantDetallePage implements OnInit {

  plantId!: string;
  historialId!: string;
  plantData: any;
  entry?: PlantEntry;

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
    this.plantId = this.route.snapshot.paramMap.get('plantId')!;
    this.historialId = this.route.snapshot.paramMap.get('historialId')!;
  
    this.entryForm = this.fb.group({
      description: ['', Validators.required],
      date: ['', Validators.required],
      name: ['', Validators.required],
      familia: [''],
      location: [''],
      clima: ['']
    });
  
    // 1. Cargar el historial (registro diario)
    this.db.getDocument(`users/${this.userUid}/mis-plantas/${this.plantId}/historial`, this.historialId)
      .subscribe(doc => {
        this.entry = doc;
        this.entryForm.patchValue({
          description: doc.description || '',
          date: doc.date ? doc.date.substring(0, 10) : ''
        });
        this.cdr.detectChanges();
      });
  
    // 2. Cargar la planta base (para nombre, familia, etc.)
    this.db.getDocument(`users/${this.userUid}/mis-plantas`, this.plantId)
      .subscribe(plant => {
        this.plantData = plant;
        this.entryForm.patchValue({
          name: plant.name || '',
          familia: plant.familia || '',
          location: plant.location || '',
          clima: plant.clima || ''
        });
        this.cdr.detectChanges();
      });
  }  

  back() {
    this.navCtrl.back();
  }

  editar() {
    this.showForm = true;
    this.entryForm.get('name')?.disable();
    this.entryForm.get('familia')?.disable();
    this.cdr.detectChanges();
  }

  cancelar() {
    this.showForm = false;
    this.entryForm.reset({
      description: this.entry?.description || '',
    });
  }

  guardar() {
    if (this.entryForm.invalid) {
      this.entryForm.markAllAsTouched();
      return;
    }
  
    const rawValues = this.entryForm.getRawValue(); // Incluye campos deshabilitados
  
    // Datos para actualizar el historial
    const historialData = {
      description: rawValues.description,
      date: rawValues.date
    };
  
    // Datos para actualizar la planta principal
    const plantaData = {
      name: rawValues.name,
      familia: rawValues.familia,
      location: rawValues.location,
      clima: rawValues.clima
    };
  
    // 1. Actualizar historial
    const updateHistorial = this.db.updateUserSubcollectionDocument(
      this.userUid,
      `mis-plantas/${this.plantId}/historial`,
      this.historialId,
      historialData
    );
  
    // 2. Actualizar planta principal
    const updatePlanta = this.db.updateUserSubcollectionDocument(
      this.userUid,
      'mis-plantas',
      this.plantId,
      plantaData
    );
  
    // Ejecutar ambas promesas en paralelo
    Promise.all([updateHistorial, updatePlanta])
      .then(() => {
        console.log('✅ Ambos documentos actualizados con éxito');
        this.showForm = false;
        this.cdr.detectChanges();
      })
      .catch(err => {
        console.error('❌ Error al actualizar:', err);
      });
  }
  
}
