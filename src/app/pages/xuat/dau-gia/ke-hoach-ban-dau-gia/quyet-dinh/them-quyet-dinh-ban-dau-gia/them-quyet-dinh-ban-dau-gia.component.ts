import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Validators} from '@angular/forms';
import * as dayjs from 'dayjs';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {
  DialogTableSelectionComponent
} from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import {MESSAGE} from 'src/app/constants/message';
import {STATUS} from "../../../../../../constants/status";
import {
  QuyetDinhPdKhBdgService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/quyetDinhPdKhBdg.service';
import {
  TongHopDeXuatKeHoachBanDauGiaService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/tongHopDeXuatKeHoachBanDauGia.service';
import {
  DeXuatKhBanDauGiaService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/deXuatKhBanDauGia.service';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {ChiTieuKeHoachNamCapTongCucService} from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
import {PREVIEW} from "src/app/constants/fileType";
import {saveAs} from 'file-saver';
import {QuyetDinhGiaTCDTNNService} from "../../../../../../services/ke-hoach/phuong-an-gia/quyetDinhGiaTCDTNN.service";
import {LOAI_HANG_DTQG} from 'src/app/constants/config';

@Component({
  selector: 'app-them-quyet-dinh-ban-dau-gia',
  templateUrl: './them-quyet-dinh-ban-dau-gia.component.html',
  styleUrls: ['./them-quyet-dinh-ban-dau-gia.component.scss']
})

export class ThemQuyetDinhBanDauGiaComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string
  @Input() idInput: number = 0;
  @Input() isView: boolean;
  @Input() dataTongHop: any;
  @Input() isViewOnModal: boolean;
  @Output() showListEvent = new EventEmitter<any>();
  LOAI_HANG_DTQG = LOAI_HANG_DTQG;
  maHauTo: any;
  listDanhSachTongHop: any[] = [];
  listToTrinh: any[] = [];
  danhsachDx: any[] = [];
  dataInput: any;
  dataInputCache: any;
  selected: boolean = false;
  maDviCuc: string;
  showDlgPreview = false;
  pdfBlob: any;
  pdfSrc: any;
  wordSrc: any;
  templateName = "quyet-dinh-ke-hoach-ban-dau-gia";

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private quyetDinhPdKhBdgService: QuyetDinhPdKhBdgService,
    private deXuatKhBanDauGiaService: DeXuatKhBanDauGiaService,
    private tongHopDeXuatKeHoachBanDauGiaService: TongHopDeXuatKeHoachBanDauGiaService,
    private chiTieuKeHoachNamCapTongCucService: ChiTieuKeHoachNamCapTongCucService,
    private quyetDinhGiaTCDTNNService: QuyetDinhGiaTCDTNNService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhPdKhBdgService);
    this.formData = this.fb.group({
      id: [null],
      nam: [],
      soQdPd: ['',],
      ngayKyQd: ['',],
      ngayHluc: ['',],
      idThHdr: [''],
      soTrHdr: [''],
      idTrHdr: [''],
      trichYeu: [''],
      loaiVthh: [''],
      tenLoaiVthh: [''],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      tchuanCluong: [''],
      trangThai: [''],
      tenTrangThai: [''],
      phanLoai: [''],
      soQdCc: [''],
      slDviTsan: [],
      loaiHinhNx: [''],
      tenLoaiHinhNx: [''],
      kieuNx: [''],
      tenKieuNx: [''],
      namKh: [],
    })
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      this.maHauTo = '/' + this.userInfo.MA_QD;
      if (this.idInput > 0) {
        await this.loadDetail(this.idInput)
      } else {
        await this.initForm();
      }
      await this.bindingDataTongHop(this.dataTongHop);
    } catch (e) {
      console.error('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async onChangeNamKh() {
    this.formData.get('namKh').setValue(this.formData.get('nam').value);
  }

  async initForm() {
    this.formData.patchValue({
      nam: dayjs().get('year'),
      trangThai: STATUS.DANG_NHAP_DU_LIEU,
      tenTrangThai: 'Đang nhập dữ liệu',
      phanLoai: 'TH'
    })
  }

  async showFirstRow($event, index: number) {
    await this.showDetail($event, index);
  }

  async bindingDataTongHop(dataTongHop?) {
    if (!dataTongHop) {
      return;
    }
    if (dataTongHop.trangThai == STATUS.CHUA_TAO_QD && dataTongHop.idQdPd === null) {
      this.formData.patchValue({
        cloaiVthh: dataTongHop.cloaiVthh,
        tenCloaiVthh: dataTongHop.tenCloaiVthh,
        loaiVthh: dataTongHop.loaiVthh,
        tenLoaiVthh: dataTongHop.tenLoaiVthh,
        idThHdr: dataTongHop.id == null ? dataTongHop.idTh : dataTongHop.id,
        phanLoai: 'TH',
      })
      await this.onChangeIdThHdr(this.formData.value.idThHdr);
    } else if (dataTongHop.idQdPd !== null) {
      await this.loadDetail(dataTongHop.idQdPd);
      this.isView = dataTongHop.trangThai === STATUS.DA_BAN_HANH_QD;
    }
  }

  async save() {
    try {
      this.danhsachDx = this.danhsachDx.map(item => ({
        ...item,
        lastest: null,
        isDieuChinh: null
      }));
      await this.helperService.ignoreRequiredForm(this.formData);
      this.setValidator();
      const body = {
        ...this.formData.value,
        soQdPd: this.formData.value.soQdPd ? this.formData.value.soQdPd + this.maHauTo : null,
        children: this.danhsachDx,
        canCuPhapLy: this.canCuPhapLy,
        fileDinhKem: this.fileDinhKem,
      };
      await this.createUpdate(body);
      await this.helperService.restoreRequiredForm(this.formData);
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
    }
  }

  async saveAndSend(trangThai: string, msg: string, msgSuccess?: string) {
    if (!(await this.validateBanHanhQd(this.danhsachDx))) {
      return;
    }
    this.setValidForm();
    this.danhsachDx = this.danhsachDx.map(item => ({
      ...item,
      lastest: null,
      isDieuChinh: null
    }));
    const soQdPd = this.formData.value.soQdPd ? `${this.formData.value.soQdPd}${this.maHauTo}` : null;
    const body = {
      ...this.formData.value,
      soQdPd,
      children: this.danhsachDx,
      canCuPhapLy: this.canCuPhapLy,
      fileDinhKem: this.fileDinhKem,
    };
    await super.saveAndSend(body, trangThai, msg, msgSuccess);
  }

  async validateBanHanhQd(data) {
    let isValid = true;
    data.forEach(item => {
      item.children.forEach(child => {
        child.children.forEach(s => {
          if (s.donGiaDuocDuyet === null || s.donGiaDuocDuyet === '' || typeof s.donGiaDuocDuyet === 'undefined') {
            this.notification.error(MESSAGE.WARNING, `Hiện chưa có giá bán cụ thể được duyệt cho số tờ trình ${item.soDxuat} !`);
            isValid = false;
          }
        });
      });
    });
    return isValid;
  }

  async loadDetail(id: number) {
    if (!id) {
      return;
    }
    const data = await this.detail(id);
    const {soQdPd, children} = data;
    this.formData.patchValue({
      soQdPd: soQdPd?.split('/')[0] || null,
      namKh: this.formData.value.nam,
    });
    this.canCuPhapLy = data.canCuPhapLy;
    this.fileDinhKem = data.fileDinhKem;
    this.danhsachDx = this.userService.isCuc() ? children.filter(item => item.maDvi === this.userInfo.MA_DVI) : children;
    await this.showFirstRow(event, 0);
  }

  async openDialogTh() {
    const selectedPhanLoai = this.formData.get('phanLoai').value;
    if (selectedPhanLoai !== 'TH') {
      return;
    }
    try {
      await this.spinner.show();
      const body = {
        trangThai: STATUS.CHUA_TAO_QD,
        namKh: this.formData.value.nam,
        loaiVthh: this.loaiVthh,
      };
      const res = await this.tongHopDeXuatKeHoachBanDauGiaService.search(body);
      if (res && res.msg === MESSAGE.SUCCESS) {
        this.listDanhSachTongHop = res.data.content;
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      const modalQD = this.modal.create({
        nzTitle: 'DANH SÁCH TỔNG HỢP ĐỀ XUẤT BÁN ĐẤU GIÁ',
        nzContent: DialogTableSelectionComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          dataTable: this.listDanhSachTongHop,
          dataHeader: ['Số tổng hợp', 'Nội dung tổng hợp'],
          dataColumn: ['id', 'noiDungThop'],
        },
      });
      modalQD.afterClose.subscribe(async (data) => {
        if (data) {
          await this.onChangeIdThHdr(data.id);
        }
      });
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      await this.spinner.hide();
    }
  }

  async onChangeIdThHdr(idTh) {
    if (idTh <= 0) {
      return;
    }
    this.danhsachDx = [];
    try {
      await this.spinner.show();
      const res = await this.tongHopDeXuatKeHoachBanDauGiaService.getDetail(idTh);
      if (res.msg !== MESSAGE.SUCCESS || !res.data) {
        return;
      }
      const data = res.data;
      const soLuongDviTsan = data.children.reduce((total, item) => total + item.slDviTsan, 0);
      this.formData.patchValue({
        cloaiVthh: data.cloaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        loaiVthh: data.loaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        slDviTsan: soLuongDviTsan,
        namKh: this.formData.value.nam,
        idThHdr: data.id,
        idTrHdr: null,
        soTrHdr: null,
      });
      await this.getDataChiTieu();
      for (const item of data.children) {
        const resDx = await this.deXuatKhBanDauGiaService.getDetail(item.idDxHdr);
        if (resDx.msg !== MESSAGE.SUCCESS || !resDx.data) {
          return;
        }
        const dataDx = resDx.data
        this.formData.patchValue({
          tchuanCluong: dataDx.tchuanCluong,
          loaiHinhNx: dataDx.loaiHinhNx,
          tenLoaiHinhNx: dataDx.tenLoaiHinhNx,
          kieuNx: dataDx.kieuNx,
          tenKieuNx: dataDx.tenKieuNx,
        });
        dataDx.idDxHdr = dataDx.id;
        this.danhsachDx.push(dataDx);
        await this.showFirstRow(event, 0);
      }
    } catch (error) {
      console.error('error: ', error);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async getDataChiTieu() {
    const namKhValue = +this.formData.get('namKh').value;
    try {
      const res2 = await this.chiTieuKeHoachNamCapTongCucService.canCuCucQd(namKhValue);
      this.formData.patchValue({
        soQdCc: res2.msg === MESSAGE.SUCCESS ? (res2.data ? res2.data.soQuyetDinh : null) : null,
      });
    } catch (error) {
      console.error('An error occurred:', error);
      this.formData.patchValue({
        soQdCc: null,
      });
    }
  }

  async openDialogTr() {
    const selectedPhanLoai = this.formData.get('phanLoai').value;
    if (selectedPhanLoai !== 'TTr') {
      return;
    }
    try {
      await this.spinner.show();
      let body = {
        trangThai: STATUS.DA_DUYET_CBV,
        trangThaiTh: STATUS.CHUA_TONG_HOP,
        namKh: this.formData.value.nam,
        loaiVthh: this.loaiVthh,
      }
      let res = await this.deXuatKhBanDauGiaService.search(body);
      if (res && res.msg === MESSAGE.SUCCESS) {
        this.listToTrinh = res.data.content;
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      const modalQD = this.modal.create({
        nzTitle: 'DANH SÁCH ĐỀ XUẤT KẾ HOẠCH BÁN ĐẤU GIÁ',
        nzContent: DialogTableSelectionComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          dataTable: this.listToTrinh,
          dataHeader: ['Số tờ trình đề xuất', 'Loại hàng hóa', 'Chủng loại hàng hóa'],
          dataColumn: ['soDxuat', 'tenLoaiVthh', 'tenCloaiVthh']
        },
      });
      modalQD.afterClose.subscribe(async (data) => {
        if (data) {
          await this.onChangeIdTrHdr(data.id);
        }
      });
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      await this.spinner.hide();
    }
  }

  async onChangeIdTrHdr(idDx) {
    if (idDx <= 0) {
      return;
    }
    this.danhsachDx = [];
    try {
      await this.spinner.show();
      const res = await this.deXuatKhBanDauGiaService.getDetail(idDx);
      if (res.msg !== MESSAGE.SUCCESS || !res.data) {
        return;
      }
      const data = res.data;
      data.idDxHdr = data.id;
      this.formData.patchValue({
        cloaiVthh: data.cloaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        loaiVthh: data.loaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        tchuanCluong: data.tchuanCluong,
        moTaHangHoa: data.moTaHangHoa,
        tgianDkienTu: data.tgianDkienTu,
        tgianDkienDen: data.tgianDkienDen,
        tgianTtoan: data.tgianTtoan,
        tgianTtoanGhiChu: data.tgianTtoanGhiChu,
        pthucTtoan: data.pthucTtoan,
        tgianGnhan: data.tgianGnhan,
        tgianGnhanGhiChu: data.tgianGnhanGhiChu,
        pthucGnhan: data.pthucGnhan,
        thongBaoKh: data.thongBaoKh,
        slDviTsan: data.slDviTsan,
        loaiHinhNx: data.loaiHinhNx,
        tenLoaiHinhNx: data.tenLoaiHinhNx,
        kieuNx: data.kieuNx,
        tenKieuNx: data.tenKieuNx,
        namKh: this.formData.value.nam,
        idThHdr: null,
        soTrHdr: data.soDxuat,
        idTrHdr: data.id,
      });
      await this.getDataChiTieu();
      this.danhsachDx.push(data);
      await this.showFirstRow(event, 0);
    } catch (error) {
      console.error('error:', error);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  index = 0;

  async showDetail($event, index: number) {
    if ($event.type === 'click') {
      const selectedRow = $event.target.parentElement;
      const previouslySelectedRow = selectedRow.parentElement.querySelector('.selectedRow');
      if (previouslySelectedRow) {
        previouslySelectedRow.classList.remove('selectedRow');
      }
      selectedRow.classList.add('selectedRow');
      this.selected = false;
      this.index = index
    } else {
      this.selected = true;
    }
    this.dataInput = this.danhsachDx[index];
    if (this.dataInput) {
      let idDx = this.dataInput.idDxHdr
      const res = await this.deXuatKhBanDauGiaService.getDetail(idDx);
      this.dataInputCache = res.data;
    }
  }

  async receiveDataFromChild(data: any) {
    if (this.danhsachDx[this.index]) {
      if (data.hasOwnProperty('tongSoLuong')) {
        this.danhsachDx[this.index].tongSoLuong = data.tongSoLuong;
      }
      if (data.hasOwnProperty('tongTienKhoiDiem')) {
        this.danhsachDx[this.index].tongTienKhoiDiem = data.tongTienKhoiDiem;
      }
      if (data.hasOwnProperty('tongTienDatTruoc')) {
        this.danhsachDx[this.index].tongTienDatTruoc = data.tongTienDatTruoc;
      }
      if (data.hasOwnProperty('tgianDkienTu')) {
        this.danhsachDx[this.index].tgianDkienTu = data.tgianDkienTu;
      }
      if (data.hasOwnProperty('tgianDkienDen')) {
        this.danhsachDx[this.index].tgianDkienDen = data.tgianDkienDen;
      }
    }
  }

  async preview(id) {
    try {
      const response = await this.quyetDinhPdKhBdgService.preview({
        tenBaoCao: this.templateName,
        id: id,
      });

      if (response.data) {
        this.pdfSrc = PREVIEW.PATH_PDF + response.data.pdfSrc;
        this.wordSrc = PREVIEW.PATH_WORD + response.data.wordSrc;
        this.showDlgPreview = true;
      } else {
        this.notification.error(MESSAGE.ERROR, "Lỗi trong quá trình tải file.");
      }
    } catch (error) {
      console.error('Lỗi:', error);
      this.notification.error(MESSAGE.ERROR, "Lỗi trong quá trình tải file.");
    }
  }

  downloadFile(src: string, fileName: string) {
    saveAs(src, fileName);
  }

  downloadPdf() {
    this.downloadFile(this.pdfSrc, this.templateName + ".pdf");
  }

  downloadWord() {
    this.downloadFile(this.wordSrc, this.templateName + ".docx");
  }

  closeDlg() {
    this.showDlgPreview = false;
  }

  isDisabledQD() {
    if (this.formData.value.id || this.formData.value.idThHdr) {
      return true;
    }
    return false;
  }

  setValidator() {
    const thHdrValidators = this.formData.get('phanLoai').value === 'TH' ? [Validators.required] : [];
    const trHdrValidators = this.formData.get('phanLoai').value === 'TTr' ? [Validators.required] : [];
    this.formData.controls["idThHdr"].setValidators(thHdrValidators);
    this.formData.controls["idThHdr"].updateValueAndValidity();
    this.formData.controls["idTrHdr"].setValidators(trHdrValidators);
    this.formData.controls["idTrHdr"].updateValueAndValidity();
    this.formData.controls["soTrHdr"].setValidators(trHdrValidators);
    this.formData.controls["soTrHdr"].updateValueAndValidity();
    this.formData.controls["soQdPd"].setValidators([Validators.required]);
  }

  setValidForm() {
    const requiredFields = [
      "namKh",
      "ngayKyQd",
      "ngayHluc",
      "trichYeu",
      "soQdCc",
      "tenLoaiVthh",
      "tenCloaiVthh",
      "tenLoaiHinhNx",
      "tenKieuNx",
    ];
    requiredFields.forEach(fieldName => {
      this.formData.controls[fieldName].setValidators([Validators.required]);
      this.formData.controls[fieldName].updateValueAndValidity();
    });
  }
}
