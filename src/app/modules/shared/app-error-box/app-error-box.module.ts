import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppErrorBoxComponent } from './app-error-box.component';
import { MatInputModule } from '@angular/material/input';

@NgModule({
    declarations: [AppErrorBoxComponent],
    imports: [CommonModule, MatInputModule],
    exports: [AppErrorBoxComponent, MatInputModule],
})
export class AppErrorBoxModule {}
