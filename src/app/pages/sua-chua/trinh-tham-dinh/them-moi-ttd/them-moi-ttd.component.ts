import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Base3Component } from 'src/app/components/base3/base3.component';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { StorageService } from 'src/app/services/storage.service';
import { TongHopScService } from "../../../../services/sua-chua/tongHopSc.service";
import { MESSAGE } from "../../../../constants/message";
import { cloneDeep, chain } from 'lodash';
import * as moment from 'moment';
import { Validators } from "@angular/forms";
import dayjs from "dayjs";
import { TrinhThamDinhScService } from "../../../../services/sua-chua/trinhThamDinhSc.service";
import { STATUS } from "../../../../constants/status";

@Component({
  selector: 'app-them-moi-ttd',
  templateUrl: './them-moi-ttd.component.html',
  styleUrls: ['./them-moi-ttd.component.scss']
})
export class ThemMoiTtdComponent extends Base3Component implements OnInit {
  fileCanCu: any[] = [];
  symbol: string = '';
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private trinhThamDinhScService: TrinhThamDinhScService,
    private tongHopScService: TongHopScService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, trinhThamDinhScService);
    this.defaultURL = 'sua-chua/trinh-tham-dinh'
    this.getId();
    this.formData = this.fb.group({
      id: [null],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      soTtr: [null, [Validators.required]],
      soTtrTcuc: [null,],
      ngayTao: [dayjs().format("YYYY-MM-DD"), [Validators.required]],
      maThHdr: [null, [Validators.required]],
      idThHdr: [null, [Validators.required]],
      ngayDuyetLdc: [null],
      thoiHanXuat: [null,],
      thoiHanXuatDk: [null, [Validators.required]],
      thoiHanNhap: [null,],
      thoiHanNhapDk: [null, [Validators.required]],
      soQdSc: [null],
      trichYeu: [null, [Validators.required]],
      ysKien: [null],
      ketQua: [null],
      lyDoTuChoi: [null],
    });
    this.symbol = this.userInfo.MA_TR;
  }

  async ngOnInit() {
    await Promise.all([
      this.getId(),
      this.initForm()
    ])
  }

  initForm() {
    if (this.id) {
      this.detail(this.id).then((res) => {
        if (res) {
          let ttr = res.soTtr.split('/')[0];
          this.formData.patchValue({
            soTtr: ttr
          })
          this.dataTable = chain(res.children).groupBy('scDanhSachHdr.tenChiCuc').map((value, key) => ({
            expandSet: true,
            tenDonVi: key,
            children: value,
          })
          ).value()
        }
      })
    }
  }

  showSave() {
    let trangThai = this.formData.value.trangThai;
    if (this.userService.isCuc()) {
      return (trangThai == STATUS.DU_THAO || trangThai == STATUS.TU_CHOI_TP || trangThai == STATUS.TU_CHOI_LDC || trangThai == STATUS.TU_CHOI_LDV || trangThai == STATUS.TU_CHOI_CBV) && this.userService.isAccessPermisson('SCHDTQG_HSSC_THEM');
    }
    if (this.userService.isTongCuc()) {
      return (trangThai == STATUS.DA_DUYET_LDC || trangThai == STATUS.DANG_DUYET_CB_VU) && this.userService.isAccessPermisson('SCHDTQG_HSSC_THEM');
    }
    return false
  }

  save(isGuiDuyet?) {
    this.spinner.show();
    let body = this.formData.value;
    body.fileDinhKemReq = this.fileDinhKem;
    body.fileCanCuReq = this.fileCanCu;
    let children = []
    this.dataTable.forEach(item => {
      item.children.forEach(data => {
        children.push(data.scDanhSachHdr);
      })
    })
    body.children = children;
    if (this.formData.value.soTtr) {
      body.soTtr = this.formData.value.soTtr + '/' + this.symbol
    }
    this.createUpdate(body).then((res) => {
      if (res) {
        if (isGuiDuyet) {
          this.id = res.id;
          this.formData.patchValue({
            trangThai: res.trangThai
          })
          this.pheDuyet();
        } else {
          this.redirectDefault();
        }
      }
    })
  }

  openDialogDanhSach() {
    if (this.disabledTrinh()) {
      return;
    }
    this.spinner.show();
    this.tongHopScService.getDanhSachTrinhThamDinh({}).then((res) => {
      this.spinner.hide();
      if (res.data) {
        res.data?.forEach(item => {
          item.ngayXuat = item.thoiHanXuat;
          item.ngayNhap = item.thoiHanNhap;
        })
        const modalQD = this.modal.create({
          nzTitle: 'Danh sách sửa chữa',
          nzContent: DialogTableSelectionComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzWidth: '900px',
          nzFooter: null,
          nzComponentParams: {
            dataTable: res.data,
            dataHeader: ['Mã danh sách', 'Tên danh sách', 'Thời gian tổng hợp', 'Thời hạn xuất', 'Thời hạn nhập'],
            dataColumn: ['maDanhSach', 'tenDanhSach', 'thoiGianTh', 'ngayXuat', 'ngayNhap']
          },
        });
        modalQD.afterClose.subscribe(async (data) => {
          if (data) {
            this.spinner.show();
            this.tongHopScService.getDetail(data.id).then((res) => {
              this.spinner.hide();
              if (res.data) {
                const dataTh = res.data
                this.formData.patchValue({
                  maThHdr: dataTh.maDanhSach,
                  idThHdr: dataTh.id,
                  thoiHanNhapDk: data.thoiHanNhap,
                  thoiHanXuatDk: data.thoiHanXuat,
                  thoiHanNhap: data.thoiHanNhap,
                  thoiHanXuat: data.thoiHanXuat,
                })
                this.dataTable = chain(dataTh.children).groupBy('scDanhSachHdr.tenChiCuc').map((value, key) => ({
                  expandSet: true,
                  tenDonVi: key,
                  children: value,
                })
                ).value()
              }
            })
          }
        });
      }
    })
  }

  disabledTrinh() {
    let trangThai = this.formData.value.trangThai;
    return trangThai == STATUS.CHO_DUYET_TP || trangThai == STATUS.CHO_DUYET_LDC || trangThai == STATUS.DA_DUYET_LDC
      || trangThai == STATUS.CHO_DUYET_LDV || trangThai == STATUS.CHO_DUYET_LDTC || trangThai == STATUS.DA_DUYET_LDTC || trangThai == STATUS.DANG_DUYET_CB_VU || trangThai == STATUS.TU_CHOI_LDTC;
  }

  disabledThamDinh() {
    let trangThai = this.formData.value.trangThai;
    return trangThai == STATUS.CHO_DUYET_LDV || trangThai == STATUS.CHO_DUYET_LDTC || trangThai == STATUS.DA_DUYET_LDTC;
  }

  showPheDuyetTuChoi() {
    let trangThai = this.formData.value.trangThai;
    if (this.userService.isCuc()) {
      return (trangThai == STATUS.CHO_DUYET_TP && this.userService.isAccessPermisson('SCHDTQG_HSSC_DUYETTP')) || (trangThai == STATUS.CHO_DUYET_LDC && this.userService.isAccessPermisson('SCHDTQG_HSSC_DUYETLDC'));
    }
    if (this.userService.isTongCuc()) {
      return (trangThai == STATUS.CHO_DUYET_LDV && this.userService.isAccessPermisson('SCHDTQG_HSSC_DUYETLDV')) || (trangThai == STATUS.CHO_DUYET_LDTC && this.userService.isAccessPermisson('SCHDTQG_HSSC_DUYETLDTC'));
    }
    return false
  }

  pheDuyet() {
    let trangThai
    switch (this.formData.value.trangThai) {
      // Approve
      case STATUS.DU_THAO:
        trangThai = STATUS.CHO_DUYET_TP;
        break;
      case STATUS.CHO_DUYET_TP:
        trangThai = STATUS.CHO_DUYET_LDC;
        break;
      case STATUS.CHO_DUYET_LDC:
        trangThai = STATUS.DA_DUYET_LDC;
        break;
      case STATUS.DANG_DUYET_CB_VU:
        trangThai = STATUS.CHO_DUYET_LDV;
        break;
      case STATUS.CHO_DUYET_LDV:
        trangThai = STATUS.CHO_DUYET_LDTC;
        break;
      case STATUS.CHO_DUYET_LDTC:
        trangThai = STATUS.DA_DUYET_LDTC;
        break;
      //Reject
      case STATUS.TU_CHOI_TP:
      case STATUS.TU_CHOI_LDC:
      case STATUS.TU_CHOI_LDV:
      case STATUS.TU_CHOI_LDTC:
      case STATUS.TU_CHOI_CBV:
        trangThai = STATUS.CHO_DUYET_TP;
        break;
    }
    this.formData.controls['soTtrTcuc'].setValidators([Validators.required])
    this.helperService.markFormGroupTouched(this.formData);
    if (!this.formData.valid) return;
    this.approve(this.id, trangThai, 'Bạn có muốn gửi duyệt', null, 'Phê duyệt thành công');
  }

  tuChoi() {
    let trangThai
    switch (this.formData.value.trangThai) {
      case STATUS.CHO_DUYET_TP:
        trangThai = STATUS.TU_CHOI_TP;
        break;
      case STATUS.CHO_DUYET_LDC:
        trangThai = STATUS.TU_CHOI_LDC;
        break;
      case STATUS.CHO_DUYET_LDV:
        trangThai = STATUS.TU_CHOI_LDV;
        break;
      case STATUS.CHO_DUYET_LDTC:
        trangThai = STATUS.TU_CHOI_LDTC;
        break;
      case STATUS.DA_DUYET_LDC:
      case STATUS.DANG_DUYET_CB_VU:
        trangThai = STATUS.TU_CHOI_CBV;
        break;
    }
    this.reject(this.id, trangThai);
  }

  viewTongCuc() {
    return this.userService.isTongCuc();
  }

}
