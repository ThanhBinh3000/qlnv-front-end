import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QDCVgiaosokiemtratranchiNSNNchocacdonviComponent } from './QDCVgiaosokiemtratranchiNSNNchocacdonvi.component';
import { QDCVgiaosokiemtratranchiNSNNchocacdonviRoutingModule } from './QDCVgiaosokiemtratranchiNSNNchocacdonvi-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [QDCVgiaosokiemtratranchiNSNNchocacdonviComponent],
  imports: [CommonModule, QDCVgiaosokiemtratranchiNSNNchocacdonviRoutingModule, ComponentsModule],
})
export class QDCVgiaosokiemtratranchiNSNNchocacdonviModule {}
