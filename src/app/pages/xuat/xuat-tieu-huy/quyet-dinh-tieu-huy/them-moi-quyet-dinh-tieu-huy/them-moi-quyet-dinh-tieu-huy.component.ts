import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { DonviService } from "../../../../../services/donvi.service";
import { DanhMucService } from "../../../../../services/danhmuc.service";
import { QuanLyHangTrongKhoService } from "../../../../../services/quanLyHangTrongKho.service";
import * as dayjs from "dayjs";
import { Validators } from "@angular/forms";
import { STATUS } from "../../../../../constants/status";
import { FileDinhKem } from "../../../../../models/DeXuatKeHoachuaChonNhaThau";
import { MESSAGE } from "../../../../../constants/message";
import * as uuid from "uuid";
import { chain, cloneDeep } from 'lodash';
import {
  QuyetDinhTieuHuyService
} from "../../../../../services/qlnv-hang/xuat-hang/xuat-tieu-huy/QuyetDinhTieuHuyService.service";
import { v4 as uuidv4 } from "uuid";
import { HoSoTieuHuyService } from "../../../../../services/qlnv-hang/xuat-hang/xuat-tieu-huy/HoSoTieuHuy.service";
import {Base3Component} from "../../../../../components/base3/base3.component";
import {ActivatedRoute, Router} from "@angular/router";
import {
  DialogTableSelectionComponent
} from "../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import {PREVIEW} from "src/app/constants/fileType";

@Component({
  selector: 'app-them-moi-quyet-dinh-tieu-huy',
  templateUrl: './them-moi-quyet-dinh-tieu-huy.component.html',
  styleUrls: ['./them-moi-quyet-dinh-tieu-huy.component.scss']
})
export class ThemMoiQuyetDinhTieuHuyComponent extends Base3Component implements OnInit {

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private _service: QuyetDinhTieuHuyService,
    private hoSoTieuHuyService: HoSoTieuHuyService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, _service);
    this.defaultURL = 'xuat/xuat-tieu-huy/quyet-dinh';
    this.getId();
    this.formData = this.fb.group({
      id: [],
      nam: [dayjs().get('year')],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      soQd: [null, [Validators.required]],
      ngayKy: [dayjs().format('YYYY-MM-DD'),[Validators.required]],
      soHoSo: [null, [Validators.required]],
      idHoSo: [null, [Validators.required]],
      thoiGianPd: [null],
      trichYeu: [null, [Validators.required]],
    })
  }

  async ngOnInit() {
    this.spinner.show();
    await Promise.all([
      await this.getId(),
      await this.initForm()
    ])
    this.spinner.hide();
  }

  async initForm() {
    if (this.id) {
      await this.detail(this.id).then((res) => {
        if (res) {
          let soQd = res.soQd.split('/')[0];
          this.formData.patchValue({
            soQd: soQd,
          })
          this.bindingDataHoSoTieuHuy(res.idHoSo);
        }
      })
    }
  }

  openDialogDanhSach() {
    if (this.disabled()) {
      return;
    }
    this.spinner.show();
    this.hoSoTieuHuyService.getHoSoToQuyetDinh({}).then((res) => {
      this.spinner.hide();
      if (res.data) {
        const modalQD = this.modal.create({
          nzTitle: 'Danh sách số hồ sơ',
          nzContent: DialogTableSelectionComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzWidth: '1000px',
          nzFooter: null,
          nzComponentParams: {
            dataTable: res.data,
            dataHeader: ['Số hồ sơ', 'Trích yếu'],
            dataColumn: ['soHoSo', 'trichYeu']
          },
        });
        modalQD.afterClose.subscribe(async (data) => {
          if (data) {
            await this.bindingDataHoSoTieuHuy(data.id)
          }
        });
      }
    })
  }

  async bindingDataHoSoTieuHuy(idHoSo){
    this.spinner.show();
    this.hoSoTieuHuyService.getDetail(idHoSo).then((res) => {
      this.spinner.hide();
      if (res.data) {
        const dataTh = res.data
        this.formData.patchValue({
          soHoSo: dataTh.soHoSo,
          idHoSo: dataTh.id,
          thoiGianPd: [dataTh.thoiGianPdTu, dataTh.thoiGianPdDen]
        })
        this.dataTable = chain(dataTh.children).groupBy('xhThDanhSachHdr.tenChiCuc').map((value, key) => ({
            expandSet: true,
            tenDonVi: key,
            children: value,
          })
        ).value()
      }
    });
  }

  showSave() {
    let trangThai = this.formData.value.trangThai;
    return trangThai == STATUS.DU_THAO && this.userService.isAccessPermisson('XHDTQG_XTH_QDTH_THEM');
  }

  save(isGuiDuyet?) {
    this.spinner.show();
    let body = this.formData.value;
    body.fileDinhKemReq = this.fileDinhKem;
    body.fileCanCuReq = this.fileCanCu;
    if (this.formData.value.soQd) {
      body.soQd = this.formData.value.soQd + '/QĐ-TCDT'
    }
    this.createUpdate(body).then((res) => {
      if (res) {
        if (isGuiDuyet) {
          this.id = res.id;
          this.formData.patchValue({
            id : res.id,
          })
          this.pheDuyet();
        } else {
          this.redirectDefault();
        }
      }
    })
  }

  disabled() {
    return this.formData.value.trangThai != STATUS.DU_THAO;
  }

  showPheDuyetTuChoi() {
    let trangThai = this.formData.value.trangThai;
    if (this.userService.isTongCuc()) {
      return (trangThai == STATUS.CHO_DUYET_LDV && this.userService.isAccessPermisson('XHDTQG_XTH_QDTH_DUYETLDV'))
        || (trangThai == STATUS.CHO_DUYET_LDTC && this.userService.isAccessPermisson('XHDTQG_XTH_QDTH_DUYETLDTC'))
    }
    return false
  }

  pheDuyet() {
    let trangThai
    switch (this.formData.value.trangThai) {
      // Approve
      case STATUS.DU_THAO:
        trangThai = STATUS.CHO_DUYET_LDV;
        break;
      case STATUS.CHO_DUYET_LDV:
        trangThai = STATUS.CHO_DUYET_LDTC;
        break;
      case STATUS.CHO_DUYET_LDTC:
        trangThai = STATUS.BAN_HANH;
        break;
      //Reject
      case STATUS.TU_CHOI_LDV:
      case STATUS.TU_CHOI_LDTC:
        trangThai = STATUS.CHO_DUYET_LDV;
        break;
    }
    this.approve(this.formData.value.id, trangThai, 'Bạn có muốn gửi duyệt', null, 'Phê duyệt thành công');
  }

  tuChoi() {
    let trangThai
    switch (this.formData.value.trangThai) {
      case STATUS.CHO_DUYET_LDV:
        trangThai = STATUS.TU_CHOI_LDV;
        break;
      case STATUS.CHO_DUYET_LDTC:
        trangThai = STATUS.TU_CHOI_LDTC;
        break;
    }
    this.reject(this.formData.value.id, trangThai);
  }
  async preview(id) {
    this.spinner.show();
    try {
      await this._service.preview({
        tenBaoCao: '63.Thông tin QĐ tiêu hủy.docx',
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
    } catch (e) {
      console.log(e);
    } finally {
      this.spinner.hide();
    }

  }
}
