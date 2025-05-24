import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatabaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';
import { ChangeDetectorRef } from '@angular/core';

interface Tarea {
  id?: string;
  nombre: string;
  fecha: string; // 'yyyy-MM-dd'
  hora?: string;
  userUid?: string;
}

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.page.html',
  styleUrls: ['./calendario.page.scss'],
  standalone: false,
})
export class CalendarioPage implements OnInit {
  tareas: Tarea[] = [];
  
  tareaSeleccionada: Tarea | null = null;
  tareaForm!: FormGroup;
  showForm: boolean = false;
  userUid: string = '';
  // Calendario visual
  selectedDate: string = new Date().toISOString().substring(0, 10);
tareasDelDia: any[] = [];

  selectedMonth: Date = new Date();
  mostrarTareas: boolean = false;


  constructor(
    public db: DatabaseService,
    public auth: AuthService,
    public cdr: ChangeDetectorRef,
    public fb: FormBuilder
  ) {
    // Usuario de prueba seguro
    const profileString = localStorage.getItem('profile');
    if (profileString) {
      const profile = JSON.parse(profileString);
      this.userUid = profile.id;
    } else {
      this.userUid = 'demo-user';
    }
    // Cargar tareas
    this.db.fetchFirestoreCollection('Recordatorios').subscribe((data) => {
      this.tareas = data.map((r: any) => ({
        ...r,
        fecha: (r.fecha ?? '').substring(0, 10), // Normaliza formato
      }));
      this.updateTareasDelDia();
      this.cdr.detectChanges();
    });
  }

  ngOnInit() {
    this.tareaForm = this.fb.group({
      nombre: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['']
    });
    
  }
  
  onCalendarChange(event: any) {
    this.selectedDate = event.detail.value.substring(0, 10);
    this.updateTareasDelDia();
    this.mostrarTareas = true;
  }
  
  updateTareasDelDia() {
    this.tareasDelDia = this.tareas.filter(t =>
      t.fecha === this.selectedDate && (!t.userUid || t.userUid === this.userUid)
    );
  }
  seleccionarTarea(tarea: Tarea) {
    this.tareaSeleccionada = tarea;
  }
  

  // --- CRUD TAREAS ---
  agregarTarea() {
    this.tareaSeleccionada = null;
    this.tareaForm.reset();
    this.tareaForm.patchValue({ fecha: this.selectedDate });
    this.showForm = true;
  }

  editarTarea(tarea: Tarea) {
    this.tareaSeleccionada = tarea;
    this.tareaForm.patchValue({
      nombre: tarea.nombre,
      fecha: tarea.fecha,
      hora: tarea.hora || ''
    });
    this.showForm = true;
  }

  guardarTarea() {
    if (this.tareaForm.valid) {
      const datos: Tarea = {
        ...this.tareaForm.value,
        userUid: this.userUid,
        fecha: this.tareaForm.value.fecha
      };
      if (this.tareaSeleccionada && this.tareaSeleccionada.id) {
        this.db.updateFireStoreDocument('Recordatorios', this.tareaSeleccionada.id, datos)
          .then(() => {
            this.showForm = false;
            this.tareaSeleccionada = null;
            this.tareaForm.reset();
            this.updateTareasDelDia();
          })
          .catch(error => {
            console.error('Error al actualizar tarea:', error);
          });
      } else {
        this.db.addFirestoreDocument('Recordatorios', datos)
          .then(() => {
            this.showForm = false;
            this.tareaForm.reset();
            this.updateTareasDelDia();
          })
          .catch(error => {
            console.error('Error al agregar tarea:', error);
          });
      }
    } else {
      this.tareaForm.markAllAsTouched();
    }
  }

  eliminarTarea(tarea: Tarea) {
    const confirmacion = confirm('¿Eliminar esta tarea?');
    if (!confirmacion || !tarea.id) return;
    this.db.deleteFirestoreDocument('Recordatorios', tarea.id)
      .then(() => {
        this.tareas = this.tareas.filter(t => t.id !== tarea.id);
        this.updateTareasDelDia();
        this.cdr.detectChanges();
      })
      .catch(error => {
        console.error('Error al eliminar tarea:', error);
      });
  }

  cancelarTarea() {
    this.showForm = false;
    this.tareaSeleccionada = null;
    this.tareaForm.reset();
  }
}