import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'perfil-detalle/:id',
    loadComponent: () => import('./components/perfil-detalle/perfil-detalle.component').then(m => m.PerfilDetalleComponent)
  },
  
  // Rutas alternativas por si acaso
  {
    path: 'perfiles/:id',
    loadComponent: () => import('./components/perfil-detalle/perfil-detalle.component').then(m => m.PerfilDetalleComponent)
  },
  
  {
    path: 'perfil/:id',
    loadComponent: () => import('./components/perfil-detalle/perfil-detalle.component').then(m => m.PerfilDetalleComponent)
  },
  
  // Ruta para el buscador
  {
    path: 'buscador',
    loadChildren: () => import('./pages/buscador/buscador.module').then(m => m.BuscadorPageModule)
  },

  {
    path: '',
    redirectTo: 'bienvenida',
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
  },
  {
    path: 'calendario',
    loadChildren: () => import('./pages/calendario/calendario.module').then( m => m.CalendarioPageModule)
  },
  {
    path: 'scanner',
    loadChildren: () => import('./pages/scanner/scanner.module').then( m => m.ScannerPageModule)
  },
  {
    path: 'new-plant',
    loadChildren: () => import('./pages/new-plant/new-plant.module').then( m => m.NewPlantPageModule)
  },
  {
    path: 'plant-days/:id',
    loadChildren: () => import('./pages/plant-days/plant-days.module').then( m => m.PlantDaysPageModule)
  },
  {
    path: 'plant-detalle/:plantId/:historialId',
    loadChildren: () =>
      import('./pages/plant-detalle/plant-detalle.module').then(m => m.PlantDetallePageModule)
  },  
  {
    path: 'buscador-scanner',
    loadChildren: () => import('./pages/buscador-scanner/buscador-scanner.module').then( m => m.BuscadorScannerPageModule)
  },
  {
    path: 'qr',
    loadChildren: () => import('./pages/qr/qr.module').then( m => m.QrPageModule)
  },
  {
    path: 'transferencia',
    loadChildren: () => import('./pages/transferencia/transferencia.module').then( m => m.TransferenciaPageModule)
  },
  {
    path: 'favoritos',
    loadChildren: () => import('./pages/favoritos/favoritos.module').then( m => m.FavoritosPageModule)
  },
  {
    path: 'bienvenida',
    loadChildren: () => import('./pages/bienvenida/bienvenida.module').then( m => m.BienvenidaPageModule)
  },
  {
    path: 'pre-regis',
    loadChildren: () => import('./pages/pre-regis/pre-regis.module').then( m => m.PreRegisPageModule)
  },
  {
    path: 'camera',
    loadChildren: () => import('./pages/camera/camera.module').then( m => m.CameraPageModule)
  },
  {
    path: 'new-plant-historial',
    loadChildren: () => import('./pages/new-plant-historial/new-plant-historial.module').then( m => m.NewPlantHistorialPageModule)
  },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
