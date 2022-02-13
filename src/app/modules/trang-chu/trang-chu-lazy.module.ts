import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared';
import { TrangChu } from './components';
import { TrangChuContainer } from './containers';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    declarations: [TrangChuContainer, TrangChu],
    imports: [CommonModule, SharedModule, ReactiveFormsModule, FormsModule, NgSelectModule],
    exports: [TrangChuContainer, TrangChu],
})
export class TrangChuLazyModule {}
