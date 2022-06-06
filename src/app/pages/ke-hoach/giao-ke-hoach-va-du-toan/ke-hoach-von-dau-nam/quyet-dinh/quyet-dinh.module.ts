import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuyetDinhComponent } from './quyet-dinh.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';

@NgModule({
  declarations: [
    QuyetDinhComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
  ],
  exports: [
    QuyetDinhComponent,
  ]
})
export class QuyetDinhModule { }
