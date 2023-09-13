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
import { HoSoKyThuatService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kiemtra-cl/hoSoKyThuat.service';
import { QuanLyBienBanBanGiaoService } from 'src/app/services/quanLyBienBanBanGiao.service';
import { QuanLyNghiemThuKeLotService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kiemtra-cl/quanLyNghiemThuKeLot.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/qd-giaonv-nh/quyetDinhGiaoNhapHang.service';
import { ThongTinHopDongService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/hop-dong/thongTinHopDong.service';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { UserService } from 'src/app/services/user.service';
import { convertTienTobangChu, thongTinTrangThaiNhap } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
import { BaseComponent } from "../../../../../../components/base/base.component";
import { FormBuilder, Validators } from '@angular/forms';
import { PAGE_SIZE_DEFAULT } from '../../../../../../constants/config';
import { HelperService } from '../../../../../../services/helper.service';
import { DatePipe } from '@angular/common';
import { LOAI_BIEN_BAN, STATUS } from 'src/app/constants/status';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { QuanLyBienBanLayMauService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kiemtra-cl/quanLyBienBanLayMau.service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { Base2Component } from 'src/app/components/base2/base2.component';

@Component({
  selector: 'app-them-moi-ho-so-ky-thuat',
  templateUrl: './them-moi-ho-so-ky-thuat.component.html',
  styleUrls: ['./them-moi-ho-so-ky-thuat.component.scss']
})
export class ThemMoiHoSoKyThuatComponent extends Base2Component implements OnInit {

  @Input() id: number;
  @Input() isView: boolean;
  @Input() loaiVthh: string;
  @Output()
  showListEvent = new EventEmitter<any>();

  isBienBan: boolean = false;
  idBienBan: number;
  loaiBienBan: string;
  previewNameBienBan: string;

  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = false;

  userInfo: UserLogin;
  detail: any = {};
  detailGiaoNhap: any = {};
  detailHopDong: any = {};

  listThuKho: any[] = [];
  listNganLo: any[] = [];
  listLoaiKho: any[] = [];
  listPTBaoQuan: any[] = [];
  listDonViTinh: any[] = [];
  listSoQuyetDinh: any[] = [];
  listBanGiaoMau: any[] = [];


  listDaiDienCuc: any[] = [];
  listDaiDienChiCuc: any[] = [];
  listDaiDienDonVi: any[] = [];
  fileDinhKem: any[] = [];
  listCanCu: any[] = [];
  listFileDinhKem: any[] = [];

  STATUS = STATUS;
  dataTable: any[] = [];
  dataTableBienBan: any[] = [
    {
      id: null,
      tenBb: "Biên bản kiểm tra ngoại quan",
      trangThai: "00",
      tenTrangThai: "Dự Thảo",
      fileDinhKems: "",
      loai: LOAI_BIEN_BAN.BB_KTRA_NGOAI_QUAN,
      previewName: 'bien_ban_kiem_tra_ngoai_quan.docx'
    },
    {
      id: null,
      tenBb: "Biên bản kiểm tra vận hành",
      trangThai: "00",
      tenTrangThai: "Dự Thảo",
      fileDinhKems: "",
      loai: LOAI_BIEN_BAN.BB_KTRA_VAN_HANH,
      previewName: 'bien_ban_kiem_tra_van_hanh.docx'
    },
    {
      id: null,
      tenBb: "Biên bản kiểm tra hồ sơ kỹ thuật",
      trangThai: "00",
      tenTrangThai: "Dự Thảo",
      fileDinhKems: "",
      loai: LOAI_BIEN_BAN.BB_KTRA_HOSO_KYTHUAT,
      previewName: 'bien_ban_kiem_tra_hskt.docx'
    }
  ];
  previewName: string = 'ho_so_ky_thuat';
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService,
    public userService: UserService,
    private hoSoKyThuatService: HoSoKyThuatService,
    private bienBanLayMauService: QuanLyBienBanLayMauService
  ) {
    super(httpClient, storageService, notification, spinner, modal, hoSoKyThuatService);
    this.formData = this.fb.group({
      id: [],
      maDvi: [''],
      tenDvi: [''],
      tenNguoiTao: [''],
      nam: [dayjs().get('year')],
      ngayTao: [dayjs().format('YYYY-MM-DD')],
      soBbLayMau: [null],
      soHoSoKyThuat: [null],
      idQdGiaoNvNh: [null],
      soQdGiaoNvNh: [null],
      soHd: [null],
      ldoTuchoi: [],
      trangThai: [],
      tenTrangThai: [],
      ngayPduyet: [],
      ngayKyHd: [],
      tenNganLoKho: [],
      tenNhaKho: [],
      tenDiemKho: [],
      diaDiemKho: [],
      tenLoaiVthh: [],
      tenCloaiVthh: [],
      soLuong: [],
      dvt: [],
      tenChiCuc: [],
      lanhDaoChiCuc: [],
      truongPhong: [],
      lanhDaoCuc: [],
      dviCungCap: [],
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      if (this.id) {
        await this.loadChiTiet(this.id);
      } else {
        this.initForm();
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loadChiTiet(id) {
    if (id > 0) {
      let res = await this.hoSoKyThuatService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        const data = res.data;
        this.helperService.bidingDataInFormGroup(this.formData, data);
        if (data.listHoSoBienBan) {
          this.dataTableBienBan.forEach(item => {
            let bb = data.listHoSoBienBan.filter(x => x.loaiBb == item.loai);
            console.log(data.listHoSoBienBan, bb);
            if (bb.length > 0) {
              item.id = bb[0].id
              item.trangThai = bb[0].trangThai
              item.tenTrangThai = bb[0].tenTrangThai
            }
          });
          console.log(this.dataTableBienBan);
        }
      }
    }
  }

  async initForm() {
    let id = await this.userService.getId('HO_SO_KY_THUAT_SEQ')
    this.formData.patchValue({
      soHoSoKyThuat: `${id}/${this.formData.get('nam').value}/HSKT-CDTKVVP`,
      tenDvi: this.userInfo.TEN_DVI,
      maDvi: this.userInfo.MA_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      tenNguoiTao: this.userInfo.TEN_DAY_DU,
      trangThai: "00",
      tenTrangThai: "Dự Thảo"
    });

  }

  quayLai() {
    this.showListEvent.emit();
  }

  isDisableField() {
    if (this.detail && (this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_TP || this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC || this.detail.trangThai == this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC)) {
      return true;
    }
  }

  async openDialogBbLayMau() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách biên bản lấy mẫu/bàn giao mẫu',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listBanGiaoMau,
        dataHeader: ['Số biên bản', 'Ngăn/Lô kho', 'Nhà Kho', 'Điểm kho'],
        dataColumn: ['soBienBan', 'tenNganLoKho', 'tenNhaKho', 'tenDiemKho'],
      },
    })
    modalQD.afterClose.subscribe(async (dataChose) => {
      if (dataChose) {
        this.formData.patchValue({
          soBbLayMau: dataChose.soBienBan,
          soHd: dataChose.soHd,
          soQdGiaoNvNh: dataChose.soQdGiaoNvNh,
          idQdGiaoNvNh: dataChose.idQdGiaoNvNh,
          tenNganLoKho: dataChose.tenNganLoKho,
          tenNhaKho: dataChose.tenNhaKho,
          tenDiemKho: dataChose.tenDiemKho,
          tenChiCuc: dataChose.tenDvi,
        });
      }
    });
  };

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
            trangThai: this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_TP ? this.globals.prop.NHAP_TU_CHOI_TP : this.globals.prop.NHAP_TU_CHOI_LD_CHI_CUC,
          };
          let res =
            await this.hoSoKyThuatService.approve(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
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

  async save(isGuiDuyet?) {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng điền đủ thông tin');
      return;
    }
    let body = this.formData.value;
    body.fileDinhkems = this.fileDinhKem;
    let res = null;
    if (this.formData.get('id').value) {
      res = await this.hoSoKyThuatService.update(body);
    } else {
      res = await this.hoSoKyThuatService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isGuiDuyet) {
        this.id = res.data.id;
        await this.pheDuyet();
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

  async pheDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn gửi duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        await this.spinner.show();
        try {
          let body = {
            id: this.id,
            trangThai: '',
          };
          switch (this.formData.get('trangThai').value) {
            case STATUS.TU_CHOI_LDC:
            case STATUS.TU_CHOI_TP:
            case STATUS.DU_THAO: {
              body.trangThai = STATUS.CHO_DUYET_TP;
              break;
            }
            case STATUS.CHO_DUYET_TP: {
              body.trangThai = STATUS.CHO_DUYET_LDC;
              break;
            }
            case STATUS.CHO_DUYET_LDC: {
              body.trangThai = STATUS.DA_DUYET_LDC;
              break;
            }
          }
          let res = await this.hoSoKyThuatService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(
              MESSAGE.SUCCESS,
              MESSAGE.THAO_TAC_SUCCESS,
            );
            this.quayLai();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          await this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          await this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  redirectToBienBan(isView: boolean, data: any) {
    this.idBienBan = data.id;
    this.loaiBienBan = data.loai;
    this.isBienBan = true;
    this.previewNameBienBan = data.previewName;
  }

  async backMain() {
    this.isBienBan = false;
    this.ngOnInit();
  }

  async openDialogSoQd() {
    let body = {
      "loaiVthh": this.loaiVthh,
      "trangThai": this.STATUS.BAN_HANH,
    }
    let res = await this.quyetDinhGiaoNhapHangService.layTatCaQdGiaoNvNh(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listSoQuyetDinh = res.data;
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
        dataHeader: ['Số quyết định', 'Ngày quyết định', 'Loại hàng DTQG', ' Chủng loại hàng DTQG'],
        dataColumn: ['soQd', 'ngayQdinh', 'tenLoaiVthh', 'tenCloaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (dataChose) => {
      if (dataChose) {
        this.formData.patchValue({
          soHd: dataChose.hopDong?.soHd,
          ngayKyHd: dataChose.hopDong?.ngayKy,
          dviCungCap: dataChose.hopDong?.tenNhaThau,
          soQdGiaoNvNh: dataChose.soQd,
          idQdGiaoNvNh: dataChose.id,
          tenLoaiVthh: dataChose.tenLoaiVthh,
          tenCloaiVthh: dataChose.tenCloaiVthh,
          dvt: dataChose.donViTinh,
        });
        this.listBanGiaoMau = dataChose.listBienBanLayMau;
      }
    });
  };
}
