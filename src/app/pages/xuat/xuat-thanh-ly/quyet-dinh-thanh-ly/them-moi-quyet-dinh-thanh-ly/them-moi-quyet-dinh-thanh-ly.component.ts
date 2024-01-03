import { Component, OnInit } from '@angular/core';
import { Base2Component } from "../../../../../components/base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { Validators } from "@angular/forms";
import { STATUS } from "../../../../../constants/status";
import { chain } from 'lodash';
import { Base3Component } from 'src/app/components/base3/base3.component';
import { QuyetDinhThanhLyService } from 'src/app/services/qlnv-hang/xuat-hang/xuat-thanh-ly/QuyetDinhThanhLyService.service';
import { HoSoThanhLyService } from 'src/app/services/qlnv-hang/xuat-hang/xuat-thanh-ly/HoSoThanhLy.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import dayjs from 'dayjs';
import {PREVIEW} from "src/app/constants/fileType";
import {MESSAGE} from "src/app/constants/message";

@Component({
  selector: 'app-them-moi-quyet-dinh-thanh-ly',
  templateUrl: './them-moi-quyet-dinh-thanh-ly.component.html',
  styleUrls: ['./them-moi-quyet-dinh-thanh-ly.component.scss']
})
export class ThemMoiQuyetDinhThanhLyComponent extends Base3Component implements OnInit {
  fileCanCu: any[] = []

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private _service: QuyetDinhThanhLyService,
    private hoSoThanhLyService: HoSoThanhLyService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, _service);
    this.defaultURL = 'xuat/xuat-thanh-ly/quyet-dinh'
    this.getId();
    this.formData = this.fb.group({
      id: [],
      nam: [dayjs().get('year')],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      soQd: [null, [Validators.required]],
      ngayKy: [],
      soHoSo: [null, [Validators.required]],
      idHoSo: [null, [Validators.required]],
      thoiGianTlTu: [null,],
      thoiGianTlDen: [null],
      thoiGianTl: [null],
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
          this.fileCanCu = res.fileCanCu;
          let soQd = res.soQd.split('/')[0];
          this.formData.patchValue({
            soQd: soQd,
            thoiGianTl: [res.thoiGianTlTu, res.thoiGianTlDen]
          })
          this.dataTable = chain(res.xhTlHoSoHdr.children).groupBy('xhTlDanhSachHdr.tenChiCuc').map((value, key) => ({
            expandSet: true,
            tenDonVi: key,
            children: value,
          })
          ).value()
        }
      })
    }
  }

  openDialogDanhSach() {
    if (this.disabled()) {
      return;
    }
    this.spinner.show();
    this.hoSoThanhLyService.getHoSoToQuyetDinh({}).then((res) => {
      this.spinner.hide();
      if (res.data) {
        res.data?.forEach(item => {
          item.ngayDen = item.thoiGianTlDen
          item.ngayTu = item.thoiGianTlTu
        })
        const modalQD = this.modal.create({
          nzTitle: 'Danh sách số hồ sơ',
          nzContent: DialogTableSelectionComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzWidth: '700px',
          nzFooter: null,
          nzComponentParams: {
            dataTable: res.data,
            dataHeader: ['Số hồ sơ', 'Trích yếu', 'Thời gian thanh lý từ', 'Thời gian thanh lý đến'],
            dataColumn: ['soHoSo', 'trichYeu', 'ngayTu', 'ngayDen']
          },
        });
        modalQD.afterClose.subscribe(async (data) => {
          if (data) {
            this.spinner.show();
            console.log(data)
            this.hoSoThanhLyService.getDetail(data.id).then((res) => {
              this.spinner.hide();
              if (res.data) {
                const dataTh = res.data
                this.formData.patchValue({
                  soHoSo: data.soHoSo,
                  idHoSo: data.id,
                  thoiGianTlTu: data.thoiGianTlTu,
                  thoiGianTlDen: data.thoiGianTlDen,
                  thoiGianTl: [data.thoiGianTlTu, data.thoiGianTlDen]
                })
                this.dataTable = chain(dataTh.children).groupBy('xhTlDanhSachHdr.tenChiCuc').map((value, key) => ({
                  expandSet: true,
                  tenDonVi: key,
                  children: value,
                })
                ).value()
              }
            });
          }
        });
      }
    })
  }

  showSave() {
    let trangThai = this.formData.value.trangThai;
    return trangThai == STATUS.DU_THAO;
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
      return (trangThai == STATUS.CHO_DUYET_LDV && this.userService.isAccessPermisson('XHDTQG_XTL_QDTL_DUYETLDV'))
        || (trangThai == STATUS.CHO_DUYET_LDTC && this.userService.isAccessPermisson('XHDTQG_XTL_QDTL_DUYETLDTC'))
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
    await this._service.preview({
      tenBaoCao: '61.Thông tin QĐ thanh lý.docx',
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
