import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DanhMucQlkhVonPhiRoutingModule } from './danh-muc-qlkh-von-phi-routing.module';
import { DanhMucQlkhVonPhiComponent } from './danh-muc-qlkh-von-phi.component';

@NgModule({
  declarations: [DanhMucQlkhVonPhiComponent],
  imports: [CommonModule, DanhMucQlkhVonPhiRoutingModule, ComponentsModule],
})
export class DanhMucQlkhVonPhiModule {}
