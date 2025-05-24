import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IonHeader, IonFooter } from "@ionic/angular/standalone";

interface Publication {
  id: string;
  image: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-buscador-scanner',
  templateUrl: './buscador-scanner.page.html',
  styleUrls: ['./buscador-scanner.page.scss'],
  standalone:false
})
export class BuscadorScannerPage implements OnInit {
  // “Artículos” es la única pestaña de momento
  selectedSegment = 'articulos';

  // Datos simulados; aquí luego llamas a tu servicio real
  publications: Publication[] = [];

  constructor(private navCtrl: NavController) {}

  ngOnInit() {
    // Simula carga de resultados
    this.publications = [
      {
        id: '1',
        image: 'assets/placeholder.svg',
        title: 'Sabías que la rosa verde…',
        description: 'Después de meses de cuidados y paciencia, mi orquídea finalmente ha florecido! 🌸'
      },
      {
        id: '2',
        image: 'assets/placeholder.svg',
        title: 'Rosas verdes',
        description: 'Después de meses de cuidados y paciencia, mi orquídea finalmente ha florecido! 🌼'
      }
    ];
  }

  back() {
    this.navCtrl.back();
  }

  openDetail(pub: Publication) {
    // Vincula con tu ruta de detalle:
    this.navCtrl.navigateForward(['/article-detail', pub.id]);
  }
}
