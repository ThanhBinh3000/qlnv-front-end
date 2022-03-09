import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { XaydungphuongangiaosokiemtratranchiNSNNchocacdonviRoutingModule } from './xaydungphuongangiaosokiemtratranchiNSNNchocacdonvi-routing.module';
import { XaydungphuongangiaosokiemtratranchiNSNNchocacdonviComponent } from './xaydungphuongangiaosokiemtratranchiNSNNchocacdonvi.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [XaydungphuongangiaosokiemtratranchiNSNNchocacdonviComponent],
  imports: [CommonModule, XaydungphuongangiaosokiemtratranchiNSNNchocacdonviRoutingModule, ComponentsModule],
})
export class XaydungphuongangiaosokiemtratranchiNSNNchocacdonviModule {}
