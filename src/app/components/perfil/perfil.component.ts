import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular'; // importa Ionic
import { CommonModule } from '@angular/common'; // opcional, pero útil
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { ChangeDetectorRef } from '@angular/core'; // opcional, pero útil

@Component({
  selector: 'app-perfilcomponent',
  standalone: true, // <-- importante
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  imports: [IonicModule, CommonModule], // <-- importa lo necesario
})
export class PerfilComponent  implements OnInit {

  descripcion: any;

  constructor(
    public auth: AuthService,
    public db: DatabaseService,
    public cdr: ChangeDetectorRef,
  ) { 
    const user = localStorage.getItem('profile');
    if(user){
      this.auth.profile = JSON.parse(user);
      this.db.getDocumentById("users",this.auth.profile.id).subscribe((data) => {
        console.log(data);
        this.descripcion = data.descripcion;
        this.cdr.detectChanges(); // Detecta cambios para actualizar la vista
      });
    }
  }

  ngOnInit() {}

}
