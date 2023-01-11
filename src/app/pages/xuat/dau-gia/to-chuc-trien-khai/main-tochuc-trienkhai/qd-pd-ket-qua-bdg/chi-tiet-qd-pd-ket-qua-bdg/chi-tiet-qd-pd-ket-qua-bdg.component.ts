import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Globals } from "../../../../../../../shared/globals";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as dayjs from "dayjs";
import { Base2Component } from "../../../../../../../components/base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import {
  QdPdKetQuaBanDauGiaService
} from "../../../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/tochuc-trienkhai/qdPdKetQuaBanDauGia.service";
import { STATUS } from 'src/app/constants/status';
import { MESSAGE } from 'src/app/constants/message';
import { ThongTinDauGiaService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/tochuc-trienkhai/thongTinDauGia.service';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { L } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-chi-tiet-qd-pd-ket-qua-bdg',
  templateUrl: './chi-tiet-qd-pd-ket-qua-bdg.component.html',
  styleUrls: ['./chi-tiet-qd-pd-ket-qua-bdg.component.scss']
})
export class ChiTietQdPdKetQuaBdgComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() idInput: number;

  maTrinh: String;

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private qdPdKetQuaBanDauGiaService: QdPdKetQuaBanDauGiaService,
    private thongTinDauGiaService: ThongTinDauGiaService
  ) {
    super(httpClient, storageService, notification, spinner, modal, qdPdKetQuaBanDauGiaService);
    this.formData = this.fb.group({
      id: [],
      nam: [dayjs().get('year'), [Validators.required]],
      soQdKq: [, [Validators.required]],
      trichYeu: [, [Validators.required]],
      ngayHluc: [, [Validators.required]],
      ngayKy: [, [Validators.required]],
      maThongBao: [, [Validators.required]],
      soBienBan: [, [Validators.required]],
      pthucGnhan: [''],
      tgianGnhan: [''],
      tgianGnhanGhiChu: [''],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      lyDoTuChoi: [null],
      loaiVthh: []
    });
  }

  ngOnInit(): void {
    this.maTrinh = '/' + this.userInfo.MA_QD;
    if (this.idInput) {
      this.getDetail(this.idInput);
    } else {
      this.initForm();
    }
  }

  initForm() {
    this.formData.patchValue({
      loaiVthh: this.loaiVthh
    });
  }

  async getDetail(idInput) {
    if (idInput) {
      let res = await this.detail(idInput);
      this.formData.patchValue({
        soQdKq: res.soQdKq.split('/')[0]
      })
      await this.onChangeTtinDgia(res.maThongBao.split('/')[0]);
    }
  }

  async save(isGuiDuyet?: boolean) {
    let body = this.formData.value;
    body.fileDinhKems = this.fileDinhKem;
    body.soQdKq = this.formData.value.soQdKq + this.maTrinh;
    let res = await this.createUpdate(body);
    if (res) {
      if (isGuiDuyet) {
        this.guiDuyet();
      } else {
        this.goBack();
      }
    }
  }

  async guiDuyet() {
    let trangThai = '';
    let msg = '';
    switch (this.formData.get('trangThai').value) {
      case STATUS.TU_CHOI_LDC:
      case STATUS.TU_CHOI_TP:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_TP;
        msg = MESSAGE.GUI_DUYET_CONFIRM
        break;
      }
      case STATUS.CHO_DUYET_TP: {
        trangThai = STATUS.CHO_DUYET_LDC;
        msg = MESSAGE.PHE_DUYET_CONFIRM
        break;
      }
      case STATUS.CHO_DUYET_LDC: {
        trangThai = STATUS.DA_DUYET_LDC;
        msg = MESSAGE.PHE_DUYET_CONFIRM
        break;
      }
      case STATUS.DA_DUYET_LDC: {
        trangThai = STATUS.BAN_HANH;
        msg = MESSAGE.PHE_DUYET_CONFIRM
        break;
      }
    }
    this.approve(this.idInput, trangThai, msg);
  }

  tuChoi() {
    let trangThai = '';
    switch (this.formData.get('trangThai').value) {
      case STATUS.CHO_DUYET_TP: {
        trangThai = STATUS.TU_CHOI_TP;
        break;
      }
      case STATUS.CHO_DUYET_LDC: {
        trangThai = STATUS.TU_CHOI_LDC;
        break;
      }
    };
    this.reject(this.idInput, trangThai);
  }

  calendarSoLuong(dviTsan) {
    let soLuong = 0;
    dviTsan.children.forEach(item => soLuong += item.soLuong);
    return soLuong
  }

  isDisabled() {
    return false;
  }

  async openMaThongBao() {
    let body = {
      "nam": this.formData.value.nam,
      "loaiVthh": this.loaiVthh,
      "maDvi": this.userInfo.MA_DVI,
      "paggingReq": {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0,
      }
    }
    let listTb = [];
    let res = await this.thongTinDauGiaService.search(body);
    if (res.data) {
      listTb = res.data.content;
    }
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách thông báo bán đấu giá',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: listTb,
        dataHeader: ['Số quyết định phê duyệt KH BDG', 'Mã thông báo', 'Số biên bản'],
        dataColumn: ['soQdPd', 'maThongBao', 'soBienBan']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.onChangeTtinDgia(data.id);
      }
    });
  }

  async onChangeTtinDgia(idTtinDgia) {
    let res = await this.thongTinDauGiaService.getDetail(idTtinDgia);
    if (res.data) {
      const data = res.data;
      this.formData.patchValue({
        maThongBao: data.maThongBao,
        soBienBan: data.soBienBan,
      })
      this.dataTable = data.children
    }
  }

}
