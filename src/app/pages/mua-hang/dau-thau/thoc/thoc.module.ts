import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { LuongDauThauGaoComponent } from './luong-dau-thau-gao/luong-dau-thau-gao.component';
import { ThocRoutingModule } from './thoc-routing.module';
import { ThocComponent } from './thoc.component';
import { ThongTinLuongDauThauGaoComponent } from './thong-tin-luong-dau-thau-gao/thong-tin-luong-dau-thau-gao.component';

@NgModule({
  declarations: [
    ThocComponent,
    LuongDauThauGaoComponent,
    ThongTinLuongDauThauGaoComponent,
  ],
  imports: [
    CommonModule,
    ThocRoutingModule,
    ComponentsModule,
    MainModule,
  ]
})
export class ThocModule { }