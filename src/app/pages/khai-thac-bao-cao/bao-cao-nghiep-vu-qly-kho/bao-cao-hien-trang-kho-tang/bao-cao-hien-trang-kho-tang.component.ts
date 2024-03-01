import { cloneDeep } from 'lodash';
import { DonviService } from './../../../../services/donvi.service';
import { Component, OnInit, ViewChild } from '@angular/core';
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
import { HttpClient } from "@angular/common/http";
import { StorageService } from "src/app/services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { BcNvQuanLyKhoTangService } from "src/app/services/bao-cao/BcNvQuanLyKhoTang.service";
import { MESSAGE } from "src/app/constants/message";
import { Base2Component } from "src/app/components/base2/base2.component";


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
};
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
};

@Component({
  selector: 'app-bao-cao-hien-trang-kho-tang',
  templateUrl: './bao-cao-hien-trang-kho-tang.component.html',
  styleUrls: ['./bao-cao-hien-trang-kho-tang.component.scss']
})
export class BaoCaoHienTrangKhoTangComponent extends Base2Component implements OnInit {
  public tichLuongChart: Partial<ChartOptionsColumn>;
  public tonKhoChart: Partial<ChartOptionsLine>;
  listCuc: any[] = [];
  listChiCuc: any[] = [];
  loaiHienTrang: number = 0;
  tongTichLuongVt: number;
  tongTichLuongVtDsd: number;
  tongTichLuongVtCsd: number;
  tongTichLuongLt: number;
  tongTichLuongLtDsd: number;
  tongTichLuongLtCsd: number;
  tonKho: Array<{ cloaiVthh: "string", dvt: "string", loaiVthh: "string", tenCloaiVthh: "string", tenLoaiVthh: "string", tonKho: 0 }> = []
  showFilterTichLuong: boolean = false;
  showFilterTonKho: boolean = false;
  dataConfigTable: {
    tieuChi: Array<{ tenTieuChi: string, maTieuChi: string, status: boolean }>, donVi: Array<{ tenTieuChi: string, maTieuChi: string, status: boolean }>
  } = {
      tieuChi: [
        { tenTieuChi: 'Tất cả', maTieuChi: 'all', status: true },
        { tenTieuChi: 'Tổng tích lượng lương thực đã sử dụng (tấn kho)', maTieuChi: 'tongTichLuongLuongThucDaSuDung', status: true },
        { tenTieuChi: 'Tổng tích lượng lương thực khả dụng (tấn kho)', maTieuChi: 'tongTichLuongLuongThucKhaDung', status: true },
        { tenTieuChi: 'Tổng tích lượng vật tư đã sử dụng (tấn kho)', maTieuChi: 'tongTichLuongVatTuDaSuDung', status: true },
        { tenTieuChi: 'Tổng tích lượng vật tư khả dụng (tấn kho)', maTieuChi: 'tongTichLuongVatTuKhaDung', status: true },
      ], donVi: []
    };
  dataConfigTableTonKho: { tieuChi: Array<{ tenTieuChi: string, maTieuChi: string, status: boolean }>, donVi: Array<{ tenTieuChi: string, maTieuChi: string, status: boolean }> } = { tieuChi: [], donVi: [] }
  showTieuChi: boolean = true;
  showDonVi: boolean = true;
  dataTichLuongKho: any[] = [];
  dataTonKho: any[] = [];
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private bcNvQuanLyKhoTangService: BcNvQuanLyKhoTangService,
    private donViService: DonviService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bcNvQuanLyKhoTangService);
    super.ngOnInit()
    this.formData = this.fb.group({
      maDvi: [''],
      maCuc: [''],
      maChiCuc: [''],
    });
    // this.tichLuongChart = {}
    // this.tonKhoChart = {}
    /*    this.search();
        this.filterTable = {};*/
  }

  async ngOnInit() {
    await this.spinner.show();
    if (this.userService.isChiCuc()) {
      this.formData.controls["maCuc"].clearValidators();
    }
    try {
      await Promise.all([
        this.loadChartTichLuong(),
        this.loadChartTonKho(),
        this.ketXuatBaoCao(),
        this.loadDonVi(this.userInfo.MA_DVI)

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
  resetConfig(type: number) { //type: 1 tích lượng, 2 tồn kho
    if (type === 1) {
      this.dataConfigTable.donVi.forEach(f => f.status = true);
      this.dataConfigTable.tieuChi.forEach(f => f.status = true);
      this.apDungTichLuongKhoConfig()
    } else if (type === 2) {
      this.dataConfigTableTonKho.donVi.forEach(f => f.status = true);
      this.dataConfigTableTonKho.tieuChi.forEach(f => f.status = true);
      this.apDungTonKhoConfig()
    }
  }

  async loadChartTichLuong() {
    let res = await this.bcNvQuanLyKhoTangService.hienTrangTichLuongKho({ maDvi: this.formData.value.maDvi });
    if (res.msg == MESSAGE.SUCCESS) {
      // let responseData = res.data;
      this.dataTichLuongKho = cloneDeep(res.data);
      this.setTichLuongKho(this.dataTichLuongKho)
      console.log(this.tichLuongChart)
    }
  }
  setTichLuongKho(responseData: any[] = []) {
    this.tichLuongChart = {
      series: responseData,
      chart: {
        type: "bar",
        height: 650,
        stacked: true,
        toolbar: {
          tools: {
            customIcons: [
              {
                icon: '<i class ="icon htvbdh_filter"></i>',
                title: 'Sort',
                index: 1,
                class: 'apexchart_sort_tichluong',
                click: (chart, options, e) => this.openModal(e, 1)
              }
            ]
          }
        }
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
        categories: responseData[0]?.label
      },
      fill: {
        opacity: 1,
        pattern: {
          width: 6,
          height: 6,
          strokeWidth: 2,
        },
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
  }
  async loadChartTonKho() {
    let res = await this.bcNvQuanLyKhoTangService.hienTrangTonKho({ maDvi: this.formData.value.maDvi });
    if (res.msg == MESSAGE.SUCCESS) {
      let responseData = Array.isArray(res.data) ? res.data : [];
      this.dataTonKho = cloneDeep(responseData);
      this.dataConfigTableTonKho.tieuChi = [{ tenTieuChi: 'Tất cả', maTieuChi: 'all', status: true }].concat(responseData.map(f => ({ tenTieuChi: f.name, maTieuChi: '', status: true })));
      this.setTonKho(this.dataTonKho);
      console.log(this.tonKhoChart)
    }
  }
  setTonKho(responseData: any[] = []) {
    this.tonKhoChart = {
      series: responseData,
      chart: {
        height: 550,
        type: "line",
        toolbar: {
          tools: {
            customIcons: [
              {
                icon: '<i class ="icon htvbdh_filter"></i>',
                title: 'Sort',
                index: 4,
                class: 'apexchart_sort_tonKho',
                click: (chart, options, e) => this.openModal(e, 2)
              }
            ]
          }
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 5,
        curve: "smooth",
        //dashArray: [0, 8, 5]
      },

      legend: {
        tooltipHoverFormatter: function (val, opts) {
          return (
            val +
            " - <strong>" +
            Number(opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex]).toLocaleString("vi-VN") +
            "</strong>"
          );
        },
        position: 'right',
      },
      markers: {
        size: 7,
        hover: {
          sizeOffset: 6
        }
      },
      xaxis: {
        labels: {
          trim: false,
          offsetX: 10
        },
        categories: responseData[0]?.label
      },
      yaxis: {
        labels: {
          formatter: (val) => {
            return Number(val).toLocaleString("vi-VN") + "";
          },
        },
      },
      tooltip: {
        y: [
          /*{
            title: {
              formatter: function(val) {
                return val;
              }
            }
          },
          {
            title: {
              formatter: function(val) {
                return val + " per session";
              }
            }
          },
          {
            title: {
              formatter: function(val) {
                return val;
              }
            }
          }*/
        ]
      },
      grid: {
        borderColor: "#f1f1f1"
      }
    };
  }

  changeLoaiHienTrang(loaiHienTrang: number) {
    this.loaiHienTrang = loaiHienTrang;
  }

  async ketXuatBaoCao() {
    try {
      this.spinner.show();
      this.helperService.markFormGroupTouched(this.formData);
      if (this.formData.invalid) {
        return;
      }
      let body = this.formData.value;
      const data = await this.bcNvQuanLyKhoTangService.hienTrangKhoTang(body);
      this.tongTichLuongVt = data.tongTichLuongVt;
      this.tongTichLuongVtDsd = data.tongTichLuongVtDsd;
      this.tongTichLuongVtCsd = data.tongTichLuongVtCsd;
      this.tongTichLuongLt = data.tongTichLuongLt;
      this.tongTichLuongLtDsd = data.tongTichLuongLtDsd;
      this.tongTichLuongLtCsd = data.tongTichLuongLtCsd;
      this.tonKho = Array.isArray(data.tonKho) ? data.tonKho.reduce((arr, cur) => {
        const vthh = cur.cloaiVthh ? `${cur.cloaiVthh}-${cur.loaiVthh}` : cur.loaiVthh;
        const findIndex = arr.findIndex(f => f.vthh === vthh);
        if (findIndex >= 0) {
          arr[findIndex].tonKho += cur.tonKho
        } else {
          arr.push({ ...cur, vthh })
        }
        return arr
      }, []) : [];

    } catch (error) {
      console.log("error", error)
    }
    finally {
      this.spinner.hide();
    }
  }

  async loadDonVi(maDviCha: string) {
    try {

      let body = {
        trangThai: "01",
        maDviCha,
        type: "DV"
      }
      if (this.userService.isTongCuc() || this.userService.isCuc()) {
        const res = await this.donViService.getDonViTheoMaCha(body);
        if (res.msg === MESSAGE.SUCCESS) {
          if (this.userService.isTongCuc()) {
            this.listCuc = res.data;
            this.listChiCuc = [];
          } else if (this.userService.isCuc()) {
            this.formData.controls["maCuc"].setValue(this.userInfo.MA_DVI, { emitEvent: false })
            this.listCuc = [{ maDvi: this.userInfo.MA_DVI, tenDvi: this.userInfo.TEN_DVI }];
            this.listChiCuc = res.data;
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg)
        }
      } else if (this.userService.isChiCuc()) {
        this.formData.controls["maChiCuc"].setValue(this.userInfo.MA_DVI, { emitEvent: false })
        this.listChiCuc = [{ maDvi: this.userInfo.MA_DVI, tenDvi: this.userInfo.TEN_DVI }];
      }
    } catch (error) {
      console.log("e", error);
    } finally {
      this.dataConfigTable.donVi = [{ tenTieuChi: 'Tất cả', maTieuChi: 'all', status: true }].concat(this.listCuc.map(f => ({ tenTieuChi: f.tenDvi, maTieuChi: f.maDvi, status: true })));
      this.dataConfigTableTonKho.donVi = [{ tenTieuChi: 'Tất cả', maTieuChi: 'all', status: true }].concat(this.listCuc.map(f => ({ tenTieuChi: f.tenDvi, maTieuChi: f.maDvi, status: true })));
    }
  }

  async getDsDviCon(maDvCha: string) {
    try {

      let body = {
        trangThai: "01",
        maDviCha: maDvCha,
        type: "DV"
      };
      let res = await this.donViService.getDonViTheoMaCha(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.listChiCuc = res.data;
        this.formData.patchValue({ maChiCuc: "" })
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    } catch (error) {
      console.log("e", error)
    }
  }

  async changeCuc(val: string) {
    try {
      this.formData.patchValue({
        maDvi: val
      });
      await this.spinner.show();
      await Promise.all([
        this.loadChartTichLuong(),
        this.loadChartTonKho(),
      ]);
    } catch (e) {
      console.log('error: ', e)
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
    this.getDsDviCon(val);
  }

  async changeChiCuc(val: string) {
    try {
      this.formData.patchValue({
        maDvi: val
      });
      if (this.formData.value.maChiCuc) {
        await this.spinner.show();
        await Promise.all([
          this.loadChartTichLuong(),
          this.loadChartTonKho(),
        ]);
      }
    } catch (e) {
      console.log('error: ', e)
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  clearFilter() {
    // this.formData.reset();
    this.formData.patchValue({
      maChiCuc: "",
    })
    if (this.userService.isTongCuc) {
      this.formData.controls["maCuc"].setValue("", { emitEvent: false });
      this.listChiCuc = []
    }
  }

  openModal(e: MouseEvent, val: number) {
    if (val === 1) {
      this.showFilterTichLuong = true;
    } else if (val === 2) {
      this.showFilterTonKho = true
    }
  }

  handleCancelTichLuong() {
    this.showFilterTichLuong = false;
  }
  handleChangeStatus(status: boolean, key: 'tieuChi' | 'donVi', subKey: string) {
    if (subKey === "all") {
      this.dataConfigTable[key].forEach(element => {
        element.status = status;
      });
    } else {
      const allIndex = this.dataConfigTable[key].findIndex(f => f.maTieuChi === 'all');
      if (status) {
        const checkFalseIndex = this.dataConfigTable[key].findIndex(f => f.maTieuChi !== 'all' && !f.status);
        if (checkFalseIndex < 0) {
          this.dataConfigTable[key][allIndex].status = true;
        }
      } else {
        this.dataConfigTable[key][allIndex].status = false;
      }
      console.log("this.dataConfigTable", this.dataConfigTable)
    };
  }
  handleChangeStatusTonKho(status: boolean, key: 'tieuChi' | 'donVi', subKey: string) {
    if (subKey === "all") {
      this.dataConfigTableTonKho[key].forEach(element => {
        element.status = status;
      });
    } else {
      const allIndex = this.dataConfigTableTonKho[key].findIndex(f => f.maTieuChi === 'all');
      if (status) {
        const checkFalseIndex = this.dataConfigTableTonKho[key].findIndex(f => f.maTieuChi !== 'all' && !f.status);
        if (checkFalseIndex < 0) {
          this.dataConfigTableTonKho[key][allIndex].status = true;
        }
      } else {
        this.dataConfigTableTonKho[key][allIndex].status = false;
      }
      console.log("this.dataConfigTableTonKho", this.dataConfigTableTonKho)
    };
  }
  apDungTichLuongKhoConfig() {
    let dataTichLuongKhoFilter = [];
    const allTieuChiIndex = this.dataConfigTable.tieuChi.findIndex(f => f.maTieuChi === 'all');
    const allDonViIndex = this.dataConfigTable.donVi.findIndex(f => f.maTieuChi === 'all');
    if (this.dataConfigTable.tieuChi[allTieuChiIndex]?.status) {
      if (this.dataConfigTable.donVi[allDonViIndex].status) {
        dataTichLuongKhoFilter = cloneDeep(this.dataTichLuongKho)
      } else {
        this.dataTichLuongKho.forEach((item: { data: number[], label: string[], group: string, name: string }, index: number) => {
          let listLabel = [];
          let listLabelIndex = []
          let data = [];
          cloneDeep(item.label).forEach((f, i1) => {
            if (this.dataConfigTable.donVi.findIndex(m => m.tenTieuChi === f && m.status) >= 0) {
              listLabel.push(f);
              listLabelIndex.push(i1)
            }
          });
          listLabelIndex.forEach(i => {
            data.push(item.data[i])
          })
          dataTichLuongKhoFilter.push({ data, label: listLabel, group: item.group, name: item.name })
        })
      }
    }
    else {
      if (this.dataConfigTable.donVi[allDonViIndex].status) {
        dataTichLuongKhoFilter = cloneDeep(this.dataTichLuongKho.filter(f => this.dataConfigTable.tieuChi.findIndex(m => m.tenTieuChi === f.name && m.status) >= 0))
      } else {
        this.dataTichLuongKho.filter(f => this.dataConfigTable.tieuChi.findIndex(m => m.tenTieuChi === f.name && m.status) >= 0).forEach((item: { data: number[], label: string[], group: string, name: string }, index: number) => {
          let listLabel = [];
          let listLabelIndex = []
          let data = [];
          cloneDeep(item.label).forEach((f, i1) => {
            if (this.dataConfigTable.donVi.findIndex(m => m.tenTieuChi === f && m.status) >= 0) {
              listLabel.push(f);
              listLabelIndex.push(i1)
            }
          });
          listLabelIndex.forEach(i => {
            data.push(item.data[i])
          })
          dataTichLuongKhoFilter.push({ data, label: listLabel, group: item.group, name: item.name })
        })
      }
    }
    this.setTichLuongKho(dataTichLuongKhoFilter)
    this.handleCancelTichLuong();
  };
  handleCancelTonKho() {
    this.showFilterTonKho = false;

  };
  apDungTonKhoConfig() {
    let dataTonKhoFilter = [];
    const allTieuChiIndex = this.dataConfigTableTonKho.tieuChi.findIndex(f => f.maTieuChi === 'all');
    const allDonViIndex = this.dataConfigTableTonKho.donVi.findIndex(f => f.maTieuChi === 'all');
    if (this.dataConfigTableTonKho.tieuChi[allTieuChiIndex]?.status) {
      if (this.dataConfigTableTonKho.donVi[allDonViIndex]?.status) {
        dataTonKhoFilter = cloneDeep(this.dataTonKho)
      } else {
        this.dataTonKho.forEach((item: { data: number[], label: string[], group: string, name: string }, index: number) => {
          let listLabel = [];
          let listLabelIndex = []
          let data = [];
          cloneDeep(item.label).forEach((f, i1) => {
            if (this.dataConfigTableTonKho.donVi.findIndex(m => m.tenTieuChi === f && m.status) >= 0) {
              listLabel.push(f);
              listLabelIndex.push(i1)
            }
          });
          listLabelIndex.forEach(i => {
            data.push(item.data[i])
          })
          dataTonKhoFilter.push({ data, label: listLabel, group: item.group, name: item.name })
        })
      }
    }
    else {
      if (this.dataConfigTableTonKho.donVi[allDonViIndex]?.status) {
        dataTonKhoFilter = cloneDeep(this.dataTonKho.filter(f => this.dataConfigTableTonKho.tieuChi.findIndex(m => m.tenTieuChi === f.name && m.status) >= 0))
      } else {
        this.dataTonKho.filter(f => this.dataConfigTableTonKho.tieuChi.findIndex(m => m.tenTieuChi === f.name && m.status) >= 0).forEach((item: { data: number[], label: string[], group: string, name: string }, index: number) => {
          let listLabel = [];
          let listLabelIndex = []
          let data = [];
          cloneDeep(item.label).forEach((f, i1) => {
            if (this.dataConfigTableTonKho.donVi.findIndex(m => m.tenTieuChi === f && m.status) >= 0) {
              listLabel.push(f);
              listLabelIndex.push(i1)
            }
          });
          listLabelIndex.forEach(i => {
            data.push(item.data[i])
          })
          dataTonKhoFilter.push({ data, label: listLabel, group: item.group, name: item.name })
        })
      }
    }
    this.setTonKho(dataTonKhoFilter)
    this.handleCancelTonKho();
  }
}
