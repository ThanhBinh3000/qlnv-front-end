import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tonghopnhucauchithuongxuyengiaidoan3namComponent } from './tonghopnhucauchithuongxuyengiaidoan3nam.component';
import { Tonghopnhucauchithuongxuyengiaidoan3namRoutingModule } from './tonghopnhucauchithuongxuyengiaidoan3nam-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    Tonghopnhucauchithuongxuyengiaidoan3namComponent,
  ],
  imports: [
    CommonModule,
    Tonghopnhucauchithuongxuyengiaidoan3namRoutingModule,
    ComponentsModule,
  ],
})

export class  Tonghopnhucauchithuongxuyengiaidoan3namModule {}
