import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
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
import { QuyetDinhPheDuyetKetQuaChaoGiaMTTService } from 'src/app/services/quyet-dinh-phe-duyet-ket-qua-chao-gia-mtt.service';
import { QuyetDinhPheDuyetKeHoachMTTService } from 'src/app/services/quyet-dinh-phe-duyet-ke-hoach-mtt.service';
import { DialogCanCuThongTinChaoGiaComponent } from 'src/app/components/dialog/dialog-can-cu-thong-tin-chao-gia/dialog-can-cu-thong-tin-chao-gia.component';
import { ChaogiaUyquyenMualeService } from 'src/app/services/chaogia-uyquyen-muale.service';
import { Chain } from '@angular/compiler';

@Component({
  selector: 'app-themmoi-quyetdinh-ketqua-chaogia',
  templateUrl: './themmoi-quyetdinh-ketqua-chaogia.component.html',
  styleUrls: ['./themmoi-quyetdinh-ketqua-chaogia.component.scss']
})
export class ThemmoiQuyetdinhKetquaChaogiaComponent implements OnInit {
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input() isViewDetail: boolean;
  @Input() idInput: number;
  @Input() selectedData: any;

  formData: FormGroup;
  taiLieuDinhKemList: any[] = [];
  listMtt: any[] = [];
  listQdPdKhMtt: any[] = [];
  idPdKq: number;
  trangThaiTkhai: string;
  trangthaish = STATUS.BAN_HANH;;
  maQd: string;
  listNam: any[] = [];
  userInfo: UserLogin;
  STATUS = STATUS
  constructor(
    private modal: NzModalService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private fb: FormBuilder,
    public globals: Globals,
    public userService: UserService,
    private helperService: HelperService,
    private quyetDinhPheDuyetKeHoachMTTService: QuyetDinhPheDuyetKeHoachMTTService,
    private quyetDinhPheDuyetKetQuaChaoGiaMTTService: QuyetDinhPheDuyetKetQuaChaoGiaMTTService,
    private chaogiaUyquyenMualeService: ChaogiaUyquyenMualeService,
  ) {
    this.formData = this.fb.group(
      {
        id: [],
        soQdPdKq: [, [Validators.required]],
        soQdPdCg: [, [Validators.required]],
        ngayKy: [dayjs().format('YYYY-MM-DD'), [Validators.required]],
        ngayHluc: [null, [Validators.required]],
        namKh: [dayjs().get('year'), [Validators.required]],
        trichYeu: [null,],
        idPdKq: ['', [Validators.required]],
        ghiChu: [null,],
        trangThai: [STATUS.DU_THAO],
        tenTrangThai: ['Dự thảo'],
        cloaiVthh: [null,],
        loaiVthh: [null,],
        tenLoaiVthh: [null,],
        tenCloaiVthh: [null,],
        trangThaiTkhai: [STATUS.CHUA_CAP_NHAT],
      }
    );
  }

  async ngOnInit() {
    await this.spinner.show();
    this.userInfo = this.userService.getUserLogin();
    this.maQd = "/" + this.userInfo.MA_QD;
    await this.getListQdPdKhMtt();
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

  disableForm() {
    if (this.formData.get('trangThai').value == STATUS.BAN_HANH) {
      return true
    }
    return false;
  }

  async getDetail(id: number) {
    let res = await this.quyetDinhPheDuyetKetQuaChaoGiaMTTService.getDetail(id);
    if (res.msg == MESSAGE.SUCCESS) {
      const dataDetail = res.data;
      this.helperService.bidingDataInFormGroup(this.formData, dataDetail);
      this.formData.patchValue({
        soQdPdKq: dataDetail.soQdPdKq.split('/')[0],
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
    body.soQdPdKq = body.soQdPdKq + this.maQd;
    body.fileDinhKems = this.taiLieuDinhKemList;
    body.hhChiTietTTinChaoGiaList = this.listMtt
    let res;
    if (this.formData.get('id').value > 0) {
      res = await this.quyetDinhPheDuyetKetQuaChaoGiaMTTService.update(body);
    } else {
      res = await this.quyetDinhPheDuyetKetQuaChaoGiaMTTService.create(body);
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

          const res = await this.quyetDinhPheDuyetKetQuaChaoGiaMTTService.approve(body);
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

  async getListQdPdKhMtt() {
    let body = {
      namKh: this.formData.get('namKh').value,
      trangThai: STATUS.BAN_HANH,
      trangThaiTkhai: STATUS.HOAN_THANH_CAP_NHAT,
      maDvi: this.userInfo.MA_DVI,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0,
      },
    };
    let res = await this.chaogiaUyquyenMualeService.search(body);
    this.listQdPdKhMtt = res.data.content;
  }

  openDialogSoQdKhMtt() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách số quyết định kế hoạch mua trực tiếp',
      nzContent: DialogCanCuThongTinChaoGiaComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listQdPdKhMtt,
        dataHeader: ['Số quyết định', 'Ngày quyết định', 'Loại hàng hóa', 'Chủng loại hàng hóa'],
        code: 'dsQdKhMtt'
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      this.idPdKq = data.id;
      console.log(this.idPdKq, 555);
      const res = await this.chaogiaUyquyenMualeService.getDetail(this.idPdKq);
      console.log(res, 4444)
      if (res.msg == MESSAGE.SUCCESS) {
        const dataDetail = res.data;
        dataDetail.trangThai = STATUS.DU_THAO;
        dataDetail.tenTrangThai = 'Dự Thảo'
        this.helperService.bidingDataInFormGroup(this.formData, dataDetail);
        this.listMtt = dataDetail.hhChiTietTTinChaoGiaList;
        this.formData.patchValue({
          trangThaiTkhai: dataDetail.trangThaiTkhai,
          tenTrangThaiTkhai: dataDetail.tenTrangThaiTkhai
        })
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      this.trangThaiTkhai = data.trangThaiTkhai
      this.formData.patchValue({
        soQdPdCg: data.soQdPduyet,
        idPdKq: data.id,
        trangThaiTkhai: data.trangThaiTkhai
      })
      console.log(this.formData);
    });
  }




}
