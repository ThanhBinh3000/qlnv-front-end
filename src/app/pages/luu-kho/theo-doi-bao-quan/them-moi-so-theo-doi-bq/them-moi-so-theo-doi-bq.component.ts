
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NzModalService} from "ng-zorro-antd/modal";
import {ThongTinQuyetDinh} from "../../../../models/DeXuatKeHoachuaChonNhaThau";
import {UserService} from "../../../../services/user.service";
import {Globals} from "../../../../shared/globals";
import {DanhMucService} from "../../../../services/danhmuc.service";
import {HelperService} from "../../../../services/helper.service";
import {STATUS} from "../../../../constants/status";
import dayjs from "dayjs";
import {UserLogin} from "../../../../models/userlogin";
import {MESSAGE} from "../../../../constants/message";
import {DANH_MUC_LEVEL} from "../../luu-kho.constant";
import {saveAs} from 'file-saver';
import {DonviService} from "../../../../services/donvi.service";
import {TheoDoiBqService} from "../../../../services/theo-doi-bq.service";
import {DialogTuChoiComponent} from "../../../../components/dialog/dialog-tu-choi/dialog-tu-choi.component";
@Component({
  selector: 'app-them-moi-so-theo-doi-bq',
  templateUrl: './them-moi-so-theo-doi-bq.component.html',
  styleUrls: ['./them-moi-so-theo-doi-bq.component.scss']
})
export class ThemMoiSoTheoDoiBqComponent implements OnInit {

  @Input() isViewDetail: boolean;
  @Input() typeHangHoa: string;
  @Input() idInput: number;
  @Output('close') onClose = new EventEmitter<any>();

  formData: FormGroup

  userInfo : UserLogin
  STATUS = STATUS
  dataTable: any[] = []
  dsCuc: any[] = [];
  dsChiCuc: any[] = [];
  rowItem: TheoDoiBqCt = new TheoDoiBqCt();
  dataEdit: { [key: string]: { edit: boolean; data: TheoDoiBqCt } } = {};
  listQdKhTh: any[] = [];
  dsNam: any[] = [];
  listCloaiVthh: any[] = [];
  listVthh: any[] = [];
  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganKho: any[] = [];
  listNganLo: any[] = [];
  listPhuongThucBaoQuan: any[] = [];
  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    public userService: UserService,
    public globals: Globals,
    private danhMucService: DanhMucService,
    private theoDoiBqService: TheoDoiBqService,
    private donviService: DonviService,
    private fb: FormBuilder,
    private modal: NzModalService,
    private helperService: HelperService
  ) {
    this.formData = this.fb.group({
      id: [null],
      maDonVi : ['', Validators.required],
      tenDvi : ['', Validators.required],
      nam : ['', Validators.required],
      kieuBaoQuan : ['', Validators.required],
      loaiHH : ['', Validators.required],
      tenHH : ['', Validators.required],
      maDiemKho : ['', Validators.required],
      maNhaKho : ['', Validators.required],
      maNganKho : ['', Validators.required],
      maLoKho : [''],
      thuKhoId : ['', Validators.required],
      tuNgay : ['', Validators.required],
      denNgay : ['', Validators.required],
      quyCach : ['', Validators.required],
      soLuong : ['', Validators.required],
      liDoTuChoi : [''],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
    });
  }

  async ngOnInit() {
    this.userInfo = this.userService.getUserLogin();
    this.loadDsNam();
    await Promise.all([
      this.loadListPtbq(),
      this.loadDiemKho(),
      this.getAllLoaiVthh(),
    ]);
    if (this.idInput) {
      await this.getDetail(this.idInput);
    } else {
      await this.initForm()
    }
    ;
  }

  initForm() {
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI,
      maDonVi: this.userInfo.MA_DVI,
    })
  }

  loadDsNam() {
    let thisYear = dayjs().get('year');
    for (let i = -10; i < 10; i++) {
      this.dsNam.push((thisYear - i));
    }
  }

  async loadListPtbq() {
    this.listPhuongThucBaoQuan = [];
    let res = await this.danhMucService.danhMucChungGetAll('PT_BAO_QUAN');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listPhuongThucBaoQuan = res.data;
    }
  }

  async getAllLoaiVthh() {
    let res = await this.danhMucService.danhMucChungGetAll('LOAI_HHOA');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listVthh = res.data;
    }
  }

  async onChangeLoaiVthh(event) {
    if (event) {
      let body = {
        "str": event
      };
      let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha(body);
      this.listCloaiVthh = [];
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.listCloaiVthh = res.data;
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  async onChangCloaiVthh(event) {
    let res = await this.danhMucService.getDetail(event);
    if (res.msg == MESSAGE.SUCCESS) {
      this.formData.patchValue({
        donViTinh: res.data ? res.data.maDviTinh : null
      })
    }
  }

  async loadDiemKho() {
    const body = {
      maDviCha: this.userInfo.MA_DVI,
      trangThai: '01',
    };

    const dsTong = await this.donviService.layDonViTheoCapDo(body);
    let res = dsTong[DANH_MUC_LEVEL.DIEM_KHO];
    this.listDiemKho = res.filter(item => item.type == "MLK")
  }

  async changeDiemKho(event) {
    const body = {
      maDviCha: event,
      trangThai: '01',
    };
    const dsTong = await this.donviService.layDonViTheoCapDo(body);
    this.listNhaKho = dsTong[DANH_MUC_LEVEL.NHA_KHO];
  }

  async changeNhaKho(event) {
    const body = {
      maDviCha: event,
      trangThai: '01',
    };
    const dsTong = await this.donviService.layDonViTheoCapDo(body);
    this.listNganKho = dsTong[DANH_MUC_LEVEL.NGAN_KHO];
  }

  async changeNganKho(event) {
    const body = {
      maDviCha: event,
      trangThai: '01',
    };
    const dsTong = await this.donviService.layDonViTheoCapDo(body);
    this.listNganLo = dsTong[DANH_MUC_LEVEL.LO_KHO];
  }

  quayLai() {
    this.onClose.emit();
  }
  guiDuyet() {

  }

  async getDetail(id) {
    let res = await this.theoDoiBqService.getDetail(id)
    if (res.msg == MESSAGE.SUCCESS) {
      let detail = res.data
      this.formData.patchValue({
        id : detail.id,
        nam : detail.nam,
        maDonVi : detail.maDonVi,
        tenDvi : detail.tenDvi,
        loaiHH : detail.loaiHH,
        tenHH : detail.tenHH,
        maDiemKho : detail.maDiemKho,
        maNhaKho : detail.maNhaKho,
        maNganKho : detail.maNganKho,
        maLoKho : detail.maLoKho,
        soLuong : detail.soLuong,
        tenTrangThai : detail.tenTrangThai,
        trangThai: detail.trangThai,
        thuKhoId: detail.thuKhoId,
        tuNgay: detail.tuNgay,
        denNgay: detail.denNgay,
        quyCach: detail.quyCach,
        kieuBaoQuan: detail.kieuBaoQuan,
        liDoTuChoi : detail.liDoTuChoi,
      });
      this.dataTable = detail.ds
      this.updateEditCache();
    }
  }

  editItem(index: number): void {
    this.dataEdit[index].edit = true;
  }

  xoaItem(index: number) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: () => {
        this.dataTable.splice(index,1);
        this.updateEditCache();
      },
    });
  }


  themMoiItem() {
    if (!this.dataTable) {
      this.dataTable = [];
    }
    this.dataTable = [...this.dataTable, this.rowItem]
    this.rowItem = new TheoDoiBqCt();
    this.updateEditCache()
  }

  clearData() {

  }

  huyEdit(idx: number): void {
    this.dataEdit[idx] = {
      data: { ...this.dataTable[idx] },
      edit: false,
    };
  }

  luuEdit(index: number): void {
    Object.assign(this.dataTable[index], this.dataEdit[index].data);
    this.dataEdit[index].edit = false;
  }

  updateEditCache(): void {
    if (this.dataTable) {
      this.dataTable.forEach((item, index) => {
        this.dataEdit[index] = {
          edit: false,
          data: { ...item },
        }
      });
    }
  }
  async save(isGuiDuyet?) {
    this.spinner.show();
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    body.maDonVi = this.userInfo.MA_DVI
    body.ds = this.dataTable
    let res
    if (this.idInput > 0) {
      res = await this.theoDoiBqService.update(body);
    } else {
      res = await this.theoDoiBqService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isGuiDuyet) {
        this.formData.patchValue({
          id: res.data.id,
          trangThaiChiCuc: res.data.trangThaiChiCuc
        })
        this.pheDuyet();
      } else {
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

  pheDuyet() {
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
          let trangThai;
          switch (this.formData.value.trangThai) {
            case STATUS.DU_THAO : {
              trangThai = STATUS.CHO_DUYET_LDCC;
              break;
            }
            case STATUS.CHO_DUYET_LDCC : {
              trangThai = STATUS.DA_DUYET_LDCC;
              break;
            }
            case STATUS.TU_CHOI_LDCC : {
              trangThai = STATUS.CHO_DUYET_LDCC;
              break;
            }
          }
          let body = {
            id: this.formData.value.id,
            lyDo: null,
            trangThai: trangThai,
          };
          let res = await this.theoDoiBqService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.PHE_DUYET_SUCCESS);
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
          let trangThai;
          switch (this.formData.value.trangThai) {
            case STATUS.CHO_DUYET_LDCC : {
              trangThai = STATUS.TU_CHOI_LDCC;
              break;
            }
          }
          let body = {
            id: this.idInput,
            liDoTuChoi: text,
            trangThai: trangThai
          };
          let res = await this.theoDoiBqService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
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
      }
    });
  }

  exportCt() {
    if (this.idInput) {
      this.spinner.show();
      try {
        this.theoDoiBqService
          .exportCt(this.idInput)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach.xlsx'),
          );
        this.spinner.hide();
      } catch (e) {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    }
    }

  changeNganLo() {
    this.formData.patchValue({
      soLuong : 300
    })
  }
}

export class TheoDoiBqCt {
  bienPhap : string;
  dienBien : string;
  ketQua : string;
  ngayTao : any;
  nguoiKtraId : string;
  nguyenNhan : string;
}
