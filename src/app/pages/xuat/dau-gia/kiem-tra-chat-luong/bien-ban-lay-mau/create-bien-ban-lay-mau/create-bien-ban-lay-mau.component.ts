import {
  Component, EventEmitter,
  Input,
  OnInit, Output
} from '@angular/core';
import {Validators} from '@angular/forms';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {MESSAGE} from 'src/app/constants/message';
import {
  BienBanLayMauXhService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/kiem-tra-chat-luong/bienBanLayMauXh.service';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import dayjs from 'dayjs';
import {
  DialogTableSelectionComponent
} from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import {BBLM_LOAI_DOI_TUONG, STATUS} from 'src/app/constants/status';
import {
  QuyetDinhGiaoNvXuatHangService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/quyetdinh-nhiemvu-xuathang/quyet-dinh-giao-nv-xuat-hang.service';
import {FileDinhKem} from "../../../../../../models/CuuTro";
import {v4 as uuidv4} from 'uuid';
import {KhCnQuyChuanKyThuat} from "../../../../../../services/kh-cn-bao-quan/KhCnQuyChuanKyThuat";
import {LOAI_HANG_DTQG} from 'src/app/constants/config';
import {MangLuoiKhoService} from "../../../../../../services/qlnv-kho/mangLuoiKho.service";
import {AMOUNT_ONE_DECIMAL} from "../../../../../../Utility/utils";

@Component({
  selector: 'app-create-bien-ban-lay-mau',
  templateUrl: './create-bien-ban-lay-mau.component.html',
  styleUrls: ['./create-bien-ban-lay-mau.component.scss'],
})
export class CreateBienBanLayMauComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() isView: boolean;
  @Input() idInput: number;
  @Input() isViewOnModal: boolean;
  @Output() showListEvent = new EventEmitter<any>();
  LOAI_HANG_DTQG = LOAI_HANG_DTQG;
  amount = {...AMOUNT_ONE_DECIMAL};
  templateNameVt = "Biên bản lấy mẫu bán đấu giá vật tư";
  templateNameLt = "Biên bản lấy mẫu bán đấu giá lương thực";
  listBienBan: any[] = [];
  maTuSinh: number;
  maHauTo: any;
  dataQuyetDinh: any[] = [];
  loadDanhSachBbLm: any[] = [];
  listDiaDiemXuat: any[] = [];
  daiDienRow: any = {};
  danhSachPpLayMau: any[] = [];
  danhSachCtieuCluong: any[] = [];
  flagInit: Boolean = false;
  listOfData: any[] = [];
  selectedItems: string[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhGiaoNvXuatHangService: QuyetDinhGiaoNvXuatHangService,
    private danhMucService: DanhMucService,
    private khCnQuyChuanKyThuat: KhCnQuyChuanKyThuat,
    private mangLuoiKhoService: MangLuoiKhoService,
    private bienBanLayMauXhService: BienBanLayMauXhService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanLayMauXhService);
    this.formData = this.fb.group({
      id: [''],
      nam: [dayjs().get('year'), [Validators.required]],
      maDvi: [''],
      loaiBienBan: [''],
      maQhNs: [''],
      soBbLayMau: [''],
      ngayLayMau: [''],
      idQdNv: [''],
      soQdNv: [''],
      ngayKyQdNv: [''],
      idQdNvDtl: [''],
      tgianGiaoHang: [''],
      idHopDong: [''],
      soHopDong: [''],
      ngayKyHopDong: [''],
      toChucCaNhan: [''],
      idKho: [],
      maDiemKho: [''],
      diaDiemKho: [''],
      maNhaKho: [''],
      maNganKho: [''],
      maLoKho: [''],
      soLuong: [''],
      loaiHinhNx: [''],
      kieuNhapXuat: [''],
      loaiVthh: [''],
      cloaiVthh: [''],
      tenHangHoa: [''],
      idThuKho: [''],
      idKtvBaoQuan: [''],
      truongBpKtbq: [''],
      idLanhDaoChiCuc: [''],
      donViKnghiem: [''],
      diaDiemLayMau: [''],
      soLuongKiemTra: [''],
      donViTinh: [''],
      ketQuaNiemPhong: [''],
      trangThai: [''],
      lyDoTuChoi: [''],
      idHaoDoi: [''],
      soBbHaoDoi: [''],
      idTinhKho: [''],
      soBbTinhKho: [''],
      ngayXuatDocKho: [''],
      tchuanCluong: [''],
      tenDvi: [''],
      tenDiemKho: [''],
      tenNhaKho: [''],
      tenNganKho: [''],
      tenLoKho: [''],
      tenNganLoKho: [''],
      tenLoaiHinhNx: [''],
      tenKieuNhapXuat: [''],
      tenLoaiVthh: [''],
      tenCloaiVthh: [''],
      tenThuKho: [''],
      tenKtvBaoQuan: [''],
      tenLanhDaoChiCuc: [''],
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
    this.maTuSinh = await this.userService.getId('XH_BB_LAY_MAU_SEQ')
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI,
      maQhNs: this.userInfo.DON_VI.maQhns,
      soBbLayMau: `${this.maTuSinh}/${this.formData.get('nam').value}${this.maHauTo}`,
      ngayLayMau: dayjs().format('YYYY-MM-DD'),
      tenKtvBaoQuan: this.userInfo.TEN_DAY_DU,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự Thảo',
      ketQuaNiemPhong: true,
      loaiBienBan: 'LBGM',
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
      if (ctieuCluong) {
        this.danhSachCtieuCluong = ctieuCluong.map(item => ({
          label: item.ten,
          value: item.ma,
          chiSoCl: item.chiSoCl,
          phuongPhap: item.phuongPhap,
          checked: item.checked,
          type: BBLM_LOAI_DOI_TUONG.CHI_TIEU_CHAT_LUONG
        }));
      }
      if (!this.isView) {
        await this.onChange(data.idQdNv)
      }
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
      const res = await this.quyetDinhGiaoNvXuatHangService.search(body)
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

  changeSoQdNv(event) {
    if (this.flagInit && event && event !== this.formData.value.soQdNv) {
      this.formData.patchValue({
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
      const res = await this.quyetDinhGiaoNvXuatHangService.getDetail(id);
      if (res.msg !== MESSAGE.SUCCESS || !res.data) {
        return;
      }
      const data = res.data;
      const dataChiCuc = data.children.find(item => item.maDvi === this.userInfo.MA_DVI);
      this.formData.patchValue({
        nam: data.nam,
        idQdNv: data.id,
        soQdNv: data.soQdNv,
        ngayKyQdNv: data.ngayKy,
        idQdNvDtl: dataChiCuc ? dataChiCuc.id : null,
        tgianGiaoHang: data.tgianGiaoHang,
        idHopDong: data.idHopDong,
        soHopDong: data.soHopDong,
        ngayKyHopDong: data.ngayKyHopDong,
        toChucCaNhan: data.toChucCaNhan,
        loaiHinhNx: data.loaiHinhNx,
        kieuNhapXuat: data.kieuNhapXuat,
        loaiVthh: data.loaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        tenHangHoa: data.tenHangHoa,
        donViTinh: data.donViTinh,
      });
      await this.loadDanhSachLayMau(data.soQdNv)
      await this.getDanhMucTieuChuan(data);
      if (dataChiCuc && dataChiCuc.children && dataChiCuc.children.length > 0) {
        this.listDiaDiemXuat = dataChiCuc.children
      }
    } catch (e) {
      console.error('Error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async loadDanhSachLayMau(event) {
    let body = {
      nam: this.formData.value.nam,
      loaiVthh: this.loaiVthh,
      soQdNv: event
    }
    const res = await this.bienBanLayMauXhService.search(body)
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

  async openDialogKho() {
    const formattedDataKho = this.listDiaDiemXuat.map(item => ({
      soLuongXuat: item.soLuong.toLocaleString(),
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
          diaDiemKho: data.diaDiemKho,
          maNhaKho: data.maNhaKho,
          tenNhaKho: data.tenNhaKho,
          maNganKho: data.maNganKho,
          tenNganKho: data.tenNganKho,
          maLoKho: data.maLoKho,
          tenLoKho: data.tenLoKho,
          tenNganLoKho: data.tenLoKho ? data.tenLoKho + ' - ' + data.tenNganKho : data.tenNganKho,
          diaDiemLayMau: this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU) ? null : data.tenDiemKho + ' - ' + this.formData.value.tenDvi,
          soLuong: data.soLuong,
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
      this.formData.controls["soQdNv"].setValidators([Validators.required]);
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

  setValidForm() {
    const fieldsToValidate = [
      "ngayLayMau",
      "soQdNv",
      "truongBpKtbq",
      "donViKnghiem",
      "diaDiemLayMau",
      "soLuongKiemTra",
    ];
    fieldsToValidate.forEach(field => {
      this.formData.controls[field].setValidators([Validators.required]);
    });
  }
}
