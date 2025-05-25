import { Injectable, Injector, runInInjectionContext } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { DatabaseService } from './database.service';
import { ToastController } from '@ionic/angular';
import { signOut, getAuth } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  profile: any;

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    public toastCtrl: ToastController,
    public db: DatabaseService,
    public router: Router,
    private injector: Injector
  ) { 
    const user = localStorage.getItem('profile');
    if(user){
      this.profile = JSON.parse(user);
      this.getProfile(this.profile.id);
    }
  }

  registerUser(email: string, password: string, extraData: any) {
    return runInInjectionContext(this.injector, () => {
      return this.afAuth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
          const uid = userCredential.user?.uid;
          if (uid) {
            return runInInjectionContext(this.injector, () => {
              return this.firestore.collection('users').doc(uid).set(extraData)
                .then(async () => {
                    console.log('Usuario creado en Firestore', extraData);
                    const toast = await this.toastCtrl.create({
                    message: 'Usuario creado exitosamente.',
                    duration: 2000,
                    color: 'success'
                    });
                    toast.present();
                    this.router.navigate(['/login']);
                    setTimeout(() => {
                    location.reload();
                    }, 200);
                })
                .catch(async error => {
                  console.error('Error al guardar datos en Firestore:', error);
                  const toast = await this.toastCtrl.create({
                    message: 'Error al guardar datos en Firestore.',
                    duration: 2000,
                    color: 'danger'
                  });
                  toast.present();
                  throw error;
                });
            });
          }
          throw new Error('Usuario no creado');
        })
        .catch(async error => {
          console.error('Error al registrar usuario:', error);
          const toast = await this.toastCtrl.create({
            message: 'Error al registrar usuario.',
            duration: 2000,
            color: 'danger'
          });
          toast.present();
          throw error;
        });
    });
  }

  getProfile(uid: any) {
    return runInInjectionContext(this.injector, () => {
      this.db.getDocumentById('users', uid).subscribe(
        (res: any) => {
          console.log('perfil desde firebase', res);
          localStorage.setItem('profile', JSON.stringify(res));
          this.profile = res;
        },
        (error: any) => {
          console.log(error);
        }
      );
    });
  }


  async loginUser(email: string, password: string) {
    return runInInjectionContext(this.injector, async () => {
      try {
        const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          console.log('Usuario autenticado:', user);

          this.getProfile(user.uid); // Mantiene la lógica actual de obtener y guardar perfil
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
    });
  }


  logout() {
    const auth = getAuth();
    signOut(auth).then(() => {
      localStorage.removeItem('profile');
      localStorage.removeItem('user');
      localStorage.clear();
  
      this.profile = null; // ← Esto estaba mal antes, ponías this.auth.profile
      this.router.navigate(['/login']);
      setTimeout(() => {
        location.reload();
      }, 200);
    }).catch((error) => {
      console.error('Error al cerrar sesión:', error);
    });
  }

/*   verifyIsLogued() {
    let user = localStorage.getItem('user');
    this.isLogued = user ? true : false;
    return user ? true : false;
  }
 */
}