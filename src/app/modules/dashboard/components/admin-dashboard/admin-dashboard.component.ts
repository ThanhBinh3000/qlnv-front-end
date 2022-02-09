import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FilterTimeProductPatientDialogComponent } from '../filter-time-product-patient-dialog/filter-time-product-patient-dialog.component';
import * as myGlobals from '../../../../globals';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-admin-dashboard',
    templateUrl: './admin-dashboard.component.html',
    styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {

    dataTime = {
        name: 'day',
        display: 'Day'
    };
    nurse = {
        id: '',
        username: 'None'
    };
    container = {
        id: '',
        name: 'None'
    };

    eventsProductSubject: Subject<void> = new Subject<void>();
    eventsPatientSubject: Subject<void> = new Subject<void>();

    unsubscribe$ = new Subject();

    constructor(private dialog: MatDialog) {}

    ngOnInit(): void {
        myGlobals.typeDate$.pipe(
            map(result => {
                return result
            }),
        takeUntil(this.unsubscribe$)).subscribe(result => {
            this.dataTime = result
        });
        myGlobals.nurse$.pipe(
            map(result => {
                return result
            }),
        takeUntil(this.unsubscribe$)).subscribe(result => {
            this.nurse = result
        });
        myGlobals.container$.pipe(
            map(result => {
                return result
            }),
        takeUntil(this.unsubscribe$)).subscribe(result => {
            this.container = result
        });
    }

    showPopupFilter() {
        const termDialog = this.dialog.open(FilterTimeProductPatientDialogComponent, {
            width: '490px',
            height: '560px',
            data: {
                typeDate: this.dataTime.name,
                containerId: this.container.id,
                nurseId: this.nurse.id
            }
        });
        termDialog.afterClosed().subscribe(res => {
            if(res){
                this.eventsProductSubject.next();
                this.eventsPatientSubject.next();
            }
        });
    }
}
