import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { saveAs } from 'file-saver';
import { Globals } from 'src/app/shared/globals';
import {
  DialogThongTinPhuLucHopDongMuaComponent
} from 'src/app/components/dialog/dialog-thong-tin-phu-luc-hop-dong-mua/dialog-thong-tin-phu-luc-hop-dong-mua.component';
import { UploadComponent } from 'src/app/components/dialog/dialog-upload/upload.component';
import { FileDinhKem } from 'src/app/models/FileDinhKem';
import { UploadFileService } from 'src/app/services/uploaFile.service';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MESSAGE } from 'src/app/constants/message';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ThongTinPhuLucHopDongService } from 'src/app/services/thongTinPhuLucHopDong.service';
import { HelperService } from "../../../../../../services/helper.service";
import { STATUS } from "../../../../../../constants/status";
import { convertTienTobangChu } from "../../../../../../shared/commonFunction";
import * as dayjs from "dayjs";
import {differenceInCalendarDays} from "date-fns";


@Component({
  selector: 'app-phu-luc',
  templateUrl: './phu-luc.component.html',
  styleUrls: ['./phu-luc.component.scss'],
})
export class PhuLucComponent implements OnInit {
  @Input() idPhuLuc: number;
  @Input() detailHopDong: any = {};
  @Input() isViewPhuLuc: boolean;
  @Input() isView: boolean;
  @Input() loaiVthh: String;
  @Output()
  showChiTietEvent = new EventEmitter<any>();
  fileDinhKem: any[] = [];
  formPhuLuc: FormGroup;
  errorGhiChu: boolean = false;
  errorInputRequired: string = null;
  isContentVisible: any[] = [true, true, true, true, true, true];
  isArrowUp: any[] = [false, false, false, false, false, false];
  dataTable: any[] = [];
  listChiCuc: any[] = [];
  listAllChiCuc: any[] = [];
  maPhuLucSuffix: any;
  STATUS = STATUS;
  tuNgayHlucTrc: Date | null = null;
  denNgayHlucTrc: Date | null = null;
  tuNgayHlucDc: Date | null = null;
  denNgayHlucDc: Date | null = null;
  constructor(
    private modal: NzModalService,
    public userService: UserService,
    private uploadFileService: UploadFileService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private thongTinPhuLucHopDongService: ThongTinPhuLucHopDongService,
    public globals: Globals,
    private helperService: HelperService,
  ) {
    this.formPhuLuc = this.fb.group({
      loaiVthh: [null],
      cloaiVthh: [null],
      soPluc: [null],
      maPluc: [null, [Validators.required]],
      ngayKy: [null],
      ngayHlucHd: [null],
      ngayHluc: [null],
      noiDungPl: [null],
      soHd: [null],
      tenHd: [null],
      ngayHlucTrc: [null],
      ngayHlucDc: [null],
      tgianThienHdTrc: [null],
      tgianThienHdDc: [null],
      noiDung: [null],
      ghiChu: [null],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự thảo'],
    });
  }

  disabledTuNgayHlucTrc = (startValue: Date): boolean => {
    if (!startValue || !this.denNgayHlucTrc) {
      return false;
    }
    return startValue.getTime() > this.denNgayHlucTrc.getTime();
  };

  disabledDenNgayHlucTrc = (endValue: Date): boolean => {
    if (!endValue || !this.tuNgayHlucTrc) {
      return false;
    }
    return endValue.getTime() <= this.tuNgayHlucTrc.getTime();
  };
  disabledTuNgayHlucSau = (startValue: Date): boolean => {
    if (!startValue || !this.denNgayHlucDc) {
      return false;
    }
    return startValue.getTime() > this.denNgayHlucDc.getTime();
  };

  disabledDenNgayHlucSau = (endValue: Date): boolean => {
    if (!endValue || !this.tuNgayHlucDc) {
      return false;
    }
    return endValue.getTime() <= this.tuNgayHlucDc.getTime();
  };

  ngOnInit() {
    this.errorInputRequired = MESSAGE.ERROR_NOT_EMPTY;
    if (this.detailHopDong) {
      this.formPhuLuc.patchValue({
        loaiVthh: this.detailHopDong.hd.loaiVthh,
        cloaiVthh: this.detailHopDong.hd.cloaiVthh,
        soHd: this.detailHopDong.hd.soHd ?? null,
        tenHd: this.detailHopDong.hd.tenHd ?? null,
        ngayHlucTrc: this.detailHopDong.hd.ngayKy ?? null,
        tgianThienHdTrc: this.detailHopDong.hd.soNgayThien ?? null,
      });
      this.dataTable = this.detailHopDong.diaDiem;
      let namKh = this.detailHopDong.hd.namHd;
      this.maPhuLucSuffix = `/${namKh}/PLHĐ`;
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
            maPluc: data.soPluc?.split('/')[0],
            soPluc: data.soPluc ?? null,
            ngayKy: data.ngayKy ?? null,
            ngayHluc: data.ngayHluc ?? null,
            noiDungPl: data.noiDungPl ?? null,
            ngayHlucDc: data.ngayHlucDc ?? null,
            tgianThienHdDc: data.tgianThienHdDc ?? null,
            tgianThienHdTrc: data.tgianThienHdTrc ?? null,
            noiDung: data.noiDung ?? null,
            ghiChu: data.ghiChu ?? null,
          });
          this.fileDinhKem = data.fileDinhKems ?? null;
          this.tuNgayHlucTrc = data.tuNgayHlucTrc ?? null;
          this.denNgayHlucTrc = data.denNgayHlucTrc ?? null;
          this.tuNgayHlucDc = data.tuNgayHlucDc ?? null;
          this.denNgayHlucDc = data.denNgayHlucDc ?? null;
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
    modal.afterClose.subscribe((res) => {
    });
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

  async save(isKy?) {
    this.spinner.show();
    try {
      if (this.checkValidForm()) {
        let body = this.formPhuLuc.value;
        body.soPluc = `${this.formPhuLuc.value.maPluc}${this.maPhuLucSuffix}`
        body.fileDinhKems = this.fileDinhKem;
        body.tuNgayHlucTrc = this.tuNgayHlucTrc != null ? dayjs(this.tuNgayHlucTrc).format('YYYY-MM-DD') : null;
        body.denNgayHlucTrc = this.denNgayHlucTrc != null ? dayjs(this.denNgayHlucTrc).format('YYYY-MM-DD') : null;
        body.tuNgayHlucDc = this.tuNgayHlucDc != null ? dayjs(this.tuNgayHlucDc).format('YYYY-MM-DD') : null;
        body.denNgayHlucDc = this.denNgayHlucDc != null ? dayjs(this.denNgayHlucDc).format('YYYY-MM-DD') : null;
        //sua+ky
        if (this.idPhuLuc > 0 && isKy) {
          // this.formPhuLuc.controls['ngayKy'].setValidators(Validators.required);
          // this.helperService.markFormGroupTouched(this.formPhuLuc);
          if (this.formPhuLuc.valid) {
            body.id = this.idPhuLuc;
            await this.thongTinPhuLucHopDongService.update(body)
              .then((res) => {
                if (res.msg == MESSAGE.SUCCESS) {
                  this.approve(this.idPhuLuc);
                  this.isViewPhuLuc = true;
                } else {
                  this.notification.error(MESSAGE.ERROR, res.msg);
                }
              });
          }
        }
        //sua
        else if (this.idPhuLuc > 0 && !isKy) {
          body.id = this.idPhuLuc;
          let res = await this.thongTinPhuLucHopDongService.update(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS,);
            this.back();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }

        }
        //them+ky
        else if (!(this.idPhuLuc > 0) && isKy) {
          // this.formPhuLuc.controls['ngayKy'].setValidators(Validators.required);
          // this.helperService.markFormGroupTouched(this.formPhuLuc);
          if (this.formPhuLuc.valid) {
            await this.thongTinPhuLucHopDongService.create(body)
              .then((res) => {
                if (res.msg == MESSAGE.SUCCESS) {
                  this.approve(res.data.id);
                  this.isViewPhuLuc = true;
                } else {
                  this.notification.error(MESSAGE.ERROR, res.msg);
                }
              });
          }
        }
        //them
        else if (!(this.idPhuLuc > 0) && !isKy) {
          let res = await this.thongTinPhuLucHopDongService.create(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS,);
            this.back();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        }
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
    } else {
      this.errorGhiChu = true;
    }
  }

  validateForm = (control: FormControl): { [s: string]: boolean } => {
    console.log(control);
    if (!control.value) {
      return { required: true };
    }
    return {};
  };

  async approve(id?) {
    if (this.formPhuLuc.valid) {
      const body = {
        id: id,
        trangThai: STATUS.DA_KY,
      }
      let res = await this.thongTinPhuLucHopDongService.approve(
        body,
      );
      if (res.msg == MESSAGE.SUCCESS) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  checkValidForm() {
    // this.formPhuLuc.get('noiDung').setValidators(null);
    this.helperService.markFormGroupTouched(this.formPhuLuc);
    if (this.formPhuLuc.invalid) {
      return false;
    }
    // if (
    //   !this.formPhuLuc.get('tgianThienHdDc').value &&
    //   !this.formPhuLuc.get('noiDung').value
    // ) {
    //   this.formPhuLuc.get('tgianThienHdDc').setValidators(Validators.required);
    //   this.formPhuLuc.get('noiDung').setValidators(Validators.required);
    //   this.helperService.markFormGroupTouched(this.formPhuLuc);
    //   this.notification.error(MESSAGE.ERROR, "Cần nhập ít nhất 1 nội dung điều chỉnh");
    //   return false;
    // }
    return true;
  }

  toggleContentVisibility(i) {
    this.isContentVisible[i] = !this.isContentVisible[i];
    this.isArrowUp[i] = !this.isArrowUp[i];
  }

  convertTien(tien: number): string {
    if (tien) {
      return convertTienTobangChu(tien);
    }
  }

  tinhNgayThienTrc() {
    if (this.tuNgayHlucTrc != null && this.denNgayHlucTrc != null) {
      let tuNgayHlucTrcDate = dayjs(this.tuNgayHlucTrc).toDate();
      let denNgayHlucTrcDate = dayjs(this.denNgayHlucTrc).toDate();
      let soNgayThien = differenceInCalendarDays(denNgayHlucTrcDate, tuNgayHlucTrcDate)
      this.formPhuLuc.patchValue({
        tgianThienHdTrc: soNgayThien,
      })
    }
  }

  tinhNgayThienSau() {
    if (this.tuNgayHlucDc != null && this.denNgayHlucDc != null) {
      let tuNgayHlucTrcDate = dayjs(this.tuNgayHlucDc).toDate();
      let denNgayHlucTrcDate = dayjs(this.denNgayHlucDc).toDate();
      let soNgayThien = differenceInCalendarDays(denNgayHlucTrcDate, tuNgayHlucTrcDate)
      this.formPhuLuc.patchValue({
        tgianThienHdDc: soNgayThien,
      })
    }
  }
}
