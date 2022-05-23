import { cloneDeep } from 'lodash';
import { DetailQuyetDinhNhapXuat } from './../../../../../../models/QuyetDinhNhapXuat';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogQuyetDinhGiaoChiTieuComponent } from 'src/app/components/dialog/dialog-quyet-dinh-giao-chi-tieu/dialog-quyet-dinh-giao-chi-tieu.component';
import { DATEPICKER_CONFIG, LEVEL_USER } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { QuyetDinhNhapXuat } from 'src/app/models/QuyetDinhNhapXuat';
import { DonviService } from 'src/app/services/donvi.service';
import { Globals } from 'src/app/shared/globals';
import { UserService } from 'src/app/services/user.service';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DialogCanCuHopDongComponent } from 'src/app/components/dialog/dialog-can-cu-hop-dong/dialog-can-cu-hop-dong.component';
import dayjs from 'dayjs';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/quyetDinhGiaoNhapHang.service';
import { UploadFileService } from 'src/app/services/uploaFile.service';
import { FileDinhKem } from 'src/app/models/FileDinhKem';
import { GAO, MUOI, NHAP_MAIN_ROUTE, NHAP_THEO_KE_HOACH, NHAP_THEO_PHUONG_THUC_DAU_THAU, THOC } from 'src/app/pages/nhap/nhap.constant';

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
    this.userInfo = this.userService.getUserLogin();
    this.routerUrl = this.router.url;
    this.id = +this.activatedRoute.snapshot.paramMap.get('id');
    this.type = this.activatedRoute.snapshot.paramMap.get('type');
    this.initForm();
    this.loadDonVi("chi-cuc");
    this.loadDonVi("all");
    this.loadDanhMucHang();
    this.newObjectQdNhapXuat();
  }

  redirectToDanhSachDauThau() {
    this.router.navigate([`nhap/dau-thau/danh-sach-dau-thau/${this.type}`]);
  }

  initForm() {
    this.formData = this.fb.group({
      soQdinh: [null, [Validators.required]],
      ngayQdinh: ['', [Validators.required, this.dateValidator]],
      canCu: [null, [Validators.required]],
      veViec: [null],
      donVi: [null],
      maDonVi: [null],
      ghiChu: [null],
    });
  }

  dateValidator = (control: FormControl): { [s: string]: boolean } => {
    if (control.value && !moment(control.value, 'DD/MM/YYYY', true).isValid()) {
      return { invalid: true };
    }
    return {};
  };

  openDialogQuyetDinhGiaoChiTieu() {
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
          canCu: data.tenHdong,
        });
      }
    });
  }

  deleteTaiLieuDinhKemTag(data: any) {
    this.taiLieuDinhKemList = this.taiLieuDinhKemList.filter(
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
  save() {
    this.quyetDinhNhapXuat.soQd = this.formData.get('soQdinh').value;
    this.quyetDinhNhapXuat.loaiQd = "00";
    this.quyetDinhNhapXuat.ngayKy = dayjs(this.formData.get('ngayQdinh').value).format('YYYY-MM-DD');
    this.quyetDinhNhapXuat.soHd = this.formData.get('canCu').value;
    this.quyetDinhNhapXuat.veViec = this.formData.get('veViec').value;
    this.quyetDinhNhapXuat.maDvi = this.formData.get('maDonVi').value;
    this.quyetDinhNhapXuat.ghiChu = this.formData.get('ghiChu').value?.trim();
    this.quyetDinhNhapXuat.fileDinhKems = this.taiLieuDinhKemList;
    this.quyetDinhNhapXuat.detail = cloneDeep(this.dsQuyetDinhNhapXuatDetailClone);
    console.log("this.quyetDinhNhapXuat: ", this.quyetDinhNhapXuat);
    if (this.quyetDinhNhapXuat.id > 0) {
      this.quyetDinhNhapXuatService
        .sua(this.quyetDinhNhapXuat)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            console.log("ssssss sua");

            // if (isGuiDuyet) {
            //   let body = {
            //     id: res.data.id,
            //     lyDoTuChoi: null,
            //     trangThai: this.globals.prop.DU_THAO_TRINH_DUYET,
            //   };
            //   this.chiTieuKeHoachNamService.updateStatus(body);
            //   if (res.msg == MESSAGE.SUCCESS) {
            //     this.notification.success(
            //       MESSAGE.SUCCESS,
            //       MESSAGE.UPDATE_SUCCESS,
            //     );
            //     this.redirectChiTieuKeHoachNam();
            //   } else {
            //     this.notification.error(MESSAGE.ERROR, res.msg);
            //   }
            // } else {
            //   this.notification.success(
            //     MESSAGE.SUCCESS,
            //     MESSAGE.UPDATE_SUCCESS,
            //   );
            //   // this.redirectChiTieuKeHoachNam();
            // }
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
            console.log("ssssss them");

            // if (isGuiDuyet) {
            //   let body = {
            //     id: res.data.id,
            //     lyDoTuChoi: null,
            //     trangThai: this.globals.prop.LANH_DAO_DUYET,
            //   };
            //   this.chiTieuKeHoachNamService.updateStatus(body);
            //   if (res.msg == MESSAGE.SUCCESS) {
            //     this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
            //     this.redirectChiTieuKeHoachNam();
            //   } else {
            //     this.notification.error(MESSAGE.ERROR, res.msg);
            //   }
            // } else {
            //   this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
            //   // this.redirectChiTieuKeHoachNam();
            // }
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
}
