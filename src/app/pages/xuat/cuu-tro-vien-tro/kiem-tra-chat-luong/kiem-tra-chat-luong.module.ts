import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { BienBanLayMauBanGiaoMauComponent } from './bien-ban-lay-mau-ban-giao-mau/bien-ban-lay-mau-ban-giao-mau.component';
import { ThemMoiBbLayMauBanGiaoMauComponent } from './bien-ban-lay-mau-ban-giao-mau/them-moi-bb-lay-mau-ban-giao-mau/them-moi-bb-lay-mau-ban-giao-mau.component';
import { ThanhPhanThamGiaComponent } from './bien-ban-lay-mau-ban-giao-mau/them-moi-bb-lay-mau-ban-giao-mau/thanh-phan-tham-gia/thanh-phan-tham-gia.component';



@NgModule({
  declarations: [
    MainComponent,
    BienBanLayMauBanGiaoMauComponent,
    ThemMoiBbLayMauBanGiaoMauComponent,
    ThanhPhanThamGiaComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
  ],
  exports: [
    MainComponent,
  ]
})
export class KiemTraChatLuongModule { }
