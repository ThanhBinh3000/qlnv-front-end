import { ThongTinHopDongService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/hop-dong/thongTinHopDong.service';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { BienBanGuiHangService } from 'src/app/services/bienBanGuiHang.service';
import { DonviService } from 'src/app/services/donvi.service';
import { HoSoKyThuatService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kiemtra-cl/hoSoKyThuat.service';
import { QuanLyBienBanGiaoNhanService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/nhap-kho/quanLyBienBanGiaoNhan.service';
import { QuanLyBienBanKetThucNhapKhoService } from 'src/app/services/quanLyBienBanKetThucNhapKho.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/qd-giaonv-nh/quyetDinhGiaoNhapHang.service';
import { UserService } from 'src/app/services/user.service';
import { convertTienTobangChu, thongTinTrangThaiNhap } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
import { BienBanGiaoNhan, ChiTietBienBanGiaoNhan } from './../../../../../../models/BienBanGiaoNhan';
import { FileDinhKem } from 'src/app/models/FileDinhKem';
import { BaseComponent } from "../../../../../../components/base/base.component";
import {
  DialogTableSelectionComponent
} from "../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import { ChiTiet } from "../../../../../../models/BienBanGuiHang";
import { isEmpty } from "lodash";
import { HelperService } from 'src/app/services/helper.service';
@Component({
  selector: 'app-thong-tin-bien-ban-giao-nhan',
  templateUrl: './thong-tin-bien-ban-giao-nhan.component.html',
  styleUrls: ['./thong-tin-bien-ban-giao-nhan.component.scss']
})
export class ThongTinBienBanGiaoNhanComponent extends BaseComponent implements OnInit {

  @Input() id: number;
  @Input() loaiVthh: string;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();

  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = false;

  userInfo: UserLogin;
  allChecked = false;
  indeterminate = false;
  listThuKho: any[] = [];
  listNganLo: any[] = [];
  listLoaiKho: any[] = [];
  listPTBaoQuan: any[] = [];
  listDonViTinh: any[] = [];
  listSoQuyetDinh: any[] = [];
  listBienBanKetThucNhapKho: any[] = [];
  listBienBanGuiHang: any[] = [];
  listBienBanHoSoKyThuat: any[] = [];
  listFileDinhKem: Array<FileDinhKem> = [];
  fileDinhKem: Array<FileDinhKem> = [];
  listCanCu: Array<FileDinhKem> = [];
  create: any = {};
  editDataCache: { [key: string]: { edit: boolean; data: any } } = {};
  bienBanGiaoNhan: BienBanGiaoNhan = new BienBanGiaoNhan();
  formData: FormGroup;
  detailHopDong: any = {};
  detailGiaoNhap: any = {};
  chiTietDaiDienChiCuc: ChiTietBienBanGiaoNhan = new ChiTietBienBanGiaoNhan();
  chiTietDaiDienCuc: ChiTietBienBanGiaoNhan = new ChiTietBienBanGiaoNhan();
  chiTietDaiDienBenGiao: ChiTietBienBanGiaoNhan = new ChiTietBienBanGiaoNhan();
  listHopDong: any[] = [];
  listDiaDiemNhap: any[] = [];
  dataTable: any[] = [];
  dataTableChiTiet: any[] = [];
  benNhan: ChiTiet = new ChiTiet();
  daiDienCuc: ChiTiet = new ChiTiet();
  daiDienChiCuc: ChiTiet = new ChiTiet();
  benGiao: ChiTiet = new ChiTiet();

  constructor(
    private spinner: NgxSpinnerService,
    private donViService: DonviService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    public userService: UserService,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService,
    public globals: Globals,
    private fb: FormBuilder,
    private quanLyPhieuKetThucNhapKhoService: QuanLyBienBanKetThucNhapKhoService,
    private bienBanGuiHangService: BienBanGuiHangService,
    private quanLyBienBanBanGiaoNhanService: QuanLyBienBanGiaoNhanService,
    private hoSoKyThuatService: HoSoKyThuatService,
    private thongTinHopDongService: ThongTinHopDongService,
    private helperService: HelperService
  ) {
    super();
    super.ngOnInit();
    this.formData = this.fb.group({
      id: [],
      nam: [dayjs().get('year')],
      maDvi: ['', [Validators.required]],
      maQhns: ['',],
      tenDvi: ['', [Validators.required]],

      soBbGiaoNhan: [],
      soBbNhapDayKho: [],
      soHoSoKyThuat: [],
      ngayTao: [dayjs().format('YYYY-MM-DD'), [Validators.required]],
      ngayBatDauNhap: [],
      ngayKetThucNhap: [],

      soQdGiaoNvNh: [],
      idQdGiaoNvNh: [],

      soHd: [''],
      ngayHd: [null,],

      idDdiemGiaoNvNh: [, [Validators.required]],
      maDiemKho: ['', [Validators.required]],
      tenDiemKho: ['', [Validators.required]],
      maNhaKho: ['', [Validators.required]],
      tenNhaKho: ['', [Validators.required]],
      maNganKho: ['', [Validators.required]],
      tenNganKho: ['', [Validators.required]],
      maLoKho: [''],
      tenLoKho: [''],
      soLuongNhapKho: [],
      soLuong: [],

      loaiVthh: ['',],
      tenLoaiVthh: ['',],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      bienBanChuanBiKho: [''],
      bienBanLayMau: [''],
      tenNguoiTao: [''],
      tenNguoiPduyet: [''],
      tenKeToan: [],
      tenKyThuatVien: [],
      ghiChu: [''],
      trangThai: [],
      tenTrangThai: [],
      lyDoTuChoi: [],
      donGiaHd: [],
    })

  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      await Promise.all([

      ]);
      if (this.id) {
        await this.loadChiTiet(this.id);
      } else {
        await this.initForm();
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async initForm() {
    let res = await this.userService.getId("BB_GIAO_NHAN_VT_SEQ");
    this.formData.patchValue({
      soBbGiaoNhan: `${res}/${this.formData.get('nam').value}/BBGN`,
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      trangThai: this.STATUS.DU_THAO,
      tenTrangThai: 'Dự thảo',
      tenNguoiTao: this.userInfo.TEN_DAY_DU
    });
  }

  async loadChiTiet(id) {
    if (id > 0) {
      let res = await this.quanLyBienBanBanGiaoNhanService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, data);
          this.dataTableChiTiet = data.chiTiets;
          await this.bindingDataQd(data.idQdGiaoNvNh);
          let dd = this.listDiaDiemNhap.filter(item => item.bienBanNhapDayKho.soBienBanNhapDayKho == data.soBbNhapDayKho)[0];
          await this.bindingDataDdNhap(dd);
        }
      }
    }
  }

  pheDuyet() {
    let trangThai = ''
    switch (this.formData.get('trangThai').value) {
      case this.STATUS.TU_CHOI_LDC:
      case this.STATUS.DU_THAO: {
        trangThai = this.STATUS.CHO_DUYET_LDC;
        break;
      }
      case this.STATUS.CHO_DUYET_LDC: {
        trangThai = this.STATUS.DA_DUYET_LDC;
        break;
      }
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn phê duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.id,
            lyDoTuChoi: null,
            trangThai: trangThai,
          };
          let res =
            await this.quanLyBienBanBanGiaoNhanService.approve(
              body
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
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

  tuChoi() {
    const modalTuChoi = this.modal.create({
      nzTitle: 'Từ chối',
      nzContent: DialogTuChoiComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalTuChoi.afterClose.subscribe(async (text) => {
      if (text) {
        this.spinner.show();
        try {
          let body = {
            id: this.id,
            lyDoTuChoi: text,
            trangThai: this.STATUS.TU_CHOI_LDC,
          };
          let res =
            await this.quanLyBienBanBanGiaoNhanService.approve(
              body
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
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
      }
    });
  }

  back() {
    this.showListEvent.emit();
  }

  async save(isGuiDuyet: boolean) {
    this.spinner.show();
    try {
      this.helperService.markFormGroupTouched(this.formData);
      if (this.formData.invalid) {
        await this.spinner.hide();
        return;
      }
      let body = this.formData.value;
      body.chiTiets = this.dataTableChiTiet;
      let res;
      if (this.formData.get('id').value > 0) {
        res = await this.quanLyBienBanBanGiaoNhanService.update(body);
      } else {
        res = await this.quanLyBienBanBanGiaoNhanService.create(body);
      }
      if (res.msg == MESSAGE.SUCCESS) {
        if (isGuiDuyet) {
          await this.spinner.hide();
          this.id = res.data.id;
          this.pheDuyet();
        } else {
          if (this.formData.get('id').value) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.back();
          } else {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
            this.back();
          }
          await this.spinner.hide();
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
        await this.spinner.hide();
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    };
  }

  async loadSoQuyetDinh() {
    this.spinner.show();
    let body = {
      "maDvi": this.userInfo.MA_DVI,
      "loaiVthh": this.loaiVthh,
      "paggingReq": {
        "limit": this.globals.prop.MAX_INTERGER,
        "page": 0
      },
      "trangThai": this.STATUS.BAN_HANH,
      "namNhap": this.formData.get('nam').value
    }
    let res = await this.quyetDinhGiaoNhapHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoQuyetDinh = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }

  async openDialogSoQd() {
    await this.loadSoQuyetDinh();
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách số quyết định kế hoạch giao nhiệm vụ nhập hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listSoQuyetDinh,
        dataHeader: ['Số quyết định', 'Ngày quyết định', 'Loại hàng hóa'],
        dataColumn: ['soQd', 'ngayQdinh', 'tenLoaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (dataChose) => {
      if (dataChose) {
        await this.bindingDataQd(dataChose.id);
      }
    });
  };

  async bindingDataQd(id) {
    await this.spinner.show();
    let dataRes = await this.quyetDinhGiaoNhapHangService.getDetail(id)
    const data = dataRes.data;
    this.formData.patchValue({
      soQdGiaoNvNh: data.soQd,
      idQdGiaoNvNh: data.id,
      ngayQdGiaoNvNh: data.ngayQdinh,
      loaiVthh: data.loaiVthh,
      cloaiVthh: data.cloaiVthh,
      tenLoaiVthh: data.tenLoaiVthh,
      tenCloaiVthh: data.tenCloaiVthh,
      moTaHangHoa: data.moTaHangHoa,
      soHd: data.soHd,
      ngayHd: data.hopDong.ngayKy,
      donGiaHd: data.hopDong.donGia
    });
    this.listDiaDiemNhap = []
    data.dtlList.forEach(item => {
      let ddKho = item.children.filter(x => !isEmpty(x.bienBanNhapDayKho));
      console.log(ddKho);
      this.listDiaDiemNhap = [...this.listDiaDiemNhap, ...ddKho];
    })
    await this.spinner.hide();
  }

  openDialogDdiemNhapHang() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách địa điểm nhập hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDiaDiemNhap,
        dataHeader: ['Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho', 'SL theo QĐ giao NV NH'],
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho', 'soLuong']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      this.bindingDataDdNhap(data);
    });
  }

  async bindingDataDdNhap(data) {
    if (data) {
      this.dataTable = data.listBangKeVt;
      this.dataTable.forEach(item => {
        let itemPnk = data.listPhieuNhapKho.filter(x => x.soPhieuNhapKho == item.soPhieuNhapKho)[0];
        item.soPhieuNhapKho = item.soPhieuNhapKho;
        item.soBangKe = item.soBangKe;
        item.ngayNhap = itemPnk.ngayTao;
        item.soLuong = itemPnk.soLuongNhapKho;
      })
      this.formData.patchValue({
        idDdiemGiaoNvNh: data.id,
        maDiemKho: data.maDiemKho,
        tenDiemKho: data.tenDiemKho,
        maNhaKho: data.maNhaKho,
        tenNhaKho: data.tenNhaKho,
        maNganKho: data.maNganKho,
        tenNganKho: data.tenNganKho,
        maLoKho: data.maLoKho,
        tenLoKho: data.tenLoKho,
        soLuongNhapKho: this.loaiVthh == '02' ? data.soLuong : data.soLuong * 1000,
        soLuong: data.soLuong,
        ngayBatDauNhap: data.bienBanNhapDayKho.ngayBatDauNhap,
        ngayKetThucNhap: data.bienBanNhapDayKho.ngayKetThucNhap,
        soBbNhapDayKho: data.bienBanNhapDayKho.soBienBanNhapDayKho
      });
    }
  }

  addDaiDien(bienBan: ChiTiet, type: string) {
    const chiTiet = new ChiTiet();
    chiTiet.loaiDaiDien = type;
    if (type == "00") {
      chiTiet.chucVu = this.daiDienCuc.chucVu;
      chiTiet.daiDien = this.daiDienCuc.daiDien;
      this.dataTableChiTiet.push(chiTiet);
    }
    if (type == "01") {
      chiTiet.chucVu = this.daiDienChiCuc.chucVu;
      chiTiet.daiDien = this.daiDienChiCuc.daiDien;
      this.dataTableChiTiet.push(chiTiet);
    }
    if (type == "02") {
      chiTiet.chucVu = this.benNhan.chucVu;
      chiTiet.daiDien = this.benNhan.daiDien;
      this.dataTableChiTiet.push(chiTiet);
    }
    this.clearDaiDien(type);
  }


  clearDaiDien(type: string) {
    if (type === '02') {
      this.benNhan = new ChiTiet();
    }
    if (type === '00') {
      this.daiDienCuc = new ChiTiet();
    }
    if (type === '01') {
      this.daiDienChiCuc = new ChiTiet();
    }
  }

  deleteBienBan(idx: number, type) {
    // if (type == '00') {
    //   this.dataTableCuc.splice(idx, 1);
    // }
    // if (type == '01') {
    //   this.dataTableChiCuc.splice(idx, 1);
    // }
    // if (type == '02') {
    //   this.dataTableGiaoHang.splice(idx, 1);
    // }
  }

  calcTong() {
    if (this.dataTable) {
      const sum = this.dataTable.reduce((prev, cur) => {
        prev += cur.soLuong;
        return prev;
      }, 0);
      return sum;
    }
  }
}
