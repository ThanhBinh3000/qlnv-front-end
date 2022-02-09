import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { DashboardService } from '../../services/dashboard.service';

@Component({
    selector: 'app-patient-chart',
    templateUrl: './patient-chart.component.html',
    styleUrls: ['./patient-chart.component.scss'],
})
export class PatientChartComponent implements OnInit {
    @Input()
    dataTime: string;

    @Input()
    nurseId: string;

    @Input()
    containerId: string;

    private eventsSubscription: Subscription;
    @Input() events: Observable<void>;

    public chartType: string = 'line';

    public chartDatasets: Array<any> = [];

    public chartLabels: Array<any> = [];

    public chartColors: Array<any> = [
        {
            backgroundColor: 'rgba(51, 138, 243, 0.2)',
            borderColor: 'rgba(62, 126, 237, 1)',
            borderWidth: 3,
        },
    ];

    public chartOptions: any = {
        responsive: true,
        scales: {
            // xAxes: [{
            //     gridLines: {
            //         display:false
            //     }
            // }],
            yAxes: [{
                gridLines: {
                    display:false
                }
            }]
        },
    };
    public chartClicked(e: any): void {}
    public chartHovered(e: any): void {}

    constructor(private serviceDashboard: DashboardService) {
        this.serviceDashboard.getDataPatient(this.dataTime, this.nurseId, this.containerId).subscribe(result => {
            if (result) {
                this.chartLabels = result.dataTime;
                this.chartDatasets = [
                    {
                        data: result?.dataNewPatient,
                    },
                ];
            }
        });
    }

    ngOnInit() {
        this.eventsSubscription = this.events.subscribe(() =>
            this.serviceDashboard.getDataPatient(this.dataTime, this.nurseId, this.containerId).subscribe(result => {
                if (result) {
                    this.chartLabels = result.dataTime;
                    this.chartDatasets = [
                        {
                            data: result?.dataNewPatient,
                        },
                    ];
                }
            }),
        );
    }
}
