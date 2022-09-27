import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
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

@Component({
  selector: 'app-thong-tin-tong-hop-theo-doi-cap-von',
  templateUrl: './thong-tin-tong-hop-theo-doi-cap-von.component.html',
  styleUrls: ['./thong-tin-tong-hop-theo-doi-cap-von.component.scss']
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

  userInfo: UserLogin;
  listFileDinhKem: any[] = [];
  khBanDauGia: any = {};
  dsBoNganh: any[] = [];
  chiTietList: any[] = [];

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
  ) {
  }

  async ngOnInit() {
    this.spinner.show();
    this.userInfo = this.userService.getUserLogin();
    this.khBanDauGia.trangThai = this.globals.prop.NHAP_DU_THAO;
    this.khBanDauGia.tenTrangThai = "Dự thảo";
    await Promise.all([
      this.initForm(),
      this.getListBoNganh(),
    ]);
    await this.loadChiTiet(this.idInput);
    this.spinner.hide();
  }

  async loadChiTiet(id) {
    if (id > 0) {
      let res = await this.tongHopTheoDoiCapVonService.loadChiTiet(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.khBanDauGia = res.data;
          this.initForm();
          if (this.khBanDauGia.fileDinhKems) {
            this.listFileDinhKem = this.khBanDauGia.fileDinhKems;
          }
        }
      }
    }
  }

  async getListBoNganh() {
    this.dsBoNganh = [];
    let res = await this.danhMucService.danhMucChungGetAll('BO_NGANH');
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsBoNganh = res.data;
    }
  }

  initForm() {
    this.formData = this.fb.group({
      soThongTri: [this.khBanDauGia ? this.khBanDauGia.soThongTri : null, [Validators.required]],
      maDviDuocDuyet: [this.khBanDauGia ? this.khBanDauGia.maDviDuocDuyet : null],
      soLenhChiTien: [this.khBanDauGia ? this.khBanDauGia.soLenhChiTien : null, [Validators.required]],
      chuong: [this.khBanDauGia ? this.khBanDauGia.chuong : null],
      loai: [this.khBanDauGia ? this.khBanDauGia.loai : null],
      khoan: [this.khBanDauGia ? this.khBanDauGia.khoan : null],
      lyDoChi: [this.khBanDauGia ? this.khBanDauGia.lyDoChi : null],
      soTien: [this.khBanDauGia ? this.khBanDauGia.soTien : null],
      dviThuHuong: [this.khBanDauGia ? this.khBanDauGia.dviThuHuong : null, [Validators.required]],
      taiKhoan: [this.khBanDauGia ? this.khBanDauGia.taiKhoan : null, [Validators.required]],
      nganHang: [this.khBanDauGia ? this.khBanDauGia.nganHang : null, [Validators.required]],
      canCu: [this.khBanDauGia ? this.khBanDauGia.canCu : null],
      dotTToan: [this.khBanDauGia ? this.khBanDauGia.dotTToan : null],

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
      nzContent: 'Bạn có chắc chắn muốn gửi duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.idInput,
            trangThai: this.globals.prop.NHAP_BAN_HANH,
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
}


