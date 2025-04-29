import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from 'src/app/components/menu/menu.component';
import { ArticulosComponent } from 'src/app/components/articulos/articulos.component';
import { PublicacionesComponent } from 'src/app/components/publicaciones/publicaciones.component';
import { TabBarComponent } from 'src/app/components/tab-bar/tab-bar.component';
import { PincipalComponent } from 'src/app/components/pincipal/pincipal.component';

@NgModule({
  imports: [
    CommonModule,
    MenuComponent,
    ArticulosComponent,
    PublicacionesComponent,
    TabBarComponent,
    PincipalComponent // ✅ importa el componente standalone aquí
  ],
  exports: [
    MenuComponent,
    ArticulosComponent,
    PublicacionesComponent,
    TabBarComponent,
    PincipalComponent // ✅ también lo puedes exportar para usarlo en otros módulos
  ]
})
export class SharedModule {}