import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {NzModalService} from 'ng-zorro-antd/modal';
import {Base2Component} from 'src/app/components/base2/base2.component';
import dayjs from 'dayjs';
import {FileDinhKem} from 'src/app/models/FileDinhKem';
import {MESSAGE} from 'src/app/constants/message';
import {STATUS} from 'src/app/constants/status';
import {
  DialogTableSelectionComponent
} from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import {Validators} from '@angular/forms';
import {
  QuyetDinhGiaoNvXuatHangService
} from "src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/quyetdinh-nhiemvu-xuathang/quyet-dinh-giao-nv-xuat-hang.service";
import {
  BienBanHaoDoiService
} from "src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/xuat-kho/BienBanHaoDoi.service";
import {
  BienBanTinhKhoService
} from "src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/xuat-kho/BienBanTinhKho.service";
import {MangLuoiKhoService} from "../../../../../../services/qlnv-kho/mangLuoiKho.service";
import {DanhMucDinhMucHaoHutService} from "../../../../../../services/danh-muc-dinh-muc-hao-hut.service";
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {LOAI_HANG_DTQG} from "../../../../../../constants/config";

@Component({
  selector: 'app-bdg-them-moi-bien-ban-hao-doi',
  templateUrl: './them-moi-bien-ban-hao-doi.component.html',
  styleUrls: ['./them-moi-bien-ban-hao-doi.component.scss']
})
export class ThemMoiBienBanHaoDoiComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() isView: boolean;
  @Input() idInput: number;
  @Input() isViewOnModal: boolean;
  @Input() checkPrice: any;
  @Output() showListEvent = new EventEmitter<any>();
  maTuSinh: number;
  maHauTo: any;
  flagInit: Boolean = false;
  dataQuyetDinh: any[] = [];
  listDanhSachHaoDoi: any[] = [];
  danhSachTinhKho: any[] = [];
  idXuatKho: number = 0;
  isViewXuatKho: boolean = false;
  idBangKe: number = 0;
  isViewBangKe: boolean = false;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhGiaoNhiemVuXuatHangService: QuyetDinhGiaoNvXuatHangService,
    private bienBanTinhKhoService: BienBanTinhKhoService,
    private bienBanHaoDoiService: BienBanHaoDoiService,
    private mangLuoiKhoService: MangLuoiKhoService,
    private danhMucDinhMucHaoHutService: DanhMucDinhMucHaoHutService,
    private danhMucService: DanhMucService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanHaoDoiService);
    this.formData = this.fb.group(
      {
        id: [],
        nam: [dayjs().get('year'), [Validators.required]],
        maDvi: [''],
        maQhNs: [''],
        soBbHaoDoi: [''],
        ngayLapBienBan: [''],
        idQdNv: [],
        soQdNv: [''],
        ngayKyQdNv: [''],
        thoiGianGiaoNhan: [''],
        idQdNvDtl: [],
        idHopDong: [],
        soHopDong: [''],
        ngayKyHopDong: [''],
        idBbTinhKho: [],
        soBbTinhKho: [''],
        ngayLapBbTinhKho: [''],
        idKho: [],
        maDiemKho: [''],
        diaDiemKho: [''],
        maNhaKho: [''],
        maNganKho: [''],
        maLoKho: [''],
        loaiHinhKho: [''],
        loaiVthh: [''],
        cloaiVthh: [''],
        tenHangHoa: [''],
        donViTinh: [''],
        ngayBatDauXuat: [''],
        ngayKetThucXuat: [''],
        idThuKho: [],
        idKtvBaoQuan: [],
        idKeToan: [],
        idLanhDaoChiCuc: [],
        tongSlNhap: [],
        thoiGianKthucNhap: [''],
        tongSlXuat: [''],
        thoiGianKthucXuat: [''],
        slHaoThucTe: [],
        tileHaoThucTe: [],
        slHaoVuotMuc: [],
        tileHaoVuotMuc: [],
        slHaoThanhLy: [],
        tileHaoThanhLy: [],
        slHaoDuoiMuc: [],
        tileHaoDuoiMuc: [],
        dinhMucHaoHut: [],
        slHaoTheoDinhMuc: [],
        nguyenNhan: [''],
        kienNghi: [''],
        ghiChu: [''],
        idPhieuKiemNghiem: [],
        soPhieuKiemNghiem: [''],
        ngayKiemNghiemMau: [''],
        trangThai: [''],
        lyDoTuChoi: [''],
        tenDvi: [''],
        tenDiemKho: [''],
        tenNhaKho: [''],
        tenNganKho: [''],
        tenLoKho: [''],
        tenNganLoKho: [''],
        tenLoaiVthh: [''],
        tenCloaiVthh: [''],
        tenThuKho: [''],
        tenKtvBaoQuan: [''],
        tenKeToan: [''],
        tenLanhDaoChiCuc: [''],
        tenTrangThai: [''],
        fileDinhKem: [new Array<FileDinhKem>()],
      }
    );
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      this.maHauTo = '-BBHD';
      if (this.idInput > 0) {
        await this.getDetail(this.idInput);
      } else {
        await this.initForm();
      }
    } catch (error) {
      console.error('error: ', error);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
      this.flagInit = true;
    }
  }

  async initForm() {
    this.maTuSinh = await this.userService.getId('XH_DG_BB_HAO_DOI_HDR_SEQ')
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI,
      maQhNs: this.userInfo.DON_VI.maQhns,
      soBbHaoDoi: `${this.maTuSinh}/${this.formData.get('nam').value}${this.maHauTo}`,
      ngayLapBienBan: dayjs().format('YYYY-MM-DD'),
      tenThuKho: this.userInfo.TEN_DAY_DU,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự Thảo',
    })
  }

  async onChangeNam(event) {
    if (event) {
      this.formData.patchValue({
        soBbHaoDoi: `${this.maTuSinh}/${event}${this.maHauTo}`,
      });
    }
  }

  async getDetail(id: number) {
    if (!id) return;
    const data = await this.detail(id);
    this.maTuSinh = this.idInput;
    this.dataTable = data.children
    if (!this.isView) {
      await this.onChange(data.idQdNv)
    }
  }

  async openDialog() {
    try {
      await this.spinner.show();
      let body = {
        loaiVthh: this.loaiVthh,
        nam: this.formData.value.nam,
        trangThai: STATUS.BAN_HANH
      }
      const res = await this.quyetDinhGiaoNhiemVuXuatHangService.search(body)
      if (res && res.msg === MESSAGE.SUCCESS) {
        this.dataQuyetDinh = res.data.content.filter(item => item.children.some(child => child.maDvi === this.userInfo.MA_DVI));
      }
      const modalQD = this.modal.create({
        nzTitle: 'DANH SÁCH QUYẾT ĐỊNH GIAO NHIỆM VỤ XUẤT HÀNG',
        nzContent: DialogTableSelectionComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          dataTable: this.dataQuyetDinh,
          dataHeader: ['Số quyết định giao nhiệm vụ', 'Ngày ký', 'Loại hàng hóa'],
          dataColumn: ['soQdNv', 'ngayKy', 'tenLoaiVthh']
        },
      });
      modalQD.afterClose.subscribe(async (data) => {
        if (data) {
          await this.onChange(data.id);
        }
      });
    } catch (e) {
      console.error('Error: ', e);
    } finally {
      await this.spinner.hide();
    }
  }

  async changeSoQdNv(event) {
    if (this.flagInit && event && event !== this.formData.value.soQdNv) {
      this.formData.patchValue({
        thoiGianGiaoNhan: null,
        idQdNvDtl: null,
        idHopDong: null,
        soHopDong: null,
        ngayKyHopDong: null,
        idBbTinhKho: null,
        soBbTinhKho: null,
        ngayLapBbTinhKho: null,
        idKho: null,
        maDiemKho: null,
        tenDiemKho: null,
        diaDiemKho: null,
        maNhaKho: null,
        tenNhaKho: null,
        maNganKho: null,
        tenNganKho: null,
        maLoKho: null,
        tenLoKho: null,
        tenNganLoKho: null,
        loaiHinhKho: null,
        loaiVthh: null,
        tenLoaiVthh: null,
        cloaiVthh: null,
        tenCloaiVthh: null,
        tenHangHoa: null,
        donViTinh: null,
        ngayBatDauXuat: null,
        ngayKetThucXuat: null,
        tongSlNhap: null,
        thoiGianKthucNhap: null,
        tongSlXuat: null,
        thoiGianKthucXuat: null,
        slHaoThucTe: null,
        tileHaoThucTe: null,
        slHaoVuotMuc: null,
        tileHaoVuotMuc: null,
        slHaoThanhLy: null,
        tileHaoThanhLy: null,
        slHaoDuoiMuc: null,
        tileHaoDuoiMuc: null,
        // dinhMucHaoHut: null,
        slHaoTheoDinhMuc: null,
        idPhieuKiemNghiem: null,
        soPhieuKiemNghiem: null,
        ngayKiemNghiemMau: null,
      })
      this.dataTable = [];
    }
  }

  async onChange(id) {
    if (id <= 0) return;
    try {
      await this.spinner.show();
      const res = await this.quyetDinhGiaoNhiemVuXuatHangService.getDetail(id);
      if (res.msg !== MESSAGE.SUCCESS || !res.data) {
        return;
      }
      const data = res.data;
      this.formData.patchValue({
        nam: data.nam,
        idQdNv: data.id,
        soQdNv: data.soQdNv,
        ngayKyQdNv: data.ngayKy,
        idHopDong: data.idHopDong,
        soHopDong: data.soHopDong,
        ngayKyHopDong: data.ngayKyHopDong,
        loaiVthh: data.loaiVthh,
      });
      await this.loadDanhSachHaoDoi(data.soQdNv)
    } catch (e) {
      console.error('Error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async loadDanhSachHaoDoi(event) {
    let body = {
      nam: this.formData.value.nam,
      loaiVthh: this.loaiVthh,
      soQdNv: event
    }
    const res = await this.bienBanHaoDoiService.search(body)
    if (res.msg !== MESSAGE.SUCCESS) {
      this.notification.error(MESSAGE.ERROR, res.msg);
      return;
    }
    const data = res.data.content;
    if (!data || data.length === 0) {
      return;
    }
    this.listDanhSachHaoDoi = data;
  }

  async openDialogTinhKho() {
    try {
      await this.spinner.show();
      let body = {
        nam: this.formData.value.nam,
        soQdNv: this.formData.value.soQdNv,
        loaiVthh: this.formData.value.loaiVthh,
        trangThai: STATUS.DA_DUYET_LDCC,
      }
      const res = await this.bienBanTinhKhoService.search(body)
      if (res && res.msg === MESSAGE.SUCCESS) {
        const tinhKhoSet = new Set(this.listDanhSachHaoDoi.map(item => item.soBbTinhKho));
        this.danhSachTinhKho = res.data.content.filter(item => !tinhKhoSet.has(item.soBbTinhKho))
      }
      const modalQD = this.modal.create({
        nzTitle: 'DANH SÁCH BIÊN BẢN TỊNH KHO',
        nzContent: DialogTableSelectionComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          dataTable: this.danhSachTinhKho.filter(item => item.maDvi === this.userInfo.MA_DVI),
          dataHeader: ['Số biên bản tịnh kho', 'Ngày lập biên bản', 'Loại vật tư hàng háo'],
          dataColumn: ['soBbTinhKho', 'ngayLapBienBan', 'tenLoaiVthh'],
        },
      });
      modalQD.afterClose.subscribe(async (data) => {
        if (data) {
          await this.onChangeBienBanTinhKho(data.id);
        }
      });
    } catch (e) {
      console.error('Error: ', e);
    } finally {
      await this.spinner.hide();
    }
  }

  async changeBbTinhKho(event) {
    if (this.flagInit && event && event !== this.formData.value.soBbTinhKho) {
      this.formData.patchValue({
        idKho: null,
        maDiemKho: null,
        tenDiemKho: null,
        diaDiemKho: null,
        maNhaKho: null,
        tenNhaKho: null,
        maNganKho: null,
        tenNganKho: null,
        maLoKho: null,
        tenLoKho: null,
        tenNganLoKho: null,
        loaiHinhKho: null,
        loaiVthh: null,
        tenLoaiVthh: null,
        cloaiVthh: null,
        tenCloaiVthh: null,
        tenHangHoa: null,
        donViTinh: null,
        ngayBatDauXuat: null,
        ngayKetThucXuat: null,
        tongSlNhap: null,
        thoiGianKthucNhap: null,
        tongSlXuat: null,
        thoiGianKthucXuat: null,
        slHaoThucTe: null,
        tileHaoThucTe: null,
        slHaoVuotMuc: null,
        tileHaoVuotMuc: null,
        slHaoThanhLy: null,
        tileHaoThanhLy: null,
        slHaoDuoiMuc: null,
        tileHaoDuoiMuc: null,
        // dinhMucHaoHut: null,
        slHaoTheoDinhMuc: null,
        idPhieuKiemNghiem: null,
        soPhieuKiemNghiem: null,
        ngayKiemNghiemMau: null,
      })
      this.dataTable = [];
    }
  }

  async onChangeBienBanTinhKho(id) {
    if (id <= 0) return;
    try {
      const res = await this.bienBanTinhKhoService.getDetail(id);
      if (res.msg === MESSAGE.SUCCESS || res.data) {
        const data = res.data;
        let thoiGianKthucNhap = "";
        if (data.maLoKho || data.maNganKho) {
          const resMlk = await this.mangLuoiKhoService.getDetailByMa({maDvi: data.maLoKho || data.maNganKho});
          if (resMlk.data?.object?.ngayNhapDay) {
            thoiGianKthucNhap = resMlk.data?.object?.ngayNhapDay;
          }
        }
        const soThangBaoQuanHang = data.ngayKetThucXuat && thoiGianKthucNhap ? +dayjs(dayjs(data.ngayKetThucXuat, "DD/MM/YYYY").format("YYYY-MM-DD")).diff(dayjs(thoiGianKthucNhap, "DD/MM/YYYY").format("YYYY-MM-DD"), 'month', true).toFixed(1) : null;
        if (data.cloaiVthh || data.loaiVthh) {
          await this.getDinhMucHaoHut(data.cloaiVthh, data.loaiVthh, soThangBaoQuanHang);
        }
        const tongSlNhap = data.tongSlNhap || 0;
        const tongSlXuat = data.tongSlXuat || 0;
        const slHaoThucTe = tongSlNhap - tongSlXuat;
        const tileHaoThucTe = (slHaoThucTe / tongSlNhap) * 100;
        const slHaoTheoDinhMuc = data.tongSlNhap ? (data.tongSlNhap * this.formData.value.dinhMucHaoHut) / 100 : 0;
        const slHaoVuotMuc = Math.max(slHaoThucTe - slHaoTheoDinhMuc, 0);
        const tileHaoVuotMuc = data.tongSlNhap ? (slHaoVuotMuc * 100) / data.tongSlNhap : '';
        const slHaoThanhLy = slHaoTheoDinhMuc;
        const tiLeHaoThanhLy = data.tongSlNhap ? (slHaoThanhLy * 100) / data.tongSlNhap : '';
        const slHaoDuoiMuc = Math.max(slHaoTheoDinhMuc - slHaoThucTe, 0);
        const tileHaoDuoiMuc = data.tongSlNhap ? (slHaoDuoiMuc * 100) / data.tongSlNhap : '';
        this.formData.patchValue({
          idKho: data.idKho,
          idQdNvDtl: data.idQdNvDtl,
          thoiGianGiaoNhan: data.thoiGianGiaoNhan,
          idBbTinhKho: data.id,
          soBbTinhKho: data.soBbTinhKho,
          ngayLapBbTinhKho: data.ngayLapBienBan,
          maDiemKho: data.maDiemKho,
          tenDiemKho: data.tenDiemKho,
          diaDiemKho: data.diaDiemKho,
          maNhaKho: data.maNhaKho,
          tenNhaKho: data.tenNhaKho,
          maNganKho: data.maNganKho,
          tenNganKho: data.tenNganKho,
          maLoKho: data.maLoKho,
          tenLoKho: data.tenLoKho,
          tenNganLoKho: data.tenLoKho ? data.tenLoKho + ' - ' + data.tenNganKho : data.tenNganKho,
          loaiHinhKho: data.loaiHinhKho,
          loaiVthh: data.loaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          cloaiVthh: data.cloaiVthh,
          tenCloaiVthh: data.tenCloaiVthh,
          tenHangHoa: data.tenHangHoa,
          donViTinh: data.donViTinh,
          ngayBatDauXuat: data.ngayBatDauXuat,
          ngayKetThucXuat: data.ngayKetThucXuat,
          idPhieuKiemNghiem: data.idPhieuKiemNghiem,
          soPhieuKiemNghiem: data.soPhieuKiemNghiem,
          ngayKiemNghiemMau: data.ngayKiemNghiemMau,
          tongSlNhap: tongSlNhap,
          thoiGianKthucNhap: thoiGianKthucNhap,
          tongSlXuat: tongSlXuat,
          thoiGianKthucXuat: data.ngayKetThucXuat,
          slHaoThucTe: slHaoThucTe,
          tileHaoThucTe: tileHaoThucTe,
          slHaoTheoDinhMuc: slHaoTheoDinhMuc,
          slHaoVuotMuc: slHaoVuotMuc,
          tileHaoVuotMuc: tileHaoVuotMuc,
          slHaoThanhLy: slHaoThanhLy,
          tileHaoThanhLy: tiLeHaoThanhLy,
          slHaoDuoiMuc: slHaoDuoiMuc,
          tileHaoDuoiMuc: tileHaoDuoiMuc,
        })
        this.dataTable = data.children
      }
    } catch (e) {
      console.error('Error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async getDinhMucHaoHut(cloaiVthh: string, loaiVthh: string, soThangBaoQuanHang: number) {
    if (!soThangBaoQuanHang && ![0, "0"].includes(soThangBaoQuanHang)) {
      return;
    }
    let listQuyetDinhDmhh = [];
    let hinhThucBaoQuan = [];
    let loaiHinhBaoQuan = [];
    let phuongPhapBaoQuan = [];
    const resDmhh = await this.danhMucDinhMucHaoHutService.search({loaiVthh, cloaiVthh});
    if (resDmhh.msg === MESSAGE.SUCCESS && resDmhh.data.content) {
      listQuyetDinhDmhh = resDmhh.data.content.filter(f =>
        f.trangThai === STATUS.BAN_HANH && ((dayjs(f.ngayHieuLuc).isBefore(dayjs()) || dayjs(f.ngayHieuLuc).isSame(dayjs())) && (!f.ngayHetHieuLuc || dayjs().isBefore(dayjs(f.ngayHetHieuLuc))))).sort((a, b) => dayjs(b.ngayKy).valueOf() - dayjs(a.ngayKy).valueOf());
    }
    const idQdDmhh = listQuyetDinhDmhh[0]?.id;
    if (idQdDmhh > 0) {
      const [res, resDmh] = await Promise.all([
        this.danhMucDinhMucHaoHutService.getDetail(idQdDmhh),
        this.danhMucService.loadDanhMucHangChiTiet(cloaiVthh || loaiVthh)
      ]);
      hinhThucBaoQuan = Array.isArray(resDmh.data?.hinhThucBq) ? resDmh.data?.hinhThucBq : [];
      loaiHinhBaoQuan = Array.isArray(resDmh.data?.loaiHinhBq) ? resDmh.data?.loaiHinhBq : [];
      phuongPhapBaoQuan = Array.isArray(resDmh.data?.phuongPhapBq) ? resDmh.data?.phuongPhapBq : [];
      const data = Array.isArray(res.data?.details) ? res.data.details : [];
      const filteredListDmhh = data.filter(f =>
        hinhThucBaoQuan.some(item => f.hinhThucBq?.split(",").includes(item.ma)) &&
        loaiHinhBaoQuan.some(item => f.loaiHinhBq?.split(",").includes(item.ma)) &&
        phuongPhapBaoQuan.some(item => f.phuongThucBq?.split(",").includes(item.ma)) &&
        f.apDungTai.split(",").includes(this.userInfo.MA_DVI.slice(0, -2))
      ).sort((a, b) => a.tgBaoQuanTu - b.tgBaoQuanTu);
      const dinhMucHaoHut = Array.isArray(filteredListDmhh) && filteredListDmhh.length > 0 ? this.tinhDinhMucHaoHut(filteredListDmhh, soThangBaoQuanHang, loaiVthh) : "";
      this.formData.patchValue({dinhMucHaoHut: dinhMucHaoHut})
    }
  }

  tinhDinhMucHaoHut(dsDinhMuc: any[] = [], soThangBaoQuanHang: number, loaiVthh: string) {
    if (dsDinhMuc.length === 0) {
      return 0;
    }
    const minTgBaoQuanTu = Math.min(...dsDinhMuc.map(item => item.tgBaoQuanTu));
    const maxTgBaoQuanDen = Math.max(...dsDinhMuc.map(item => item.tgBaoQuanDen));
    switch (loaiVthh) {
      case LOAI_HANG_DTQG.GAO:
        if (soThangBaoQuanHang < minTgBaoQuanTu) {
          return dsDinhMuc.find(f => f.tgBaoQuanTu === minTgBaoQuanTu)?.dinhMuc || 0;
        } else if (soThangBaoQuanHang < maxTgBaoQuanDen) {
          return dsDinhMuc.find(f => soThangBaoQuanHang >= f.tgBaoQuanTu && soThangBaoQuanHang < f.tgBaoQuanDen)?.dinhMuc || 0;
        } else {
          return dsDinhMuc.find(f => f.tgBaoQuanTu === maxTgBaoQuanDen)?.dinhMuc || 0;
        }
      default:
        if (soThangBaoQuanHang <= minTgBaoQuanTu) {
          return dsDinhMuc.find(f => f.tgBaoQuanTu === minTgBaoQuanTu)?.dinhMuc || 0;
        } else if (soThangBaoQuanHang <= maxTgBaoQuanDen) {
          return dsDinhMuc.find(f => soThangBaoQuanHang > f.tgBaoQuanTu && soThangBaoQuanHang <= f.tgBaoQuanDen)?.dinhMuc || 0;
        } else {
          const dinhMuc = dsDinhMuc.find(f => f.tgBaoQuanDen === maxTgBaoQuanDen)?.dinhMuc || 0;
          const dinhMucThem = dsDinhMuc.find(f => f.tgBaoQuanTu === maxTgBaoQuanDen)?.dinhMuc || 0;
          return dinhMuc + Math.ceil((soThangBaoQuanHang - maxTgBaoQuanDen)) * dinhMucThem;
        }
    }
  }

  calcTong(column) {
    if (!this.dataTable) return 0;
    return this.dataTable.reduce((sum, cur) => sum + (cur[column] || 0), 0);
  }

  openModal(id: number, modalType: string) {
    if (modalType === 'xuatKho') {
      this.idXuatKho = id;
      this.isViewXuatKho = true;
    } else if (modalType === 'bangKe') {
      this.idBangKe = id;
      this.isViewBangKe = true;
    }
  }

  closeModal(modalType: string) {
    if (modalType === 'xuatKho') {
      this.idXuatKho = null;
      this.isViewXuatKho = false;
    } else if (modalType === 'bangKe') {
      this.idBangKe = null;
      this.isViewBangKe = false;
    }
  }

  async saveAndApproveAndReject(action: string, trangThai?: string, msg?: string, msgSuccess?: string) {
    try {
      if (this.checkPrice && this.checkPrice.boolean) {
        this.notification.error(MESSAGE.ERROR, this.checkPrice.msgSuccess);
        return;
      }
      if (this.checkPrice && this.checkPrice.booleanNhapXuat) {
        this.notification.error(MESSAGE.ERROR, this.checkPrice.msgNhapXuat);
        return;
      }
      await this.helperService.ignoreRequiredForm(this.formData);
      const body = {
        ...this.formData.value,
        children: this.dataTable,
      };
      switch (action) {
        case "createUpdate":
          this.formData.controls["soQdNv"].setValidators([Validators.required]);
          this.formData.controls["soBbTinhKho"].setValidators([Validators.required]);
          await this.createUpdate(body);
          break;
        case "saveAndSend":
          this.setValidForm();
          await this.saveAndSend(body, trangThai, msg, msgSuccess);
          break;
        case "approve":
          await this.approve(this.idInput, trangThai, msg);
          break;
        case "reject":
          await this.reject(this.idInput, trangThai);
          break;
        default:
          console.error("Invalid action: ", action);
          break;
      }
    } catch (error) {
      console.error('Error: ', error);
    } finally {
      await this.helperService.restoreRequiredForm(this.formData);
    }
  }

  setValidForm() {
    const requiredFields = [
      "soQdNv",
      "soBbTinhKho",
      "tenNganLoKho",
      "tenNhaKho",
      "tenDiemKho",
      "nguyenNhan",
      "kienNghi",
    ];
    requiredFields.forEach(fieldName => {
      this.formData.controls[fieldName].setValidators([Validators.required]);
      this.formData.controls[fieldName].updateValueAndValidity();
    });
  }
}
