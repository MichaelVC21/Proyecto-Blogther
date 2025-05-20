import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';  

@Component({
  selector: 'app-articulo',
  templateUrl: './articulos.page.html',
  styleUrls: ['./articulos.page.scss'],
  standalone: false,
})
export class ArticulosPage implements OnInit {

  plantas: any; // ✅ nombre coherente con el HTML
  constructor(
    public db: DatabaseService,
  ) { 
    
  }

  ngOnInit() {
    // this.fetchPlantas();
  }
  // fetchPlantas(){
  //   this.db.fetchFirestoreCollection('plantas').subscribe((data) => {
  //     console.log(data); // Verifica aquí si los datos son correctos
  //     this.plantas = data; // ✅ asigna los datos al array esperado en el HTML
  //   });
  // }
}
