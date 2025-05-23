import { Injectable, Injector, runInInjectionContext } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore, Query } from '@angular/fire/compat/firestore';
import { Observable, combineLatest } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(
    public http: HttpClient,
    public firestore: AngularFirestore,
    private injector: Injector
  ) { }

  // Lee un archivo json en la carpeta /assets/db/ NOMBRE
  fetchLocalCollection(collection: string) {
    return this.http.get('assets/db/' + collection + '.json');
  }

  // Lee todos los registros de una colección en Fire Store
  fetchFirestoreCollection(collection: any): Observable<any[]> {
    return runInInjectionContext(this.injector, () => {
      return this.firestore.collection(collection).valueChanges({ idField: 'id' });
    });
  }

  // Guardar un documento en firestore, si no existe la colección la crea
  addFirestoreDocument(collectionName: string, collectionData: any) {
    return runInInjectionContext(this.injector, () => {
      return this.firestore.collection(collectionName).add(collectionData);
    });
  }

  // Actualiza la información de un documento o registro
  updateFireStoreDocument(collection: string, uid: string, data: any) {
    return runInInjectionContext(this.injector, () => {
      return this.firestore.collection(collection).doc(uid).update(data);
    });
  }

  // Elimina un documento o registro
  deleteFireStoreDocument(collection: string, id: string): Promise<void> {
    return runInInjectionContext(this.injector, () => {
      return this.firestore.collection(collection).doc(id).delete();
    });
  }

  // Recupera un documento o registro por su UID
  getDocumentById(collection: string, uid: string): Observable<any> {
    return runInInjectionContext(this.injector, () => {
      return this.firestore.collection(collection).doc(uid).valueChanges({ idField: 'id' });
    });
  }

  // Busca todos los registros o documentos de una colección que coincidan con los parámetros buscados
  getCollectionByCustomparam(collection: string, customParam: string, searched: string): Observable<any> {
    return runInInjectionContext(this.injector, () => {
      return this.firestore.collection(collection, ref => ref.where(customParam, '==', searched))
        .valueChanges({ idField: 'id' });
    });
  }

  getSubcollection(path: string, subcollection: string): Observable<any[]> {
    return runInInjectionContext(this.injector, () => {
      return this.firestore.collection(`${path}/${subcollection}`).valueChanges({ idField: 'id' });
    });
  }

  addUserSubcollectionDocument(userId: string, subcollection: string, data: any): Promise<any> {
    return runInInjectionContext(this.injector, () => {
      return this.firestore.collection(`users/${userId}/${subcollection}`).add(data);
    });
  }

  updateUserSubcollectionDocument(userId: string, subcollection: string, documentId: string, data: any): Promise<any> {
    return runInInjectionContext(this.injector, () => {
      return this.firestore.collection(`users/${userId}/${subcollection}`).doc(documentId).update(data);
    });
  }

  addFirestoreDocumentWithId(collectionName: string, id: string, data: any) {
    return runInInjectionContext(this.injector, () => {
      return this.firestore.collection(collectionName).doc(id).set(data);
    });
  }
  
  addUserSubcollectionDocumentWithId(userId: string, subcollection: string, id: string, data: any) {
    return runInInjectionContext(this.injector, () => {
      return this.firestore.collection(`users/${userId}/${subcollection}`).doc(id).set(data);
    });
  }

  // Elimina documento de cualquier colección
  deleteFirestoreDocument(collectionName: string, docId: string): Promise<void> {
    return runInInjectionContext(this.injector, () => {
      return this.firestore.collection(collectionName).doc(docId).delete();
    });
  }
  
  // Elimina documento de una subcolección del usuario
  deleteUserSubcollectionDocument(userId: string, subcollection: string, docId: string): Promise<void> {
    return runInInjectionContext(this.injector, () => {
      return this.firestore.collection(`users/${userId}/${subcollection}`).doc(docId).delete();
    });
  }

  // Verifica si un documento existe en una colección
  async documentExists(collection: string, uid: string): Promise<boolean> {
    try {
      const doc = await firstValueFrom(this.getDocumentById(collection, uid));
      return !!doc;
    } catch (err) {
      return false;
    }
  }

  // Búsqueda por texto que empieza con un string
  searchCollectionByFieldPrefix(
    collection: string,
    field: string,
    searchText: string
  ): Observable<any[]> {
    const endText = searchText.replace(/.$/, c => String.fromCharCode(c.charCodeAt(0) + 1));

    return runInInjectionContext(this.injector, () => {
      return this.firestore.collection(collection, ref =>
        ref.where(field, '>=', searchText).where(field, '<', endText)
      ).valueChanges({ idField: 'id' });
    });
  }

  // Consulta dinámica con múltiples filtros
  getCollectionByFilters(
    collection: string,
    filters: { field: string, operator: firebase.default.firestore.WhereFilterOp, value: any }[],
    orderByField?: string,
    orderDirection: 'asc' | 'desc' = 'asc',
    limitResults?: number
  ): Observable<any[]> {
    return runInInjectionContext(this.injector, () => {
      return this.firestore.collection(collection, ref => {
        let query: firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;
        // Aplicar filtros dinámicamente
        filters.forEach(filter => {
          query = query.where(filter.field, filter.operator, filter.value);
        });
        // Aplicar ordenamiento si existe
        if (orderByField) {
          query = query.orderBy(orderByField, orderDirection);
        }
        // Limitar resultados si se pidió
        if (limitResults) {
          query = query.limit(limitResults);
        }
        return query;
      }).valueChanges({ idField: 'id' });
    });
  }

  // ========================
  // MÉTODOS ESPECÍFICOS PARA BÚSQUEDA GLOBAL
  // ========================

  // Búsqueda global en múltiples colecciones
  globalSearch(searchTerm: string): Observable<{
    personas: any[],
    publicaciones: any[],
    articulos: any[]
  }> {
    const termLower = searchTerm.toLowerCase();
    
    const personasSearch = this.searchPersonas(termLower);
    const publicacionesSearch = this.searchPublicaciones(termLower);
    const articulosSearch = this.searchArticulos(termLower);

    return combineLatest([personasSearch, publicacionesSearch, articulosSearch]).pipe(
      map(([personas, publicaciones, articulos]) => ({
        personas,
        publicaciones,
        articulos
      }))
    );
  }

  // Búsqueda específica en Personas
  private searchPersonas(searchTerm: string): Observable<any[]> {
    return this.fetchFirestoreCollection('Personas').pipe(
      map(personas => personas.filter(persona => {
        const searchFields = [
          persona.nombre,
          persona.apellido,
          persona.username,
          persona.email,
          persona.bio
        ];
        return searchFields.some(field => 
          field && field.toLowerCase().includes(searchTerm)
        );
      }))
    );
  }

  // Búsqueda específica en Publicaciones
  private searchPublicaciones(searchTerm: string): Observable<any[]> {
    return this.fetchFirestoreCollection('Publicaciones').pipe(
      map(publicaciones => publicaciones.filter(publicacion => {
        const searchFields = [
          publicacion.titulo,
          publicacion.descripcion,
          publicacion.categoria,
          publicacion.tags,
          publicacion.autor
        ];
        return searchFields.some(field => 
          field && field.toLowerCase().includes(searchTerm)
        );
      }))
    );
  }

  // Búsqueda específica en Artículos
  private searchArticulos(searchTerm: string): Observable<any[]> {
    return this.fetchFirestoreCollection('Articulos').pipe(
      map(articulos => articulos.filter(articulo => {
        const searchFields = [
          articulo.nombre,
          articulo.categoria,
          articulo.informacion,
          articulo.curiosidades,
          articulo.plagas,
          articulo.interior,
          articulo.exterior
        ];
        return searchFields.some(field => 
          field && field.toLowerCase().includes(searchTerm)
        );
      }))
    );
  }

  // Búsqueda optimizada por categoría específica
  searchByCategory(searchTerm: string, category: 'personas' | 'publicaciones' | 'articulos'): Observable<any[]> {
    switch (category) {
      case 'personas':
        return this.searchPersonas(searchTerm.toLowerCase());
      case 'publicaciones':
        return this.searchPublicaciones(searchTerm.toLowerCase());
      case 'articulos':
        return this.searchArticulos(searchTerm.toLowerCase());
      default:
        return this.fetchFirestoreCollection(category);
    }
  }

  // Búsqueda por múltiples términos
  multiTermSearch(terms: string[]): Observable<{
    personas: any[],
    publicaciones: any[],
    articulos: any[]
  }> {
    const searches = terms.map(term => this.globalSearch(term));
    
    return combineLatest(searches).pipe(
      map(results => {
        // Combinar y deduplicar resultados
        const combinedPersonas = new Map();
        const combinedPublicaciones = new Map();
        const combinedArticulos = new Map();

        results.forEach(result => {
          result.personas.forEach(p => combinedPersonas.set(p.id, p));
          result.publicaciones.forEach(p => combinedPublicaciones.set(p.id, p));
          result.articulos.forEach(a => combinedArticulos.set(a.id, a));
        });

        return {
          personas: Array.from(combinedPersonas.values()),
          publicaciones: Array.from(combinedPublicaciones.values()),
          articulos: Array.from(combinedArticulos.values())
        };
      })
    );
  }

  // Búsqueda con límite de resultados para optimizar performance
  searchWithLimit(searchTerm: string, limit: number = 10): Observable<{
    personas: any[],
    publicaciones: any[],
    articulos: any[]
  }> {
    return this.globalSearch(searchTerm).pipe(
      map(results => ({
        personas: results.personas.slice(0, limit),
        publicaciones: results.publicaciones.slice(0, limit),
        articulos: results.articulos.slice(0, limit)
      }))
    );
  }
}