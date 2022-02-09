import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BreadCrumbItem, BreadcrumbService } from '../../core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-breadcrumb',
    template: `
        <div class="breadcrumb-container" *ngIf="breadcrumbItems">
            <ng-container *ngFor="let breadcrumbItem of breadcrumbItems; index as i">
                <a
                    href="#"
                    (click)="$event.preventDefault(); $event.stopPropagation(); gotoUrl(breadcrumbItem)"
                    *ngIf="i !== breadcrumbItems.length - 1"
                    >{{ breadcrumbItem.name }}</a
                >
                <span *ngIf="i === breadcrumbItems.length - 1">{{ breadcrumbItem.name }}</span>
                <span *ngIf="i !== breadcrumbItems.length - 1"> > </span>
            </ng-container>
        </div>
    `,
    styles: [
        `
            :host {
                display: block;
            }

            .breadcrumb-container {
                padding-top: 1rem;
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppBreadcrumbComponent implements OnInit, OnChanges {
    @Input()
    breadcrumbItems: BreadCrumbItem[];

    constructor(private router: Router, private breadCrumbService: BreadcrumbService) {}

    ngOnInit() {}

    ngOnChanges(changes: SimpleChanges) {
        this.breadcrumbItems = (changes && changes.breadcrumbItems && changes.breadcrumbItems.currentValue) || [];
    }

    gotoUrl(breadcrumbItem: BreadCrumbItem) {
        this.router.navigate([breadcrumbItem.path]);
        if (breadcrumbItem.context) {
            this.breadCrumbService.setContext(breadcrumbItem.context);
        }
    }
}
