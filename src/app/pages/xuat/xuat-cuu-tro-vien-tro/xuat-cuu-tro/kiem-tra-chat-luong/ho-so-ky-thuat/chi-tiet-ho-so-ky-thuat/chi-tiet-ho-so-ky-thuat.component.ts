import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Base2Component} from "../../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import dayjs from "dayjs";
import {Validators} from "@angular/forms";
import {LOAI_BIEN_BAN, STATUS} from "../../../../../../../constants/status";
import {NzDatePickerComponent} from "ng-zorro-antd/date-picker";
import {Subject} from "rxjs";
import {UserLogin} from "../../../../../../../models/userlogin";
import {UserService} from "../../../../../../../services/user.service";
import {
  HoSoKyThuatService
} from "../../../../../../../services/qlnv-hang/nhap-hang/dau-thau/kiemtra-cl/hoSoKyThuat.service";
import {
  QuanLyBienBanLayMauService
} from "../../../../../../../services/qlnv-hang/nhap-hang/dau-thau/kiemtra-cl/quanLyBienBanLayMau.service";
import {MESSAGE} from "../../../../../../../constants/message";
import {
  DialogTableSelectionComponent
} from "../../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import {DialogTuChoiComponent} from "../../../../../../../components/dialog/dialog-tu-choi/dialog-tu-choi.component";

@Component({
  selector: 'app-chi-tiet-ho-so-ky-thuat',
  templateUrl: './chi-tiet-ho-so-ky-thuat.component.html',
  styleUrls: ['./chi-tiet-ho-so-ky-thuat.component.scss']
})
export class ChiTietHoSoKyThuatComponent extends Base2Component implements OnInit {


  @Input() id: number;
  @Input() isView: boolean;
  @Input() isViewDetail: boolean;
  @Input() loaiVthh: string;
  @Output()
  showListEvent = new EventEmitter<any>();

  isBienBan: boolean = false;
  idBienBan: number;
  loaiBienBan: string;

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
    },
    {
      id: null,
      tenBb: "Biên bản kiểm tra vận hành",
      trangThai: "00",
      tenTrangThai: "Dự Thảo",
      fileDinhKems: "",
      loai: LOAI_BIEN_BAN.BB_KTRA_VAN_HANH
    },
    {
      id: null,
      tenBb: "Biên bản kiểm tra hồ sơ kỹ thuật",
      trangThai: "00",
      tenTrangThai: "Dự Thảo",
      fileDinhKems: "",
      loai: LOAI_BIEN_BAN.BB_KTRA_HOSO_KYTHUAT
    }
  ];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    public userService: UserService,
    private hoSoKyThuatService: HoSoKyThuatService,
    private bienBanLayMauService: QuanLyBienBanLayMauService
  ) {
    super(httpClient, storageService, notification, spinner, modal, hoSoKyThuatService);
    super.ngOnInit();
    this.formData = this.fb.group({
      id: [],
      maDvi: ['', [Validators.required]],
      tenDvi: ['', [Validators.required]],
      nam: [dayjs().get('year'), [Validators.required]],
      ngayTao: [dayjs().format('YYYY-MM-DD')],
      soBbLayMau: [null, [Validators.required]],
      soHoSoKyThuat: [null, [Validators.required]],
      idQdGiaoNvNh: [null, [Validators.required]],
      soQdGiaoNvNh: [null, [Validators.required]],
      soHd: [null, [Validators.required]],
      ldoTuchoi: [],
      trangThai: [],
      tenTrangThai: [],
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
    let body = {
      "maDvi": this.userInfo.MA_DVI,
      "loaiVthh": this.loaiVthh,
      "paggingReq": {
        "limit": this.globals.prop.MAX_INTERGER,
        "page": 0
      },
      "trangThai": STATUS.BAN_HANH,
      "namNhap": this.formData.get('nam').value
    }
    let res = await this.bienBanLayMauService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listBanGiaoMau = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách biên bản lấy mẫu/bàn giao mẫu',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listBanGiaoMau,
        dataHeader: ['Số biên bản', 'Loại hàng hóa'],
        dataColumn: ['soBienBan', 'tenLoaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (dataChose) => {
      if (dataChose) {
        this.formData.patchValue({
          soBbLayMau: dataChose.soBienBan,
          soHd: dataChose.soHd,
          soQdGiaoNvNh: dataChose.soQdGiaoNvNh,
          idQdGiaoNvNh: dataChose.idQdGiaoNvNh
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
  }

  async backMain() {
    this.isBienBan = false;
    this.ngOnInit();
  }


}
