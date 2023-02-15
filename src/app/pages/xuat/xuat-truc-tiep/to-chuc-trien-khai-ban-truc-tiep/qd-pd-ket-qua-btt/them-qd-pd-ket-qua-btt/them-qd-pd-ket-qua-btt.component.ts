import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as dayjs from "dayjs";
import { HttpClient } from "@angular/common/http";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { STATUS } from 'src/app/constants/status';
import { MESSAGE } from 'src/app/constants/message';
import { ThongTinDauGiaService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/tochuc-trienkhai/thongTinDauGia.service';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { L } from '@angular/cdk/keycodes';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { StorageService } from 'src/app/services/storage.service';
import { QdPdKetQuaBanDauGiaService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/tochuc-trienkhai/qdPdKetQuaBanDauGia.service';
import { QdPdKetQuaBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/qd-pd-ket-qua-btt.service';
import { ChaoGiaMuaLeUyQuyenService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/chao-gia-mua-le-uy-quyen.service';

@Component({
  selector: 'app-them-qd-pd-ket-qua-btt',
  templateUrl: './them-qd-pd-ket-qua-btt.component.html',
  styleUrls: ['./them-qd-pd-ket-qua-btt.component.scss']
})
export class ThemQdPdKetQuaBttComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() idInput: number;

  maTrinh: String;

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private qdPdKetQuaBttService: QdPdKetQuaBttService,
    private chaoGiaMuaLeUyQuyenService: ChaoGiaMuaLeUyQuyenService
  ) {
    super(httpClient, storageService, notification, spinner, modal, qdPdKetQuaBttService);
    this.formData = this.fb.group({
      id: [],
      idDtl: [],
      namKh: [dayjs().get('year'), [Validators.required]],
      soQdKq: [, [Validators.required]],
      ngayHluc: [, [Validators.required]],
      ngayKy: [, [Validators.required]],
      soQdPd: [, [Validators.required]],
      trichYeu: [, [Validators.required]],
      maDvi: [],
      tenDvi: [],
      diaDiemChaoGia: [],
      ngayMkho: [],
      ngayKthuc: [],
      loaiVthh: [],
      tenLoaiVthh: [],
      cloaiVthh: [],
      tenCloaiVthh: [],
      moTaHangHoa: [],
      ghiChu: [],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      lyDoTuChoi: [null],
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
      loaiVthh: this.loaiVthh,
    });
  }

  async getDetail(idInput) {
    if (idInput) {
      let res = await this.detail(idInput);
      await this.onChangeTtin(res.idDtl);
    }
  }

  async save(isGuiDuyet?: boolean) {
    let body = this.formData.value;
    body.fileDinhKems = this.fileDinhKem;
    body.soQdKq = this.formData.value.soQdKq + this.maTrinh;
    let res = await this.createUpdate(body);
    if (res) {
      if (isGuiDuyet) {
        this.idInput = res.id
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

  isDisabled() {
    if (this.formData.value.trangThai == STATUS.CHO_DUYET_TP || this.formData.value.trangThai == STATUS.CHO_DUYET_LDC || this.formData.value.trangThai == STATUS.DA_DUYET_LDC || this.formData.value.trangThai == STATUS.BAN_HANH) {
      return true
    } else {
      return false;
    }
  }

  async openThongtinChaoGia() {
    let body = {
      "namKh": this.formData.value.nam,
      "loaiVthh": this.loaiVthh,
      "maDvi": this.userInfo.MA_DVI,
      "paggingReq": {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0,
      }
    }
    let listTb = [];
    let res = await this.chaoGiaMuaLeUyQuyenService.search(body);
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
        dataHeader: ['Số quyết định phê duyệt KH BTT', 'Loại vật tư hàng háo', 'Chủng loại hàng hóa'],
        dataColumn: ['soQdPd', 'tenLoaiVthh', 'tenCloaiVthh']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.onChangeTtin(data.id);
      }
    });
  }

  async onChangeTtin(idDtl) {
    let res = await this.chaoGiaMuaLeUyQuyenService.getDetail(idDtl);
    if (res.data) {
      const data = res.data;
      this.formData.patchValue({
        soQdPd: data.soQdPd,
        tenDvi: data.tenDvi,
        diaDiemChaoGia: data.diaDiemChaoGia,
        ngayMkho: data.ngayMkho,
        ngayKthuc: data.ngayKthuc,
        loaiVthh: data.loaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        moTaHangHoa: data.moTaHangHoa,
        idDtl: data.id,
      })
      this.dataTable = data.xhTcTtinBttList
    }
  }

}
