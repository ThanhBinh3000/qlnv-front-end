import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Base2Component} from "../../../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {
  BckqKiemDinhMauService
} from "../../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/BckqKiemDinhMau.service";
import {CHUC_NANG, STATUS} from "../../../../../../../../constants/status";
import {PhuongPhapLayMau} from "../../../../../../../../models/PhuongPhapLayMau";
import {FILETYPE} from "../../../../../../../../constants/fileType";
import {MESSAGE} from "../../../../../../../../constants/message";

@Component({
  selector: 'app-thong-tin-bao-cao-ket-qua-kiem-dinh',
  templateUrl: './thong-tin-bao-cao-ket-qua-kiem-dinh.component.html',
  styleUrls: ['./thong-tin-bao-cao-ket-qua-kiem-dinh.component.scss']
})
export class ThongTinBaoCaoKetQuaKiemDinhComponent extends Base2Component implements OnInit {
  CHUC_NANG = CHUC_NANG;
  STATUS = STATUS;
  @Input() soQdGiaoNvXh: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Input() isViewOnModal: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  listChiCuc: any[] = [];
  listDiemKho: any[] = [];
  listSoQuyetDinh: any[] = [];
  listDiaDiemNhap: any[] = [];
  phuongPhapLayMaus: Array<PhuongPhapLayMau>;
  listDaiDienCuc: any[] = [];
  listDaiDienChiCuc: any[] = [];
  maBb: string;
  radioValue: any;
  checked: boolean = false;
  canCu: any = [];
  fileNiemPhong: any = [];
  bienBan: any[] = [];
  fileDinhKems: any[] = [];
  listFiles: any = [];
  listPhieuXuatKho: any = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private bckqKiemDinhMauService: BckqKiemDinhMauService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bckqKiemDinhMauService);
    this.formData = this.fb.group({
      tenDvi: [],
      maDvi: [],
      nam: [],
      tenBaoCao: [],
      soQdGiaoNvXh: [],
      ngayBaoCaoTu: [],
      ngayBaoCaoDen: [],
    })
  }

  isDisabled() {
    let trangThai = this.formData.value.trangThai;
    if (trangThai == STATUS.CHO_DUYET_LDC) {
      return true
    }
    return false;
  }

  async save(isGuiDuyet?) {
    let body = this.formData.value;
    //xử lý 3 loại file đính kèm , căn cứ pháp lý và ảnh biên bản lấy mẫu đc chụp
    this.listFiles = [];
    if (this.fileDinhKems.length > 0) {
      this.fileDinhKems.forEach(item => {
        item.fileType = FILETYPE.FILE_DINH_KEM
        this.listFiles.push(item)
      })
    }
    if (this.canCu.length > 0) {
      this.canCu.forEach(element => {
        element.fileType = FILETYPE.CAN_CU_PHAP_LY
        this.listFiles.push(element)
      })
    }
    if (this.fileNiemPhong.length > 0) {
      this.fileNiemPhong.forEach(element => {
        element.fileType = FILETYPE.ANH_DINH_KEM
        this.listFiles.push(element)
      })
    }
    if (this.listFiles && this.listFiles.length > 0) {
      body.fileDinhKems = this.listFiles;
    }
    // xử lý pp lấy mẫu và tiêu chuẩn cần lấy mẫu kiểm tra
    if (body.ppLayMauList && body.ppLayMauList.length > 0) {
      body.ppLayMau = body.ppLayMauList.map(function (item) {
        return item['label'];
      }).join(",");
    }
    if (body.chiTieuKiemTraList && body.chiTieuKiemTraList.length > 0) {
      body.chiTieuKiemTra = body.chiTieuKiemTraList.map(function (item) {
        return item['label'];
      }).join(",");
    }
    // xử lý người liên quan
    if (this.listDaiDienChiCuc && this.listDaiDienChiCuc.length > 0) {
      this.listDaiDienChiCuc.forEach(item => {
        item.loaiDaiDien = "CHI_CUC";
      })
    }
    if (this.listDaiDienCuc && this.listDaiDienCuc.length > 0) {
      this.listDaiDienCuc.forEach(item => {
        item.loaiDaiDien = "CUC";
      })
    }
    body.xhXkVtBbLayMauDtl = [...this.listDaiDienChiCuc, ...this.listDaiDienCuc];
    let data = await this.createUpdate(body);
    if (data) {
      if (isGuiDuyet) {
        this.idInput = data.id;
        this.pheDuyet();
      }
    }
  }

  pheDuyet() {
    let trangThai = '';
    let msg = '';
    switch (this.formData.value.trangThai) {
      case STATUS.TU_CHOI_LDC:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_LDC;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        break;
      }
      case STATUS.CHO_DUYET_LDC: {
        trangThai = STATUS.DA_DUYET_LDC;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        break;
      }
    }
    this.approve(this.idInput, trangThai, msg);
  }

  tuChoi() {
    let trangThai = '';
    switch (this.formData.value.trangThai) {
      case STATUS.CHO_DUYET_LDC: {
        trangThai = STATUS.TU_CHOI_LDC;
        break;
      }
    }
    this.reject(this.idInput, trangThai)
  }

}
