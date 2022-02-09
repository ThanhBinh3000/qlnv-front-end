import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmationDialog } from './confirmation.dialog';

@NgModule({
    declarations: [ConfirmationDialog],
    imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
    exports: [ConfirmationDialog],
})
export class ConfirmationDialogModule {}
