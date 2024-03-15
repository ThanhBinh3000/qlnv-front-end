import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { Base3Component } from 'src/app/components/base3/base3.component';
import { DonviService } from 'src/app/services/donvi.service';
import { QthtChotGiaNhapXuatService } from 'src/app/services/quantri-hethong/qthtChotGiaNhapXuat.service';
import { StorageService } from 'src/app/services/storage.service';
import {MangLuoiKhoService} from "../../../../services/qlnv-kho/mangLuoiKho.service";
import { cloneDeep, chain } from 'lodash';
import {QthtKetChuyenService} from "../../../../services/quantri-hethong/qthtKetChuyen.service";
import {MESSAGE} from "../../../../constants/message";
import {
  DialogThemMoiSlGtriHangDtqgComponent
} from "../../../bao-cao-bo-nganh/lap-bao-cao-bo-nganh/sl-gtri-hang-dtqg/dialog-them-moi-sl-gtri-hang-dtqg/dialog-them-moi-sl-gtri-hang-dtqg.component";
import {slGtriHangDtqg} from "../../../../models/BaoCaoBoNganh";
import {TmKetChuyenComponent} from "./tm-ket-chuyen/tm-ket-chuyen.component";

@Component({
  selector: 'app-ket-chuyen',
  templateUrl: './ket-chuyen.component.html',
  styleUrls: ['./ket-chuyen.component.scss']
})
export class KetChuyenComponent extends Base3Component implements OnInit {

  dsCuc: any = [];
  dsChiCuc: any = [];
  dsDiemKho: any = [];
  dsNhaKho: any = [];
  dsNganKho: any = [];
  dsLoKho: any = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private _service: QthtKetChuyenService,
    private mangLuoiKhoService : MangLuoiKhoService,
    private donViService : DonviService
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, _service);
    this.formData = this.fb.group({
      nam : [],
      maCuc : [],
      maChiCuc : [],
      maDiemKho : [],
      maNhaKho : [],
      maNganKho : [],
      maLoKho : [],
    });
  }

  dataSaved :any = {}

  async ngOnInit() {
    this.loadDsCuc();
    this.formData.patchValue({
      nam : dayjs().get('year'),
    })
    await this.searchPage();
  }


  themMoiKetChuyen(){
    const modalGT = this.modal.create({
      nzTitle: '',
      nzContent: TmKetChuyenComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '650px',
      nzFooter: null,
      nzClassName: '',
      nzComponentParams: {

      },
    });
    modalGT.afterClose.subscribe((res) => {
      console.log(res);
      if(res){
        this.searchPage();
      }
    });
  }

  async getData() {
    console.log(this.formData.value);
    let body = {
      "maDvi": '010101',
      "capDvi": '2'
    }
    await this.mangLuoiKhoService.getDetailByMa(body).then(async (res) => {
      console.log(res)
      if (res.data) {
        this.dataSaved = {
          nam: this.formData.value.nam,
          maDvi : this.userInfo.MA_DVI,
          tenVietTat : this.userInfo.DON_VI.tenVietTat,
          tenNguoiTao: this.userInfo.TEN_DAY_DU,
          ngayTu: this.formData.value.ngayTu,
          ngayDen: this.formData.value.ngayDen,
          expandSet: true,
        }
        const data = res.data.object;
        this.dataSaved.children = data.ctietHhTrongKho;
        this.dataSaved.children.forEach(item => {
          item.nam = this.dataSaved.nam;
        })
        await this.buildTableKetChuyen();
      }
    });
  }

  save(){
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có muôn chốt dữ liệu kết chuyển ?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        let dataTableSaved = [];
        if(this.dataSaved.childrenGroup){
          this.dataSaved.childrenGroup.forEach(i1 => {
            i1.children.forEach(i2 => {
              let body = {
                nam : i2.nam,
                ngayTu : i2.ngayTu,
                ngayDen : i2.ngayDen,
                tenChiCuc : i2.tenChiCuc,
                maDvi : null,
                children : null
              };
              let dataChilren = [];
              i2.children.forEach( loaiVthh => {
                loaiVthh.children.forEach( cloaiVthh => {
                  dataChilren = [...dataChilren,...cloaiVthh.children];
                })
              })
              body.maDvi = dataChilren[0].maDonVi?.substring(0,8)
              body.children = dataChilren;
              dataTableSaved.push(body);
            })
          })
        }
        if(dataTableSaved.length == 0){
          this.notification.error(MESSAGE.ERROR, 'Không có dữ liệu để chốt kết chuyển');
          this.spinner.hide();
          return;
        }
        this.createUpdate(dataTableSaved).then((res)=>{
          if(res){
            location.reload()
          }
        })
      },
    });
  }


  async buildTableKetChuyen() {
    this.dataSaved.childrenGroup = await chain(this.dataSaved.children).groupBy('nam').map((v, k) =>
    {
      let chiCuc = chain(v).groupBy('tenChiCuc').map((v1, k1) =>
      {
        let loaiVthh = chain(v1).groupBy("tenLoaiVthh").map((v2, k2) =>
        {
          let cloaiVthh = chain(v2).groupBy("tenCloaiVthh").map((v3, k3) =>
          {
            return {
              tenCloaiVthh: k3,
              tenDonViTinh : v3[0]?.tenDonViTinh,
              children : v3,
              slTonKhoSoSach : v3.reduce((prev, cur) => { prev += cur.slHienThoi;
                return prev;
              }, 0),
              slTonKhoThucTe : v3.reduce((prev, cur) => { prev += cur.slHienThoi;
                return prev;
              }, 0),
            }
          }).value();
          return {
            tenLoaiVthh: k2,
            children : cloaiVthh,
            expandSet : true,
          }
        }).value();
        return {
          tenChiCuc : k1,
          children : loaiVthh,
          expandSet : true,
          tenNguoiTao : this.dataSaved.tenNguoiTao,
          ngayTu : this.dataSaved.ngayTu,
          ngayDen : this.dataSaved.ngayDen,
          nam : this.dataSaved.nam
        }
      }).value();
      return {
        nam : k,
        children : chiCuc,
        expandSet : true,
      }
    }).value();
    console.log(this.dataSaved.childrenGroup);
    console.log(this.dataTable);
    this.dataSaved.childrenGroup.forEach( item => {
      item.children = item.children.filter(x => !(this.dataTable.find(y => y.nam == item.nam && y.tenChiCuc == x.tenChiCuc)));
    })

  }

  async buildTableView() {
    this.dataTableAll = await chain(this.dataTable).groupBy('nam').map((v, k) =>
    {
      return {
        nam : k,
        children : v,
        expandSet : true,
      }
    }).value();

    this.dataTableAll.forEach( nam => {
      nam.children.forEach( cc => {
        cc.childrenGroup = chain(cc.children).groupBy("tenLoaiVthh").map((v2, k2) =>
        {
          let cloaiVthh = chain(v2).groupBy("tenCloaiVthh").map((v3, k3) =>
          {
            return {
              tenCloaiVthh: k3,
              tenDonViTinh : v3[0]?.tenDonViTinh,
              children : v3,
              slTonKhoSoSach : v3.reduce((prev, cur) => { prev += cur.slHienThoi;
                return prev;
              }, 0),
              slTonKhoThucTe : v3.reduce((prev, cur) => { prev += cur.slHienThoi;
                return prev;
              }, 0),
            }
          }).value();
          return {
            tenLoaiVthh: k2,
            children : cloaiVthh,
            expandSet : true,
          }
        }).value();
      })
    })


    console.log('dataTable',this.dataTable);
    console.log('dataTableAll',this.dataTableAll);
  }


  async loadDsCuc() {
    let res = await this.donViService.layTatCaDonViByLevel(2);
    if (res && res.data) {
      this.dsCuc = res.data
      this.dsCuc = this.dsCuc.filter(item => item.type != "PB" && item.maDvi.startsWith(this.userInfo.MA_DVI))
    }
    if(this.userService.isChiCuc()){
      this.formData.patchValue({
        maDviSr : this.userInfo.MA_DVI
      })
    }
  }

  async searchPage(){
    this.formData.patchValue({
      maDviSr : this.getMaDviSr()
    });
    await this.search()
  }


  getMaDviSr():string {
    if(this.formData.value.maLoKho){
      return this.formData.value.maLoKho
    } else if(this.formData.value.maNganKho){
      return this.formData.value.maNganKho
    } else if(this.formData.value.maNhaKho){
      return this.formData.value.maNhaKho
    } else if(this.formData.value.maDiemKho){
      return this.formData.value.maDiemKho
    } else if(this.formData.value.maChiCuc){
      return this.formData.value.maChiCuc
    } else if(this.formData.value.maCuc){
      return this.formData.value.maCuc
    }
    return null;
  }

  async changeDonVi(event: any,level) {
    if (event) {
      let res = await this.donViService.layTatCaDonViByLevel(level);
      if (res && res.data) {
        if(level == 3){
          this.dsChiCuc = res.data
          this.dsChiCuc = this.dsChiCuc.filter(item => item.type != "PB" && item.maDvi.startsWith(event))
        }
        if(level == 4){
          this.dsDiemKho = res.data
          this.dsDiemKho = this.dsDiemKho.filter(item => item.type != "PB" && item.maDvi.startsWith(event))
        }
        if(level == 5){
          this.dsNhaKho = res.data
          this.dsNhaKho = this.dsNhaKho.filter(item => item.type != "PB" && item.maDvi.startsWith(event))
        }
        if(level == 6){
          this.dsNganKho = res.data
          this.dsNganKho = this.dsNganKho.filter(item => item.type != "PB" && item.maDvi.startsWith(event))
        }
        if(level == 7){
          this.dsLoKho = res.data
          this.dsLoKho = this.dsLoKho.filter(item => item.type != "PB" && item.maDvi.startsWith(event))
        }
      }
    }
  }

}
