import { Component, OnInit } from '@angular/core';
import {
  FormBuilder, FormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { differenceInCalendarDays } from 'date-fns';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { DisabledTimeFn } from 'ng-zorro-antd/date-picker';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogCanCuHopDongComponent } from 'src/app/components/dialog/dialog-can-cu-hop-dong/dialog-can-cu-hop-dong.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { DATEPICKER_CONFIG, LEVEL_USER } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { FileDinhKem } from 'src/app/models/FileDinhKem';
import { QuyetDinhNhapXuat } from 'src/app/models/QuyetDinhNhapXuat';
import { UserLogin } from 'src/app/models/userlogin';
import { GAO, MUOI, NHAP_MAIN_ROUTE, NHAP_THEO_KE_HOACH, NHAP_THEO_PHUONG_THUC_DAU_THAU, THOC } from 'src/app/pages/nhap/nhap.constant';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DonviService } from 'src/app/services/donvi.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/quyetDinhGiaoNhapHang.service';
import { UploadFileService } from 'src/app/services/uploaFile.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { DetailQuyetDinhNhapXuat } from './../../../../../../models/QuyetDinhNhapXuat';
@Component({
  selector: 'app-themmoi-qdinh-nhap-xuat-hang',
  templateUrl: './themmoi-qdinh-nhap-xuat-hang.component.html',
  styleUrls: ['./themmoi-qdinh-nhap-xuat-hang.component.scss'],
})
export class ThemmoiQdinhNhapXuatHangComponent implements OnInit {
  errorInputRequired: string = 'Dữ liệu không được để trống.';
  formData: FormGroup;
  chiTietQDGiaoNhapXuatHang: any = [];
  taiLieuDinhKemList: any[] = [];
  datePickerConfig = DATEPICKER_CONFIG;
  id: number;
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
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private modal: NzModalService,
    private donViService: DonviService,
    private notification: NzNotificationService,
    private spinner: NgxSpinnerService,
    public globals: Globals,
    private userService: UserService,
    private danhMucService: DanhMucService,
    private quyetDinhNhapXuatService: QuyetDinhGiaoNhapHangService,
    private uploadFileService: UploadFileService,


  ) { }

  ngOnInit(): void {
    this.getTitleVthh();
    this.userInfo = this.userService.getUserLogin();
    this.routerUrl = this.router.url;
    if (this.routerUrl.includes('/xem-chi-tiet/')) {
      this.isChiTiet = true;
    } else {
      this.isChiTiet = false;
    }
    this.id = +this.activatedRoute.snapshot.paramMap.get('id');
    this.type = this.activatedRoute.snapshot.paramMap.get('type');
    this.initForm();
    if (this.id > 0) {
      this.loadThongTinQdNhapXuatHang(this.id);
    }
    this.loadDonVi("chi-cuc");
    this.loadDonVi("all");
    this.loadDanhMucHang();
    this.newObjectQdNhapXuat();
  }

  getTitleVthh() {
    if (this.router.url.indexOf("/thoc/") != -1) {
      this.loaiStr = "Thóc";
      this.loaiVthh = "01";
      this.maVthh = "0101";
      this.idVthh = 2;
      this.routerVthh = 'thoc';
    } else if (this.router.url.indexOf("/gao/") != -1) {
      this.loaiStr = "Gạo";
      this.loaiVthh = "00";
      this.maVthh = "0102";
      this.idVthh = 6;
      this.routerVthh = 'gao';
    } else if (this.router.url.indexOf("/muoi/") != -1) {
      this.loaiStr = "Muối";
      this.loaiVthh = "02";
      this.maVthh = "04";
      this.idVthh = 78;
      this.routerVthh = 'muoi';
    } else if (this.router.url.indexOf("/vat-tu/") != -1) {
      this.loaiStr = "Vật tư";
      this.loaiVthh = "03";
      this.routerVthh = 'vat-tu';
    }
  }

  redirectToDanhSachDauThau() {
    this.router.navigate([`nhap/dau-thau/danh-sach-dau-thau/${this.type}`]);
  }

  initForm() {
    this.formData = this.fb.group({
      soQdinh: [this.quyetDinhNhapXuat ? this.quyetDinhNhapXuat.soQd : null, [Validators.required]],
      // ngayQdinh: [this.quyetDinhNhapXuat ? this.quyetDinhNhapXuat.ngayKy : null, [Validators.required]],
      ngayQdinh: [dayjs(), [Validators.required]],
      canCu: [this.quyetDinhNhapXuat ? this.quyetDinhNhapXuat.soHd : null, [Validators.required]],
      veViec: [this.quyetDinhNhapXuat ? this.quyetDinhNhapXuat.veViec : null],
      donVi: [this.quyetDinhNhapXuat ? this.quyetDinhNhapXuat.tenDonVi : null],
      maDonVi: [this.quyetDinhNhapXuat ? this.quyetDinhNhapXuat.maDvi : null],
      ghiChu: [this.quyetDinhNhapXuat ? this.quyetDinhNhapXuat.ghiChu : null],
      hopDongId: [this.quyetDinhNhapXuat ? this.quyetDinhNhapXuat.hopDongId : null],
    });
  }

  // dateValidator = (control: FormControl): { [s: string]: boolean } => {
  //   if (control.value && !moment(control.value, 'DD/MM/YYYY', true).isValid()) {
  //     return { invalid: true };
  //   }
  //   return {};
  // };

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
    modalQD.afterClose.subscribe((data) => {
      if (data) {
        this.formData.patchValue({
          canCu: data.soHd,
          hopDongId: data.id
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

  selectHangHoa(option) { }

  changeMaHangHoa() { }

  onInputDonViTinh(e: Event): void {
    // const value = (e.target as HTMLInputElement).value;
    // if (!value || value.indexOf('@') >= 0) {
    //   this.optionsDonVi = [];
    // } else {
    //   this.optionsDonVi = this.optionsFullDonVi.filter(
    //     (x) => x.labelDonVi.toLowerCase().indexOf(value.toLowerCase()) != -1,
    //   );
    // }
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
  save(isGuiDuyet?: boolean) {
    if (!this.formData.valid) {
      return;
    }
    this.spinner.show();
    this.quyetDinhNhapXuat.soQd = this.formData.get('soQdinh').value;
    this.quyetDinhNhapXuat.loaiQd = "00";
    this.quyetDinhNhapXuat.ngayKy = this.formData.get('ngayQdinh').value ? dayjs(this.formData.get('ngayQdinh').value).format('YYYY-MM-DD') : dayjs().toString();
    this.quyetDinhNhapXuat.soHd = this.formData.get('canCu').value;
    this.quyetDinhNhapXuat.veViec = this.formData.get('veViec').value;
    this.quyetDinhNhapXuat.maDvi = this.formData.get('maDonVi').value;
    this.quyetDinhNhapXuat.ghiChu = this.formData.get('ghiChu').value?.trim();
    this.quyetDinhNhapXuat.hopDongId = this.formData.get('hopDongId').value;
    this.quyetDinhNhapXuat.detail = cloneDeep(this.dsQuyetDinhNhapXuatDetailClone);
    if (this.quyetDinhNhapXuat.id > 0) {
      const quyetDinhNhapXuatInput = new QuyetDinhNhapXuat();
      quyetDinhNhapXuatInput.detail = this.quyetDinhNhapXuat.detail;
      quyetDinhNhapXuatInput.fileDinhKems = this.quyetDinhNhapXuat.fileDinhKems;
      quyetDinhNhapXuatInput.ghiChu = this.quyetDinhNhapXuat.ghiChu;
      quyetDinhNhapXuatInput.id = this.quyetDinhNhapXuat.id;
      quyetDinhNhapXuatInput.soQd = this.quyetDinhNhapXuat.soQd;
      quyetDinhNhapXuatInput.loaiQd = this.quyetDinhNhapXuat.loaiQd;
      quyetDinhNhapXuatInput.ngayKy = this.quyetDinhNhapXuat.ngayKy;
      quyetDinhNhapXuatInput.soHd = this.quyetDinhNhapXuat.soHd;
      quyetDinhNhapXuatInput.veViec = this.quyetDinhNhapXuat.veViec;
      quyetDinhNhapXuatInput.maDvi = this.quyetDinhNhapXuat.maDvi;
      this.quyetDinhNhapXuatService
        .sua(quyetDinhNhapXuatInput)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            if (isGuiDuyet) {
              let body = {
                id: res.data.id,
                lyDoTuChoi: null,
                trangThai: this.globals.prop.DU_THAO_TRINH_DUYET,
              };
              this.quyetDinhNhapXuatService.updateStatus(body);
              if (res.msg == MESSAGE.SUCCESS) {
                this.notification.success(
                  MESSAGE.SUCCESS,
                  MESSAGE.UPDATE_SUCCESS,
                );
                this.redirectQdNhapXuat();
              } else {
                this.notification.error(MESSAGE.ERROR, res.msg);
              }
            } else {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.UPDATE_SUCCESS,
              );
              this.redirectQdNhapXuat();
            }
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        })
        .catch((e) => {
          console.error('error: ', e);
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        })
        .finally(() => {
          this.spinner.hide();
        });
    } else {
      this.quyetDinhNhapXuatService
        .them(this.quyetDinhNhapXuat)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            if (isGuiDuyet) {
              let body = {
                id: res.data.id,
                lyDoTuChoi: null,
                trangThai: this.globals.prop.LANH_DAO_DUYET,
              };
              this.quyetDinhNhapXuatService.updateStatus(body);
              if (res.msg == MESSAGE.SUCCESS) {
                this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
                this.redirectQdNhapXuat();
              } else {
                this.notification.error(MESSAGE.ERROR, res.msg);
              }
            } else {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
              this.redirectQdNhapXuat();
            }
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        })
        .catch((e) => {
          console.error('error: ', e);
          this.notification.error(
            MESSAGE.ERROR,
            e.error.errors[0].defaultMessage,
          );
        })
        .finally(() => {
          this.spinner.hide();
        });
    }
  }
  redirectQdNhapXuat() {
    if (this.routerUrl.includes("thoc")) {
      this.router.navigate([`/${NHAP_MAIN_ROUTE}/${NHAP_THEO_KE_HOACH}/${NHAP_THEO_PHUONG_THUC_DAU_THAU}/${THOC}`]);
    } else if (this.routerUrl.includes("gao")) {
      this.router.navigate([`/${NHAP_MAIN_ROUTE}/${NHAP_THEO_KE_HOACH}/${NHAP_THEO_PHUONG_THUC_DAU_THAU}/${GAO}`]);
    } else if (this.routerUrl.includes("muoi")) {
      this.router.navigate([`/${NHAP_MAIN_ROUTE}/${NHAP_THEO_KE_HOACH}/${NHAP_THEO_PHUONG_THUC_DAU_THAU}/${MUOI}`]);
    }
  }
  loadThongTinQdNhapXuatHang(id: number) {
    this.quyetDinhNhapXuatService
      .chiTiet(id)
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
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn hủy bỏ các thao tác đang làm?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.redirectQdNhapXuat();
      },
    });
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
}
