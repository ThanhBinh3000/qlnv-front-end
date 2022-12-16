import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import dayjs from 'dayjs';
import { UserLogin } from 'src/app/models/userlogin';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import {
  DialogDanhSachHangHoaComponent
} from "../../../../../../../components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component";
import { NzModalService } from "ng-zorro-antd/modal";
import {
  DialogSoToTrinhPagComponent
} from "../../../../../../../components/dialog/dialog-so-to-trinh-pag/dialog-so-to-trinh-pag.component";
import { MESSAGE } from "../../../../../../../constants/message";
import { ThongTinChungPag, ThongTinGia } from "../../../../../../../models/DeXuatPhuongAnGia";
import { NgxSpinnerService } from "ngx-spinner";
import { HelperService } from "../../../../../../../services/helper.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import {
  QuyetDinhDieuChinhGiaTCDTNNService
} from "../../../../../../../services/ke-hoach/phuong-an-gia/quyetDinhDieuChinhGiaTCDTNN.service";
import { STATUS } from 'src/app/constants/status';
import {
  TongHopPhuongAnGiaService
} from "../../../../../../../services/ke-hoach/phuong-an-gia/tong-hop-phuong-an-gia.service";
import { DanhMucService } from "../../../../../../../services/danhmuc.service";

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
  dsToTrinhDeXuat: any[] = [];
  dsLoaiGia: any = [];
  dsVthh: any[] = [];
  dsClVthh: any[] = [];
  thueVat: any;
  fileDinhKem: any[] = [];

  constructor(
    private readonly fb: FormBuilder,
    public globals: Globals,
    public danhMucService: DanhMucService,
    private modal: NzModalService,
    private spinner: NgxSpinnerService,
    private helperService: HelperService,
    private notification: NzNotificationService,
    private userService: UserService,
    private quyetDinhDieuChinhGiaTCDTNNService: QuyetDinhDieuChinhGiaTCDTNNService,
    private tongHopPhuongAnGiaService: TongHopPhuongAnGiaService
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
  //
  // themDataTable() {
  //   if (this.listThongTinGia) {
  //     this.listThongTinGia.forEach(item => {
  //       this.rowItemL.donGia = item.donGia;
  //       this.rowItemL.id = item.id;
  //       this.rowItemL.donGiaVat = item.donGiaVat;
  //       this.rowItemL.maDvi = item.maDvi;
  //       this.rowItemL.soLuong = item.soLuong;
  //       this.rowItemL.tenDvi = item.tenDvi;
  //       this.rowItemL.giaQd = item.giaQd;
  //       this.rowItemL.giaQdVat = item.giaQdVat;
  //       this.listThongTinGia = [...this.listThongTinGia, this.rowItemL];
  //       this.rowItemL = new ThongTinGia();
  //     })
  //   }
  // }

  async loadDsLoaiGia() {
    this.dsLoaiGia = [];
    let res = await this.danhMucService.danhMucChungGetAll("LOAI_GIA");
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsLoaiGia = res.data;
    }
  }

  async loadDsToTrinh() {
    let body = {
      "type": this.type,
      "pagType": 'VT',
      "dsTrangThai": [STATUS.DA_DUYET_LDV]
    }
    let res = await this.tongHopPhuongAnGiaService.loadToTrinhDeXuat(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsToTrinhDeXuat = res.data;
    }
  }

  async ngOnInit() {
    this.namNay = dayjs().get('year');
    await Promise.all([
      this.userInfo = this.userService.getUserLogin(),
      this.loadDsNam(),
      this.loadTiLeThue(),
      this.loadDsLoaiGia(),
      this.loadDsVthh(),
      this.loadDsToTrinh(),
      this.getDataDetail(this.idInput),
      this.maQd = "/QĐ-TCDTNN"
    ])
  }

  async loadDsVthh() {
    let body = {
      "str": "02"
    };
    let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha(body);
    this.dsVthh = [];
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        this.dsVthh = res.data;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
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

  startEdit(index: number) {
    this.dataEditDcg[index].edit = true;
  }

  luuEdit(idx: number): void {
    Object.assign(this.listThongTinGia[idx], this.dataEditDcg[idx].data);
    this.dataEditDcg[idx].edit = false;
  }

  async chonSoToTrinh(page: string) {
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
        if (data) {
          this.soToTrinh = data.soToTrinh;
          this.listThongTinGia = []
          if (data.loaiVthh.startsWith("02")) {
            this.listThongTinGia = data.pagTtChungs
          } else {
            this.listThongTinGia = data.thongTinGia
          }
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
        if (data) {
          this.soQdGia = data.soQd
          this.soQdDc = data;
          this.formData.patchValue({
            soQdgTcdtnn: data.soQd,
            soToTrinhDx: data.soToTrinh,
          })
          if (!this.soToTrinh) {
            this.listThongTinGia = []
            if (data.loaiVthh.startsWith("02")) {
              this.listThongTinGia = data.thongTinGiaVt
            } else {
              this.listThongTinGia = data.thongTinGiaLt
            }
            let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha({ "str": data.loaiVthh });
            this.dsClVthh = [];
            if (res.msg == MESSAGE.SUCCESS) {
              if (res.data) {
                this.dsClVthh = res.data;
              }
            }
            if (this.dsClVthh) {
              this.listThongTinGia.forEach(item => {
                let resCl = this.dsClVthh.find(cl => cl.ma == item.cloaiVthh)
                if (resCl) {
                  item.tenCloaiVthh = resCl.ten
                }
              })
            }
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
        }
      });
    }
  }

  huyEdit(idx) {
    this.dataEditDcg[idx].edit = false
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
      this.listThongTinGia.forEach((item, index) => {
        this.dataEditDcg[index] = {
          edit: false,
          data: { ...item },
        };
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
            id: this.formData.get('id').value,
            lyDoTuChoi: null,
            trangThai: STATUS.BAN_HANH
          };
          let res = await this.quyetDinhDieuChinhGiaTCDTNNService.approve(body);
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

  async save(isBanHanh: boolean) {
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
    this.listThongTinGia.forEach(item => {
      item.donGia = item.giaDn,
        item.donGiaVat = item.giaDnVat,
        item.donGiaBtc = item.giaQd,
        item.donGiaVatBtc = item.giaQdVat
    })
    body.thongTinGias = this.listThongTinGia;
    body.soQd = body.soQd + this.maQd
    body.fileDinhKemReq = this.fileDinhKem;
    let res
    if (this.idInput > 0) {
      res = await this.quyetDinhDieuChinhGiaTCDTNNService.update(body);
    } else {
      res = await this.quyetDinhDieuChinhGiaTCDTNNService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isBanHanh) {
        this.formData.patchValue({
          id: res.data.id,
          trangThai: res.data.trangThai
        })
        this.banHanh();
      }
      else {
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

  async getDataDetail(id) {
    if (id > 0) {
      let res = await this.quyetDinhDieuChinhGiaTCDTNNService.getDetail(id);
      const data = res.data;
      this.listThongTinGia = data.khPagQdDcTcdtnnCTiets;
      this.listThongTinGia.forEach(item => {
        item.giaDn = item.donGia,
          item.giaDnVat = item.donGiaVat,
          item.giaQd = item.donGiaBtc,
          item.giaQdVat = item.donGiaVatBtc
      })
      this.updateEditCache();
      this.formData.patchValue({
        id: data.id,
        namKeHoach: data.namKeHoach,
        soQd: data.soQd ? data.soQd.split("/")[0] : '',
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
      this.fileDinhKem = data.fileDinhKems;
    }
  }

  onChangeNamQd(evemt) {

  }

  async loadTiLeThue() {
    let res = await this.danhMucService.danhMucChungGetAll("THUE_VAT");
    if (res.msg == MESSAGE.SUCCESS) {
      if (this.loaiVthh == 'LT') {
        this.thueVat = res.data[0].giaTri;
      } else {
        this.thueVat = 10/100;
      }
    }
  }

  async calculateVAT(index: number, type: number) {
    let currentRow = this.formData.value;
    let currentLine = this.listThongTinGia[index];
    //gia mua toi da
    if (currentRow.loaiGia == 'LG01' && (currentLine.giaQd > currentLine.giaDn || currentLine.giaQdVat > currentLine.giaDnVat)) {
      this.listThongTinGia[index].giaQd = 0;
      this.notification.error(MESSAGE.ERROR, 'Giá quyết định lớn hơn giá mua tối đa');
    }
    //gia ban toi thieu
    if (currentRow.loaiGia == 'LG02' && (currentLine.giaQd < currentLine.giaDn || currentLine.giaQdVat < currentLine.giaDnVat)) {
      this.listThongTinGia[index].giaQd = 0;
      this.notification.error(MESSAGE.ERROR, 'Giá quyết định nhỏ hơn giá bán tối thiểu');
    }
    //0:gia>vat 1:vat>gia
    if (type === 0) {
      this.listThongTinGia[index].giaQdVat = this.listThongTinGia[index].giaQd + this.listThongTinGia[index].giaQd * this.thueVat;
    }
  }
}
