import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { ChangeDetectorRef } from '@angular/core'; // opcional, pero útil

@Component({
  selector: 'app-mis-publi',
  templateUrl: './mis-publi.page.html',
  styleUrls: ['./mis-publi.page.scss'],
  standalone: false,
})
export class MisPubliPage implements OnInit {

  publicaciones: any;

  constructor(
    public db: DatabaseService,
    public auth: AuthService,
    public cdr: ChangeDetectorRef,
  ) { 
    
  }

  ngOnInit() {
    const uid = JSON.parse(localStorage.getItem('profile')!).id;
    if (uid) {
      this.db.getSubcollection(`users/${uid}`, 'mis-publicaciones').subscribe((data) => {
        console.log(data);
        this.publicaciones = data;
        this.cdr.detectChanges(); // Detecta cambios para actualizar la vista
      });
    }
  }

}
