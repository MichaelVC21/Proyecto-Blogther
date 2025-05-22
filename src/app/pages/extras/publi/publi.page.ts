import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-publi',
  templateUrl: './publi.page.html',
  styleUrls: ['./publi.page.scss'],
  standalone: false,
})
export class PubliPage implements OnInit {

  publicacion: any = null;
  
  constructor(
    public route: ActivatedRoute,
    public db: DatabaseService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.db.getDocumentById('Publicaciones', id).subscribe(data => {
        this.publicacion = data;
        console.log('📄 Publicación cargada:', this.publicacion);
      });
    }
  }

}
