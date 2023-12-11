import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { ActivatedRoute, Router } from "@angular/router";
import { QuyetDinhScService } from "../../../../../services/sua-chua/quyetDinhSc.service";
import { Validators } from "@angular/forms";
import * as moment from "moment";
import {
  DialogTableSelectionComponent
} from "../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import { STATUS } from "../../../../../constants/status";
import { Base3Component } from "../../../../../components/base3/base3.component";
import { cloneDeep, chain } from 'lodash';
import { QuyetDinhXhService } from "../../../../../services/sua-chua/quyetDinhXh.service";
import dayjs from "dayjs";


@Component({
  selector: 'app-them-moi-qdxh',
  templateUrl: './them-moi-qdxh.component.html',
  styleUrls: ['./them-moi-qdxh.component.scss']
})
export class ThemMoiQdxhComponent extends Base3Component implements OnInit {
  fileCanCu: any[] = []
  symbol: string = '';
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private quyetDinhXhService: QuyetDinhXhService,
    private quyetDinhScService: QuyetDinhScService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, quyetDinhXhService);
    this.defaultURL = 'sua-chua/xuat-hang/giao-nv-xh';
    this.previewName = 'sc_qd_giao_nvxh'
    this.getId();
    this.formData = this.fb.group({
      id: [],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      nam: [dayjs().year(), [Validators.required]],
      soQd: [null, [Validators.required]],
      ngayKy: [''],
      soQdSc: [null, [Validators.required]],
      idQdSc: [null, [Validators.required]],
      ngayKyQdSc: [null,],
      thoiHanXuat: [null],
      thoiHanNhap: [null],
      duToanKinhPhi: [null],
      loaiHinhNhapXuat: ['Xuất sửa chữa'],
      kieuNhapXuat: ['Xuất không thu tiền'],
      trichYeu: [null],
      lyDoTuChoi: []
    });
    this.symbol = this.userInfo.MA_QD;
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
            soQd: soQd
          })
          this.fileCanCu = res.fileCanCu;
          this.dataTable = chain(res.scQuyetDinhSc.scTrinhThamDinhHdr.children).groupBy('scDanhSachHdr.tenChiCuc').map((value, key) => ({
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
    this.quyetDinhScService.getDanhSachQuyetDinhXh({}).then((res) => {
      this.spinner.hide();
      if (res.data) {
        res.data?.forEach(item => {
          item.ngayNhap = item.thoiHanNhap
          item.ngayXuat = item.thoiHanXuat
        })
        const modalQD = this.modal.create({
          nzTitle: 'Danh sách quyết định sửa chữa',
          nzContent: DialogTableSelectionComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzWidth: '900px',
          nzFooter: null,
          nzComponentParams: {
            dataTable: res.data,
            dataHeader: ['Số quyết định sửa chữa', 'Trích yếu', 'Ngày ký', 'Thời hạn xuất', 'Thời hạn nhập'],
            dataColumn: ['soQd', 'trichYeu', 'ngayKy', 'ngayXuat', 'ngayNhap']
          },
        });
        modalQD.afterClose.subscribe(async (data) => {
          if (data) {
            this.spinner.show();
            console.log(data)
            this.quyetDinhScService.getDetail(data.id).then((res) => {
              this.spinner.hide();
              if (res.data) {
                const dataTh = res.data
                this.formData.patchValue({
                  soQdSc: data.soQd,
                  idQdSc: data.id,
                  ngayKyQdSc: data.ngayKy,
                  thoiHanNhap: data.thoiHanNhap,
                  thoiHanXuat: data.thoiHanXuat,
                })
                this.dataTable = chain(dataTh.scTrinhThamDinhHdr.children).groupBy('scDanhSachHdr.tenChiCuc').map((value, key) => ({
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
    return this.userService.isCuc() && (trangThai == STATUS.DU_THAO || trangThai == STATUS.TU_CHOI_TP || trangThai == STATUS.TU_CHOI_LDC) && this.userService.isAccessPermisson('SCHDTQG_XH_QDGNVXH_THEM');
  }

  save(isGuiDuyet?) {
    this.spinner.show();
    let body = this.formData.value;
    body.fileDinhKemReq = this.fileDinhKem;
    body.fileCanCuReq = this.fileCanCu;
    if (this.formData.value.soQd) {
      body.soQd = this.formData.value.soQd + '/' + this.symbol
    }
    this.createUpdate(body).then((res) => {
      if (res) {
        if (isGuiDuyet) {
          this.id = res.id;
          this.pheDuyet();
        } else {
          this.redirectDefault();
        }
      }
    })
  }

  pheDuyet() {
    let trangThai
    switch (this.formData.value.trangThai) {
      case STATUS.TU_CHOI_TP:
      case STATUS.TU_CHOI_LDC:
      case STATUS.DU_THAO:
        trangThai = STATUS.CHO_DUYET_TP;
        break;
      case STATUS.CHO_DUYET_TP:
        trangThai = STATUS.CHO_DUYET_LDC;
        break;
      case STATUS.CHO_DUYET_LDC:
        trangThai = STATUS.BAN_HANH;
        break;
    }
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
    }
    this.reject(this.id, trangThai);
  }

  disabled() {
    let trangThai = this.formData.value.trangThai
    return !(trangThai == STATUS.DU_THAO || trangThai == STATUS.TU_CHOI_TP || trangThai == STATUS.TU_CHOI_LDC);
  }

  showPheDuyetTuChoi() {
    let trangThai = this.formData.value.trangThai;
    if (this.userService.isCuc()) {
      return (trangThai == STATUS.CHO_DUYET_TP && this.userService.isAccessPermisson('SCHDTQG_XH_QDGNVXH_DUYET_TP')) || (trangThai == STATUS.CHO_DUYET_LDC && this.userService.isAccessPermisson('SCHDTQG_XH_QDGNVXH_DUYET_LDCUC'));
    }
    return false
  }

}
