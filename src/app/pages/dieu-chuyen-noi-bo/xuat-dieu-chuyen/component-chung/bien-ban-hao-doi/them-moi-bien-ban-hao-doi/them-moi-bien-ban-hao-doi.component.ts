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
import { MangLuoiKhoService } from 'src/app/services/qlnv-kho/mangLuoiKho.service';
import { DanhMucDinhMucHaoHutService } from 'src/app/services/danh-muc-dinh-muc-hao-hut.service';

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
  @Input() typeQd: string;
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
  previewName: string = 'bien_ban_hao_doi_lt_xuat_dieu_chuyen';
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private mangLuoiKhoService: MangLuoiKhoService,
    private quyetDinhDieuChuyenCucService: QuyetDinhDieuChuyenCucService,
    private phieuXuatKhoDieuChuyenService: PhieuXuatKhoDieuChuyenService,
    private bienBanTinhKhoDieuChuyenService: BienBanTinhKhoDieuChuyenService,
    private phieuKiemNghiemChatLuongDieuChuyenService: PhieuKiemNghiemChatLuongDieuChuyenService,
    private bienBanHaoDoiDieuChuyenService: BienBanHaoDoiDieuChuyenService,
    private danhMucDinhMucHaoHutService: DanhMucDinhMucHaoHutService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanHaoDoiDieuChuyenService);

    this.formData = this.fb.group(
      {
        id: [],
        nam: [dayjs().get("year"), [Validators.required]],
        maDvi: ['', [Validators.required]],
        maQhns: ['', [Validators.required]],
        soBienBan: [],
        ngayLap: ['', [Validators.required]],
        qdinhDccId: ['', [Validators.required]],
        soQdinhDcc: ['', [Validators.required]],
        ngayKyQdDcc: ['', [Validators.required]],
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
        tongSlNhap: [],
        tongSlXuatTheoQd: [],
        ngayKetThucXuatQd: [],
        tongSlXuatTheoTt: [],
        ngayKetThucXuatTt: [],
        slHaoTt: [0],
        tiLeHaoTt: [0],
        slHaoVuotDm: [0],
        tiLeHaoVuotDm: [0],

        ngayKtNhap: [],
        tongSlXuat: [0],
        ngayKtXuat: [],
        slHaoThucTe: [0],
        tiLeHaoThucTe: [0],
        slHaoThanhLy: [0],
        tiLeHaoThanhLy: [0],
        // slHaoVuotDm: [],
        slHaoDuoiDm: [0],
        tiLeHaoDuoiDm: [0],
        dinhMucHaoHut: [],
        sLHaoHutTheoDm: [0],
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

        soBbTinhKho: ['', [Validators.required]],
        bbtinhKhoId: ['', [Validators.required]],
        trangThai: [STATUS.DU_THAO],
        tenTrangThai: ['Dự Thảo'],
        lyDoTuChoi: [],
        diaChiDvi: [],
        tenDvi: ['', [Validators.required]],
        loaiVthh: ['', [Validators.required]],
        cloaiVthh: ['', [Validators.required]],
        tenLoaiVthh: ['', [Validators.required]],
        tenCloaiVthh: ['', [Validators.required]],
        soPhieuKtChatLuong: [],
        donViTinh: ['', [Validators.required]],
        keHoachDcDtlId: [, [Validators.required]],
        // fileDinhKems: [new Array<FileDinhKem>()],
        ngayBatDauXuat: [, Validators.required],
        ngayKetThucXuat: [, Validators.required],
        soThangBaoQuanHang: []
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
          this.formData.patchValue({
            soBienBan: this.genSoBBHaoDoi(data.id), tenNganLoKho: data.tenLoKho ? `${data.tenLoKho} - ${data.tenNganKho}` : data.tenNganKho,
            ngayKtNhap: data.thongTinHaoHut[0]?.ngayBatDau,
            ngayKetThucXuatTt: data.thongTinHaoHut[0]?.ngayKetThuc,
            soThangBaoQuanHang: data.thongTinHaoHut[0]?.soThangBaoQuan,
            tongSlNhap: data.thongTinHaoHut[0]?.slBaoQuan,
            dinhMucHaoHut: data.thongTinHaoHut[0]?.dinhMucHaoHut,
            slHao: data.thongTinHaoHut[0]?.slHao
          }),
            this.loadSoBbTinhKho()
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
      // this.loadSoBbTinhKho();
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

      soBbTinhKho: '',
      bbtinhKhoId: '',
      soPhieuKtChatLuong: '',
      donViTinh: '',

      tongSlXuatTheoQd: 0,
      tonKhoBanDau: 0,
      slConLaiTheoSs: 0,
      tongSlXuatTheoTt: 0,
      danhSachBangKe: [],
      thongTinHaoHut: [],
      ngayBatDauXuat: '',
      keHoachDcDtlId: null,
      ngayKetThucXuatQd: '',
      ngayKetThucXuatTt: '',
      slHaoTt: 0,
      tiLeHaoTt: 0,
      slHaoVuotDm: 0,
      tiLeHaoVuotDm: 0,

      ngayKtNhap: '',
      tongSlXuat: 0,
      ngayKtXuat: '',
      slHaoThucTe: 0,
      tiLeHaoThucTe: 0,
      slHaoThanhLy: 0,
      tiLeHaoThanhLy: 0,
      slHaoDuoiDm: 0,
      tiLeHaoDuoiDm: 0,
      dinhMucHaoHut: '',
      sLHaoHutTheoDm: 0,

    })
  }
  async loadSoBbTinhKho() {
    this.listBbTinhKho = [];
    let body = {
      trangThai: STATUS.DA_DUYET_LDCC,
      loaiDc: this.loaiDc, isVatTu: this.isVatTu, thayDoiThuKho: this.thayDoiThuKho, type: this.type, typeQd: this.typeQd,
      // maLoKho: this.formData.value.maLoKho,
      soQdinhDcc: this.formData.value.soQdinhDcc,
      // maNganKho: this.formData.value.maNganKho,
      maDvi: this.formData.value.maDvi,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0
      },
    }
    let res = await this.bienBanTinhKhoDieuChuyenService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = Array.isArray(res.data.content) ? res.data.content : [];
      const dataBienBanTinhKho = data.find(item => (item.maDiemKho == this.formData.value.maDiemKho && item.maNhaKho == this.formData.value.maNhaKho && item.maNganKho == this.formData.value.maNganKho && ((!item.maLoKho && !this.formData.value.maLoKho) || (item.maLoKho && item.maLoKho == this.formData.value.maLoKho))));
      if (dataBienBanTinhKho) {
        this.formData.patchValue({ bbtinhKhoId: dataBienBanTinhKho.id });
        this.getChiTietBBTK(dataBienBanTinhKho.id)
      }
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
        dataHeader: ['Số quyết định', 'Ngày quyết định'],
        dataColumn: ['soQdinh', 'ngayKyQdinh'],
      },
    })
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.resetData()
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
        // if (this.formData.value.qdinhDccId) {
        //   this.getThongTinPhieuXuatKho();
        // }
        if (data.maDvi === this.userInfo.MA_DVI && Array.isArray(data?.danhSachQuyetDinh)) {
          data.danhSachQuyetDinh.forEach(element => {
            if (Array.isArray(element?.dcnbKeHoachDcHdr?.danhSachHangHoa)) {
              element.dcnbKeHoachDcHdr.danhSachHangHoa.forEach(item => {
                // if (dataChiCuc.findIndex(f => ((!f.maLoKho && !item.maLoKho && item.maNganKho && f.maNganKho === item.maNganKho) || (f.maLoKho && f.maLoKho === item.maLoKho))) < 0) {
                //   dataChiCuc.push(item)
                // }
                if (item.thayDoiThuKho === this.thayDoiThuKho) {
                  dataChiCuc.push(item)
                }
              });
            }
          });
        }
        this.listDiaDiemNhap = dataChiCuc.map(f => ({ ...f, noiNhan: `${f.tenDiemKhoNhan || ""} - ${f.tenNhaKhoNhan || ""} - ${f.tenNganKhoNhan || ""} ${f.tenLoKhoNhan ? "- " + f.tenLoKhoNhan : ""}` }));
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
      nzWidth: '1200px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDiaDiemNhap,
        dataHeader: ['Điểm kho xuất', 'Nhà kho xuất', 'Ngăn kho xuất', 'Lô kho xuất', "Nơi nhận"],
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho', 'noiNhan']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.resetData();
        this.bindingDataDdNhap(data);
      }
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
        // soPhieuKnCl: data.soPhieu,
        loaiVthh: data.loaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        moTaHangHoa: data.moTaHangHoa,
        tenNganLoKho: data.tenLoKho ? `${data.tenLoKho} - ${data.tenNganKho}` : data.tenNganKho,
        donViTinh: data.donViTinh,
        keHoachDcDtlId: data.id
      })
      // this.listBbTinhKho = this.listBbTinhKho.filter(item => (item.maDiemKho == data.maDiemKho));
      this.loadSoBbTinhKho();
      this.loadDSPhieuKNCluong(data);
      if (this.formData.value.qdinhDccId) {
        await this.getThongTinPhieuXuatKho();
        this.getChiTietNganLoKho()
      }
    }
  }
  async getDinhMucHaoHut(cloaiVthh: string, loaiVthh: string, soThangBaoQuanHang: number) {
    const body = {
      loaiVthh, cloaiVthh
    }
    let hinhThucBq = [];
    let loaiHinhBq = [];
    let phuongPhapBq = [];
    const [resDmh, resDmhh] = await Promise.all([this.danhMucService.loadDanhMucHangChiTiet(cloaiVthh || loaiVthh), this.danhMucDinhMucHaoHutService.search(body)]);
    if (resDmh.msg === MESSAGE.SUCCESS) {
      hinhThucBq = Array.isArray(resDmh.data?.hinhThucBq) ? resDmh.data?.hinhThucBq : [];
      loaiHinhBq = Array.isArray(resDmh.data?.loaiHinhBq) ? resDmh.data?.loaiHinhBq : [];
      phuongPhapBq = Array.isArray(resDmh.data?.phuongPhapBq) ? resDmh.data?.phuongPhapBq : [];
    }
    if (resDmhh.msg === MESSAGE.SUCCESS) {
      const data = Array.isArray(resDmhh.data?.content) ? resDmhh.data.content : [];
      const listDmhh = data.filter(f => {
        return hinhThucBq.some(item => f.hinhThucBq.split(",").includes(item.ma)) &&
          loaiHinhBq.some(item => f.loaiHinhBq.split(",").includes(item.ma)) &&
          phuongPhapBq.some(item => f.phuongThucBq.split(",").includes(item.ma)) &&
          f.apDungTai.split(",").includes(this.userInfo.MA_DVI.slice(0, -2));
      })
      let dataDmhh = listDmhh.find(f => {
        if (soThangBaoQuanHang <= 3) {
          return f.tgBaoQuanDen === 3
        } else if (soThangBaoQuanHang > 3 && soThangBaoQuanHang <= 18) {
          return soThangBaoQuanHang > f.tgBaoQuanTu && soThangBaoQuanHang <= f.tgBaoQuanDen
        } else {
          return f.tgBaoQuanTu === 18
        }
      })?.dinhMuc || 0;
      let dinhMucHaoHut = 0;
      if (soThangBaoQuanHang > 18) {
        dinhMucHaoHut = (listDmhh.find(f => f.tgBaoQuanDen === 18)?.dinhMuc || 0) + (Math.ceil(soThangBaoQuanHang) - 18) * dataDmhh
      } else {
        dinhMucHaoHut = dataDmhh
      }
      this.formData.patchValue({ dinhMucHaoHut })
    }
  }
  async getChiTietNganLoKho() {
    const maNganLo = this.formData.value.maLoKho || this.formData.value.maNganKho;
    const ngayKetThucXuatTt = this.formData.value.ngayKetThucXuatTt;
    let ngayKtNhap = "";
    if (maNganLo) {
      const res = await this.mangLuoiKhoService.getDetailByMa({ maDvi: maNganLo });
      if (res.msg === MESSAGE.SUCCESS) {
        ngayKtNhap = res.data?.object?.ngayNhapDay;
      }
    }
    const soThangBaoQuanHang = ngayKtNhap && ngayKetThucXuatTt ? +dayjs(dayjs(ngayKetThucXuatTt, "DD/MM/YYYY").format("YYYY-MM-DD")).diff(dayjs(ngayKtNhap, "DD/MM/YYYY").format("YYYY-MM-DD"), 'month', true).toFixed(1) : null;
    await this.getDinhMucHaoHut(this.formData.value.cloaiVthh, this.formData.value.loaiVthh, soThangBaoQuanHang);
    const sLHao = this.formData.value.tongSlNhap * this.formData.value.dinhMucHaoHut / 100;
    const slHaoTt = this.formData.value.slConLaiTheoSs - this.formData.value.slConLaiTheoTt;
    const tiLeHaoTt = this.formData.value.tongSlNhap ? slHaoTt * 100 / this.formData.value.tongSlNhap : '';
    const slHaoThanhLy = sLHao;
    const tiLeHaoThanhLy = this.formData.value.tongSlNhap ? slHaoThanhLy * 100 / this.formData.value.tongSlNhap : '';
    const slHaoVuotDm = slHaoTt - sLHao > 0 ? slHaoTt - sLHao : '';
    const tiLeHaoVuotDm = this.formData.value.tongSlNhap && slHaoVuotDm ? slHaoVuotDm * 100 / this.formData.value.tongSlNhap : '';
    const slHaoDuoiDm = sLHao - slHaoTt > 0 ? sLHao - slHaoTt : '';
    const tiLeHaoDuoiDm = this.formData.value.tongSlNhap && slHaoDuoiDm ? slHaoDuoiDm * 100 / this.formData.value.tongSlNhap : '';
    this.formData.patchValue({
      soThangBaoQuanHang, sLHao, slHaoTt, tiLeHaoTt, slHaoThanhLy, tiLeHaoThanhLy, slHaoVuotDm, tiLeHaoVuotDm, slHaoDuoiDm, tiLeHaoDuoiDm,
    })
  }

  // async onSelectSoBbTinhKho(id: number): Promise<void> {
  //   this.listPhieuXuatKho = [];
  //   if (id) {
  //     this.getChiTietBBTK(id)
  //   }
  // };

  async loadDSPhieuKNCluong(data) {
    let body = {
      loaiDc: this.loaiDc,
      soQdinhDcc: this.formData.value.soQdinhDcc,
      isVatTu: this.isVatTu,
      thayDoiThuKho: this.thayDoiThuKho,
      type: this.type,
      typeQd: this.typeQd,
      // maNganKho: this.formData.value.maNganKho,
      // maLoKho: this.formData.value.maLoKho,
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
      this.formData.patchValue({
        soBbTinhKho: res.data.soBbTinhKho, tongSlXuatTheoQd: tongSlXuatTheoQd, tongSlXuatTheoTt: tongSlXuatTheoTt,
        ngayBatDauXuat: res.data.ngayBatDauXuat, ngayKetThucXuat: res.data.ngayKetThucXuat, ngayBatDauXuatTt: res.data.ngayBatDauXuat,
        ngayKetThucXuatTt: res.data.ngayKetThucXuat, donViTinh: res.data.donViTinh, slConLaiTheoSs, slConLaiTheoTt, tongSlNhap: res.data.tonKhoBanDau
      })
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
    body.thongTinHaoHut = [{
      ngayBatDau: this.formData.value.ngayKtNhap,
      ngayKetThuc: this.formData.value.ngayKetThucXuatTt,
      soThangBaoQuan: this.formData.value.soThangBaoQuanHang,
      slBaoQuan: this.formData.value.tongSlNhap,
      dinhMucHaoHut: this.formData.value.dinhMucHaoHut,
      slHao: this.formData.value.slHao
    }]
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
    let MSG = '';
    switch (this.formData.value.trangThai) {
      case STATUS.TU_CHOI_LDCC:
      case STATUS.TU_CHOI_KT:
      case STATUS.TU_CHOI_KTVBQ:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_KTVBQ;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        MSG = MESSAGE.GUI_DUYET_SUCCESS;
        break;
      }
      case STATUS.CHO_DUYET_KTVBQ: {
        trangThai = STATUS.CHO_DUYET_KT;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        MSG = MESSAGE.DUYET_SUCCESS;
        break;
      }
      case STATUS.CHO_DUYET_KT: {
        trangThai = STATUS.CHO_DUYET_LDCC;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        MSG = MESSAGE.DUYET_SUCCESS;
        break;
      }
      case STATUS.CHO_DUYET_LDCC: {
        trangThai = STATUS.DA_DUYET_LDCC;
        msg = MESSAGE.GUI_DUYET_CONFIRM;
        MSG = MESSAGE.PHE_DUYET_SUCCESS;
        break;
      }
    }
    this.approve(this.formData.value.id, trangThai, msg, null, MSG);
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
}
