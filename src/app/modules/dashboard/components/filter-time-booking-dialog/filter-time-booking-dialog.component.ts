import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DashboardService } from '../../services/dashboard.service';
import { DatePickerHeader } from '../date-picker-header/date-picker-header';
import * as myGlobals from '../../../../globals';
@Component({
    selector: 'app-filter-time-booking-dialog',
    templateUrl: './filter-time-booking-dialog.component.html',
    styleUrls: ['./filter-time-booking-dialog.component.scss'],
})
export class FilterTimeBookingDialogComponent implements OnInit {
    exampleHeader = DatePickerHeader;
    @ViewChild('f', { static: true })
    formDirective: NgForm;
    form: FormGroup;

    fromCalendarOpen = false;
    toCalendarOpen = false;

    fromDateRes: any;
    toDateRes: any;
    selected: Date | null;
    fromDate = new FormControl();
    toDate = new FormControl();
    fromSelected: Date | null;
    toSelected: Date | null;

    constructor(
        private serviceDashboard: DashboardService,
        private matDialogRef: MatDialogRef<FilterTimeBookingDialogComponent>,
    ) {}

    ngOnInit(): void {}

    clicked() {
        // this.serviceDashboard.fillteMatrix(this.convertDateToString(this.fromDate.value),this.convertDateToString(this.toDate.value)).subscribe();
    }

    convertDateToString(input: Date) {
        if (!input) {
            return '';
        }
        const dd = String(input.getDate()).padStart(2, '0');
        const mm = String(input.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = input.getFullYear();

        const date = yyyy + '-' + mm + '-' + dd;
        return date;
    }

    closePopup() {
        this.matDialogRef.close();
    }

    submitData() {
        myGlobals.bookingSub$.next({
            fromSelected: this.fromSelected,
            toSelected: this.toSelected
        })
    }
}
