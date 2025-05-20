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
    path: 'arti',
    loadChildren: () => import('./pages/extras/arti/arti.module').then( m => m.ArtiPageModule)
  },
  {
    path: 'sign-up',
    loadChildren: () => import('./pages/sign-up/sign-up.module').then( m => m.SignUpPageModule)
  },
  {
    path: 'add-plant-entry',
    loadChildren: () => import('./pages/add-plant-entry/add-plant-entry.module').then( m => m.AddPlantEntryPageModule)
  },
  {
    path: 'calendario',
    loadChildren: () => import('./pages/calendar-view/calendar-view.module').then( m => m.CalendarViewPageModule)
  },
  {
    path: 'scanner',
    loadChildren: () => import('./pages/camera-view/camera-view.module').then( m => m.CameraViewPageModule)
  },
  {
    path: 'edit-plant-entry',
    loadChildren: () => import('./pages/edit-plant-entry/edit-plant-entry.module').then( m => m.EditPlantEntryPageModule)
  },
  {
    path: 'gallery-view',
    loadChildren: () => import('./pages/gallery-view/gallery-view.module').then( m => m.GalleryViewPageModule)
  },
  {
    path: 'index',
    loadChildren: () => import('./pages/index/index.module').then( m => m.IndexPageModule)
  },
  {
    path: 'new-plant',
    loadChildren: () => import('./pages/new-plant/new-plant.module').then( m => m.NewPlantPageModule)
  },
  {
    path: 'not-found',
    loadChildren: () => import('./pages/not-found/not-found.module').then( m => m.NotFoundPageModule)
  },
  {
    path: 'plant-detail',
    loadChildren: () => import('./pages/plant-detail/plant-detail.module').then( m => m.PlantDetailPageModule)
  },
  {
    path: 'plant-info',
    loadChildren: () => import('./pages/plant-info/plant-info.module').then( m => m.PlantInfoPageModule)
  },
  {
    path: 'plantas',
    loadChildren: () => import('./pages/plant-list/plant-list.module').then( m => m.PlantListPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'camera-view',
    loadChildren: () =>
      import('./pages/camera-view/camera-view.module').then(
        m => m.CameraViewPageModule
      ),
  },
  {
    path: 'plant-info',
    loadChildren: () =>
      import('./pages/plant-info/plant-info.module').then(
        m => m.PlantInfoPageModule
      ),
  },
  {
    path: 'plant-list',
    loadChildren: () =>
      import('./pages/plant-list/plant-list.module').then(
        m => m.PlantListPageModule
      ),
  },
  {
    path: 'plant-detail/:id',
    loadChildren: () =>
      import('./pages/plant-detail/plant-detail.module').then(
        m => m.PlantDetailPageModule
      ),
  },
  {
    path: 'new-plant',
    loadChildren: () =>
      import('./pages/new-plant/new-plant.module').then(
        m => m.NewPlantPageModule
      ),
  },
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
