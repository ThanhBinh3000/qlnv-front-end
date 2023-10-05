import { Component, OnInit } from '@angular/core';
import { formatDistance } from 'date-fns';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {
  time = formatDistance(new Date(), new Date());
  drawervisible = false;
  lichvisible = false;
  congViectheoDonVi;
  tinhTrangCongViec;
  baoCaoTinhTrangclcv;
  congViecCuaToi;
  // hidecard
  addclass = 'showcard';
  addclass1 = 'showcard';
  addclass2 = 'showcard';
  addclass3 = 'showcard';
  addclass4 = 'showcard';
  anchoykien: boolean = true;
  constructor(
    private _modalService: NzModalService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
  ) {
    this.slvbctc();
    this.cvtdv();
    this.bcttxlcvtlv();
    this.cvct();
    this.lichcongtacLlanhdao();
  }
  open(): void {
    this.drawervisible = true;
  }
  close(): void {
    this.drawervisible = false;
  }
  lichOpen(): void {
    this.lichvisible = true;
  }
  lichClose(): void {
    this.lichvisible = false;
  }
  cvct(): void {
    this.congViecCuaToi = {
      series: [
        {
          color: '#8BC34C',
          name: 'Trong hạn',
          data: [22, 43, 21, 22],
        },
        {
          color: '#FFA500',
          name: 'Sắp đến hạn',
          data: [13, 43, 32, 22],
        },
        {
          color: '#E00606',
          name: 'Quá hạn',
          data: [9, 15, 11, 20],
        },
        {
          color: '#d5d5d5',
          name: 'Chưa bắt đầu',
          data: [5, 8, 6, 9],
        },
      ],
      chart: {
        type: 'bar',
        height: 170,
        stacked: true,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 3,
        },
      },
      stroke: {
        width: 0,
        colors: ['#fff'],
      },
      xaxis: {
        categories: ['Văn bản đến', 'Văn bản đi', 'Văn bản nội bộ', 'Tờ trình'],
        labels: {
          show: false,
          // formatter: function(val) {
          //   return val;
          // }
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
        title: {
          text: undefined,
        },
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val;
          },
        },
      },
      fill: {
        opacity: 1,
      },
      grid: {
        borderColor: 'transparent',
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetX: 0,
      },
    };
  }
  bcttxlcvtlv(): void {
    this.baoCaoTinhTrangclcv = {
      series: [
        {
          color: '#353a64',
          name: 'Tổng công việc',
          type: 'column',
          data: [118, 109, 90, 97, 72, 108, 63, 107, 108, 106],
        },
        {
          color: '#8BC34C',
          name: 'Trong hạn',
          type: 'column',
          data: [44, 55, 41, 37, 22, 23, 21, 22, 43, 21],
        },
        {
          color: '#FFA500',
          name: 'Sắp đến hạn',
          type: 'column',
          data: [53, 32, 33, 32, 22, 43, 21, 52, 13, 43],
        },
        {
          color: '#E00606',
          name: 'Quá hạn',
          type: 'column',
          data: [12, 15, 11, 20, 22, 33, 17, 11, 9, 21],
        },
        {
          color: '#d5d5d5',
          name: 'Chưa bắt đầu',
          type: 'column',
          data: [9, 7, 5, 8, 6, 9, 4, 22, 43, 21],
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
        stacked: false,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 3,
          columnWidth: '60%',
        },
      },
      dataLabels: {
        enabled: true,
      },
      xaxis: {
        categories: [
          'Vụ Chính sách và Pháp chế',
          'Vụ Kế hoạch',
          'Vụ Khoa học và Công nghệ bảo quản',
          'Vụ quản lý hàng dự trữ',
          'Vụ Tổ chức cán bộ',
          'Vụ Tài vụ - Quản trị',
          'Văn phòng',
          'Vụ Thanh tra - Kiểm tra',
          'Cục CTTT Thống kê và Kiểm định hàng dự trữ',
          'Ban quản lý Dự án',
        ],
        labels: {
          rotate: 0,
          hideOverlappingLabels: false,
          trim: true,
          formatter: function (val) {
            return val;
          },
          style: {
            cssClass: 'aaaa',
          },
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
        title: {
          text: undefined,
        },
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val;
          },
        },
      },
      fill: {
        opacity: [1, 1, 1, 1, 1],
        gradient: {
          inverseColors: false,
          shade: 'light',
          type: 'vertical',
          opacityFrom: 0.1,
          opacityTo: 0.55,
          stops: [0, 100, 100, 100],
        },
      },
      markers: {
        size: 4,
      },
      stroke: {
        width: 2,
        // curve: "smooth"
      },
      grid: {
        borderColor: '#f1f1f1',
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetX: 0,
      },
    };
  }
  cvtdv(): void {
    this.congViectheoDonVi = {
      series: [
        {
          name: 'Tổng công việc',
          color: '#353a64',
          type: 'area',
          data: [90, 55, 41, 67, 77, 99, 64, 88, 68, 66, 55],
        },
        {
          name: 'Hoàn thành',
          color: '#8BC34C',
          type: 'column',
          data: [23, 11, 21, 27, 12, 15, 21, 12, 10, 22, 13],
        },

        {
          name: 'Đang thực hiện',
          color: '#2196f3',
          type: 'column',
          data: [13, 12, 14, 2, 13, 9, 21, 3, 7, 23, 14],
        },
        {
          name: 'Quá hạn',
          color: '#e00606',
          type: 'column',
          data: [3, 8, 4, 2, 13, 9, 6, 4, 7, 5, 7],
        },
      ],
      chart: {
        height: 350,
        type: 'line',
        stacked: true,
      },

      plotOptions: {
        bar: {
          columnWidth: '30px',
          borderRadius: 3,
        },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetY: 5,
      },
      fill: {
        opacity: [0.1, 1, 1, 1, 1],
        gradient: {
          inverseColors: false,
          shade: 'light',
          type: 'vertical',
          opacityFrom: 0.1,
          opacityTo: 0.55,
          stops: [0, 100, 100, 100],
        },
      },
      labels: [
        '01/01/2003',
        '02/01/2003',
        '03/01/2003',
        '04/01/2003',
        '05/01/2003',
        '06/01/2003',
        '07/01/2003',
        '08/01/2003',
        '09/01/2003',
        '10/01/2003',
        '11/01/2003',
      ],
      dataLabels: {
        enabled: true,
      },
      markers: {
        size: 4,
      },
      stroke: {
        width: 2,
        // curve: "smooth"
      },
      xaxis: {
        type: 'datetime',
        labels: {
          datetimeFormatter: {
            month: 'dd/MM',
          },
        },
      },
      yaxis: {
        // title: {
        //   text: "Points"
        // },
        min: 0,
      },
      tooltip: {
        shared: true,
        intersect: false,
        x: {
          format: 'dd/MM/yyyy',
        },
        y: {
          formatter: function (y) {
            if (typeof y !== 'undefined') {
              return y.toFixed(0) + ' points';
            }
            return y;
          },
        },
      },
    };
  }
  slvbctc(): void {
    this.tinhTrangCongViec = {
      series: [
        {
          name: 'Văn bản đến',
          color: '#8BC34C',
          type: 'area',
          data: [16, 13, 17, 16, 19, 11, 13, 12, 10, 15, 13],
        },

        {
          name: 'Văn bản đi',
          color: '#2196f3',
          type: 'area',
          data: [13, 11, 14, 14, 16, 10, 12, 8, 7, 13, 9],
        },
        {
          name: 'Văn bản nội bộ',
          color: '#353a64',
          type: 'area',
          data: [3, 8, 9, 12, 14, 9, 6, 4, 6, 5, 7],
        },
      ],
      chart: {
        height: 350,
        type: 'line',
        stacked: false,
      },

      plotOptions: {
        bar: {
          columnWidth: '30px',
          borderRadius: 3,
        },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetY: 5,
      },
      fill: {
        opacity: [0.1, 0.1, 0.1],
        gradient: {
          inverseColors: false,
          shade: 'light',
          type: 'vertical',
          opacityFrom: 0.1,
          opacityTo: 0.55,
          stops: [0, 100, 100, 100],
        },
      },
      labels: [
        '01/01/2003',
        '02/01/2003',
        '03/01/2003',
        '04/01/2003',
        '05/01/2003',
        '06/01/2003',
        '07/01/2003',
        '08/01/2003',
        '09/01/2003',
        '10/01/2003',
        '11/01/2003',
      ],

      dataLabels: {
        enabled: true,
      },
      markers: {
        size: 4,
      },
      stroke: {
        width: 2,
        // curve: "smooth"
      },
      xaxis: {
        type: 'datetime',
        labels: {
          datetimeFormatter: {
            month: 'dd/MM',
          },
        },
      },
      yaxis: {
        // title: {
        //   text: "Points"
        // },
        min: 0,
      },
      tooltip: {
        shared: true,
        intersect: false,
        x: {
          format: 'dd/MM/yyyy',
        },
        y: {
          formatter: function (y) {
            if (typeof y !== 'undefined') {
              return y.toFixed(0) + ' points';
            }
            return y;
          },
        },
      },
    };
  }
  ngOnInit(): void { }

  choYkien() {
    this.anchoykien = !this.anchoykien;
  }

  lichOpenLanhDao() {
    this._modalService.create({
      nzTitle: 'Thông tin công tác lãnh đạo',
      // nzContent: LichCongTacComponent,
      nzClosable: true,
      nzAutofocus: null,
      nzFooter: null,
      nzComponentParams: {
        congtacGroupedByDay: this.congtacGroupedByDay,
        totalRecord: this.totalRecord,
      },
      nzWidth: '100%',
    });
  }

  congtacGroupedByDay: any;
  totalRecord: any;
  lichcongtacLlanhdao() {
    // Accepts the array and key
    const groupBy = (array, key) => {
      // Return the end result
      return array.reduce((result, currentValue) => {
        // If an array already present for key, push it to the array. Else create an array and push the object
        (result[currentValue[key]] = result[currentValue[key]] || []).push(
          currentValue,
        );
        // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
        return result;
      }, {}); // empty object is the initial value for result object
    };

    let body = {
      pageInfo: {
        page: '1',
        pageSize: '100',
      },
      sorts: [
        {
          field: '',
          dir: 0,
        },
      ],
      filters: [
        {
          field: '',
          value: '',
        },
      ],
      keyword: '',
      leadUserId: '',
    };

    this.spinner.show();
    // this.qlCongTacLanhDao.timTheoDieuKien(body).then((res: ResponseData) => {
    //   this.spinner.hide();
    //   if (res.success) {
    //     var i = 1;
    //     let datas = res.data;
    //     datas.forEach((element) => {
    //       element.countDay = 'day' + i.toString();

    //     });
    //     this.congtacGroupedByDay = groupBy(datas, 'countDay');
    //     this.totalRecord = res.totalRecord;
    //   } else {
    //     this.notification.error(MESSAGE.ERROR, res.error);
    //   }
    // });
  }
}
