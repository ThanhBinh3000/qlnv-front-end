import { Component, Input, OnInit } from '@angular/core';
import { Base2Component } from "src/app/components/base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "src/app/services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { DonviService } from "src/app/services/donvi.service";
import { DanhMucService } from "src/app/services/danhmuc.service";
import * as dayjs from "dayjs";
import { STATUS } from "src/app/constants/status";
import { FileDinhKem } from "src/app/models/DeXuatKeHoachuaChonNhaThau";
import { MESSAGE } from "src/app/constants/message";
import { chain, cloneDeep } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { NumberToRoman } from 'src/app/shared/commonFunction';
import { Validators } from "@angular/forms";
import { HoSoTieuHuyService } from "../../../../../services/qlnv-hang/xuat-hang/xuat-tieu-huy/HoSoTieuHuy.service";
import { TongHopTieuHuyService } from "../../../../../services/qlnv-hang/xuat-hang/xuat-tieu-huy/TongHopTieuHuy.service";
import { DialogTuChoiComponent } from "../../../../../components/dialog/dialog-tu-choi/dialog-tu-choi.component";
import {Base3Component} from "../../../../../components/base3/base3.component";
import {ActivatedRoute, Router} from "@angular/router";
import {HoSoThanhLyService} from "../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/HoSoThanhLy.service";
import {TongHopThanhLyService} from "../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/TongHopThanhLy.service";
import {
  DialogTableSelectionComponent
} from "../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import {PREVIEW} from "src/app/constants/fileType";

@Component({
  selector: 'app-chi-tiet-ho-so-tieu-huy',
  templateUrl: './chi-tiet-ho-so-tieu-huy.component.html',
  styleUrls: ['./chi-tiet-ho-so-tieu-huy.component.scss']
})
export class ChiTietHoSoTieuHuyComponent extends Base3Component implements OnInit {
  fileCanCu: any[] = [];
  symbol: string = '';
  suffixes: string = '';

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private _service: HoSoTieuHuyService,
    private tongHopTieuHuyService: TongHopTieuHuyService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, _service);
    this.defaultURL = 'xuat/xuat-tieu-huy/trinh-tham-dinh'
    this.getId();
    this.formData = this.fb.group({
      id: [null],
      nam: [dayjs().year()],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      soHoSo: [null, [Validators.required]],
      soTtrinhVu: [null],
      ngayTao: [dayjs().format("YYYY-MM-DD"), [Validators.required]],
      maDanhSach: [null, [Validators.required]],
      idDanhSach: [null, [Validators.required]],
      trichYeu: [null, [Validators.required]],
      ketQua: [null],
      lyDoTuChoi: [null],
      ngayDuyetLdc: [null],
      thoiGianTh: [null],
      thoiGianThTu: [null],
      thoiGianThDen: [null],
      thoiGianPd: [null],
      thoiGianPdTu: [null],
      thoiGianPdDen: [null],
    });
    // this.symbol = '/'+this.userInfo.DON_VI.tenVietTat+"-KH&QLHDT";
  }

  async ngOnInit() {
    await Promise.all([
      this.getId(),
      this.initForm()
    ])
  }

  initForm() {
    this.suffixes = "/TTr-QLHDT";
    if (this.id) {
      this.detail(this.id).then((res) => {
        if (res) {
          const ttr = (res.soHoSo || '').split('/');
          const ttrVu = (res.soTtrinhVu || '').split('/');
          this.formData.patchValue({
            soHoSo: ttr[0] || '',
            soTtrinhVu: ttrVu[0] || '',
            thoiGianTh: [res.thoiGianThTu, res.thoiGianThDen],
            thoiGianPd: [res.thoiGianPdTu, res.thoiGianPdDen],
          })
          this.symbol = '/' + (ttr[1] || '');
          this.dataTable = chain(res.children).groupBy('xhThDanhSachHdr.tenChiCuc').map((value, key) => ({
              expandSet: true,
              tenDonVi: key,
              children: value,
            })
          ).value();
        }
      })
    } else {
      if (this.userService.isCuc()) {
        this.symbol = '/' + (this.userInfo.DON_VI.tenVietTat || '') + "-KH&QLHDT";
      }
    }
  }

  showSave() {
    let trangThai = this.formData.value.trangThai;
    if (this.userService.isCuc()) {
      return (trangThai == STATUS.DU_THAO || trangThai == STATUS.TU_CHOI_TP || trangThai == STATUS.TU_CHOI_LDC || trangThai == STATUS.TU_CHOI_LDV || trangThai == STATUS.TU_CHOI_CBV) && this.userService.isAccessPermisson('XHDTQG_XTH_HSTH_THEM');
    }
    if (this.userService.isTongCuc()) {
      return (trangThai == STATUS.DA_DUYET_LDC || trangThai == STATUS.DANG_DUYET_CB_VU) && this.userService.isAccessPermisson('XHDTQG_XTH_HSTH_THEM');
    }
    return false
  }

  save(isGuiDuyet?) {
    if (this.viewTongCuc()) {
      this.formData.controls['ketQua'].setValidators([Validators.required]);
    } else {
      this.formData.controls['ketQua'].clearValidators();
    }
    this.spinner.show();
    let body = this.formData.value;
    body.fileDinhKemReq = this.fileDinhKem;
    body.fileCanCuReq = this.fileCanCu;
    let children = []
    this.dataTable.forEach(item => {
      item.children.forEach(data => {
        let dataDs = data.xhThDanhSachHdr;
        dataDs.idDsHdr = dataDs.id
        children.push(dataDs);
      })
    })
    body.children = children;
    if (this.formData.value.soHoSo) {
      body.soHoSo = this.formData.value.soHoSo + this.symbol
    }
    this.createUpdate(body).then((res) => {
      if (res) {
        if (isGuiDuyet) {
          this.id = res.id;
          this.formData.patchValue({
            id: res.id,
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
    this.tongHopTieuHuyService.getDsTaoHoSo({
      trangThai: STATUS.GUI_DUYET,
    }).then((res) => {
      this.spinner.hide();
      if (res.data) {
        res.data?.forEach(item => {
          item.ngayTu = item.thoiGianThTu;
          item.ngayDen = item.thoiGianThDen;
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
            dataHeader: ['Mã danh sách', 'Tên danh sách', 'Thời gian tiêu hủy từ', 'Thời gian tiêu hủy đến'],
            dataColumn: ['maDanhSach', 'tenDanhSach', 'ngayTu', 'ngayDen']
          },
        });
        modalQD.afterClose.subscribe(async (data) => {
          if (data) {
            this.spinner.show();
            this.tongHopTieuHuyService.getDetail(data.id).then((res) => {
              this.spinner.hide();
              if (res.data) {
                const dataTh = res.data
                this.formData.patchValue({
                  maDanhSach: dataTh.maDanhSach,
                  idDanhSach: dataTh.id,
                  thoiGianTh: [dataTh.thoiGianThTu, dataTh.thoiGianThDen],
                  thoiGianThTu: dataTh.thoiGianThTu,
                  thoiGianThDen: dataTh.thoiGianThDen
                })
                this.dataTable = chain(dataTh.children).groupBy('xhThDanhSachHdr.tenChiCuc').map((value, key) => ({
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
    return trangThai == STATUS.CHO_DUYET_LDV || trangThai == STATUS.CHO_DUYET_LDTC || trangThai == STATUS.DA_DUYET_LDTC || trangThai == STATUS.CHODUYET_BTC || trangThai == STATUS.DADUYET_BTC ;
  }

  showPheDuyetTuChoi() {
    let trangThai = this.formData.value.trangThai;
    if (this.userService.isCuc()) {
      return (trangThai == STATUS.CHO_DUYET_TP && this.userService.isAccessPermisson('XHDTQG_XTH_HSTH_DUYETTP'))
        || (trangThai == STATUS.CHO_DUYET_LDC && this.userService.isAccessPermisson('XHDTQG_XTH_HSTH_DUYETLDC'));
    }
    if (this.userService.isTongCuc()) {
      return (trangThai == STATUS.CHO_DUYET_LDV && this.userService.isAccessPermisson('XHDTQG_XTH_HSTH_DUYETLDV'))
        || (trangThai == STATUS.CHO_DUYET_LDTC && this.userService.isAccessPermisson('XHDTQG_XTH_HSTH_DUYETLDTC'))
        || (trangThai == STATUS.CHODUYET_BTC && this.userService.isAccessPermisson('XHDTQG_XTH_HSTH_DUYETBTC'));
    }
    return false
  }

  showTrinhBtc() {
    let trangThai = this.formData.value.trangThai;
    if (this.userService.isTongCuc()) {
      return (trangThai == STATUS.DA_DUYET_LDTC && this.userService.isAccessPermisson('XHDTQG_XTH_HSTH_TRINHDUYETBTC'));
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
        trangThai = STATUS.CHO_DUYET_TP;
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

  onChangeTimeQd($event) {
    this.formData.patchValue({
      thoiGianPdTu: $event[0],
      thoiGianPdDen: $event[1]
    })
  }

  async preview(id) {
    this.spinner.show();
    await this._service.preview({
      tenBaoCao: '62.Thông tin trình thẩm định HS tiêu hủy.docx',
      id: id,
    }).then(async res => {
      if (res.data) {
        this.pdfSrc = PREVIEW.PATH_PDF + res.data.pdfSrc;
        this.wordSrc = PREVIEW.PATH_WORD + res.data.wordSrc;
        this.printSrc = res.data.pdfSrc;
        this.showDlgPreview = true;
      } else {
        this.notification.error(MESSAGE.ERROR, 'Lỗi trong quá trình tải file.');
      }
    });
    this.spinner.hide();
  }
}
