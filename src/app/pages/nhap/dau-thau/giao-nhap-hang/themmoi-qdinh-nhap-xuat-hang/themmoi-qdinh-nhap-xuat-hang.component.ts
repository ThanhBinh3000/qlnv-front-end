import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder, FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { differenceInCalendarDays } from 'date-fns';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { DisabledTimeFn } from 'ng-zorro-antd/date-picker';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { isEmpty } from 'rxjs/operators';
import { DialogCanCuHopDongComponent } from 'src/app/components/dialog/dialog-can-cu-hop-dong/dialog-can-cu-hop-dong.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { DATEPICKER_CONFIG, LEVEL_USER } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { FileDinhKem } from 'src/app/models/FileDinhKem';
import { DetailQuyetDinhNhapXuat, QuyetDinhNhapXuat } from 'src/app/models/QuyetDinhNhapXuat';
import { UserLogin } from 'src/app/models/userlogin';
import { ItemNhan } from 'src/app/pages/quan-ly-ke-hoach-cap-von-phi-hang/quan-ly-cap-von-mua-ban-tt-tien-hang-dtqg/ghi-nhan-von-tai-dvct-tai-tong-cuc/ghi-nhan-von-tai-dvct-tai-tong-cuc.component';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DonviService } from 'src/app/services/donvi.service';
import { HelperService } from 'src/app/services/helper.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/quyetDinhGiaoNhapHang.service';
import { ThongTinHopDongService } from 'src/app/services/thongTinHopDong.service';
import { UploadFileService } from 'src/app/services/uploaFile.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { STATUS } from "../../../../../constants/status";
@Component({
  selector: 'app-themmoi-qdinh-nhap-xuat-hang',
  templateUrl: './themmoi-qdinh-nhap-xuat-hang.component.html',
  styleUrls: ['./themmoi-qdinh-nhap-xuat-hang.component.scss'],
})
export class ThemmoiQdinhNhapXuatHangComponent implements OnInit {
  @Input() id: number;
  @Input() typeVthh: string;
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

  dataTable: any[] = [];

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
    private quyetDinhNhapXuatService: QuyetDinhGiaoNhapHangService,
    private uploadFileService: UploadFileService,
    private thongTinHopDongSercive: ThongTinHopDongService,
    private helperService: HelperService,
  ) {
    this.formData = this.fb.group({
      id: [''],
      soQd: ['', [Validators.required]],
      ngayQdinh: ['', [Validators.required]],
      canCu: ['', [Validators.required]],
      trichYeu: [],
      namNhap: [dayjs().get('year')],
      tenDvi: [''],
      maDvi: [''],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      loaiVthh: [''],
      lyDoTuChoi: ['']
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
    this.spinner.hide();
  }

  initForm() {
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI,
      maDvi: this.userInfo.MA_DVI,
      loaiVthh: this.typeVthh
    });
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
      nzComponentParams: {
        dataVthh: this.typeVthh
      },
    });
    modalQD.afterClose.subscribe((hopDongs) => {
      if (hopDongs) {
        this.hopDongIds = [];
        this.dataTable = [];
        let canCuHd = '';
        hopDongs.forEach(async (hd, i) => {
          this.convertDataHopDongToDataDetail(hd);
          canCuHd += hd.soHd
          if (i < hopDongs.length - 1) {
            canCuHd += ' - '
          };
          this.hopDongIds.push(hd.id);
        });
        this.formData.patchValue({
          canCu: canCuHd,
        });
      }
    });

  }

  convertDataHopDongToDataDetail(hopDong) {
    hopDong.hhDdiemNhapKhoList.forEach(async (item) => {
      let dataDetail = {
        maDvi: item.maDvi,
        tenDvi: item.tenDvi,
        loaiVthh: hopDong.loaiVthh,
        tenLoaiVthh: hopDong.tenVthh,
        cloaiVthh: hopDong.cloaiVthh,
        tenCloaiVthh: hopDong.tenCloaiVthh,
        donViTinh: hopDong.donViTinh,
        soLuong: item.soLuong,
        tgianNkho: hopDong.tgianNkho
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
  // newObjectQdNhapXuat() {
  //   this.quyetDinhNhapXuatDetailCreate = new DetailQuyetDinhNhapXuat();
  //   if (this.routerUrl.includes("thoc")) {
  //     this.quyetDinhNhapXuatDetailCreate.maVthh = "010101";
  //     this.quyetDinhNhapXuatDetailCreate.tenVthh = "Thóc";
  //     this.quyetDinhNhapXuatDetailCreate.donViTinh = "Tấn";
  //   } else if (this.routerUrl.includes("gao")) {
  //     this.quyetDinhNhapXuatDetailCreate.maVthh = "010103";
  //     this.quyetDinhNhapXuatDetailCreate.tenVthh = "Gạo";
  //     this.quyetDinhNhapXuatDetailCreate.donViTinh = "Tấn";
  //   } else if (this.routerUrl.includes("muoi")) {
  //     this.quyetDinhNhapXuatDetailCreate.maVthh = "04";
  //     this.quyetDinhNhapXuatDetailCreate.tenVthh = "Muối";
  //     this.quyetDinhNhapXuatDetailCreate.donViTinh = "Tấn";
  //   }
  // }

  // themmoi() {
  //   if (!this.isAddQdNhapXuat) {
  //     return;
  //   }
  //   const quyetDinhNhapXuatTemp = new DetailQuyetDinhNhapXuat();
  //   quyetDinhNhapXuatTemp.maDvi = this.quyetDinhNhapXuatDetailCreate.maDvi;
  //   quyetDinhNhapXuatTemp.tenDonVi = this.quyetDinhNhapXuatDetailCreate.tenDonVi;
  //   quyetDinhNhapXuatTemp.maVthh = this.quyetDinhNhapXuatDetailCreate.maVthh;
  //   quyetDinhNhapXuatTemp.tenVthh = this.quyetDinhNhapXuatDetailCreate.tenVthh;
  //   quyetDinhNhapXuatTemp.donViTinh = this.quyetDinhNhapXuatDetailCreate.donViTinh;
  //   quyetDinhNhapXuatTemp.soLuong = this.quyetDinhNhapXuatDetailCreate.soLuong ?? 0;
  //   quyetDinhNhapXuatTemp.thoiGianNhapKhoMuonNhat = this.quyetDinhNhapXuatDetailCreate.thoiGianNhapKhoMuonNhat ?? dayjs().toString();
  //   this.checkDataExistQdNhapXuat(quyetDinhNhapXuatTemp);
  //   this.isAddQdNhapXuat = false;
  // }

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

  selectDonVi(qdNhapXuat) {
    this.isAddQdNhapXuat = true;
    this.quyetDinhNhapXuatDetailCreate.maDvi = qdNhapXuat.maDvi;
    this.quyetDinhNhapXuatDetailCreate.tenDonVi = qdNhapXuat.tenDvi;
  }

  loadDanhMucHang() {
    this.danhMucService.loadDanhMucHangHoa().subscribe((res) => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.optionsFullHangHoa = res.data;
        this.optionsHangHoa = this.optionsFullHangHoa;
      }
    });
  }

  async save(isGuiDuyet?: boolean) {
    this.helperService.markFormGroupTouched(this.formData);
    if (!this.formData.valid) {
      return;
    }
    this.spinner.show();
    let body = this.formData.value;
    body.soQd = this.formData.get('soQd').value + this.maQdSuffix;
    body.detailList = this.dataTable;
    body.fileDinhKems = this.listFileDinhKem;
    body.hopDongIds = this.hopDongIds;
    let res;
    if (this.formData.get('id').value > 0) {
      res = await this.quyetDinhNhapXuatService.update(body);
    } else {
      res = await this.quyetDinhNhapXuatService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isGuiDuyet) {
        this.spinner.hide();
        this.id = res.data.id;
        this.pheDuyet();
      } else {
        if (this.formData.get('id').value) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
          this.redirectQdNhapXuat();
        } else {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
          this.redirectQdNhapXuat();
        }
        this.spinner.hide();
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
      this.spinner.hide();
    }

    // this.quyetDinhNhapXuat.soQd = this.formData.get('soQdinh').value + '/QĐ-CDTVT';
    // this.quyetDinhNhapXuat.namNhap = dayjs().get('year');
    // this.quyetDinhNhapXuat.ngayQdinh = this.formData.get('ngayQdinh').value ? dayjs(this.formData.get('ngayQdinh').value).format('YYYY-MM-DD') : '';
    // this.quyetDinhNhapXuat.soHd = this.formData.get('canCu').value;
    // this.quyetDinhNhapXuat.veViec = this.formData.get('veViec').value;
    // this.quyetDinhNhapXuat.trichYeu = this.formData.get('trichYeu').value;
    // this.quyetDinhNhapXuat.maDvi = this.formData.get('maDonVi').value;
    // this.quyetDinhNhapXuat.ghiChu = this.formData.get('ghiChu').value?.trim();
    // this.quyetDinhNhapXuat.loaiVthh = this.typeVthh != null ? this.typeVthh : '0101';

    // if (this.quyetDinhNhapXuat.id > 0) {
    //   this.quyetDinhNhapXuat.detail = this.dsQuyetDinhNhapXuatDetailClone;
    //   const quyetDinhNhapXuatInput = new QuyetDinhNhapXuat();
    //   quyetDinhNhapXuatInput.detail = this.quyetDinhNhapXuat.detail;
    //   quyetDinhNhapXuatInput.fileDinhKems = this.listFileDinhKem;
    //   quyetDinhNhapXuatInput.ghiChu = this.quyetDinhNhapXuat.ghiChu;
    //   quyetDinhNhapXuatInput.id = this.quyetDinhNhapXuat.id;
    //   quyetDinhNhapXuatInput.soQd = this.quyetDinhNhapXuat.soQd;
    //   quyetDinhNhapXuatInput.loaiQd = this.quyetDinhNhapXuat.loaiQd;
    //   quyetDinhNhapXuatInput.ngayQdinh = this.quyetDinhNhapXuat.ngayQdinh;
    //   quyetDinhNhapXuatInput.soHd = this.quyetDinhNhapXuat.soHd;
    //   quyetDinhNhapXuatInput.namNhap = this.quyetDinhNhapXuat.namNhap;
    //   quyetDinhNhapXuatInput.veViec = this.quyetDinhNhapXuat.veViec;
    //   quyetDinhNhapXuatInput.loaiVthh = this.quyetDinhNhapXuat.loaiVthh;
    //   quyetDinhNhapXuatInput.trichYeu = this.quyetDinhNhapXuat.trichYeu;
    //   quyetDinhNhapXuatInput.maDvi = this.quyetDinhNhapXuat.maDvi;
    //   quyetDinhNhapXuatInput.hopDongIds = this.quyetDinhNhapXuat.hopDongIds;
    //   this.quyetDinhNhapXuatService
    //     .sua(quyetDinhNhapXuatInput)
    //     .then((res) => {
    //       if (res.msg == MESSAGE.SUCCESS) {
    //         if (isGuiDuyet) {

    //         } else {
    //           this.notification.success(
    //             MESSAGE.SUCCESS,
    //             MESSAGE.UPDATE_SUCCESS,
    //           );
    //           this.redirectQdNhapXuat();
    //         }
    //       } else {
    //         this.notification.error(MESSAGE.ERROR, res.msg);
    //       }
    //     })
    //     .catch((e) => {
    //       console.error('error: ', e);
    //       this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    //     })
    //     .finally(() => {
    //       this.spinner.hide();
    //     });
    // } else {
    //   this.hopDongList.forEach(hd => {
    //     hd.hhDdiemNhapKhoList.forEach(element => {
    //       let detailQuyetDinhNhapXuat = new DetailQuyetDinhNhapXuat();
    //       detailQuyetDinhNhapXuat.denNgayThien = hd.denNgayThien;
    //       detailQuyetDinhNhapXuat.donViTinh = hd.donViTinh;
    //       detailQuyetDinhNhapXuat.loaiNx = hd.loaiNx;
    //       detailQuyetDinhNhapXuat.maDvi = element.maDvi;
    //       detailQuyetDinhNhapXuat.maVthh = hd.loaiVthh;
    //       detailQuyetDinhNhapXuat.soLuong = element.soLuong;
    //       detailQuyetDinhNhapXuat.tenVthh = hd.tenVthh;
    //       detailQuyetDinhNhapXuat.tuNgayThien = hd.tuNgayThien;
    //       this.dsQuyetDinhNhapXuatDetailClone.push(detailQuyetDinhNhapXuat);
    //     });
    //   })
    //   this.quyetDinhNhapXuat.detail = this.dsQuyetDinhNhapXuatDetailClone;
    //   this.quyetDinhNhapXuatService
    //     .them(this.quyetDinhNhapXuat)
    //     .then((res) => {
    //       if (res.msg == MESSAGE.SUCCESS) {
    //         if (isGuiDuyet) {

    //         } else {
    //           this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
    //           this.redirectQdNhapXuat();
    //         }
    //       } else {
    //         this.notification.error(MESSAGE.ERROR, res.msg);
    //       }
    //     })
    //     .catch((e) => {
    //       console.error('error: ', e);
    //       this.notification.error(
    //         MESSAGE.ERROR,
    //         e.error.errors[0].defaultMessage,
    //       );
    //     })
    //     .finally(() => {
    //       this.spinner.hide();
    //     });
    // }
  }

  redirectQdNhapXuat() {
    this.showListEvent.emit();
  }

  async loadThongTinQdNhapXuatHang(id: number) {
    await this.quyetDinhNhapXuatService
      .getDetail(id)
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          const data = res.data;
          this.formData.patchValue({
            id: data.id,
            namNhap: data.namNhap,
            soQd: data.soQd?.split('/')[0],
            tenDvi: data.tenDvi,
            maDvi: data.maDvi,
            ngayQdinh: data.ngayQdinh,
            trichYeu: data.trichYeu,
            loaiVthh: data.loaiVthh,
            trangThai: data.trangThai,
            tenTrangThai: data.tenTrangThai,
            lyDoTuChoi: data.ldoTuchoi
          });
          this.dataTable = data.dtlList;
          this.hopDongIds = data.hopDongIds;
          this.listFileDinhKem = data.children2;
          if (data.hopDongList) {
            let canCuHd = '';
            data.hopDongList.forEach((hd, i) => {
              canCuHd += hd.soHd
              if (i < data.hopDongList.length - 1) {
                canCuHd += ' - '
              }
            });
            this.formData.patchValue({
              canCu: canCuHd,
            });
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      })
  }

  pheDuyet() {
    let trangThai = ''
    let mesg = ''
    if (this.typeVthh != '02') {
      trangThai = STATUS.BAN_HANH;
      mesg = 'Bạn có muốn ban hành ?'
    } else {
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
            await this.quyetDinhNhapXuatService.approve(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
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
            await this.quyetDinhNhapXuatService.approve(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
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
}
