import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import dayjs from 'dayjs';
import {
  QuyetDinhNvXuatBttService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/quyet-dinh-nv-xuat-btt/quyet-dinh-nv-xuat-btt.service';
import {
  BienBanLayMauBttService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/ktra-cluong-btt/bien-ban-lay-mau-btt.service';
import {HopDongBttService} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/hop-dong-btt/hop-dong-btt.service';
import {BangKeBttService} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/hop-dong-btt/bang-ke-btt.service';
import {KhCnQuyChuanKyThuat} from "../../../../../../services/kh-cn-bao-quan/KhCnQuyChuanKyThuat";
import {LOAI_HANG_DTQG} from 'src/app/constants/config';
import {PREVIEW} from "../../../../../../constants/fileType";
import {MESSAGE} from "../../../../../../constants/message";
import printJS from "print-js";
import {
  BBLM_LOAI_DOI_TUONG,
  STATUS,
  THONG_TIN_BAN_TRUC_TIEP,
  TRUC_TIEP
} from "../../../../../../constants/status";
import {
  DialogTableSelectionComponent
} from "../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import {v4 as uuidv4} from 'uuid';
import {FileDinhKem} from "../../../../../../models/CuuTro";
import {Validators} from "@angular/forms";
import {MangLuoiKhoService} from "../../../../../../services/qlnv-kho/mangLuoiKho.service";
import {AMOUNT_ONE_DECIMAL} from "../../../../../../Utility/utils";

@Component({
  selector: 'app-them-moi-bien-ban-lay-mau-btt',
  templateUrl: './them-moi-bien-ban-lay-mau-btt.component.html',
  styleUrls: ['./them-moi-bien-ban-lay-mau-btt.component.scss']
})
export class ThemMoiBienBanLayMauBttComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() isView: boolean;
  @Input() idInput: number;
  @Input() idQdGnv: number;
  @Input() isViewOnModal: boolean;
  @Output() showListEvent = new EventEmitter<any>();
  LOAI_HANG_DTQG = LOAI_HANG_DTQG;
  amount = {...AMOUNT_ONE_DECIMAL};
  templateNameVt = "Biên bản lấy mẫu bàn giao mẫu vật tư";
  templateNameLt = "Biên bản lấy mẫu bàn giao mẫu lương thực";
  TRUC_TIEP = TRUC_TIEP;
  listBienBan: any[] = [];
  maTuSinh: number;
  maHauTo: any;
  flagInit: Boolean = false;
  danhSachQuyetDinh: any[] = [];
  danhSachHopDong: any[] = [];
  danhSachBangKe: any [] = [];
  loadDanhSachBbLm: any[] = [];
  listDiaDiemXuat: any[] = [];
  daiDienRow: any = {};
  danhSachPpLayMau: any[] = [];
  danhSachCtieuCluong: any[] = [];
  listOfData: any[] = [];
  selectedItems: string[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhNvXuatBttService: QuyetDinhNvXuatBttService,
    private bienBanLayMauBttService: BienBanLayMauBttService,
    private hopDongBttService: HopDongBttService,
    private bangKeBttService: BangKeBttService,
    private danhMucService: DanhMucService,
    private khCnQuyChuanKyThuat: KhCnQuyChuanKyThuat,
    private mangLuoiKhoService: MangLuoiKhoService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanLayMauBttService);
    this.formData = this.fb.group({
      id: [],
      namKh: [dayjs().get('year'), [Validators.required]],
      maDvi: [''],
      loaiBienBan: [''],
      maQhNs: [''],
      soBbLayMau: [''],
      ngayLayMau: [''],
      idQdNvDtl: [],
      idQdNv: [],
      soQdNv: [''],
      ngayKyQdNv: [''],
      idHopDong: [],
      soHopDong: [''],
      ngayKyHopDong: [''],
      idBangKeBanLe: [],
      soBangKeBanLe: [''],
      ngayTaoBkeBanLe: [''],
      idThuKho: [],
      idKtvBaoQuan: [],
      idLanhDaoChiCuc: [],
      idKho: [],
      maDiemKho: [''],
      maNhaKho: [''],
      maNganKho: [''],
      maLoKho: [''],
      soLuong: [],
      loaiVthh: [''],
      cloaiVthh: [''],
      tenHangHoa: [''],
      donViTinh: [''],
      tgianGiaoNhan: [''],
      donViKnghiem: [''],
      diaDiemLayMau: [''],
      soLuongKiemTra: [''],
      ketQuaNiemPhong: [''],
      pthucBanTrucTiep: [''],
      phanLoai: [''],
      loaiHinhNx: [''],
      kieuNx: [''],
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
      tenLanhDaoChiCuc: [''],
      tchuanCluong: [''],
      tenTrangThai: [''],
      fileCanCu: [new Array<FileDinhKem>()],
      fileDinhKem: [new Array<FileDinhKem>()],
      fileNiemPhong: [new Array<FileDinhKem>()],
    })
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      this.maHauTo = '/BBLM-' + this.userInfo.DON_VI.tenVietTat;
      this.amount.align = "left";
      if (this.idInput > 0) {
        await this.getDetail(this.idInput);
      } else {
        await this.initForm();
      }
      await this.loadDataComboBox();
    } catch (error) {
      console.error('error: ', error);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
      this.flagInit = true;
    }
  }

  async initForm() {
    this.maTuSinh = await this.userService.getId('XH_BB_LAY_MAU_BTT_HDR_SEQ')
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI,
      maQhNs: this.userInfo.DON_VI.maQhns,
      soBbLayMau: `${this.maTuSinh}/${this.formData.get('namKh').value}${this.maHauTo}`,
      ngayLayMau: dayjs().format('YYYY-MM-DD'),
      tenKtvBaoQuan: this.userInfo.TEN_DAY_DU,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự Thảo',
      ketQuaNiemPhong: true,
      loaiBienBan: 'LBGM',
      phanLoai: TRUC_TIEP.HOP_DONG,
      donViKnghiem: this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU) ? null : this.userInfo.TEN_PHONG_BAN,
    });
  }

  async onChangeNam(event) {
    if (event) {
      this.formData.patchValue({
        soBbLayMau: `${this.maTuSinh}/${event}${this.maHauTo}`,
      });
    }
  }

  async loadDataComboBox() {
    const fetchData = async (fieldName, targetArray, filterCondition) => {
      const res = await this.danhMucService.danhMucChungGetAll(fieldName);
      if (res.msg === MESSAGE.SUCCESS) {
        targetArray.push(...res.data.filter(filterCondition));
      }
    };
    await Promise.all([
      fetchData('LOAI_BIEN_BAN', this.listBienBan, item => item.ma === 'LBGM'),
    ]);
  }

  async getDetail(id: number) {
    if (!id) return;
    const data = await this.detail(id);
    this.maTuSinh = this.idInput;
    this.dataTable = data.children
    if (this.dataTable && this.dataTable.length > 0) {
      this.listOfData = this.dataTable.filter(item => item.type === BBLM_LOAI_DOI_TUONG.NGUOI_LIEN_QUAN)
      this.danhSachPpLayMau = this.dataTable.filter(item => item.type === BBLM_LOAI_DOI_TUONG.PHUONG_PHAP_LAY_MAU);
      const firstCheckedItem = this.danhSachPpLayMau.find(item => item.checked === true);
      if (firstCheckedItem) {
        this.selectedItems = firstCheckedItem.ma;
      }
      const ctieuCluong = this.dataTable.filter(item => item.type === BBLM_LOAI_DOI_TUONG.CHI_TIEU_CHAT_LUONG)
      if (ctieuCluong){
        this.danhSachCtieuCluong = ctieuCluong.map(item => ({
          label: item.ten,
          value: item.ma,
          chiSoCl: item.chiSoCl,
          phuongPhap: item.phuongPhap,
          checked: item.checked,
          type: BBLM_LOAI_DOI_TUONG.CHI_TIEU_CHAT_LUONG
        }));
      }
      if (data.pthucBanTrucTiep !== THONG_TIN_BAN_TRUC_TIEP.UY_QUYEN && !this.isView) {
        await this.onChange(data.idQdNv)
      } else if (data.pthucBanTrucTiep === THONG_TIN_BAN_TRUC_TIEP.UY_QUYEN && !this.isView) {
        await this.onChangeHopDong(data.idHopDong)
      }
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

  changeSoQdNv(event) {
    if (this.flagInit && event && event !== this.formData.value.soQdNv) {
      this.formData.patchValue({
        idHopDong: null,
        soHopDong: null,
        ngayKyHopDong: null,
        idBangKeBanLe: null,
        soBangKeBanLe: null,
        ngayTaoBkeBanLe: null,
        maDiemKho: null,
        tenDiemKho: null,
        maNhaKho: null,
        tenNhaKho: null,
        maNganKho: null,
        tenNganKho: null,
        maLoKho: null,
        tenLoKho: null,
        tenNganLoKho: null,
      });
    }
  }

  async onChange(id) {
    if (id <= 0) return;
    try {
      await this.spinner.show();
      const res = await this.quyetDinhNvXuatBttService.getDetail(id);
      if (res.msg !== MESSAGE.SUCCESS || !res.data) {
        return;
      }
      const data = res.data;
      const dataChiCuc = data.children.find(item => item.maDvi === this.userInfo.MA_DVI);
      this.formData.patchValue({
        namKh: data.namKh,
        idQdNv: data.id,
        soQdNv: data.soQdNv,
        ngayKyQdNv: data.ngayKyQdNv,
        idQdNvDtl: dataChiCuc ? dataChiCuc.id : null,
        tgianGiaoNhan: data.tgianGiaoNhan,
        idHopDong: data.pthucBanTrucTiep === THONG_TIN_BAN_TRUC_TIEP.CHAO_GIA ? data.idHopDong : null,
        soHopDong: data.pthucBanTrucTiep === THONG_TIN_BAN_TRUC_TIEP.CHAO_GIA ? data.soHopDong : null,
        ngayKyHopDong: data.pthucBanTrucTiep === THONG_TIN_BAN_TRUC_TIEP.CHAO_GIA ? data.ngayKyHopDong : null,
        loaiHinhNx: data.loaiHinhNx,
        kieuNx: data.kieuNx,
        loaiVthh: data.loaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        tenHangHoa: data.tenHangHoa,
        donViTinh: data.donViTinh,
        pthucBanTrucTiep: data.pthucBanTrucTiep,
        phanLoai: data.pthucBanTrucTiep === THONG_TIN_BAN_TRUC_TIEP.BAN_LE ? TRUC_TIEP.BAN_LE : TRUC_TIEP.HOP_DONG,
      })
      await this.loadDanhSachLayMau(data.soQdNv)
      await this.getDanhMucTieuChuan(data);
      if (data.pthucBanTrucTiep && data.pthucBanTrucTiep !== THONG_TIN_BAN_TRUC_TIEP.UY_QUYEN) {
        if (dataChiCuc && dataChiCuc.children && dataChiCuc.children.length > 0) {
          this.listDiaDiemXuat = dataChiCuc.children
        }
      }
    } catch (e) {
      console.error('Error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async getDanhMucTieuChuan(data) {
    if (data.cloaiVthh || data.loaiVthh) {
      let res = await this.danhMucService.getDetail(data.cloaiVthh || data.loaiVthh);
      if (res.msg !== MESSAGE.SUCCESS || !res.data.tieuChuanCl) {
        return;
      }
      this.formData.patchValue({
        tchuanCluong: res.data.tieuChuanCl,
      });
    }
  }

  async loadDanhSachLayMau(event) {
    let body = {
      nam: this.formData.value.nam,
      loaiVthh: this.loaiVthh,
      soQdNv: event
    }
    const res = await this.bienBanLayMauBttService.search(body)
    if (res.msg !== MESSAGE.SUCCESS) {
      this.notification.error(MESSAGE.ERROR, res.msg);
      return;
    }
    const data = res.data.content;
    if (!data || data.length === 0) {
      return;
    }
    this.loadDanhSachBbLm = data;
  }

  async openDialogHopDong() {
    const phuongThuc = this.formData.get('pthucBanTrucTiep').value;
    if (phuongThuc !== THONG_TIN_BAN_TRUC_TIEP.UY_QUYEN) {
      return;
    }
    try {
      await this.spinner.show();
      let body = {
        namHd: this.formData.value.namKh,
        soQdNv: this.formData.value.soQdNv,
        loaiVthh: this.loaiVthh,
        trangThai: STATUS.DA_KY,
      }
      const res = await this.hopDongBttService.search(body)
      if (res && res.msg === MESSAGE.SUCCESS) {
        this.danhSachHopDong = res.data.content.filter(item => item.maDvi === this.userInfo.MA_DVI);
      }
      const modalQD = this.modal.create({
        nzTitle: 'DANH SÁCH HỢP ĐỒNG BÁN TRỰC TIẾP',
        nzContent: DialogTableSelectionComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          dataTable: this.danhSachHopDong,
          dataHeader: ['Số hợp đồng', 'Tên hợp đồng', 'Loại hàng hóa'],
          dataColumn: ['soHopDong', 'tenHopDong', 'tenLoaiVthh']
        },
      });
      modalQD.afterClose.subscribe(async (data) => {
        if (data) {
          await this.onChangeHopDong(data.id);
        }
      });
    } catch (e) {
      console.error('Error: ', e);
    } finally {
      await this.spinner.hide();
    }
  }

  changeHopDong(event) {
    const phuongThuc = this.formData.get('pthucBanTrucTiep').value;
    if (phuongThuc !== THONG_TIN_BAN_TRUC_TIEP.UY_QUYEN) {
      return;
    }
    if (this.flagInit && event && event !== this.formData.value.soHopDong) {
      this.formData.patchValue({
        idBangKeBanLe: null,
        soBangKeBanLe: null,
        ngayTaoBkeBanLe: null,
        maDiemKho: null,
        tenDiemKho: null,
        maNhaKho: null,
        tenNhaKho: null,
        maNganKho: null,
        tenNganKho: null,
        maLoKho: null,
        tenLoKho: null,
        tenNganLoKho: null,
      });
    }
  }

  async onChangeHopDong(id) {
    if (id <= 0) return;
    try {
      await this.spinner.show();
      const res = await this.hopDongBttService.getDetail(id);
      if (res.msg !== MESSAGE.SUCCESS || !res.data) {
        return;
      }
      const data = res.data;
      this.formData.patchValue({
        idHopDong: data.id,
        soHopDong: data.soHopDong,
        ngayKyHopDong: data.ngayKyHopDong,
      })
      if (data.xhHopDongBttDviList && data.xhHopDongBttDviList.length > 0) {
        this.listDiaDiemXuat = data.xhHopDongBttDviList;
      }
    } catch (e) {
      console.error('Error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async openDialogBangKe() {
    const phuongThuc = this.formData.get('pthucBanTrucTiep').value;
    if (phuongThuc !== THONG_TIN_BAN_TRUC_TIEP.BAN_LE) {
      return;
    }
    try {
      let body = {
        namKh: this.formData.value.namKh,
        soQdNv: this.formData.value.soQdNv,
        loaiVthh: this.loaiVthh,
      }
      const res = await this.bangKeBttService.search(body)
      if (res && res.msg === MESSAGE.SUCCESS) {
        this.danhSachBangKe = res.data.content
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      const modalQD = this.modal.create({
        nzTitle: 'DANH SÁCH BẢNG KÊ BÁN LẺ',
        nzContent: DialogTableSelectionComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          dataTable: this.danhSachBangKe.filter(item => item.maDvi === this.userInfo.MA_DVI),
          dataHeader: ['Số bảng kê', 'Tên người mua', 'Loại hàng hóa'],
          dataColumn: ['soBangKe', 'tenBenMua', 'tenLoaiVthh'],
        },
      });
      modalQD.afterClose.subscribe(async (data) => {
        if (data) {
          await this.onChangeBangKe(data.id);
        }
      });
    } catch (e) {
      console.error('Error: ', e);
    } finally {
      await this.spinner.hide();
    }
  }

  changeBangKe(event) {
    const phuongThuc = this.formData.get('pthucBanTrucTiep').value;
    if (phuongThuc !== THONG_TIN_BAN_TRUC_TIEP.BAN_LE) {
      return;
    }
    if (this.flagInit && event && event !== this.formData.value.soHopDong) {
      this.formData.patchValue({
        idHopDong: null,
        soHopDong: null,
        ngayKyHopDong: null,
        maDiemKho: null,
        tenDiemKho: null,
        maNhaKho: null,
        tenNhaKho: null,
        maNganKho: null,
        tenNganKho: null,
        maLoKho: null,
        tenLoKho: null,
        tenNganLoKho: null,
      });
    }
  }

  async onChangeBangKe(id) {
    if (id <= 0) return;
    try {
      await this.spinner.show();
      const res = await this.bangKeBttService.getDetail(id);
      if (res.msg !== MESSAGE.SUCCESS || !res.data) {
        return;
      }
      const data = res.data;
      this.formData.patchValue({
        idBangKeBanLe: data.id,
        soBangKeBanLe: data.soBangKe,
        ngayTaoBkeBanLe: data.ngayTao
      })
    } catch (e) {
      console.error('Error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async openDialogKho() {
    const formattedDataKho = this.listDiaDiemXuat.map(item => ({
      soLuongXuat: item.soLuong ? item.soLuong.toLocaleString() : item.soLuongKyHd.toLocaleString(),
      ...item
    }))
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH ĐỊA ĐIỂM XUẤT HÀNG',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: formattedDataKho,
        dataHeader: ['Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho', 'Số lượng'],
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho', 'soLuongXuat']
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
          tenNganLoKho: data.tenLoKho ? data.tenLoKho + ' - ' + data.tenNganKho : data.tenNganKho,
          diaDiemLayMau: this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU) ? null : data.tenDiemKho + ' - ' + this.formData.value.tenDvi,
          soLuong: data.soLuong ? data.soLuong : data.soLuongKyHd
        });
        await this.loadThuKho();
        if (this.idInput === 0) {
          await this.loadDanhSachPpLayMau();
          await this.loadDanhSachCtieuCluong();
        }
      }
    });
  }

  async loadThuKho() {
    const maDiemKho = this.formData.value.maLoKho || this.formData.value.maNganKho;
    if (!maDiemKho) {
      return;
    }
    let body = {
      maDvi: maDiemKho,
      capDvi: (maDiemKho?.length / 2 - 1),
    };
    const res = await this.mangLuoiKhoService.getDetailByMa(body);
    if (res.statusCode == 0) {
      const detailThuKho = res.data.object.detailThuKho;
      this.formData.patchValue({
        idThuKho: detailThuKho ? detailThuKho.id : null,
        tenThuKho: detailThuKho ? detailThuKho.fullName : null,
      });
    }
  }

  async addDataTable() {
    this.dataTable = [];
    const filter = [...this.listOfData, ...this.danhSachPpLayMau, ...this.danhSachCtieuCluong, ...this.dataTable].map(item => {
      return {
        ten: item.label ? item.label : item.ten,
        loai: item.loai,
        ma: item.value ? item.value : item.ma,
        chiSoCl: item.chiSoCl,
        phuongPhap: item.phuongPhap,
        checked: item.checked,
        type: item.type,
      };
    });
    this.dataTable.push(...filter);
  }

  async saveListOfData() {
    const {ten, loai} = this.daiDienRow;
    if (ten && loai) {
      this.daiDienRow.type = BBLM_LOAI_DOI_TUONG.NGUOI_LIEN_QUAN;
      this.daiDienRow.idVirtual = uuidv4();
      this.listOfData = [...this.listOfData, this.daiDienRow];
      this.daiDienRow = {};
    }
  }

  async clearListOfData() {
    this.daiDienRow = {};
  }

  async startListOfData(item) {
    this.listOfData.forEach((s) => (s.edit = false));
    const currentRow = this.listOfData.find((s) => s.idVirtual === item.idVirtual);
    if (currentRow) {
      currentRow.edit = true;
    }
  }

  async deleteListOfData(item) {
    const indexToDelete = this.listOfData.findIndex((s) => s.idVirtual === item.idVirtual);
    if (indexToDelete !== -1) {
      this.listOfData.splice(indexToDelete, 1);
    }
  }

  async createListOfData(item) {
    const indexToUpdate = this.listOfData.findIndex((s) => s.idVirtual === item.idVirtual);
    if (indexToUpdate !== -1) {
      item.edit = false;
      this.listOfData[indexToUpdate] = item;
    }
  }

  async cancelListOfData() {
    this.listOfData.forEach(s => s.edit = false);
  }

  async loadDanhSachPpLayMau() {
    this.danhSachPpLayMau = [];
    try {
      const cloaiVthh = this.formData.value.cloaiVthh || this.formData.value.loaiVthh;
      const res = await this.danhMucService.loadDanhMucHangChiTiet(cloaiVthh);
      if (res.msg !== MESSAGE.SUCCESS || !res.data) {
        return;
      }
      if (res.data.ppLayMau && res.data.ppLayMau.length > 0) {
        this.danhSachPpLayMau = res.data.ppLayMau.map(item => ({
          ten: item.giaTri,
          ma: item.ma,
          checked: false,
          type: BBLM_LOAI_DOI_TUONG.PHUONG_PHAP_LAY_MAU,
        }))
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e.msg);
    }
  }

  async onChangePpLayMau(event) {
    if (event) {
      const dataToCheck = this.dataTable && this.dataTable.length > 0 ? this.dataTable : this.danhSachPpLayMau;
      dataToCheck.forEach(item => {
        if (item.ma === event) {
          item.checked = true;
        } else {
          item.checked = false;
        }
      })
    }
  }

  async loadDanhSachCtieuCluong() {
    this.danhSachCtieuCluong = [];
    try {
      const cloaiVthh = this.formData.value.cloaiVthh || this.formData.value.loaiVthh;
      const res = await this.khCnQuyChuanKyThuat.getQuyChuanTheoCloaiVthh(cloaiVthh);
      if (res.msg !== MESSAGE.SUCCESS || !res.data) {
        return;
      }
      this.danhSachCtieuCluong = res.data.map(item => ({
        label: item.tenChiTieu,
        value: item.id,
        chiSoCl: item.mucYeuCauXuat,
        phuongPhap: item.phuongPhapXd,
        checked: false,
        type: BBLM_LOAI_DOI_TUONG.CHI_TIEU_CHAT_LUONG
      }));
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e.msg);
    }
  }

  async save() {
    try {
      await this.helperService.ignoreRequiredForm(this.formData);
      this.setValidator();
      await this.addDataTable()
      const body = {
        ...this.formData.value,
        children: this.dataTable,
      };
      await this.createUpdate(body);
    } catch (e) {
      console.error('Error: ', e);
    } finally {
      await this.helperService.restoreRequiredForm(this.formData);
    }
  }

  async saveAndSend(trangThai: string, msg: string, msgSuccess?: string) {
    try {
      await this.helperService.ignoreRequiredForm(this.formData);
      this.setValidForm();
      await this.addDataTable()
      const body = {
        ...this.formData.value,
        children: this.dataTable,
      };
      await super.saveAndSend(body, trangThai, msg, msgSuccess);
    } catch (e) {
      console.error('Error: ', e);
    } finally {
      await this.helperService.restoreRequiredForm(this.formData);
    }
  }

  async preview(id) {
    await this.bienBanLayMauBttService.preview({
      tenBaoCao: 'Biên bản lấy mẫu bàn giao mẫu bán trực tiếp',
      id: id
    }).then(async res => {
      if (res.data) {
        this.pdfSrc = PREVIEW.PATH_PDF + res.data.pdfSrc;
        this.printSrc = res.data.pdfSrc;
        this.wordSrc = PREVIEW.PATH_WORD + res.data.wordSrc;
        this.showDlgPreview = true;
      } else {
        this.notification.error(MESSAGE.ERROR, "Lỗi trong quá trình tải file.");
      }
    });
  }

  closeDlg() {
    this.showDlgPreview = false;
  }

  printPreview() {
    printJS({printable: this.printSrc, type: 'pdf', base64: true})
  }

  setValidator() {
    const phuongThuc = this.formData.get('pthucBanTrucTiep').value;
    const requiredFields = [
      "soQdNv",
    ];
    requiredFields.forEach(fieldName => {
      this.formData.get(fieldName).setValidators([Validators.required]);
      this.formData.get(fieldName).updateValueAndValidity();
    });
    if (phuongThuc === THONG_TIN_BAN_TRUC_TIEP.UY_QUYEN) {
      this.formData.get("soHopDong").setValidators([Validators.required]);
      this.formData.get("soHopDong").updateValueAndValidity();
    }
    if (phuongThuc === THONG_TIN_BAN_TRUC_TIEP.BAN_LE) {
      this.formData.get("soBangKeBanLe").setValidators([Validators.required]);
      this.formData.get("soBangKeBanLe").updateValueAndValidity();
    }
  }

  setValidForm() {
    const requiredFields = [
      "ngayLayMau",
      "soQdNv",
      "donViKnghiem",
      "diaDiemLayMau",
      "soLuongKiemTra",
    ];
    requiredFields.forEach(fieldName => {
      this.formData.get(fieldName).setValidators([Validators.required]);
      this.formData.get(fieldName).updateValueAndValidity();
    });
  }
}
