import { AfterViewInit, Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { DatabaseService } from 'src/app/services/database.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-articulos',
  standalone: true,
  templateUrl: './articulos.component.html',
  styleUrls: ['./articulos.component.scss'],
  imports: [IonicModule, CommonModule],
})
export class ArticulosComponent  implements OnInit, AfterViewInit {

  plantas: any; // ✅ nombre coherente con el HTML

  constructor(
    public db: DatabaseService,
    public cdr: ChangeDetectorRef,
  ) {
    
  }
  ngOnInit() { 
    this.fetchPlantas()
   }
  ngAfterViewInit() {this.fetchPlantas()}
    // Aquí puedes realizar acciones adicionales después de que la vista se haya inicializado


  fetchPlantas(){
    this.db.fetchFirestoreCollection('Articulos').subscribe((data) => {
      console.log(data); // Verifica aquí si los datos son correctos
      this.plantas = data; // ✅ asigna los datos al array esperado en el HTML
      this.cdr.detectChanges(); // Detecta cambios para actualizar la vista
    });
  }

}
