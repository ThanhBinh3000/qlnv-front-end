import { DialogThemMoiGoiThauComponent } from 'src/app/components/dialog/dialog-them-moi-goi-thau/dialog-them-moi-goi-thau.component';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { VatTu } from 'src/app/components/dialog/dialog-them-thong-tin-vat-tu-trong-nam/danh-sach-vat-tu-hang-hoa.type';
import { LIST_VAT_TU_HANG_HOA, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { DanhSachGoiThau, FileDinhKem, ThongTinChung, ThongTinDeXuatKeHoachLuaChonNhaThau, ThongTinDeXuatKeHoachLuaChonNhaThauInput } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { dauThauGoiThauService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/tochuc-trienkhai/dauThauGoiThau.service';
import { HelperService } from 'src/app/services/helper.service';
import { QuyetDinhPheDuyetKeHoachLCNTService } from 'src/app/services/quyetDinhPheDuyetKeHoachLCNT.service';
import { QuyetDinhPheDuyetKetQuaLCNTService } from 'src/app/services/quyetDinhPheDuyetKetQuaLCNT.service';
import { UploadFileService } from 'src/app/services/uploaFile.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { environment } from 'src/environments/environment';
import { DialogDanhSachHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import { STATUS } from "../../../../../../constants/status";
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import {
  ThongTinDauThauService
} from "../../../../../../services/qlnv-hang/nhap-hang/dau-thau/tochuc-trienkhai/thongTinDauThau.service";

@Component({
  selector: 'app-themmoi-quyetdinh-ketqua-lcnt',
  templateUrl: './themmoi-quyetdinh-ketqua-lcnt.component.html',
  styleUrls: ['./themmoi-quyetdinh-ketqua-lcnt.component.scss']
})
export class ThemmoiQuyetdinhKetquaLcntComponent implements OnInit {
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input() isViewDetail: boolean;
  @Input() idInput: number;

  formData: FormGroup;
  taiLieuDinhKemList: any[] = [];

  listQdPdKhlcnt : any[] = []
  idQdPdKhlcnt : number;
  maQd : string;
  listNam :any[] = [];

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
    private quyetDinhPheDuyetKeHoachLCNTService: QuyetDinhPheDuyetKeHoachLCNTService,
    private dauThauGoiThauService: dauThauGoiThauService,
    private quyetDinhPheDuyetKetQuaLCNTService: QuyetDinhPheDuyetKetQuaLCNTService,

  ) {
    this.formData = this.fb.group(
      {
        id: [],
        soQd: [, [Validators.required]],
        ngayTao: [dayjs().format('YYYY-MM-DD'), [Validators.required]],
        ngayHluc: [null, [Validators.required]],
        namKhoach: [dayjs().get('year'), [Validators.required]],
        trichYeu: [null,],
        soQdPdKhlcnt: ['', [Validators.required]],
        idQdPdKhlcnt : ['',[Validators.required]],
        ghiChu: [null,],
        trangThai: ['00'],
        tenTrangThai: ['Dự thảo'],
      }
    );
  }

  async ngOnInit() {
    await this.spinner.show();
    this.userInfo = this.userService.getUserLogin();
    this.maQd = "/" + this.userInfo.MA_QD;
    await this.getListQdPdKhlcnt();
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

  disableForm():boolean{
    if(this.formData.get('trangThai').value == STATUS.BAN_HANH){
      return true
    }
    return false;
  }

  async getDetail(id: number) {
    let res = await this.quyetDinhPheDuyetKetQuaLCNTService.getDetail(id);
    if (res.msg == MESSAGE.SUCCESS) {
      const dataDetail = res.data;
      this.helperService.bidingDataInFormGroup(this.formData,dataDetail);
      this.formData.patchValue({
        soQd: dataDetail.soQd.split('/')[0],
      })
      this.taiLieuDinhKemList = dataDetail.fileDinhKems;
    }
  }

  async save(isBanHanh?) {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      return;
    }
    let body = this.formData.value;
    body.soQd = body.soQd + this.maQd;
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

  async getListQdPdKhlcnt() {
    let body = {
      namKhoach: this.formData.get('namKhoach').value,
      trangThai: STATUS.BAN_HANH,
      trangThaiDtl: STATUS.HOAN_THANH_CAP_NHAT,
      lastest: 1,
      maDvi : this.userService.isTongCuc() ? '' : this.userInfo.MA_DVI,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0,
      },
    };
    let res = await this.quyetDinhPheDuyetKeHoachLCNTService.search(body);
    this.listQdPdKhlcnt = res.data.content;
  }

  openDialogSoQdKhlcnt() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách số quyết định kế hoạch lựa chọn nhà thầu',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listQdPdKhlcnt,
        dataHeader: ['Số quyết định', 'Ngày quyết định', 'Loại hàng hóa', 'Chủng loại hàng hóa'],
        code: 'dsQdKhlcnt'
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      this.idQdPdKhlcnt = data.id;
      this.formData.patchValue({
        soQdPdKhlcnt: data.soQd,
        idQdPdKhlcnt : data.id,
      })
    });
  }

}
