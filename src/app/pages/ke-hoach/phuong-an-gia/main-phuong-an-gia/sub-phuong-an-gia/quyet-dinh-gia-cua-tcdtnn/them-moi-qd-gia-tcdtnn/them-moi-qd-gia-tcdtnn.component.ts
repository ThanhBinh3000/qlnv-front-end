import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import dayjs from 'dayjs';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { QuyetDinhGiaBtcThongTinGia } from 'src/app/models/QuyetDinhBtcThongTinGia';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DanhMucTieuChuanService } from 'src/app/services/quantri-danhmuc/danhMucTieuChuan.service';
import { HelperService } from 'src/app/services/helper.service';
import { QuyetDinhGiaTCDTNNService } from 'src/app/services/ke-hoach/phuong-an-gia/quyetDinhGiaTCDTNN.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { DialogQuyetDinhGiaCuaTcdtnnComponent } from 'src/app/components/dialog/dialog-ke-hoach-phuong-an-gia/dialog-quyet-dinh-gia-cua-tcdtnn/dialog-quyet-dinh-gia-cua-tcdtnn.component';
@Component({
  selector: 'app-them-moi-qd-gia-tcdtnn',
  templateUrl: './them-moi-qd-gia-tcdtnn.component.html',
  styleUrls: ['./them-moi-qd-gia-tcdtnn.component.scss']
})
export class ThemMoiQdGiaTcdtnnComponent implements OnInit {

  @Input("pagType") pagType: string;
  @Input("type") type: string;
  @Input("isView") isView: boolean;
  @Input("noEdit") noEdit: boolean;
  @Input() loaiVthh: string;
  @Input() idInput: number;
  @Output("onClose") onClose = new EventEmitter<any>();
  formData: FormGroup;
  dsVthh: any[] = [];
  dsCloaiVthh: any[] = [];
  dsTieuChuanCl: any[] = [];
  dsHangHoa: any[] = [];
  dsLoaiGia: any[] = [];
  dsToTrinhDeXuat: any[] = [];
  arrThongTinGia: Array<QuyetDinhGiaBtcThongTinGia>;
  taiLieuDinhKemList: any[] = [];
  dsNam: any[] = [];
  dsBoNganh: any[] = [];
  userInfo: UserLogin;
  soDeXuat: string;
  maQd: string;
  dataTable: any[] = [];
  isErrorUnique = false;
  thueVat: number;
  radioValue: string;

  constructor(
    private readonly fb: FormBuilder,
    private readonly modal: NzModalService,
    public globals: Globals,
    private quyetDinhGiaTCDTNNService: QuyetDinhGiaTCDTNNService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    public userService: UserService,
    private helperService: HelperService,
    private danhMucService: DanhMucService,
    private danhMucTieuChuanService: DanhMucTieuChuanService
  ) {
    this.formData = this.fb.group(
      {
        id: [],
        namKeHoach: [dayjs().get('year'), [Validators.required]],
        soQd: [, [Validators.required]],
        soToTrinh: [null],
        ngayKy: [null, [Validators.required]],
        ngayHieuLuc: [null, [Validators.required]],
        loaiGia: [null],
        trichYeu: [null],
        trangThai: ['00'],
        ghiChu: [null],
        loaiVthh: [null],
        cloaiVthh: [],
        tchuanCluong: [null],
        gia: [null],
        giaVat: [null],
        thongTinGia: [null]
      }
    );
  }

  async ngOnInit() {
    await Promise.all([
      this.userInfo = this.userService.getUserLogin(),
      this.loadDsNam(),
      this.loadDsLoaiGia(),
      this.loadDsVthh(),
      this.loadToTrinhDeXuat(),
      this.maQd = "/QD-BTC",
      this.getDataDetail(this.idInput),
      this.loadTiLeThue()
    ]);
    this.spinner.hide();
  }

  async getDataDetail(id) {
    if (id > 0) {
      let res = await this.quyetDinhGiaTCDTNNService.getDetail(id);
      const data = res.data;
      this.formData.patchValue({
        id: data.id,
        namKeHoach: data.namKeHoach,
        soQd: data.soQd ? data.soQd.split("/")[0] : '',
        loaiVthh: data.loaiVthh,
        cloaiVthh: data.cloaiVthh,
        ngayKy: data.ngayKy,
        ngayHieuLuc: data.ngayHieuLuc,
        loaiGia: data.loaiGia,
        tchuanCluong: data.tchuanCluong,
        trichYeu: data.trichYeu,
        trangThai: data.trangThai,
        ghiChu: data.ghiChu,
        soToTrinh: data.soToTrinh

      });
      this.onChangeSoToTrinh(data.soToTrinh)
    }
  }

  onChangeNamQd($event) {
  }

  loadDsNam() {
    for (let i = -3; i < 23; i++) {
      this.dsNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
  }

  async loadTiLeThue() {
    let res = await this.danhMucService.danhMucChungGetAll("THUE_VAT");
    if (res.msg == MESSAGE.SUCCESS) {
      this.thueVat = res.data[0].giaTri;
    } else {
      this.thueVat = 10;
    }
  }

  quayLai() {
    this.onClose.emit();
  }

  banHanh() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn ban hành?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.idInput,
            lyDoTuChoi: null,
            trangThai: '29',
          };
          let res = await this.quyetDinhGiaTCDTNNService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(
              MESSAGE.SUCCESS,
              MESSAGE.BAN_HANH_SUCCESS,
            );
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

  async save() {
    this.spinner.show();
    let err = false;
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.spinner.hide();
      return;
    }
    let currentRow = this.formData.value;
    let currentLine = currentRow.thongTinGia;
    if (currentLine) {
      currentLine.forEach(item => {
        if (currentRow.loaiGia == 'LG01' && (item.giaQd > item.giaDn || item.giaQdVat > item.giaDnVat)) {
          err = true;
          item.giaQd = 0;
          return this.notification.error(MESSAGE.ERROR, 'Giá quyết định lớn hơn giá mua tối đa');
        }
        if (currentRow.loaiGia == 'LG02' && (item.giaQd < item.giaDn || item.giaQdVat < item.giaDnVat)) {
          err = true;
          item.giaQd = 0;
          return this.notification.error(MESSAGE.ERROR, 'Giá quyết định nhỏ hơn giá bán tối thiểu');
        }
      })
    }
    if (!err) {
      let body = this.formData.value;
      body.pagType = this.pagType;
      let res;
      if (this.idInput > 0) {
        res = await this.quyetDinhGiaTCDTNNService.update(body);
      } else {
        res = await this.quyetDinhGiaTCDTNNService.create(body);
      }
      if (res.msg == MESSAGE.SUCCESS) {
        if (this.idInput > 0) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        } else {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        }
        this.quayLai();
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
    this.spinner.hide();
  }

  async loadDsLoaiGia() {
    this.dsLoaiGia = [];
    let res = await this.danhMucService.danhMucChungGetAll("LOAI_GIA");
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsLoaiGia = res.data;
    }
  }

  async loadDsVthh() {
    this.dsVthh = [];
    let res = await this.danhMucService.danhMucChungGetAll("LOAI_HHOA");
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsVthh = res.data.filter(item => item.ma != "02");
    }
  }

  async loadToTrinhDeXuat() {
    this.dsToTrinhDeXuat = [];
    let res = await this.quyetDinhGiaTCDTNNService.loadToTrinhTongHop({});
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsToTrinhDeXuat = res.data;
    }
  }

  async onChangeSoToTrinh(event) {
    let curToTrinh = this.dsToTrinhDeXuat.find(item => item.soToTrinh == event);
    if (curToTrinh) {
      this.formData.controls["loaiVthh"].setValue(curToTrinh.loaiVthh);
      let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha({ "str": curToTrinh.loaiVthh });
      this.dsCloaiVthh = [];
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.dsCloaiVthh = res.data;
        }
      }
      this.formData.controls["cloaiVthh"].setValue(curToTrinh.cloaiVthh);
      this.formData.controls["loaiGia"].setValue(curToTrinh.loaiGia);
      res = await this.danhMucTieuChuanService.getDetailByMaHh(curToTrinh.loaiVthh);
      this.dsTieuChuanCl = [];
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          let tmp = [];
          tmp.push({ "id": res.data.id, "tenQchuan": res.data.tenQchuan });
          this.dsTieuChuanCl = tmp;
        }
      }
      this.formData.controls["tchuanCluong"].setValue(this.dsTieuChuanCl[0].id);
      this.arrThongTinGia = [];
      res = await this.quyetDinhGiaTCDTNNService.loadToTrinhTongHopThongTinGia(curToTrinh.id);
      if (res.msg == MESSAGE.SUCCESS && res.data) {
        this.arrThongTinGia = res.data.pagChiTiets;
        this.formData.controls["thongTinGia"].setValue(this.arrThongTinGia);
      } else {
        this.arrThongTinGia = [];
      }
      this.radioValue = curToTrinh.soToTrinh;
    }

  }

  async onChangeLoaiVthh(event) {
    let body = {
      "str": event
    };
    let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha(body);
    this.dsCloaiVthh = [];
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        this.dsCloaiVthh = res.data;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  private UniqueValue(c: AbstractControl): { [key: string]: boolean } {
    if (this.isErrorUnique) {
      return { "uniqueError": true };
    }
    return null;
  }

  async calculateVAT(index: number, type: number) {
    let currentRow = this.formData.value;
    let currentLine = this.arrThongTinGia[index];
    //gia mua toi da
    if (type === 0) {
      this.arrThongTinGia[index].giaQdVat = this.arrThongTinGia[index].giaQd + this.arrThongTinGia[index].giaQd * this.thueVat;
    }
    if (currentRow.loaiGia == 'LG01' && (currentLine.giaQd > currentLine.giaDn || currentLine.giaQdVat > currentLine.giaDnVat)) {
      currentLine.giaQd = 0
      currentLine.giaQdVat = 0
      this.notification.error(MESSAGE.ERROR, 'Giá quyết định lớn hơn giá mua tối đa');
      return;
    }
    //gia ban toi thieu
    if (currentRow.loaiGia == 'LG02' && (currentLine.giaQd < currentLine.giaDn || currentLine.giaQdVat < currentLine.giaDnVat)) {
      currentLine.giaQd = 0
      currentLine.giaQdVat = 0
      this.arrThongTinGia[index].giaQd = 0;
      this.notification.error(MESSAGE.ERROR, 'Giá quyết định nhỏ hơn giá bán tối thiểu');
      return;
    }
    //0:gia>vat 1:vat>gia

  }

  openDialogToTrinh() {
    let radioValue = this.radioValue;
    if (!this.noEdit) {
      let modalQD = this.modal.create({
        nzTitle: 'TỜ TRÌNH PHƯƠNG ÁN GIÁ CỦA VỤ KẾ HOẠCH',
        nzContent: DialogQuyetDinhGiaCuaTcdtnnComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '700px',
        nzFooter: null,
        nzComponentParams: {
          radioValue
        },
      });
      modalQD.afterClose.subscribe((data) => {
        if (data) {
          console.log(data)
          this.formData.patchValue({
            soToTrinh: data,
            // thongTinToTrinh: data.soToTrinh ? data.soToTrinh : null
          });
          // this.thongTinToTrinh = data;
          this.onChangeSoToTrinh(data);
          this.radioValue = data;
          this.spinner.hide();
        }
      });
    }
  }
}


