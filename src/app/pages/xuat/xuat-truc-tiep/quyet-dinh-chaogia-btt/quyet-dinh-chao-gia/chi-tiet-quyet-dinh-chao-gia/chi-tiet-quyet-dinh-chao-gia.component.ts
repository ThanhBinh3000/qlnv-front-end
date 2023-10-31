import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {
  QuyetDinhPdKhBanTrucTiepService
} from "../../../../../../services/qlnv-hang/xuat-hang/ban-truc-tiep/de-xuat-kh-btt/quyet-dinh-pd-kh-ban-truc-tiep.service";
import {
  QdPdKetQuaBttService
} from "../../../../../../services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/qd-pd-ket-qua-btt.service";
import {
  ChaoGiaMuaLeUyQuyenService
} from "../../../../../../services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/chao-gia-mua-le-uy-quyen.service";
import {ChiTietThongTinBanTrucTiepChaoGia, FileDinhKem} from "../../../../../../models/DeXuatKeHoachBanTrucTiep";
import {MESSAGE} from "../../../../../../constants/message";
import {STATUS} from "../../../../../../constants/status";
import * as dayjs from "dayjs";
import {
  DialogTableSelectionComponent
} from "../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import {Validators} from "@angular/forms";
import {saveAs} from 'file-saver';
import {PREVIEW} from "../../../../../../constants/fileType";
import printJS from "print-js";
import {LOAI_HANG_DTQG} from 'src/app/constants/config';

@Component({
  selector: 'app-chi-tiet-quyet-dinh-chao-gia',
  templateUrl: './chi-tiet-quyet-dinh-chao-gia.component.html',
  styleUrls: ['./chi-tiet-quyet-dinh-chao-gia.component.scss']
})
export class ChiTietQuyetDinhChaoGiaComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() isView: boolean;
  @Input() idInput: number;
  @Input() isViewOnModal: boolean;
  @Output() showListEvent = new EventEmitter<any>();
  LOAI_HANG_DTQG = LOAI_HANG_DTQG;
  maHauTo: any;
  listOfData: any[] = [];
  showFromTT: boolean;
  selected: boolean = false;
  luaChon: boolean = false;
  loadQuyetDinhKetQua: any[] = [];
  dataThongTinChaoGia: any[] = [];

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private quyetDinhPdKhBanTrucTiepService: QuyetDinhPdKhBanTrucTiepService,
    private qdPdKetQuaBttService: QdPdKetQuaBttService,
    private chaoGiaMuaLeUyQuyenService: ChaoGiaMuaLeUyQuyenService
  ) {
    super(httpClient, storageService, notification, spinner, modal, qdPdKetQuaBttService);

    this.formData = this.fb.group({
      id: [],
      namKh: [],
      soQdKq: [''],
      ngayKy: [''],
      ngayHluc: [''],
      idQdPd: [],
      soQdPd: [''],
      idQdDc: [],
      soQdDc: [''],
      idChaoGia: [],
      loaiHinhNx: [''],
      kieuNx: [''],
      trichYeu: [''],
      maDvi: [''],
      diaDiemChaoGia: [''],
      ngayMkho: [''],
      ngayKthuc: [''],
      loaiVthh: [''],
      cloaiVthh: [''],
      moTaHangHoa: [''],
      ghiChu: [''],
      slHdDaKy: [],
      slHdChuaKy: [],
      tongSoLuong: [],
      tongGiaTriHdong: [],
      trangThai: [''],
      tenTrangThai: [''],
      lyDoTuChoi: [''],
      tenDvi: [''],
      tenLoaiHinhNx: [''],
      tenKieuNx: [''],
      tenLoaiVthh: [''],
      tenCloaiVthh: [''],
      fileCanCu: [new Array<FileDinhKem>()],
      fileDaKy: [new Array<FileDinhKem>()],
      fileQd: [new Array<FileDinhKem>()],
    });
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      this.maHauTo = '/' + this.userInfo.MA_QD;
      if (this.idInput > 0) {
        await this.getDetail(this.idInput);
      } else {
        await this.initForm();
      }
      await this.onExpandChange(0, true);
    } catch (e) {
      console.error('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  initForm() {
    this.formData.patchValue({
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự thảo',
      namKh: dayjs().get('year'),
    });
  }

  async showFirstRow($event, dataToChuc: any) {
    await this.selectRow($event, dataToChuc);
  }

  async getDetail(idInput) {
    if (!idInput) return;
    const res = await this.detail(idInput);
    if (!res) return;
    const {soQdKq, children} = res;
    this.formData.patchValue({
      soQdKq: soQdKq?.split('/')[0] || null,
    });
    this.dataTable = children;
    if (this.dataTable?.length > 0) {
      this.showFirstRow(event, this.dataTable[0].children);
    }
  }

  async save() {
    await this.helperService.ignoreRequiredForm(this.formData);
    this.formData.controls["soQdKq"].setValidators([Validators.required]);
    const soQdKq = this.formData.value.soQdKq;
    const body = {
      ...this.formData.value,
      soQdKq: soQdKq ? `${soQdKq}${this.maHauTo}` : null,
      children: this.dataTable,
    };
    await this.createUpdate(body);
    await this.helperService.restoreRequiredForm(this.formData);
  }

  async saveAndSend(trangThai: string, msg: string, msgSuccess?: string) {
    this.setValidForm();
    const soQdKq = this.formData.value.soQdKq;
    const body = {
      ...this.formData.value,
      soQdKq: soQdKq ? `${soQdKq}${this.maHauTo}` : null,
      children: this.dataTable,
    };
    await super.saveAndSend(body, trangThai, msg, msgSuccess);
  }

  async openThongtinChaoGia() {
    try {
      this.spinner.show();
      const body = {
        namKh: this.formData.value.namKh,
        loaiVthh: this.loaiVthh,
        trangThai: STATUS.DA_HOAN_THANH,
        pthucBanTrucTiep: ['01'],
      };
      await this.loadQdNvXuatHang();
      const res = await this.chaoGiaMuaLeUyQuyenService.search(body);
      if (res && res.msg === MESSAGE.SUCCESS) {
        const data = res.data.content;
        const set = new Set(this.loadQuyetDinhKetQua.map(item => item.idChaoGia));
        this.dataThongTinChaoGia = data.filter(item => !set.has(item.id));
        this.dataThongTinChaoGia = this.dataThongTinChaoGia.map(item => {
          item.soQd = item.soQdDc !== null ? item.soQdDc : item.soQdPd;
          return item;
        });
      } else if (res && res.msg) {
        this.notification.error(MESSAGE.ERROR, res.msg);
      } else {
        this.notification.error(MESSAGE.ERROR, 'Unknown error occurred.');
      }
      const modalQD = this.modal.create({
        nzTitle: 'DANH SÁCH THÔNG TIN CHÀO GIÁ',
        nzContent: DialogTableSelectionComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          dataTable: this.dataThongTinChaoGia,
          dataHeader: ['Số QĐ phê duyệt/điều chỉnh KH BTT', 'Số Đề xuất KH BTT', 'Loại hàng hóa'],
          dataColumn: ['soQd', 'soDxuat', 'tenLoaiVthh']
        },
      });
      modalQD.afterClose.subscribe(async (data) => {
        if (data) {
          await this.onChangeTtin(data.id);
        }
      });
    } catch (error) {
      console.error('Error during openThongtinChaoGia:', error);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  async loadQdNvXuatHang() {
    let body = {
      namKh: this.formData.value.namKh,
      loaiVthh: this.loaiVthh,
    };
    const res = await this.qdPdKetQuaBttService.search(body);
    if (res.msg !== MESSAGE.SUCCESS) {
      this.notification.error(MESSAGE.ERROR, res.msg);
      return;
    }
    const data = res.data.content;
    if (!data || data.length === 0) {
      return;
    }
    this.loadQuyetDinhKetQua = data
  }

  async onChangeTtin(id) {
    if (id <= 0) {
      return;
    }
    try {
      await this.spinner.show();
      const res = await this.chaoGiaMuaLeUyQuyenService.getDetail(id);
      if (res.msg !== MESSAGE.SUCCESS || !res.data) {
        return;
      }
      const data = res.data;
      this.formData.patchValue({
        idQdPd: data.xhQdDchinhKhBttHdr ? data.xhQdDchinhKhBttHdr.idQdPd : data.idHdr,
        soQdPd: data.soQdPd,
        idQdDc: data.xhQdDchinhKhBttHdr ? data.idHdr : null,
        soQdDc: data.soQdDc,
        idChaoGia: data.id,
        tenDvi: data.tenDvi,
        diaDiemChaoGia: data.diaDiemChaoGia,
        ngayMkho: data.ngayMkho,
        ngayKthuc: data.ngayKthuc,
        loaiVthh: data.loaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        moTaHangHoa: data.moTaHangHoa,
        pthucBanTrucTiep: data.pthucBanTrucTiep,
        loaiHinhNx: data.loaiHinhNx,
        tenLoaiHinhNx: data.tenLoaiHinhNx,
        kieuNx: data.kieuNx,
        tenKieuNx: data.tenKieuNx,
        tongSoLuong: data.tongSoLuong,
      });
      this.dataTable = data.children;
      if (this.dataTable && this.dataTable.length > 0) {
        this.showFirstRow(event, this.dataTable[0].children);
      }
      if (this.dataTable) {
        let tongGiaTriHdong: number = 0;
        this.dataTable.forEach((item) => {
          item.id = null;
          item.children.forEach((child) => {
            child.id = null;
            tongGiaTriHdong += child.thanhTienDuocDuyet;
            child.children.forEach((s) => {
              s.id = null;
              if (s.fileDinhKems) {
                s.fileDinhKems.id = null;
              }
            });
          });
        });
        this.formData.patchValue({
          tongGiaTriHdong: tongGiaTriHdong,
        });
      }
    } catch (e) {
      console.error('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  dataEdit: { [key: string]: { edit: boolean; data: ChiTietThongTinBanTrucTiepChaoGia } } = {};

  startEdit(index: number): void {
    this.listOfData[index].edit = true
  }

  saveEdit(index: number): void {
    this.listOfData[index].edit = false
    this.formData.patchValue({})
  }

  cancelEdit(index: number): void {
    this.listOfData[index].edit = false
    this.formData.patchValue({})
  }

  downloadFile(item: FileDinhKem) {
    this.uploadFileService.downloadFile(item.fileUrl)
      .subscribe((blob) => {
        saveAs(blob, item.fileName);
      }, (error) => {
        console.error('Error while downloading file:', error);
      });
  }

  async selectRow($event, dataChildren) {
    const isClickEvent = $event.type === 'click';
    this.selected = !isClickEvent;
    const selectedRow = isClickEvent
      ? $event.target.parentElement.parentElement?.querySelector('.selectedRow')
      : null;
    if (selectedRow) {
      selectedRow.classList.remove('selectedRow');
    }
    if ($event.target.parentElement) {
      $event.target.parentElement.classList.add('selectedRow');
    }
    const selectedItem = isClickEvent ? dataChildren : dataChildren[0];
    this.listOfData = selectedItem.children;
    this.showFromTT = true;
  }

  isDisabledQD() {
    return this.formData.value.id !== null;
  }

  isDisabledLuaChon(item) {
    return this.luaChon !== item;
  }

  async preview(id) {
    await this.qdPdKetQuaBttService.preview({
      tenBaoCao: 'Quyết định phê duyệt kết quả chào giá',
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

  downloadPdf() {
    saveAs(this.pdfSrc, "quyet-dinh-phe-duyet-ke-qua-chao-gia.pdf");
  }

  downloadWord() {
    saveAs(this.wordSrc, "quyet-dinh-phe-duyet-ke-qua-chao-gia.docx");
  }

  closeDlg() {
    this.showDlgPreview = false;
  }

  printPreview() {
    printJS({printable: this.printSrc, type: 'pdf', base64: true})
  }


  setValidForm() {
    const fieldsToValidate = [
      "namKh",
      "tenDvi",
      "soQdKq",
      "ngayKy",
      "ngayHluc",
      "loaiHinhNx",
      "trichYeu",
      "diaDiemChaoGia",
      "ngayMkho",
      "ngayKthuc",
      "loaiVthh",
      "tenLoaiVthh",
      "cloaiVthh",
      "tenCloaiVthh",
    ];
    fieldsToValidate.forEach(field => {
      this.formData.controls[field].setValidators([Validators.required]);
    });
  }
}
