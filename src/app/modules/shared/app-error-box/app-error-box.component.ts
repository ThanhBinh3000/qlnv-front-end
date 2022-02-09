import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
    selector: 'app-error-box',
    template: `
        <div class="error-box" *ngIf="errorMessages && !!errorMessages.length">
            <ng-container *ngFor="let errMessage of errorMessages">
                <mat-error>{{ errMessage }}</mat-error>
            </ng-container>
        </div>
    `,
    styles: [
        `
            :host {
                display: block;
            }

            div.error-box {
                display: flex;
                flex-direction: column;

                padding: 0.75em;
                border: 2px solid #f44336;
                font-size: 1rem;
                font-weight: 500;
                background-color: #ffd2d2;
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppErrorBoxComponent {
    @Input()
    errorMessages: string[];
}
