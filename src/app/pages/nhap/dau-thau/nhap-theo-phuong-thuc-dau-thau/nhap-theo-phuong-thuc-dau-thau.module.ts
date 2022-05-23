import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { ChiCucComponent } from './chi-cuc/chi-cuc.component';
import { CucComponent } from './cuc/cuc.component';
import { NhapTheoPhuongThucDauThauRoutingModule } from './nhap-theo-phuong-thuc-dau-thau-routing.module';
import { NhapTheoPhuongThucDauThauComponent } from './nhap-theo-phuong-thuc-dau-thau.component';

@NgModule({
  declarations: [
    NhapTheoPhuongThucDauThauComponent,
    CucComponent,
    ChiCucComponent,
  ],
  imports: [CommonModule, NhapTheoPhuongThucDauThauRoutingModule, ComponentsModule, MainModule],
})
export class NhapTheoPhuongThucDauThauModule { }
