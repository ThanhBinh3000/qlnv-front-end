import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import dayjs from 'dayjs';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { BienBanGuiHang, ChiTiet } from 'src/app/models/BienBanGuiHang';
import { QuyetDinhNhapXuat } from 'src/app/models/QuyetDinhNhapXuat';
import { UserLogin } from 'src/app/models/userlogin';
import { BienBanGuiHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/nhap-kho/bienBanGuiHang.service';
import { PhieuNhapKhoTamGuiService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/nhap-kho/phieuNhapKhoTamGui.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/qd-giaonv-nh/quyetDinhGiaoNhapHang.service';
import { ThongTinHopDongService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/hop-dong/thongTinHopDong.service';
import { UserService } from 'src/app/services/user.service';
import { thongTinTrangThaiNhap } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
import { PhieuNhapKhoTamGui } from './../../../../../../models/PhieuNhapKhoTamGui';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  DialogQuyetDinhGiaoChiTieuComponent
} from "../../../../../../components/dialog/dialog-quyet-dinh-giao-chi-tieu/dialog-quyet-dinh-giao-chi-tieu.component";
import { BaseComponent } from 'src/app/components/base/base.component';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { isEmpty } from 'lodash';
import { HelperService } from 'src/app/services/helper.service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-thong-tin-bien-ban-gui-hang',
  templateUrl: './thong-tin-bien-ban-gui-hang.component.html',
  styleUrls: ['./thong-tin-bien-ban-gui-hang.component.scss']
})
export class ThongTinBienBanGuiHangComponent extends BaseComponent implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  @Input() loaiVthh: string;
  @Input() idQdGiaoNvNh: number;
  @Output()
  showListEvent = new EventEmitter<any>();

  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
  userInfo: UserLogin;
  listSoQuyetDinh: any[] = [];


  phieuNhapKhoTamGuis: Array<PhieuNhapKhoTamGui> = [];
  benGiao: ChiTiet = new ChiTiet();
  benNhan: ChiTiet = new ChiTiet();
  quyetDinhNhapHang: QuyetDinhNhapXuat = new QuyetDinhNhapXuat();
  hopDong: any = {};
  listHopDong: any[] = [];
  detailHopDong: any = {};
  detailGiaoNhap: any = {};
  formData: FormGroup;
  listFileDinhKem: any[] = [];
  listDiaDiemNhap: any[] = [];
  dataTable: any[] = [];
  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    private bienBanGuiHangService: BienBanGuiHangService,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService,
  ) {
    super(httpClient, storageService, bienBanGuiHangService);
    super.ngOnInit();
    this.formData = this.fb.group({
      id: [],
      nam: [dayjs().get('year')],
      maDvi: ['', [Validators.required]],
      maQhns: ['',],
      tenDvi: ['', [Validators.required]],

      soBienBanGuiHang: [],
      ngayTao: [dayjs().format('YYYY-MM-DD'), [Validators.required]],


      soQdGiaoNvNh: [, [Validators.required]],
      idQdGiaoNvNh: [, [Validators.required]],

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
      soLuongDdiemGiaoNvNh: [''],

      soPhieuNhapKhoTamGui: [],
      ngayNhapKhoTamGui: [],

      loaiVthh: ['',],
      tenLoaiVthh: ['',],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      tenNguoiTao: [''],
      tenNguoiPduyet: [''],
      keToanTruong: [''],
      nguoiGiaoHang: [''],
      cmtNguoiGiaoHang: [''],
      donViGiaoHang: [''],
      diaChiNguoiGiao: [''],
      thoiGianGiaoNhan: [''],
      ghiChu: [''],
      soBangKeCanHang: [''],
      trangThai: [],
      tenTrangThai: [],
      lyDoTuChoi: [],
      donGiaHd: [],

      benNhan: [''],
      benGiao: [''],
      trachNhiemBenNhan: [],
      trachNhiemBenGiao: [],

      tinhTrang: [],
      chatLuong: [],
      phuongPhap: [],

      dvt: []
    })
  }

  async ngOnInit() {
    this.spinner.show();
    try {

      this.userInfo = this.userService.getUserLogin();
      await Promise.all([
        // this.loadPhieuNhapKhoTamGui(),
        // this.loadSoQuyetDinh(),
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
    let res = await this.userService.getId("BIEN_BAN_GUI_HANG_SEQ");
    this.formData.patchValue({
      soBienBanGuiHang: `${res}/${this.formData.get('nam').value}/BBGH-CCDTVT`,
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      trangThai: this.STATUS.DU_THAO,
      tenTrangThai: 'Dự thảo',
      tenNguoiTao: this.userInfo.TEN_DAY_DU,
      benNhan: this.userInfo.TEN_DVI,
    });
    if (this.idQdGiaoNvNh) {
      await this.bindingDataQd(this.idQdGiaoNvNh);
    }
  }

  isDisableField() {
    // if (this.bienBanGuiHang && (this.bienBanGuiHang.trangThai == this.globals.prop.NHAP_CHO_DUYET_TP || this.bienBanGuiHang.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC || this.bienBanGuiHang.trangThai == this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC)) {
    //   return true;
    // }
    return false;
  }

  async loadChiTiet(id) {
    if (id > 0) {
      let res = await this.bienBanGuiHangService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, data);
          this.dataTable = data.children;
          await this.bindingDataQd(data.idQdGiaoNvNh);
          let ddNhap = this.listDiaDiemNhap.filter(item => item.id == data.idDdiemGiaoNvNh)[0];
          this.bindingDataDdNhap(ddNhap);
        }
      }
    }
  }


  guiDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn gửi duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          await this.save(true);
          let body = {
            id: this.id,
            lyDoTuChoi: null,
            trangThai: this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC,
          };
          let res =
            await this.bienBanGuiHangService.approve(
              body,
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

  pheDuyet() {
    let trangThai = this.STATUS.DA_HOAN_THANH;
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn cập nhật hoàn thành?',
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
            await this.bienBanGuiHangService.approve(
              body,
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
    // const modalTuChoi = this.modal.create({
    //   nzTitle: 'Từ chối',
    //   nzContent: DialogTuChoiComponent,
    //   nzMaskClosable: false,
    //   nzClosable: false,
    //   nzWidth: '900px',
    //   nzFooter: null,
    //   nzComponentParams: {},
    // });
    // modalTuChoi.afterClose.subscribe(async (text) => {
    //   if (text) {
    //     this.spinner.show();
    //     try {
    //       let body = {
    //         id: this.id,
    //         lyDoTuChoi: text,
    //         trangThai: this.bienBanGuiHang.trangThai == this.globals.prop.NHAP_CHO_DUYET_TP ? this.globals.prop.NHAP_TU_CHOI_TP : this.globals.prop.NHAP_TU_CHOI_LD_CHI_CUC,
    //       };
    //       let res =
    //         await this.bienBanGuiHangService.updateStatus(
    //           body,
    //         );
    //       if (res.msg == MESSAGE.SUCCESS) {
    //         this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
    //         this.back();
    //       } else {
    //         this.notification.error(MESSAGE.ERROR, res.msg);
    //       }
    //       this.spinner.hide();
    //     } catch (e) {
    //       console.log('error: ', e);
    //       this.spinner.hide();
    //       this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    //     }
    //   }
    // });
  }

  huyBo() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn hủy bỏ các thao tác đang làm?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.back();
      },
    });
  }

  back() {
    this.showListEvent.emit();
  }

  async save(isGuiDuyet?: boolean) {
    this.setValidator(isGuiDuyet);
    this.spinner.show();
    this.helperService.markFormGroupTouched(this.formData);
    if (!this.formData.valid) {
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    body.fileDinhKems = this.listFileDinhKem;
    body.children = this.dataTable;
    let res;
    if (this.formData.get('id').value > 0) {
      res = await this.bienBanGuiHangService.update(body);
    } else {
      res = await this.bienBanGuiHangService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isGuiDuyet) {
        this.spinner.hide();
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
        this.spinner.hide();
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
      this.spinner.hide();
    }
  }

  setValidator(isGuiDuyet) {
    if (isGuiDuyet) {

    } else {

    }
  }

  thongTinTrangThai(trangThai: string): string {
    return thongTinTrangThaiNhap(trangThai);
  }

  addDaiDien(bienBan: ChiTiet, type: string) {
    // if ((type == '00' && (!this.chiTietBienBanGuiHangBenNhan.daiDien || !this.chiTietBienBanGuiHangBenNhan.chucVu))
    //   || (type == '01' && (!this.chiTietBienBanGuiHangBenGiao.daiDien || !this.chiTietBienBanGuiHangBenGiao.chucVu))) {
    //   return;
    // }

    const chiTiet = new ChiTiet();
    chiTiet.loaiBen = type;
    chiTiet.chucVu = bienBan.chucVu;
    chiTiet.daiDien = bienBan.daiDien;
    this.dataTable.push(chiTiet);
    this.clearDaiDien(type);
    console.log(this.dataTable);
  }

  clearDaiDien(type: string) {
    if (type === '00') {
      this.benGiao = new ChiTiet();
    } else {
      this.benNhan = new ChiTiet();
    }
  }
  deleteBienBan(id: number) {
    // this.bienBanGuiHang.chiTiets = this.bienBanGuiHang.chiTiets.filter(bienBan => bienBan.id !== id);
  }

  async openDialogSoQd() {
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
    let dataChiCuc = data.dtlList.filter(item => item.maDvi == this.userInfo.MA_DVI);
    if (dataChiCuc.length > 0) {
      this.listDiaDiemNhap = dataChiCuc[0].children.filter(item => !isEmpty(item.phieuNhapKhoTamGui));
    }

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
        soLuongDdiemGiaoNvNh: data.soLuong,
        soPhieuNhapKhoTamGui: data.phieuNhapKhoTamGui.soPhieuNhapKhoTamGui,
        ngayNhapKhoTamGui: data.phieuNhapKhoTamGui.ngayNhapKho
      });
    }
  }

}
