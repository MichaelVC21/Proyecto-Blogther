import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'principal',
    loadChildren: () => import('./pages/principal/principal.module').then( m => m.PrincipalPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'plantas',
    loadChildren: () => import('./pages/plantas/plantas.module').then( m => m.PlantasPageModule)
  },
  {
    path: 'buscador',
    loadChildren: () => import('./pages/buscador/buscador.module').then( m => m.BuscadorPageModule)
  },
  {
    path: 'articulos',
    loadChildren: () => import('./pages/extras/articulos/articulos.module').then( m => m.ArticulosPageModule),
  },
  {
    path: 'publicaciones',
    loadChildren: () => import('./pages/extras/publicaciones/publicaciones.module').then( m => m.PublicacionesPageModule)
  },
  {
    path: 'publi',
    loadChildren: () => import('./pages/extras/publi/publi.module').then( m => m.PubliPageModule)
  },
  {
    path: 'publi/:id',
    loadChildren: () => import('./pages/extras/publi/publi.module').then( m => m.PubliPageModule)
  },
  {
    path: 'articulos',
    loadChildren: () => import('./pages/extras/arti/arti.module').then( m => m.ArtiPageModule)
  },
  {
    path: 'articulos/:id',
    loadComponent: () => import('./components/articulo-detalle/articulo-detalle.component').then(m => m.ArticuloDetalleComponent)
  },
  {
    path: 'sign-up',
    loadChildren: () => import('./pages/sign-up/sign-up.module').then( m => m.SignUpPageModule)
  },
  {
    path: 'suscripcion',
    loadChildren: () => import('./pages/suscripcion/suscripcion.module').then( m => m.SuscripcionPageModule)
  },
  {
    path: 'metodo-pago',
    loadChildren: () =>
    import('./pages/suscripcion/metodo-pago/metodo-pago.module').then(m => m.MetodoPagoPageModule)
  },
  {
    path: 'editar',
    loadChildren: () => import('./pages/editar/editar.module').then( m => m.EditarPageModule)
  },
  {
    path: 'mis-publi',
    loadChildren: () => import('./pages/mis-publi/mis-publi.module').then( m => m.MisPubliPageModule)
  },
  {
    path: 'agregar-publi',
    loadChildren: () => import('./pages/agregar-publi/agregar-publi.module').then( m => m.AgregarPubliPageModule)
  },
  {
    path: 'camb-contra',
    loadChildren: () => import('./pages/camb-contra/camb-contra.module').then( m => m.CambContraPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
