import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { DashboardService } from '../../services/dashboard.service';

@Component({
    selector: 'app-product-chart',
    templateUrl: './product-chart.component.html',
    styleUrls: ['./product-chart.component.scss'],
})
export class ProductChartComponent implements OnInit {
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
            backgroundColor: 'rgba(91, 212, 246, 0.3)',
            borderColor: 'rgba(91, 212, 247, 1)',
            borderWidth: 3,
        },
        {
            backgroundColor: 'rgba(85, 58, 255, 0.3)',
            borderColor: 'rgba(112, 91, 245, 1)',
            borderWidth: 3,
        },
    ];

    public chartOptions: any = {
        responsive: true,
        legend: {
            position: 'top',
            align: 'end',
            labels: {
                fontSize: 10,
                usePointStyle: true,
            },
        },
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
        }
    };
    public chartClicked(e: any): void {}
    public chartHovered(e: any): void {}

    constructor(private serviceDashboard: DashboardService) {
        this.serviceDashboard.getDataProduct(this.dataTime, this.nurseId, this.containerId).subscribe(result => {
            if (result) {
                this.chartLabels = result?.dataTime;
                this.chartDatasets = [
                    { data: result?.dataProduct[0].medicalProduct, label: 'Medical' },
                    { data: result?.dataProduct[0].otherProduct, label: 'Other' },
                ];
            }
        });
    }

    ngOnInit() {
        this.eventsSubscription = this.events.subscribe(() =>
            this.serviceDashboard.getDataProduct(this.dataTime, this.nurseId, this.containerId).subscribe(result => {
                if (result) {
                    this.chartLabels = result?.dataTime;
                    this.chartDatasets = [
                        { data: result?.dataProduct[0].medicalProduct, label: 'Medical' },
                        { data: result?.dataProduct[0].otherProduct, label: 'Other' },
                    ];
                }
            }),
        );
    }
}
