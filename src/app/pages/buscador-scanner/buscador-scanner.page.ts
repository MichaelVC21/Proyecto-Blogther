import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

interface Publication {
  id: string;
  imagen: string;
  fecha: string;  
  titulo: string;
  descripcion: string;
  fechaGuardado?: string;
  uid?: string;
  userUid?: string;        
}

@Component({
  selector: 'app-buscador-scanner',
  templateUrl: './buscador-scanner.page.html',
  styleUrls: ['./buscador-scanner.page.scss'],
  standalone: false
})
export class BuscadorScannerPage implements OnInit, OnDestroy {
  selectedSegment: 'publicaciones' | 'articulos' = 'publicaciones';
  entryId = '';
  userUid = '';
  isFavorito = false;
  favoritoDocId?: string;

  publications: Publication[] = [];
  filteredPublications: Publication[] = [];

  private subs = new Subscription();
  private readonly FIXED_TERM = 'rosa';

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private db: DatabaseService,
    private auth: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // ID de la publicación (o escaneo) desde la ruta
    this.entryId = this.route.snapshot.paramMap.get('id')!;

    // UID del usuario actual
    const profile = localStorage.getItem('profile');
    this.userUid = profile ? JSON.parse(profile).id : 'demo-user';

    // 1) Traer publicaciones y filtrar por palabra fija
    const pubSub = this.db.fetchFirestoreCollection('Publicaciones')
      .pipe(
        map((docs: any[]) =>
          docs.map(d => ({
            id: d.id,
            imagen: d.imagen || d.foto || 'assets/img/default-post.jpeg',
            titulo: d.titulo || 'Sin título',
            descripcion: d.descripcion || '',
            fecha: d.fecha || ''
          }))
        ),
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
        this.cdr.detectChanges();
      });
    this.subs.add(pubSub);

    // 2) Comprobar si la "entry" (entryId) ya es favorito
    const favSub = this.db.fetchFirestoreCollection('favoritos')
      .subscribe((list: any[]) => {
        const fav = list.find(f =>
          f.itemId === this.entryId && f.userUid === this.userUid
        );
        this.isFavorito = !!fav;
        this.favoritoDocId = fav?.id;
        this.cdr.detectChanges();
      });
    this.subs.add(favSub);
  }

  toggleFavorite() {
    // Buscamos la publicación actual en la lista
    const pub = this.publications.find(p => p.id === this.entryId);
    if (!pub) {
      console.error('Publicación no encontrada para favorito');
      return;
    }

    if (this.isFavorito && this.favoritoDocId) {
      // --- Eliminar favorito ---
      this.db.deleteFirestoreDocument('favoritos', this.favoritoDocId)
        .then(() => {
          this.isFavorito = false;
          this.favoritoDocId = undefined;
        })
        .catch(err => console.error('Error al eliminar favorito', err));

    } else {
      // --- Agregar favorito con todos los datos ---
      const favoritoData = {
        ...pub,
        itemId: pub.id,
        userUid: this.userUid,
        fechaGuardado: new Date().toISOString()
      };
      this.db.addFirestoreDocument('favoritos', favoritoData)
        .then(docRef => {
          this.isFavorito = true;
          this.favoritoDocId = docRef.id;
        })
        .catch(err => console.error('Error al agregar favorito', err));
    }
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
  }

  trackById(_i: number, item: Publication) {
    return item.id;
  }
}
