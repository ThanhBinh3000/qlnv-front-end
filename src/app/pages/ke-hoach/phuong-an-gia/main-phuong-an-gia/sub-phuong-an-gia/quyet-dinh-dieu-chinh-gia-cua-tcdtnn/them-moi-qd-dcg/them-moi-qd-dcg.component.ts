import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import dayjs from 'dayjs';
import {UserLogin} from 'src/app/models/userlogin';
import {UserService} from 'src/app/services/user.service';
import {Globals} from 'src/app/shared/globals';
import {
  DialogDanhSachHangHoaComponent
} from "../../../../../../../components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component";
import {NzModalService} from "ng-zorro-antd/modal";
import {
  DialogSoToTrinhPagComponent
} from "../../../../../../../components/dialog/dialog-so-to-trinh-pag/dialog-so-to-trinh-pag.component";
import {MESSAGE} from "../../../../../../../constants/message";
import {ThongTinChungPag, ThongTinGia} from "../../../../../../../models/DeXuatPhuongAnGia";
import {NgxSpinnerService} from "ngx-spinner";
import {HelperService} from "../../../../../../../services/helper.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {
  QuyetDinhDieuChinhGiaTCDTNNService
} from "../../../../../../../services/ke-hoach/phuong-an-gia/quyetDinhDieuChinhGiaTCDTNN.service";

@Component({
  selector: 'app-them-moi-qd-dcg',
  templateUrl: './them-moi-qd-dcg.component.html',
  styleUrls: ['./them-moi-qd-dcg.component.scss']
})
export class ThemMoiQdDcgComponent implements OnInit {
  dataEditDcg: { [key: string]: { edit: boolean; data: ThongTinGia } } = {};
  rowItemL: ThongTinGia = new ThongTinGia();
  @Input('isView') isView: boolean;
  @Input() idInput: number;
  @Input() loaiVthh: string;
  @Input() type: string;
  @Output('onClose') onClose = new EventEmitter<any>();
  formData: FormGroup;
  userInfo: UserLogin;
  maQd: String;
  dsNam: any[] = [];
  dataTable: any[] = [];
  namNay: number;
  soToTrinh: any
  soQdGia: any
  soQdDc: any;
  listThongTinGia: any[] = [];
  detail: any;
  radioValue: string;

  constructor(
    private readonly fb: FormBuilder,
    public globals: Globals,
    private modal: NzModalService,
    private spinner: NgxSpinnerService,
    private helperService: HelperService,
    private notification: NzNotificationService,
    private userService: UserService,
    private quyetDinhDieuChinhGiaTCDTNNService: QuyetDinhDieuChinhGiaTCDTNNService
  ) {
    this.formData = this.fb.group(
      {
        id: [],
        namKeHoach: [dayjs().get('year'), [Validators.required]],
        soQd: [, [Validators.required]],
        soToTrinhDx: [],
        soQdgTcdtnn: [null, [Validators.required]],
        ngayKy: [null, [Validators.required]],
        ngayHieuLuc: [null, [Validators.required]],
        loaiGia: [null],
        trichYeu: [null, [Validators.required]],
        trangThai: ['00'],
        ghiChu: [null],
        loaiVthh: [],
        cloaiVthh: [],
        tchuanCluong: [null],
        maDvi: [null],
        capDvi: [null],
        tenLoaiGia: [null],
        tenLoaiVthh: [null],
        tenCloaiVthh: [null]
      }
    );
  }

  themDataTable() {
    if (this.dataTable) {
      this.dataTable.forEach(item => {
        this.rowItemL.donGia = item.donGia;
        this.rowItemL.id = item.id;
        this.rowItemL.donGiaVat = item.donGiaVat;
        this.rowItemL.maDvi = item.maDvi;
        this.rowItemL.soLuong = item.soLuong;
        this.rowItemL.tenDvi = item.tenDvi;
        this.rowItemL.giaQd = item.giaQd;
        this.rowItemL.giaQdVat = item.giaQdVat;
        this.listThongTinGia = [...this.listThongTinGia, this.rowItemL];
        this.rowItemL = new ThongTinGia();
      })
    }
  }

  async ngOnInit() {
    this.namNay = dayjs().get('year');
    await Promise.all([
      this.userInfo = this.userService.getUserLogin(),
      this.loadDsNam(),
      this.getDataDetail(this.idInput),
      this.maQd = "/QĐ-TCDTNN"
    ])
    console.log(this.isView)
  }


  loadDsNam() {
    for (let i = -3; i < 23; i++) {
      this.dsNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
  }

  startEdit(index: number) {
    this.dataEditDcg[index].edit = true;
  }

  luuEdit(id: number): void {
    const index = this.listThongTinGia.findIndex((item) => item.id === id);
    Object.assign(this.listThongTinGia[index], this.dataEditDcg[id].data);
    this.dataEditDcg[id].edit = false;
  }

  chonSoToTrinh(page: string) {
    if (page == 'STT') {
      let radioValue = this.soToTrinh;
      let modalDanhSachTT = this.modal.create({
        nzTitle: this.loaiVthh == 'LT' ? 'Số tờ trình đề xuất của Vụ kế hoạch' : 'Danh sách số đề xuất phương án giá',
        nzContent: DialogSoToTrinhPagComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '700px',
        nzFooter: null,
        nzComponentParams: {
          pagtype: this.loaiVthh,
          type: this.type,
          loai: page,
          radioValue
        },
      });
      modalDanhSachTT.afterClose.subscribe(async (data) => {
        console.log(JSON.stringify(data) + "1111111");
        if (data != null) {
          this.soToTrinh = data.soToTrinh;
          this.dataTable = data.thongTinGia;
          this.listThongTinGia = []
          this.themDataTable();
          this.updateEditCache();
          this.formData.patchValue({
            soToTrinhDx: data.soToTrinh,
            loaiVthh: data.loaiVthh,
            cloaiVthh: data.cloaiVthh,
            loaiGia: data.loaiGia,
            tenLoaiVthh: data.tenLoaiVthh,
            tenCloaiVthh: data.tenCloaiVthh,
            tenLoaiGia: data.tenLoaiGia,
            tchuanCluong: data.tchuanCluong
          })
        }
        console.log(this.listThongTinGia)
      });
    } else if (page == 'SQD') {
      let radioValue = this.soQdGia;
      let modalQD = this.modal.create({
        nzTitle: 'Số quyết định giá của TCDTNN',
        nzContent: DialogSoToTrinhPagComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '700px',
        nzFooter: null,
        nzComponentParams: {
          pagtype: this.loaiVthh,
          type: this.type,
          loai: page,
          radioValue
        },
      });
      modalQD.afterClose.subscribe(async (data) => {
        console.log(JSON.stringify(data) + "2222222222");
        if (data != null) {
          this.soQdGia = data.soQd
          this.soQdDc = data;
          this.formData.patchValue({
            soQdgTcdtnn: data.soQd,
          })
          if (!this.soToTrinh) {
            this.dataTable = data.thongTinGia;
            this.listThongTinGia = []
            this.themDataTable();
            this.updateEditCache();
            this.formData.patchValue({
              loaiVthh: data.loaiVthh,
              cloaiVthh: data.cloaiVthh,
              loaiGia: data.loaiGia,
              tenLoaiVthh: data.tenLoaiVthh,
              tenCloaiVthh: data.tenCloaiVthh,
              tenLoaiGia: data.tenLoaiGia,
              tchuanCluong: data.tchuanCluong
            })
          }
          console.log(this.listThongTinGia)
        }
      });
    }
  }

  huyEdit(id) {
    this.dataEditDcg[id].edit = false
  }

  deleteItem(index: number) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        try {
          this.listThongTinGia.splice(index, 1);
          this.updateEditCache();
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  updateEditCache(): void {
    if (this.listThongTinGia) {
      this.listThongTinGia.forEach((item) => {
        this.dataEditDcg[item.id] = {
          edit: false,
          data: {...item},
        };
      });
    }
  }


  quayLai() {
    this.onClose.emit();
  }

  banHanh() {

  }

  async save() {
    this.spinner.show();
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR)
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    if (this.idInput === undefined) {
      if (this.soToTrinh == null) {
        this.formData.patchValue({
          capDvi: this.soToTrinh.capDvi,
          maDvi: this.soToTrinh.maDvi
        })
      } else {
        this.formData.patchValue({
          capDvi: this.soQdDc.capDvi,
          maDvi: this.soQdDc.maDvi
        })
      }
    }
    body.thongTinGias = this.listThongTinGia;
    body.soQd = body.soQd + this.maQd
    let res
    console.log("---------" +JSON.stringify( body));
    if (this.idInput > 0) {
      /* body.loaiVthh = this.detail.loaiVthh
       body.cloaiVthh = this.detail.cloaiVthh
       body.loaiGia = this.detail.loaiGia*/
      res = await this.quyetDinhDieuChinhGiaTCDTNNService.update(body);
    } else {
      res = await this.quyetDinhDieuChinhGiaTCDTNNService.create(body);
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
    this.spinner.hide();
  }

  async getDataDetail(id) {
    if (id > 0) {
      let res = await this.quyetDinhDieuChinhGiaTCDTNNService.getDetail(id);
      const data = res.data;
      this.dataTable = data.khPagQdDcTcdtnnCTiets;
      this.themDataTable();
      this.updateEditCache();
      this.formData.patchValue({
        id: data.id,
        namKeHoach: data.namKeHoach,
        soQd: data.soQd.split("/")[0],
        soToTrinhDx: data.soToTrinhDx,
        soQdgTcdtnn: data.soQdgTcdtnn,
        ngayKy: data.ngayKy,
        ngayHieuLuc: data.ngayHieuLuc,
        loaiGia: data.loaiGia,
        trichYeu: data.trichYeu,
        trangThai: data.trangThai,
        ghiChu: data.ghiChu,
        loaiVthh: data.loaiVthh,
        cloaiVthh: data.cloaiVthh,
        tchuanCluong: data.tchuanCluong,
        maDvi: data.maDvi,
        capDvi: data.capDvi,
        tenLoaiVthh: data.tenLoaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        tenLoaiGia: data.tenLoaiGia
      })
      this.detail = data;
    }
  }

  onChangeNamQd(evemt) {

  }

  async calculateVAT(index: number, type: number) {
  }
}
