import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { DatabaseService } from './database.service';
import { ToastController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getApp } from "firebase/app";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  profile: any;
  private firestoreModular = getFirestore(getApp());

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    public toastCtrl: ToastController,
    public db: DatabaseService,
    public router: Router,
  ) { 
    const user = localStorage.getItem('profile');
    if(user){
      this.profile = JSON.parse(user);
      this.getProfile(this.profile.id);
    }
  }

  async registerUser(email: string, password: string, extraData: any): Promise<string> {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const uid = userCredential.user?.uid;
      if (!uid) throw new Error('UID no disponible');
  
      const defaultProfile = {
        name: extraData.username,
        username: extraData.username,
        usertype: 'freemium',
        foto_perfil: '',
        descripcion: '',
        phone: '',
        seguidores: 0,
        seguidos: 0,
        estadoPago: 'gratis',
        metodoPago: '',
        fechaSuscripcion: new Date().toISOString(),
        fechaVencimiento: '',
        planSuscripcion: 'freemium',
        precioPageado: 0
      };
  
      await this.db.addFirestoreDocumentWithId('users', uid, defaultProfile);
  
      this.profile = { id: uid, ...defaultProfile }; // Actualiza el perfil
      localStorage.setItem('profile', JSON.stringify(this.profile));
  
      console.log('Usuario y perfil creados correctamente');
      return uid;
  
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      throw error;
    }
  }
  
  
  
  
  
  

  async getProfile(uid: string): Promise<any> {
    try {
      const res: any = await firstValueFrom(this.db.getDocumentById('users', uid));
      console.log('perfil desde firebase', res);
      localStorage.setItem('profile', JSON.stringify(res));
      this.profile = res;
      return res;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async loginUser(email: string, password: string) {
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        console.log('Usuario autenticado:', user);

        await this.getProfile(user.uid);
        this.router.navigateByUrl('/perfil');
      } else {
        throw new Error('No se pudo obtener el usuario');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      const toast = await this.toastCtrl.create({
        message: 'Error al iniciar sesión.',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
      throw error;
    }
  }

  async logout() {
    try {
      await this.afAuth.signOut();
  
      // Espera hasta que authState devuelva null
      await new Promise<void>((resolve) => {
        const sub = this.afAuth.authState.subscribe((user) => {
          if (!user) {
            sub.unsubscribe(); // ahora sí es un Subscription válido
            resolve();
          }
        });
      });
  
      localStorage.clear();
      this.profile = null;
  
      console.log('✅ Sesión cerrada completamente');
      await this.router.navigate(['/login']);
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
    }
  }
    
}
