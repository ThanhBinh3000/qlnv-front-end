import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { FileDinhKem } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DonviService } from 'src/app/services/donvi.service';
import { TongHopTheoDoiCapVonService } from 'src/app/services/ke-hoach/von-phi/tongHopTheoDoiCapVon.service';
import { UserService } from 'src/app/services/user.service';
import { thongTinTrangThaiNhap } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
import { STATUS } from '../../../../../constants/status';
import { ThongTriDuyetYCapVonService } from '../../../../../services/ke-hoach/von-phi/thongTriDuyetYCapVon.service';
import dayjs from 'dayjs';
import { AMOUNT_NO_DECIMAL } from '../../../../../Utility/utils';

@Component({
  selector: 'app-thong-tin-tong-hop-theo-doi-cap-von',
  templateUrl: './thong-tin-tong-hop-theo-doi-cap-von.component.html',
  styleUrls: ['./thong-tin-tong-hop-theo-doi-cap-von.component.scss'],
})
export class ThongTinTongHopTheoDoiCapVonComponent implements OnInit {
  @Input() loaiVthhInput: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input() id: number;
  formData: FormGroup;
  fileDinhKem: Array<FileDinhKem> = [];
  userLogin: UserLogin;
  listChiCuc: any[] = [];
  titleStatus: string = '';
  titleButtonDuyet: string = '';
  iconButtonDuyet: string = '';
  styleStatus: string = 'du-thao-va-lanh-dao-duyet';
  listNam: any[] = [];
  userInfo: UserLogin;
  listFileDinhKem: any[] = [];
  itemThTheoDoi: any = {};
  dsBoNganh: any[] = [];
  dsThongTri: any[] = [];
  chiTietList: any[] = [];
  STATUS = STATUS;
  amount = AMOUNT_NO_DECIMAL;



  constructor(
    private modal: NzModalService,
    private danhMucService: DanhMucService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private fb: FormBuilder,
    public globals: Globals,
    public userService: UserService,
    private donviService: DonviService,
    private tongHopTheoDoiCapVonService: TongHopTheoDoiCapVonService,
    private thongTriDuyetYCapVonService: ThongTriDuyetYCapVonService,
  ) {
  }

  async ngOnInit() {
    this.spinner.show();
    this.userInfo = this.userService.getUserLogin();
    this.itemThTheoDoi.trangThai = this.globals.prop.NHAP_DU_THAO;
    this.itemThTheoDoi.tenTrangThai = 'Dự thảo';
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
    await Promise.all([
      this.getListBoNganh(),
      // this.getListThongTri(),
      this.initForm(),
    ]);
    await this.loadChiTiet(this.idInput);
    this.spinner.hide();
  }

  async loadChiTiet(id) {
    if (id > 0) {
      let res = await this.tongHopTheoDoiCapVonService.loadChiTiet(id);
      if (res.msg == MESSAGE.SUCCESS) {

        if (res.data) {
          this.itemThTheoDoi = res.data;
          this.initForm();
          if (this.itemThTheoDoi.fileDinhKems) {
            this.listFileDinhKem = this.itemThTheoDoi.fileDinhKems;
          }
        }
      }
    }
  }

  async getListBoNganh() {
    this.dsBoNganh = [];
    let res = await this.donviService.layTatCaDonViByLevel(0);
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsBoNganh = res.data;
    }
  }

  initForm() {
    this.formData = this.fb.group({
      soThongTri: [this.itemThTheoDoi ? this.itemThTheoDoi.soThongTri : null, [Validators.required]],
      dviThongTri: [this.itemThTheoDoi ? this.itemThTheoDoi.dviThongTri : null],
      soLenhChiTien: [this.itemThTheoDoi ? this.itemThTheoDoi.soLenhChiTien : null, [Validators.required]],
      chuong: [this.itemThTheoDoi ? this.itemThTheoDoi.chuong : null],
      loai: [this.itemThTheoDoi ? this.itemThTheoDoi.loai : null],
      nam: [this.itemThTheoDoi ? this.itemThTheoDoi.nam : null],
      khoan: [this.itemThTheoDoi ? this.itemThTheoDoi.khoan : null],
      lyDoChi: [this.itemThTheoDoi ? this.itemThTheoDoi.lyDoChi : null],
      soTien: [this.itemThTheoDoi ? this.itemThTheoDoi.soTien : null],
      soTienNt: [this.itemThTheoDoi ? this.itemThTheoDoi.soTienNt : null],
      loaiTien: [this.itemThTheoDoi ? this.itemThTheoDoi.loaiTien : null],
      tenLoaiTien: [this.itemThTheoDoi ? this.itemThTheoDoi.tenLoaiTien : null],
      dviThuHuong: [this.itemThTheoDoi ? this.itemThTheoDoi.dviThuHuong : null, [Validators.required]],
      tenDviThuHuong: [this.itemThTheoDoi ? this.itemThTheoDoi.tenDviThuHuong : null],
      dviThuHuongStk: [this.itemThTheoDoi ? this.itemThTheoDoi.dviThuHuongStk : null, [Validators.required]],
      dviThuHuongNganHang: [this.itemThTheoDoi ? this.itemThTheoDoi.dviThuHuongNganHang : null, [Validators.required]],
      canCu: [this.itemThTheoDoi ? this.itemThTheoDoi.canCu : null],
      dotTToan: [this.itemThTheoDoi ? this.itemThTheoDoi.dotTToan : null],
    });
  }

  async loadDonVi() {
    const res = await this.donviService.layDonViCon();
    this.listChiCuc = [];
    if (res.msg == MESSAGE.SUCCESS) {
      for (let i = 0; i < res.data.length; i++) {
        const item = {
          value: res.data[i].maDvi,
          text: res.data[i].tenDvi,
        };
        this.listChiCuc.push(item);
      }
    }
  }

  back() {
    this.showListEvent.emit();
  }

  async save(isOther?: boolean) {
    this.spinner.show();
    try {
      let body = this.formData.value;
      body.fileDinhKems = this.listFileDinhKem;
      body.id = this.idInput;
      if (this.idInput > 0) {
        let res = await this.tongHopTheoDoiCapVonService.sua(body);
        if (res.msg == MESSAGE.SUCCESS) {
          if (!isOther) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.back();
          } else {
            return res.data.id;
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      } else {
        let res = await this.tongHopTheoDoiCapVonService.them(body);
        if (res.msg == MESSAGE.SUCCESS) {
          if (!isOther) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
            this.back();
          } else {
            return res.data.id;
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(
        MESSAGE.ERROR,
        e?.error?.message ?? MESSAGE.SYSTEM_ERROR,
      );
    }
  }

  async guiDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn hoàn thành?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.idInput,
            trangThai: STATUS.DA_HOAN_THANH,
          };
          let res = await this.tongHopTheoDoiCapVonService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(
              MESSAGE.SUCCESS,
              MESSAGE.GUI_DUYET_SUCCESS,
            );
            this.back();
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

  thongTinTrangThai(trangThai: string): string {
    return thongTinTrangThaiNhap(trangThai);
  }

  async getListThongTri() {
    let body = {
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0,
      },
    };
    let res = await this.thongTriDuyetYCapVonService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsThongTri = res.data.content;
    }
  }

  async changeThongTri($event: any) {
    let res = await this.thongTriDuyetYCapVonService.loadChiTiet($event);
    if (res.msg == MESSAGE.SUCCESS) {
      let dataDetail = res.data;
      delete dataDetail.soThongTri;
      dataDetail.maDviDuocDuyet = dataDetail.dviThongTri;
      dataDetail.taiKhoan = dataDetail.dviThuHuongStk;
      dataDetail.nganHang = dataDetail.dviThuHuongNganHang;
      this.formData.patchValue(dataDetail);
    }
  }

}
