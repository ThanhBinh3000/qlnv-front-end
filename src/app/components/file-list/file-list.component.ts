import {saveAs} from 'file-saver';
import {FileDinhKem} from 'src/app/models/FileDinhKem';
import {Component, Input, OnInit} from '@angular/core';
import {UserService} from 'src/app/services/user.service';
import {Globals} from 'src/app/shared/globals';
import {UploadFileService} from 'src/app/services/uploaFile.service';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {MESSAGE} from 'src/app/constants/message';

@Component({
  selector: 'file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss'],
})
export class FileListComponent implements OnInit {
  @Input() data: FileDinhKem[] = [];
  @Input() trangThai: string;
  @Input() isViewDetail: boolean;
  @Input() disabled: boolean = false;

  fileAdd: FileDinhKem = new FileDinhKem();

  constructor(
    public globals: Globals,
    public userService: UserService,
    private uploadFileService: UploadFileService,
    private notification: NzNotificationService,
  ) {
  }

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
          } else {
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
      this.notification.error(MESSAGE.ERROR, "Vui lòng nhập file");
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

  deleteFile(index) {
    if (!this.disabled) {
      this.data.splice(index, 1);
      // this.data = this.data.filter(x => x.idVirtual != item.idVirtual);
    }
  }

  updateFile(index) {
    let curRow = this.data[index];
    if (!curRow || !curRow.noiDung || curRow.noiDung == '' || !curRow.fileName || curRow.fileName == '') {
      return;
    }
    this.data.splice(index, 1, curRow);
    curRow.isEdit = false;
  }
}
