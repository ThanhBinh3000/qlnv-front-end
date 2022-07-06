import { saveAs } from 'file-saver';
import { FileDinhKem } from 'src/app/models/FileDinhKem';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { UploadFileService } from 'src/app/services/uploaFile.service';
@Component({
  selector: 'file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss'],
})
export class FileListComponent implements OnInit {
  @Input() data: FileDinhKem[] = [];
  @Input() trangThai: string;
  @Input() isViewDetail: boolean;

  fileAdd: FileDinhKem = new FileDinhKem();

  constructor(
    public globals: Globals,
    public userService: UserService,
    private uploadFileService: UploadFileService,
  ) { }

  ngOnInit(): void {
    if (this.data && this.data.length > 0) {
      this.data.forEach((item: FileDinhKem) => {
        item.idVirtual = item.id;
      })
    }
  }

  getNameFile(event?: any, item?: FileDinhKem) {
    if (
      this.trangThai === this.globals.prop.BAN_HANH ||
      this.trangThai === this.globals.prop.LANH_DAO_DUYET ||
      this.trangThai === this.globals.prop.DU_THAO_TRINH_DUYET
    ) {
      return;
    }
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
            if (!this.fileAdd) {
              this.fileAdd = new FileDinhKem();
            }
            this.fileAdd.fileName = resUpload.filename;
            this.fileAdd.fileSize = resUpload.size;
            this.fileAdd.fileUrl = resUpload.url;
            this.fileAdd.idVirtual = new Date().getTime();
          }
        });
    }
  }

  addFile() {
    if (!this.fileAdd || !this.fileAdd.noiDung || this.fileAdd.noiDung == '' || !this.fileAdd.fileName || this.fileAdd.fileName == '') {
      return;
    }
    if (!this.data) {
      this.data = [];
    }
    this.data.push(this.fileAdd);
    this.clearAdd();
  }

  clearAdd() {
    this.fileAdd = new FileDinhKem();
  }

  downloadFile(item: FileDinhKem) {
    this.uploadFileService.downloadFile(item.fileUrl).subscribe((blob) => {
      saveAs(blob, item.fileName);
    });
  }

  deleteFile(item: FileDinhKem) {
    this.data = this.data.filter(x => x.idVirtual != item.idVirtual);
  }

  updateFile(item: FileDinhKem) {
    if (!item || !item.noiDung || item.noiDung == '' || !item.fileName || item.fileName == '') {
      return;
    }
    if (this.data && this.data.length > 0) {
      let index = this.data.findIndex(x => x.idVirtual == item.idVirtual);
      if (index != -1) {
        this.data.splice(index, 1);
      }
    }
    else {
      this.data = [];
    }
    item.isEdit = false;
    this.data = [
      ...this.data,
      item,
    ];
  }
}
