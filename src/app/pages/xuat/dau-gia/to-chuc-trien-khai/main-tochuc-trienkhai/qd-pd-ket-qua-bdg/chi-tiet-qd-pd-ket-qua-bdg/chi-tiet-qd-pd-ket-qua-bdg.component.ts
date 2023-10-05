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
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { async } from 'rxjs';
import { QuyetDinhPdKhBdgService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/quyetDinhPdKhBdg.service';

@Component({
  selector: 'app-chi-tiet-qd-pd-ket-qua-bdg',
  templateUrl: './chi-tiet-qd-pd-ket-qua-bdg.component.html',
  styleUrls: ['./chi-tiet-qd-pd-ket-qua-bdg.component.scss']
})
export class ChiTietQdPdKetQuaBdgComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() idInput: number;
  fileDinhKems: any[] = []
  listLoaiHinhNx: any[] = [];
  listKieuNx: any[] = [];
  loadMaThongBaoQd: any[] = [];

  maTrinh: String;

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private qdPdKetQuaBanDauGiaService: QdPdKetQuaBanDauGiaService,
    private thongTinDauGiaService: ThongTinDauGiaService,
    private quyetDinhPdKhBdgService: QuyetDinhPdKhBdgService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, qdPdKetQuaBanDauGiaService);
    this.formData = this.fb.group({
      id: [],
      nam: [dayjs().get('year')],
      maDvi: [''],
      tenDvi: [''],
      soQdKq: [''],
      trichYeu: [''],
      ngayHluc: [''],
      ngayKy: [''],
      loaiHinhNx: [''],
      kieuNx: [''],
      loaiVthh: [''],
      tenLoaiVthh: [''],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      maThongBao: [''],
      soBienBan: [''],
      pthucGnhan: [''],
      tgianGnhan: [''],
      tgianGnhanGhiChu: [''],
      ghiChu: [''],
      soQdPd: [''],
      hinhThucDauGia: [''],
      pthucDauGia: [''],
      soTbKhongThanh: [''],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự Thảo'],
      lyDoTuChoi: [''],
    });
  }

  async ngOnInit() {
    this.spinner.show();
    this.maTrinh = '/' + this.userInfo.MA_QD;
    if (this.idInput) {
      this.getDetail(this.idInput);
    } else {
      this.initForm();
    }
    await Promise.all([
      this.loadDataComboBox(),
    ]);
    await this.spinner.hide();
  }

  async loadDataComboBox() {
    // loại hình nhập xuất
    this.listLoaiHinhNx = [];
    let resNx = await this.danhMucService.danhMucChungGetAll('LOAI_HINH_NHAP_XUAT');
    if (resNx.msg == MESSAGE.SUCCESS) {
      this.listLoaiHinhNx = resNx.data.filter(item => item.apDung == 'XUAT_DG');
    }
    // kiểu nhập xuất
    this.listKieuNx = [];
    let resKieuNx = await this.danhMucService.danhMucChungGetAll('KIEU_NHAP_XUAT');
    if (resKieuNx.msg == MESSAGE.SUCCESS) {
      this.listKieuNx = resKieuNx.data
    }
  }

  onChangeLhNx($event) {
    let dataNx = this.listLoaiHinhNx.filter(item => item.ma == $event);
    if (dataNx.length > 0) {
      this.formData.patchValue({
        kieuNx: dataNx[0].ghiChu
      })
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
      if (res) {
        this.formData.patchValue({
          soQdKq: res.soQdKq.split('/')[0]
        })
      }
      this.fileDinhKems = res.fileDinhKems;
      this.fileDinhKem = res.fileDinhKem;
      await this.onChangeTtinDgia(res.maThongBao.split('/')[0]);
    }
  }

  async save(isGuiDuyet?: boolean) {
    let body = this.formData.value;
    body.fileDinhKems = this.fileDinhKems;
    body.fileDinhKem = this.fileDinhKem;
    body.soQdKq = this.formData.value.soQdKq + this.maTrinh;
    let res = await this.createUpdate(body);
    if (res) {
      if (isGuiDuyet) {
        this.idInput = res.id
        this.guiDuyet();
      } else {
        // this.goBack();
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
    if (this.formData.value.trangThai == STATUS.CHO_DUYET_TP || this.formData.value.trangThai == STATUS.CHO_DUYET_LDC || this.formData.value.trangThai == STATUS.DA_DUYET_LDC || this.formData.value.trangThai == STATUS.BAN_HANH) {
      return true
    } else {
      return false;
    }
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
    await this.loadMaThongBao();
    let listTb = [];
    let res = await this.thongTinDauGiaService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = [
        ...res.data.content.filter((item) => {
          return !this.loadMaThongBaoQd.some((child) => {
            if (child.maThongBao.length > 0 && item.maThongBao.length > 0) {
              return item.maThongBao === child.maThongBao;
            }
          })
        })
      ];
      listTb = data;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách thông báo bán đấu giá',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: listTb.filter(s => s.ketQua == 1),
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
    if (idTtinDgia > 0) {
      await this.thongTinDauGiaService.getDetail(idTtinDgia)
        .then(async (resTb) => {
          if (resTb.data) {
            const dataTb = resTb.data
            let resQdKhDtl = await this.quyetDinhPdKhBdgService.getDtlDetail(dataTb.idQdPdDtl);
            const dataQdKhDtl = resQdKhDtl.data;
            this.formData.patchValue({
              maThongBao: dataTb.maThongBao,
              soBienBan: dataTb.soBienBan,
              loaiHinhNx: dataQdKhDtl.xhQdPdKhBdg.loaiHinhNx,
              kieuNx: dataQdKhDtl.xhQdPdKhBdg.kieuNx,
              loaiVthh: dataTb.loaiVthh,
              tenLoaiVthh: dataTb.tenLoaiVthh,
              cloaiVthh: dataTb.cloaiVthh,
              tenCloaiVthh: dataTb.tenCloaiVthh,
              pthucGnhan: dataQdKhDtl.pthucGnhan,
              tgianGnhan: dataQdKhDtl.tgianGnhan,
              tgianGnhanGhiChu: dataQdKhDtl.tgianGnhanGhiChu,
            })
            this.dataTable = dataTb.children
          }
        })
    }
  }

  async loadMaThongBao() {
    let body = {
      nam: this.formData.value.nam,
      loaiVthh: this.loaiVthh,
      maDvi: this.userInfo.MA_DVI,
    }
    let res = await this.qdPdKetQuaBanDauGiaService.search(body)
    if (res.data) {
      this.loadMaThongBaoQd = res.data.content
    }
  }

}
