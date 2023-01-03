import { QuyetDinhPheDuyetKetQuaChaoGiaMTTService } from './../../../../../../services/quyet-dinh-phe-duyet-ket-qua-chao-gia-mtt.service';
import { QuyetDinhGiaoNvNhapHangService } from './../../../../../../services/qlnv-hang/nhap-hang/mua-truc-tiep/qdinh-giao-nvu-nh/quyetDinhGiaoNvNhapHang.service';
import { HopdongPhulucHopdongService } from './../../../../../../services/hopdong-phuluc-hopdong.service';
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
import { STATUS } from 'src/app/constants/status';
import { FileDinhKem } from 'src/app/models/FileDinhKem';
import { DetailQuyetDinhNhapXuat, QuyetDinhNhapXuat, ThongTinDiaDiemNhap } from 'src/app/models/QuyetDinhNhapXuat';
import { UserLogin } from 'src/app/models/userlogin';
import { DonviService } from 'src/app/services/donvi.service';
import { HelperService } from 'src/app/services/helper.service';
import { ThongTinHopDongService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/hop-dong/thongTinHopDong.service';
import { UploadFileService } from 'src/app/services/uploaFile.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { FormArray } from '@angular/forms';
@Component({
  selector: 'app-themmoi-nhiemvu-nhaphang',
  templateUrl: './themmoi-nhiemvu-nhaphang.component.html',
  styleUrls: ['./themmoi-nhiemvu-nhaphang.component.scss']
})
export class ThemmoiNhiemvuNhaphangComponent implements OnInit {
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
  radioValue: string = 'Cancuhopdong';
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

  listUyQuyen: any[] = [];

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
    private quyetDinhGiaoNvNhapHangService: QuyetDinhGiaoNvNhapHangService,
    private uploadFileService: UploadFileService,
    private hopdongPhulucHopdongService: HopdongPhulucHopdongService,
    private quyetDinhPheDuyetKetQuaChaoGiaMTTService: QuyetDinhPheDuyetKetQuaChaoGiaMTTService,
    private helperService: HelperService,
  ) {
    this.formData = this.fb.group({
      id: [''],
      soQd: ['', [Validators.required]],
      ngayQd: ['', [Validators.required]],
      tenHd: [''],
      idHd: [''],
      soHd: [''],
      idQdPdKh: [''],
      soQdPdKh: [''],
      idQdPdKq: [''],
      soQdPdKq: [''],
      trichYeu: [],
      namNhap: [dayjs().get('year')],
      tenDvi: [''],
      maDvi: [''],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      loaiVthh: [''],
      tenLoaiVthh: [''],
      cloaiVthh: [''],
      soLuong: [],
      donViTinh: [''],
      tgianNkho: [''],
      tenCloaiVthh: [''],
      lyDoTuChoi: [''],
      diaDiemGiaoNhan: [''],
    })
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
      await this.getListCanCuUyQuyen(),
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
    this.formData.patchValue(
      {
        "idHd": 1,
        "nam": 2022,
        "idQdPdKq": 1,
        "soQdPdKq": "test",
        "idQdPdKh": 1,
        "soQdPdKh": "test1",
        "ngayKyQdPdKh": "2022-12-26",
        "tgianNkho": "2022-12-26",
        "soHd": "17",
        "tenHd": "hợp đồng 17",
        "ngayKy": "2022-12-26",
        "ngayKyGhiChu": "",
        "loaiHdong": "",
        "loaiHdongGhiChu": "",
        "soNgayThien": 0,
        "tgianGnhanTu": "2022-12-26",
        "tgianGnhanDen": "2022-12-26",
        "tgianGnhanGhiChu": "2022-12-26",
        "noiDung": "test",
        "maDvi": "010102",
        "loaiVthh": "0101",
        "tenLoaiVthh": "Thóc tẻ",
        "cloaiVthh": "cloaiVthh",
        "tenCloaiVthh": "Hạt dài",
        "moTaHangHoa": "thóc hạt rất dài",
        "donViTinh": "kg",
        "soLuong": 100,
        "donGia": 0.0,
        "donGiaVat": 0.0,
        "thanhTien": 0.0,
        "thanhTienBangChu": "",
        "ghiChu": "",
        "diaDiemGiaoNhan": [
          {
            "serialVersionUID": 0,
            "TABLE_NAME": "",
            "id": 1,
            "idHdr": 1,
            "maDvi": "01010201",
            "tenDvi": "Chi cục Dự trữ Nhà nước Việt Trì",
            "soLuong": 100,
            "donGiaVat": 1,
            "stt": 0,
            "ngayTao": "2022-12-26T08:48:30.428276700",
            "nguoiTaoId": 0,
            "ngaySua": "2022-12-26T08:48:30.428276700",
            "nguoiSuaId": 0
          }
        ],

      }
    )
    this.dataTable = this.formData.value.diaDiemGiaoNhan;
    console.log(this.dataTable, 456);
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI,
      maDvi: this.userInfo.MA_DVI,
      loaiVthh: this.typeVthh
    });
  }

  async getListHopDong() {
    let body = {
      "trangThai": STATUS.DA_KY,
    }
    let res = await this.hopdongPhulucHopdongService.search(body);
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
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.spinner.show();
        let res = await this.hopdongPhulucHopdongService.getDetail(data.id);
        if (res.msg == MESSAGE.SUCCESS) {
          this.dataTable = [];
          const data = res.data;
          this.formData.patchValue({
            soHd: data.soHd,
            tenHd: data.tenHd,
            idHd: data.id,
            loaiVthh: data.loaiVthh,
            cloaiVthh: data.cloaiVthh,
            tenLoaiVthh: data.tenLoaiVthh,
            tenCloaiVthh: data.tenCloaiVthh,
            donViTinh: data.donViTinh,
            soLuong: data.soLuong,
            tgianNkho: data.tgianKthuc,

          })
          this.dataTable = data.diaDiemGiaoNhan
          console.log(this.dataTable, "hahaha");
        }
        else {
          this.notification.error(MESSAGE.ERROR, res.msg)
        }
        this.spinner.hide();
      }
    });

  }

  convertDataHopDongToDataDetail(hopDong) {
    hopDong.diaDiemGiaoNhan.forEach(async (item) => {
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


  async getListCanCuUyQuyen() {
    let body = {
      "trangThai": STATUS.DA_DUYET_LDC,
    }
    let res = await this.quyetDinhPheDuyetKetQuaChaoGiaMTTService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listUyQuyen = res.data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  openDialogCanCuUyQuyen() {
    console.log("huhu1123");
    if (this.isChiTiet) {
      return;
    }

    const modalQD = this.modal.create({
      nzTitle: 'Thông tin Căn cứ ủy quyền, chào giá',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listUyQuyen,
        dataHeader: ['Số QĐ PDKQ chào giá ', 'Ngày ký', 'Loại hàng hóa', 'Chủng loại hàng hóa'],
        dataColumn: ['soQdPdCg', 'ngayKy', 'tenLoaiVthh', 'tenCloaiVthh']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {

      if (data) {
        this.spinner.show();
        let res = await this.quyetDinhPheDuyetKetQuaChaoGiaMTTService.getDetail(data.id);
        if (res.msg == MESSAGE.SUCCESS) {
          this.dataTable = [];
          const data = res.data;
          console.log(data, "alo123");
          this.formData.patchValue({
            soQdPduyet: data.soQdPduyet,
            idQdPduyet: data.idQdPduyet,
            loaiVthh: data.loaiVthh,
            cloaiVthh: data.cloaiVthh,
            tenLoaiVthh: data.tenLoaiVthh,
            tenCloaiVthh: data.tenCloaiVthh,
            donViTinh: data.donViTinh,
            soLuong: data.soLuong,
            tgianNkho: data.tgianKthuc,

          })
          if (data.hhChiTietTTinChaoGiaList) {
            this.dataTable = data.hhChiTietTTinChaoGiaList
          }
        }
        else {
          this.notification.error(MESSAGE.ERROR, res.msg)
        }
        this.spinner.hide();
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

  async save(isGuiDuyet?) {
    this.helperService.markFormGroupTouched(this.formData);
    if (!this.formData.valid) {
      return;
    }
    this.spinner.show();
    let body = this.formData.value;
    console.log(body, "body");
    body.soQd = this.formData.get('soQd').value + this.maQdSuffix;
    body.hhQdGiaoNvNhangDtlList = this.dataTable;
    body.fileDinhKems = this.listFileDinhKem;
    let res;
    if (this.formData.get('id').value > 0) {
      res = await this.quyetDinhGiaoNvNhapHangService.update(body);
    } else {
      res = await this.quyetDinhGiaoNvNhapHangService.create(body);
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
  }
  setValidator(isGuiDuyet) {
    if (isGuiDuyet) {
      if (this.formData.value.trangThai == STATUS.CHO_DUYET_LDC) {
        this.formData.controls["soQd"].setValidators([Validators.required]);
        this.formData.controls["ngayQdinh"].setValidators([Validators.required]);
      } else {
        this.formData.controls["soQd"].clearValidators();
        this.formData.controls["ngayQdinh"].clearValidators();
      }
    } else {
      this.formData.controls["soQd"].clearValidators();
      this.formData.controls["ngayQdinh"].clearValidators();
    }
  }


  redirectQdNhapXuat() {
    this.showListEvent.emit();
  }

  async loadThongTinQdNhapXuatHang(id: number) {
    await this.quyetDinhGiaoNvNhapHangService
      .getDetail(id)
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          const data = res.data;
          console.log(data, "hello");
          this.formData.patchValue({
            id: data.id,
            namNhap: data.namNhap,
            soQd: data.soQd?.split('/')[0],
            tenDvi: data.tenDvi,
            maDvi: data.maDvi,
            ngayQd: data.ngayQd,
            trichYeu: data.trichYeu,
            tenLoaiVthh: data.tenLoaiVthh,
            loaiVthh: data.loaiVthh,
            tenCloaiVthh: data.tenCloaiVthh,
            cloaiVthh: data.cloaiVthh,
            trangThai: data.trangThai,
            tenTrangThai: data.tenTrangThai,
            lyDoTuChoi: data.ldoTuchoi,
            idHd: data.idHd,
            soLuong: data.soLuong,
            donViTinh: data.donViTinh,
            soHd: data.soHd,
            tenHd: data.tenHd,
            tgianNkho: data.tgianKthuc,
          });
          if (this.userService.isCuc()) {
            this.dataTable = data.hhQdGiaoNvNhangDtlList
          } else {
            this.dataTable = data.hhQdGiaoNvNhangDtlList.filter(x => x.maDvi == this.userInfo.MA_DVI);
          }
          this.listFileDinhKem = data.children2;
          this.typeVthh = data.loaiVthh;
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
            await this.quyetDinhGiaoNvNhapHangService.approve(
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
            await this.quyetDinhGiaoNvNhapHangService.approve(
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
    console.log(this.validatorDdiemNhap(indexTable), 1);
    console.log(this.validateButtonThem('ddiemNhap'), 2);
    if (this.validatorDdiemNhap(indexTable) && this.validateButtonThem('ddiemNhap')) {
      this.dataTable[indexTable].hhQdGiaoNvNhDdiemList = [...this.dataTable[indexTable].hhQdGiaoNvNhDdiemList, this.rowItem]
      this.rowItem = new ThongTinDiaDiemNhap();
    }
  }

  themChiCuc() {
    this.dataTable = [...this.dataTable, this.rowItem];
    this.rowItem = new ThongTinDiaDiemNhap();
  }

  validatorDdiemNhap(indexTable): boolean {
    let soLuong = 0;

    soLuong += this.rowItem.soLuong
    if (soLuong > +this.formData.value.soLuong) {
      this.notification.error(MESSAGE.ERROR, "Số lượng thêm mới không được vượt quá số lượng của chi cục")
      return false;
    }

    return true
  }

  calcTong(index?) {
    if (this.dataTable && index != null) {
      const sum = this.dataTable[index].hhQdGiaoNvNhDdiemList.reduce((prev, cur) => {
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
    this.listNhaKho = [];
    this.listNganKho = [];
    this.listNganLo = [];
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
      };
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  changeDiemKho() {
    this.listNhaKho = [];
    this.listNganKho = [];
    this.listNganLo = [];
    this.rowItem.maNhaKho = null;
    this.rowItem.maNganKho = null;
    this.rowItem.maLoKho = null;
    let diemKho = this.listDiemKho.filter(x => x.key == this.rowItem.maDiemKho);
    if (diemKho && diemKho.length > 0) {
      this.listNhaKho = diemKho[0].children;
      this.rowItem.tenDiemKho = diemKho[0].tenDvi;
      this.rowItem.soLuongDiemKho = diemKho[0].soLuongDiemKho;
    }
  }

  changeNhaKho() {
    this.listNganKho = [];
    this.listNganLo = [];
    this.rowItem.maNganKho = null;
    this.rowItem.maLoKho = null;
    let nhaKho = this.listNhaKho.filter(x => x.key == this.rowItem.maNhaKho);
    if (nhaKho && nhaKho.length > 0) {
      this.listNganKho = nhaKho[0].children;
      this.rowItem.tenNhaKho = nhaKho[0].tenDvi
    }
  }

  changeNganKho() {
    this.listNganLo = [];
    this.rowItem.maLoKho = null;
    let nganKho = this.listNganKho.filter(x => x.key == this.rowItem.maNganKho);
    if (nganKho && nganKho.length > 0) {
      this.listNganLo = nganKho[0].children;
      this.rowItem.tenNganKho = nganKho[0].tenDvi
    }
  }

  changeLoKho() {
    let loKho = this.listNganLo.filter(x => x.key == this.rowItem.maLoKho);
    if (loKho && loKho.length > 0) {
      this.rowItem.tenLoKho = loKho[0].tenDvi
    }
  }

  async saveDdiemNhap(statusSave) {
    this.spinner.show();
    this.dataTable.forEach(item => {
      item.trangThai = statusSave
    })
    let body = {
      hhQdGiaoNvNhangDtlList: this.dataTable
    }
    let res = await this.quyetDinhGiaoNvNhapHangService.updateDdiemNhap(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      this.redirectQdNhapXuat();
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
      this.spinner.hide();
    }
  }

  isDisableForm() {
    if (this.formData.value.trangThai == STATUS.BAN_HANH) {
      return true
    } else {
      return false;
    }
  }
}
