import {Component, OnInit, ViewChild} from '@angular/core';
import {Base2Component} from "../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {UserActivityService} from "../../../services/user-activity.service";
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle, ApexPlotOptions
} from "ng-apexcharts";
import {MESSAGE} from "../../../constants/message";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  plotOptions: ApexPlotOptions;
};

@Component({
  selector: 'app-thong-ke-truy-cap',
  templateUrl: './thong-ke-truy-cap.component.html',
  styleUrls: ['./thong-ke-truy-cap.component.scss']
})
export class ThongKeTruyCapComponent extends Base2Component implements OnInit {

  listSystem: any[] = [{"code": "hang", "ten": "Quản lý hàng"}, {
    "code": "khoach",
    "ten": "Quản lý kế hoạch"
  }, {"code": "kho", "ten": "Quản lý kho"}, {"code": "luukho", "ten": "Quản lý lưu kho"}, {
    "code": "security",
    "ten": "Quản lý đăng nhập"
  }, {
    "code": "report",
    "ten": "Quản lý báo cáo"
  }, {
    "code": "system",
    "ten": "Quản lý hệ thống"
  }, {
    "code": "category",
    "ten": "Quản lý danh mục"
  }];
  pageSize: number = 100;
  @ViewChild("chart") chart: ChartComponent;
  chartOptions: Partial<ChartOptions>;
  chartOptionsSystem: Partial<ChartOptions>;
  chartDateData: any[] = [];
  chartSystemData: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private userActivityService: UserActivityService
  ) {
    super(httpClient, storageService, notification, spinner, modal, userActivityService);
    super.ngOnInit()
    this.formData = this.fb.group({
      userName: [''],
      ip: [''],
      system: [''],
      ngayHd: [''],
      tuNgay: [''],
      denNgay: [''],
    });
    this.chartOptions = {
      chart: {
        height: 350,
        type: "area"
      }
    };
    this.chartOptionsSystem = {
      chart: {
        height: 350,
        type: "bar"
      }
    };
    this.search();
    this.filterTable = {};
  }

  async ngOnInit() {
    this.loadDataChart();
  }

  clearSearch() {
    this.formData.reset();
    this.search();
    this.loadDataChart();
  }

  filter() {
    if (this.formData.value.ngayHd && this.formData.value.ngayHd.length > 0) {
      this.formData.value.tuNgay = this.formData.value.ngayHd[0];
      this.formData.value.denNgay = this.formData.value.ngayHd[1];
    }
    this.search();
    this.loadDataChart();
  }

  async loadDataChart() {
    let res = await this.userActivityService.thongKeTruyCap(this.formData.value);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.chartOptions = {
        chart: {
          height: 350,
          type: "area"
        },
        xaxis: {
          categories: data.listSumDate.map(item => item.label)
        }
      };
      this.chartOptionsSystem = {
        chart: {
          height: 350,
          type: "bar"
        },
        plotOptions: {
          bar: {
            horizontal: true
          }
        },
        xaxis: {
          categories: data.listSumSystem.map(item => this.getTenHeThong(item.label))
        }
      };
      this.chartDateData = [{
        name: "Tổng số",
        data: data.listSumDate.map(item => item.total)
      }]
      this.chartSystemData = [{
        name: "Tổng số",
        data: data.listSumSystem.map(item => item.total)
      }]
    }
  }

  getTenHeThong(system) {
    let heThong = this.listSystem.find(item => item.code == system);
    if (heThong) {
      return heThong.ten;
    }
    return system;
  }
}
