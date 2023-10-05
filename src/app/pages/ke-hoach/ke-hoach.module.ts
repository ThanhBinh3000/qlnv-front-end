import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzAffixModule } from 'ng-zorro-antd/affix';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { KeHoachRoutingModule } from './ke-hoach-routing.module';
import { KeHoachComponent } from './ke-hoach.component';


@NgModule({
  declarations: [
    KeHoachComponent,
  ],
  imports: [
    CommonModule,
    KeHoachRoutingModule,
    ComponentsModule,
    MainModule,
    NzAffixModule,
    DirectivesModule
  ],
})
export class KeHoachModule { }
