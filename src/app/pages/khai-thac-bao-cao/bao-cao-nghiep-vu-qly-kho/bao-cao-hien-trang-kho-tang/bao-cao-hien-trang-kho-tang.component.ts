import {Component, OnInit, ViewChild} from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexMarkers,
  ApexYAxis,
  ApexGrid,
  ApexTitleSubtitle,
  ApexLegend,
  ApexFill,
  ApexPlotOptions,
} from "ng-apexcharts";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "src/app/services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {BcNvQuanLyKhoTangService} from "src/app/services/bao-cao/BcNvQuanLyKhoTang.service";
import {MESSAGE} from "src/app/constants/message";
import {Base2Component} from "src/app/components/base2/base2.component";


export type ChartOptionsColumn = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  stroke: ApexStroke;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  colors: string[];
  fill: ApexFill;
  legend: ApexLegend;
};/*
export type ChartOptionsLine = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  tooltip: any; // ApexTooltip;
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
};*/

@Component({
  selector: 'app-bao-cao-hien-trang-kho-tang',
  templateUrl: './bao-cao-hien-trang-kho-tang.component.html',
  styleUrls: ['./bao-cao-hien-trang-kho-tang.component.scss']
})
export class BaoCaoHienTrangKhoTangComponent extends Base2Component implements OnInit {

  public tichLuongChart: Partial<ChartOptionsColumn>;

  // tonKhoChart: Partial<ChartOptionsLine>;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private bcNvQuanLyKhoTangService: BcNvQuanLyKhoTangService
  ) {
    super(httpClient, storageService, notification, spinner, modal, bcNvQuanLyKhoTangService);
    super.ngOnInit()
    this.formData = this.fb.group({
      maDvi: [''],
      maCuc: [''],
      maChiCuc: [''],
    });
    this.tichLuongChart = {}
    /*    this.search();
        this.filterTable = {};*/
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      await Promise.all([
        this.loadChartTichLuong(),
        this.loadChartTonKho(),

      ]);
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }

  }

  clearSearch() {
    this.formData.reset();
    this.search();

  }

  async loadChartTichLuong() {
    let res = await this.bcNvQuanLyKhoTangService.hienTrangTichLuongKho({maDvi: "010102"});
    if (res.msg == MESSAGE.SUCCESS) {
      let responseData = res.data;
      this.tichLuongChart = {
        series: responseData,
        chart: {
          type: "bar",
          height: 450,
          width: "100%",
          stacked: true,
        },
        stroke: {
          width: 1,
          colors: ["#fff"],
        },
        dataLabels: {
          formatter: (val) => {
            return Number(val).toLocaleString("vi-VN") + " tấn kho";
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
          },
        },
        xaxis: {
          categories: responseData[0].label
        },
        fill: {
          opacity: 1,
        },
        colors: ["#2196f3", "#b0b0b0", "#ff4d4f", "#ffaa29"],
        yaxis: {
          labels: {
            formatter: (val) => {
              return Number(val).toLocaleString("vi-VN") + "";
            },
          },
        },
        legend: {
          position: "top",
          horizontalAlign: "left",
        },
      };
      console.log(this.tichLuongChart)
    }
  }

  async loadChartTonKho() {

  }
}
