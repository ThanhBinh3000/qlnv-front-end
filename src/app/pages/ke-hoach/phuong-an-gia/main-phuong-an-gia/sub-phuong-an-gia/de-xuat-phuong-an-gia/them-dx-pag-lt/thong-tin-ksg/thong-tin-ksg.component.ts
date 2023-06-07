import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ThongTinKhaoSatGia} from 'src/app/models/DeXuatPhuongAnGia';
import {FileDinhKem} from 'src/app/models/FileDinhKem';
import {UploadFileService} from 'src/app/services/uploaFile.service';
import {Globals} from 'src/app/shared/globals';
import {saveAs} from 'file-saver';
import {NzModalService} from "ng-zorro-antd/modal";
import {
  KhSuaChuaLonDtl
} from "../../../../../../../quan-ly-kho-tang/ke-hoach/ke-hoach-sua-chua-hang-nam/de-xuat-kh-sc-lon/them-moi-sc-lon/dialog-dx-sc-lon/dialog-dx-sc-lon.component";
import {MESSAGE} from "../../../../../../../../constants/message";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-thong-tin-ksg',
  templateUrl: './thong-tin-ksg.component.html',
  styleUrls: ['./thong-tin-ksg.component.scss']
})
export class ThongTinKsgComponent implements OnInit, OnChanges {
  @Input()
  vat: any;

  @Input()
  isTableKetQua: boolean;

  @Input()
  isTabNdKhac: boolean;

  @Input()
  dataTable : any[] = [];

  @Output()
  dataTableChange = new EventEmitter<any>();

  @Input()
  isVat: boolean;

  @Input()
  listCloaiVthh = [];

  @Input()
  isView: boolean;

  @Input()
  dataCloaiVthh : any;

  rowItem: ThongTinKhaoSatGia = new ThongTinKhaoSatGia();
  dataEdit: { [key: string]: { edit: boolean; data: ThongTinKhaoSatGia } } = {};
  constructor(
    private uploadFileService: UploadFileService,
    public globals: Globals,
    public modal: NzModalService,
    public notification: NzNotificationService,
    public spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    this.emitDataTable()
    this.updateEditCache()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.dataCloaiVthh) {
      this.rowItem.cloaiVthh = (this.dataCloaiVthh.tenCloaiVthh ? this.dataCloaiVthh.tenCloaiVthh  + '; ' : '') + (this.dataCloaiVthh.moTa ? this.dataCloaiVthh.moTa + '; ' : '') + (this.dataCloaiVthh.tchuanCluong ? this.dataCloaiVthh.tchuanCluong : '' )
    }
  }


  emitDataTable() {
    this.dataTableChange.emit(this.dataTable);
  }

  onChangeCloaiVthh() {

  }


  themDataTable() {
    if(!this.dataTable){
      this.dataTable=[];
    }
    let msgRequired = this.required(this.rowItem);
    if (msgRequired) {
      this.notification.error(MESSAGE.ERROR, msgRequired);
      this.spinner.hide();
      return;
    }
    this.rowItem.donGiaVat = this.rowItem.donGia * this.vat +  this.rowItem.donGia
    this.dataTable = [...this.dataTable, this.rowItem];
    this.rowItem = new ThongTinKhaoSatGia();
    this.emitDataTable();
    this.updateEditCache()
  }

  required(item: ThongTinKhaoSatGia) {
    let msgRequired = "";
    //validator
    if (!item.cloaiVthh && !this.isTabNdKhac) {
      msgRequired = "Không được để trống chủng loại hàng hóa";
    } else if (!item.donGia) {
      msgRequired = "Không được để trống đơn giá";
    }
    return msgRequired;
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
    if (this.dataTable) {
      this.dataTable.forEach((item, index) => {
        this.dataEdit[index] = {
          edit: false,
          data: { ...item },
        };
      });
    }
  }

  saveEdit(idx: number): void {
    this.dataEdit[idx].data.donGiaVat =this.dataEdit[idx].data.donGia * this.vat + this.dataEdit[idx].data.donGia
    Object.assign(this.dataTable[idx], this.dataEdit[idx].data);
    this.dataEdit[idx].edit = false;
  }
  editRow(stt: number) {
    this.dataEdit[stt].edit = true;
  }
  cancelEdit(stt: number): void {
    this.dataEdit[stt] = {
      data: { ...this.dataTable[stt] },
      edit: false
    };
  }
}
