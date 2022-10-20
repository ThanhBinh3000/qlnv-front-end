import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { DialogDanhSachHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DonviService } from 'src/app/services/donvi.service';
import { QuanLyBangKeCanHangService } from 'src/app/services/quanLyBangKeCanHang.service';
import { QuanLyPhieuKiemTraChatLuongHangService } from 'src/app/services/quantri-danhmuc/quanLyPhieuKiemTraChatLuongHang.service';
import { QuanLyPhieuNhapKhoService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/nhap-kho/quanLyPhieuNhapKho.service';
import { QuanLyPhieuSoKhoService } from 'src/app/services/quanLySoKho.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/qd-giaonv-nh/quyetDinhGiaoNhapHang.service';
import { ThongTinHopDongService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/hop-dong/thongTinHopDong.service';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { UserService } from 'src/app/services/user.service';
import { convertTienTobangChu, thongTinTrangThaiNhap } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
import {BaseComponent} from "../../../../../../components/base/base.component";
import {FormBuilder, Validators} from "@angular/forms";
import {STATUS} from "../../../../../../constants/status";
import {
  DialogTableSelectionComponent
} from "../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import { isEmpty } from 'lodash';
@Component({
  selector: 'thong-tin-quan-ly-bang-ke-can-hang',
  templateUrl: './thong-tin-quan-ly-bang-ke-can-hang.component.html',
  styleUrls: ['./thong-tin-quan-ly-bang-ke-can-hang.component.scss'],
})
export class ThongTinQuanLyBangKeCanHangComponent extends BaseComponent implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  @Input() typeVthh: string;
  @Input() idQdGiaoNvNh : number;
  @Output()
  showListEvent = new EventEmitter<any>();

  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = false;

  userInfo: UserLogin;
  detail: any = {};
  idNhapHang: number = 0;
  detailGiaoNhap: any = {};
  detailHopDong: any = {};

  listDonViTinh: any[] = [];
  listLoaiKho: any[] = [];
  listThuKho: any[] = [];
  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganKho: any[] = [];
  listNganLo: any[] = [];
  listPhieuKiemTraChatLuong: any[] = [];
  listSoKho: any[] = [];
  listSoQuyetDinh: any[] = [];
  listSoPhieuNhapKho: any[] = [];
  listHopDong: any[] = [];


  listDiaDiemNhap : any[] = [];
  dataTable : any[] = []
  rowItem : any = {};

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private donViService: DonviService,
    private danhMucService: DanhMucService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    private userService: UserService,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    private quanLyBangKeCanHangService: QuanLyBangKeCanHangService,
    private quanLyPhieuKiemTraChatLuongHangService: QuanLyPhieuKiemTraChatLuongHangService,
    private quanLyPhieuSoKhoService: QuanLyPhieuSoKhoService,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService,
    private quanLyPhieuNhapKhoService: QuanLyPhieuNhapKhoService,
    private thongTinHopDongService: ThongTinHopDongService,
    public globals: Globals,
    private quyetDinhNhapXuatService : QuyetDinhGiaoNhapHangService,
  ) {
    super();
    this.formData = this.fb.group({
      id: [],
      nam: [dayjs().get('year')],
      maDvi: ['', [Validators.required]],
      maQhns: ['',],
      tenDvi: ['', [Validators.required]],
      soBangKe : [''],
      soPhieuNhapKho : [],
      ngayTao: [dayjs().format('YYYY-MM-DD'), [Validators.required]],
      soNo : [],
      soCo : [],

      soQdGiaoNvNh : [],
      idQdGiaoNvNh : [],

      soHd: [''],
      ngayHd: [null,],

      idDdiemGiaoNvNh : [,[Validators.required]],
      maDiemKho: ['', [Validators.required]],
      tenDiemKho: ['', [Validators.required]],
      maNhaKho: ['', [Validators.required]],
      tenNhaKho: ['', [Validators.required]],
      maNganKho: ['', [Validators.required]],
      tenNganKho: ['', [Validators.required]],
      maLoKho: [''],
      tenLoKho: [''],
      soPhieuKtraCl : [''],
      nguoiTaoPhieuKtraCl : [''],

      loaiVthh: ['',],
      tenLoaiVthh: ['',],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      tenNguoiTao : [''],
      tenNguoiPduyet : [''],
      keToanTruong : [''],
      nguoiGiaoHang : [''],
      cmtNguoiGiaoHang : [''],
      donViGiaoHang : [''],
      diaChi : [''],
      thoiGianGiaoNhan : [''],
      ghiChu : [''],

      trangThai : [],
      tenTrangThai : [],
      lyDoTuChoi : [],
      donGiaHd : []
    })
  }


  async ngOnInit() {
    await this.spinner.show();
    try {
      super.ngOnInit();
      this.userInfo = this.userService.getUserLogin();
      await Promise.all([
        this.loadSoQuyetDinh(),
      ]);
      if (this.id) {
        await this.loadChiTiet(this.id);
      } else {
        await this.initForm();
      }
      await this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loadChiTiet(id) {
    if (id > 0) {
      // let res = await this.quanLyBangKeCanHangService.loadChiTiet(id);
      // if (res.msg == MESSAGE.SUCCESS) {
      //   if (res.data) {
      //     this.detail = res.data;
      //     if (this.detail.children) {
      //       this.detail.detail = this.detail.children;
      //     }
      //     if (this.detail.soKho) {
      //       this.detail.soKho = +this.detail.soKho;
      //     }
      //     await this.loadDiemKho();
      //     await this.changeSoQuyetDinh(true);
      //     await this.changeDiemKho(true);
      //   }
      // }
    }
  }

  async initForm() {
    // let res = await this.userService.getId("PHIEU_NHAP_KHO_SEQ");
    this.formData.patchValue({
      // soPhieuNhapKho: `${res}/${this.formData.get('nam').value}/PNK-CCDTVP`,
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhmaQhnsns : this.userInfo.DON_VI.maQhns,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự thảo',
      tenNguoiTao : this.userInfo.sub
    });
    if(this.idQdGiaoNvNh){
      await this.bindingDataQd(this.idQdGiaoNvNh);
    }
  }

  async loadSoQuyetDinh() {
    let body = {
      "maDvi": this.userInfo.MA_DVI,
      "maVthh": this.typeVthh,
      "paggingReq": {
        "limit": this.globals.prop.MAX_INTERGER,
        "page": 0
      },
      "trangThai": STATUS.BAN_HANH,
      "namNhap": this.formData.get('nam').value
    }
    let res = await this.quyetDinhGiaoNhapHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoQuyetDinh = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async openDialogSoQd() {
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

  async bindingDataQd(id){
    await this.spinner.show();
    let dataRes = await this.quyetDinhNhapXuatService.getDetail(id)
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
      ngayHd : data.hopDong.ngayKy,
      donGiaHd : data.hopDong.donGia
    });
    let dataChiCuc = data.dtlList.filter(item => item.maDvi == this.userInfo.MA_DVI);
    if (dataChiCuc.length > 0) {
      this.listDiaDiemNhap = dataChiCuc[0].children;
      this.listDiaDiemNhap = this.listDiaDiemNhap.filter(item => item.phieuNhapKho);
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
        dataHeader: ['Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho', 'Số lượng'],
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho', 'soLuong']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.dataTable = []
        this.formData.patchValue({
          idDdiemGiaoNvNh : data.id,
          maDiemKho: data.maDiemKho,
          tenDiemKho: data.tenDiemKho,
          maNhaKho: data.maNhaKho,
          tenNhaKho: data.tenNhaKho,
          maNganKho: data.maNganKho,
          tenNganKho: data.tenNganKho,
          maLoKho: data.maLoKho,
          tenLoKho: data.tenLoKho,
          soPhieuNhapKho : data.phieuNhapKho?.soPhieuNhapKho,
          nguoiGiaoHang : data.phieuNhapKho?.nguoiGiaoHang,
          cmtNguoiGiaoHang : data.phieuNhapKho?.cmtNguoiGiaoHang,
          donViGiaoHang : data.phieuNhapKho?.donViGiaoHang,
          diaChi : data.phieuNhapKho?.diaChi,
          thoiGianGiaoNhan : data.phieuNhapKho?.thoiGianGiaoNhan,
        });
      }
    });
  }

  isDisableField() {
    if (this.detail && (this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_TP || this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC || this.detail.trangThai == this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC)) {
      return true;
    }
  }

  convertTien(tien: number): string {
    return convertTienTobangChu(tien);
  }

  deleteRow(data: any) {

  }

  editRow(stt: number) {
  }

  addRow() {

  }

  cancelEdit(stt: number): void {

  }

  saveEdit(stt: number): void {

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
            await this.quanLyBangKeCanHangService.updateStatus(
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
    let trangThai = this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC;
    if (this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC) {
      trangThai = this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC;
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
            await this.quanLyBangKeCanHangService.updateStatus(
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
            trangThai: this.globals.prop.NHAP_TU_CHOI_LD_CHI_CUC,
          };
          let res =
            await this.quanLyBangKeCanHangService.updateStatus(
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
      }
    });
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

  async save(isOther: boolean) {
    this.spinner.show();
    try {
      let body = {
        "chiTiets": this.detail.chiTiets,
        "diaDiem": this.detail.diaDiem,
        "diaChiNguoiGiao": this.detail.diaChiNguoiGiao,
        "donViTinh": this.detail.donViTinh,
        "id": this.id,
        "maDiemKho": this.detail.maDiemKho,
        "maNganKho": this.detail.maNganKho,
        "maDonVi": this.detail.maDvi,
        "maHang": this.typeVthh,
        "maNganLo": this.detail.maNganLo,
        "maLhKho": this.detail.maLhKho,
        "maNhaKho": this.detail.maNhaKho,
        "maQhns": this.detail.maDvi,
        "thuKho": this.detail.thuKho,
        "ngayNhap": this.detail?.ngayNhap ? dayjs(this.detail?.ngayNhap).format('YYYY-MM-DD') : null,
        "qlPhieuNhapKhoLtId": this.detail.qlPhieuNhapKhoLtId,
        "qdgnvnxId": this.detail.qdgnvnxId,
        "soBangKe": this.detail.soBangKe,
        "soHd": this.detail.soHd,
        "soKho": this.detail.soKho,
        "tenHang": null,
        "tenNguoiGiaoHang": this.detail.tenNguoiGiaoHang,
        "maVatTu": this.detail.maVatTu,
        "maVatTuCha": this.detail.maVatTuCha,
        "thoiGianGiaoHang": null
      };
      if (this.id > 0) {
        let res = await this.quanLyBangKeCanHangService.sua(
          body,
        );
        if (res.msg == MESSAGE.SUCCESS) {
          if (!isOther) {
            this.notification.success(
              MESSAGE.SUCCESS,
              MESSAGE.UPDATE_SUCCESS,
            );
            this.back();
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      } else {
        let res = await this.quanLyBangKeCanHangService.them(
          body,
        );
        if (res.msg == MESSAGE.SUCCESS) {
          if (!isOther) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
            this.back();
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  print() {

  }

  thongTinTrangThai(trangThai: string): string {
    return thongTinTrangThaiNhap(trangThai);
  }
}
