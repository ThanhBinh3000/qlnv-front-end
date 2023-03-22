import {saveAs} from 'file-saver';
import {FileDinhKem} from 'src/app/models/FileDinhKem';
import {Component, Input, OnInit} from '@angular/core';
import {UserService} from 'src/app/services/user.service';
import {Globals} from 'src/app/shared/globals';
import {UploadFileService} from 'src/app/services/uploaFile.service';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {MESSAGE} from 'src/app/constants/message';
import {NzModalService} from "ng-zorro-antd/modal";

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
  @Input() isQdkqlcnt: boolean = false;

  fileAdd: FileDinhKem = new FileDinhKem();

  constructor(
    public globals: Globals,
    public userService: UserService,
    private modal: NzModalService,
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
            const lastPeriodIndex = resUpload.filename.lastIndexOf(".");
            if (lastPeriodIndex !== -1) {
              this.fileAdd.noiDung = resUpload.filename.slice(0, lastPeriodIndex);
            } else {
              this.fileAdd.noiDung = resUpload.filename;
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
    debugger
    if (this.isQdkqlcnt == false && (!this.fileAdd || !this.fileAdd.noiDung || this.fileAdd.noiDung == '' || !this.fileAdd.fileName || this.fileAdd.fileName == '')) {
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
      this.modal.confirm({
        nzClosable: false,
        nzTitle: 'Xác nhận',
        nzContent: 'Bạn có chắc chắn muốn xóa?',
        nzOkText: 'Đồng ý',
        nzCancelText: 'Không',
        nzOkDanger: true,
        nzWidth: 310,
        nzOnOk: async () => {
          this.data.splice(index, 1);
        }
      });
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
