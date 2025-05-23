import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { switchMap } from 'rxjs/operators';

interface PlantEntry {
  image?: string;
  // ...otros campos que tengas en cada entrada
}

interface PlantCategory {
  id: string;
  name: string;
  entries: PlantEntry[];
}

@Component({
  selector: 'app-plantas',
  templateUrl: './plantas.page.html',
  styleUrls: ['./plantas.page.scss'],
  standalone: false,

})
export class PlantasPage {
  plantCategories: PlantCategory[] = [];

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    // Espera a que el usuario esté autenticado y carga sus plantas
    this.afAuth.authState
      .pipe(
        switchMap(user => {
          if (!user) {
            return []; 
          }
          // Asume colección: users/{uid}/plants
          return this.afs
            .collection<PlantCategory>(
              `users/${user.uid}/plants`,
              ref => ref.orderBy('name')
            )
            .valueChanges({ idField: 'id' });
        })
      )
      .subscribe(plants => {
        this.plantCategories = plants;
      });
  }

  goToDetail(plantId: string) {
    // Navega al detalle por días de esa planta
    this.navCtrl.navigateForward(['/plant-days', plantId]);
  }

  goToNewPlant() {
    // Navega a la página de creación
    this.navCtrl.navigateForward(['/new-plant']);
  }
}