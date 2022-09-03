import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { saveAs } from 'file-saver';
import { Globals } from 'src/app/shared/globals';
import { DialogThongTinPhuLucHopDongMuaComponent } from 'src/app/components/dialog/dialog-thong-tin-phu-luc-hop-dong-mua/dialog-thong-tin-phu-luc-hop-dong-mua.component';
import { UploadComponent } from 'src/app/components/dialog/dialog-upload/upload.component';
import { FileDinhKem } from 'src/app/models/FileDinhKem';
import { UploadFileService } from 'src/app/services/uploaFile.service';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MESSAGE } from 'src/app/constants/message';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ThongTinPhuLucHopDongService } from 'src/app/services/thongTinPhuLucHopDong.service';
import { TreeTableService } from 'src/app/services/tree-table.service';

@Component({
  selector: 'app-phu-luc-hop-dong-mua-sam',
  templateUrl: './phu-luc-hop-dong-mua-sam.component.html',
  styleUrls: ['./phu-luc-hop-dong-mua-sam.component.scss']
})
export class PhuLucHopDongMuaSamComponent implements OnInit {
  @Input() idPhuLuc: number;
  @Input() detailHopDong: any = {};
  @Input() isViewPhuLuc: boolean;
  @Input() typeVthh: string;
  @Output()
  showChiTietEvent = new EventEmitter<any>();
  fileDinhKem: Array<FileDinhKem> = [];
  formPhuLuc: FormGroup;
  errorGhiChu: boolean = false;
  errorInputRequired: string = null;

  dataDiemDiemNhapHang: any[] = [];
  mapOfExpandedData: { [key: string]: any[] } = {};

  constructor(
    private modal: NzModalService,
    public userService: UserService,
    private uploadFileService: UploadFileService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private thongTinPhuLucHopDongService: ThongTinPhuLucHopDongService,
    public globals: Globals,
    public treeTableService: TreeTableService<any>,
  ) {
    this.formPhuLuc = this.fb.group({
      loaiVthh: [null],
      cloaiVthh: [null],
      soPluc: [null],
      ngayKy: [null],
      ngayHluc: [null],
      veViec: [null],
      soHd: [null],
      tenHd: [null],
      tuNgayHlucTrc: [null],
      denNgayHlucTrc: [null],
      tuNgayHlucDc: [null],
      denNgayHlucDc: [null],
      tgianThienHdTrc: [null],
      tgianThienHdDc: [null],
      noiDung: [null],
      ghiChu: [null],
    });
  }

  ngOnInit() {
    this.errorInputRequired = MESSAGE.ERROR_NOT_EMPTY;
    if (this.detailHopDong) {
      this.formPhuLuc.patchValue({
        loaiVthh: this.detailHopDong.loaiVthh,
        cloaiVthh: this.detailHopDong.cloaiVthh,
        soHd: this.detailHopDong.soHd ?? null,
        tenHd: this.detailHopDong.tenHd ?? null,
        denNgayHlucTrc: this.detailHopDong.denNgayHluc ?? null,
        tuNgayHlucTrc: this.detailHopDong.tuNgayHluc ?? null,
        tgianThienHdTrc: this.detailHopDong.soNgayThien ?? null,
      });
    }
    if (!!this.idPhuLuc) {
      this.loadPhuLuc(this.idPhuLuc);
    }
  }

  async loadPhuLuc(id) {
    if (id > 0) {
      let res = await this.thongTinPhuLucHopDongService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data;
          this.formPhuLuc.patchValue({
            soPluc: data.soPluc ?? null,
            ngayKy: data.ngayKy ?? null,
            ngayHluc: data.ngayHluc ?? null,
            veViec: data.veViec ?? null,
            soHd: data.soHd ?? null,
            tenHd: data.tenHd ?? null,
            tuNgayHlucDc: data.tuNgayHlucDc ?? null,
            denNgayHlucDc: data.denNgayHlucDc ?? null,
            tgianThienHdDc: data.tgianThienHdDc ?? null,
            noiDung: data.noiDung ?? null,
            ghiChu: data.ghiChu ?? null,
          });
        }
      }
    }
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
    this.fileDinhKem = this.fileDinhKem.filter((item, i) => i !== index);
  }

  async save() {
    this.spinner.show();
    try {
      if (!this.formPhuLuc.value.ghiChu && this.formPhuLuc.value.ghiChu == '') {
        this.errorGhiChu = true;
      } else {
        let body = this.formPhuLuc.value;
        body.fileDinhKems = this.fileDinhKem;
        if (this.idPhuLuc > 0) {
          body.id = this.idPhuLuc;
          let res = await this.thongTinPhuLucHopDongService.update(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.back();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        } else {
          let res = await this.thongTinPhuLucHopDongService.create(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
            this.back();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        }
        this.spinner.hide();
      }
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  validateGhiChu() {
    if (this.formPhuLuc.value.ghiChu && this.formPhuLuc.value.ghiChu != '') {
      this.errorGhiChu = false;
    } else {
      this.errorGhiChu = true;
    }
  }
}
