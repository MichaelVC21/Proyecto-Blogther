import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

interface Publication {
  id: string;
  imagen: string;
  titulo: string;
  descripcion: string;
}

@Component({
  selector: 'app-buscador-scanner',
  templateUrl: './buscador-scanner.page.html',
  styleUrls: ['./buscador-scanner.page.scss'],
  standalone:false
})
export class BuscadorScannerPage implements OnInit, OnDestroy {
  selectedSegment: 'publicaciones' | 'articulos' = 'publicaciones';

  // Resultados que llegan de Firebase y luego se filtran
  publications: Publication[] = [];
  filteredPublications: Publication[] = [];

  private subs = new Subscription();
  private readonly FIXED_TERM = 'rosa';

  constructor(
    private navCtrl: NavController,
    private db: DatabaseService
  ) {}

  ngOnInit() {
    // 1) Traer todas las publicaciones desde Firestore
    const sub = this.db
      .fetchFirestoreCollection('Publicaciones')    // devuelve Observable<any[]>
      .pipe(
        map((docs: any[]) =>
          docs.map(d => ({
            id: d.id,
            imagen: d.imagen || d.foto || 'assets/img/default-post.jpeg',
            titulo: d.titulo || 'Sin título',
            descripcion: d.descripcion || '',
          }))
        ),
        // 2) Filtrar por la palabra fija "rosa"
        map((all: Publication[]) =>
          all.filter(
            p =>
              p.titulo.toLowerCase().includes(this.FIXED_TERM) ||
              p.descripcion.toLowerCase().includes(this.FIXED_TERM)
          )
        )
      )
      .subscribe(results => {
        this.publications = results;
        this.filteredPublications = results;
      });

    this.subs.add(sub);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  back() {
    this.navCtrl.back();
  }

  openDetail(pub: Publication) {
    this.navCtrl.navigateForward(['/publi', pub.id]);
  }

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
    // si añades artículos, aquí podrías recargar o filtrar otro array
  }

  trackById(_i: number, item: Publication) {
    return item.id;
  }
}
