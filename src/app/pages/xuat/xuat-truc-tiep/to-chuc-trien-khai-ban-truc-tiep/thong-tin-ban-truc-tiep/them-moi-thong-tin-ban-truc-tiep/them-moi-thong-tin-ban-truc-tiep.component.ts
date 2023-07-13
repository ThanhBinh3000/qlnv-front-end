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
import {
  QuyetDinhPdKhBanTrucTiepService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/de-xuat-kh-btt/quyet-dinh-pd-kh-ban-truc-tiep.service';
import {ChiTietThongTinBanTrucTiepChaoGia} from 'src/app/models/DeXuatKeHoachBanTrucTiep';
import {FileDinhKem} from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import {saveAs} from 'file-saver';
import {STATUS} from 'src/app/constants/status';
import {DanhMucService} from 'src/app/services/danhmuc.service';

@Component({
  selector: 'app-them-moi-thong-tin-ban-truc-tiep',
  templateUrl: './them-moi-thong-tin-ban-truc-tiep.component.html',
  styleUrls: ['./them-moi-thong-tin-ban-truc-tiep.component.scss']
})
export class ThemMoiThongTinBanTrucTiepComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: String;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Output()
  dataTableChange = new EventEmitter<any>();
  fileDinhKemUyQuyen: any[] = [];
  fileDinhKemMuaLe: any[] = [];
  listOfData: any[] = [];
  showFromTT: boolean;
  listLoaiHinhNx: any[] = [];
  listKieuNx: any[] = [];
  selected: boolean = false;
  soLuongDeXuat: number;
  donGiaDuocDuyet: number;
  idDviDtl: number;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private chaoGiaMuaLeUyQuyenService: ChaoGiaMuaLeUyQuyenService,
    private quyetDinhPdKhBanTrucTiepService: QuyetDinhPdKhBanTrucTiepService
  ) {
    super(httpClient, storageService, notification, spinner, modal, chaoGiaMuaLeUyQuyenService);
    this.formData = this.fb.group(
      {
        id: [],
        idDtl: [],
        namKh: [],
        soQdPd: [''],
        maDvi: [''],
        tenDvi: [''],
        pthucBanTrucTiep: [''],
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
        ghiChu: [''],
        loaiHinhNx: [''],
        kieuNx: [''],
        thoiHanBan: [''],
      }
    );
  }

  rowItem: ChiTietThongTinBanTrucTiepChaoGia = new ChiTietThongTinBanTrucTiepChaoGia();
  dataEdit: { [key: string]: { edit: boolean; data: ChiTietThongTinBanTrucTiepChaoGia } } = {};

  async ngOnInit() {
    try {
      this.spinner.show();
      await Promise.all([
        this.onExpandChange(0, true),
        this.loadDetail(this.idInput),
        this.initForm(),
        this.loadDataComboBox(),
      ])
      this.spinner.hide();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      await this.spinner.hide();
    } finally {
      await this.spinner.hide();
    }
  }

  async loadDataComboBox() {
    // loại hình nhập xuất
    this.listLoaiHinhNx = [];
    let resNx = await this.danhMucService.danhMucChungGetAll('LOAI_HINH_NHAP_XUAT');
    if (resNx.msg == MESSAGE.SUCCESS) {
      this.listLoaiHinhNx = resNx.data.filter(item => item.apDung == 'XUAT_TT');
    }
    // kiểu nhập xuất
    this.listKieuNx = [];
    let resKieuNx = await this.danhMucService.danhMucChungGetAll('KIEU_NHAP_XUAT');
    if (resKieuNx.msg == MESSAGE.SUCCESS) {
      this.listKieuNx = resKieuNx.data
    }
  }

  initForm() {
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI,
      maDvi: this.userInfo.MA_DVI,
      pthucBanTrucTiep: '01',
      trangThai: STATUS.CHUA_CAP_NHAT,
      tenTrangThai: 'Chưa cập nhật',
    })
  }

  async showFirstRow($event, dataToChuc: any) {
    await this.selectRow($event, dataToChuc);
  }

  async loadDetail(id: number) {
    await this.spinner.show();
    if (id > 0) {
      await this.quyetDinhPdKhBanTrucTiepService.getDtlDetail(id)
        .then(async (res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const dataDtl = res.data;
            this.dataTable = dataDtl.children
            if (this.dataTable && this.dataTable.length > 0) {
              this.showFirstRow(event, this.dataTable[0].children);
            }
            this.formData.patchValue({
              idDtl: id,
              diaDiemChaoGia: dataDtl.diaDiemChaoGia,
              ngayMkho: dataDtl.ngayMkho,
              ngayKthuc: dataDtl.ngayKthuc,
              thoiHanBan: dataDtl.thoiHanBan,
              ghiChu: dataDtl.ghiChu,
              soQdPd: dataDtl.xhQdPdKhBttHdr.soQdPd,
              trangThai: dataDtl.trangThai,
              tenTrangThai: dataDtl.tenTrangThai,
              tenCloaiVthh: dataDtl.xhQdPdKhBttHdr.tenCloaiVthh,
              cloaiVthh: dataDtl.xhQdPdKhBttHdr.cloaiVthh,
              tenLoaiVthh: dataDtl.xhQdPdKhBttHdr.tenLoaiVthh,
              loaiVthh: dataDtl.xhQdPdKhBttHdr.loaiVthh,
              moTaHangHoa: dataDtl.xhQdPdKhBttHdr.moTaHangHoa,
              loaiHinhNx: dataDtl.xhQdPdKhBttHdr.loaiHinhNx,
              kieuNx: dataDtl.xhQdPdKhBttHdr.kieuNx,
            })
            this.fileDinhKemUyQuyen = dataDtl.fileDinhKemUyQuyen;
            this.fileDinhKemMuaLe = dataDtl.fileDinhKemMuaLe;
            if (dataDtl.pthucBanTrucTiep) {
              this.formData.patchValue({
                pthucBanTrucTiep: dataDtl.pthucBanTrucTiep.toString()
              })
            }
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }
    await this.spinner.hide();
  }

  deleteTaiLieuDinhKemTag(data: any) {
    if (!this.isView) {
      this.fileDinhKemUyQuyen = this.fileDinhKemUyQuyen.filter(
        (x) => x.id !== data.id,
      );
      this.fileDinhKemMuaLe = this.fileDinhKemMuaLe.filter(
        (x) => x.id !== data.id,
      );
    }
  }

  async save(isGuiDuyet?) {
    await this.spinner.show();
    this.setValidator(isGuiDuyet)
    let body = this.formData.value;
    body.children = this.dataTable
    body.fileDinhKemUyQuyen = this.fileDinhKemUyQuyen;
    body.fileDinhKemMuaLe = this.fileDinhKemMuaLe;
    let data = await this.createUpdate(body);
    if (data) {
      if (isGuiDuyet) {
        this.idInput;
        this.hoanThanhCapNhat();
      } else {
        this.loadDetail(this.idInput);
      }
    }
    await this.spinner.hide();
  }

  hoanThanhCapNhat() {
    if (this.formData.value.pthucBanTrucTiep == '01') {
      if (this.listOfData.length == 0) {
        this.notification.error(
          MESSAGE.ERROR,
          'Thông tin tổ chức cá nhân không dược để trống.',
        );
        return;
      }
      let isBothFalse = true;
      for (const obj of this.listOfData) {
        if (obj.luaChon === true) {
          isBothFalse = false;
          break;
        }
      }
      if (isBothFalse) {
        this.notification.error(
          MESSAGE.ERROR,
          'Ở mỗi mã đơn vị tài sản bạn phải chọn ít nhất một tổ chức cá nhân chào giá.',
        );
        return false;
      }
    }
    let trangThai = STATUS.HOAN_THANH_CAP_NHAT;
    let mesg = 'Văn bản sẵn sàng hoàn thành cập nhập ?'
    this.approve(this.idInput, trangThai, mesg);
  }

  addRow(): void {
    if (this.idDviDtl) {
      this.rowItem.idDviDtl = this.idDviDtl
      if (this.changeLuaChon(true)) {
        if (!this.listOfData) {
          this.listOfData = [];
        }
        this.dataTable.forEach((item) => {
          item.children.filter(s => s.id == this.rowItem.idDviDtl).forEach((child) => {
            child.children = [...child.children, this.rowItem];
          })
        })
        this.listOfData = [...this.listOfData, this.rowItem];
        this.rowItem = new ChiTietThongTinBanTrucTiepChaoGia();
        this.emitDataTable();
        this.updateEditCache()
      }
    }
  }

  isDisabledLuaChon(item) {
    if (this.rowItem.luaChon == item) {
      return false
    } else {
      return true;
    }
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
          console.log('error', e);
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
    if (this.validateSoLuongEdit(idx)) {
      Object.assign(this.listOfData[idx], this.dataEdit[idx].data);
      this.dataEdit[idx].edit = false;
    }
  }

  validateSoLuongEdit(index) {
    let tongSoLuong = 0
    if (this.listOfData[index].soLuong != this.dataEdit[index].data.soLuong) {
      this.listOfData[index].soLuong = this.dataEdit[index].data.soLuong;
    }
    this.listOfData.forEach(item => {
      tongSoLuong += item.soLuong
    })
    if (this.dataEdit[index].data.tochucCanhan && this.dataEdit[index].data.mst && this.dataEdit[index].data.diaDiemChaoGia && this.dataEdit[index].data.sdt && this.dataEdit[index].data.ngayChaoGia && this.dataEdit[index].data.soLuong && this.dataEdit[index].data.donGia) {
      if (this.dataEdit[index].data.soLuong > this.soLuongDeXuat) {
        this.notification.error(MESSAGE.ERROR, " Số lượng chào giá phải nhỏ hơn hoặc bằng số lượng bán trực tiếp đề xuất (" + this.soLuongDeXuat + ") vui lòng nhập lại")
        return;
      } else if (this.dataEdit[index].data.donGia < this.donGiaDuocDuyet) {
        this.notification.error(MESSAGE.ERROR, " Đơn giá chào giá phải lớn hơn hoặc bằng đơn giá được duyệt bán trực tiếp (" + this.donGiaDuocDuyet + "đ) vui lòng nhập lại")
        return;
      } else {
        return true;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
      return false
    }
  }

  changeLuaChon(isAdd?) {
    if (this.rowItem.tochucCanhan && this.rowItem.mst && this.rowItem.diaDiemChaoGia && this.rowItem.sdt && this.rowItem.ngayChaoGia && this.rowItem.soLuong && this.rowItem.donGia) {
      let tongSoLuong = 0
      if (isAdd) {
        tongSoLuong += this.rowItem.soLuong;
      }
      this.listOfData.forEach(item => {
        tongSoLuong += item.soLuong
      })
      if (this.rowItem.soLuong > this.soLuongDeXuat) {
        this.notification.error(MESSAGE.ERROR, " Số lượng chào giá phải nhỏ hơn hoặc bằng số lượng bán trực tiếp đề xuất (" + this.soLuongDeXuat + ") vui lòng nhập lại")
        return false;
      } else if (this.rowItem.donGia < this.donGiaDuocDuyet) {
        this.notification.error(MESSAGE.ERROR, " Đơn giá chào giá phải lớn hơn hoặc bằng đơn giá được duyệt bán trực tiếp (" + this.donGiaDuocDuyet + "đ) vui lòng nhập lại")
        return false;
      }
      return true;
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
      return false;
    }
  }

  expandSet2 = new Set<number>();

  onExpandChange2(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet2.add(id);
    } else {
      this.expandSet2.delete(id);
    }
  }

  expandSet3 = new Set<number>();

  onExpandChange3(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet3.add(id);
    } else {
      this.expandSet3.delete(id);
    }
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

  isDisable(): boolean {
    if (this.formData.value.trangThai == STATUS.CHUA_CAP_NHAT || this.formData.value.trangThai == STATUS.DANG_CAP_NHAT) {
      return false
    } else {
      return true
    }
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

  setValidator(isGuiDuyet?) {
    if (isGuiDuyet) {
      this.formData.controls["soQdPd"].setValidators([Validators.required]);
      this.formData.controls["maDvi"].setValidators([Validators.required]);
      this.formData.controls["tenDvi"].setValidators([Validators.required]);
      this.formData.controls["loaiHinhNx"].setValidators([Validators.required]);
      this.formData.controls["kieuNx"].setValidators([Validators.required]);
      this.formData.controls["loaiVthh"].setValidators([Validators.required]);
      this.formData.controls["tenLoaiVthh"].setValidators([Validators.required]);
      this.formData.controls["cloaiVthh"].setValidators([Validators.required]);
      this.formData.controls["tenCloaiVthh"].setValidators([Validators.required]);
      this.formData.controls["ngayMkho"].setValidators([Validators.required]);
      this.formData.controls["ngayKthuc"].setValidators([Validators.required]);
    } else {
      this.formData.controls["soQdPd"].clearValidators();
      this.formData.controls["maDvi"].clearValidators();
      this.formData.controls["tenDvi"].clearValidators();
      this.formData.controls["loaiHinhNx"].clearValidators();
      this.formData.controls["kieuNx"].clearValidators();
      this.formData.controls["loaiVthh"].clearValidators();
      this.formData.controls["tenLoaiVthh"].clearValidators();
      this.formData.controls["cloaiVthh"].clearValidators();
      this.formData.controls["tenCloaiVthh"].clearValidators();
      this.formData.controls["ngayMkho"].clearValidators();
      this.formData.controls["ngayKthuc"].clearValidators();
    }
    if (this.formData.value.pthucBanTrucTiep == '01' && isGuiDuyet) {
      this.formData.controls["diaDiemChaoGia"].setValidators([Validators.required]);
      this.formData.controls["ghiChu"].setValidators([Validators.required]);
    } else {
      this.formData.controls["diaDiemChaoGia"].clearValidators();
      this.formData.controls["ghiChu"].clearValidators();

    }
    if (this.formData.value.pthucBanTrucTiep != '01' && isGuiDuyet) {
      this.formData.controls["thoiHanBan"].setValidators([Validators.required]);
    } else {
      this.formData.controls["thoiHanBan"].clearValidators();
    }
  }
}
