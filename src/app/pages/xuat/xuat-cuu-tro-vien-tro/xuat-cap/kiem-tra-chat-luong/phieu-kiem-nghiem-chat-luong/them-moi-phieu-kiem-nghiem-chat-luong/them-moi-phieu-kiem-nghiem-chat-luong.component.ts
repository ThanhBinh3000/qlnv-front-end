import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Base2Component } from 'src/app/components/base2/base2.component';
import dayjs from 'dayjs';
import { FileDinhKem } from 'src/app/models/FileDinhKem';
import { MESSAGE } from 'src/app/constants/message';
import { STATUS } from 'src/app/constants/status';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { PhuongPhapLayMau } from 'src/app/models/PhuongPhapLayMau';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { Validators } from '@angular/forms';
import { DanhMucTieuChuanService } from 'src/app/services/quantri-danhmuc/danhMucTieuChuan.service';
import { KetQuaKiemNghiemChatLuongHang, PhieuKiemNghiemChatLuongHang } from 'src/app/models/PhieuKiemNghiemChatLuongThoc';

import { PhieuKiemNghiemChatLuongService } from './../../../../../../../services/qlnv-hang/xuat-hang/xuat-cap/PhieuKiemNghiemChatLuong.service';
import {
  QuyetDinhGiaoNvCuuTroService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuat-cap/QuyetDinhGiaoNvCuuTro.service";
import {KhCnQuyChuanKyThuat} from "../../../../../../../services/kh-cn-bao-quan/KhCnQuyChuanKyThuat";

@Component({
  selector: 'app-them-moi-phieu-kiem-nghiem-chat-luong',
  templateUrl: './them-moi-phieu-kiem-nghiem-chat-luong.component.html',
  styleUrls: ['./them-moi-phieu-kiem-nghiem-chat-luong.component.scss']
})
export class ThemMoiPhieuKiemNghiemChatLuongComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();

  fileDinhKems: any[] = [];
  listDiemKho: any[] = [];
  listSoQuyetDinh: any[] = []
  listDiaDiemNhap: any[] = [];
  phuongPhapLayMaus: Array<PhuongPhapLayMau>;
  dataTableChiTieu: any[] = [];
  listTieuChuan: any[] = [];
  listHinhThucBaoQuan: any[] = [];
  maPhieu: string;
  checked: boolean = false;
  listFileDinhKem: any = [];
  maVthh: string;
  templateName = "Phiếu kiểm nghiệm chất lượng-Xuất cấp";
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private danhMucTieuChuanService: DanhMucTieuChuanService,
    private khCnQuyChuanKyThuat: KhCnQuyChuanKyThuat,
    private phieuKiemNghiemChatLuongService: PhieuKiemNghiemChatLuongService,
    private quyetDinhGiaoNvCuuTroService: QuyetDinhGiaoNvCuuTroService,

  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuKiemNghiemChatLuongService);

    this.formData = this.fb.group(
      {
        id: [0],
        nam: [dayjs().get("year")],
        maDvi: [, [Validators.required]],
        maQhNs: [],
        soPhieuKnCl: [],
        ngayLapPhieu: [],
        idQdGiaoNvXh: [],
        soQdGiaoNvXh: ['', [Validators.required]],
        thoiHanXuatCtVt: [],
        nguoiKn: [],
        truongPhong: [],
        thuKho: [],
        loaiVthh: [],
        cloaiVthh: [],
        maDiemKho: [],
        maNhaKho: [],
        maNganKho: [],
        maLoKho: [],
        hinhThucBq: [],
        noiDung: [],
        ketLuan: [],
        trangThai: [STATUS.DU_THAO],
        ngayGduyet: [],
        nguoiGduyetId: [],
        ngayPduyet: [],
        nguoiPduyetId: [],
        lyDoTuChoi: [],
        type: [],
        soBbTinhKho: [],
        tenDvi: [],
        diaChiDvi: [],
        tenLoaiVthh: [],
        tenCloaiVthh: [],
        tenTrangThai: ['Dự Thảo'],
        tenDiemKho: [],
        tenNhaKho: [],
        tenNganKho: [],
        tenLoKho: [],
        fileDinhKems: [new Array<FileDinhKem>()],
        ketQuaPhanTich: [new Array()],

      }
    );
    this.maPhieu = 'PKNCL-' + this.userInfo.DON_VI.tenVietTat;

    // this.setTitle();
  }

  async ngOnInit() {
    try {
      this.spinner.show();

      await Promise.all([
        this.loadSoQuyetDinh(),
        this.loadDanhMucPhuongThucBaoQuan(),
        this.loadTieuChuan(),
      ])
      await this.loadDetail(this.idInput)
      this.spinner.hide();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
  }


  async loadDetail(idInput: number) {
    if (idInput > 0) {
      await this.phieuKiemNghiemChatLuongService.getDetail(idInput)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.formData.patchValue(res.data);
            const data = res.data;
            this.listFileDinhKem = data.fileDinhKems;
            this.dataTableChiTieu = data.ketQuaPhanTich;
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    } else {
      let id = await this.userService.getId('XH_XC_PHIEU_KN_CL_HDR_SEQ')
      this.formData.patchValue({
        maDvi: this.userInfo.MA_DVI,
        tenDvi: this.userInfo.TEN_DVI,
        maQhNs: this.userInfo.DON_VI.maQhns,
        nguoiKn: this.userInfo.TEN_DAY_DU,
        truongPhong: this.userInfo.MA_KTBQ,
        soPhieuKnCl: `${id}/${this.formData.get('nam').value}/${this.maPhieu}`,
        ngayLapPhieu: dayjs().format('YYYY-MM-DD'),
        loaiVthh: this.loaiVthh,
      });
    }

  }

  quayLai() {
    this.showListEvent.emit();
  }

  async loadDanhMucPhuongThucBaoQuan() {
    let res = await this.danhMucService.danhMucChungGetAll('HINH_THUC_BAO_QUAN');
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content) {
        this.listHinhThucBaoQuan = res.data.content;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadSoQuyetDinh() {
    let body = {
      trangThai: STATUS.BAN_HANH,
      loaiVthh: this.loaiVthh,
      listTrangThaiXh: [STATUS.CHUA_THUC_HIEN, STATUS.DANG_THUC_HIEN],
    }
    let res = await this.quyetDinhGiaoNvCuuTroService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoQuyetDinh = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async openDialogSoQd() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách số quyết định kế hoạch giao nhiệm vụ xuất hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listSoQuyetDinh,
        dataHeader: ['Số quyết định', 'Ngày quyết định', 'Loại hàng hóa'],
        dataColumn: ['soQd', 'ngayKy', 'tenLoaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.bindingDataQd(data.id, true);
      }
    });
  };

  async bindingDataQd(id, isSetTc?) {
    await this.spinner.show();
    let dataRes = await this.quyetDinhGiaoNvCuuTroService.getDetail(id)
    const data = dataRes.data;
    this.formData.patchValue({
      soQdGiaoNvXh: data.soQd,
      idQdGiaoNvXh: data.id,
      thoiHanXuatCtVt: data.ngayKy,
      loaiVthh: data.loaiVthh,
      tenLoaiVthh: data.tenLoaiVthh,
    });

    this.listDiaDiemNhap = data.noiDungCuuTro;
    await this.spinner.hide();
  }



  openDialogDdiemNhapHang() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách địa điểm xuất hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDiaDiemNhap,
        dataHeader: ['Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho'],
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      this.bindingDataDdNhap(data, false);
    });
  }

  async bindingDataDdNhap(data, isChiTiet) {
    if (data) {
      this.formData.patchValue({
        maDiemKho: data.maDiemKho,
        tenDiemKho: data.tenDiemKho,
        maNhaKho: data.maNhaKho,
        tenNhaKho: data.tenNhaKho,
        maNganKho: data.maNganKho,
        tenNganKho: data.tenNganKho,
        maLoKho: data.maLoKho,
        tenLoKho: data.tenLoKho,
        cloaiVthh: data.cloaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        moTaHangHoa: data.moTaHangHoa,
        thuKho: data.tenThuKho,
      })
      if (!isChiTiet) {
        let [dmTieuChuan] = await Promise.all([this.khCnQuyChuanKyThuat.getQuyChuanTheoCloaiVthh(data.cloaiVthh)])
        if (dmTieuChuan.data) {
          console.log(dmTieuChuan.data,"dmTieuChuan.data")
          this.dataTableChiTieu = Array.isArray(dmTieuChuan.data) ? dmTieuChuan.data.map(element => ({
            edit: false,
            chiSoXuat: element.mucYeuCauXuat,
            tenTchuan: element.tenChiTieu,
            maChiTieu: element.maChiTieu,
            danhGia: element.danhGia,
            hdrId: element.hdrId,
            id: element.id,
            ketQuaPt: element.ketQuaPt,
            phuongPhap: element.phuongPhapXd
          })) : [];
        }
      }
    }
  }


  async save(isGuiDuyet?) {
    // this.setValidator(isGuiDuyet);
    let body = this.formData.value;
    body.fileDinhKems = this.listFileDinhKem;
    body.ketQuaPhanTich = this.dataTableChiTieu;
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
    switch (this.formData.get('trangThai').value) {
      case STATUS.TU_CHOI_LDC:
      case STATUS.TU_CHOI_TP:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_TP;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        break;
      }
      case STATUS.CHO_DUYET_TP: {
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
      case STATUS.CHO_DUYET_TP: {
        trangThai = STATUS.TU_CHOI_TP;
        break;
      }
      case STATUS.CHO_DUYET_LDC: {
        trangThai = STATUS.TU_CHOI_LDC;
        break;
      }
    }
    this.reject(this.idInput, trangThai)
  }

  isDisabled() {
    let trangThai = this.formData.value.trangThai;
    if (trangThai == STATUS.CHO_DUYET_TP || trangThai == STATUS.CHO_DUYET_LDC) {
      return true
    }
    return false;
  }
  async loadPhuongPhapLayMau() {
    this.danhMucService.danhMucChungGetAll("PP_LAY_MAU").then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.phuongPhapLayMaus = res.data;
      }
      else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }).catch(err => {
      this.notification.error(MESSAGE.ERROR, err.msg);
    })
  }
  async loadTieuChuan() {
    let body = {
      maHang: this.maVthh,
      namQchuan: null,
      paggingReq: {
        limit: 1000,
        page: 1,
      },
      str: null,
      tenQchuan: null,
      trangThai: '01',
    };
    let res = await this.danhMucService.traCuuTieuChuanKyThuat(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content.length > 0) {
        if (
          res.data.content[0].children &&
          res.data.content[0].children.length > 0
        ) {
          this.listTieuChuan = res.data.content[0].children;
        }
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  cancelEdit(index: number): void {
    this.dataTableChiTieu[index].edit = false;
  }

  saveEdit(index: number): void {
    this.dataTableChiTieu[index].edit = false;
  }

  editRow(index: number) {
    this.dataTableChiTieu[index].edit = true;
  }

}
