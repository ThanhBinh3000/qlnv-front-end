import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { CucRoutingModule } from './cuc-routing.module';
import { ThemmoiQdinhNhapXuatHangComponent } from './themmoi-qdinh-nhap-xuat-hang/themmoi-qdinh-nhap-xuat-hang.component';



@NgModule({
  declarations: [
    ThemmoiQdinhNhapXuatHangComponent,
  ],
  imports: [
    CommonModule,
    CucRoutingModule,
    ComponentsModule,
    MainModule
  ]
})
export class CucModule { }
