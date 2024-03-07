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
import {Validators} from "@angular/forms";
import {DanhMucService} from "../../../../services/danhmuc.service";
import {pairwise, startWith} from "rxjs/operators";
import dayjs from "dayjs";
import {saveAs} from 'file-saver';


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
interface LoaiHangHoaType{
  tenLoaiVthh: string,
  loaiVthh: string,
  loaiHang: string,
  donViTinh: string
}
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
  tonKho: Array<{ cloaiVthh: "string", dvt: "string", loaiVthh: "string", tenCloaiVthh: "string", tenLoaiVthh: "string", tonKho: 0 }> = []
  showFilterTichLuong: boolean = false;
  showFilterTonKho: boolean = false;
  dataConfigTable: {
    tieuChi: Array<{ tenTieuChi: string, maTieuChi: string, status: boolean }>, donVi: Array<{ tenTieuChi: string, maTieuChi: string, status: boolean }>
  } = {tieuChi: [], donVi: []};
  showTieuChi: boolean = true;
  showDonVi: boolean = true;
  dataTichLuongKho: any[] = [];
  dataTonKho: any[] = [];
  listHangHoa: Array<LoaiHangHoaType>=[];
  tenLoaiVthh: string='';
  tieuDeHienTrang: string='';
  titleTable: string = 'Cục DTNNKV';
  isShowDataTonKho: boolean =false;
  isChiCucSelected: boolean= false;
  donViTinh: string="";
  tongKeHoach: number=0;
  tongTonDau: number=0;
  tongNhap: number=0;
  tongXuat: number=0;
  tongTonCuoi: number=0;
  tongConLai: number=0;
  previewName: string ='';
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private bcNvQuanLyKhoTangService: BcNvQuanLyKhoTangService,
    private donViService: DonviService,
    private  danhMucSerVice: DanhMucService
  ) {
    super(httpClient, storageService, notification, spinner, modal, bcNvQuanLyKhoTangService);
    super.ngOnInit()
    this.formData = this.fb.group({
      maDvi: [''],
      maCuc: [''],
      maChiCuc: [''],
      loaiVthh: ['', [Validators.required]]
    });
    this.formData.get('loaiVthh')?.valueChanges.pipe(startWith(this.formData.get('loaiVthh')?.value), pairwise()).subscribe(([prevValue, nextValue]) => {
      if (prevValue !== nextValue) {
        const findIndex= this.listHangHoa.findIndex(f=>f.loaiVthh === nextValue);
        if(findIndex>=0){
          this.donViTinh = this.listHangHoa[findIndex].donViTinh;
        }else{
          this.donViTinh='';
        }
      }
    })
  }

  async ngOnInit() {
    await this.spinner.show();
    document.addEventListener('click', this.handleClickFilter)
    if (this.userService.isChiCuc()) {
      this.formData.controls["maCuc"].clearValidators();
    }
    try {
      await Promise.all([
        this.getLoaiVthh(),
        this.loadDonVi(this.userInfo.MA_DVI)

      ]);
    } catch (e) {
      console.log('error: ', e)
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }
  ngOnDestroy() {
    document.removeEventListener('click', this.handleClickFilter);
  }
  async getLoaiVthh(){
    const res= await this.danhMucSerVice.getAllVthhByCap(2);
    if(res.msg === MESSAGE.SUCCESS){
      this.listHangHoa= res.data.map(f=>({tenLoaiVthh: f.ten, loaiVthh: f.ma, loaiHang: f.loaiHang, donViTinh: f.maDviTinh}))
    }
  }
  clearSearch() {
    this.formData.reset();
    this.search();

  }
  resetConfig(){
    this.dataConfigTable.donVi.forEach(f => f.status = true);
    this.dataConfigTable.tieuChi.forEach(f => f.status = true);
    this.apDungTichLuongKhoConfig()
  }

  async loadChartTichLuong(body) {
    const res = await this.bcNvQuanLyKhoTangService.hienTrangKhoTangChart(body);
    if (res.msg == MESSAGE.SUCCESS) {
      // let responseData = res.data;
      this.dataTichLuongKho = cloneDeep(res.data.series).map(f=>({data: f.data, name: f.name, label: res.data.categories,group: f.group}));
      this.dataConfigTable.tieuChi= [{tenTieuChi: "Tất cả", maTieuChi: "all", status: true}].concat(Array.isArray(res.data.series)? cloneDeep(res.data.series).map(f=>({tenTieuChi: f.name, maTieuChi: f.name, status: true})): []);
      this.setTichLuongKho(this.dataTichLuongKho);
      return res;
    }
  }
  setTichLuongKho(responseData: any[] = []) {
    this.tichLuongChart = {
      series: responseData,
      chart: {
        type: "bar",
        height: 650,
        // stacked: true,
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
        },
      },
      stroke: {
        width: 1,
        colors: ["#fff"],
      },
      // dataLabels: {
      //   formatter: (val) => {
      //     return Number(val).toLocaleString("vi-VN") + " " + this.donViTinh;
      //   },
      // },
      dataLabels: {
        enabled: false
      },
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
      xaxis: {
        categories: Array.isArray(responseData[0]?.label)? responseData[0].label: []
      },
      fill: {
        opacity: 1,
        pattern: {
          width: 6,
          height: 6,
          strokeWidth: 2,
        },
      },
      colors: ["#50ff45", "#2196f3", "#b0b0b0", "#ff4d4f", "#ffaa29"],
      yaxis: {
        labels: {
          formatter: (val) => {
            return Number(val).toLocaleString("vi-VN") + " " + this.donViTinh;
          },
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
      },
    };
  };
  async loadHienTrangKhoTang(body){
    const res = await this.bcNvQuanLyKhoTangService.hienTrangKhoTang(body);
    if(res.msg === MESSAGE.SUCCESS){
      this.dataTable=Array.isArray(res.data)? res.data: [];
      const {tongKeHoach, tongTonDau, tongNhap, tongXuat, tongTonCuoi, tongConLai}=this.dataTable.reduce((obj, cur)=>{
        obj.tongKeHoach+=cur.keHoach;
        obj.tongTonDau+=cur.tonDau;
        obj.tongNhap+=cur.nhap;
        obj.tongXuat+=cur.xuat;
        obj.tongTonCuoi+=cur.tonCuoi;
        obj.tongConLai+=cur.conLai;
        return obj;
      }, {tongKeHoach: 0, tongTonDau: 0, tongNhap: 0, tongXuat: 0, tongTonCuoi: 0, tongConLai: 0});
      this.tongKeHoach=tongKeHoach;
      this.tongTonDau=tongTonDau;
      this.tongNhap=tongNhap;
      this.tongXuat=tongXuat;
      this.tongTonCuoi=tongTonCuoi;
      this.tongConLai=tongConLai;
      return res;
    }
  }

  changeLoaiHienTrang(loaiHienTrang: number) {
    this.loaiHienTrang = loaiHienTrang;
    this.setTichLuongKho([]);
    this.dataTable = [];
    this.tieuDeHienTrang='';
    this.tongKeHoach=0;
    this.tongTonDau=0;
    this.tongNhap=0;
    this.tongXuat=0;
    this.tongTonCuoi=0;
    this.tongConLai=0;
  }

  async ketXuatBaoCao() {
    try {
      await this.spinner.show();
      await this.helperService.markFormGroupTouched(this.formData);
      if (this.formData.invalid) {
        return;
      }
      let body = this.formData.value;
      body.maDvi= body.maChiCuc || body.maCuc;
      body.nam =dayjs().get('year');
      let res;
      if(this.loaiHienTrang === 0){
        res = await  this.loadChartTichLuong(body);
      }else{
        res = await  this.loadHienTrangKhoTang(body)
      }

      if(res.msg === MESSAGE.SUCCESS){
          this.isShowDataTonKho=true;
          this.isChiCucSelected=false;
          const {loaiVthh, maCuc, maChiCuc}=this.formData.value;
          this.tenLoaiVthh=''
          let tenDvi='';
          if (loaiVthh) {
            const findIndex= this.listHangHoa.findIndex(f=>f.loaiVthh === loaiVthh);
            this.tenLoaiVthh=this.listHangHoa[findIndex].tenLoaiVthh
          }
          if(!maCuc){
            tenDvi='TCDTNN'
          }
          if (maCuc) {
            const findIndex= this.listCuc.findIndex(f=>f.maDvi === maCuc);
            tenDvi=this.listCuc[findIndex].tenDvi
          }
          if (maChiCuc) {
            const findIndex= this.listChiCuc.findIndex(f=>f.maDvi === maChiCuc);
            tenDvi=this.listChiCuc[findIndex].tenDvi;
            this.isChiCucSelected=true
          }
          if(this.tenLoaiVthh){
            this.tieuDeHienTrang=`Hiện trạng kho ${tenDvi} ( Loại hàng hóa: ${this.tenLoaiVthh})`
          }
        if(this.formData.value.maChiCuc){
          this.titleTable='';
        }else if(this.formData.value.maCuc){
          this.titleTable= 'Chi cục DTNNKV';
        }else{
          this.titleTable='Cục DTNNKV';
        }

      }

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
    this.getDsDviCon(val);
  }

  async changeChiCuc(val: string) {
  }

  clearFilter() {
    // this.formData.reset();
    this.formData.patchValue({
      maDvi: "",
      maCuc: "",
      maChiCuc: "",
      loaiVthh: ""
    }, {onlySelf: true, emitEvent: false})
    if (this.userService.isTongCuc) {
      // this.formData.controls["maCuc"].setValue("", { emitEvent: false });
      this.listChiCuc = []
    };
    this.setTichLuongKho([]);
    this.dataTable=[];
    this.donViTinh='';
    this.tenLoaiVthh='';
    this.tieuDeHienTrang='';
    this.tongKeHoach=0;
    this.tongTonDau=0;
    this.tongNhap=0;
    this.tongXuat=0;
    this.tongTonCuoi=0;
    this.tongConLai=0;
  }
  handleClickFilter(e: MouseEvent){
    if((e.target as HTMLElement).closest(".apexchart_sort_tonKho")){
      e.preventDefault();
      e.stopPropagation();
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
  downloadExcel(event) {
    try {
      event.stopPropagation();
      this.spinner.show();
      let body = {
        nam: dayjs().get('year'),
        maDvi: this.formData.value.maChiCuc || this.formData.value.maCuc,
        loaiVthh: this.formData.value.loaiVthh,
        tenLoaiVthh: this.tenLoaiVthh
      }
      if(!body.loaiVthh) return this.notification.error(MESSAGE.ERROR, "Chưa có loại vật tư hàng hóa nào được chọn.");
      this.bcNvQuanLyKhoTangService
        .ketXuat(body)
        .subscribe((blob) =>
          saveAs(blob, 'bao-cao-hien-trang-kho-tang.xlsx'),
        );
      this.showDlgPreview = true;
    } catch (e) {
      console.log(e);
    } finally {
      this.spinner.hide();
    }
  }
}
