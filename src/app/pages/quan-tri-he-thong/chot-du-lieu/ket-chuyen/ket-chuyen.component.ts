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

@Component({
  selector: 'app-ket-chuyen',
  templateUrl: './ket-chuyen.component.html',
  styleUrls: ['./ket-chuyen.component.scss']
})
export class KetChuyenComponent extends Base3Component implements OnInit {

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
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, _service);
    this.formData = this.fb.group({
      id: [],
      nam : [],
      tenDvi: [],
      tenVietTat : [],
      tenNguoiTao : [],
      ngayTu: [],
      ngayDen: [],
    });
  }

  dataSaved :any = {}

  async ngOnInit() {
    this.formData.patchValue({
      nam : dayjs().get('year'),
      tenNguoiTao: this.userInfo.TEN_DAY_DU,
      tenVietTat : this.userInfo.DON_VI.tenVietTat,
      tenDvi : this.userInfo.TEN_DVI,
      maDvi : this.userInfo.MA_DVI,
      ngayTu : dayjs('1-1-'+dayjs().get('year')).format('YYYY-MM-DD') + " 00:00:00",
      ngayDen : dayjs().format('YYYY-MM-DD HH:mm:ss'),
    })
    await this.search();
    this.buildTableView();
    await this.getData();
  }

  async getData() {
    console.log(this.formData.value);
    let body = {
      "maDvi": this.userInfo.MA_DVI,
      "capDvi": this.userInfo.CAP_DVI
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

}
