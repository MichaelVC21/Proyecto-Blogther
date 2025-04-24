import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore, Query } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { DocumentData } from 'firebase/firestore'; // Asegúrate de importar DocumentData

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(
    public http: HttpClient,
    public firestore: AngularFirestore
  ) { }
  test() {
    console.log('test')
  }
  // Lee todos los registros de una colección en Fire Store
  fetchFirestoreCollection(collection: any): Observable<any[]> {
    return this.firestore.collection(collection).valueChanges({ idField: 'id' });
  }
}