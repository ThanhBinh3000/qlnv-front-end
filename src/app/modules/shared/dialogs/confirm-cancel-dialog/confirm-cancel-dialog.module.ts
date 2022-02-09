import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmCancelDialog } from './confirm-cancel.dialog';

@NgModule({
    declarations: [ConfirmCancelDialog],
    imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatSelectModule],
    exports: [ConfirmCancelDialog],
})
export class ConfirmCancelDialogModule {}
