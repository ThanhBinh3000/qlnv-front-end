import { saveAs } from 'file-saver';
import { cloneDeep } from 'lodash';
import { BienBanHaoDoiDieuChuyenService } from './../../services/dcnb-bien-ban-hao-doi.service';
import { BienBanTinhKhoDieuChuyenService } from './../../services/dcnb-bien-ban-tinh-kho.service';
import { PhieuXuatKhoDieuChuyenService } from './../../services/dcnb-xuat-kho.service';
import { QuyetDinhDieuChuyenCucService } from 'src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-c.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

import { convertTienTobangChu } from 'src/app/shared/commonFunction';
import { Validators } from '@angular/forms';
import {
  QuyetDinhGiaoNvXuatHangService
} from "src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/quyetdinh-nhiemvu-xuathang/quyet-dinh-giao-nv-xuat-hang.service";
import {
  BienBanHaoDoiService
} from "src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/xuat-kho/BienBanHaoDoi.service";
import {
  BienBanTinhKhoService
} from "src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/xuat-kho/BienBanTinhKho.service";
import { PassDataBienBanHaoDoi } from '../bien-ban-hao-doi.component';
import { PREVIEW } from 'src/app/constants/fileType';
import { PhieuKiemNghiemChatLuongDieuChuyenService } from '../../services/dcnb-phieu-kiem-nghiem-chat-luong.service';

export const LIST_TRANG_THAI_BBHD = {
  [STATUS.DU_THAO]: "Dự thảo",
  [STATUS.CHO_DUYET_KTVBQ]: "Chờ duyệt - kỹ thuật viên bảo quản",
  [STATUS.TU_CHOI_KTVBQ]: "Từ chối kỹ - thuật viên bảo quản",
  [STATUS.CHO_DUYET_KT]: "Chờ duyệt - kế toán",
  [STATUS.TU_CHOI_KT]: "Từ chối - kế toán",
  [STATUS.CHO_DUYET_LDCC]: "Chờ duyệt - lãnh đạo chi cục",
  [STATUS.TU_CHOI_LDCC]: "Từ chối - lãnh đạo chi cục",
  [STATUS.DA_DUYET_LDCC]: "Đã duyệt - lãnh đạo chi cục"
}
@Component({
  selector: 'app-xuat-dcnb-them-moi-bien-ban-hao-doi',
  templateUrl: './them-moi-bien-ban-hao-doi.component.html',
  styleUrls: ['./them-moi-bien-ban-hao-doi.component.scss']
})
export class ThemMoiBienBanHaoDoiDieuChuyenComponent extends Base2Component implements OnInit {
  @Input() loaiDc: string;
  @Input() isVatTu: boolean;
  @Input() thayDoiThuKho: boolean;
  @Input() type: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Input() isViewOnModal: boolean;
  @Input() passData: PassDataBienBanHaoDoi;
  @Input() addChung: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  listSoQuyetDinh: any[] = []
  listDiaDiemNhap: any[] = [];
  listPhieuXuatKho: any[] = [];
  listBbTinhKho: any[] = [];
  fileBbTinhKhoDaKy: any[] = [];
  listDiemKho: any[] = [];
  maBb: string;
  checked: boolean = false;
  listFileDinhKem: any = [];
  listTiLe: any = [];
  LIST_TRANG_THAI = LIST_TRANG_THAI_BBHD;
  // passData: PassDataBienBanHaoDoi = {
  //   soQdinhDcc: '', qdinhDccId: null, soBbTinhKho: '', bbtinhKhoId: null, maDiemKho: '', tenDiemKho: '', maNhaKho: '', tenNhaKho: '',
  //   maNganKho: '', tenNganKho: '', maLoKho: '', tenLoKho: '', loaiVthh: '', cloaiVthh: '', tenLoaiVthh: '', tenCloaiVthh: '',
  // }
  reportTemplate: any = {
    typeFile: "",
    fileName: "",
    tenBaoCao: "",
    trangThai: ""
  };
  showDlgPreview: boolean;
  pdfSrc: string;
  wordSrc: string;
  excelSrc: string;
  isPrint: boolean;
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private quyetDinhDieuChuyenCucService: QuyetDinhDieuChuyenCucService,
    private phieuXuatKhoDieuChuyenService: PhieuXuatKhoDieuChuyenService,
    private bienBanTinhKhoDieuChuyenService: BienBanTinhKhoDieuChuyenService,
    private phieuKiemNghiemChatLuongDieuChuyenService: PhieuKiemNghiemChatLuongDieuChuyenService,
    private bienBanHaoDoiDieuChuyenService: BienBanHaoDoiDieuChuyenService
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanHaoDoiDieuChuyenService);

    this.formData = this.fb.group(
      {
        id: [],
        nam: [dayjs().get("year")],
        maDvi: [],
        maQhns: [],
        soBienBan: [],
        ngayLap: [],
        qdinhDccId: [],
        soQdinhDcc: ['', [Validators.required]],
        ngayKyQdDcc: [],
        maDiemKho: ['', [Validators.required]],
        maNhaKho: ['', [Validators.required]],
        maNganKho: ['', [Validators.required]],
        maLoKho: [],
        tenNhaKho: ['', [Validators.required]],
        tenDiemKho: ['', [Validators.required]],
        tenLoKho: [],
        tenNganKho: ['', Validators.required],
        tenNganLoKho: ['', [Validators.required]],

        danhSachBangKe: [new Array()],
        fileDinhKems: [new Array()],
        thongTinHaoHut: [new Array()],
        tongSlXuatTheoQd: [],
        ngayKetThucXuatQd: [],
        tongSlXuatTheoTt: [],
        ngayKetThucXuatTt: [],
        slHaoTt: [],
        tiLeHaoTt: [],
        slHaoVuotDm: [],
        tiLeHaoVuotDm: [],

        ngayKtNhap: [],
        tongSlXuat: [],
        ngayKtXuat: [],
        slHaoThucTe: [],
        tiLeHaoThucTe: [],
        slHaoThanhLy: [],
        tiLeHaoThanhLy: [],
        // slHaoVuotDm: [],
        slHaoDuoiDm: [],
        tiLeHaoDuoiDm: [],
        dinhMucHaoHut: [],
        sLHaoHutTheoDm: [],
        nguyenNhan: [''],
        kienNghi: [''],
        ghiChu: [''],

        thuKho: [],
        ktvBaoQuan: [],
        ktvBaoQuanId: [],
        keToan: [],
        keToanId: [],
        lanhDaoChiCuc: [],
        lanhDaoChiCucId: [],

        soBbTinhKho: [],
        bbtinhKhoId: [],
        trangThai: [STATUS.DU_THAO],
        tenTrangThai: ['Dự Thảo'],
        lyDoTuChoi: [],
        diaChiDvi: [],
        tenDvi: [],
        loaiVthh: [],
        cloaiVthh: [],
        tenLoaiVthh: [],
        tenCloaiVthh: [],
        soPhieuKtChatLuong: [],
        donViTinh: [],
        // fileDinhKems: [new Array<FileDinhKem>()],
      }
    );
    this.maBb = '-BBHD';
    // this.setTitle();
  }

  async ngOnInit() {
    try {
      this.spinner.show();
      if (this.isViewOnModal) {
        this.isView = true
      }
      await Promise.all([
        this.loadSoQuyetDinh(),
        // this.loadSoBbTinhKho()
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
      try {
        const res = await this.bienBanHaoDoiDieuChuyenService.getDetail(idInput);
        if (res.msg == MESSAGE.SUCCESS) {
          this.formData.patchValue(res.data);
          const data = res.data;
          this.formData.patchValue({ soBienBan: this.genSoBBHaoDoi(data.id), tenNganLoKho: data.tenLoKho ? `${data.tenLoKho} - ${data.tenNganKho}` : data.tenNganKho })
        }
      } catch (e) {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    } else {
      this.formData.patchValue({
        maDvi: this.userInfo.MA_DVI,
        tenDvi: this.userInfo.TEN_DVI,
        maQhns: this.userInfo.DON_VI.maQhns,
        ngayLap: dayjs().format('YYYY-MM-DD'),
        thuKho: this.userInfo.TEN_DAY_DU,
        ...this.passData,
        tenNganLoKho: this.passData.tenLoKho ? `${this.passData.tenLoKho} - ${this.passData.tenNganKho}` : this.passData.tenNganKho
      });
      // if (this.passData.qdinhDccId) {
      //   await this.bindingDataQd(this.passData.qdinhDccId, true);
      //   const dataDiaDiemNhap = this.listDiaDiemNhap.find(f => ((f.maLoKho && f.maLoKho === this.passData.maLoKho) || (!f.maLoKho && !this.passData.maLoKho && f.maNganKho && f.maNganKho === this.passData.maNganKho)))
      //   this.bindingDataDdNhap(dataDiaDiemNhap)
      // }
      this.loadSoBbTinhKho();
      this.loadDSPhieuKNCluong(this.passData);
      if (this.formData.value.qdinhDccId) {
        this.getThongTinPhieuXuatKho();
      };
      if (this.formData.value.bbtinhKhoId) {
        this.getChiTietBBTK(this.formData.value.bbtinhKhoId);
      }
    }

  }
  genSoBBHaoDoi(id: number): string {
    if (!id) return "";
    return `${id}${this.formData.value.nam}${this.maBb}`
  }

  quayLai() {
    this.showListEvent.emit();
  }
  async loadSoQuyetDinh() {
    this.spinner.show();
    try {

      let body = {
        loaiDc: this.loaiDc, isVatTu: this.isVatTu, thayDoiThuKho: this.thayDoiThuKho, type: "00",
        trangThai: STATUS.BAN_HANH,
      }
      let res = await this.quyetDinhDieuChuyenCucService.getDsSoQuyetDinhDieuChuyenChiCuc(body);
      if (res.msg === MESSAGE.SUCCESS) {
        this.listSoQuyetDinh = res.data;
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    } catch (error) {
      console.log('e', error);
      this.notification.error(MESSAGE.ERROR, "Có lỗi xảy ra.")
    }
    finally {
      this.spinner.hide();
    }
  }
  resetData() {
    this.formData.patchValue({
      maDiemKho: '',
      tenDiemKho: '',
      maNhaKho: '',
      tenNhaKho: '',
      maNganKho: '',
      tenNganKho: '',
      maLoKho: '',
      tenLoKho: '',
      tenNganLoKho: '',

      loaiVthh: '',
      cloaiVthh: '',
      tenLoaiVthh: '',
      tenCloaiVthh: '',

      tongSlXuatTheoQd: 0,
      tonKhoBanDau: 0,
      slConLaiTheoSs: 0,
      tongSlXuatTheoTt: 0,
      danhSachBangKe: [],
      thongTinHaoHut: [],
      ngayBatDauXuat: ''

    })
  }
  async loadSoBbTinhKho() {
    this.listBbTinhKho = [];
    let body = {
      trangThai: STATUS.DA_DUYET_LDCC,
      loaiDc: this.loaiDc, isVatTu: this.isVatTu, thayDoiThuKho: this.thayDoiThuKho, type: this.type,
      maLoKho: this.formData.value.maLoKho,
      qdinhDccId: this.formData.value.qdinhDccId,
      maNganKho: this.formData.value.maNganKho,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0
      },
    }
    let res = await this.bienBanTinhKhoDieuChuyenService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listBbTinhKho = [];
      Array.isArray(data.content) && data.content.forEach(item => {
        if (!this.listBbTinhKho.find(f => f.id === item.id)) {
          this.listBbTinhKho.push(item)
        }
      });
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async openDialogSoQd() {
    if (!this.addChung) return;
    await this.loadSoQuyetDinh()
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
        dataColumn: ['soQdinh', 'ngayKyQdinh', 'tenLoaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.bindingDataQd(data.id, true);
      }
    });
  };

  async bindingDataQd(id, isSetTc?) {
    try {
      await this.spinner.show();
      let dataRes = await this.quyetDinhDieuChuyenCucService.getDetail(id)
      const data = dataRes.data;

      if (dataRes.msg === MESSAGE.SUCCESS) {
        this.formData.patchValue({
          soQdinhDcc: data.soQdinh,
          qdinhDccId: data.id,
          ngayKyQdDcc: data.ngayKyQdinh,


        });
        this.listDiaDiemNhap = [];
        let dataChiCuc = [];
        if (this.formData.value.qdinhDccId) {
          this.getThongTinPhieuXuatKho();
        }
        if (data.maDvi === this.userInfo.MA_DVI && Array.isArray(data?.danhSachQuyetDinh)) {
          data.danhSachQuyetDinh.forEach(element => {
            if (Array.isArray(element.danhSachKeHoach)) {
              element.danhSachKeHoach.forEach(item => {
                if (dataChiCuc.findIndex(f => ((!f.maLoKho && !item.maLoKho && item.maNganKho && f.maNganKho === item.maNganKho) || (f.maLoKho && f.maLoKho === item.maLoKho))) < 0) {
                  dataChiCuc.push(item)
                }
              });
            }
          });
        }
        this.listDiaDiemNhap = cloneDeep(dataChiCuc);
      }
    } catch (error) {
      console.log('e', error)
    } finally {
      await this.spinner.hide();

    }
  }


  openDialogDdiemXuatHang() {
    if (!this.addChung) return;
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
        maLoKho: data.maLoKho,
        tenLoKho: data.tenLoKho,
        soPhieuKnCl: data.soPhieu,
        loaiVthh: data.loaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        moTaHangHoa: data.moTaHangHoa,
        tenNganLoKho: data.tenLoKho ? `${data.tenLoKho} - ${data.tenNganKho}` : data.tenNganKho,
        donViTinh: data.donViTinh,
      })
      // this.listBbTinhKho = this.listBbTinhKho.filter(item => (item.maDiemKho == data.maDiemKho));
      this.loadSoBbTinhKho();
      this.loadDSPhieuKNCluong(data);
    }
  }

  async onSelectSoBbTinhKho(id: number): Promise<void> {
    console.log("id", id)
    this.listPhieuXuatKho = [];
    if (id) {
      this.getChiTietBBTK(id)
    }
  };

  async loadDSPhieuKNCluong(data) {
    let body = {
      loaiDc: this.loaiDc,
      soQdinhDcc: this.formData.value.soQdinhDcc,
      isVatTu: this.isVatTu,
      thayDoiThuKho: this.thayDoiThuKho,
      type: this.type,
      trangThai: STATUS.DA_DUYET_LDC,
    }
    let res = await this.phieuKiemNghiemChatLuongDieuChuyenService.dsPhieuKNChatLuong(body)
    if (res.data) {
      const list = res.data;
      const dataPhieu = list.find(item => (item.maDiemKho == data.maDiemKho && item.maNhaKho == data.maNhaKho && item.maNganKho == data.maNganKho && ((!item.maLoKho && !data.maLoKho) || (item.maLoKho && item.maLoKho == data.maLoKho))));
      if (dataPhieu) {
        let resDetail = await this.phieuKiemNghiemChatLuongDieuChuyenService.getDetail(dataPhieu.id);
        if (resDetail.data) {
          const dataPhieuKn = resDetail.data;
          this.formData.patchValue({
            phieuKtChatLuongHdrId: dataPhieuKn.id,
            soPhieuKtChatLuong: dataPhieuKn.soPhieu,
          });
        }
      }
    }
  }
  async getThongTinPhieuXuatKho() {
    let body = {
      loaiDc: this.loaiDc,
      isVatTu: this.isVatTu,
      thayDoiThuKho: this.thayDoiThuKho,
      type: this.type,
      trangThai: STATUS.DA_DUYET_LDCC,
      qdinhDccId: this.formData.value.qdinhDccId,
      maLoKho: this.formData.value.maLoKho,
      maNganKho: this.formData.value.maNganKho
    }
    let res = await this.phieuXuatKhoDieuChuyenService.getThongTinChungPhieuXuatKho(body)
    const list = res.data;
    // this.listPhieuXuatKho = list.filter(item => ((this.formData.value.maLoKho && this.formData.value.maLoKho === item.maloKho) ||
    //   (!this.formData.value.maLoKho && this.formData.value.maNganKho && this.formData.value.maNganKho === item.maNganKho)));
    const dataTable = Array.isArray(list) ? list.map(f => ({
      bangKeCanHangHdrId: f.bangKeCanHangId,
      hdrId: null,
      id: null,
      ngayXuatKho: f.ngayXuatKho,
      phieuXuatKhoHdrId: f.id,
      soPhieuXuatKho: f.soPhieuXuatKho,
      soBangKeCanHang: f.soBangKeCanHang,
      soLuongXuat: f.soLuong
    })) : [];
    this.formData.patchValue({ danhSachBangKe: dataTable })
  }
  async getChiTietBBTK(id: number) {
    const res = await this.bienBanTinhKhoDieuChuyenService.getDetail(id);
    if (res.msg === MESSAGE.SUCCESS) {
      const { tongSlXuatTheoTt, tongSlXuatTheoQd, slConLaiTheoSs, slConLaiTheoTt } = res.data;
      const slHaoTt = Number(slConLaiTheoSs) - Number(slConLaiTheoTt);
      let tiLeHaoTt = 0;
      if (tongSlXuatTheoTt) {
        tiLeHaoTt = slHaoTt / (tongSlXuatTheoTt * 100)
      }

      this.formData.patchValue({ soBbTinhKho: res.data.soBbTinhKho, tongSlXuatTheoQd: tongSlXuatTheoQd, tongSlXuatTheoTt: tongSlXuatTheoTt, ngayBatDauXuatTt: res.data.ngayBatDauXuat, ngayKetThucXuatTt: res.data.ngayKeThucXuat, slHaoTt })
    }
  }
  async save(isGuiDuyet?) {
    let body = this.formData.value;
    body.fileBbTinhKhoDaKy = this.fileBbTinhKhoDaKy;
    body.listPhieuXuatKho = this.dataTable;

    body.loaiDc = this.loaiDc;
    body.isVatTu = this.isVatTu;
    body.thayDoiThuKho = this.thayDoiThuKho;
    body.type = this.type;
    body.loaiQding = this.loaiDc === "CUC" ? "XUAT" : undefined;
    let data = await this.createUpdate(body, null, isGuiDuyet);
    if (data) {
      this.formData.patchValue({ id: data.id, trangThai: data.trangThai, soBienBan: data.soBienBan ? data.soBienBan : this.genSoBBHaoDoi(data.id) })
      if (isGuiDuyet) {
        this.pheDuyet();
      }
    }
  }
  showDuyet() {
    return ([STATUS.CHO_DUYET_KTVBQ, STATUS.CHO_DUYET_KT, STATUS.CHO_DUYET_LDCC].includes(this.formData.value.trangThai)) && this.userService.isChiCuc()
  }
  pheDuyet() {
    let trangThai = '';
    let msg = '';
    switch (this.formData.value.trangThai) {
      case STATUS.TU_CHOI_LDCC:
      case STATUS.TU_CHOI_KT:
      case STATUS.TU_CHOI_KTVBQ:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_KTVBQ;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        break;
      }
      case STATUS.CHO_DUYET_KTVBQ: {
        trangThai = STATUS.CHO_DUYET_KT;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        break;
      }
      case STATUS.CHO_DUYET_KT: {
        trangThai = STATUS.CHO_DUYET_LDCC;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        break;
      }
      case STATUS.CHO_DUYET_LDCC: {
        trangThai = STATUS.DA_DUYET_LDCC;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        break;
      }
    }
    this.approve(this.formData.value.id, trangThai, msg, null, MESSAGE.PHE_DUYET_SUCCESS);
  }
  showTuChoi() {
    return ([STATUS.CHO_DUYET_KTVBQ, STATUS.CHO_DUYET_KT, STATUS.CHO_DUYET_LDCC].includes(this.formData.value.trangThai)) && this.userService.isChiCuc()
  }
  tuChoi() {
    let trangThai = '';
    switch (this.formData.value.trangThai) {
      case STATUS.CHO_DUYET_LDCC: {
        trangThai = STATUS.TU_CHOI_LDCC;
        break;
      }
      case STATUS.CHO_DUYET_KT: {
        trangThai = STATUS.TU_CHOI_KT;
        break;
      }
      case STATUS.CHO_DUYET_KTVBQ: {
        trangThai = STATUS.TU_CHOI_KTVBQ;
        break;
      }
    }
    this.reject(this.formData.value.id, trangThai)
  }

  isDisabled() {
    let trangThai = this.formData.value.trangThai;
    if (trangThai == STATUS.CHO_DUYET_LDCC || trangThai == STATUS.CHO_DUYET_KT || trangThai == STATUS.CHO_DUYET_KTVBQ) {
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

  calcTong() {
    if (this.dataTable) {
      const sum = this.dataTable.reduce((prev, cur) => {
        prev += cur.slXuat;
        return prev;
      }, 0);
      return sum;
    }
  }

  convertTien(tien: number): string {
    return convertTienTobangChu(tien);
  }

  flattenTree(tree) {
    return tree.flatMap((item) => {
      return item.childData ? this.flattenTree(item.childData) : item;
    });
  }
  //Preview
  async preview() {
    this.reportTemplate.fileName = "bien_ban_hao_doi.docx";
    let body = {
      reportTemplateRequest: this.reportTemplate,
      ...this.formData.value
    }
    await this.bienBanHaoDoiDieuChuyenService.preview(body).then(async s => {
      this.pdfSrc = PREVIEW.PATH_PDF + s.data.pdfSrc;
      this.wordSrc = PREVIEW.PATH_WORD + s.data.wordSrc;
      this.showDlgPreview = true;
    });
  }
  downloadPdf() {
    saveAs(this.pdfSrc, "bien_ban_hao_doi.pdf");
  }

  downloadWord() {
    saveAs(this.wordSrc, "bien_ban_hao_doi.docx");
  }
  downloadExcel() {
    saveAs(this.excelSrc, "bien_ban_hao_doi.xlsx");
  }
  doPrint() {
    const WindowPrt = window.open(
      '',
      '',
      'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0',
    );
    let printContent = '';
    printContent = printContent + '<div>';
    printContent =
      printContent + document.getElementById('modal').innerHTML;
    printContent = printContent + '</div>';
    WindowPrt.document.write(printContent);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
  }
  closeDlg() {
    this.showDlgPreview = false;
  }
}
