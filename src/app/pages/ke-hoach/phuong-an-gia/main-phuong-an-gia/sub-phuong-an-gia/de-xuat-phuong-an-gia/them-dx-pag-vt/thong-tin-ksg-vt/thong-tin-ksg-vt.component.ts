import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ThongTinKhaoSatGia} from 'src/app/models/DeXuatPhuongAnGia';
import {FileDinhKem} from 'src/app/models/FileDinhKem';
import {UploadFileService} from 'src/app/services/uploaFile.service';
import {Globals} from 'src/app/shared/globals';
import {saveAs} from 'file-saver';
import {NzModalService} from "ng-zorro-antd/modal";
import {MESSAGE} from "../../../../../../../../constants/message";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {DonviService} from "../../../../../../../../services/donvi.service";
import {UserLogin} from "../../../../../../../../models/userlogin";
import {UserService} from "../../../../../../../../services/user.service";
import {DanhMucService} from "../../../../../../../../services/danhmuc.service";
import {
  QuyetDinhGiaCuaBtcService
} from "../../../../../../../../services/ke-hoach/phuong-an-gia/quyetDinhGiaCuaBtc.service";

@Component({
  selector: 'app-thong-tin-ksg-vt',
  templateUrl: './thong-tin-ksg-vt.component.html',
  styleUrls: ['./thong-tin-ksg-vt.component.scss']
})
export class ThongTinKsgVtComponent implements OnInit, OnChanges {
  @Input() isTableKetQua: boolean;
  @Input() isTabNdKhac: boolean;
  @Input() dataTable: any[] = [];
  @Output() dataTableChange = new EventEmitter<any>();
  @Input() isView: boolean;
  @Input() dataParent: any;
  @Input() listCloaiVthh: any[];
  @Input() type: string;
  isVat: boolean;
  vat: any;
  userInfo: UserLogin
  rowItem: ThongTinKhaoSatGia = new ThongTinKhaoSatGia();
  dataEdit: { [key: string]: { edit: boolean; data: ThongTinKhaoSatGia } } = {};

  constructor(
    private uploadFileService: UploadFileService,
    private userService: UserService,
    public globals: Globals,
    public donViService: DonviService,
    public modal: NzModalService,
    public notification: NzNotificationService,
    public spinner: NgxSpinnerService,
    public danhMucService: DanhMucService,
    private quyetDinhGiaCuaBtcService: QuyetDinhGiaCuaBtcService,
  ) {
  }

  ngOnInit(): void {
    this.isVat = this.dataParent && this.dataParent.loaiGia && (this.dataParent.loaiGia == 'LG01' || this.dataParent.loaiGia == 'LG03')
    this.vat = this.dataParent && this.dataParent.vat ? this.dataParent.vat : 0
    this.userInfo = this.userService.getUserLogin();
    this.emitDataTable();
    this.updateEditCache();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.dataParent) {
      this.isVat = this.dataParent && this.dataParent.loaiGia && (this.dataParent.loaiGia == 'LG01' || this.dataParent.loaiGia == 'LG03');
      this.vat = this.dataParent && this.dataParent.vat ? this.dataParent.vat : 0
    }
    this.updateEditCache();
  }


  emitDataTable() {
    this.dataTableChange.emit(this.dataTable);
  }

  async onChangeCloaiVthh(event) {
    if (event) {
      let list = this.listCloaiVthh.filter(item => item.ma == event)
      this.rowItem.tenCloaiVthh = list && list.length > 0 ? list[0].ten : ''
      let resp = await this.danhMucService.getDetail(event);
      if (resp.msg == MESSAGE.SUCCESS) {
        this.rowItem.tieuChuanCl = resp.data && resp.data.tieuChuanCl ? resp.data.tieuChuanCl : ""
      }
      if (this.isVat) {
        this.rowItem.vat = null;
        let body = {
          namKeHoach: this.dataParent.namKeHoach,
          loaiGia: this.dataParent.loaiGia == 'LG03' ? 'LG01' : 'LG02',
          loaiVthh: this.dataParent.loaiVthh,
          cloaiVthh: event
        }
        let res = await this.quyetDinhGiaCuaBtcService.getQdGiaVattu(body);
        if (res.msg == MESSAGE.SUCCESS) {
          let qdBtc = res.data
          if (qdBtc) {
            this.rowItem.vat = qdBtc.vat;
          }
        }
      }
    }
  }


  themDataTable() {
    if (!this.dataTable) {
      this.dataTable = [];
    }
    let msgRequired = this.required(this.rowItem);
    if (msgRequired) {
      this.notification.warning(MESSAGE.WARNING, msgRequired);
      this.spinner.hide();
      return;
    }
    if (this.type == 'GCT' && this.isVat) {
      if (!this.rowItem.vat && !this.isTabNdKhac) {
        this.notification.warning(MESSAGE.WARNING, 'Không tìm thây quyết định của BTC cho loại hàng hóa');
        this.spinner.hide();
        return;
      }
    }
    this.rowItem.maDvi = this.userInfo.MA_DVI;
    if (this.isVat && this.type == 'GMTDBTT') {
      this.rowItem.donGiaVat = this.rowItem.donGia * this.vat + this.rowItem.donGia
    }
    if (this.isVat && this.type == 'GCT') {
      this.rowItem.donGiaVat = this.rowItem.donGia * this.rowItem.vat + this.rowItem.donGia
    }
    this.dataTable = [...this.dataTable, this.rowItem];
    this.rowItem = new ThongTinKhaoSatGia();
    this.emitDataTable();
    this.updateEditCache()
  }

  required(item: ThongTinKhaoSatGia) {
    let msgRequired = "";
    //validator
    if ((!item.cloaiVthh && this.listCloaiVthh.length > 0) && !this.isTabNdKhac) {
      msgRequired = "Không được để trống chủng loại hàng hóa";
    } else if (!item.donGia) {
      msgRequired = "Không được để trống đơn giá";
    }
    return msgRequired;
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
              if (!this.rowItem.fileDinhKem) {
                this.rowItem.fileDinhKem = new FileDinhKem();
              }
              this.rowItem.fileDinhKem.fileName = resUpload.filename;
              this.rowItem.fileDinhKem.fileSize = resUpload.size;
              this.rowItem.fileDinhKem.fileUrl = resUpload.url;
              this.rowItem.fileDinhKem.idVirtual = new Date().getTime();
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

  updateEditCache(): void {
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable.forEach((item, index) => {
        this.dataEdit[index] = {
          edit: false,
          data: {...item},
        };
      });
    }
  }

  saveEdit(idx: number): void {
    if (this.type == 'GMTDBTT' && this.isVat) {
      this.dataEdit[idx].data.donGiaVat = this.dataEdit[idx].data.donGia * this.vat + this.dataEdit[idx].data.donGia
    }
    if (this.type == 'GCT' && this.isVat) {
      this.dataEdit[idx].data.donGiaVat = this.dataEdit[idx].data.donGia * this.dataEdit[idx].data.vat + this.dataEdit[idx].data.donGia
    }
    Object.assign(this.dataTable[idx], this.dataEdit[idx].data);
    this.dataEdit[idx].edit = false;
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
}
