import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder, FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { differenceInCalendarDays } from 'date-fns';
import dayjs from 'dayjs';
import { cloneDeep, chain } from 'lodash';
import { DisabledTimeFn } from 'ng-zorro-antd/date-picker';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import {DATEPICKER_CONFIG, LEVEL_USER, LOAI_HINH_NHAP_XUAT} from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { FileDinhKem } from 'src/app/models/FileDinhKem';
import { DetailQuyetDinhNhapXuat, QuyetDinhNhapXuat, ThongTinDiaDiemNhap } from 'src/app/models/QuyetDinhNhapXuat';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DonviService } from 'src/app/services/donvi.service';
import { HelperService } from 'src/app/services/helper.service';
import { ThongTinHopDongService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/hop-dong/thongTinHopDong.service';
import { UploadFileService } from 'src/app/services/uploaFile.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { STATUS } from "../../../../../constants/status";
import {
  QuyetDinhGiaoNhapHangKhacService
} from "../../../../../services/qlnv-hang/nhap-hang/nhap-khac/quyetDinhGiaoNhapHangKhac.service";
import {
  QuyetDinhPheDuyetKeHoachNhapKhacService
} from "../../../../../services/qlnv-hang/nhap-hang/nhap-khac/quyetDinhPheDuyetKeHoachNhapKhac.service";
import { DANH_MUC_LEVEL } from "../../../../luu-kho/luu-kho.constant";
import { convertTrangThai, convertVthhToId } from 'src/app/shared/commonFunction';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
@Component({
  selector: 'app-themmoi-qdinh-nhap-xuat-hang-khac',
  templateUrl: './themmoi-qdinh-nhap-xuat-hang-khac.component.html',
  styleUrls: ['./themmoi-qdinh-nhap-xuat-hang-khac.component.scss'],
})
export class ThemmoiQdinhNhapXuatHangKhacComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() loaiVthh: string;
  @Input() idQdPd: number;
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
  sumSlNhap: any;

  loaiStr: string;
  maVthh: string;
  idVthh: number;
  routerVthh: string;
  today = new Date();
  listNam: any[] = [];
  // hopDongList: any[] = [];
  listFileDinhKem: any[] = [];
  listOfData: any[] = [];
  listDataGroup: any[] = [];
  listDonVi: any = {};
  listCuc: any[] = [];
  listLoKho: any[] = [];
  STATUS = STATUS
  maQdSuffix: string;

  hopDongIds: any[number] = [];

  listHopDong: any[] = [];

  dataTable: any[] = [];

  rowItem: ThongTinDiaDiemNhap = new ThongTinDiaDiemNhap();
  previewName: string = 'nk_qd_giao_nv_nh';
  listChiCuc: any[] = [];
  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganKho: any[] = [];
  listNganLo: any[] = [];
  listCanCu: any[] = [];
  loaiHinhNhapXuat = LOAI_HINH_NHAP_XUAT;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    private router: Router,
    fb: FormBuilder,
    modal: NzModalService,
    private donViService: DonviService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    public globals: Globals,
    public userService: UserService,
    private quyetDinhGiaoNhapHangKhacService: QuyetDinhGiaoNhapHangKhacService,
    private quyetDinhPheDuyetKeHoachNhapKhacService: QuyetDinhPheDuyetKeHoachNhapKhacService,
    uploadFileService: UploadFileService,
    private thongTinHopDongSercive: ThongTinHopDongService,
    helperService: HelperService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhGiaoNhapHangKhacService);
    this.formData = this.fb.group({
      id: [''],
      idQdPdNk: [],
      soQd: [''],
      ngayQd: [dayjs().format("YYYY-MM-DD")],
      trichYeu: [],
      nam: [dayjs().get('year')],
      tenDvi: [''],
      maDvi: [''],
      trangThai: ['78'],
      tenTrangThai: ['Đang nhập dữ liệu'],
      loaiVthh: [''],
      tenLoaiVthh: [''],
      cloaiVthh: [''],
      tongSlNhap: [''],
      dvt: [''],
      tenCloaiVthh: [''],
      ldoTuchoi: [''],
      loaiHinhNx: [],
      kieuNx: [],
      tenKieuNx: [''],
      tenLoaiHinhNx: [''],
      tgianNkMnhat: [''],
      soQdPd: ['']
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
      await this.loadDiemKho(),
      await this.loadDsDonVi()
    ])
    if (this.idQdPd > 0) {
      await this.bindingDataQd(this.idQdPd);
    }
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
      loaiVthh: this.loaiVthh
    });
  }

  async openDialogQdPd() {
    if (this.isChiTiet) {
      return;
    }
    let body = {
      "loaiVthh": this.loaiVthh,
      "trangThai": STATUS.BAN_HANH,
      "lastest": 0,
      "namKhoach": this.formData.get('nam').value,
      "paggingReq": {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0,
      },
    }
    let res = await this.quyetDinhPheDuyetKeHoachNhapKhacService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listHopDong = res.data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    const modalQD = this.modal.create({
      nzTitle: 'Thông tin quyết định phê duyệt kế hoạch nhập khác',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listHopDong,
        dataHeader: ['Số quyết định', 'Ngày ký quyết định', 'Loại hàng hóa', 'Chủng loại hàng hóa'],
        dataColumn: ['soQd', 'ngayKyQd', 'tenLoaiVthh', 'tenCloaiVthh']
      },
    });
    modalQD.afterClose.subscribe(async (dataSelect) => {
      if (dataSelect) {
        await this.bindingDataQd(dataSelect.id);
      }
    });

  }

  async bindingDataQd(id: any) {
    this.spinner.show();
    let res = await this.quyetDinhPheDuyetKeHoachNhapKhacService.getDetail(id);
    if (res.msg == MESSAGE.SUCCESS) {
      this.dataTable = [];
      console.log(res)
      const data = res.data;
      this.formData.patchValue({
        idDx: data.idDx,
        soQdPd: data.soQd,
        idQdPdNk: data.id,
        idTh: data.idTh,
        loaiVthh: data.loaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        dvt: data.dvt,
        tongSlNhap: data.tongSlNhap,
        tenLoaiHinhNx: data.tenLoaiHinhNx,
        loaiHinhNx: data.loaiHinhNx,
        kieuNx: data.kieuNx,
        tenKieuNx: data.tenKieuNx,
        trichYeu: data.trichYeu
      })
      console.log(this.formData)
      // if (data.loaiVthh.startsWith('02')) {
      // let dataUserLogin = data.details.filter(item => item.maDvi == this.userInfo.MA_DVI);
      this.dataTable = data.details;
      // this.dataTable.forEach(x => {
      //   x.soLuong = null;
      //   x.children.forEach(y => {
      //     y.maDiemKho = y.maDvi;
      //     y.soLuongDiemKho = y.soLuong;
      //     y.tenDiemKho = y.tenDvi
      //     y.soLuong = null;
      //   })
      // });
      // } else {
      this.dataTable = data.details;
      // this.dataTable.forEach(x => {
      //   x.soLuong = null;
      //   x.children.forEach(y => {
      //     y.soLuongDiemKho = y.soLuong;
      //     y.soLuong = null;
      //   })
      // });
      // }
      this.convertListDataLuongThuc();
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg)
    }
    this.spinner.hide();
  }

  async loadDsDonVi() {
    let body = {
      trangThai: "01",
      maDviCha: this.userService.isChiCuc() ? this.userInfo.MA_DVI.substring(0, 6) : this.userInfo.MA_DVI,
      type: "DV"
    };
    let res = await this.donViService.layDonViTheoCapDo(body);
    console.log(res)
    this.listDonVi = res;
    if (this.userService.isTongCuc()) {
      this.listCuc = res[DANH_MUC_LEVEL.CUC];
      this.listCuc = this.listCuc.filter(item => item.type != "PB");
    } else {
      this.listChiCuc = res[DANH_MUC_LEVEL.CHI_CUC];
      this.listChiCuc = this.listChiCuc.filter(item => item.type != "PB");
    }
  }
  convertListDataLuongThuc() {
    let listOfData: any;
    let slNhap = 0;
    this.helperService.setIndexArray(this.dataTable);
    listOfData = this.userService.isChiCuc() ? this.dataTable.filter(x => x.maChiCuc.includes(this.userInfo.MA_DVI.substring(0, 6))) : this.dataTable.filter(x => x.maChiCuc.includes(this.userInfo.MA_DVI))
    this.listDataGroup = chain(listOfData).groupBy("maCuc").map((value, key) => (
      {
        tenCuc: this.listDonVi[DANH_MUC_LEVEL.CUC].find(i => i.maDvi == key)?.tenDvi,
        maCuc: key,
        children: value
      }))
      .value();
    this.listDataGroup.forEach(cuc => {
      cuc.children = chain(cuc.children).groupBy("maChiCuc").map((value, key) => (
        {
          tenChiCuc: this.listDonVi[DANH_MUC_LEVEL.CHI_CUC].find(i => i.maDvi == key)?.tenDvi,
          maChiCuc: key,
          children: value
        }))
        .value();
      cuc.children.forEach(chiCuc => {
        chiCuc.children = chain(chiCuc.children).groupBy("maDiemKho").map((value, key) => (
          {
            tenDiemKho: this.listDonVi[DANH_MUC_LEVEL.DIEM_KHO].find(i => i.maDvi == key)?.tenDvi,
            maDiemKho: key,
            children: value
          }))
          .value();
        // chiCuc.children.forEach(diemKho => {
        //   diemKho.children.forEach(nganLo => {
        //     if (nganLo.maLoKho != null) {
        //       nganLo.tenNganLoKho = this.listDonVi[DANH_MUC_LEVEL.LO_KHO].find(i => i.maDvi == nganLo.maLoKho).tenDvi + " - "
        //         + this.listDonVi[DANH_MUC_LEVEL.NGAN_KHO].find(i => i.maDvi == nganLo.maNganKho).tenDvi;
        //       this.sumSlNhap = slNhap += nganLo.slDoiThua;
        //     } else {
        //       nganLo.tenNganLoKho = this.listDonVi[DANH_MUC_LEVEL.NGAN_KHO].find(i => i.maDvi == nganLo.maNganKho).tenDvi;
        //     }
        //   });
        // });
      });
    });
    this.calculatorSl();
    console.log(this.listDataGroup)
  }

  calculatorSl(){
    let total = 0;
    if(this.formData.value.loaiHinhNx == this.loaiHinhNhapXuat.DOI_THUA){
      total = this.dataTable.reduce((acc, item) => acc + item.slDoiThua, 0);
    }
    if(this.formData.value.loaiHinhNx == this.loaiHinhNhapXuat.NHAP_TANG_SO_LUONG_SAU_KK){
      total = this.dataTable.reduce((acc, item) => acc + (item.slTonKhoThucTe - item.slTonKho), 0);
    }
    if(this.formData.value.loaiHinhNx == this.loaiHinhNhapXuat.NHAP_DO_BOI_THUONG
      || this.formData.value.loaiHinhNx == this.loaiHinhNhapXuat.NHAP_DO_TAI_NHAP
      || this.formData.value.loaiHinhNx == this.loaiHinhNhapXuat.NHAP_KHAC){
      total = this.dataTable.reduce((acc, item) => acc + item.slNhap, 0);
    }
    this.formData.get('tongSlNhap').setValue(total);
  }

  convertTrangThai(status: string) {
    return convertTrangThai(status);
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
      res = await this.quyetDinhGiaoNhapHangKhacService.update(body);
    } else {
      res = await this.quyetDinhGiaoNhapHangKhacService.create(body);
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
    debugger
    if (isGuiDuyet) {
      if (this.formData.value.trangThai == STATUS.DANG_NHAP_DU_LIEU) {
        this.formData.controls["soQd"].setValidators([Validators.required]);
        this.formData.controls["trichYeu"].setValidators([Validators.required]);
        this.formData.controls["ngayQd"].setValidators([Validators.required]);
        this.formData.controls["tgianNkMnhat"].setValidators([Validators.required]);
        this.formData.controls["nam"].setValidators([Validators.required]);
        this.formData.controls["soQdPd"].setValidators([Validators.required]);
      } else {
        this.formData.controls["soQd"].clearValidators();
        this.formData.controls["trichYeu"].clearValidators();
        this.formData.controls["ngayQd"].clearValidators();
        this.formData.controls["tgianNkMnhat"].clearValidators();
        this.formData.controls["nam"].clearValidators();
        this.formData.controls["soQdPd"].clearValidators();
      }
    } else {
      this.formData.controls["soQd"].clearValidators();
      this.formData.controls["trichYeu"].clearValidators();
      this.formData.controls["ngayQd"].clearValidators();
      this.formData.controls["tgianNkMnhat"].clearValidators();
      this.formData.controls["nam"].clearValidators();
      this.formData.controls["soQdPd"].clearValidators();
    }
  }

  redirectQdNhapXuat() {
    this.showListEvent.emit();
  }

  async loadThongTinQdNhapXuatHang(id: number) {
    await this.quyetDinhGiaoNhapHangKhacService
      .getDetail(id)
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          const data = res.data;
          console.log(data)
          this.helperService.bidingDataInFormGroup(this.formData, data);
          this.formData.patchValue({
            soQd: data.soQd?.split('/')[0],
          });
          this.dataTable = data.dtlList
          this.listFileDinhKem = data.fileDinhKems;
          this.listCanCu = data.fileCanCu;
          this.convertListDataLuongThuc();
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      })
  }

  pheDuyet() {
    let trangThai = ''
    let mesg = ''
    switch (this.formData.get('trangThai').value) {
      case STATUS.DANG_NHAP_DU_LIEU: {
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
            await this.quyetDinhGiaoNhapHangKhacService.approve(
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
            await this.quyetDinhGiaoNhapHangKhacService.approve(
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
  /// Vũ đổi tên k bị trùng base
  isDetaill(): boolean {
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
      this.dataTable[indexTable].children = [...this.dataTable[indexTable].children, this.rowItem]
      this.rowItem = new ThongTinDiaDiemNhap();
    }
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
    console.log(soLuong, diemKho.soLuongDiemKho);
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
      const sum = this.dataTable.reduce((prev, cur) => {
        cur.children.forEach(res => {
          prev += res.soLuong;
        })
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
      if (item.children.length == 0) {
        this.notification.success(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
      }
    })
    let body = {
      detailList: this.dataTable
    }
    let res = await this.quyetDinhGiaoNhapHangKhacService.updateDdiemNhap(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      // this.redirectQdNhapXuat();
      this.spinner.hide();
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

  protected readonly LOAI_HINH_NHAP_XUAT = LOAI_HINH_NHAP_XUAT;
}
