import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DauThauRoutingModule } from './dau-thau-routing.module';
import { DauThauComponent } from './dau-thau.component';


@NgModule({
  declarations: [
    DauThauComponent,
  ],
  imports: [CommonModule, DauThauRoutingModule, ComponentsModule],
})
export class DauThauModule { }
