import {Component, OnInit} from '@angular/core';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {MmHienTrangMmService} from "../../../../../services/mm-hien-trang-mm.service";
import {DonviService} from "../../../../../services/donvi.service";
import {MESSAGE} from "../../../../../constants/message";
import {
  MmThongTinNcChiCuc
} from "../../de-xuat-nhu-cau-chi-cuc/thong-tin-de-xuat-nhu-cau-chi-cuc/thong-tin-de-xuat-nhu-cau-chi-cuc.component";
import {DanhMucService} from "../../../../../services/danhmuc.service";
import {FileDinhKem} from "../../../../../models/FileDinhKem";

@Component({
  selector: 'app-mm-thong-tin-hien-trang',
  templateUrl: './mm-thong-tin-hien-trang.component.html',
  styleUrls: ['./mm-thong-tin-hien-trang.component.scss']
})
export class MmThongTinHienTrangComponent extends Base2Component implements OnInit {
  isViewDetail: boolean;
  dataDetail: any
  danhSachLoaiGd : any[] = [];
  rowItem: MmHienTrangCt = new MmHienTrangCt();
  dataEdit: { [key: string]: { edit: boolean; data: MmHienTrangCt } } = {};


  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private hienTrangSv: MmHienTrangMmService,
    private danhMucSv: DanhMucService,
    private _modalRef: NzModalRef,
  ) {
    super(httpClient, storageService, notification, spinner, modal, hienTrangSv);
    super.ngOnInit()
    this.formData = this.fb.group({
      maDvi: [null],
      tenDvi: [null],
      namKeHoach: [null],
      tenCcdc: [null],
      maCcdc: [null],
      donViTinh: [null],
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.initForm();
      this.loadDsLoaiGd()
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  initForm() {
    this.formData.patchValue({
      tenDvi: this.dataDetail.tenDvi,
      tenCcdc: this.dataDetail.tenTaiSan,
      donViTinh: this.dataDetail.donViTinh,
      namKeHoach: this.dataDetail.namKeHoach
    })
  }

  async loadDsLoaiGd() {
    let res = await this.danhMucSv.danhMucChungGetAll("LOAI_GD_MMTB");
    if (res.msg == MESSAGE.SUCCESS) {
      this.danhSachLoaiGd = res.data;
    }
  }

  async themMoiCtiet() {
    let msgRequired = this.required(this.rowItem);
    if (msgRequired) {
      this.notification.error(MESSAGE.ERROR, msgRequired);
      this.spinner.hide();
      return;
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
    //validator
    // if (!item.maTaiSan) {
    //   msgRequired = "Loại tài sản không được để trống";
    // } else if (!item.soLuong) {
    //   msgRequired = "Số lượng không được để trống";
    // }
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

  handleOk(data: any) {
    this._modalRef.close(data);
  }

  onCancel() {
    this._modalRef.close();
  }

  changeLoaiGd(event , type? : any) {
    let list = this.danhSachLoaiGd.filter(item => item.ma == event);
    if (list && list.length > 0) {
      if (type) {
        type.tenLoaiGd = list[0].giaTri
      } else {
        this.rowItem.tenLoaiGd = list[0].giaTri
      }
    }
  }
}

export class MmHienTrangCt {
  id : number;
  loaiGd : string;
  tenLoaiGd : string;
  slTang: number;
  slGiam : number;
  ngay : any;
  soPhieu : string;
  dviChuyen : string;
  dviNhan : string;
  fileDinhKem: FileDinhKem = new FileDinhKem();
}
