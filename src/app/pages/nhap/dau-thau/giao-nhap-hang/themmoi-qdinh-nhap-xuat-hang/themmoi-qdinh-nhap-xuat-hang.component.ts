import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup, Validators} from '@angular/forms';
import {differenceInCalendarDays} from 'date-fns';
import dayjs from 'dayjs';
import {cloneDeep} from 'lodash';
import {DisabledTimeFn} from 'ng-zorro-antd/date-picker';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {
  DialogTableSelectionComponent
} from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import {DialogTuChoiComponent} from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import {DATEPICKER_CONFIG} from 'src/app/constants/config';
import {MESSAGE} from 'src/app/constants/message';
import {FileDinhKem} from 'src/app/models/FileDinhKem';
import {DetailQuyetDinhNhapXuat, QuyetDinhNhapXuat, ThongTinDiaDiemNhap} from 'src/app/models/QuyetDinhNhapXuat';
import {UserLogin} from 'src/app/models/userlogin';
import {DonviService} from 'src/app/services/donvi.service';
import {
  QuyetDinhGiaoNhapHangService
} from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/qd-giaonv-nh/quyetDinhGiaoNhapHang.service';
import {ThongTinHopDongService} from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/hop-dong/thongTinHopDong.service';
import {STATUS} from "../../../../../constants/status";
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {PREVIEW} from "../../../../../constants/fileType";

@Component({
  selector: 'app-themmoi-qdinh-nhap-xuat-hang',
  templateUrl: './themmoi-qdinh-nhap-xuat-hang.component.html',
  styleUrls: ['./themmoi-qdinh-nhap-xuat-hang.component.scss'],
})
export class ThemmoiQdinhNhapXuatHangComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() loaiVthh: string;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input() isViewDetail: boolean;
  errorInputRequired: string = 'Dữ liệu không được để trống.';
  formData: FormGroup;
  chiTietQDGiaoNhapXuatHang: any = [];
  taiLieuDinhKemList: any[] = [];
  datePickerConfig = DATEPICKER_CONFIG;
  type: string = '';
  quyetDinhNhapXuat: QuyetDinhNhapXuat = new QuyetDinhNhapXuat();
  dataQDNhapXuat;
  optionsDonVi: any[] = [];
  optionsFullDonVi: any[] = [];
  optionsFullHangHoa: any[] = [];
  optionsHangHoa: any[] = [];
  userInfo: UserLogin;
  routerUrl: string;
  quyetDinhNhapXuatDetailCreate: DetailQuyetDinhNhapXuat;
  dsQuyetDinhNhapXuatDetailClone: Array<DetailQuyetDinhNhapXuat> = [];
  isAddQdNhapXuat: boolean = false;
  isChiTiet: boolean = false;

  loaiStr: string;
  maVthh: string;
  idVthh: number;
  routerVthh: string;
  today = new Date();
  listNam: any[] = [];
  // hopDongList: any[] = [];
  listFileDinhKem: any[] = [];

  STATUS = STATUS
  maQdSuffix: string;

  hopDongIds: any[number] = [];

  listHopDong: any[] = [];

  dataTable: any[] = [];

  rowItem: ThongTinDiaDiemNhap = new ThongTinDiaDiemNhap();
  rowItemEdit: ThongTinDiaDiemNhap = new ThongTinDiaDiemNhap();

  listChiCuc: any[] = [];
  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganKho: any[] = [];
  listNganLo: any[] = [];
  listNhaKhoEdit: any[] = [];
  listNganKhoEdit: any[] = [];
  listNganLoEdit: any[] = [];
  listCanCu: any[] = [];
  previewName : string;
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donViService: DonviService,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService,
    private thongTinHopDongSercive: ThongTinHopDongService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhGiaoNhapHangService);
    this.formData = this.fb.group({
      id: [''],
      soQd: [''],
      ngayQdinh: [dayjs().format("YYYY-MM-DD")],
      soHd: ['', [Validators.required]],
      tenGoiThau: [''],
      idHd: [''],
      trichYeu: [],
      namNhap: [dayjs().get('year')],
      tenDvi: [''],
      maDvi: [''],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      loaiVthh: [''],
      tenLoaiVthh: [''],
      cloaiVthh: [''],
      moTaHangHoa: [''],
      soLuong: [''],
      donViTinh: [''],
      tgianNkho: [''],
      tenCloaiVthh: [''],
      ldoTuchoi: [''],
      trangThaiChiCuc: [],
      loaiHinhNx: 'Mua đấu thầu',
      kieuNx: 'Nhập mua'
    });
  }

  async ngOnInit() {
    this.spinner.show()
    let dayNow = dayjs().get('year');
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayNow - i,
        text: dayNow - i,
      });
    }
    this.userInfo = this.userService.getUserLogin();
    this.maQdSuffix = "/" + this.userInfo.MA_QD;
    if (this.id > 0) {
      await this.loadThongTinQdNhapXuatHang(this.id);
    } else {
      this.initForm();
    }
    await Promise.all([
      await this.loadDiemKho()
    ])

    this.spinner.hide();
  }

  initForm() {
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI,
      maDvi: this.userInfo.MA_DVI,
      loaiVthh: this.loaiVthh
    });
  }

  async openDialogHopDong() {
    if (this.isChiTiet) {
      return;
    }
    let body = {
      "loaiVthh": this.loaiVthh,
      "trangThai": STATUS.DA_KY,
      "namHd": this.formData.get('namNhap').value,
      "paggingReq": {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0,
      },
    }
    let res = await this.thongTinHopDongSercive.searchDsQdGiaoNvNh(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listHopDong = res.data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    const modalQD = this.modal.create({
      nzTitle: 'Thông tin hợp đồng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listHopDong,
        dataHeader: ['Số hợp đồng', 'Tên hợp đồng', 'Ngày ký', 'Loại hàng DTQG', 'Chủng loại hàng DTQG'],
        dataColumn: ['soHd', 'tenHd', 'ngayKy', 'tenLoaiVthh', 'tenCloaiVthh']
      },
    });
    modalQD.afterClose.subscribe(async (dataSelect) => {
      if (dataSelect) {
        this.spinner.show();
        let res = await this.thongTinHopDongSercive.getDetail(dataSelect.id);
        if (res.msg == MESSAGE.SUCCESS) {
          this.dataTable = [];
          const data = res.data;
          this.formData.patchValue({
            soHd: data.soHd,
            tenGoiThau: data.tenGoiThau,
            idHd: data.id,
            loaiVthh: data.loaiVthh,
            cloaiVthh: data.cloaiVthh,
            tenLoaiVthh: data.tenLoaiVthh,
            tenCloaiVthh: data.tenCloaiVthh,
            moTaHangHoa: data.moTaHangHoa,
            donViTinh: data.donViTinh,
            soLuong: data.soLuong,
            tgianNkho: data.tgianGiaoDuHang,
          })
          if (data.loaiVthh.startsWith('02')) {
            let dataUserLogin = data.details.filter(item => item.maDvi == this.userInfo.MA_DVI);
            this.dataTable = dataUserLogin[0].children;
            this.dataTable.forEach(x => {
              x.trangThai = STATUS.CHUA_THUC_HIEN;
              x.tenTrangThai = "Chưa thực hiện";
            });
          } else {
            this.formData.patchValue({
              donViTinh: 'tấn',
            })
            this.dataTable = data.details[0].children;
            this.dataTable.forEach(x => {
              x.trangThai = STATUS.CHUA_THUC_HIEN;
              x.tenTrangThai = "Chưa thực hiện";
              x.children.forEach(y => {
                y.maChiCuc = x.maDvi
                y.soLuongDiemKho = y.soLuong;
                y.tenDiemKho = y.tenDvi;
                y.maDiemKho = y.maDvi;
                y.soLuong = null;
              })
            });
          }
          let soLuong = 0;
          this.dataTable.forEach(i => {
            soLuong += i.soLuong
          })
          this.formData.get('soLuong').setValue(soLuong);
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg)
        }
        this.spinner.hide();
      }
    });

  }

  convertDataHopDongToDataDetail(hopDong) {
    hopDong.hhDdiemNhapKhoList.forEach(async (item) => {
      let dataDetail = {
        maDvi: item.maDvi,
        tenDvi: item.tenDvi,
        loaiVthh: hopDong.loaiVthh,
        tenLoaiVthh: hopDong.tenLoaiVthh,
        cloaiVthh: hopDong.cloaiVthh,
        tenCloaiVthh: hopDong.tenCloaiVthh,
        donViTinh: hopDong.donViTinh,
        soLuong: item.soLuong,
        tgianNkho: hopDong.tgianNkho,
        trangThai: STATUS.CHUA_CAP_NHAT,
        tenTrangThai: 'Chưa cập nhật'
      }
      this.dataTable.push(dataDetail);
    })
  }


  deleteTaiLieuDinhKemTag(data: any) {
    this.taiLieuDinhKemList = this.taiLieuDinhKemList.filter(
      (x) => x.id !== data.id,
    );
    this.quyetDinhNhapXuat.fileDinhKems = this.quyetDinhNhapXuat.fileDinhKems.filter(
      (x) => x.id !== data.id,
    );

  }

  openFile(event) {
    let item = {
      id: new Date().getTime(),
      text: event.name,
    };
    if (!this.taiLieuDinhKemList.find((x) => x.text === item.text)) {
      this.uploadFileService
        .uploadFile(event.file, event.name)
        .then((resUpload) => {
          const fileDinhKem = new FileDinhKem();
          fileDinhKem.fileName = resUpload.filename;
          fileDinhKem.fileSize = resUpload.size;
          fileDinhKem.fileUrl = resUpload.url;
          this.quyetDinhNhapXuat.fileDinhKems.push(fileDinhKem);
          this.taiLieuDinhKemList.push(item);
        });
    }
  }


  checkDataExistQdNhapXuat(quyetDinhNhapXuat: DetailQuyetDinhNhapXuat) {
    if (this.quyetDinhNhapXuat.detail) {
      let indexExist = this.quyetDinhNhapXuat.detail.findIndex(
        (x) => x.maDvi == quyetDinhNhapXuat.maDvi,
      );
      if (indexExist != -1) {
        this.quyetDinhNhapXuat.detail.splice(indexExist, 1);
      }
    } else {
      this.quyetDinhNhapXuat.detail = [];
    }
    this.quyetDinhNhapXuat.detail = [
      ...this.quyetDinhNhapXuat.detail,
      quyetDinhNhapXuat,
    ];
    this.quyetDinhNhapXuat.detail.forEach((lt, i) => {
      lt.stt = i + 1;
    });

  }
  clearNew() {
    this.isAddQdNhapXuat = false;
    // this.newObjectQdNhapXuat();
  }

  startEdit(index: number) {
    this.dsQuyetDinhNhapXuatDetailClone[index].isEdit = true;
  }

  deleteData(stt: number) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.quyetDinhNhapXuat.detail =
          this.quyetDinhNhapXuat?.detail.filter(
            (khlt) => khlt.stt !== stt,
          );
        this.quyetDinhNhapXuat?.detail.forEach((lt, i) => {
          if (i >= stt - 1) {
            lt.stt = i + 1;
          }
        });
        this.dsQuyetDinhNhapXuatDetailClone = cloneDeep(
          this.quyetDinhNhapXuat.detail,
        );
        // this.loadData();
      },
    });
  }

  onInput(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      // this.optionsDonVi = [];
    } else {
      this.optionsDonVi = this.optionsFullDonVi.filter(
        (x) => x.labelDonVi.toLowerCase().indexOf(value.toLowerCase()) != -1,
      );
    }
  }

  async save(isGuiDuyet?: boolean) {
    this.spinner.show();
    this.setValidator(isGuiDuyet);
    this.helperService.markFormGroupTouched(this.formData);
    if (!this.formData.valid) {
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    if (this.formData.get('soQd').value) {
      body.soQd = this.formData.get('soQd').value + this.maQdSuffix;
    }
    body.detailList = this.dataTable;
    body.fileDinhKems = this.listFileDinhKem;
    body.fileCanCu = this.listCanCu;
    let res;
    if (this.formData.get('id').value > 0) {
      res = await this.quyetDinhGiaoNhapHangService.update(body);
    } else {
      res = await this.quyetDinhGiaoNhapHangService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isGuiDuyet) {
        this.spinner.hide();
        this.id = res.data.id;
        this.pheDuyet();
      } else {
        if (this.formData.get('id').value) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
          // this.redirectQdNhapXuat();
        } else {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
          // this.redirectQdNhapXuat();
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
      if (this.formData.value.trangThai == STATUS.CHO_DUYET_LDC) {
        this.formData.controls["soQd"].setValidators([Validators.required]);
        // this.formData.controls["ngayQdinh"].setValidators([Validators.required]);
      } else {
        this.formData.controls["soQd"].clearValidators();
        // this.formData.controls["ngayQdinh"].clearValidators();
      }
    } else {
      this.formData.controls["soQd"].clearValidators();
      // this.formData.controls["ngayQdinh"].clearValidators();
    }
  }

  redirectQdNhapXuat() {
    this.showListEvent.emit();
  }

  async loadThongTinQdNhapXuatHang(id: number) {
    await this.quyetDinhGiaoNhapHangService
      .getDetail(id)
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          const data = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, data);
          this.maQdSuffix = "/" + data.soQd?.split("/")[1]
          if (!this.loaiVthh.startsWith('02')) {
            this.formData.patchValue({
              donViTinh: 'tấn',
            })
          }
          this.formData.patchValue({
            soQd: data.soQd?.split('/')[0],
          });
          if (this.userService.isCuc() || this.userService.isTongCuc()) {
            this.dataTable = data.dtlList
          }
          if (this.userService.isChiCuc()) {
            this.dataTable = data.dtlList.filter(x => x.maDvi == this.userInfo.MA_DVI);
            this.formData.patchValue({
                  trangThaiChiCuc: this.dataTable[0].trangThai
            });
            // this.dataTable.forEach(x => {
            //   let objListDiemKho = x.children.map(x => x.maDiemKho);
            //   if (objListDiemKho.length > 0) {
            //     this.listDiemKho = this.listDiemKho.filter(item => item.key.indexOf(objListDiemKho) >= 0);
            //   }
            //   this.listDiemKho.forEach(item => {
            //     let ttDk = x.children.filter(x => x.maDiemKho == item.key)[0];
            //     item.soLuongDiemKho = ttDk.soLuongDiemKho;
            //   })
            //   console.log(this.listDiemKho)
            //   this.formData.patchValue({
            //     trangThaiChiCuc: x.trangThai
            //   });
            //   if (x.trangThai == STATUS.CHUA_CAP_NHAT) {
            //     x.children = [];
            //   }
            // });
          }
          let soLuong = 0;
          this.dataTable.forEach(i => {
            soLuong += i.soLuong
          })
          this.formData.get('soLuong').setValue(soLuong);
          this.listFileDinhKem = data.fileDinhKems;
          this.listCanCu = data.fileCanCu;
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      })
  }

  pheDuyet() {
    let trangThai = ''
    let mesg = ''
    switch (this.formData.get('trangThai').value) {
      case STATUS.TU_CHOI_LDC:
      case STATUS.TU_CHOI_TP:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_TP;
        mesg = 'Bạn có muốn gửi duyệt ?'
        break;
      }
      case STATUS.CHO_DUYET_TP: {
        trangThai = STATUS.CHO_DUYET_LDC;
        mesg = 'Bạn có muốn duyệt ?'
        break;
      }
      case STATUS.CHO_DUYET_LDC: {
        trangThai = STATUS.BAN_HANH;
        mesg = 'Bạn có muốn ban hành ?'
        break;
      }
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: mesg,
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
            await this.quyetDinhGiaoNhapHangService.approve(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.THAO_TAC_SUCCESS);
            this.redirectQdNhapXuat();
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
    let trangThai = ''
    switch (this.formData.get('trangThai').value) {
      case STATUS.CHO_DUYET_TP: {
        trangThai = STATUS.TU_CHOI_TP;
        break;
      }
      case STATUS.CHO_DUYET_LDC: {
        trangThai = STATUS.TU_CHOI_LDC;
        break;
      }
    }
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
            lyDo: text,
            trangThai: trangThai,
          };
          let res =
            await this.quyetDinhGiaoNhapHangService.approve(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            // this.redirectQdNhapXuat();
            this.spinner.hide();
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
    this.showListEvent.emit();
  }

  disabledDate = (current: Date): boolean => differenceInCalendarDays(current, this.today) > 0;

  disabledDateTime: DisabledTimeFn = () => ({
    nzDisabledHours: () => this.range(0, 24).splice(4, 20),
    nzDisabledMinutes: () => this.range(30, 60),
    nzDisabledSeconds: () => [55, 56],
  });

  range(start: number, end: number): number[] {
    const result: number[] = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }

  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  themDiaDiemNhap(indexTable?) {
    if (this.rowItem.soLuong <= 0) {
      this.notification.error(MESSAGE.ERROR, "Số lượng phân bổ không được để trống.")
      return false;
    }
    let soLuong = 0;
    this.dataTable[indexTable].children.forEach(item => {
      soLuong += item.soLuong
    })
    if (soLuong + this.rowItem.soLuong > this.dataTable[indexTable].soLuong ) {
      this.notification.error(MESSAGE.ERROR, "Số lượng đã vượt quá chỉ tiêu.")
      return false;
    }
    this.dataTable[indexTable].children = [...this.dataTable[indexTable].children, this.rowItem]
    this.rowItem = new ThongTinDiaDiemNhap();
  }

  themChiCuc() {
    this.dataTable = [...this.dataTable, this.rowItem];
    this.rowItem = new ThongTinDiaDiemNhap();
  }

  validatorDdiemNhap(indexTable): boolean {
    let soLuong = 0;
    let diemKho = this.listDiemKho.filter(item => item.key == this.rowItem.maDiemKho)[0];
    this.dataTable[indexTable].children.forEach(item => {
      if (item.maDiemKho == this.rowItem.maDiemKho) {
        soLuong += item.soLuong;
      }
    });
    soLuong += this.rowItem.soLuong
    if (soLuong > +diemKho.soLuongDiemKho) {
      this.notification.error(MESSAGE.ERROR, "Số lượng thêm mới không được vượt quá số lượng của chi cục")
      return false;
    }

    return true
  }

  calcTong(index?) {
    if (this.dataTable && index != null) {
      const sum = this.dataTable[index].children.reduce((prev, cur) => {
        prev += cur.soLuong;
        return prev;
      }, 0);
      return sum;
    } else if (this.dataTable) {
      return this.dataTable.reduce((prev, cur) => {
        prev += cur.soLuong;
        return prev;
      }, 0);
    }
  }

  validateButtonThem(typeButton): boolean {
    if (typeButton == 'ddiemNhap') {
      if (this.rowItem.maDiemKho && this.rowItem.maNhaKho && this.rowItem.maNganKho && this.rowItem.soLuong > 0) {
        return true
      } else {
        return false;
      }
    } else {
      if (this.rowItem.maChiCuc && this.rowItem.soLuong > 0) {
        return true
      } else {
        return false;
      }
    }

  }
 editRow (i, y){
   this.dataTable[i].children.forEach(i => {
     i.edit = false;
   })
   this.dataTable[i].children[y].edit = true;
   this.rowItemEdit = cloneDeep(this.dataTable[i].children[y])
   let diemKho = this.listDiemKho[i].filter(x => x.key == this.rowItemEdit.maDiemKho);
   if (diemKho && diemKho.length > 0) {
     this.listNhaKhoEdit[i] = diemKho[0].children;
   }
   let nhaKho = this.listNhaKhoEdit[i].filter(x => x.key == this.rowItemEdit.maNhaKho);
   if (nhaKho && nhaKho.length > 0) {
     this.listNganKhoEdit[i] = nhaKho[0].children;
   }
   let nganKho = this.listNganKhoEdit[i].filter(x => x.key == this.rowItemEdit.maNganKho);
   if (nganKho && nganKho.length > 0) {
     this.listNganLoEdit[i] = nganKho[0].children;
   }
 }

  saveEdit (i, y){
    let soLuong = 0;
    let data = cloneDeep(this.dataTable[i].children);
    data.splice(y, 1)
    data.forEach(i => {
      soLuong += i.soLuong;
    })
    if (soLuong + this.rowItemEdit.soLuong  > this.dataTable[i].soLuong) {
      this.notification.error(MESSAGE.ERROR, "Số lượng đã vượt quá chỉ tiêu.")
      return false;
    }
    this.dataTable[i].children[y] = cloneDeep(this.rowItemEdit);
    this.dataTable[i].children[y].edit = false;
  }

  cancelEdit (i, y){
    this.dataTable[i].children[y].edit = false;
    this.rowItemEdit = new ThongTinDiaDiemNhap();
  }
  xoaDiaDiemNhap(indexTable, indexRow?) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        console.log(indexTable, indexRow);
        if (indexRow != null || indexRow != undefined) {
          this.dataTable[indexTable].children.splice(indexRow, 1);
        } else {
          this.dataTable.splice(indexTable, 1);
        }
      },
    });
  }

  clearDiaDiemNhap() {
    this.listNhaKho = [];
    this.listNganKho = [];
    this.listNganLo = [];
    this.rowItem = new ThongTinDiaDiemNhap();
  }

  async loadDiemKho() {
    for (let i = 0; i < this.dataTable.length; i++) {
      let body = {
        maDvi: this.dataTable[i].maDvi,
        loaiVthh: this.formData.value.loaiVthh,
        cloaiVthh: this.formData.value.cloaiVthh,
      }
      const res = await this.donViService.getDonViHangTree(body);
      if (res.msg == MESSAGE.SUCCESS && res.data) {
        this.listDiemKho[i] = res.data.children || [];
      }
    }
    // else {
    //   this.notification.error(MESSAGE.ERROR, res.msg);
    // }
  }

  changeDiemKho(index, isEdit?) {
    if (isEdit) {
      this.listNhaKhoEdit = [];
      this.listNganKhoEdit = [];
      this.listNganLoEdit = [];
      let diemKho = this.listDiemKho[index].filter(x => x.key == this.rowItemEdit.maDiemKho);
      if (diemKho && diemKho.length > 0) {
        this.listNhaKhoEdit[index] = diemKho[0].children;
      }
    } else {
      this.listNhaKho = [];
      this.listNganKho = [];
      this.listNganLo = [];
      this.rowItem.maNhaKho = null;
      this.rowItem.maNganKho = null;
      this.rowItem.maLoKho = null;
      let diemKho = this.listDiemKho[index].filter(x => x.key == this.rowItem.maDiemKho);
      if (diemKho && diemKho.length > 0) {
        this.listNhaKho[index] = diemKho[0].children;
        this.rowItem.tenDiemKho = diemKho[0].tenDvi;
        this.rowItem.soLuongDiemKho = diemKho[0].soLuongDiemKho;
      }
    }
  }

  changeNhaKho(index,isEdit?) {
    if (isEdit) {
      this.listNganKhoEdit = [];
      this.listNganLoEdit = [];
      this.rowItemEdit.maNganKho = null;
      this.rowItemEdit.maLoKho = null;
      let nhaKho = this.listNhaKhoEdit[index].filter(x => x.key == this.rowItemEdit.maNhaKho);
      if (nhaKho && nhaKho.length > 0) {
        this.listNganKhoEdit[index] = nhaKho[0].children;
        this.rowItemEdit.tenNhaKho = nhaKho[0].tenDvi
      }
    } else {
      this.listNganKho = [];
      this.listNganLo = [];
      this.rowItem.maNganKho = null;
      this.rowItem.maLoKho = null;
      let nhaKho = this.listNhaKho[index].filter(x => x.key == this.rowItem.maNhaKho);
      if (nhaKho && nhaKho.length > 0) {
        this.listNganKho[index] = nhaKho[0].children;
        this.rowItem.tenNhaKho = nhaKho[0].tenDvi
      }
    }
  }

  changeNganKho(index, isEdit?) {
    if (isEdit) {
      this.listNganLoEdit = [];
      this.rowItemEdit.maLoKho = null;
      let nganKho = this.listNganKhoEdit[index].filter(x => x.key == this.rowItemEdit.maNganKho);
      if (nganKho && nganKho.length > 0) {
        this.listNganLoEdit[index] = nganKho[0].children;
        this.rowItemEdit.tenNganKho = nganKho[0].tenDvi
      }
    } else {
      this.listNganLo = [];
      this.rowItem.maLoKho = null;
      let nganKho = this.listNganKho[index].filter(x => x.key == this.rowItem.maNganKho);
      if (nganKho && nganKho.length > 0) {
        this.listNganLo[index] = nganKho[0].children;
        this.rowItem.tenNganKho = nganKho[0].tenDvi
      }
    }
  }

  changeLoKho(index, isEdit?) {
    if (isEdit) {
      let loKho = this.listNganLoEdit[index].filter(x => x.key == this.rowItemEdit.maLoKho);
      if (loKho && loKho.length > 0) {
        this.rowItemEdit.tenLoKho = loKho[0].tenDvi
      }
    } else {
      let loKho = this.listNganLo[index].filter(x => x.key == this.rowItem.maLoKho);
      if (loKho && loKho.length > 0) {
        this.rowItem.tenLoKho = loKho[0].tenDvi
      }
    }
  }

  async saveDdiemNhap(statusSave) {
    let daPhanBo = true
    this.dataTable.forEach(item => {
      if(item.children.length == 0){
        this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
        daPhanBo = false;
      }
    })
    if (daPhanBo) {
      this.modal.confirm({
        nzClosable: false,
        nzTitle: 'Xác nhận',
        nzContent: 'Bạn có chắc chắn muốn hoàn thành cập nhật?',
        nzOkText: 'Đồng ý',
        nzCancelText: 'Không',
        nzOkDanger: true,
        nzWidth: 310,
        nzOnOk: async () => {
          this.spinner.show();
          this.dataTable.forEach(item => {
            item.trangThai = statusSave
          });
          let body = {
            detailList: this.dataTable
          }
          let res = await this.quyetDinhGiaoNhapHangService.updateDdiemNhap(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            // this.redirectQdNhapXuat();
            this.spinner.hide();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
            this.spinner.hide();
          }
        },
      });
    }
  }

  isDisableForm() {
    if (this.formData.value.trangThai == STATUS.BAN_HANH) {
      return true
    } else {
      return false;
    }
  }

  async preview() {
    if (this.loaiVthh.startsWith('02')) {
      this.previewName = 'qd_giao_nhiem_vu_nhap_hang_vt'
    } else {
      this.previewName = 'qd_giao_nhiem_vu_nhap_hang_lt'
    }
    let body = this.formData.value;
    this.reportTemplate.fileName = this.previewName + '.docx';
    body.reportTemplateRequest = this.reportTemplate;
    await this.service.preview(body).then(async s => {
      this.pdfSrc = PREVIEW.PATH_PDF + s.data.pdfSrc;
      this.printSrc = s.data.pdfSrc;
      this.wordSrc = PREVIEW.PATH_WORD + s.data.wordSrc;
      this.showDlgPreview = true;
    });
  }

}
