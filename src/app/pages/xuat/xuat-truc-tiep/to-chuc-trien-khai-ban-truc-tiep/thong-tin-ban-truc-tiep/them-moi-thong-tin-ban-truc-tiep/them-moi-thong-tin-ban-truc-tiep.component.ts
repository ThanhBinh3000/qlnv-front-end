import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalService } from "ng-zorro-antd/modal";
import { NgxSpinnerService } from "ngx-spinner";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { Validators } from "@angular/forms";
import * as dayjs from "dayjs";
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { MESSAGE } from 'src/app/constants/message';
import { ChaoGiaMuaLeUyQuyenService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/chao-gia-mua-le-uy-quyen.service';
import { QuyetDinhPdKhBanTrucTiepService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/de-xuat-kh-btt/quyet-dinh-pd-kh-ban-truc-tiep.service';
import { ChiTietThongTinBanTrucTiepChaoGia } from 'src/app/models/DeXuatKeHoachBanTrucTiep';
import { FileDinhKem } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import { saveAs } from 'file-saver';
import { STATUS } from 'src/app/constants/status';

@Component({
  selector: 'app-them-moi-thong-tin-ban-truc-tiep',
  templateUrl: './them-moi-thong-tin-ban-truc-tiep.component.html',
  styleUrls: ['./them-moi-thong-tin-ban-truc-tiep.component.scss']
})
export class ThemMoiThongTinBanTrucTiepComponent extends Base2Component implements OnInit {
  //base init
  @Input() loaiVthh: String;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  dataDetail: any[] = [];
  radioValue: string = 'Chào giá';
  fileDinhKemUyQuyen: any[] = [];
  fileDinhKemMuaLe: any[] = [];
  listOfData: any[] = [];
  showFromTT: boolean;
  @Output()
  dataTableChange = new EventEmitter<any>();
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private chaoGiaMuaLeUyQuyenService: ChaoGiaMuaLeUyQuyenService,
    private quyetDinhPdKhBanTrucTiepService: QuyetDinhPdKhBanTrucTiepService
  ) {
    super(httpClient, storageService, notification, spinner, modal, chaoGiaMuaLeUyQuyenService);
    this.formData = this.fb.group(
      {
        id: [],
        idDviDtl: [],
        idDtl: [],
        namKh: [dayjs().get("year"), [Validators.required]],
        soQdPd: ['', [Validators.required]],
        maDvi: [''],
        tenDvi: ['', [Validators.required]],
        pthucBanTrucTiep: [''],
        diaDiemChaoGia: [],
        ngayMkho: [null, [Validators.required]],
        ngayKthuc: [null, [Validators.required]],
        loaiVthh: ['', [Validators.required]],
        tenLoaiVthh: ['', [Validators.required]],
        cloaiVthh: ['', [Validators.required]],
        tenCloaiVthh: ['', [Validators.required]],
        moTaHangHoa: [''],
        trangThai: [STATUS.CHUA_CAP_NHAT],
        tenTrangThai: ['Chưa cập nhật'],
        soQdPdKq: [''],
        ghiChu: ['']
      }
    );
  }
  rowItem: ChiTietThongTinBanTrucTiepChaoGia = new ChiTietThongTinBanTrucTiepChaoGia();
  dataEdit: { [key: string]: { edit: boolean; data: ChiTietThongTinBanTrucTiepChaoGia } } = {};

  async ngOnInit() {
    try {
      this.spinner.show();
      await Promise.all([
        this.loadDetail(this.idInput),
        this.initForm()
      ])
      this.spinner.hide();
    } catch (e) {
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
  }

  initForm() {
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI,
      maDvi: this.userInfo.MA_DVI,
    })
  }

  async loadDetail(id: number) {
    if (id > 0) {
      await this.quyetDinhPdKhBanTrucTiepService.getDtlDetail(id)
        .then(async (res) => {
          const dataDtl = res.data;
          this.dataTable = dataDtl.children
          this.formData.patchValue({
            idDtl: id,
            diaDiemChaoGia: dataDtl.diaDiemChaoGia,
            ngayMkho: dataDtl.ngayMkho,
            ngayKthuc: dataDtl.ngayKthuc,
            ghiChu: dataDtl.ghiChu,
            soQdPd: dataDtl.xhQdPdKhBttHdr.soQdPd,
            trangThai: dataDtl.trangThai,
            tenTrangThai: dataDtl.tenTrangThai,
            tenCloaiVthh: dataDtl.xhQdPdKhBttHdr.tenCloaiVthh,
            cloaiVthh: dataDtl.xhQdPdKhBttHdr.cloaiVthh,
            tenLoaiVthh: dataDtl.xhQdPdKhBttHdr.tenLoaiVthh,
            loaiVthh: dataDtl.xhQdPdKhBttHdr.loaiVthh,
            moTaHangHoa: dataDtl.xhQdPdKhBttHdr.moTaHangHoa,
          })
          this.fileDinhKemUyQuyen = dataDtl.fileDinhKemUyQuyen;
          this.fileDinhKemMuaLe = dataDtl.fileDinhKemMuaLe;
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }
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

  hoanThanhCapNhat() {
    // if (this.listOfData.length == 0) {
    //   this.notification.error(MESSAGE.ERROR, "Không thể hoàn thành cập nhập, chi tiết thông tin đấu giá không được để trống");
    //   return
    // }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn hoàn thành cập nhập ?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.idInput,
            trangThai: this.STATUS.HOAN_THANH_CAP_NHAT
          }
          let res = await this.chaoGiaMuaLeUyQuyenService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.THAO_TAC_SUCCESS);
            this.spinner.hide();
            this.loadDetail(this.idInput);
            this.goBack()
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
            this.spinner.hide();
          }
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        } finally {
          this.spinner.hide();
        }
      },
    });
  }


  async save() {
    this.spinner.show();
    try {
      this.helperService.markFormGroupTouched(this.formData);
      if (this.formData.invalid) {
        return;
      }
      let body = this.formData.value;
      body.children = this.listOfData;
      body.pthucBanTrucTiep = this.radioValue;
      body.fileDinhKemUyQuyen = this.fileDinhKemUyQuyen;
      body.fileDinhKemMuaLe = this.fileDinhKemMuaLe;
      let res = await this.chaoGiaMuaLeUyQuyenService.create(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        await this.loadDetail(this.idInput)
        this.goBack()
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e);
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }

  }

  addRow(): void {
    if (!this.listOfData) {
      this.listOfData = [];
    }
    this.listOfData = [...this.listOfData, this.rowItem];
    this.rowItem = new ChiTietThongTinBanTrucTiepChaoGia();
    this.emitDataTable();
    this.updateEditCache()
  }

  clearItemRow() {
    // let soLuong = this.rowItem.soLuong;
    this.rowItem = new ChiTietThongTinBanTrucTiepChaoGia();
    // this.rowItem.soLuong = soLuong;
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
    Object.assign(this.listOfData[idx], this.dataEdit[idx].data);
    this.dataEdit[idx].edit = false;
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
          }
          else {
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

  selectRow($event, item) {
    $event.target.parentElement.parentElement.querySelector('.selectedRow')?.classList.remove('selectedRow');
    $event.target.parentElement.classList.add('selectedRow');
    this.listOfData = item.children;
    this.showFromTT = true;
    this.formData.patchValue({
      idDviDtl: item.id,
    })
    this.emitDataTable()
    this.updateEditCache()
  }
}
