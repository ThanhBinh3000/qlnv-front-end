import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ThongTinKhaoSatGia} from 'src/app/models/DeXuatPhuongAnGia';
import { FileDinhKem } from 'src/app/models/FileDinhKem';
import { UploadFileService } from 'src/app/services/uploaFile.service';
import { Globals } from 'src/app/shared/globals';
import { saveAs } from 'file-saver';
import {NzModalService} from "ng-zorro-antd/modal";

@Component({
  selector: 'app-thong-tin-ksg',
  templateUrl: './thong-tin-ksg.component.html',
  styleUrls: ['./thong-tin-ksg.component.scss']
})
export class ThongTinKsgComponent implements OnInit, OnChanges {
  @Input()
  isTableKetQua: boolean;

  @Input()
  dataTable = [];

  @Output()
  dataTableChange = new EventEmitter<any>();

  @Input()
  isVat: boolean;

  @Input()
  listCloaiVthh = [];

  @Input()
  isView: boolean;

  rowItem: ThongTinKhaoSatGia = new ThongTinKhaoSatGia();
  dataEdit: { [key: string]: { edit: boolean; data: ThongTinKhaoSatGia } } = {};
  constructor(
    private uploadFileService: UploadFileService,
    public globals: Globals,
    public modal: NzModalService,
  ) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.emitDataTable();
  }

  ngOnInit(): void {

  }


  emitDataTable() {
    this.dataTableChange.emit(this.dataTable);
  }

  onChangeCloaiVthh() {

  }


  themDataTable() {
    this.dataTable = [...this.dataTable, this.rowItem];
    this.rowItem = new ThongTinKhaoSatGia();
    this.emitDataTable();
    this.updateEditCache()
  }

  getNameFile(event?: any, tableName?: string, item?: FileDinhKem) {
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
            if (!this.rowItem.fileDinhKem) {
              this.rowItem.fileDinhKem = new FileDinhKem();
            }
            this.rowItem.fileDinhKem.fileName = resUpload.filename;
            this.rowItem.fileDinhKem.fileSize = resUpload.size;
            this.rowItem.fileDinhKem.fileUrl = resUpload.url;
            this.rowItem.fileDinhKem.idVirtual = new Date().getTime();
            console.log(this.rowItem.fileDinhKem);
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
      let i = 0;
      this.dataTable.forEach((item, index) => {
        this.dataEdit[index] = {
          edit: false,
          data: { ...item },
        };
        i++
      });
    }
  }

  saveEdit(idx: number): void {
    Object.assign(this.dataTable[idx], this.dataEdit[idx].data);
    this.dataEdit[idx].edit = false;
  }
  editRow(stt: number) {
    this.dataEdit[stt].edit = true;
  }
  cancelEdit(stt: number): void {
    const index = this.dataTable.findIndex(item => item.stt === stt);
    this.dataEdit[stt] = {
      data: { ...this.dataTable[index] },
      edit: false
    };
  }
}
