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
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { DATEPICKER_CONFIG, LEVEL_USER } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { FileDinhKem } from 'src/app/models/FileDinhKem';
import { DetailQuyetDinhNhapXuat, QuyetDinhNhapXuat, ThongTinDiaDiemNhap } from 'src/app/models/QuyetDinhNhapXuat';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DonviService } from 'src/app/services/donvi.service';
import { HelperService } from 'src/app/services/helper.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/qd-giaonv-nh/quyetDinhGiaoNhapHang.service';
import { ThongTinHopDongService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/hop-dong/thongTinHopDong.service';
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

  listHopDong: any[] = [];

  dataTable: any[] = [];

  rowItem: ThongTinDiaDiemNhap = new ThongTinDiaDiemNhap();

  listChiCuc: any[] = [];
  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganKho: any[] = [];
  listNganLo: any[] = [];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private modal: NzModalService,
    private donViService: DonviService,
    private notification: NzNotificationService,
    private spinner: NgxSpinnerService,
    public globals: Globals,
    public userService: UserService,
    private quyetDinhNhapXuatService: QuyetDinhGiaoNhapHangService,
    private uploadFileService: UploadFileService,
    private thongTinHopDongSercive: ThongTinHopDongService,
    private helperService: HelperService,
  ) {
    this.formData = this.fb.group({
      id: [''],
      soQd: ['', [Validators.required]],
      ngayQdinh: ['', [Validators.required]],
      soHd: ['', [Validators.required]],
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
      soLuong: [''],
      donViTinh: [''],
      tgianNkho: [''],
      tenCloaiVthh: [''],
      lyDoTuChoi: [''],
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
    await Promise.all([
      await this.getListHopDong(),
      await this.loadDiemKho()
    ])

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

  async getListHopDong() {
    let body = {
      "loaiVthh": this.typeVthh,
      "trangThai": STATUS.DA_KY,
      "namHd": this.formData.get('namNhap').value,
      "paggingReq": {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0,
      },
    }
    let res = await this.thongTinHopDongSercive.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listHopDong = res.data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  openDialogHopDong() {
    if (this.isChiTiet) {
      return;
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
        dataHeader: ['Số hợp đồng', 'Tên hợp đồng', 'Ngày ký', 'Loại hàng hóa', 'Chủng loại hàng hóa'],
        dataColumn: ['soHd', 'tenHd', 'ngayKy', 'tenLoaiVthh', 'tenCloaiVthh']
      },
    });
    modalQD.afterClose.subscribe((data) => {
      if (data) {
        this.dataTable = [];
        this.formData.patchValue({
          soHd: data.soHd,
          idHd: data.id,
          loaiVthh: data.loaiVthh,
          cloaiVthh: data.cloaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          tenCloaiVthh: data.tenCloaiVthh,
          donViTinh: data.donViTinh,
          soLuong: data.soLuong,
          tgianNkho: data.tgianNkho,
        })
        if (data.loaiVthh.startsWith('02')) {
          this.typeVthh = '02';
        } else {
          this.typeVthh = data.loaiVthh;
          this.convertDataHopDongToDataDetail(data);
        }
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
            tenLoaiVthh: data.tenLoaiVthh,
            loaiVthh: data.loaiVthh,
            tenCloaiVthh: data.tenCloaiVthh,
            cloaiVthh: data.cloaiVthh,
            trangThai: data.trangThai,
            tenTrangThai: data.tenTrangThai,
            lyDoTuChoi: data.ldoTuchoi,
            idHd: data.idHd,
            soHd: data.soHd,
            soLuong: data.soLuong,
            donViTinh: data.donViTinh,
            tgianNkho: data.tiganNkho
          });
          if (this.userService.isCuc()) {
            this.dataTable = data.dtlList
          } else {
            this.dataTable = data.dtlList.filter(x => x.maDvi == this.userInfo.MA_DVI);
          }
          this.listFileDinhKem = data.children2;
          if (data.loaiVthh.startsWith('02')) {
            this.typeVthh = '02';
          } else {
            this.typeVthh = data.loaiVthh;
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

  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  themDiaDiemNhap(indexTable?) {
    if (this.validatorDdiemNhap(indexTable) && this.validateButtonThem('ddiemNhap')) {
      this.dataTable[indexTable].diaDiemNhapList = [...this.dataTable[indexTable].diaDiemNhapList, this.rowItem]
      this.rowItem = new ThongTinDiaDiemNhap();
    }
  }

  themChiCuc() {
    this.dataTable = [...this.dataTable, this.rowItem];
    this.rowItem = new ThongTinDiaDiemNhap();
  }

  validatorDdiemNhap(indexTable): boolean {
    let soLuong = 0;
    this.dataTable[indexTable].diaDiemNhapList.forEach(item => {
      soLuong += item.soLuong;
    })
    soLuong += this.rowItem.soLuong
    if (soLuong > +this.formData.get('soLuong').value) {
      this.notification.error(MESSAGE.ERROR, "Số lượng thêm mới không được vượt quá số lượng của chi cục")
      return false;
    }

    return true
  }

  calcTong(index?) {
    if (this.dataTable && index) {
      const sum = this.dataTable[index].diaDiemNhapList.reduce((prev, cur) => {
        prev += cur.soLuong;
        return prev;
      }, 0);
      return sum;
    } else if (this.dataTable) {
      const sum = this.dataTable.reduce((prev, cur) => {
        prev += cur.soLuong;
        return prev;
      }, 0);
      return sum;
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
        if (indexRow) {
          this.dataTable[indexTable].diaDiemNhapList.splice(indexRow, 1);
        } else {
          this.dataTable.splice(indexTable, 1);
        }
      },
    });
  }

  clearDiaDiemNhap() {
    this.rowItem = new ThongTinDiaDiemNhap();
  }

  async loadDiemKho() {
    let body = {
      maDviCha: this.userInfo.MA_DVI,
      trangThai: '01',
    }
    const res = await this.donViService.getTreeAll(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.length > 0) {
        res.data.forEach(element => {
          if (element && element.capDvi == '3' && element.children) {
            this.listDiemKho = [
              ...this.listDiemKho,
              ...element.children
            ]
          }
          if (element && element.capDvi == '2' && element.children) {
            this.listChiCuc = [
              ...this.listChiCuc,
              ...element.children
            ]
          }
        });
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  changeChiCuc() {
    let chiCuc = this.listChiCuc.filter(x => x.key == this.rowItem.maDvi);
    if (chiCuc && chiCuc.length > 0) {
      this.rowItem.tenDvi = chiCuc[0].tenDvi
    }
  }

  changeDiemKho() {
    let diemKho = this.listDiemKho.filter(x => x.key == this.rowItem.maDiemKho);
    if (diemKho && diemKho.length > 0) {
      this.listNhaKho = diemKho[0].children;
      this.rowItem.tenDiemKho = diemKho[0].tenDvi
    }
  }

  changeNhaKho() {
    let nhaKho = this.listNhaKho.filter(x => x.key == this.rowItem.maNhaKho);
    if (nhaKho && nhaKho.length > 0) {
      this.listNganKho = nhaKho[0].children;
      this.rowItem.tenNhaKho = nhaKho[0].tenDvi
      // if (fromChiTiet) {
      //   this.changeNganKho();
      // }
      // else {
      //   this.detail.maNganKho = null;
      // }
    }
  }


  changeNganKho() {
    let nganKho = this.listNganKho.filter(x => x.key == this.rowItem.maNganKho);
    if (nganKho && nganKho.length > 0) {
      this.listNganLo = nganKho[0].children;
      this.rowItem.tenNganKho = nganKho[0].tenDvi
    }
  }

  async saveDdiemNhap(statusSave) {
    this.spinner.show();
    this.dataTable.forEach(item => {
      item.trangThai = statusSave
    })
    let body = {
      detailList: this.dataTable
    }
    let res = await this.quyetDinhNhapXuatService.updateDdiemNhap(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      this.redirectQdNhapXuat();
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
      this.spinner.hide();
    }
  }


}
