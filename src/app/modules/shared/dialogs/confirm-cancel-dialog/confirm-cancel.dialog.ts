import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
    template: `
        <div class="dialog-header">
            <h2 mat-dialog-title>{{ data.title || '' }}</h2>
            <!-- <mat-icon (click)="dialogRef.close()" [attr.aria-label]="'close dialog'">close</mat-icon> -->
        </div>
        <mat-dialog-content>
            <h4 *ngIf="data.subTitle" class="subTitle">{{ data.subTitle }}</h4>
            <p class="firstMessage">{{ data.message }}</p>
            <p class="secondMessage" *ngIf="data.secondMessage">{{ data.secondMessage }}</p>
        </mat-dialog-content>
        <div class="button-group">
            <button
                style="float:right"
                mat-button
                type="button"
                class="mat-slim cancel"
                [mat-dialog-close]="false"
                [attr.aria-label]="'cancel navigation'"
                *ngIf="!data.hideCancelButton"
            >
                {{ data.cancelButtonText || 'Cancel' }}
            </button>
            <button
                style="float:right"
                mat-button
                color="{{ data.color || 'primary' }}"
                type="button"
                [mat-dialog-close]="true"
                [attr.aria-label]="'Confirm navigation'"
                [class]="(data.confirmButtonText === 'Deactivate account') ? 'deactive' :
                (data.confirmButtonText === 'Activate account') ? 'active' :
                (data.confirmButtonText === 'Delete' || data.confirmButtonText === 'Delete Account') ? 'delete' : ''"
                class="mat-slim confirm"
            >
                {{ data.confirmButtonText || 'Confirm' }}
            </button>
        </div>
    `,
    styleUrls: ['./confirm-cancel.dialog.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmCancelDialog {
    caseManagerId: string;
    isConfirmDelete: boolean;
    isDisabled = true;
    constructor(
        public dialogRef: MatDialogRef<ConfirmCancelDialog>,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            message: string;
            secondMessage?: string;
            subTitle?: string;
            confirmButtonText?: string;
            cancelButtonText?: string;
            title?: string;
            hideCancelButton: boolean;
            color?: string;
            userInfo?: string;
        },
    ) {}
}
