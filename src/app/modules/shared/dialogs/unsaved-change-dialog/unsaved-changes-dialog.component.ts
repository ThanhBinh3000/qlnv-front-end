import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    template: `
        <div class="dialog-header">
            <h2 mat-dialog-title>Unsaved changes</h2>
            <!-- <mat-icon (click)="dialogRef.close()" [attr.aria-label]="'close dialog'">close</mat-icon> -->
        </div>
        <mat-dialog-content>
            <h4 class="subTitle">Are you sure you want to leave this page?</h4>
            <p class="firstMessage">All unsaved changes you have made in this page will be removed.</p>
        </mat-dialog-content>
        <div class="button-group">
            <button
                style="float:right"
                mat-button
                type="button"
                [mat-dialog-close]="false"
                [attr.aria-label]="'cancel navigation'"
                class="mat-slim"
            >
                Cancel
            </button>
            <button
                style="float:right"
                mat-button
                type="button"
                class="confirm mat-slim"
                color="'primary'"
                [mat-dialog-close]="true"
                [attr.aria-label]="'Confirm navigation'"
            >
                Confirm
            </button>
        </div>
    `,
    styles: [
        `
            mat-dialog-content {
                margin-top: 1rem;
                margin-bottom: 1.5rem;
                font-size: 1rem;

                .subTitle {
                    font-family: Arial, Serif, Sans-serif, cursive, fantasy, Monospace;
                    font-weight: 400;
                    font-style: normal;
                    font-size: 18px;
                    line-height: 27px;
                    color: #0957de;
                    text-align: center;
                }

                .firstMessage{
                    font-family: Arial, Serif, Sans-serif, cursive, fantasy, Monospace;
                    font-weight: 400;
                    font-style: normal;
                    font-size: 14px;
                    line-height: 21px;
                    color: #0957de;
                    text-align: center;
                    margin-top: 15px;
                }

                .secondMessage {
                    font-family: Arial, Serif, Sans-serif, cursive, fantasy, Monospace;
                    font-weight: 400;
                    font-style: normal;
                    font-size: 14px;
                    line-height: 21px;
                    color: #0957de;
                    text-align: center;
                    padding-top: 1rem;
                }
            }
            .mat-dialog-title {
                font-family: Arial, Serif, Sans-serif, cursive, fantasy, Monospace;
            }
            .dialog-header {
                display: flex;
                justify-content: center;

                mat-icon {
                    cursor: pointer;
                }

                .mat-dialog-title {
                    font-family: "Roboto", Serif, Sans-serif, Cursive, fantasy, Monospace;
                    font-weight: 700;
                    font-style: normal;
                    font-size: 28px;
                    line-height: 40px;
                    color: #0957de;
                    margin: unset !important;
                }
            }
            .button-group {
                display: flex;
                flex-direction: row;
                align-items: flex-start;
                justify-content: center;
                text-align: center;

                .confirm {
                    width: auto ;
                    color: white;
                    background-color: #1DBAA9
                }

                .mat-slim {
                    font-weight: 700;
                }
            }
        `,
    ],
    styleUrls: ['./unsaved-changes-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnsavedChangesDialog {
    constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {}
}
