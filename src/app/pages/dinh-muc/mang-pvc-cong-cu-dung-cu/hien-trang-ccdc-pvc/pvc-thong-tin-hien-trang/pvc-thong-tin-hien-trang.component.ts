import {Component, OnInit} from '@angular/core';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {MmHienTrangMmService} from "../../../../../services/mm-hien-trang-mm.service";
import {MESSAGE} from "../../../../../constants/message";
import {DanhMucService} from "../../../../../services/danhmuc.service";
import {FileDinhKem} from "../../../../../models/FileDinhKem";
import {HienTrangMayMoc} from "../../../../../constants/status";
import {DANH_MUC_LEVEL} from "../../../../luu-kho/luu-kho.constant";
import {DonviService} from "../../../../../services/donvi.service";
import {saveAs} from "file-saver";
import {
  MmHienTrangCt
} from "../../../may-moc-thiet-bi/mm-hien-trang-ccdc/mm-thong-tin-hien-trang/mm-thong-tin-hien-trang.component";
import {
  HienTrangMayMocService
} from "../../../../../services/dinh-muc-nhap-xuat-bao-quan/pvc/hien-trang-may-moc.service";

@Component({
  selector: 'app-pvc-thong-tin-hien-trang',
  templateUrl: './pvc-thong-tin-hien-trang.component.html',
  styleUrls: ['./pvc-thong-tin-hien-trang.component.scss']
})
export class PvcThongTinHienTrangComponent extends Base2Component implements OnInit {
  isViewDetail: boolean;
  dataDetail: any
  danhSachloaiGiaoDich : any[] = [];
  dsChiCuc : any[] = [];
  rowItem: MmHienTrangCt = new MmHienTrangCt();
  dataEdit: { [key: string]: { edit: boolean; data: MmHienTrangCt } } = {};
  statusMm = HienTrangMayMoc

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private hienTrangSv: HienTrangMayMocService,
    private danhMucSv: DanhMucService,
    private _modalRef: NzModalRef,
    private dviService: DonviService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, hienTrangSv);
    super.ngOnInit()
    this.formData = this.fb.group({
      id: [null],
      maDvi: [null],
      tenDvi: [null],
      namKeHoach: [null],
      tenTaiSan: [null],
      maCcdc: [null],
      donViTinh: [null],
      luongHang: [null],
      hieuQua: [null],
      lyDoHieuQua: [null],
      slCkKd: [null],
      slThKd: [null],
      slKdSauSc: [null],
      donviThKd: [null],
      hcTheoQd: [null],
      hcKtheoQd: [null],
      donviHc: [null],
      slSuaChua: [null],
      noiDungSuaChua: [null],
      trangThai: [null],
      soDuNamTruoc: [null],
      dienGiaiChiTiet: [null],
      slDx: [null]
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.initForm();
      this.getDetail(this.dataDetail.id)
      this.loadDsloaiGiaoDich()
      this.loadDsChiCuc()
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  downloadFile(item: FileDinhKem) {
    if (item) {
      this.uploadFileService.downloadFile(item.fileUrl).subscribe((blob) => {
        saveAs(blob, item.fileName);
      });
    } else {
      this.notification.error(MESSAGE.ERROR, 'Không tìm thấy file đính kèm');
    }
  }

  async getDetail(id) {
    this.spinner.show();
    try {
      let res = await this.hienTrangSv.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data;
          this.formData.patchValue(data);
          this.dataTable = data.listQlDinhMucHienTrangCcdcDtl
          this.updateEditCache()
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
        this.spinner.hide();
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e);
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
  }

  initForm() {
    this.formData.patchValue({
      tenDvi: this.dataDetail.tenDvi,
      tenTaiSan: this.dataDetail.tenTaiSan,
      donViTinh: this.dataDetail.donViTinh,
      namKeHoach: this.dataDetail.namKeHoach
    })
    this.updateEditCache()
  }

  async loadDsloaiGiaoDich() {
    let res = await this.danhMucSv.danhMucChungGetAll("LOAI_GD_CCDC");
    if (res.msg == MESSAGE.SUCCESS) {
      this.danhSachloaiGiaoDich = res.data;
    }
  }

  themMoiCtiet() {
    let msgRequired = this.required(this.rowItem);
    if (msgRequired) {
      this.notification.error(MESSAGE.ERROR, msgRequired);
      this.spinner.hide();
      return;
    }
    if (!this.dataTable) {
      this.dataTable = []
    }
    this.dataTable = [...this.dataTable, this.rowItem];
    this.rowItem = new MmHienTrangCt();
    this.updateEditCache();
  }

  getNameFile(event?: any, tableName?: string, item?: FileDinhKem, type? : any) {
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
              if (!this.rowItem.fileDinhKem ) {
                this.rowItem.fileDinhKem = new FileDinhKem();
              }
              this.rowItem.fileDinhKem.fileName = resUpload.filename;
              this.rowItem.fileDinhKem.fileSize = resUpload.size;
              this.rowItem.fileDinhKem.fileUrl = resUpload.url;
              this.rowItem.fileDinhKem.idVirtual = new Date().getTime();
            } else {
              if (!type.fileDinhKem ) {
                type.fileDinhKem  = new FileDinhKem();
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


  required(item: MmHienTrangCt) {
    let msgRequired = '';
    if (!item.loaiGiaoDich || !item.ngayGd ) {
      msgRequired = "Vui lòng nhập đủ dữ liệu!";
    }
    return msgRequired;
  }

  updateEditCache() {
    if (this.dataTable) {
      this.dataTable.forEach((item, index) => {
        this.dataEdit[index] = {
          edit: false,
          data: {...item},
        };
      });
    }
  }

  async loadDsChiCuc() {
    const body = {
      maDviCha: this.userInfo.DON_VI.maDviCha,
      trangThai: '01',
    };

    const dsTong = await this.dviService.layDonViTheoCapDo(body);
    this.dsChiCuc = dsTong[DANH_MUC_LEVEL.CHI_CUC];
    this.dsChiCuc = this.dsChiCuc.filter(item => item.type != "PB")
  }

  refresh() {
    this.rowItem = new MmHienTrangCt();
  }

  editRow(stt: number) {
    this.dataEdit[stt].edit = true;
  }

  cancelEdit(stt: number): void {
    this.dataEdit[stt] = {
      data: {...this.dataTable[stt]},
      edit: false
    };
  }

  async saveEdit(idx: number) {
    let msgRequired = this.required(this.dataEdit[idx].data)
    if (msgRequired) {
      this.notification.error(MESSAGE.ERROR, msgRequired);
      this.spinner.hide();
      return;
    }
    this.dataEdit[idx].edit = false;
    Object.assign(this.dataTable[idx], this.dataEdit[idx].data);
    this.updateEditCache();
  }

  deleteItem(index: any) {
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

  async handleOk(data : string) {
    let body = this.formData.value
    if (!this.dataTable) {
      this.notification.error(MESSAGE.ERROR,'Vui lòng nhập danh sách chi tiết!')
      return;
    }
    body.listQlDinhMucHienTrangMmtbDtlReq = this.dataTable
    let res = await this.createUpdate(body);
    if (res) {
      this._modalRef.close(data);
    }
  }

  onCancel() {
    this._modalRef.close();
  }

  changeloaiGiaoDich(event , type? : any) {
    let list = this.danhSachloaiGiaoDich.filter(item => item.ma == event);
    if (list && list.length > 0) {
      if (type) {
        type.tenLoaiGiaoDich = list[0].giaTri
      } else {
        this.rowItem.tenLoaiGiaoDich = list[0].giaTri
      }
    }
  }

  changDvi(even, loai : string, type?  :any) {
    let list = this.dsChiCuc.filter(item => item.maDvi == even);
    if (list && list.length > 0) {
      if (type) {
        if (loai == 'nhan') {
          type.tenDonViNhan = list[0].tenDvi
        } else {
          type.tenDonViChuyen = list[0].tenDvi
        }
      } else {
        if (loai == 'nhan') {
          this.rowItem.tenDonViNhan = list[0].tenDvi
        } else {
          this.rowItem.tenDonViChuyen = list[0].tenDvi
        }
      }
    }
  }
}
