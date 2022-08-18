import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ThongTinKhaoSatGia } from 'src/app/models/DeXuatPhuongAnGia';
import { FileDinhKem } from 'src/app/models/FileDinhKem';
import { UploadFileService } from 'src/app/services/uploaFile.service';
import { Globals } from 'src/app/shared/globals';

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
  listCloaiVthh = []
  @Input()
  isView: boolean

  rowItem: ThongTinKhaoSatGia = new ThongTinKhaoSatGia();
  constructor(
    private uploadFileService: UploadFileService,
    public globals: Globals
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

}
