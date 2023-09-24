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
import {PREVIEW} from "../../../../../../constants/fileType";
import printJS from "print-js";

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
  listBienBan: any[] = [];
  maHauTo: any;
  dataQuyetDinh: any[] = [];
  loadDanhSachBbLm: any[] = [];
  listDiaDiemXuat: any[] = [];
  daiDienRow: any = {};
  danhSachPpLayMau: any[] = [];
  danhSachCtieuCluong: any[] = [];
  flagInit: Boolean = false;
  children: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhGiaoNhiemVuXuatHangService: QuyetDinhGiaoNvXuatHangService,
    private bienBanLayMauXhService: BienBanLayMauXhService,
    private danhMucService: DanhMucService,
    private khCnQuyChuanKyThuat: KhCnQuyChuanKyThuat,
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
      idHopDong: [''],
      soHopDong: [''],
      ngayKyHopDong: [''],
      toChucCaNhan: [''],
      maDiemKho: [''],
      diaDiemKho: [''],
      maNhaKho: [''],
      maNganKho: [''],
      maLoKho: [''],
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
      LyDoTuChoi: [''],
      idHaoDoi: [''],
      soBbHaoDoi: [''],
      idTinhKho: [''],
      soBbTinhKho: [''],
      ngayXuatDocKho: [''],
      tenDvi: [''],
      tenDiemKho: [''],
      tenNhaKho: [''],
      tenNganKho: [''],
      tenLoKho: [''],
      tenLoaiHinhNx: [''],
      tenKieuNhapXuat: [''],
      tenLoaiVthh: [''],
      tenCloaiVthh: [''],
      tenThuKho: [''],
      tenKtvBaoQuan: [''],
      tenLanhDaoChiCuc: [''],
      tenTrangThai: [''],
      phuongPhapLayMau: [new Array()],
      chiTieuChatLuong: [new Array()],
      fileCanCu: [new Array<FileDinhKem>()],
      fileDinhKem: [new Array<FileDinhKem>()],
      fileNiemPhong: [new Array<FileDinhKem>()],
    })
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      this.maHauTo = '/BBLM-' + this.userInfo.DON_VI.tenVietTat;
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
    let id = await this.userService.getId('XH_BB_LAY_MAU_SEQ')
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI,
      maQhNs: this.userInfo.DON_VI.maQhns,
      soBbLayMau: `${id}/${this.formData.get('nam').value}${this.maHauTo}`,
      ngayLayMau: dayjs().format('YYYY-MM-DD'),
      tenKtvBaoQuan: this.userInfo.TEN_DAY_DU,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự Thảo',
      ketQuaNiemPhong: true,
      loaiBienBan: 'LBGM',
    });
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
    if (!data) {
      console.error('Không tìm thấy dữ liệu');
      return;
    }
    this.dataTable = data.children.filter(item => item.type === BBLM_LOAI_DOI_TUONG.NGUOI_LIEN_QUAN);
    this.danhSachPpLayMau = data.children.filter(item => item.type === BBLM_LOAI_DOI_TUONG.PHUONG_PHAP_LAY_MAU)
      .map(item => ({
        label: item.ten,
        value: item.ma,
        type: item.type,
        checked: item.checked,
      }));
    this.formData.patchValue({
      phuongPhapLayMau: this.danhSachPpLayMau
    });
    this.danhSachCtieuCluong = data.children.filter(item => item.type === BBLM_LOAI_DOI_TUONG.CHI_TIEU_CHAT_LUONG)
      .map(item => ({
        label: item.ten,
        value: item.ma,
        chiSoCl: item.chiSoCl,
        phuongPhap: item.phuongPhap,
        type: item.type,
        checked: item.checked,
      }));
    this.formData.patchValue({
      chiTieuChatLuong: this.danhSachCtieuCluong
    });
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
      if (res.msg !== MESSAGE.SUCCESS) {
        this.notification.error(MESSAGE.ERROR, res.msg);
        return;
      }
      const data = res.data.content;
      if (!data || data.length === 0) {
        return;
      }
      this.dataQuyetDinh = data.filter(item => item.children.some(child => child.maDvi === this.userInfo.MA_DVI));
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
      });
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
        idQdNv: data.id,
        soQdNv: data.soQdNv,
        ngayKyQdNv: data.ngayKy,
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
      const dataChiCuc = data.children.find(item => item.maDvi === this.userInfo.MA_DVI);
      this.listDiaDiemXuat = dataChiCuc?.children.filter(item => {
        const key = JSON.stringify({
          maDiemKho: item.maDiemKho,
          maNhaKho: item.maNhaKho,
          maNganKho: item.maNganKho,
          maLoKho: item.maLoKho
        });
        return !new Set(this.loadDanhSachBbLm.map(item => JSON.stringify({
          maDiemKho: item.maDiemKho,
          maNhaKho: item.maNhaKho,
          maNganKho: item.maNganKho,
          maLoKho: item.maLoKho
        }))).has(key);
      }) || [];
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
          maDiemKho: data.maDiemKho,
          tenDiemKho: data.tenDiemKho,
          diaDiemKho: data.diaDiemKho,
          maNhaKho: data.maNhaKho,
          tenNhaKho: data.tenNhaKho,
          maNganKho: data.maNganKho,
          tenNganKho: data.tenNganKho,
          maLoKho: data.maLoKho,
          tenLoKho: data.tenLoKho,
        });
        await this.loadDanhSachPpLayMau();
        await this.loadDanhSachCtieuCluong();
      }
    });
  }

  async saveDataTable() {
    const {ten, loai} = this.daiDienRow;
    if (ten && loai) {
      this.daiDienRow.type = BBLM_LOAI_DOI_TUONG.NGUOI_LIEN_QUAN;
      this.daiDienRow.idVirtual = uuidv4();
      this.dataTable = [...this.dataTable, this.daiDienRow];
      this.daiDienRow = {};
    }
  }

  async clearDataTable() {
    this.daiDienRow = {};
  }

  async startDataTable(item) {
    this.dataTable.forEach((s) => (s.edit = false));
    const currentRow = this.dataTable.find((s) => s.idVirtual === item.idVirtual);
    if (currentRow) {
      currentRow.edit = true;
    }
  }

  async deleteDataTable(item) {
    const indexToDelete = this.dataTable.findIndex((s) => s.idVirtual === item.idVirtual);
    if (indexToDelete !== -1) {
      this.dataTable.splice(indexToDelete, 1);
    }
  }

  async createDataTable(item) {
    const indexToUpdate = this.dataTable.findIndex((s) => s.idVirtual === item.idVirtual);
    if (indexToUpdate !== -1) {
      item.edit = false;
      this.dataTable[indexToUpdate] = item;
    }
  }

  async cancelDataTable() {
    this.dataTable.forEach(s => s.edit = false);
  }

  async loadDanhSachPpLayMau() {
    if (this.danhSachPpLayMau.length > 0) return;
    try {
      const formDataValue = this.formData.value;
      const cloaiVthh = formDataValue.cloaiVthh || formDataValue.loaiVthh;
      const res = await this.danhMucService.loadDanhMucHangChiTiet(cloaiVthh);
      if (res.msg === MESSAGE.SUCCESS && Array.isArray(res.data?.ppLayMau) && res.data.ppLayMau.length > 0) {
        this.danhSachPpLayMau = res.data.ppLayMau.map(item => ({
          label: item.giaTri,
          value: item.ma,
          checked: false,
          type: BBLM_LOAI_DOI_TUONG.PHUONG_PHAP_LAY_MAU,
        }));
        this.formData.patchValue({
          phuongPhapLayMau: this.danhSachPpLayMau
        });
      }
    } catch (err) {
      this.notification.error(MESSAGE.ERROR, err.msg);
    }
  }

  async loadDanhSachCtieuCluong() {
    if (this.danhSachCtieuCluong.length > 0) return;
    try {
      const formDataValue = this.formData.value;
      const cloaiVthh = formDataValue.cloaiVthh || formDataValue.loaiVthh;
      const res = await this.khCnQuyChuanKyThuat.getQuyChuanTheoCloaiVthh(cloaiVthh);
      if (res.msg === MESSAGE.SUCCESS && Array.isArray(res.data)) {
        this.danhSachCtieuCluong = res.data.map(item => ({
          label: item.tenChiTieu,
          value: item.id,
          chiSoCl: item.mucYeuCauXuat,
          phuongPhap: item.phuongPhapXd,
          checked: true,
          type: BBLM_LOAI_DOI_TUONG.CHI_TIEU_CHAT_LUONG
        }));
        this.formData.patchValue({
          chiTieuChatLuong: this.danhSachCtieuCluong
        });
      }
    } catch (err) {
      this.notification.error(MESSAGE.ERROR, err.msg);
    }
  }

  async save() {
    try {
      await this.helperService.ignoreRequiredForm(this.formData);
      this.setValidator();
      await this.saveChildren();
      const body = {
        ...this.formData.value,
        children: this.children,
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
      await this.saveChildren();
      const body = {
        ...this.formData.value,
        children: this.children,
      };
      await super.saveAndSend(body, trangThai, msg, msgSuccess);
    } catch (e) {
      console.error('Error: ', e);
    } finally {
      await this.helperService.restoreRequiredForm(this.formData);
    }
  }

  async saveChildren() {
    const {phuongPhapLayMau, chiTieuChatLuong} = this.formData.value;
    const filter = phuongPhapLayMau.concat(chiTieuChatLuong, this.dataTable).map(s => ({
      ten: s.label ? s.label : s.ten,
      loai: s.loai,
      ma: s.value,
      chiSoCl: s.chiSoCl,
      phuongPhap: s.phuongPhap,
      checked: s.checked,
      type: s.type,
    }));
    this.children.push(...filter);
    this.formData.value.phuongPhapLayMau = "";
    this.formData.value.chiTieuChatLuong = "";
  }

  async preview(id) {
    await this.bienBanLayMauXhService.preview({
      tenBaoCao: 'Biên bản lấy mẫu bàn giao mẫu bán đấu giá',
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

  // downloadPdf() {
  //   saveAs(this.pdfSrc, "bien-ban-lay-mau/ban-giao-mau.pdf");
  // }

  // downloadWord() {
  //   saveAs(this.wordSrc, "bien-ban-lay-mau/ban-giao-mau.docx");
  // }

  closeDlg() {
    this.showDlgPreview = false;
  }

  printPreview() {
    printJS({printable: this.printSrc, type: 'pdf', base64: true})
  }

  setValidator() {
    this.formData.controls["soQdNv"].setValidators([Validators.required]);
    this.formData.controls["tenDiemKho"].setValidators([Validators.required]);
    this.formData.controls["tenNhaKho"].setValidators([Validators.required]);
    this.formData.controls["tenNganKho"].setValidators([Validators.required]);
    this.formData.controls["tenLoKho"].setValidators([Validators.required]);
  }

  setValidForm() {
    this.formData.controls["loaiBienBan"].setValidators([Validators.required]);
    this.formData.controls["tenDvi"].setValidators([Validators.required]);
    this.formData.controls["maQhNs"].setValidators([Validators.required]);
    this.formData.controls["soBbLayMau"].setValidators([Validators.required]);
    this.formData.controls["ngayLayMau"].setValidators([Validators.required]);
    this.formData.controls["soHopDong"].setValidators([Validators.required]);
    this.formData.controls["ngayKyHopDong"].setValidators([Validators.required]);
    this.formData.controls["toChucCaNhan"].setValidators([Validators.required]);
    this.formData.controls["tenLoaiVthh"].setValidators([Validators.required]);
    this.formData.controls["tenCloaiVthh"].setValidators([Validators.required]);
    this.formData.controls["truongBpKtbq"].setValidators([Validators.required]);
    this.formData.controls["donViKnghiem"].setValidators([Validators.required]);
    this.formData.controls["diaDiemLayMau"].setValidators([Validators.required]);
    this.formData.controls["soLuongKiemTra"].setValidators([Validators.required]);
  }
}
