import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared';

@NgModule({
    imports: [CommonModule, SharedModule, ReactiveFormsModule, FormsModule, RouterModule],
    declarations: [],
    exports: [CommonModule, SharedModule],
    providers: [],
})
export class AdminLazyModule {}
