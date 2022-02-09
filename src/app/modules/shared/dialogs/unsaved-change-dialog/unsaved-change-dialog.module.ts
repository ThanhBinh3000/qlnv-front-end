import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { UnsavedChangesDialog } from './unsaved-changes-dialog.component';

@NgModule({
    declarations: [UnsavedChangesDialog],
    imports: [CommonModule, MatDialogModule, MatButtonModule],
    exports: [UnsavedChangesDialog],
})
export class UnsavedChangeDialogModule {}
