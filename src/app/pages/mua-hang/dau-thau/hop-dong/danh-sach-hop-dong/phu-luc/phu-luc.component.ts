import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { saveAs } from 'file-saver';

import { DialogThongTinPhuLucHopDongMuaComponent } from 'src/app/components/dialog/dialog-thong-tin-phu-luc-hop-dong-mua/dialog-thong-tin-phu-luc-hop-dong-mua.component';
import { UploadComponent } from 'src/app/components/dialog/dialog-upload/upload.component';
import { FileDinhKem } from 'src/app/models/FileDinhKem';
import { UploadFileService } from 'src/app/services/uploaFile.service';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-phu-luc',
  templateUrl: './phu-luc.component.html',
  styleUrls: ['./phu-luc.component.scss']
})
export class PhuLucComponent implements OnInit {
  @Input() idPhuLuc: number;
  @Input() isViewPhuLuc: boolean;
  @Input() typeVthh: string;
  @Output()
  showChiTietEvent = new EventEmitter<any>();
  fileDinhKem: Array<FileDinhKem> = [];
  formPhuLuc: FormGroup;
  constructor(
    private modal: NzModalService,
    public userService: UserService,
    private uploadFileService: UploadFileService,
    private fb: FormBuilder
  ) {
    this.formPhuLuc = this.fb.group(
      {
        phuLucSo: [null],
        ngayKy: [null],
        ngayHieuLuc: [null],
        veViec: [null],
        soHdong: [null],
        tenHdong: [null],
        ngayHLDtdc: [null],
        ngayHLDsdc: [null],
        ngayHLTNtdc: [null],
        ngayHLTNsdc: [null],
        soNgaytdc: [null],
        soNgaysdc: [null],
        nDungdc: [null],
        ghiChu: [null]
      }
    );
  }

  ngOnInit() {
  }

  thongTinPhuLuc() {
    const modal = this.modal.create({
      nzTitle: 'Thông tin phụ lục KH LNCT cho các Cục DTNN KV',
      nzContent: DialogThongTinPhuLucHopDongMuaComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1200px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modal.afterClose.subscribe((res) => { });
  }

  back() {
    this.showChiTietEvent.emit();
  }

  taiLieuDinhKem(type?: string) {
    const modal = this.modal.create({
      nzTitle: 'Tài liệu đính kèm',
      nzContent: UploadComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modal.afterClose.subscribe((res) => {
      if (res) {
        this.uploadFileService
          .uploadFile(res.file, res.tenTaiLieu)
          .then((resUpload) => {
            const fileDinhKem = new FileDinhKem();
            fileDinhKem.fileName = resUpload.filename;
            fileDinhKem.fileSize = resUpload.size;
            fileDinhKem.fileUrl = resUpload.url;
            this.fileDinhKem.push(fileDinhKem);
          });
      }
    });
  }

  downloadFile(taiLieu: any) {
    this.uploadFileService.downloadFile(taiLieu.fileUrl).subscribe((blob) => {
      saveAs(blob, taiLieu.fileName);
    });
  }

  deleteTaiLieu(index: number) {
    this.fileDinhKem = this.fileDinhKem.filter((item, i) => i !== index)
  }
}
