import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { StorageService } from "src/app/services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import * as dayjs from "dayjs";
import { STATUS } from "src/app/constants/status";
import { HoSoThanhLyService } from "src/app/services/qlnv-hang/xuat-hang/xuat-thanh-ly/HoSoThanhLy.service";
import { chain } from "lodash";
import { TongHopThanhLyService } from "src/app/services/qlnv-hang/xuat-hang/xuat-thanh-ly/TongHopThanhLy.service";
import { Validators } from "@angular/forms";
import { Base3Component } from 'src/app/components/base3/base3.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';

@Component({
  selector: 'app-chi-tiet-ho-so-thanh-ly',
  templateUrl: './chi-tiet-ho-so-thanh-ly.component.html',
  styleUrls: ['./chi-tiet-ho-so-thanh-ly.component.scss']
})
export class ChiTietHoSoThanhLyComponent extends Base3Component implements OnInit {
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
    private _service: HoSoThanhLyService,
    private tongHopService: TongHopThanhLyService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, _service);
    this.defaultURL = 'xuat/xuat-thanh-ly/trinh-tham-dinh'
    this.getId();
    this.formData = this.fb.group({
      id: [null],
      nam: [dayjs().year()],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      soHoSo: [null, [Validators.required]],
      ngayTao: [dayjs().format("YYYY-MM-DD"), [Validators.required]],
      maDanhSach: [null, [Validators.required]],
      idDanhSach: [null, [Validators.required]],
      trichYeu: [null, [Validators.required]],
      ketQua: [null],
      lyDoTuChoi: [null],
      ngayDuyetLdc: [null],
      thoiGianTl: [null],
      thoiGianTlTu: [null],
      thoiGianTlDen: [null],
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
          let ttr = res.soHoSo.split('/')[0];
          this.formData.patchValue({
            soHoSo: ttr,
            thoiGianTl: [res.thoiGianTlTu, res.thoiGianTlDen]
          })
          this.dataTable = chain(res.children).groupBy('xhTlDanhSachHdr.tenChiCuc').map((value, key) => ({
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
      return (trangThai == STATUS.DU_THAO || trangThai == STATUS.TU_CHOI_TP || trangThai == STATUS.TU_CHOI_LDV || trangThai == STATUS.TU_CHOI_CBV) && this.userService.isAccessPermisson('XHDTQG_XTL_HSTL_THEM');
    }
    if (this.userService.isTongCuc()) {
      return (trangThai == STATUS.DA_DUYET_LDC || trangThai == STATUS.DANG_DUYET_CB_VU) && this.userService.isAccessPermisson('XHDTQG_XTL_HSTL_THEM');
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
        children.push(data.xhTlDanhSachHdr);
      })
    })
    body.children = children;
    if (this.formData.value.soHoSo) {
      body.soHoSo = this.formData.value.soHoSo + '/' + this.symbol
    }
    this.createUpdate(body).then((res) => {
      if (res) {
        if (isGuiDuyet) {
          this.id = res.id;
          this.formData.patchValue({
            trangThai: res.trangThai,
            tenTrangThai: res.tenTrangThai
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
    this.tongHopService.getDanhSachTrinhThamDinh({}).then((res) => {
      this.spinner.hide();
      if (res.data) {
        res.data?.forEach(item => {
          item.ngayTu = item.thoiGianTlTu;
          item.ngayDen = item.thoiGianTlDen;
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
            dataHeader: ['Mã danh sách', 'Tên danh sách', 'Thời gian thanh lý từ', 'Thời gian thanh lý đến'],
            dataColumn: ['maDanhSach', 'tenDanhSach', 'ngayTu', 'ngayDen']
          },
        });
        modalQD.afterClose.subscribe(async (data) => {
          if (data) {
            this.spinner.show();
            this.tongHopService.getDetail(data.id).then((res) => {
              this.spinner.hide();
              if (res.data) {
                const dataTh = res.data
                this.formData.patchValue({
                  maDanhSach: dataTh.maDanhSach,
                  idDanhSach: dataTh.id,
                  thoiGianTl: [dataTh.thoiGianTlTu, dataTh.thoiGianTlDen],
                  thoiGianTlTu: dataTh.thoiGianTlTu,
                  thoiGianTlDen: dataTh.thoiGianTlDen
                })
                this.dataTable = chain(dataTh.children).groupBy('xhTlDanhSachHdr.tenChiCuc').map((value, key) => ({
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
      || trangThai == STATUS.CHO_DUYET_LDV || trangThai == STATUS.CHO_DUYET_LDTC || trangThai == STATUS.DA_DUYET_LDTC
      || trangThai == STATUS.DANG_DUYET_CB_VU || trangThai == STATUS.TU_CHOI_LDTC || trangThai == STATUS.CHODUYET_BTC
      || trangThai == STATUS.DADUYET_BTC || trangThai == STATUS.TUCHOI_BTC;
  }

  disabledThamDinh() {
    let trangThai = this.formData.value.trangThai;
    return trangThai == STATUS.CHO_DUYET_LDV || trangThai == STATUS.CHO_DUYET_LDTC || trangThai == STATUS.DA_DUYET_LDTC;
  }

  showPheDuyetTuChoi() {
    let trangThai = this.formData.value.trangThai;
    if (this.userService.isCuc()) {
      return (trangThai == STATUS.CHO_DUYET_TP && this.userService.isAccessPermisson('XHDTQG_XTL_HSTL_DUYETTP'))
        || (trangThai == STATUS.CHO_DUYET_LDC && this.userService.isAccessPermisson('XHDTQG_XTL_HSTL_DUYETLDC'));
    }
    if (this.userService.isTongCuc()) {
      return (trangThai == STATUS.CHO_DUYET_LDV && this.userService.isAccessPermisson('XHDTQG_XTL_HSTL_DUYETLDV'))
        || (trangThai == STATUS.CHO_DUYET_LDTC && this.userService.isAccessPermisson('XHDTQG_XTL_HSTL_DUYETLDTC'))
        || (trangThai == STATUS.CHODUYET_BTC && this.userService.isAccessPermisson('XHDTQG_XTL_HSTL_DUYETBTC'));
    }
    return false
  }

  showTrinhBtc() {
    let trangThai = this.formData.value.trangThai;
    if (this.userService.isTongCuc()) {
      return (trangThai == STATUS.DA_DUYET_LDTC && this.userService.isAccessPermisson('XHDTQG_XTL_HSTL_TRINHDUYETBTC'));
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
      case STATUS.DA_DUYET_LDC:
        trangThai = STATUS.CHO_DUYET_LDV;
        break;
      case STATUS.CHO_DUYET_LDV:
        trangThai = STATUS.CHO_DUYET_LDTC;
        break;
      case STATUS.CHO_DUYET_LDTC:
        trangThai = STATUS.DA_DUYET_LDTC;
        break;
      case STATUS.DA_DUYET_LDTC:
        trangThai = STATUS.CHODUYET_BTC;
        break;
      case STATUS.CHODUYET_BTC:
        trangThai = STATUS.DADUYET_BTC;
        break;
      //Reject
      case STATUS.TU_CHOI_TP:
      case STATUS.TU_CHOI_LDC:
      case STATUS.TU_CHOI_LDV:
      case STATUS.TU_CHOI_LDTC:
      case STATUS.TU_CHOI_CBV:
        trangThai = STATUS.DU_THAO;
        break;
    }
    this.approve(this.formData.value.id, trangThai, 'Bạn có muốn gửi duyệt', null, 'Phê duyệt thành công');
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
      case STATUS.CHODUYET_BTC:
        trangThai = STATUS.TUCHOI_BTC;
        break;
    }
    this.reject(this.formData.value.id, trangThai);
  }

  viewTongCuc() {
    return this.userService.isTongCuc();
  }
}
