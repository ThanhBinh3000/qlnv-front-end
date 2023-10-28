import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NzModalService} from "ng-zorro-antd/modal";
import {NgxSpinnerService} from "ngx-spinner";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {Validators} from "@angular/forms";
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {MESSAGE} from 'src/app/constants/message';
import {
  ChaoGiaMuaLeUyQuyenService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/chao-gia-mua-le-uy-quyen.service';
import {ChiTietThongTinBanTrucTiepChaoGia} from 'src/app/models/DeXuatKeHoachBanTrucTiep';
import {FileDinhKem} from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import {saveAs} from 'file-saver';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {PREVIEW} from "../../../../../../constants/fileType";
import printJS from "print-js";
import {LOAI_HANG_DTQG} from 'src/app/constants/config';
import {THONG_TIN_BAN_TRUC_TIEP} from "../../../../../../constants/status";

@Component({
  selector: 'app-them-moi-thong-tin-ban-truc-tiep',
  templateUrl: './them-moi-thong-tin-ban-truc-tiep.component.html',
  styleUrls: ['./them-moi-thong-tin-ban-truc-tiep.component.scss']
})
export class ThemMoiThongTinBanTrucTiepComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() isView: boolean;
  @Input() idInput: number;
  @Output() showListEvent = new EventEmitter<any>();
  @Output() dataTableChange = new EventEmitter<any>();
  LOAI_HANG_DTQG = LOAI_HANG_DTQG
  TRUC_TIEP = THONG_TIN_BAN_TRUC_TIEP
  listOfData: any[] = [];
  showFromTT: boolean;
  listLoaiHinhNx: any[] = [];
  listKieuNx: any[] = [];
  selected: boolean = false;
  idDviDtl: number;
  fileUyQuyen: any[] = [];
  fileBanLe: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private chaoGiaMuaLeUyQuyenService: ChaoGiaMuaLeUyQuyenService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, chaoGiaMuaLeUyQuyenService);
    this.formData = this.fb.group(
      {
        id: [],
        idDtl: [],
        namKh: [],
        soQdPd: [''],
        soQdDc: [''],
        maDvi: [''],
        tenDvi: [''],
        pthucBanTrucTiep: [THONG_TIN_BAN_TRUC_TIEP.CHAO_GIA],
        diaDiemChaoGia: [''],
        ngayMkho: [''],
        ngayKthuc: [''],
        loaiVthh: [''],
        tenLoaiVthh: [''],
        cloaiVthh: [''],
        tenCloaiVthh: [''],
        moTaHangHoa: [''],
        trangThai: [''],
        tenTrangThai: [''],
        soQdPdKq: [''],
        ghiChuChaoGia: [''],
        loaiHinhNx: [''],
        tenLoaiHinhNx: [''],
        kieuNx: [''],
        tenKieuNx: [''],
        thoiHanBan: [''],
        tongGiaTriHdong: [],
      }
    );
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      if (this.idInput > 0) {
        await Promise.all([
          this.onExpandChange(0, true),
          this.loadDetail(this.idInput),
        ]);
      }
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async showFirstRow($event, dataToChuc: any) {
    await this.selectRow($event, dataToChuc);
  }

  async loadDetail(id: number) {
    try {
      await this.spinner.show();
      if (id <= 0) return;
      const res = await this.chaoGiaMuaLeUyQuyenService.getDetail(id);
      if (res.msg !== MESSAGE.SUCCESS) {
        console.error('Failed to fetch data:', res.msg);
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        return;
      }
      const data = res.data;
      if (data.children && data.children.length > 0) {
        await this.showFirstRow(event, data.children[0].children);
      }
      this.formData.patchValue({
        idDtl: data.id,
        soQdPd: data.soQdPd,
        soQdDc: data.soQdDc,
        maDvi: data.maDvi,
        tenDvi: data.tenDvi,
        diaDiemChaoGia: data.diaDiemChaoGia,
        loaiHinhnx: data.loaiHinhNx,
        tenLoaiHinhNx: data.tenLoaiHinhNx,
        kieuNx: data.kieuNx,
        tenKieuNx: data.tenKieuNx,
        ngayMkho: data.ngayMkho,
        ngayKthuc: data.ngayKthuc,
        loaiVthh: data.loaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        moTaHangHoa: data.moTaHangHoa,
        thoiHanBan: data.thoiHanBan,
        ghiChuChaoGia: data.ghiChuChaoGia,
        trangThai: data.trangThai,
        tenTrangThai: data.tenTrangThai,
      })
      if (data.pthucBanTrucTiep) {
        data.children.forEach(item => {
          item.giaTriHopDong = 0;
          item.giaTriHopDong = item.children.reduce((prev, cur) => prev + cur.thanhTienDuocDuyet, 0);
        });
        this.formData.patchValue({
          tongGiaTriHdong: data.children.reduce((prev, cur) => prev + cur.giaTriHopDong, 0),
          pthucBanTrucTiep: data.pthucBanTrucTiep.toString()
        });
      }
      this.dataTable = data.children;
      this.fileUyQuyen = data.fileUyQuyen;
      this.fileBanLe = data.fileBanLe;
    } catch (e) {
      console.error('Error:', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  deleteTaiLieuDinhKemTag(data: any) {
    if (!this.isView) {
      const fileId = data.id;
      this.fileUyQuyen = this.fileUyQuyen.filter((x) => x.id !== fileId);
      this.fileBanLe = this.fileBanLe.filter((x) => x.id !== fileId);
    }
  }

  async save() {
    try {
      await this.helperService.ignoreRequiredForm(this.formData);
      const body = {
        ...this.formData.value,
        children: this.dataTable,
        fileUyQuyen: this.fileUyQuyen,
        fileBanLe: this.fileBanLe,
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
      const body = {
        ...this.formData.value,
        children: this.dataTable,
        fileUyQuyen: this.fileUyQuyen,
        fileBanLe: this.fileBanLe,
      };
      await super.saveAndSend(body, trangThai, msg, msgSuccess);
    } catch (e) {
      console.error('Error: ', e);
    } finally {
      await this.helperService.restoreRequiredForm(this.formData);
    }
  }

  rowItem: ChiTietThongTinBanTrucTiepChaoGia = new ChiTietThongTinBanTrucTiepChaoGia();
  dataEdit: { [key: string]: { edit: boolean; data: ChiTietThongTinBanTrucTiepChaoGia } } = {};

  onChangeThanhTien() {
    this.rowItem.thanhTien = this.rowItem.donGia * this.rowItem.soLuong
  }

  addRow(): void {
    if (!this.validateSoLuong()) {
      return;
    }
    if (!this.listOfData) {
      this.listOfData = [];
    }
    this.rowItem.idDviDtl = this.idDviDtl ? this.idDviDtl : undefined;
    const targetChild = this.dataTable.flatMap((item) => item.children).find((child) => child.id === this.rowItem.idDviDtl);
    if (targetChild) {
      targetChild.children = [...targetChild.children, this.rowItem];
    }
    this.listOfData.push(this.rowItem);
    this.rowItem = new ChiTietThongTinBanTrucTiepChaoGia();
    this.emitDataTable();
    this.updateEditCache();
  }

  isDisabledLuaChon(item) {
    return this.rowItem.luaChon !== item;
  }

  clearItemRow() {
    this.rowItem = new ChiTietThongTinBanTrucTiepChaoGia();
    this.rowItem.id = null;
  }

  emitDataTable() {
    this.dataTableChange.emit(this.listOfData);
  }

  deleteRow(index: any) {
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
          this.listOfData.splice(index, 1);
          this.updateEditCache();
        } catch (e) {
          console.error('Error:', e);
        }
      },
    });
  }

  updateEditCache(): void {
    if (this.listOfData) {
      this.listOfData.forEach((item, index) => {
        this.dataEdit[index] = {
          edit: false,
          data: {...item},
        };
      });
    }
  }

  startEdit(index: number) {
    this.dataEdit[index].edit = true;
  }

  cancelEdit(stt: number): void {
    this.dataEdit[stt] = {
      data: {...this.listOfData[stt]},
      edit: false
    };
  }

  saveEdit(idx: number): void {
    const updatedData = this.dataEdit[idx].data;
    Object.assign(this.listOfData[idx], updatedData);
    this.dataEdit[idx].edit = false;
  }

  onChangeThanhTienEdit(index) {
    this.dataEdit[index].data.thanhTien = this.dataEdit[index].data.soLuong * this.dataEdit[index].data.donGia
  }

  validateSoLuong(): boolean {
    let isValid = true;
    if (!this.rowItem.tochucCanhan || !this.rowItem.mst || !this.rowItem.diaDiemChaoGia || !this.rowItem.sdt || !this.rowItem.ngayChaoGia || !this.rowItem.soLuong || !this.rowItem.donGia) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
      isValid = false;
    }
    for (const data of this.dataTable) {
      for (const item of data.children) {
        if (this.idDviDtl === item.id) {
          if (this.rowItem.soLuong > item.soLuongDeXuat) {
            const errorMessage = `Số lượng chào giá phải bé hơn hoặc bằng số lượng đề xuất là ${item.soLuongDeXuat.toLocaleString()} (${item.donViTinh})!`;
            this.notification.error(MESSAGE.WARNING, errorMessage);
            isValid = false;
          }
        }
      }
    }
    return isValid;
  }

  expandSet2 = new Set<number>();

  onExpandChange2(id: number, checked: boolean): void {
    checked ? this.expandSet2.add(id) : this.expandSet2.delete(id);
  }

  expandSet3 = new Set<number>();

  onExpandChange3(id: number, checked: boolean): void {
    checked ? this.expandSet3.add(id) : this.expandSet3.delete(id);
  }

  async getNameFile(event?: any, tableName?: string, item?: FileDinhKem, type?: any) {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (!fileList) {
      return;
    }
    const itemFile = {
      name: fileList[0].name,
      file: event.target.files[0] as File,
    };
    try {
      const resUpload = await this.uploadFileService.uploadFile(itemFile.file, itemFile.name);
      if (item) {
        item.fileName = resUpload.filename;
        item.fileSize = resUpload.size;
        item.fileUrl = resUpload.url;
      } else {
        const targetObject = type ? type : this.rowItem;
        if (!targetObject.fileDinhKems) {
          targetObject.fileDinhKems = new FileDinhKem();
        }
        targetObject.fileDinhKems.fileName = resUpload.filename;
        targetObject.fileDinhKems.fileSize = resUpload.size;
        targetObject.fileDinhKems.fileUrl = resUpload.url;
        targetObject.fileDinhKems.idVirtual = new Date().getTime();
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  }

  downloadFile(item: FileDinhKem) {
    this.uploadFileService.downloadFile(item.fileUrl).subscribe((blob) => {
      saveAs(blob, item.fileName);
    });
  }

  async selectRow($event, dataChildren) {
    await this.spinner.show();
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
    this.idDviDtl = selectedItem.id;
    this.emitDataTable();
    this.updateEditCache();
    await this.spinner.hide();
  }

  async preview(id) {
    await this.chaoGiaMuaLeUyQuyenService.preview({
      tenBaoCao: 'Thông tin chào giá bán trực tiếp',
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
    saveAs(this.pdfSrc, "thong-tin-chao-gia-ban-truc-tiep.pdf");
  }

  downloadWord() {
    saveAs(this.wordSrc, "thong-tin-chao-gia-ban-truc-tiep.docx");
  }

  closeDlg() {
    this.showDlgPreview = false;
  }

  printPreview() {
    printJS({printable: this.printSrc, type: 'pdf', base64: true})
  }

  setValidForm() {
    const formDataControls = this.formData.controls;
    const requiredFields = [
      "soQdPd",
      "maDvi",
      "tenDvi",
      "tenLoaiHinhNx",
      "tenKieuNx",
      "loaiVthh",
      "tenLoaiVthh",
      "cloaiVthh",
      "tenCloaiVthh",
      "ngayMkho",
      "ngayKthuc"
    ];
    requiredFields.forEach(field => {
      formDataControls[field].setValidators([Validators.required]);
    });
    if (this.formData.value.pthucBanTrucTiep === THONG_TIN_BAN_TRUC_TIEP.CHAO_GIA) {
      formDataControls["diaDiemChaoGia"].setValidators([Validators.required]);
      formDataControls["ghiChuChaoGia"].setValidators([Validators.required]);
    } else {
      formDataControls["diaDiemChaoGia"].clearValidators();
      formDataControls["ghiChuChaoGia"].clearValidators();
    }
    if (this.formData.value.pthucBanTrucTiep !== THONG_TIN_BAN_TRUC_TIEP.CHAO_GIA) {
      formDataControls["thoiHanBan"].setValidators([Validators.required]);
    } else {
      formDataControls["thoiHanBan"].clearValidators();
    }
    Object.keys(formDataControls).forEach(field => {
      formDataControls[field].updateValueAndValidity();
    });
  }
}
