import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { DatabaseService } from './database.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Injectable({
  providedIn: 'root'
})
export class AuthService {


  profile: any;
  constructor(
     //private auth: Auth,
     public auth: AngularFireAuth,
     //private firestore: Firestore,
     public firestore: AngularFirestore,
     public db: DatabaseService,
     public router: Router
  ) { }




  async registerUser(email: string, password: string, additionalData: { name: string; phone: string; username: string }) {
    try {
      const userCredential: any = await this.auth.createUserWithEmailAndPassword(email, password);
      const userId = userCredential.user.uid;
      const userDocRef: any = this.firestore.collection('users').doc(userId).set(additionalData)
      setTimeout(() => {
        this.router.navigateByUrl('/login')
      }, 2000)
      console.log('Usuario registrado y documento creado en Firestore');
    } catch (error) {
      console.error('Error al registrar usuario:', error);
    }
  }


  async loginUser(email: string, password: string) {
    try {
      const userCredential: any = await this.auth.signInWithEmailAndPassword(email, password);
      localStorage.setItem('user', JSON.stringify(userCredential.user));
      console.log('Usuario autenticado:', userCredential.user);
      this.getProfile(userCredential.user.uid); ``
      this.router.navigateByUrl('/profile');
    } catch (error) {
      //alert('Error:' + error);
      console.error('Error al iniciar sesión:', error);
    }
  }


/*   verifyIsLogued() {
    let user = localStorage.getItem('user');
    this.isLogued = user ? true : false;
    return user ? true : false;
  }
*/
  getProfile(uid: any) {
    this.db.getDocumentById('users', uid)
      .subscribe(
        (res: any) => {
          console.log('perfil desde firebase', res)
          localStorage.setItem('profile', JSON.stringify(res));
          this.profile = res;
        },
        (error: any) => { console.log(error) })
  }


}