import { Component } from '@angular/core';
import { DatabaseService } from './services/database.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(
    public db: DatabaseService
  ) {
    // this.db.fetchFirestoreCollection('Articulos')
    // .subscribe((res: any[]) => console.log(res));
  }
}
