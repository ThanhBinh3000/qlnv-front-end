import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { KiemTraCluongBttComponent } from './kiem-tra-cluong-btt.component';
import { MainKtraCluongBttComponent } from './main-ktra-cluong-btt/main-ktra-cluong-btt.component';
import { BienBanLayMauBttComponent } from './bien-ban-lay-mau-btt/bien-ban-lay-mau-btt.component';
import { ThemMoiBienBanLayMauBttComponent } from './bien-ban-lay-mau-btt/them-moi-bien-ban-lay-mau-btt/them-moi-bien-ban-lay-mau-btt.component';

@NgModule({
  declarations: [
    KiemTraCluongBttComponent,
    MainKtraCluongBttComponent,
    BienBanLayMauBttComponent,
    ThemMoiBienBanLayMauBttComponent,

  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
  ],
  exports: [
    KiemTraCluongBttComponent,

  ]
})
export class KiemTraCluongBttModule { }
