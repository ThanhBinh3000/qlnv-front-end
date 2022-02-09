import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DashboardService } from '../../services/dashboard.service';
import { FilterTimeBookingDialogComponent } from '../filter-time-booking-dialog/filter-time-booking-dialog.component';
import * as myGlobals from '../../../../globals';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as moment from 'moment';

@Component({
    selector: 'app-bookings-chart',
    templateUrl: './bookings-chart.component.html',
    styleUrls: ['./bookings-chart.component.scss'],
})
export class BookingsChartComponent implements OnInit {
    dataTime = 'Day';

    public chartType: string = 'bar';

    public chartDatasets: Array<any> = [];

    public chartLabels: Array<any> = [];

    public chartColors: Array<any> = [
        {
            backgroundColor: 'rgba(9, 87, 222, 0.2)',
            borderColor: 'rgba(9, 87, 222, 1)',
            borderWidth: 2,
        },
    ];

    public chartOptions: any = {
        responsive: true,
        scales: {
            xAxes: [
                {
                    barThickness: 40,
                    gridLines: {
                        display: false
                    },
                },
            ],
        },
    };
    public chartClicked(e: any): void { }
    public chartHovered(e: any): void { }

    timeSelect = {
        fromSelected: moment().format('YYYY-MM-DD'),
        toSelected: moment().format('YYYY-MM-DD')
    };

    unsubscribe$ = new Subject();

    constructor(private serviceDashboard: DashboardService, private dialog: MatDialog) {
        this.serviceDashboard.getDataBooking(this.timeSelect.fromSelected, this.timeSelect.toSelected).subscribe(result => {
            if (result) {
                this.chartLabels = result?.dataTimes;
                this.chartDatasets = [
                    {
                        data: result?.dataBookings,
                    },
                ];
            }
        });
    }


    ngOnInit(): void {
        myGlobals.booking$.pipe(
            map(result => {
                return result
            }),
        takeUntil(this.unsubscribe$)).subscribe(result => {
            this.timeSelect.fromSelected = moment(result.fromSelected).format('YYYY-MM-DD');
            this.timeSelect.toSelected = moment(result.toSelected).format('YYYY-MM-DD');
        });
    }


    showPopupFilter() {
        const termDialog = this.dialog.open(FilterTimeBookingDialogComponent, {
            width: '1050px',
            height: '520px',
        });
        termDialog.afterClosed().subscribe(res => {
            if(this.timeSelect != null){
                this.serviceDashboard.getDataBooking(this.timeSelect.fromSelected, this.timeSelect.toSelected).subscribe(result => {
                    if (result) {
                        this.chartLabels = result?.dataTimes;
                        this.chartDatasets = [
                            {
                                data: result?.dataBookings,
                            },
                        ];
                    }
                });
            }
        });
    }
}
