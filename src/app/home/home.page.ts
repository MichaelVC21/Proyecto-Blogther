import { Component } from '@angular/core';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  constructor(
    public db: DatabaseService, // Cambiar el tipo de DataBase según su definición
  ) {
    // Ejemplo de uso de la función addFirestoreDocument
    // leer el archivo database.ts para mas informacion
    // this.db.addFirestoreDocument('plantas', {
    // nombre: "Menta",
    // familia: "Lamiaceae",
    // clima: "Templado",
    // lugar: "Europa y Asia",
    // descripcion: "Hierba aromática muy usada en cocina y medicina, de sabor fresco e intenso.",
    // imagen: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Mentha_piperita_-_Köhler–s_Medizinal-Pflanzen-096.jpg"
    // }).then((res) => {
    //   console.log('res', res.id);
    // }).catch((err) => {
    //   console.error('err', err);
    // })



    // Ejemplo de uso de la función fetchFirestoreCollection
    // this.db.fetchFirestoreCollection('users').subscribe((res: any[]) => {
    //   console.log('Usuario recuperado', res);
    // }), (err: any) => {
    //   console.error('Usuario no recuperado', err);
    // }
  }


  //TAREA!!!!!
  //CREAR UNA COLEECION DE PLANTAS



  loadCities(){
    let cities = [
      { name: 'Barcelona', country: 'Spain' },
      { name: 'Madrid', country: 'Spain' },
      { name: 'Paris', country: 'France' },
      { name: 'Berlin', country: 'Germany' },
      { name: 'London', country: 'UK' },
      { name: 'Rome', country: 'Italy' },
    ];
    cities.forEach((city: any) => {
      console.log('city cargada', city);
      // this.db.addFirestoreDocument('cities', city).then((res) => {
      //   console.log('ciudad guardada', res.id);
      // }).catch((err) => {
      //   console.error('err', err);
      // })
    });
  }
}
