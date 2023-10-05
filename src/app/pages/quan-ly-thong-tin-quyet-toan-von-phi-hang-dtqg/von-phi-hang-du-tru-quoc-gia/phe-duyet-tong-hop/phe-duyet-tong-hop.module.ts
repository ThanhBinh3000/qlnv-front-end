import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PheDuyetTongHopComponent } from './phe-duyet-tong-hop.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { AddQuyetToanTongHopComponent } from './add-quyet-toan-tong-hop/add-quyet-toan-tong-hop.component';
import { DialogAddVatTuComponent } from './dialog-add-vat-tu/dialog-add-vat-tu.component';
import { DialogTongHopComponent } from './dialog-tong-hop/dialog-tong-hop.component';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule
  ],
  declarations: [
    PheDuyetTongHopComponent,
    AddQuyetToanTongHopComponent,
    DialogAddVatTuComponent,
    DialogTongHopComponent
  ],
  exports: [PheDuyetTongHopComponent],
})
export class PheDuyetTongHopModule { }
