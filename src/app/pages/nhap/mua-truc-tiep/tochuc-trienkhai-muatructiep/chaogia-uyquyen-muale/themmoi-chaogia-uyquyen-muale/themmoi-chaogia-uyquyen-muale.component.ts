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
import { FileDinhKem } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import { saveAs } from 'file-saver';
import { STATUS } from 'src/app/constants/status';
import { QuyetDinhPheDuyetKeHoachMTTService } from 'src/app/services/quyet-dinh-phe-duyet-ke-hoach-mtt.service';
import { ChaogiaUyquyenMualeService } from 'src/app/services/chaogia-uyquyen-muale.service';
import { ChiTietThongTinChaoGia } from 'src/app/models/DeXuatKeHoachMuaTrucTiep';


@Component({
  selector: 'app-themmoi-chaogia-uyquyen-muale',
  templateUrl: './themmoi-chaogia-uyquyen-muale.component.html',
  styleUrls: ['./themmoi-chaogia-uyquyen-muale.component.scss']
})
export class ThemmoiChaogiaUyquyenMualeComponent extends Base2Component implements OnInit {
  //base init
  @Input() loaiVthh: String;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  dataDetail: any[] = [];
  radioValue: string = '01';
  fileDinhKemUyQuyen: any[] = [];
  fileDinhKemMuaLe: any[] = [];
  @Output()
  dataTableChange = new EventEmitter<any>();
  danhSachCtiet: any[] = [];
  danhSachCtietDtl: any[] = [];
  selected: boolean = false;
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhPheDuyetKeHoachMTTService: QuyetDinhPheDuyetKeHoachMTTService,
    private chaogiaUyquyenMualeService: ChaogiaUyquyenMualeService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, chaogiaUyquyenMualeService);
    this.formData = this.fb.group(
      {
        id: [],
        idQdDtl: [],
        namKh: [dayjs().get("year"), [Validators.required]],
        soQd: ['', [Validators.required]],
        maDvi: [''],
        tenDvi: ['', [Validators.required]],
        pthucMuaTrucTiep: [''],
        diaDiemChaoGia: [],
        ngayMkho: [null, [Validators.required]],
        ngayMua: [null, [Validators.required]],
        loaiVthh: ['', [Validators.required]],
        tenLoaiVthh: ['', [Validators.required]],
        cloaiVthh: ['', [Validators.required]],
        tenCloaiVthh: ['', [Validators.required]],
        moTaHangHoa: [''],
        trangThai: [STATUS.CHUA_CAP_NHAT],
        tenTrangThai: ['Chưa cập nhật'],
        ghiChuChaoGia: ['']
      }
    );
  }
  rowItem: ChiTietThongTinChaoGia = new ChiTietThongTinChaoGia();
  updateRowItem: ChiTietThongTinChaoGia = new ChiTietThongTinChaoGia();
  dataEdit: { [key: string]: { edit: boolean; data: ChiTietThongTinChaoGia } } = {};

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
    this.emitDataTable()
  }

  initForm() {
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI,
      maDvi: this.userInfo.MA_DVI,
    })
  }

  async loadDetail(id: number) {
    if (id > 0) {
      await this.quyetDinhPheDuyetKeHoachMTTService.getDetailDtlCuc(id)
        .then(async (res) => {
          const dataDtl = res.data;
          console.log(dataDtl)
          this.danhSachCtiet = dataDtl.children
          this.formData.patchValue({
            idQdDtl: id,
            soQd: dataDtl.hhQdPheduyetKhMttHdr.soQd,
            trangThai: dataDtl.trangThai,
            tenTrangThai: dataDtl.tenTrangThai,
            tenCloaiVthh: dataDtl.hhQdPheduyetKhMttHdr.tenCloaiVthh,
            cloaiVthh: dataDtl.hhQdPheduyetKhMttHdr.cloaiVthh,
            tenLoaiVthh: dataDtl.hhQdPheduyetKhMttHdr.tenLoaiVthh,
            loaiVthh: dataDtl.hhQdPheduyetKhMttHdr.loaiVthh,
            moTaHangHoa: dataDtl.hhQdPheduyetKhMttHdr.moTaHangHoa,
            diaDiemChaoGia: dataDtl.diaDiemChaoGia,
            ngayMkho: dataDtl.ngayMkho,
            ngayMua: dataDtl.ngayMua,
            ghiChuChaoGia: dataDtl.ghiChuChaoGia
          })
          this.radioValue = dataDtl.pthucMuaTrucTiep ? dataDtl.pthucMuaTrucTiep : '01'
          this.fileDinhKemUyQuyen = dataDtl.fileDinhKemUyQuyen;
          this.fileDinhKemMuaLe = dataDtl.fileDinhKemMuaLe;
          this.showDetail(event,this.danhSachCtiet[0]);
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }
  }

  calcTong() {
    if (this.danhSachCtiet) {
      const sum = this.danhSachCtiet.reduce((prev, cur) => {
        prev += cur.soLuong;
        return prev;
      }, 0);
      return sum;
    }
  }
  idRowSelect: number;
  async showDetail($event, data: any) {
    await this.spinner.show();
    if ($event.type == "click") {
      this.selected = false;
      $event.target.parentElement.parentElement.querySelector(".selectedRow")?.classList.remove("selectedRow");
      $event.target.parentElement.classList.add("selectedRow");
    } else {
      this.selected = true;
    }
    this.idRowSelect = data.id;
    this.dataTable = data.listChaoGia
    this.updateEditCache()
    await this.spinner.hide();
  }

  showDsChaoGia(id: any){

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
          let res = await this.chaogiaUyquyenMualeService.approve(body);
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
      body.children = this.danhSachCtietDtl;
      body.danhSachCtiet = this.danhSachCtiet;
      body.pthucMuaTrucTiep = this.radioValue;
      body.fileDinhKemUyQuyen = this.fileDinhKemUyQuyen;
      body.fileDinhKemMuaLe = this.fileDinhKemMuaLe;
      let res = await this.chaogiaUyquyenMualeService.create(body);
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
    if (!this.dataTable) {
      this.dataTable = [];
    }
    this.rowItem.idQdPdSldd = this.idRowSelect;
    this.dataTable = [...this.dataTable, this.rowItem];
    this.danhSachCtiet.forEach((itemA) => {
      const itemsB = this.dataTable.filter((item) => item.idQdPdSldd === itemA.id);
      if (itemsB.length > 0) {
        itemA.listChaoGia = [];
        itemA.listChaoGia.push(...itemsB);
      }
    });
    this.rowItem = new ChiTietThongTinChaoGia();
    this.emitDataTable();
    this.updateEditCache()
  }

  clearItemRow() {
    // let soLuong = this.rowItem.soLuong;
    this.rowItem = new ChiTietThongTinChaoGia();
    // this.rowItem.soLuong = soLuong;
    this.rowItem.id = null;
  }

  emitDataTable() {
    this.dataTableChange.emit(this.dataTable);
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
          this.dataTable.splice(index, 1);
          this.updateEditCache();
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  updateEditCache(): void {
    if (this.dataTable) {
      this.dataTable.forEach((item, index) => {
        this.dataEdit[index] = {
          edit: false,
          data: { ...item },
        };
        // this.danhSachCtietDtl = [...this.danhSachCtietDtl, item];
      });
    }
  }

  startEdit(index: number) {
    this.dataEdit[index].edit = true;
  }

  cancelEdit(stt: number): void {
    this.dataEdit[stt] = {
      data: { ...this.dataTable[stt] },
      edit: false
    };
  }

  saveEdit(idx: number): void {
    Object.assign(this.dataTable[idx], this.dataEdit[idx].data);
    this.danhSachCtiet.forEach((itemA) => {
      const itemsB = this.dataTable.filter((item) => item.idQdPdSldd === itemA.id);
      if (itemsB.length > 0) {
        itemA.listChaoGia = [];
        itemA.listChaoGia.push(...itemsB);
      }
    });
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
              // if (!type.fileDinhKem) {
              //   type.fileDinhKem = new FileDinhKem();
              // }
              type.fileDinhKems.fileName = resUpload.filename;
              type.fileDinhKems.fileSize = resUpload.size;
              type.fileDinhKems.fileUrl = resUpload.url;
              type.fileDinhKems.idVirtual = new Date().getTime();
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
}
