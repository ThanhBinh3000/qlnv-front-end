import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as dayjs from 'dayjs';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {MESSAGE} from 'src/app/constants/message';
import {convertTienTobangChu} from 'src/app/shared/commonFunction';
import {Validators} from "@angular/forms";
import {STATUS, THONG_TIN_BAN_TRUC_TIEP, TRUC_TIEP} from "../../../../../../constants/status";
import {
  DialogTableSelectionComponent
} from "../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {
  PhieuXuatKhoBttService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/xuat-kho-btt/phieu-xuat-kho-btt.service';
import {
  QuyetDinhNvXuatBttService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/quyet-dinh-nv-xuat-btt/quyet-dinh-nv-xuat-btt.service';
import {
  BangCanKeHangBttService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/xuat-kho-btt/bang-can-ke-hang-btt.service';
import {DonviService} from 'src/app/services/donvi.service';
import {HopDongBttService} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/hop-dong-btt/hop-dong-btt.service';
import {LOAI_HANG_DTQG} from 'src/app/constants/config';
import {FileDinhKem} from "../../../../../../models/CuuTro";
import {AMOUNT_NO_DECIMAL, AMOUNT_THREE_DECIMAL} from "../../../../../../Utility/utils";
import _ from 'lodash';
import {chain} from 'lodash'

@Component({
  selector: 'app-them-moi-bang-ke-can-hang-btt',
  templateUrl: './them-moi-bang-ke-can-hang-btt.component.html',
  styleUrls: ['./them-moi-bang-ke-can-hang-btt.component.scss']
})
export class ThemMoiBangKeCanHangBttComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() isView: boolean;
  @Input() idInput: number;
  @Input() isViewOnModal: boolean;
  @Input() checkPrice: any;
  @Output() showListEvent = new EventEmitter<any>();
  dataTableChange = new EventEmitter<any>();
  LOAI_HANG_DTQG = LOAI_HANG_DTQG;
  amount = {...AMOUNT_NO_DECIMAL};
  amount1 = {...AMOUNT_THREE_DECIMAL}
  amountLeft = {...AMOUNT_THREE_DECIMAL, align: "left"};
  templateNameVt = "Bảng kê cân hàng vật tư";
  templateNameLt = "Bảng kê cân hàng lương thực";
  TRUC_TIEP = TRUC_TIEP;
  maTuSinh: number;
  maHauTo: any;
  flagInit: Boolean = false;
  danhSachQuyetDinh: any[] = [];
  listPhieuXuatKho: any[] = [];
  listDiaDiemXuat: any[] = [];
  loadDanhSachBangKeCan: any[] = [];
  rowItemCGD: any = {};
  rowItemKQC: any = {};
  listPhuongPhapCan: Array<{ label: string, value: string }> = [{
    label: 'Cân giám định',
    value: 'can_giam_dinh'
  }, {label: 'Cân toàn bộ', value: 'can_toan_bo'}]

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donViService: DonviService,
    private phieuXuatKhoBttService: PhieuXuatKhoBttService,
    private quyetDinhNvXuatBttService: QuyetDinhNvXuatBttService,
    private bangCanKeHangBttService: BangCanKeHangBttService,
    private hopDongBttService: HopDongBttService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bangCanKeHangBttService);
    this.formData = this.fb.group({
      id: [],
      namKh: [dayjs().get('year'), [Validators.required]],
      maDvi: [''],
      maQhNs: [''],
      soBangKeHang: [''],
      ngayLapBangKe: [''],
      idQdNv: [],
      soQdNv: [''],
      ngayKyQdNv: [''],
      idQdNvDtl: [],
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
      idPhieuXuatKho: [],
      soPhieuXuatKho: [''],
      ngayXuatKho: [''],
      tgianGiaoNhan: [''],
      idThuKho: [],
      idLanhDaoChiCuc: [],
      idPhieuKiemNghiem: [],
      soPhieuKiemNghiem: [''],
      ngayKiemNghiemMau: [''],
      tenNguoiGiao: [''],
      cmtNguoiGiao: [''],
      congTyNguoiGiao: [''],
      diaChiNguoiGiao: [''],
      idHopDong: [],
      soHopDong: [''],
      ngayKyHopDong: [''],
      soLuongHopDong: [],
      idBangKeBanLe: [],
      soBangKeBanLe: [''],
      ngayTaoBkeBanLe: [''],
      soLuongBkeBanLe: [],
      tongTrongLuongBi: [],
      tongTrongLuongCaBi: [],
      tongTrongTruBi: [],
      loaiHinhNx: [''],
      kieuNx: [''],
      pthucBanTrucTiep: [''],
      phanLoai: [''],
      trangThai: [''],
      nguoiGiamSat: [''],
      lyDoTuChoi: [''],
      tenDvi: [''],
      tenDiemKho: [''],
      tenNhaKho: [''],
      tenNganKho: [''],
      tenLoKho: [''],
      tenNganLoKho: [''],
      tenThuKho: [''],
      tenLanhDaoChiCuc: [''],
      tenLoaiVthh: [''],
      tenCloaiVthh: [''],
      tenLoaiHinhNx: [''],
      tenKieuNx: [''],
      tenTrangThai: [''],
      phuongPhapCan: [''],
      trongLuongMotBao: [],
      trongLuongBaoKcan: [],
      tongSlBaoBi: [],
      fileDinhKem: [new Array<FileDinhKem>()],
    })
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      this.maHauTo = '/BKCH-' + this.userInfo.DON_VI.tenVietTat;
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
    this.maTuSinh = await this.userService.getId('XH_BKE_CAN_HANG_BTT_HDR_SEQ')
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI,
      maQhNs: this.userInfo.DON_VI.maQhns,
      soBangKeHang: `${this.maTuSinh}/${this.formData.get('namKh').value}${this.maHauTo}`,
      ngayLapBangKe: dayjs().format('YYYY-MM-DD'),
      tenThuKho: this.userInfo.TEN_DAY_DU,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự Thảo',
      phanLoai: TRUC_TIEP.HOP_DONG,
      tongTrongLuongCaBi: 0,
      phuongPhapCan: this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU) ? 'can_toan_bo' : 'can_giam_dinh',
    })
  }

  async onChangeNam(event) {
    if (event) {
      this.formData.patchValue({
        soBangKeHang: `${this.maTuSinh}/${event}${this.maHauTo}`,
      });
    }
  }

  async getDetail(id: number) {
    if (!id) return;
    const data = await this.detail(id);
    this.maTuSinh = this.idInput;
    this.dataTableAll = data.children;
    this.dataTable = chain(this.dataTableAll).groupBy('loai').map((value, key) => ({
      loai: key,
      dataChild: value
    })).value();
    if (data.phuongPhapCan) {
      this.formData.patchValue({
        phuongPhapCan: data.phuongPhapCan.toString()
      });
    }
    if (!this.isView) {
      await this.onChange(data.idQdNv)
    }
  }

  async openDialog() {
    try {
      await this.spinner.show();
      let body = {
        loaiVthh: this.loaiVthh,
        namKh: this.formData.value.namKh,
        trangThai: STATUS.BAN_HANH
      }
      const res = await this.quyetDinhNvXuatBttService.search(body)
      if (res && res.msg === MESSAGE.SUCCESS) {
        this.danhSachQuyetDinh = res.data.content.filter(item => item.children.some(child => child.maDvi === this.userInfo.MA_DVI));
      }
      const modalQD = this.modal.create({
        nzTitle: 'DANH SÁCH QUYẾT ĐỊNH GIAO NHIỆM VỤ XUẤT HÀNG',
        nzContent: DialogTableSelectionComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          dataTable: this.danhSachQuyetDinh,
          dataHeader: ['Số quyết định giao nhiệm vụ', 'Ngày ký', 'Loại hàng hóa'],
          dataColumn: ['soQdNv', 'ngayKyQdNv', 'tenLoaiVthh']
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
        idQdNvDtl: null,
        idKho: null,
        maDiemKho: null,
        tenDiemKho: null,
        diaDiemKho: null,
        maNhaKho: null,
        tenNhaKho: null,
        maNganKho: null,
        tenNganKho: null,
        maLoKho: null,
        tenNganLoKho: null,
        loaiHinhKho: null,
        loaiVthh: null,
        cloaiVthh: null,
        tenHangHoa: null,
        donViTinh: null,
        idPhieuXuatKho: null,
        soPhieuXuatKho: null,
        ngayXuatKho: null,
        tgianGiaoNhan: null,
        idThuKho: null,
        idLanhDaoChiCuc: null,
        idPhieuKiemNghiem: null,
        soPhieuKiemNghiem: null,
        ngayKiemNghiemMau: null,
        tenNguoiGiao: null,
        cmtNguoiGiao: null,
        congTyNguoiGiao: null,
        diaChiNguoiGiao: null,
        idHopDong: null,
        soHopDong: null,
        ngayKyHopDong: null,
        soLuongHopDong: null,
        idBangKeBanLe: null,
        soBangKeBanLe: null,
        ngayTaoBkeBanLe: null,
        soLuongBkeBanLe: null,
        tongTrongLuongBi: null,
        tongTrongLuongCaBi: null,
        tongTrongTruBi: null,
        loaiHinhNx: null,
        kieuNx: null,
      });
      this.dataTable = [];
    }
  }

  async onChange(id) {
    if (id <= 0) {
      return;
    }
    try {
      await this.spinner.show();
      const res = await this.quyetDinhNvXuatBttService.getDetail(id);
      if (res.msg !== MESSAGE.SUCCESS || !res.data) {
        return;
      }
      const data = res.data;
      this.formData.patchValue({
        namKh: data.namKh,
        idQdNv: data.id,
        soQdNv: data.soQdNv,
        ngayKyQdNv: data.ngayKyQdNv,
        loaiVthh: data.loaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        tenHangHoa: data.tenHangHoa,
        donViTinh: data.donViTinh,
        loaiHinhNx: data.loaiHinhNx,
        kieuNx: data.kieuNx,
        pthucBanTrucTiep: data.pthucBanTrucTiep,
      });
      await this.loadBangKeCanHang(data.soQdNv)
      if ([THONG_TIN_BAN_TRUC_TIEP.CHAO_GIA, THONG_TIN_BAN_TRUC_TIEP.BAN_LE].includes(data.pthucBanTrucTiep)) {
        const dataChiCuc = data.children.find(item => item.maDvi === this.userInfo.MA_DVI);
        if (dataChiCuc && dataChiCuc.children && dataChiCuc.children.length > 0) {
          this.listDiaDiemXuat = dataChiCuc.children
        }
      }
      if ([THONG_TIN_BAN_TRUC_TIEP.UY_QUYEN].includes(data.pthucBanTrucTiep)) {
        this.listDiaDiemXuat = [];
        let body = {
          loaiVthh: this.loaiVthh,
          soQdNv: data.soQdNv,
          namHd: this.formData.value.namKh,
          trangThai: STATUS.DA_KY
        }
        const resHd = await this.hopDongBttService.search(body)
        if (resHd.msg === MESSAGE.SUCCESS && resHd.data.content) {
          const dataHopDong = resHd.data.content.filter(item => item.idQdNv === data.id && item.maDvi === this.userInfo.MA_DVI);
          if (dataHopDong) {
            const xhHopDongBttDviLists = dataHopDong.map((item) => item.xhHopDongBttDviList);
            const flattenedXhHopDongBttDviLists = xhHopDongBttDviLists.flat();
            this.listDiaDiemXuat.push(...flattenedXhHopDongBttDviLists);
          }
        }
      }
    } catch (e) {
      console.error('Error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async loadBangKeCanHang(event) {
    let body = {
      namKh: this.formData.value.namKh,
      loaiVthh: this.loaiVthh,
      soQdNv: event
    }
    const res = await this.bangCanKeHangBttService.search(body)
    if (res.msg !== MESSAGE.SUCCESS) {
      this.notification.error(MESSAGE.ERROR, res.msg);
      return;
    }
    const data = res.data.content;
    if (!data || data.length === 0) {
      return;
    }
    this.loadDanhSachBangKeCan = data;
  }

  async openDialogKho() {
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH ĐỊA ĐIỂM XUẤT HÀNG',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDiaDiemXuat,
        dataHeader: ['Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho'],
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          idKho: data.id,
          maDiemKho: data.maDiemKho,
          tenDiemKho: data.tenDiemKho,
          maNhaKho: data.maNhaKho,
          tenNhaKho: data.tenNhaKho,
          maNganKho: data.maNganKho,
          tenNganKho: data.tenNganKho,
          maLoKho: data.maLoKho,
          tenLoKho: data.tenLoKho,
          tenNganLoKho: data.tenLoKho ? data.tenLoKho + ' - ' + data.tenNganKho : data.tenNganKho
        });
        await this.loadDiaDiemKhoForItem(data);
      }
    });
  }

  async changeKho(event) {
    if (this.flagInit && event && event !== this.formData.value.maLoKho && this.formData.value.maNganKho) {
      this.formData.patchValue({
        idPhieuXuatKho: null,
        soPhieuXuatKho: null,
        ngayXuatKho: null,
        tgianGiaoNhan: null,
        idThuKho: null,
        idLanhDaoChiCuc: null,
        idPhieuKiemNghiem: null,
        soPhieuKiemNghiem: null,
        ngayKiemNghiemMau: null,
        tenNguoiGiao: null,
        cmtNguoiGiao: null,
        congTyNguoiGiao: null,
        diaChiNguoiGiao: null,
        idHopDong: null,
        soHopDong: null,
        ngayKyHopDong: null,
        soLuongHopDong: null,
        idBangKeBanLe: null,
        soBangKeBanLe: null,
        ngayTaoBkeBanLe: null,
        soLuongBkeBanLe: null,
        tongTrongLuongBi: null,
        tongTrongLuongCaBi: null,
        tongTrongTruBi: null,
      })
      this.dataTable = [];
    }
  }

  async loadDiaDiemKhoForItem(item) {
    const res = await this.donViService.getAll({
      trangThai: "01",
      maDviCha: this.userInfo.MA_DVI
    });
    if (res.msg !== MESSAGE.SUCCESS || !res.data) {
      return;
    }
    const diaDiemKho = res.data.find(s => s.maDvi === item.maDiemKho);
    if (diaDiemKho) {
      this.formData.patchValue({
        diaDiemKho: diaDiemKho.diaChi
      })
    }
  }

  async openDialogPhieuXuatKho() {
    try {
      await this.spinner.show();
      let body = {
        loaiVthh: this.loaiVthh,
        namKh: this.formData.value.namKh,
        trangThai: STATUS.DU_THAO,
        soQdNv: this.formData.value.soQdNv,
      }
      const res = await this.phieuXuatKhoBttService.search(body)
      if (res && res.msg === MESSAGE.SUCCESS) {
        const phieuXuatKhoSet = new Set(this.loadDanhSachBangKeCan.map(item => item.soPhieuXuatKho));
        this.listPhieuXuatKho = res.data.content.filter(item => !phieuXuatKhoSet.has(item.soPhieuXuatKho))
      }
      const formattedDataPhieuXuatKho = this.listPhieuXuatKho.map(item => ({
        soLuongXuat: item.thucXuat ? item.thucXuat.toLocaleString() : null,
        ...item
      }))
      const modalQD = this.modal.create({
        nzTitle: 'PHIẾU XUẤT KHO HÀNG DTQG',
        nzContent: DialogTableSelectionComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          dataTable: formattedDataPhieuXuatKho.filter(item => item.idKho === this.formData.value.idKho),
          dataHeader: ['Số Phiếu xuất kho', 'Ngày Lập Phiếu', 'Loại hàng hóa', 'Số lượng xuất kho'],
          dataColumn: ['soPhieuXuatKho', 'ngayLapPhieu', 'tenLoaiVthh', 'soLuongXuat']
        },
      });
      modalQD.afterClose.subscribe(async (data) => {
        if (data) {
          await this.onChangePhieuXuatKho(data.id);
        }
      });
    } catch (e) {
      console.error('Error: ', e);
    } finally {
      await this.spinner.hide();
    }
  }

  async changePhieuXuatKho(event) {
    if (this.flagInit && event && event !== this.formData.value.soPhieuXuatKho) {
      this.formData.patchValue({
        tgianGiaoNhan: null,
        idThuKho: null,
        idLanhDaoChiCuc: null,
        idPhieuKiemNghiem: null,
        soPhieuKiemNghiem: null,
        ngayKiemNghiemMau: null,
        tenNguoiGiao: null,
        cmtNguoiGiao: null,
        congTyNguoiGiao: null,
        diaChiNguoiGiao: null,
        idHopDong: null,
        soHopDong: null,
        ngayKyHopDong: null,
        soLuongHopDong: null,
        idBangKeBanLe: null,
        soBangKeBanLe: null,
        ngayTaoBkeBanLe: null,
        soLuongBkeBanLe: null,
        tongTrongLuongBi: null,
        tongTrongLuongCaBi: null,
        tongTrongTruBi: null,
      })
      this.dataTable = [];
    }
  }

  async onChangePhieuXuatKho(id) {
    if (id <= 0) {
      return;
    }
    try {
      const res = await this.phieuXuatKhoBttService.getDetail(id);
      if (res.msg !== MESSAGE.SUCCESS || !res.data) {
        return;
      }
      const data = res.data
      this.formData.patchValue({
        idQdNvDtl: data.idQdNvDtl,
        idPhieuXuatKho: data.id,
        soPhieuXuatKho: data.soPhieuXuatKho,
        ngayXuatKho: data.ngayLapPhieu,
        tgianGiaoNhan: data.tgianGiaoNhan,
        tenNguoiGiao: data.tenNguoiGiao,
        cmtNguoiGiao: data.cmtNguoiGiao,
        congTyNguoiGiao: data.congTyNguoiGiao,
        diaChiNguoiGiao: data.diaChiNguoiGiao,
        idPhieuKiemNghiem: data.idPhieuKiemNghiem,
        soPhieuKiemNghiem: data.soPhieuKiemNghiem,
        ngayKiemNghiemMau: data.ngayKiemNghiemMau,
        loaiHinhKho: data.loaiHinhKho,
        phanLoai: data.phanLoai,
        idHopDong: data.phanLoai === TRUC_TIEP.HOP_DONG ? data.idHopDong : null,
        soHopDong: data.phanLoai === TRUC_TIEP.HOP_DONG ? data.soHopDong : null,
        ngayKyHopDong: data.phanLoai === TRUC_TIEP.HOP_DONG ? data.ngayKyHopDong : null,
        soLuongHopDong: data.phanLoai == TRUC_TIEP.HOP_DONG ? data.soLuongHopDong : null,
        idBangKeBanLe: data.phanLoai === TRUC_TIEP.BAN_LE ? data.idBangKeBanLe : null,
        soBangKeBanLe: data.phanLoai === TRUC_TIEP.BAN_LE ? data.soBangKeBanLe : null,
        ngayTaoBkeBanLe: data.phanLoai === TRUC_TIEP.BAN_LE ? data.ngayTaoBkeBanLe : null,
        soLuongBkeBanLe: data.phanLoai === TRUC_TIEP.BAN_LE ? data.soLuongBkeBanLe : null,
      })
    } catch (e) {
      console.error('Error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }


  addRow(item, name) {
    if (this.validateThongTin(item, name)) {
      const data = {...item, loai: name, idVirtual: new Date().getTime()};
      this.dataTableAll.push(data);
      this.dataTable = _.chain(this.dataTableAll)
        .groupBy('loai').map((value, key) => ({loai: key, dataChild: value})).value();
      const resetItems = {
        CGD: 'rowItemCGD',
        KQC: 'rowItemKQC',
      };
      if (resetItems[name]) {
        this[resetItems[name]] = {};
      }
      this.calculatorTable();
    }
  }

  findTableName(name) {
    if (!this.dataTable) {
      return null;
    }
    return this.dataTable.find(({loai}) => loai === name) || null;
  }

  validateThongTin(data, name) {
    const requirements = {
      CGD: this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU) ? {
        fields: ['maCan', 'trongLuongCaBi'],
        errorMessage: "Vui lòng điền đủ thông tin"
      } : {fields: ['maCan', 'soBaoBi', 'trongLuongCaBi'], errorMessage: "Vui lòng điền đủ thông tin"},
      KQC: {fields: ['maCan', 'soBaoBi'], errorMessage: "Vui lòng điền đủ thông tin"},
    };
    const requirement = requirements[name];
    if (!requirement) {
      return false;
    }
    for (const field of requirement.fields) {
      if (!data[field]) {
        this.notification.error(MESSAGE.ERROR, requirement.errorMessage);
        return false;
      }
    }
    return true;
  }

  clearRow(name) {
    const resetItems = {
      CGD: 'rowItemCGD',
      KQC: 'rowItemKQC',
    };
    const resetItem = resetItems[name];
    if (resetItem) {
      this[resetItem] = {};
    }
  }

  editRow(data: any) {
    this.dataTableAll.forEach(s => s.isEdit = false);
    let currentRow = this.dataTableAll.find(s => s.idVirtual == data.idVirtual);
    currentRow.isEdit = true;
    this.dataTable = _.chain(this.dataTableAll).groupBy('loai').map((value, key) => ({
      loai: key,
      dataChild: value
    })).value();
    this.calculatorTable();
  }

  deleteRow(idVirtual) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        try {
          this.dataTableAll = this.dataTableAll.filter(item => item.idVirtual != idVirtual);
          this.dataTable = _.chain(this.dataTableAll)
            .groupBy('loai').map((value, key) => ({loai: key, dataChild: value})).value();
          this.calculatorTable();
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  saveRow(data: any, index: number) {
    this.updateEditState(data, index, false);
  }

  cancelEdit(data: any, index: number) {
    this.updateEditState(data, index, false);
  }

  updateEditState(data: any, index: number, isEdit: boolean) {
    const rows = this.dataTableAll.filter(s => s.loai == data.loai);
    if (rows[index]) {
      rows[index].isEdit = isEdit;
    }
    this.calculatorTable();
  }

  calcTong(columnName, name) {
    const data = this.dataTable.filter(({loai}) => loai === name) || null;
    if (data) {
      return data.reduce((sum, item) => {
        return sum + item.dataChild.reduce((acc, cur) => acc + (cur[columnName] || 0), 0);
      }, 0);
    }
    return 0;
  }

  calculatorTable(event?) {
    const tongSlBaoBiKqc = this.dataTableAll ?
      this.dataTableAll
        .filter(item => item.loai === 'KQC')
        .reduce((prev, cur) => prev + (cur.soBaoBi || 0), 0)
      : 0;
    const tongSlBaoBiCgd = this.dataTableAll ?
      this.dataTableAll
        .filter(item => item.loai === 'CGD')
        .reduce((prev, cur) => prev + (cur.soBaoBi || 0), 0)
      : 0;
    const tongTrongLuongCaBi = this.dataTableAll ?
      this.dataTableAll
        .filter(item => item.loai === 'CGD')
        .reduce((prev, cur) => prev + (cur.trongLuongCaBi || 0), 0)
      : 0;
    const tongSlBaoBi = tongSlBaoBiCgd + tongSlBaoBiKqc;
    const trongLuongBaoKcan = event ? tongSlBaoBiKqc * event : this.formData.value.trongLuongMotBao * tongSlBaoBi;
    const tongTrongLuongCaBiAll = tongTrongLuongCaBi + trongLuongBaoKcan
    this.formData.patchValue({
      trongLuongBaoKcan: trongLuongBaoKcan || 0,
      tongSlBaoBi: tongSlBaoBi || 0,
      tongTrongLuongCaBi: tongTrongLuongCaBiAll || 0
    });
  }

  changeTinh(event) {
    const tongTrongTruBi = this.formData.value.tongTrongLuongCaBi - event
    this.formData.patchValue({
      tongTrongTruBi: tongTrongTruBi || 0
    });
  }

  convertTienTobangChu(tien: number): string {
    return convertTienTobangChu(tien);
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
        children: this.dataTableAll,
      };
      switch (action) {
        case "createUpdate":
          this.formData.controls["soQdNv"].setValidators([Validators.required]);
          this.formData.controls["soPhieuXuatKho"].setValidators([Validators.required]);
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
      "namKh",
      "ngayLapBangKe",
      "soQdNv",
      "diaDiemKho",
      "soPhieuXuatKho",
      "nguoiGiamSat",
    ];
    requiredFields.forEach(fieldName => {
      this.formData.controls[fieldName].setValidators([Validators.required]);
      this.formData.controls[fieldName].updateValueAndValidity();
    });
  }
}
