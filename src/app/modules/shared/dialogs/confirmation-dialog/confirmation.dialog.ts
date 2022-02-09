import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    template: `
        <div class="dialog-header">
            <h2 mat-dialog-title>{{ data.title || 'Confirmation' }}</h2>
            <!-- <mat-icon (click)="dialogRef.close()" [attr.aria-label]="'close dialog'">close</mat-icon> -->
        </div>
        <mat-dialog-content class="dialog-content">
            {{ data.message }}
        </mat-dialog-content>
        <div class="button-group">
            <button
                mat-button
                type="button"
                [mat-dialog-close]="true"
                [attr.aria-label]="'close dialog'"
                color="{{ data?.color || 'primary' }}"
                class="mat-slim"
            >
                {{ data.closeButtonText || 'Close' }}
            </button>
        </div>
    `,
    styleUrls: ['./confirmation.dialog.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationDialog {
    constructor(
        public dialogRef: MatDialogRef<ConfirmationDialog>,
        @Inject(MAT_DIALOG_DATA)
        public data: { message: string; title?: string; closeButtonText?: string; color?: string },
    ) {}
}
