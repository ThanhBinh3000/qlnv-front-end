import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
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
  showFromTT: boolean = false;
  luaChon: boolean = false;
  loadQuyetDinhKetQua: any[] = [];
  dataThongTinChaoGia: any[] = [];

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
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
      this.onExpandChange(0, true);
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

  async getDetail(idInput) {
    if (!idInput) {
      return;
    }
    const data = await this.detail(idInput);
    this.formData.patchValue({
      soQdKq: data.soQdKq?.split('/')[0] || null,
    });
    this.dataTable = data.children;
    await this.selectRow(this.dataTable.flatMap(item => item.children)[0]);
  }

  async save() {
    try {
      await this.helperService.ignoreRequiredForm(this.formData);
      this.formData.controls["soQdPd"].setValidators([Validators.required]);
      const soQdKq = this.formData.value.soQdKq;
      const body = {
        ...this.formData.value,
        soQdKq: soQdKq ? `${soQdKq}${this.maHauTo}` : null,
        children: this.dataTable,
      };
      await this.createUpdate(body);
      await this.helperService.restoreRequiredForm(this.formData);
    } catch (e) {
      console.error('Error: ', e);
    } finally {
      await this.helperService.restoreRequiredForm(this.formData);
    }
  }

  async saveAndSend(trangThai: string, msg: string, msgSuccess?: string) {
    try {
      this.setValidForm();
      const soQdKq = this.formData.value.soQdKq;
      const body = {
        ...this.formData.value,
        soQdKq: soQdKq ? `${soQdKq}${this.maHauTo}` : null,
        children: this.dataTable,
      };
      await super.saveAndSend(body, trangThai, msg, msgSuccess);
    } catch (e) {
      console.error('Error: ', e);
    } finally {
      await this.helperService.restoreRequiredForm(this.formData);
    }
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
        const set = new Set(this.loadQuyetDinhKetQua.map(item => item.idChaoGia));
        this.dataThongTinChaoGia = res.data.content.filter(item => !set.has(item.id));
        this.dataThongTinChaoGia = this.dataThongTinChaoGia.map(item => {
          item.soQd = item.soQdDc ? item.soQdDc : item.soQdPd;
          return item;
        });
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
    } catch (e) {
      console.error('Error: ', e);
    } finally {
      await this.spinner.hide();
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
        idQdPd: data.xhQdPdKhBttHdr.type === 'QDDC' ? data.xhQdPdKhBttHdr.idQdPd : data.idHdr,
        soQdPd: data.soQdPd,
        idQdDc: data.xhQdPdKhBttHdr.type === 'QDDC' ? data.idHdr : null,
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
        tongGiaTriHdong: data.thanhTienDuocDuyet,
      });
      this.dataTable = data.children;
      await this.selectRow(this.dataTable.flatMap(item => item.children)[0]);
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

  async selectRow(data: any) {
    this.dataTableAll = this.dataTable.flatMap(item => item.children);
    if (!data.selected) {
      this.dataTableAll.forEach(item => item.selected = false);
      data.selected = true;
      const findndex = this.dataTableAll.findIndex(child => child.id == data.id);
      this.listOfData = this.dataTableAll[findndex].children;
      this.showFromTT = true;
    }
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
      "soQdKq",
      "soQdPd",
      "ngayMkho",
      "ngayKthuc",
    ];
    fieldsToValidate.forEach(field => {
      this.formData.controls[field].setValidators([Validators.required]);
    });
  }
}
