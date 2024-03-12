import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {HttpClient} from '@angular/common/http';
import {
  BienBanLayMauXhService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/kiem-tra-chat-luong/bienBanLayMauXh.service';
import {StorageService} from 'src/app/services/storage.service';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {
  XhPhieuKnghiemCluongService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/kiem-tra-chat-luong/xhPhieuKnghiemCluong.service';
import {FileDinhKem} from "../../../../../../models/CuuTro";
import {MESSAGE} from "../../../../../../constants/message";
import dayjs from "dayjs";
import {STATUS} from "../../../../../../constants/status";
import {Validators} from "@angular/forms";
import {
  QuyetDinhGiaoNvXuatHangService
} from "../../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/quyetdinh-nhiemvu-xuathang/quyet-dinh-giao-nv-xuat-hang.service";
import {
  DialogTableSelectionComponent
} from "../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import {KhCnQuyChuanKyThuat} from "../../../../../../services/kh-cn-bao-quan/KhCnQuyChuanKyThuat";
import {LOAI_HANG_DTQG} from 'src/app/constants/config';

@Component({
  selector: 'app-bdg-them-moi-phieu-kiem-nghiem-chat-luong',
  templateUrl: './them-moi-phieu-kiem-nghiem-chat-luong.component.html',
  styleUrls: ['./them-moi-phieu-kiem-nghiem-chat-luong.component.scss'],
})
export class ThemMoiPhieuKiemNghiemChatLuongComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() isView: boolean;
  @Input() idInput: number;
  @Input() isViewOnModal: boolean;
  @Input() checkPrice: any;
  @Output() showListEvent = new EventEmitter<any>();
  LOAI_HANG_DTQG = LOAI_HANG_DTQG;
  templateNameVt = "Phiếu kiểm nghiệm chất lượng bán đấu giá vật tư";
  templateNameLt = "Phiếu kiểm nghiệm chất lượng bán đấu giá lương thực";
  maTuSinh: number;
  maHauTo: any;
  flagInit: Boolean = false;
  listHinhThucBaoQuan: any[] = [];
  danhSachQuyetDinh: any[] = [];
  danhSachBbLayMau: any[] = [];
  loadDanhSachKnghiemCluong: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private quyetDinhGiaoNhiemVuXuatHangService: QuyetDinhGiaoNvXuatHangService,
    private khCnQuyChuanKyThuat: KhCnQuyChuanKyThuat,
    private bienBanLayMauXhService: BienBanLayMauXhService,
    private xhPhieuKnghiemCluongService: XhPhieuKnghiemCluongService
  ) {
    super(httpClient, storageService, notification, spinner, modal, xhPhieuKnghiemCluongService);
    this.formData = this.fb.group({
      id: [],
      nam: [dayjs().get('year'), [Validators.required]],
      maDvi: [''],
      maQhNs: [''],
      soPhieuKiemNghiem: [''],
      ngayLapPhieu: [''],
      idQdNv: [],
      soQdNv: [''],
      ngayKyQdNv: [''],
      idQdNvDtl: [],
      tgianGiaoHang: [''],
      idHopDong: [],
      soHopDong: [''],
      ngayKyHopDong: [''],
      idBbLayMau: [],
      soBbLayMau: [''],
      ngayLayMau: [''],
      idKho: [],
      maDiemKho: [''],
      diaDiemKho: [''],
      maNhaKho: [''],
      maNganKho: [''],
      maLoKho: [''],
      soLuong: [],
      maDviCon: [''],
      loaiHinhNx: [''],
      kieuNhapXuat: [''],
      loaiVthh: [''],
      cloaiVthh: [''],
      tenHangHoa: [''],
      donViTinh: [''],
      hinhThucBaoQuan: [''],
      ngayKiemNghiemMau: [''],
      idNguoiKiemNghiem: [],
      idThuKho: [],
      idTruongPhongKtvbq: [],
      ketQua: [''],
      nhanXet: [''],
      idTinhKho: [],
      soBbTinhKho: [''],
      ngayLapTinhKho: [''],
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
      tenHinhThucBaoQuan: [''],
      tenNguoiKiemNghiem: [''],
      tenThuKho: [''],
      tenTruongPhongKtvbq: [''],
      tenTrangThai: [''],
      soHieuQuyChuan: [''],
      fileDinhKem: [new Array<FileDinhKem>()],
    })
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      this.maHauTo = '/PKNCL-' + this.userInfo.DON_VI.tenVietTat;
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
    this.maTuSinh = await this.userService.getId('XH_PHIEU_KNGHIEM_CLUONG_SEQ')
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI,
      maQhNs: this.userInfo.DON_VI.maQhns,
      soPhieuKiemNghiem: `${this.maTuSinh}/${this.formData.get('nam').value}${this.maHauTo}`,
      ngayLapPhieu: dayjs().format('YYYY-MM-DD'),
      tenNguoiKiemNghiem: this.userInfo.TEN_DAY_DU,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự Thảo',
    });
  }

  async onChangeNam(event) {
    if (event) {
      this.formData.patchValue({
        soPhieuKiemNghiem: `${this.maTuSinh}/${event}${this.maHauTo}`,
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
      fetchData('HINH_THUC_BAO_QUAN', this.listHinhThucBaoQuan, () => true),
    ]);
  }

  async getDetail(id: number) {
    if (!id) return;
    const data = await this.detail(id);
    this.maTuSinh = this.idInput;
    this.dataTable = data.children;
    if (!this.isView) {
      await this.onChangeQdNv(data.idQdNv)
    }
  }

  async openDialogQdNv() {
    try {
      await this.spinner.show();
      let body = {
        loaiVthh: this.loaiVthh,
        nam: this.formData.value.nam,
        trangThai: STATUS.BAN_HANH
      }
      const res = await this.quyetDinhGiaoNhiemVuXuatHangService.search(body)
      if (res && res.msg === MESSAGE.SUCCESS) {
        this.danhSachQuyetDinh = res.data.content.filter(item => item.maDvi === this.userInfo.MA_DVI);
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
          dataColumn: ['soQdNv', 'ngayKy', 'tenLoaiVthh']
        },
      });
      modalQD.afterClose.subscribe(async (data) => {
        if (data) {
          await this.onChangeQdNv(data.id);
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
        idBbLayMau: null,
        soBbLayMau: null,
        ngayLayMau: null,
        idHopDong: null,
        soHopDong: null,
        ngayKyHopDong: null,
        loaiHinhNx: null,
        kieuNhapXuat: null,
        loaiVthh: null,
        tenLoaiVthh: null,
        cloaiVthh: null,
        tenCloaiVthh: null,
        tenHangHoa: null,
        donViTinh: null,
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
        maDviCon: null,
      });
      this.dataTable = [];
    }
  }

  async onChangeQdNv(id) {
    if (id <= 0) return;
    try {
      await this.spinner.show();
      const res = await this.quyetDinhGiaoNhiemVuXuatHangService.getDetail(id);
      if (res.msg !== MESSAGE.SUCCESS || !res.data) {
        return;
      }
      const data = res.data;
      this.formData.patchValue({
        idQdNv: data.id,
        soQdNv: data.soQdNv,
        ngayKyQdNv: data.ngayKy,
        nam: data.nam,
      });
      const resLM = await this.bienBanLayMauXhService.search({
        nam: data.nam,
        soQdNv: data.soQdNv,
        loaiVthh: data.loaiVthh
      })
      if (resLM.msg !== MESSAGE.SUCCESS) {
        this.notification.error(MESSAGE.ERROR, resLM.msg);
        return;
      }
      const dataLM = resLM.data.content;
      if (!dataLM || dataLM.length === 0) {
        return;
      }
      this.danhSachBbLayMau = dataLM
      await this.loadDanhSachKiemNghiemCluong(data.soQdNv);
    } catch (e) {
      console.error('Error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async openDialogBbLayMau() {
    const soBbLayMauSet = new Set(this.loadDanhSachKnghiemCluong.map(item => item.soBbLayMau));
    this.danhSachBbLayMau = this.danhSachBbLayMau.filter(item => !soBbLayMauSet.has(item.soBbLayMau));
    const formattedData = this.danhSachBbLayMau.map(item => ({
      ...item,
      soLuongKiemTra: item.soLuongKiemTra.toLocaleString()
    }));
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH BIÊN BẢN LẤY MẪU BÀN GIAO MẪU',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: formattedData,
        dataHeader: ['Số biên bản', 'Ngày lấy mẫu', 'Số lượng lấy mẫu'],
        dataColumn: ['soBbLayMau', 'ngayLayMau', 'soLuongKiemTra'],
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.onChangeBbLayMau(data.id);
      }
    });
  }

  async onChangeBbLayMau(id) {
    if (id <= 0) return;
    try {
      await this.spinner.show();
      const res = await this.bienBanLayMauXhService.getDetail(id);
      if (res.msg !== MESSAGE.SUCCESS || !res.data) {
        return;
      }
      const data = res.data;
      this.formData.patchValue({
        idQdNvDtl: data.idQdNvDtl,
        tgianGiaoHang: data.tgianGiaoHang,
        idBbLayMau: data.id,
        soBbLayMau: data.soBbLayMau,
        ngayLayMau: data.ngayLayMau,
        idHopDong: data.idHopDong,
        soHopDong: data.soHopDong,
        ngayKyHopDong: data.ngayKyHopDong,
        loaiHinhNx: data.loaiHinhNx,
        kieuNhapXuat: data.kieuNhapXuat,
        loaiVthh: data.loaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        tenHangHoa: data.tenHangHoa,
        donViTinh: data.donViTinh,
        idKho: data.idKho,
        maDiemKho: data.maDiemKho,
        tenDiemKho: data.tenDiemKho,
        diaDiemKho: data.diaDiemKho,
        maNhaKho: data.maNhaKho,
        tenNhaKho: data.tenNhaKho,
        maNganKho: data.maNganKho,
        tenNganKho: data.tenNganKho,
        maLoKho: data.maLoKho,
        tenLoKho: data.tenLoKho,
        idThuKho: data.idThuKho,
        tenThuKho: data.tenThuKho,
        soLuong: data.soLuong,
        maDviCon: data.maDvi,
        tenNganLoKho: data.tenLoKho ? data.tenLoKho + ' - ' + data.tenNganKho : data.tenNganKho
      });
      if (this.formData.value.cloaiVthh && this.idInput === 0) {
        await this.loadDsQcTheoCloaiVthh()
      }
    } catch (e) {
      console.error('Error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async loadDsQcTheoCloaiVthh() {
    try {
      await this.spinner.show();
      const res = await this.khCnQuyChuanKyThuat.getQuyChuanTheoCloaiVthh(this.formData.value.cloaiVthh);
      if (res.msg === MESSAGE.SUCCESS || res.data) {
        this.dataTable = res.data || [];
        this.dataTable = this.dataTable.map(element => ({
          ...element,
          edit: false
        }));
        if (this.dataTable && !this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU)) {
          const chiTieuMap = res.data.reduce((acc, item) => {
            acc[item.maChiTieu] = item.mucYeuCauXuat;
            return acc;
          }, {});
          let ketQuaValues = [];
          if (this.loaiVthh.startsWith(LOAI_HANG_DTQG.THOC)) {
            ketQuaValues = ['MAU_SAC_THOC', 'MUI_THOC', 'TRANG_THAI_THOC', 'SINH_VAT_HAI_THOC'];
          } else if (this.loaiVthh.startsWith(LOAI_HANG_DTQG.GAO)) {
            ketQuaValues = ['MAU_SAC_GAO', 'MUI_VI_GAO', 'TAP_CHAT_GAO', 'DANH_BONG_GAO', 'SINH_VAT_HAI_GAO'];
          } else {
            ketQuaValues = ['MAU_SAC_MUOI'];
          }
          ketQuaValues = ketQuaValues.map(key => chiTieuMap[key] ? `- ${chiTieuMap[key]}. \n` : '')
            .filter(value => value !== '');
          this.formData.get('ketQua').setValue(ketQuaValues.join(''));
        }
        this.formData.get('soHieuQuyChuan').setValue(this.dataTable[0]?.soHieuQuyChuan || '');
      }
    } catch (e) {
      console.error('Error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async onChangeKetQua(event, index) {
    if (!event) {
      this.dataTable[index].danhGia = "";
      return;
    }
    const parseNumber = (value) => {
      if (typeof value === "string" || value instanceof String) {
        return parseFloat(value.replace(",", "."));
      }
      return value;
    };
    const setDanhGia = (index, value) => {
      this.dataTable[index].danhGia = value;
    };
    const KetQua = parseNumber(event);
    if ((KetQua === 0 || KetQua >= 0) && index !== null) {
      const toanTu = parseFloat(this.dataTable[index].toanTu);
      const XuatToiDa = parseNumber(this.dataTable[index].mucYeuCauXuatToiDa);
      const xuatToiThieu = parseNumber(this.dataTable[index].mucYeuCauXuatToiThieu);
      if ([1, 4].includes(toanTu) && (xuatToiThieu === 0 || xuatToiThieu > 0)) {
        if ((toanTu === 1 && xuatToiThieu < KetQua && (!XuatToiDa || KetQua <= XuatToiDa)) || (toanTu === 4 && xuatToiThieu <= KetQua && (!XuatToiDa || KetQua <= XuatToiDa))) {
          setDanhGia(index, "Đạt");
        } else {
          setDanhGia(index, "Không đạt");
        }
      } else if ([2, 5].includes(toanTu) && XuatToiDa > 0) {
        if ((toanTu === 2 && KetQua < XuatToiDa && (!xuatToiThieu || KetQua >= xuatToiThieu)) || (toanTu === 5 && KetQua <= XuatToiDa && (!xuatToiThieu || KetQua >= xuatToiThieu))) {
          setDanhGia(index, "Đạt");
        } else {
          setDanhGia(index, "Không đạt");
        }
      } else if ([3, 6].includes(toanTu) && (XuatToiDa === 0 || XuatToiDa > 0) && (xuatToiThieu === 0 || xuatToiThieu > 0)) {
        if ((toanTu === 3 && xuatToiThieu == KetQua && KetQua == XuatToiDa) || (toanTu === 6 && xuatToiThieu <= KetQua && KetQua <= XuatToiDa)) {
          setDanhGia(index, "Đạt");
        } else {
          setDanhGia(index, "Không đạt");
        }
      }
    }
  }

  async loadDanhSachKiemNghiemCluong(event) {
    let body = {
      nam: this.formData.value.nam,
      loaiVthh: this.loaiVthh,
      soQdNv: event
    }
    const res = await this.xhPhieuKnghiemCluongService.search(body)
    if (res.msg !== MESSAGE.SUCCESS) {
      this.notification.error(MESSAGE.ERROR, res.msg);
      return;
    }
    const data = res.data.content;
    if (!data || data.length === 0) {
      return;
    }
    this.loadDanhSachKnghiemCluong = data;
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
          this.formData.controls["soBbLayMau"].setValidators([Validators.required]);
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
    const fieldsToValidate = [
      "soQdNv",
      "soBbLayMau",
      "ngayKiemNghiemMau",
      "nhanXet",
    ];
    fieldsToValidate.forEach(field => {
      this.formData.controls[field].setValidators([Validators.required]);
    });
  }
}
