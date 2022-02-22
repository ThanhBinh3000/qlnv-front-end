import { BidiModule } from '@angular/cdk/bidi';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NzNoAnimationModule } from 'ng-zorro-antd/core/no-animation';
import { NzOverlayModule } from 'ng-zorro-antd/core/overlay';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTreeModule } from 'ng-zorro-antd/tree';

import { TecaTreeSelectComponent } from './tree-select.component';

@NgModule({
  imports: [
    BidiModule,
    CommonModule,
    OverlayModule,
    FormsModule,
    NzSelectModule,
    NzTreeModule,
    NzIconModule,
    NzEmptyModule,
    NzOverlayModule,
    NzNoAnimationModule,
  ],
  declarations: [TecaTreeSelectComponent],
  exports: [TecaTreeSelectComponent],
})
export class TecaTreeSelectModule {}
