import { BangKeCanHangService } from './../../../../../../../services/qlnv-hang/nhap-hang/mua-truc-tiep/nhapkho/BangKeCanHang.service';
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
import {
  DialogTableSelectionComponent
} from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { DanhMucService } from 'src/app/services/danhmuc.service';

import {
  QuyetDinhGiaoNvCuuTroService
} from 'src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/QuyetDinhGiaoNvCuuTro.service';
import { convertTienTobangChu, convertTienTobangChuThapPhan } from 'src/app/shared/commonFunction';
import { PhieuXuatKhoService } from 'src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/PhieuXuatKho.service';
import { Validators } from '@angular/forms';
import {
  PhieuKiemNghiemChatLuongService
} from "src/app/services/qlnv-hang/xuat-hang/chung/kiem-tra-chat-luong/PhieuKiemNghiemChatLuong.service";
import { uniqBy } from 'lodash';
import { BangKeCanCtvtService } from 'src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/BangKeCanCtvt.service';
import { AMOUNT_ONE_DECIMAL } from 'src/app/Utility/utils';
@Component({
  selector: 'app-them-moi-phieu-xuat-kho',
  templateUrl: './them-moi-phieu-xuat-kho.component.html',
  styleUrls: ['./them-moi-phieu-xuat-kho.component.scss']
})
export class ThemMoiPhieuXuatKhoComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Input() isViewOnModal: boolean;
  @Input() loaiXuat: string;
  @Output()
  showListEvent = new EventEmitter<any>();
  listSoQuyetDinh: any[] = [];
  listDiaDiemNhap: any[] = [];
  listPhieuKtraCl: any[] = [];
  fileDinhKems: any[] = [];
  listDiemKho: any[] = [];
  listBbLayMau: any[] = [];
  maPhieu: string;
  checked: boolean = false;
  listFileDinhKem: any = [];
  templateName = "Phiếu xuất kho";
  templateNameVt = "Phiếu xuất kho";
  listDonViNhan: any[];
  listDiaDiemNhapFilter: any[];
  amount1 = { ...AMOUNT_ONE_DECIMAL };
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private quyetDinhGiaoNvCuuTroService: QuyetDinhGiaoNvCuuTroService,
    public phieuKiemNghiemChatLuongService: PhieuKiemNghiemChatLuongService,
    private phieuXuatKhoService: PhieuXuatKhoService,
    private bangKeCanCtvtService: BangKeCanCtvtService
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuXuatKhoService);

    this.formData = this.fb.group(
      {
        id: [0],
        nam: [dayjs().get("year")],
        maDvi: [],
        maQhNs: [],
        soPhieuXuatKho: [],
        ngayTaoPhieu: ['', [Validators.required]],
        ngayXuatKho: ['', [Validators.required]],
        taiKhoanNo: [],
        taiKhoanCo: [],
        idQdGiaoNvXh: ['', [Validators.required]],
        idDtlQdGiaoNvXh: [],
        soQdGiaoNvXh: ['', [Validators.required]],
        ngayQdGiaoNvXh: [],
        maDiemKho: ['', [Validators.required]],
        maNhaKho: [],
        maNganKho: [],
        maLoKho: [],
        idPhieuKnCl: [],
        soPhieuKnCl: ['', [Validators.required]],
        ngayKn: [],
        loaiVthh: [, [Validators.required]],
        cloaiVthh: [],
        moTaHangHoa: [],
        canBoLapPhieu: [],
        ldChiCuc: [],
        ktvBaoQuan: [],
        keToanTruong: [],
        nguoiGiaoHang: [],
        soCmt: [],
        ctyNguoiGh: [],
        diaChi: [],
        thoiGianGiaoNhan: [],
        soBangKeCh: [],
        idBangKeCh: [],
        maSo: [],
        donViTinh: [, [Validators.required]],
        theoChungTu: [, [Validators.required, Validators.min(0)]],
        thucXuat: [, [Validators.required, Validators.min(0)]],
        donGia: [, [Validators.required, Validators.min(0)]],
        thanhTien: [, [Validators.required, Validators.min(0)]],
        ghiChu: [''],
        trangThai: [STATUS.DU_THAO],
        tenDvi: [],
        lyDoTuChoi: [],
        type: [],
        tenTrangThai: ['Dự Thảo'],
        diaChiDvi: [],
        tenLoaiVthh: [],
        tenCloaiVthh: [],
        tenDiemKho: ['', [Validators.required]],
        tenNhaKho: ['', [Validators.required]],
        tenNganKho: ['', [Validators.required]],
        tenLoKho: [],
        tenNganLoKho: [],
        fileDinhKems: [new Array<FileDinhKem>()],
        loaiNhapXuat: [],
        kieuNhapXuat: [],
        mucDichXuat: [, [Validators.required]],
        noiDungDx: [],
        soLuong: [, [Validators.required, Validators.min(0)]],
        thanhTienBc: [, [Validators.required]],
        soLuongBc: [, [Validators.required]]

      }
    );
    this.maPhieu = 'PXK-' + this.userInfo.DON_VI.tenVietTat;
    this.formData.get("thucXuat").valueChanges.subscribe((value) => {
      this.calculateThanhTien(value, "thucXuat");
      const soLuongBc = value ? this.convertTienTobangChu(value, this.formData.value.donViTinh === "kg" ? "kilôgam" : this.formData.value.donViTinh) : "";
      this.formData.patchValue({ soLuongBc });
    })
    this.formData.get("donGia").valueChanges.subscribe((value) => {
      this.calculateThanhTien(value, "donGia");
    })
    // this.setTitle();
  }

  async ngOnInit() {
    try {
      await this.spinner.show();

      await Promise.all([
        this.loadSoQuyetDinh()
      ])
      await this.loadDetail(this.idInput)
      await this.spinner.hide();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      await this.spinner.hide();
    } finally {
      await this.spinner.hide();
    }
  }


  async loadDetail(idInput: number) {
    if (idInput > 0) {
      await this.phieuXuatKhoService.getDetail(idInput)
        .then(async (res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.formData.patchValue({ ...res.data, tenNganLoKho: res.data.tenLoKho ? `${res.data.tenLoKho} - ${res.data.tenNganKho}` : res.data.tenNganKho, });
            const data = res.data;
            this.fileDinhKems = data.fileDinhKems;
            if (res.data.idQdGiaoNvXh) {
              await this.bindingDataQd(res.data.idQdGiaoNvXh);
            }
            // this.getDsDonViNhan()
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    } else {
      let id = await this.userService.getId('XH_CTVT_PHIEU_XUAT_KHO_SEQ')
      this.formData.patchValue({
        maDvi: this.userInfo.MA_DVI,
        tenDvi: this.userInfo.TEN_DVI,
        maQhNs: this.userInfo.DON_VI.maQhns,
        canBoLapPhieu: this.userInfo.TEN_DAY_DU,
        soPhieuXuatKho: `${id}/${this.formData.get('nam').value}/${this.maPhieu}`,
        ngayTaoPhieu: dayjs().format('YYYY-MM-DD'),
        ngayXuatKho: dayjs().format('YYYY-MM-DD'),
        type: this.loaiXuat,
        // loaiVthh: this.loaiVthh
      });
    }

  }
  // getDsDonViNhan() {
  //   const { maNganKho, maLoKho } = this.formData.value;
  //   const maNganLo = maLoKho ? `${maLoKho}-${maNganKho}` : maNganKho;
  //   this.listDonViNhan = [];
  //   this.listDiaDiemNhap.forEach(f => {
  //     const maNganLoDiaDiemNhap = f.maLoKho ? `${f.maLoKho}-${f.maNganKho}` : f.maNganKho;
  //     if (maNganLo === maNganLoDiaDiemNhap && this.listDonViNhan.findIndex(m => m.noiDungDx == f.noiDungDx) < 0) {
  //       this.listDonViNhan.push({ noiDungDx: f.noiDungDx, soLuong: f.soLuong })
  //     }
  //   })
  // }
  quayLai() {
    this.showListEvent.emit();
  }

  async loadSoQuyetDinh() {
    let body = {
      trangThai: STATUS.BAN_HANH,
      loaiVthh: this.loaiVthh,
      types: this.loaiXuat === 'CTVT' ? ['TH', 'TTr'] : [this.loaiXuat],
      // listTrangThaiXh: [STATUS.CHUA_THUC_HIEN, STATUS.DANG_THUC_HIEN],
      // listTrangThaiXh: [STATUS.DA_HOAN_THANH],
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0
      }
    }
    let res = await this.quyetDinhGiaoNvCuuTroService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoQuyetDinh = data.content.filter(f => f.dataDtl.some(f => f.trangThai === STATUS.DA_HOAN_THANH));
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
        dataColumn: ['soBbQd', 'ngayKy', 'tenVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          soQdGiaoNvXh: '',
          idQdGiaoNvXh: '',
          idDtlQdGiaoNvXh: '',
          ngayQdGiaoNvXh: '',
          thoiGianGiaoNhan: '',
          loaiNhapXuat: '',
          kieuNhapXuat: '',
          mucDichXuat: ''
        })
        await this.bindingDataQd(data.id, true);
      }
    });
  };

  async bindingDataQd(id, isSetTc?) {
    await this.spinner.show();
    let dataRes = await this.quyetDinhGiaoNvCuuTroService.getDetail(id)
    const data = dataRes.data;
    this.formData.patchValue({
      soQdGiaoNvXh: data.soBbQd,
      idQdGiaoNvXh: data.id,
      // idDtlQdGiaoNvXh: data.idDtlQdGiaoNvXh,
      ngayQdGiaoNvXh: data.ngayKy,
      thoiGianGiaoNhan: data.thoiGianGiaoNhan,
      loaiNhapXuat: data.loaiNhapXuat,
      kieuNhapXuat: data.kieuNhapXuat,
      mucDichXuat: data.mucDichXuat
    });
    data.dataDtl.forEach(s => {
      s.maDiemKho = s.maDvi.length >= 10 ? s.maDvi.substring(0, 10) : null;
      s.maNhaKho = s.maDvi.length >= 12 ? s.maDvi.substring(0, 12) : null;
      s.maNganKho = s.maDvi.length >= 14 ? s.maDvi.substring(0, 14) : null;
      s.maLoKho = s.maDvi.length >= 16 ? s.maDvi.substring(0, 16) : null;
      s.idDtlQdGiaoNvXh = s.id
    });
    let dataChiCuc = data.dataDtl.filter(item => item.tenChiCuc == this.userInfo.TEN_DVI && item.trangThai === STATUS.DA_HOAN_THANH);
    if (dataChiCuc) {
      this.listDiaDiemNhap = dataChiCuc;
      // this.listDiaDiemNhapFilter = uniqBy(this.listDiaDiemNhap.map(f => ({ ...f, maNganLo: f.maLoKho ? `${f.maLoKho}-${f.maNganKho}` : f.maNganKho })), 'maNganLo')
    }
    await this.spinner.hide();
  }


  openDialogDdiemNhapHang() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách địa điểm xuất hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1200px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDiaDiemNhap,
        // dataTable: this.listDiaDiemNhapFilter,
        dataHeader: ['Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho', 'Địa phương/cơ quan/đơn vị nhận cứu trợ'],
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho', 'noiDungDx']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      this.bindingDataDdNhap(data);
    });
  }

  async bindingDataDdNhap(data) {
    if (data) {
      this.formData.patchValue({
        maDiemKho: data.maDiemKho,
        tenDiemKho: data.tenDiemKho,
        maNhaKho: data.maNhaKho,
        tenNhaKho: data.tenNhaKho,
        maNganKho: data.maNganKho,
        tenNganKho: data.tenNganKho,
        tenNganLoKho: data.tenLoKho ? `${data.tenLoKho} - ${data.tenNganKho}` : data.tenNganKho,
        maLoKho: data.maLoKho,
        tenLoKho: data.tenLoKho,
        donViTinh: data.donViTinh,
        idDtlQdGiaoNvXh: data.idDtlQdGiaoNvXh,
        // mucDichXuat: data.mucDichXuat,
        noiDungDx: data.noiDungDx,
        soLuong: data.soLuong
      })
      let body = {
        trangThai: STATUS.DA_DUYET_LDC,
        loaiVthh: this.loaiVthh,
        type: this.loaiXuat,
      }
      let res = await this.phieuKiemNghiemChatLuongService.search(body)
      const list = res.data.content.map(f => ({ ...f, tenNganLo: f.tenLoKho ? `${f.tenLoKho}-${f.tenNganKho}` : f.tenNganKho }));
      // this.listPhieuKtraCl = list.filter(item => (item.tenDiemKho == data.tenDiemKho));
      const tenNganLo = data.tenLoKho ? `${data.tenLoKho}-${data.tenNganKho}` : data.tenNganKho;
      const phieuKtraClData = list.find(f => f.tenNganLo === tenNganLo) ? list.find(f => f.tenNganLo === tenNganLo) : null;
      this.bindingDataPhieuKncl(phieuKtraClData)
      // this.getDsDonViNhan();
    }
  }
  bindingDataPhieuKncl(data: any) {
    if (data) {
      this.formData.patchValue({
        idPhieuKnCl: data.id,
        soPhieuKnCl: data.soBbQd,
        ktvBaoQuan: data.dviKiemNghiem,
        ngayKn: data.ngayKiemNghiem,
        loaiVthh: data.loaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        moTaHangHoa: data.moTaHangHoa
      });
    } else {
      this.formData.patchValue({
        idPhieuKnCl: null,
        soPhieuKnCl: '',
        ktvBaoQuan: '',
        ngayKn: '',
        loaiVthh: '',
        cloaiVthh: '',
        tenLoaiVthh: '',
        tenCloaiVthh: '',
        moTaHangHoa: '',

      });
    }
  }

  openDialogPhieuKnCl() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách phiếu kiểm nghiệm chất lượng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listPhieuKtraCl,
        dataHeader: ['Số phiếu', 'Ngày giám định'],
        dataColumn: ['soBbQd', 'ngayKiemNghiem']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          idPhieuKnCl: data.id,
          soPhieuKnCl: data.soBbQd,
          ktvBaoQuan: data.dviKiemNghiem,
          ngayKn: data.ngayKiemNghiem,
          loaiVthh: data.loaiVthh,
          cloaiVthh: data.cloaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          tenCloaiVthh: data.tenCloaiVthh,
          moTaHangHoa: data.moTaHangHoa,

        });
      }
    });
  }
  async getDetailBkch() {
    const { idBangKeCh } = this.formData.value;
    if (!idBangKeCh) return;
    const res = await this.bangKeCanCtvtService.getDetail(idBangKeCh);
    if (res.msg === MESSAGE.SUCCESS) {
      return res.data.trangThai === STATUS.DA_DUYET_LDCC
    }
    return;
  }
  async save() {
    this.helperService.ignoreRequiredForm(this.formData, ['soQdGiaoNvXh']);
    this.formData.controls['soPhieuXuatKho'].setValidators(Validators.required);
    let body = this.formData.value;
    body.fileDinhKems = this.fileDinhKems;
    let rs = await this.createUpdate(body);
    this.helperService.restoreRequiredForm(this.formData)
  }
  async luuGuiDuyet() {
    this.formData.controls["soBangKeCh"].setValidators(Validators.required);
    if (this.formData.valid) {
      const trangThaiLdccDuyet = await this.getDetailBkch();
      if (!trangThaiLdccDuyet) {
        return this.notification.error(MESSAGE.ERROR, `${this.loaiVthh === '02' ? 'Bảng kê xuất vật tư' : 'Bảng kê cân hàng'} của phiếu xuất chưa được duyệt`)
      }
    };
    await this.saveAndSend(this.formData.value, STATUS.CHO_DUYET_LDCC, 'Bạn có muốn lưu và gửi duyệt ?', 'Bạn đã lưu và gửi duyệt thành công!');
  }
  pheDuyet() {
    let trangThai = '';
    let msg = '';
    let MSG = '';
    switch (this.formData.value.trangThai) {
      case STATUS.TU_CHOI_LDCC:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_LDCC;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        MSG = MESSAGE.GUI_DUYET_SUCCESS;
        break;
      }
      case STATUS.CHO_DUYET_LDCC: {
        trangThai = STATUS.DA_DUYET_LDCC;
        msg = MESSAGE.PHE_DUYET_CONFIRM;
        MSG = MESSAGE.PHE_DUYET_SUCCESS
        break;
      }
    }
    this.approve(this.formData.value.id, trangThai, msg);
  }

  tuChoi() {
    let trangThai = '';
    switch (this.formData.value.trangThai) {
      case STATUS.CHO_DUYET_LDCC: {
        trangThai = STATUS.TU_CHOI_LDCC;
        break;
      }
    }
    this.reject(this.formData.value.id, trangThai)
  }

  isDisabled() {
    let trangThai = this.formData.value.trangThai;
    if (trangThai == STATUS.CHO_DUYET_LDCC) {
      return true
    }
    return false;
  }

  clearItemRow(id) {

    this.formData.patchValue({
      maSo: null,
      theoChungTu: null,
      thucXuat: null,
    })
  }

  calculateThanhTien(value: number, loai: string): void {
    const thucXuat = loai === "thucXuat" ? value : this.formData.value.thucXuat;
    const donGia = loai === "donGia" ? value : this.formData.value.donGia;
    const thanhTien = thucXuat && donGia ? thucXuat * donGia : "";
    const thanhTienBc = thanhTien ? this.convertTienTobangChu(thanhTien, "đồng") : "";
    this.formData.patchValue({ thanhTien, thanhTienBc });
  }
  convertTienTobangChu(tien: number, donVi?: string) {
    if (tien > 0) {
      let rs = convertTienTobangChuThapPhan(Number(tien.toFixed(1)));
      return rs.charAt(0).toUpperCase() + rs.slice(1) + (donVi ? " " + donVi : "");
    }
  }
  showAction() {
    if (this.isView) return false;
    return true;
  }
}
