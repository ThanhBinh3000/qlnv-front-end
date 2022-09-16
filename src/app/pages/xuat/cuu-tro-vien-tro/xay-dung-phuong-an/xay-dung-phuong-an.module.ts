import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { XayDungPhuongAnComponent } from './xay-dung-phuong-an.component';
import { ThongTinXayDungPhuongAnComponent } from './thong-tin-xay-dung-phuong-an/thong-tin-xay-dung-phuong-an.component';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
  ],
  declarations: [
    XayDungPhuongAnComponent,
    ThongTinXayDungPhuongAnComponent,
  ],
  exports: [
    XayDungPhuongAnComponent,
  ]
})
export class XayDungPhuongAnModule { }
