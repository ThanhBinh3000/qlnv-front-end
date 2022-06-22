import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { saveAs } from 'file-saver';

import { DialogThongTinPhuLucHopDongMuaComponent } from 'src/app/components/dialog/dialog-thong-tin-phu-luc-hop-dong-mua/dialog-thong-tin-phu-luc-hop-dong-mua.component';
import { UploadComponent } from 'src/app/components/dialog/dialog-upload/upload.component';
import { FileDinhKem } from 'src/app/models/FileDinhKem';
import { UploadFileService } from 'src/app/services/uploaFile.service';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MESSAGE } from 'src/app/constants/message';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzNotificationService } from 'ng-zorro-antd/notification';

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
  errorGhiChu: boolean = false;
  errorInputRequired: string = null;
  constructor(
    private modal: NzModalService,
    public userService: UserService,
    private uploadFileService: UploadFileService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService
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
    this.errorInputRequired = MESSAGE.ERROR_NOT_EMPTY;
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

  save() {
    this.spinner.show();
    try {
      if (!this.formPhuLuc.value.ghiChu && this.formPhuLuc.value.ghiChu == '') {
        this.errorGhiChu = true;
      }
      else {
        let body = this.formPhuLuc.value;
        console.log("🚀 ~ file: phu-luc.component.ts ~ line 122 ~ PhuLucComponent ~ save ~ body", body)
        // body.soHd = `${this.formDetailHopDong.value.maHdong}${this.maHopDongSuffix}`;
        // body.fileDinhKems = this.fileDinhKem,
        //   body.tuNgayHluc = this.formDetailHopDong.value.ngayHieuLuc && this.formDetailHopDong.value.ngayHieuLuc.length > 0 ? dayjs(this.formDetailHopDong.value.ngayHieuLuc[0]).format('YYYY-MM-DD') : null,
        //   body.denNgayHluc = this.formDetailHopDong.value.ngayHieuLuc && this.formDetailHopDong.value.ngayHieuLuc.length > 0 ? dayjs(this.formDetailHopDong.value.ngayHieuLuc[1]).format('YYYY-MM-DD') : null,
        //   delete body.ngayHieuLuc;
        // delete body.maHdong;
        // delete body.tenCloaiVthh;
        // delete body.tenVthh;

        // body.idNthau = `${this.dvLQuan.id}/${this.dvLQuan.version}`
        // if (this.id > 0) {
        //   let res = await this.thongTinHopDong.update(
        //     body,
        //   );
        //   if (res.msg == MESSAGE.SUCCESS) {
        //     if (!isOther) {
        //       this.notification.success(
        //         MESSAGE.SUCCESS,
        //         MESSAGE.UPDATE_SUCCESS,
        //       );
        //       this.back();
        //     }
        //   } else {
        //     this.notification.error(MESSAGE.ERROR, res.msg);
        //   }
        // } else {
        //   let res = await this.thongTinHopDong.create(
        //     body,
        //   );
        //   if (res.msg == MESSAGE.SUCCESS) {
        //     if (!isOther) {
        //       this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        //       this.back();
        //     }
        //   } else {
        //     this.notification.error(MESSAGE.ERROR, res.msg);
        //   }
        // }
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  validateGhiChu() {
    if (this.formPhuLuc.value.ghiChu && this.formPhuLuc.value.ghiChu != '') {
      this.errorGhiChu = false;
    }
    else {
      this.errorGhiChu = true;
    }
  }
}
