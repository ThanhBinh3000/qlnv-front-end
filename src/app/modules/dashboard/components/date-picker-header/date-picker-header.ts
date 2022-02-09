import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy } from '@angular/core';
import { DateAdapter, MatDateFormats, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatCalendar } from '@angular/material/datepicker';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'date-picker-header',
    styles: [
        `
            .date-picker-header {
                display: flex;
                flex-direction: column;
                align-items: center;
                font-size: 14px;
                font-weight: 700;
                line-height: 21px;
                color: #496082;
            }

            .date-picker-header-label {
                flex: 1;
                height: 1em;
                font-weight: 500;
                text-align: center;
                padding: 0px 82px 0px 82px;
                color: #0957de;
            }

            #year-label {
                font-size: 28px;
                line-height: 20px;
            }

            #month-label {
                font-size: 12px;
                line-height: 14px;
                padding: 0px 102px;
            }

            .date-picker-double-arrow .mat-icon {
                margin: -22%;
            }

            button {
                border: none;
                background-color: #fff;
            }
        `,
    ],
    templateUrl: './date-picker-header.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatePickerHeader<D> implements OnDestroy {
    private _destroyed = new Subject<void>();

    constructor(
        private _calendar: MatCalendar<D>,
        private _dateAdapter: DateAdapter<D>,
        @Inject(MAT_DATE_FORMATS) private _dateFormats: MatDateFormats,
        cdr: ChangeDetectorRef,
    ) {
        _calendar.stateChanges.pipe(takeUntil(this._destroyed)).subscribe(() => cdr.markForCheck());
    }

    ngOnDestroy() {
        this._destroyed.next();
        this._destroyed.complete();
    }

    get monthLabel() {
        return this._dateAdapter
            .format(this._calendar.activeDate, this._dateFormats.display.monthYearLabel)
            .toLocaleUpperCase()
            .split(' ')[0];
    }

    get yearLabel() {
        return this._dateAdapter
            .format(this._calendar.activeDate, this._dateFormats.display.monthYearLabel)
            .split(' ')[1];
    }

    previousClicked(mode: 'month' | 'year') {
        this._calendar.activeDate =
            mode === 'month'
                ? this._dateAdapter.addCalendarMonths(this._calendar.activeDate, -1)
                : this._dateAdapter.addCalendarYears(this._calendar.activeDate, -1);
    }

    nextClicked(mode: 'month' | 'year') {
        this._calendar.activeDate =
            mode === 'month'
                ? this._dateAdapter.addCalendarMonths(this._calendar.activeDate, 1)
                : this._dateAdapter.addCalendarYears(this._calendar.activeDate, 1);
    }
}
