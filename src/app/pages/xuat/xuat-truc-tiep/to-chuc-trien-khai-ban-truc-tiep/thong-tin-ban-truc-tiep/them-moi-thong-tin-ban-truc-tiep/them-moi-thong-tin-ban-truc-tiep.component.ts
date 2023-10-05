import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalService } from "ng-zorro-antd/modal";
import { NgxSpinnerService } from "ngx-spinner";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { Validators } from "@angular/forms";
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { MESSAGE } from 'src/app/constants/message';
import {
  ChaoGiaMuaLeUyQuyenService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/chao-gia-mua-le-uy-quyen.service';
import { ChiTietThongTinBanTrucTiepChaoGia } from 'src/app/models/DeXuatKeHoachBanTrucTiep';
import { FileDinhKem } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import { saveAs } from 'file-saver';
import { STATUS } from 'src/app/constants/status';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { PREVIEW } from "../../../../../../constants/fileType";
import printJS from "print-js";

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
  listOfData: any[] = [];
  showFromTT: boolean;
  listLoaiHinhNx: any[] = [];
  listKieuNx: any[] = [];
  selected: boolean = false;
  soLuongDeXuat: number;
  donGiaDuocDuyet: number;
  idDviDtl: number;
  fileUyQuyen: any[] = [];
  fileBanLe: any[] = [];
  isBothFalse: boolean = true;

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
        pthucBanTrucTiep: ['01'],
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

  rowItem: ChiTietThongTinBanTrucTiepChaoGia = new ChiTietThongTinBanTrucTiepChaoGia();
  dataEdit: { [key: string]: { edit: boolean; data: ChiTietThongTinBanTrucTiepChaoGia } } = {};

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
      this.dataTable = data.children;
      if (this.dataTable && this.dataTable.length > 0) {
        this.showFirstRow(event, this.dataTable[0].children);
      }
      const formDataValue = {
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
      };
      let tongGiaTriHdong = 0;
      this.dataTable.forEach((item) => {
        item.children.forEach((child) => {
          tongGiaTriHdong += child.thanhTien;
        });
      });
      if (data.pthucBanTrucTiep) {
        this.formData.patchValue({
          tongGiaTriHdong: tongGiaTriHdong,
          pthucBanTrucTiep: data.pthucBanTrucTiep.toString()
        })
      }
      this.formData.patchValue(formDataValue);
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

  async save(isGuiDuyet?) {
    try {
      await this.helperService.ignoreRequiredForm(this.formData);
      const body = {
        ...this.formData.value,
        children: this.dataTable,
        fileUyQuyen: this.fileUyQuyen,
        fileBanLe: this.fileBanLe,
      };
      const data = await this.createUpdate(body);
      if (data && isGuiDuyet) {
        this.idInput;
        this.saveAndSend();
      } else {
        this.loadDetail(this.idInput);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      await this.helperService.restoreRequiredForm(this.formData);
    }
  }

  ValidatorToChucCaNhan() {
    this.isBothFalse = this.listOfData.every((item) => !item.luaChon);
  }

  async saveAndSend() {
    this.setValidator();
    if (this.formData.value.pthucBanTrucTiep === '01') {
      await this.ValidatorToChucCaNhan();
      if (this.listOfData.length === 0) {
        this.notification.error(MESSAGE.WARNING, 'Thông tin tổ chức cá nhân không được để trống.');
      } else if (this.isBothFalse) {
        this.notification.error(MESSAGE.WARNING, 'Ở mỗi mã đơn vị tài sản bạn phải chọn ít nhất một tổ chức cá nhân chào giá.');
      } else {
        await this.approve(this.idInput, STATUS.DA_HOAN_THANH, 'Văn bản sẵn sàng hoàn thành cập nhập ?');
      }
    } else {
      await this.approve(this.idInput, STATUS.DA_HOAN_THANH, 'Văn bản sẵn sàng hoàn thành cập nhập ?');
    }
  }

  onChangeThanhTien() {
    this.rowItem.thanhTien = this.rowItem.donGia * this.rowItem.soLuong
  }

  addRow(): void {
    if (!this.changeLuaChon(true)) {
      return;
    }
    if (!this.listOfData) {
      this.listOfData = [];
    }
    this.rowItem.idDviDtl = this.idDviDtl ? this.idDviDtl : undefined;
    const targetChild = this.dataTable
      .flatMap((item) => item.children)
      .find((child) => child.id === this.rowItem.idDviDtl);
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
          data: { ...item },
        };
      });
    }
  }

  startEdit(index: number) {
    this.dataEdit[index].edit = true;
  }

  cancelEdit(stt: number): void {
    this.dataEdit[stt] = {
      data: { ...this.listOfData[stt] },
      edit: false
    };
  }

  saveEdit(idx: number): void {
    if (this.validateSoLuongEdit(idx)) {
      const updatedData = this.dataEdit[idx].data;
      Object.assign(this.listOfData[idx], updatedData);
      this.dataEdit[idx].edit = false;
    }
  }

  onChangeThanhTienEdit(index) {
    this.dataEdit[index].data.thanhTien = this.dataEdit[index].data.soLuong * this.dataEdit[index].data.donGia
  }

  validateSoLuongEdit(index) {
    const data = this.dataEdit[index].data;
    const requiredFields = ['tochucCanhan', 'mst', 'diaDiemChaoGia', 'sdt', 'ngayChaoGia', 'soLuong', 'donGia',];
    if (!requiredFields.every(field => data[field])) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
      return false;
    }
    if (data.soLuong > this.soLuongDeXuat) {
      this.notification.error(
        MESSAGE.ERROR,
        `Số lượng chào giá phải nhỏ hơn hoặc bằng số lượng bán trực tiếp đề xuất (${this.soLuongDeXuat}) vui lòng nhập lại`
      );
      return false;
    }
    if (data.donGia < this.donGiaDuocDuyet) {
      this.notification.error(
        MESSAGE.ERROR,
        `Đơn giá chào giá phải lớn hơn hoặc bằng đơn giá được duyệt bán trực tiếp (${this.donGiaDuocDuyet}đ) vui lòng nhập lại`
      );
      return false;
    }
    if (this.listOfData[index].soLuong != data.soLuong) {
      this.listOfData[index].soLuong = data.soLuong;
    }
    return true;
  }

  changeLuaChon(isAdd?) {
    if (!this.rowItem.tochucCanhan || !this.rowItem.mst || !this.rowItem.diaDiemChaoGia || !this.rowItem.sdt || !this.rowItem.ngayChaoGia || !this.rowItem.soLuong || !this.rowItem.donGia) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
      return false;
    }
    if (this.rowItem.soLuong > this.soLuongDeXuat) {
      this.notification.error(
        MESSAGE.ERROR,
        `Số lượng chào giá phải nhỏ hơn hoặc bằng số lượng bán trực tiếp đề xuất (${this.soLuongDeXuat}) vui lòng nhập lại`
      );
      return false;
    }
    if (this.rowItem.donGia < this.donGiaDuocDuyet) {
      this.notification.error(
        MESSAGE.ERROR,
        `Đơn giá chào giá phải lớn hơn hoặc bằng đơn giá được duyệt bán trực tiếp (${this.donGiaDuocDuyet}đ) vui lòng nhập lại`
      );
      return false;
    }
    return true;
  }

  expandSet2 = new Set<number>();

  onExpandChange2(id: number, checked: boolean): void {
    checked ? this.expandSet2.add(id) : this.expandSet2.delete(id);
  }

  expandSet3 = new Set<number>();

  onExpandChange3(id: number, checked: boolean): void {
    checked ? this.expandSet3.add(id) : this.expandSet3.delete(id);
  }

  getNameFile(event?: any, tableName?: string, item?: FileDinhKem, type?: any) {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (fileList) {
      const itemFile = {
        name: fileList[0].name,
        file: event.target.files[0] as File,
      };
      this.uploadFileService
        .uploadFile(itemFile.file, itemFile.name)
        .then((resUpload) => {
          if (item) {
            item.fileName = resUpload.filename;
            item.fileSize = resUpload.size;
            item.fileUrl = resUpload.url;
          } else {
            if (!type) {
              if (!this.rowItem.fileDinhKems) {
                this.rowItem.fileDinhKems = new FileDinhKem();
              }
              this.rowItem.fileDinhKems.fileName = resUpload.filename;
              this.rowItem.fileDinhKems.fileSize = resUpload.size;
              this.rowItem.fileDinhKems.fileUrl = resUpload.url;
              this.rowItem.fileDinhKems.idVirtual = new Date().getTime();
            } else {
              if (!type.fileDinhKem) {
                type.fileDinhKem = new FileDinhKem();
              }
              type.fileDinhKem.fileName = resUpload.filename;
              type.fileDinhKem.fileSize = resUpload.size;
              type.fileDinhKem.fileUrl = resUpload.url;
              type.fileDinhKem.idVirtual = new Date().getTime();
            }

          }
        });
    }
  }

  downloadFile(item: FileDinhKem) {
    this.uploadFileService.downloadFile(item.fileUrl).subscribe((blob) => {
      saveAs(blob, item.fileName);
    });
  }

  async selectRow($event, item) {
    await this.spinner.show();
    if ($event.type == 'click') {
      this.selected = false
      $event.target.parentElement.parentElement.querySelector('.selectedRow')?.classList.remove('selectedRow');
      $event.target.parentElement.classList.add('selectedRow');
      this.listOfData = item.children;
      this.showFromTT = true;
      this.idDviDtl = item.id;
      this.emitDataTable()
      this.updateEditCache()
      this.soLuongDeXuat = item.soLuongDeXuat
      this.donGiaDuocDuyet = item.donGiaDuocDuyet
      await this.spinner.hide();
    } else {
      this.selected = true
      this.listOfData = item[0].children;
      this.showFromTT = true;
      this.idDviDtl = item[0].id;
      this.emitDataTable()
      this.updateEditCache()
      this.soLuongDeXuat = item[0].soLuongDeXuat
      this.donGiaDuocDuyet = item[0].donGiaDuocDuyet
      await this.spinner.hide();
    }
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
    printJS({ printable: this.printSrc, type: 'pdf', base64: true })
  }

  setValidator() {
    this.formData.controls["soQdPd"].setValidators([Validators.required]);
    this.formData.controls["maDvi"].setValidators([Validators.required]);
    this.formData.controls["tenDvi"].setValidators([Validators.required]);
    this.formData.controls["tenLoaiHinhNx"].setValidators([Validators.required]);
    this.formData.controls["tenKieuNx"].setValidators([Validators.required]);
    this.formData.controls["loaiVthh"].setValidators([Validators.required]);
    this.formData.controls["tenLoaiVthh"].setValidators([Validators.required]);
    this.formData.controls["cloaiVthh"].setValidators([Validators.required]);
    this.formData.controls["tenCloaiVthh"].setValidators([Validators.required]);
    this.formData.controls["ngayMkho"].setValidators([Validators.required]);
    this.formData.controls["ngayKthuc"].setValidators([Validators.required]);
    if (this.formData.value.pthucBanTrucTiep == '01') {
      this.formData.controls["diaDiemChaoGia"].setValidators([Validators.required]);
      this.formData.controls["ghiChuChaoGia"].setValidators([Validators.required]);
    } else {
      this.formData.controls["diaDiemChaoGia"].clearValidators();
      this.formData.controls["ghiChuChaoGia"].clearValidators();

    }
    if (this.formData.value.pthucBanTrucTiep != '01') {
      this.formData.controls["thoiHanBan"].setValidators([Validators.required]);
    } else {
      this.formData.controls["thoiHanBan"].clearValidators();
    }
  }
}
