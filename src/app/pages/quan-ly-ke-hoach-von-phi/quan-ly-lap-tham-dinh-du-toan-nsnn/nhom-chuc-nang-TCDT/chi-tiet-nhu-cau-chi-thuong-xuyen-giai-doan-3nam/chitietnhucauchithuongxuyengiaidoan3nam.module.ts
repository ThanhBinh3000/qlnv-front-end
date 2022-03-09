import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chitietnhucauchithuongxuyengiaidoan3namComponent } from './chitietnhucauchithuongxuyengiaidoan3nam.component';
import { Chitietnhucauchithuongxuyengiaidoan3namRoutingModule } from './chitietnhucauchithuongxuyengiaidoan3nam-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    Chitietnhucauchithuongxuyengiaidoan3namComponent,
  ],
  imports: [
    CommonModule,
    Chitietnhucauchithuongxuyengiaidoan3namRoutingModule,
    ComponentsModule,
  ],
})

export class  Chitietnhucauchithuongxuyengiaidoan3namModule {}
