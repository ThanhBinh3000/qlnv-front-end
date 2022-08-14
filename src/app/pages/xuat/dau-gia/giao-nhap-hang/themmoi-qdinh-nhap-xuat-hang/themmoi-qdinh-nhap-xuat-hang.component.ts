import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder, FormGroup
} from '@angular/forms';
import { Router } from '@angular/router';
import { differenceInCalendarDays } from 'date-fns';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { DisabledTimeFn } from 'ng-zorro-antd/date-picker';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogCanCuHopDongComponent } from 'src/app/components/dialog/dialog-can-cu-hop-dong/dialog-can-cu-hop-dong.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { DATEPICKER_CONFIG, LEVEL_USER, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { FileDinhKem } from 'src/app/models/FileDinhKem';
import { Cts, QuyetDinhGiaoNhiemVuXuatHang } from 'src/app/models/QuyetDinhGiaoNhiemVuXuatHang';
import { DetailQuyetDinhNhapXuat, QuyetDinhNhapXuat } from 'src/app/models/QuyetDinhNhapXuat';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DonviService } from 'src/app/services/donvi.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/quyetDinhGiaoNhapHang.service';
import { QuyetDinhGiaoNhiemVuXuatHangService } from 'src/app/services/quyetDinhGiaoNhiemVuXuatHang.service';
import { UploadFileService } from 'src/app/services/uploaFile.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
@Component({
  selector: 'app-themmoi-qdinh-nhap-xuat-hang',
  templateUrl: './themmoi-qdinh-nhap-xuat-hang.component.html',
  styleUrls: ['./themmoi-qdinh-nhap-xuat-hang.component.scss'],
})
export class ThemmoiQdinhNhapXuatHangComponent implements OnInit {
  @Input() id: number;
  @Input() typeVthh: string;
  @Input() isView: boolean;
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

  loaiVthh: string;
  loaiStr: string;
  maVthh: string;
  idVthh: number;
  routerVthh: string;
  today = new Date();
  listNam: any[] = [];

  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  qdGiaoNhiemVuXuatHang: QuyetDinhGiaoNhiemVuXuatHang = new QuyetDinhGiaoNhiemVuXuatHang();
  chiTietQds: Array<Cts>;
  hopDongList: any[] = [];
  listFileDinhKem: Array<FileDinhKem> = [];
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private modal: NzModalService,
    private donViService: DonviService,
    private notification: NzNotificationService,
    private spinner: NgxSpinnerService,
    public globals: Globals,
    private userService: UserService,
    private danhMucService: DanhMucService,
    private quyetDinhNhapXuatService: QuyetDinhGiaoNhiemVuXuatHangService,
    private uploadFileService: UploadFileService,
  ) { }

  ngOnInit(): void {
    let dayNow = dayjs().get('year');
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayNow - i,
        text: dayNow - i,
      });
    }
    this.userInfo = this.userService.getUserLogin();
    this.routerUrl = this.router.url;
    this.initForm();
    if (this.id > 0) {
      this.loadThongTinQdNhapXuatHang(this.id);
    }
    this.formData.patchValue({
      donVi: this.userInfo.TEN_DVI,
      maDonVi: this.userInfo.MA_DVI,
    });
    this.newObjectQdNhapXuat();
  }

  initForm() {
    this.formData = this.fb.group({
      soQD: [
        {
          value: this.qdGiaoNhiemVuXuatHang
            ? this.qdGiaoNhiemVuXuatHang.soQuyetDinh
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],
      soHopDong: [
        {
          value: this.qdGiaoNhiemVuXuatHang
            ? this.qdGiaoNhiemVuXuatHang.soHopDong
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],
      donVi: [
        {
          value: this.qdGiaoNhiemVuXuatHang
            ? this.qdGiaoNhiemVuXuatHang.donVi
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],
      maDonVi: [
        {
          value: this.qdGiaoNhiemVuXuatHang
            ? this.qdGiaoNhiemVuXuatHang.maDonVi
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],
      ngayQuyetDinh: [
        {
          value: this.qdGiaoNhiemVuXuatHang
            ? this.qdGiaoNhiemVuXuatHang.ngayQuyetDinh
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],
      trichYeu: [
        {
          value: this.qdGiaoNhiemVuXuatHang
            ? this.qdGiaoNhiemVuXuatHang.trichYeu
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],
    });
  }

  async changePageIndex(event) {
    this.spinner.show();
    try {
      this.page = event;

      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async changePageSize(event) {
    this.spinner.show();
    try {
      this.pageSize = event;

      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  openDialogQuyetDinhGiaoChiTieu() {
    if (this.isChiTiet) {
      return;
    }
    const modalQD = this.modal.create({
      nzTitle: 'Thông tin hợp đồng',
      nzContent: DialogCanCuHopDongComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalQD.afterClose.subscribe((hopDongs) => {
      if (hopDongs) {
        let canCuHd = '';
        this.qdGiaoNhiemVuXuatHang.hopDongIds = [];
        // if (!this.quyetDinhNhapXuat.id) {
        this.hopDongList = hopDongs;
        // }
        hopDongs.forEach(async (hd, i) => {
          canCuHd += hd.soHd
          if (i < hopDongs.length - 1) {
            canCuHd += ' , '
          };
          this.qdGiaoNhiemVuXuatHang.hopDongIds.push(hd.id);
        });

        this.formData.patchValue({
          soHopDong: canCuHd,
        });

      }
    });
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
  newObjectQdNhapXuat() {
    this.quyetDinhNhapXuatDetailCreate = new DetailQuyetDinhNhapXuat();
    if (this.routerUrl.includes("thoc")) {
      this.quyetDinhNhapXuatDetailCreate.maVthh = "010101";
      this.quyetDinhNhapXuatDetailCreate.tenVthh = "Thóc";
      this.quyetDinhNhapXuatDetailCreate.donViTinh = "Tấn";
    } else if (this.routerUrl.includes("gao")) {
      this.quyetDinhNhapXuatDetailCreate.maVthh = "010103";
      this.quyetDinhNhapXuatDetailCreate.tenVthh = "Gạo";
      this.quyetDinhNhapXuatDetailCreate.donViTinh = "Tấn";
    } else if (this.routerUrl.includes("muoi")) {
      this.quyetDinhNhapXuatDetailCreate.maVthh = "04";
      this.quyetDinhNhapXuatDetailCreate.tenVthh = "Muối";
      this.quyetDinhNhapXuatDetailCreate.donViTinh = "Tấn";
    }
  }

  themmoi() {
    if (!this.isAddQdNhapXuat) {
      return;
    }
    const quyetDinhNhapXuatTemp = new DetailQuyetDinhNhapXuat();
    quyetDinhNhapXuatTemp.maDvi = this.quyetDinhNhapXuatDetailCreate.maDvi;
    quyetDinhNhapXuatTemp.tenDonVi = this.quyetDinhNhapXuatDetailCreate.tenDonVi;
    quyetDinhNhapXuatTemp.maVthh = this.quyetDinhNhapXuatDetailCreate.maVthh;
    quyetDinhNhapXuatTemp.tenVthh = this.quyetDinhNhapXuatDetailCreate.tenVthh;
    quyetDinhNhapXuatTemp.donViTinh = this.quyetDinhNhapXuatDetailCreate.donViTinh;
    quyetDinhNhapXuatTemp.soLuong = this.quyetDinhNhapXuatDetailCreate.soLuong ?? 0;
    quyetDinhNhapXuatTemp.thoiGianNhapKhoMuonNhat = this.quyetDinhNhapXuatDetailCreate.thoiGianNhapKhoMuonNhat ?? dayjs().toString();
    this.checkDataExistQdNhapXuat(quyetDinhNhapXuatTemp);
    this.isAddQdNhapXuat = false;
    this.newObjectQdNhapXuat();
    this.dsQuyetDinhNhapXuatDetailClone = cloneDeep(this.quyetDinhNhapXuat.detail);
    // this.loadData();
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
    this.newObjectQdNhapXuat();
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

  selectDonVi(qdNhapXuat) {
    this.isAddQdNhapXuat = true;
    this.quyetDinhNhapXuatDetailCreate.maDvi = qdNhapXuat.maDvi;
    this.quyetDinhNhapXuatDetailCreate.tenDonVi = qdNhapXuat.tenDvi;
  }

  async loadDonVi(type?: string) {
    try {
      const body = {
        maDvi: this.userInfo.MA_DVI,
      };
      let res;
      switch (type) {
        case "all":
          res = await this.donViService.layTatCaDonVi();
          break;
        case "chi-cuc":
          res = await this.donViService.layDonViCon();
          break;
        default:
          break;
      }
      this.optionsFullDonVi = [];
      if (res.msg == MESSAGE.SUCCESS) {
        if (type === "chi-cuc") {
          for (let i = 0; i < res.data.length; i++) {
            const item = {
              ...res.data[i],
              labelDonVi: res.data[i].maDvi + ' - ' + res.data[i].tenDvi,
            };
            this.optionsFullDonVi.push(item);
          }
          this.optionsDonVi = this.optionsFullDonVi;
        }
        if (this.userInfo.CAP_DVI === LEVEL_USER.CUC && type === "all") {
          for (let i = 0; i < res.data.length; i++) {
            if (this.userInfo.MA_DVI === res.data[i].maDvi) {
              this.quyetDinhNhapXuat.tenDonVi = res.data[i].tenDvi;
              this.formData.patchValue({
                donVi: this.quyetDinhNhapXuat.tenDonVi,
                maDonVi: this.quyetDinhNhapXuat.maDvi,
              });
              break;
            }
          }
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      this.spinner.hide();
    } catch (error) {
      this.spinner.hide();
    }
  }

  loadDanhMucHang() {
    this.danhMucService.loadDanhMucHangHoa().subscribe((res) => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.optionsFullHangHoa = res.data;
        this.optionsHangHoa = this.optionsFullHangHoa;
      }
    });
  }

  onInputHangHoa(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.optionsHangHoa = [];
    } else {
      this.optionsHangHoa = this.optionsFullHangHoa.filter(
        (x) => x.ten.toLowerCase().indexOf(value.toLowerCase()) != -1,
      );
    }
  }
  saveEditQdNhapXuat(i: number): void {
    this.dsQuyetDinhNhapXuatDetailClone[i].isEdit = false;
    Object.assign(
      this.quyetDinhNhapXuat.detail[i],
      this.dsQuyetDinhNhapXuatDetailClone[i],
    );
  }
  cancelEditQdNhapXuat(index: number) {
    this.dsQuyetDinhNhapXuatDetailClone = cloneDeep(this.quyetDinhNhapXuat.detail);
    this.dsQuyetDinhNhapXuatDetailClone[index].isEdit = false;
  }

  async save(isOther: boolean) {
    this.spinner.show();
    try {
      let body = {
        "cts": [],
        "fileDinhKems": this.listFileDinhKem,
        "hopDongIds": this.qdGiaoNhiemVuXuatHang.hopDongIds,
        "id": this.qdGiaoNhiemVuXuatHang.id,
        "loaiVthh": this.typeVthh,
        "ngayQuyetDinh": this.formData.get('ngayQuyetDinh').value ? dayjs(this.formData.get('ngayQuyetDinh').value).format('YYYY-MM-DD') : dayjs().toString(),
        "soQuyetDinh": this.formData.get('soQD').value + this.userInfo.MA_QD,
        "trichYeu": this.formData.get('trichYeu').value,
        "namXuat": dayjs().get('year'),
      }
      if (this.id > 0) {
        let res = await this.quyetDinhNhapXuatService.sua(
          body,
        );
        if (res.msg == MESSAGE.SUCCESS) {
          if (!isOther) {
            this.notification.success(
              MESSAGE.SUCCESS,
              MESSAGE.UPDATE_SUCCESS,
            );
            this.redirectQdNhapXuat();
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      } else {
        let res = await this.quyetDinhNhapXuatService.them(
          body,
        );
        if (res.msg == MESSAGE.SUCCESS) {
          if (!isOther) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
            this.redirectQdNhapXuat();
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





  redirectQdNhapXuat() {
    this.showListEvent.emit();
  }
  loadThongTinQdNhapXuatHang(id: number) {
    this.quyetDinhNhapXuatService
      .loadChiTiet(id)
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          this.quyetDinhNhapXuat = res.data;
          this.quyetDinhNhapXuat.fileDinhKems =
            res.data.children2;
          this.quyetDinhNhapXuat.detail =
            res.data.children;
          this.quyetDinhNhapXuat.detail?.forEach((nhapXuat, i) => {
            nhapXuat.stt = i + 1;
          })
          if (this.quyetDinhNhapXuat?.fileDinhKems?.length > 0) {
            this.quyetDinhNhapXuat.fileDinhKems.forEach((file) => {
              const item = {
                id: file.id,
                text: file.fileName,
              };
              this.taiLieuDinhKemList.push(item);
            });
          }
          this.dsQuyetDinhNhapXuatDetailClone = cloneDeep(
            this.quyetDinhNhapXuat.detail,
          );
          this.initForm();
          this.formData.patchValue({
            soQdinh: this.quyetDinhNhapXuat.soQd?.split('/')[0],
            donVi: this.quyetDinhNhapXuat.tenDvi,
            maDonVi: this.quyetDinhNhapXuat.maDvi,
          })
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      })
  }
  disableBanHanh(): boolean {
    return (
      this.quyetDinhNhapXuat.trangThai === this.globals.prop.DU_THAO ||
      this.id === 0 ||
      this.quyetDinhNhapXuat.trangThai === this.globals.prop.TU_CHOI
    );
  }
  guiDuyet() {
    if (!this.formData.valid) {
      return;
    }
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
          this.save(true);
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
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn duyệt?',
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
            trangThai: this.globals.prop.LANH_DAO_DUYET,
          };
          const res = await this.quyetDinhNhapXuatService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
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
            id: this.id,
            lyDoTuChoi: null,
            trangThai: this.globals.prop.BAN_HANH,
          };
          const res = await this.quyetDinhNhapXuatService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
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
            trangThai: this.globals.prop.TU_CHOI,
          };
          const res = await this.quyetDinhNhapXuatService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TU_CHOI_SUCCESS);
            this.redirectQdNhapXuat();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      }
    });
  }

  huyBo() {
    this.showListEvent.emit();
  }
  disabledDate = (current: Date): boolean =>
    differenceInCalendarDays(current, this.today) > 0;

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
  isDetail(): boolean {
    return (
      this.isViewDetail
    );
  }
  thongTinTrangThai(trangThai: string): string {
    if (
      trangThai === this.globals.prop.DU_THAO ||
      trangThai === this.globals.prop.LANH_DAO_DUYET ||
      trangThai === this.globals.prop.TU_CHOI ||
      trangThai === this.globals.prop.DU_THAO_TRINH_DUYET
    ) {
      return 'du-thao-va-lanh-dao-duyet';
    } else if (trangThai === this.globals.prop.BAN_HANH) {
      return 'da-ban-hanh';
    }
  }


  isDisableField() {
    if (this.qdGiaoNhiemVuXuatHang && (this.qdGiaoNhiemVuXuatHang.trangThai == this.globals.prop.NHAP_CHO_DUYET_TP || this.qdGiaoNhiemVuXuatHang.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC || this.qdGiaoNhiemVuXuatHang.trangThai == this.globals.prop.NHAP_DA_DUYET)) {
      return true;
    }
  }
}
