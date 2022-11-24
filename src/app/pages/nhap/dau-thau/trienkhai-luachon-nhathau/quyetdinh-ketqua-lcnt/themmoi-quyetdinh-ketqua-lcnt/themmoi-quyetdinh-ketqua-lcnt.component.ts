import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DanhSachGoiThau, FileDinhKem, ThongTinChung, ThongTinDeXuatKeHoachLuaChonNhaThau, ThongTinDeXuatKeHoachLuaChonNhaThauInput } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { dauThauGoiThauService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/tochuc-trienkhai/dauThauGoiThau.service';
import { HelperService } from 'src/app/services/helper.service';
import { QuyetDinhPheDuyetKeHoachLCNTService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/quyetDinhPheDuyetKeHoachLCNT.service';
import { QuyetDinhPheDuyetKetQuaLCNTService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/tochuc-trienkhai/quyetDinhPheDuyetKetQuaLCNT.service';
import { UploadFileService } from 'src/app/services/uploaFile.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { STATUS } from "../../../../../../constants/status";
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import {
  ThongTinDauThauService
} from "../../../../../../services/qlnv-hang/nhap-hang/dau-thau/tochuc-trienkhai/thongTinDauThau.service";
import { isEmpty } from 'lodash'

@Component({
  selector: 'app-themmoi-quyetdinh-ketqua-lcnt',
  templateUrl: './themmoi-quyetdinh-ketqua-lcnt.component.html',
  styleUrls: ['./themmoi-quyetdinh-ketqua-lcnt.component.scss']
})
export class ThemmoiQuyetdinhKetquaLcntComponent implements OnInit {
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input() loaiVthh: String;
  @Input() isViewDetail: boolean;
  @Input() idInput: number;

  formData: FormGroup;
  taiLieuDinhKemList: any[] = [];

  listQdPdKhlcnt: any[] = []
  maQd: String;
  listNam: any[] = [];

  userInfo: UserLogin;
  STATUS = STATUS
  constructor(
    private modal: NzModalService,
    private danhMucService: DanhMucService,
    private spinner: NgxSpinnerService,
    private uploadFileService: UploadFileService,
    private notification: NzNotificationService,
    private fb: FormBuilder,
    public globals: Globals,
    public userService: UserService,
    private helperService: HelperService,
    private quyetDinhPheDuyetKetQuaLCNTService: QuyetDinhPheDuyetKetQuaLCNTService,
    private thongTinDauThauService: ThongTinDauThauService

  ) {
    this.formData = this.fb.group(
      {
        id: [],
        soQd: [, [Validators.required]],
        ngayKy: [dayjs().format('YYYY-MM-DD'), [Validators.required]],
        ngayHluc: [dayjs().format('YYYY-MM-DD'), [Validators.required]],
        namKhoach: [dayjs().get('year'), [Validators.required]],
        trichYeu: [null,],
        soQdPdKhlcnt: ['', [Validators.required]],
        idQdPdKhlcnt: ['', [Validators.required]],
        idQdPdKhlcntDtl: ['', [Validators.required]],
        ghiChu: [null,],
        trangThai: ['00'],
        tenTrangThai: ['Dự thảo'],
        loaiVthh: [''],
        cloaiVthh: ['']
      }
    );
  }

  async ngOnInit() {
    await this.spinner.show();
    this.userInfo = this.userService.getUserLogin();
    this.maQd = "/" + this.userInfo.MA_QD;
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
    if (this.idInput > 0) {
      await this.getDetail(this.idInput);
    }
    await this.spinner.hide();
  }

  disableForm(): boolean {
    if (this.formData.get('trangThai').value == STATUS.BAN_HANH) {
      return true
    }
    return false;
  }

  async getDetail(id: number) {
    let res = await this.quyetDinhPheDuyetKetQuaLCNTService.getDetail(id);
    if (res.msg == MESSAGE.SUCCESS) {
      const dataDetail = res.data;
      this.helperService.bidingDataInFormGroup(this.formData, dataDetail);
      this.formData.patchValue({
        soQd: dataDetail.soQd?.split('/')[0],
      })
      this.taiLieuDinhKemList = dataDetail.fileDinhKems;
    }
  }

  async save(isBanHanh?) {
    this.setValidator(isBanHanh);
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      return;
    }
    let body = this.formData.value;
    if (this.formData.value.soQd) {
      body.soQd = this.formData.value.soQd + this.maQd;
    }
    body.fileDinhKems = this.taiLieuDinhKemList;
    let res;
    if (this.formData.get('id').value > 0) {
      res = await this.quyetDinhPheDuyetKetQuaLCNTService.update(body);
    } else {
      res = await this.quyetDinhPheDuyetKetQuaLCNTService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isBanHanh) {
        this.idInput = res.data.id;
        this.pheDuyet();
      } else {
        if (this.formData.get('id').value) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
          this.quayLai();
        } else {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
          this.quayLai();
        }
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  setValidator(isBanHanh) {
    if (isBanHanh) {
      this.formData.controls["soQd"].setValidators([Validators.required]);
      this.formData.controls["ngayKy"].setValidators([Validators.required]);
      this.formData.controls["ngayHluc"].setValidators([Validators.required]);
    } else {
      this.formData.controls["soQd"].clearValidators();
      this.formData.controls["ngayKy"].clearValidators();
      this.formData.controls["ngayHluc"].clearValidators();
    };
  }

  quayLai() {
    this.showListEvent.emit();
  }

  pheDuyet() {
    let trangThai = '';
    let msg = '';
    switch (this.formData.get('trangThai').value) {
      case STATUS.DU_THAO: {
        trangThai = STATUS.BAN_HANH;
        msg = 'Bạn có muốn ban hành ?'
        break;
      }
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: msg,
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.idInput,
            lyDoTuChoi: null,
            trangThai: trangThai,
          };

          const res = await this.quyetDinhPheDuyetKetQuaLCNTService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
            this.quayLai();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  async openDialogSoQdKhlcnt() {
    let body
    if (this.loaiVthh.startsWith("02")) {
      body = {
        namKhoach: this.formData.get('namKhoach').value,
        trangThaiDt: STATUS.HOAN_THANH_CAP_NHAT,
        paggingReq: {
          limit: this.globals.prop.MAX_INTERGER,
          page: 0,
        },
        loaiVthh: this.loaiVthh
      };
    } else {
      body = {
        namKhoach: this.formData.get('namKhoach').value,
        trangThaiDtl: STATUS.HOAN_THANH_CAP_NHAT,
        maDvi: this.userInfo.MA_DVI,
        paggingReq: {
          limit: this.globals.prop.MAX_INTERGER,
          page: 0,
        },
        loaiVthh: this.loaiVthh
      };
    }

    let res = await this.thongTinDauThauService.search(body);
    this.listQdPdKhlcnt = res.data.content.filter(item => isEmpty(item.soQdPdKqLcnt));
    this.listQdPdKhlcnt.forEach(element => {
      element.soQdPdKhlcnt = element.hhQdKhlcntHdr.soQd;
      element.tenCloaiVthh = element.hhQdKhlcntHdr.tenCloaiVthh;
      element.tenLoaiVthh = element.hhQdKhlcntHdr.tenLoaiVthh;
    });

    const modalQD = this.modal.create({
      nzTitle: 'Danh sách số quyết định kế hoạch lựa chọn nhà thầu',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1200px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listQdPdKhlcnt,
        dataHeader: ['Số Đề Xuất KHLCNT', 'Số QĐ PD KHLCNT', 'Loại hàng hóa', 'Chủng loại hàng hóa', 'Tổng số gói thầu', 'Số gói thầu trúng', 'Số gói thầu trượt'],
        dataColumn: ['soDxuat', 'soQdPdKhlcnt', 'tenLoaiVthh', 'tenCloaiVthh', 'soGthau', 'soGthauTrung', 'soGthauTruot']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          soQdPdKhlcnt: data.hhQdKhlcntHdr.soQd,
          idQdPdKhlcnt: data.hhQdKhlcntHdr.id,
          idQdPdKhlcntDtl: this.loaiVthh.startsWith('02') ? null : data.id,
          loaiVthh: data.loaiVthh,
          cloaiVthh: data.cloaiVthh
        })
      }
    });
  }

  getNameFile(event?: any, item?: FileDinhKem) {
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
          const fileDinhKem = new FileDinhKem();
          fileDinhKem.fileName = resUpload.filename;
          this.formData.patchValue({
            // nameFilePhuongAn: resUpload.filename
          })
          fileDinhKem.fileSize = resUpload.size;
          fileDinhKem.fileUrl = resUpload.url;
          // this.filePhuongAn = fileDinhKem;
        });
    }
  }

}
