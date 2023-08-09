import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import dayjs from 'dayjs';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {MESSAGE} from 'src/app/constants/message';
import {UserLogin} from 'src/app/models/userlogin';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {DanhMucTieuChuanService} from 'src/app/services/quantri-danhmuc/danhMucTieuChuan.service';
import {HelperService} from 'src/app/services/helper.service';
import {QuyetDinhGiaTCDTNNService} from 'src/app/services/ke-hoach/phuong-an-gia/quyetDinhGiaTCDTNN.service';
import {UserService} from 'src/app/services/user.service';
import {Globals} from 'src/app/shared/globals';
import {STATUS} from "../../../../../../../constants/status";
import {
  TongHopPhuongAnGiaService
} from "../../../../../../../services/ke-hoach/phuong-an-gia/tong-hop-phuong-an-gia.service";
import {DialogPagQdTcdtnnComponent} from "../dialog-pag-qd-tcdtnn/dialog-pag-qd-tcdtnn.component";
import {DialogPagQdBtcComponent} from "../../quyet-dinh-gia-btc/dialog-pag-qd-btc/dialog-pag-qd-btc.component";
import {
  QuyetDinhGiaCuaBtcService
} from "../../../../../../../services/ke-hoach/phuong-an-gia/quyetDinhGiaCuaBtc.service";

@Component({
  selector: 'app-them-moi-qd-gia-tcdtnn-vt',
  templateUrl: './them-moi-qd-gia-tcdtnn-vt.component.html',
  styleUrls: ['./them-moi-qd-gia-tcdtnn-vt.component.scss']
})
export class ThemMoiQdGiaTcdtnnVtComponent implements OnInit {

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
  arrThongTinGia: any[] = [];
  taiLieuDinhKemList: any[] = [];
  dsNam: any[] = [];
  dsBoNganh: any[] = [];
  userInfo: UserLogin;
  soDeXuat: string;
  maQd: string;
  dataTable: any[] = [];
  isErrorUnique = false;
  thueVat: number = 10 / 100;
  radioValue: string;
  fileDinhKem: any[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly modal: NzModalService,
    public globals: Globals,
    private quyetDinhGiaTCDTNNService: QuyetDinhGiaTCDTNNService,
    private quyetDinhGiaCuaBtcService: QuyetDinhGiaCuaBtcService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    public userService: UserService,
    private helperService: HelperService,
    private danhMucService: DanhMucService
  ) {
    this.formData = this.fb.group(
      {
        id: [],
        namKeHoach: [dayjs().get('year'), [Validators.required]],
        soQd: [, [Validators.required]],
        soDeXuat: [null],
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
        soQdCanDc: [null],
        loaiDeXuat: ['00'],
      }
    );
  }

  async ngOnInit() {
    await Promise.all([
      this.userInfo = this.userService.getUserLogin(),
      this.loadDsNam(),
      this.loadDsLoaiGia(),
      this.maQd = "/QĐ-TCDT",
    ]);
    await this.getDataDetail(this.idInput)
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
        soDeXuat: data.soToTrinh,
        soToTrinh: data.soToTrinh

      });
      this.fileDinhKem = data.fileDinhKems;
      this.arrThongTinGia = data.thongTinGiaVt
    }
  }

  loadDsNam() {
    for (let i = -3; i < 23; i++) {
      this.dsNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
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
            id: this.formData.value.id,
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

  async save(isBanHanh?) {
    this.spinner.show();
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.spinner.hide();
      return;
    }
    if (this.arrThongTinGia && this.arrThongTinGia.length > 0) {
      if (this.formData.value.loaiGia == 'LG03') {
        this.dataTable.forEach(item => {
          if (item.vat) {
            item.giaQdTcdtVat = item.giaQdTcdt + item.giaQdTcdt * item.vat
          }
        })
      }
    }
    let body = this.formData.value;
    body.soQd = body.soQd + this.maQd;
    body.maDvi = this.userInfo.MA_DVI;
    body.pagType = this.pagType;
    body.thongTinGiaVt = this.arrThongTinGia;
    body.fileDinhKemReq = this.fileDinhKem;
    let res;
    if (this.idInput > 0) {
      res = await this.quyetDinhGiaTCDTNNService.update(body);
    } else {
      res = await this.quyetDinhGiaTCDTNNService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isBanHanh) {
        this.formData.patchValue({
          id: res.data.id,
          trangThai: res.data.trangThai
        })
        this.banHanh();
      }
      if (!isBanHanh) {
        if (this.idInput > 0) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        } else {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        }
        this.quayLai();
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }
  async loadDsLoaiGia() {
    this.dsLoaiGia = [];
    let res = await this.danhMucService.danhMucChungGetAll("LOAI_GIA");
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsLoaiGia = res.data;
      if (this.dsLoaiGia && this.dsLoaiGia.length > 0) {
        this.dsLoaiGia = res.data.filter(item =>
          item.ma == 'LG03' || item.ma == 'LG04'
        );
      }
    }
  }

  openDialogToTrinh() {
    if (!this.isView && this.formData.value.loaiGia != null) {
      let modalQD = this.modal.create({
        nzTitle: 'CHỌN SỐ TỜ TRÌNH HỒ SƠ PHƯƠNG ÁN GIÁ HOẶC SỐ TỜ TRÌNH ĐỀ XUẤT ĐIỀU CHỈNH GIÁ',
        nzContent: DialogPagQdBtcComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '1200px',
        nzFooter: null,
        nzComponentParams: {
          pagType: this.pagType,
          type: this.type,
          namKeHoach: this.formData.value.namKeHoach,
          loaiGia: this.formData.value.loaiGia,
        },
      });
      modalQD.afterClose.subscribe((data) => {
        if (data) {
          let thRes = data.listDx;
          let body = {
            listId: thRes && thRes.length > 0 ? thRes.map(item => item.id) : []
          }
          this.formData.patchValue({
            soToTrinh : thRes && thRes.length > 0 ? thRes.map(item=> item.soDeXuat).toString() : []
          })
          this.tongHopData(body);
        }
      });
    }
  }

  async tongHopData(body) {
    try {
      this.spinner.show();
      let res = await this.quyetDinhGiaCuaBtcService.tongHopDataToTrinh(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let dataTongHop = res.data;
        if (dataTongHop && dataTongHop.length > 0) {
          this.arrThongTinGia = dataTongHop
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      this.spinner.hide();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }


}


