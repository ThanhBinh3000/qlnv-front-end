import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { cloneDeep, g } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  DialogCanCuKQLCNTComponent
} from 'src/app/components/dialog/dialog-can-cu-kqlcnt/dialog-can-cu-kqlcnt.component';
import {
  DialogDanhSachHangHoaComponent
} from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import {
  DialogThongTinPhuLucBangGiaHopDongComponent
} from 'src/app/components/dialog/dialog-thong-tin-phu-luc-bang-gia-hop-dong/dialog-thong-tin-phu-luc-bang-gia-hop-dong.component';
import { UploadComponent } from 'src/app/components/dialog/dialog-upload/upload.component';
import { MESSAGE } from 'src/app/constants/message';
import { FileDinhKem } from 'src/app/models/FileDinhKem';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import {
  dauThauGoiThauService
} from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/tochuc-trienkhai/dauThauGoiThau.service';
import { DonviService } from 'src/app/services/donvi.service';
import { ThongTinHopDongService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/hop-dong/thongTinHopDong.service';
import { UploadFileService } from 'src/app/services/uploaFile.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { saveAs } from 'file-saver';
import { DonviLienQuanService } from 'src/app/services/donviLienquan.service';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import {
  QuyetDinhPheDuyetKetQuaLCNTService
} from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/tochuc-trienkhai/quyetDinhPheDuyetKetQuaLCNT.service';
import { STATUS } from "../../../../../../constants/status";
import { HelperService } from "../../../../../../services/helper.service";
import { ThongTinPhuLucHopDongService } from "../../../../../../services/thongTinPhuLucHopDong.service";
import {
  DialogTableSelectionComponent
} from "../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import { convertTienTobangChu } from 'src/app/shared/commonFunction';
import {
  DialogThemChiCucComponent
} from "../../../../../../components/dialog/dialog-them-chi-cuc/dialog-them-chi-cuc.component";
import { ThongTinDauThauService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/tochuc-trienkhai/thongTinDauThau.service';
import { QuyetDinhPheDuyetKetQuaChaoGiaMTTService } from 'src/app/services/quyet-dinh-phe-duyet-ket-qua-chao-gia-mtt.service';

interface DonviLienQuanModel {
  id: number;
  tenDvi: string;
  diaChi: string;
  mst: string;
  sdt: string;
  stk: string;
  nguoiDdien: string;
  chucVu: string;
  version?: number;
}

@Component({
  selector: 'app-themmoi-hopdong-phuluc',
  templateUrl: './themmoi-hopdong-phuluc.component.html',
  styleUrls: ['./themmoi-hopdong-phuluc.component.scss']
})

export class ThemmoiHopdongPhulucComponent implements OnInit, OnChanges {
  @Input() id: number;
  @Input() isView: boolean = false;
  @Input() isQuanLy: boolean = false;
  @Input() loaiVthh: String;
  @Input() idChaoGia: number;
  @Input() dataBinding: any;
  @Input() idKqMtt: number;
  @Output()
  showListEvent = new EventEmitter<any>();

  loaiStr: string;
  maVthh: string;
  routerVthh: string;
  userInfo: UserLogin;

  detail: any = {};
  detailChuDauTu: any = {};
  fileDinhKem: Array<FileDinhKem> = [];

  optionsDonVi: any[] = [];
  optionsDonViShow: any[] = [];

  listLoaiHopDong: any[] = [];
  listGoiThau: any[] = [];
  dataTable: any[] = [];
  listDviLquan: any[] = [];
  isViewPhuLuc: boolean = false;
  idPhuLuc: number = 0;

  isVatTu: boolean = false;
  STATUS = STATUS;
  formData: FormGroup;
  maHopDongSuffix: string = '';
  listKqLcnt: any[] = [];
  dvLQuan: DonviLienQuanModel = {
    id: 0,
    tenDvi: '',
    diaChi: '',
    mst: '',
    sdt: '',
    stk: '',
    nguoiDdien: '',
    chucVu: '',
  };
  titleStatus: string = '';
  diaDiemNhapListCuc = [];
  donGiaCore: number = 0;
  tongSlHang: number = 0;
  //namKhoach: number = 0;
  listNam: any[] = [];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public userService: UserService,
    public globals: Globals,
    private modal: NzModalService,
    private hopDongService: ThongTinHopDongService,
    private notification: NzNotificationService,
    private danhMucService: DanhMucService,
    private spinner: NgxSpinnerService,
    private dauThauGoiThauService: dauThauGoiThauService,
    private uploadFileService: UploadFileService,
    private donviLienQuanService: DonviLienQuanService,
    private quyetDinhPheDuyetKetQuaChaoGiaMTTService: QuyetDinhPheDuyetKetQuaChaoGiaMTTService,
    private thongTinPhuLucHopDongService: ThongTinPhuLucHopDongService,
    private helperService: HelperService,
    private _modalService: NzModalService,
    private thongTinDauThauService: ThongTinDauThauService
  ) {
    this.formData = this.fb.group(
      {
        id: [null],
        namHd: [dayjs().get('year')],
        maHdong: [null, [Validators.required]],
        soQdKqMtt: [null, [Validators.required]],
        idQdKqMtt: [null, [Validators.required]],
        ngayQdKqMtt: [null],
        tgianNkho: [null],
        soQdPdKhMtt: [null],
        tenHd: [null, [Validators.required]],
        ngayKy: [null],
        ghiChuNgayKy: [null],
        loaiHdong: [null],
        ghiChuLoaiHdong: [],
        soNgayThien: [null, [Validators.required]],
        tgianGnhanTu: [null],
        tgianGnhanDen: [null],
        idChaoGia: [null, [Validators.required]],
        ghiChuTgianGnhan: [null],
        noiDung: [],
        dieuKien: [],
        maDvi: [null, [Validators.required]],
        tenDvi: [null, [Validators.required]],
        diaChi: [null, [Validators.required]],
        mst: [null, [Validators.required]],
        tenNguoiDdien: [null, [Validators.required]],
        chucVu: [null, [Validators.required]],
        sdt: [null, [Validators.required]],
        fax: [null, [Validators.required]],
        stk: [null, [Validators.required]],
        moLai: [null],
        thongTinGiayUyQuyen: [null],
        tenCongTy: [],
        diaChiCongTy: [],
        mstCongTy: [],
        tenNguoiDdienCongTy: [],
        chucVuCongTy: [],
        sdtCongTy: [],
        faxCongTy: [],
        stkCongTy: [],
        moLaiCongTy: [],
        loaiVthh: [null],
        tenLoaiVthh: [null],
        cloaiVthh: [null],
        tenCloaiVthh: [null],
        moTaHangHoa: [null],
        soLuong: [null],
        donGia: [],
        thanhTien: [],
        ghiChu: [null],
        soLuongQdKhMtt: [null],
        trangThai: [STATUS.DU_THAO],
        tenTrangThai: ['Dự thảo'],



        tenGoiThau: [null, [Validators.required]],
        ngayHieuLuc: [null],
        donGiaVat: [null],
        gtriHdSauVat: [null],
        tgianBhanh: [null],
        idNthau: [null],
        canCuId: [null],
      }
    );
    this.formData.controls['donGiaVat'].valueChanges.subscribe(value => {
      if (value) {
        this.donGiaCore = value;
        const gtriHdSauVat = this.formData.controls.donGiaVat.value * this.formData.controls.soLuong.value;
        this.formData.controls['gtriHdSauVat'].setValue(gtriHdSauVat);
      } else {
        this.donGiaCore = 0;
        this.formData.controls['gtriHdSauVat'].setValue(0);
      }
    });
  }

  async ngOnInit() {
    await this.spinner.show();
    let dayNow = dayjs().get('year');
    this.userInfo = this.userService.getUserLogin();
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayNow - i,
        text: dayNow - i,
      });
    }
    await Promise.all([
      this.loadDataComboBox(),
      this.onChangeNam()
    ]);
    if (this.id) {
      // Đã có onchange
      // await this.loadChiTiet(this.id);
    } else {
      await this.initForm();
    }
    await this.spinner.hide();
  }

  async loadDataComboBox() {
    this.listLoaiHopDong = [];
    let resHd = await this.danhMucService.loaiHopDongGetAll();
    if (resHd.msg == MESSAGE.SUCCESS) {
      this.listLoaiHopDong = resHd.data;
    }
  }

  async initForm() {
    this.userInfo = this.userService.getUserLogin();
    this.formData.patchValue({
      maDvi: this.userInfo.MA_DVI ?? null,
      tenDvi: this.userInfo.TEN_DVI ?? null,
    })
    if (this.dataBinding) {
      await this.bindingDataKqLcnt(this.dataBinding.id);
    }
  }

  async onChangeNam() {
    let namKh = this.formData.get('namHd').value;
    this.maHopDongSuffix = `/${namKh}/HĐMB`;
    await this.getListQdKqLcnt();
  }

  async getListQdKqLcnt() {

  }

  async loadChiTiet(id) {
    if (id > 0) {
      let res = await this.hopDongService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const detail = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, detail);
          this.formData.patchValue({
            maHdong: detail.soHd?.split('/')[0]
          });
          this.fileDinhKem = detail.fileDinhKems;
          this.dataTable = detail.details;
        }
      }
    }
  }

  async loaiHopDongGetAll() {
    this.listLoaiHopDong = [];
    let res = await this.danhMucService.loaiHopDongGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiHopDong = res.data;
    }
  }

  async save(isKy?) {
    this.spinner.show();
    this.setValidator(isKy);
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    if (this.formData.value.maHdong) {
      body.soHd = `${this.formData.value.maHdong}${this.maHopDongSuffix}`;
    }
    body.fileDinhKems = this.fileDinhKem;
    body.detail = this.dataTable;
    let res = null;
    if (this.formData.get('id').value) {
      res = await this.hopDongService.update(body);
    } else {
      res = await this.hopDongService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isKy) {
        this.id = res.data.id;
        await this.guiDuyet();
      } else {
        if (this.formData.get('id').value) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
          this.back();
        } else {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
          this.back();
        }
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }

  setValidator(isKy) {
    if (isKy) {
      this.formData.controls["maHdong"].setValidators([Validators.required]);
    } else {
      this.formData.controls["maHdong"].clearValidators();
    }
  }


  redirectPhuLuc(id) {
    this.isViewPhuLuc = true;
    this.idPhuLuc = id;
  }

  showChiTiet() {
    this.isViewPhuLuc = false;
    this.loadChiTiet(this.id);
  }

  openDialogBang(data) {
    const modalPhuLuc = this.modal.create({
      nzTitle: 'Thông tin phụ lục bảng giá chi tiết hợp đồng',
      nzContent: DialogThongTinPhuLucBangGiaHopDongComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1200px',
      nzFooter: null,
      nzComponentParams: {
        data: data
      },
    });
    modalPhuLuc.afterClose.subscribe((res) => {
      if (res) {
      }
    });
  }

  async openDialogKQLCNT() {
    await this.spinner.show();
    let body = {
      trangThai: STATUS.BAN_HANH,
      maDvi: this.userInfo.MA_DVI,
      paggingReq: {
        "limit": this.globals.prop.MAX_INTERGER,
        "page": 0
      },
      loaiVthh: this.loaiVthh
    }
    let res = await this.quyetDinhPheDuyetKetQuaChaoGiaMTTService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listKqLcnt = res.data.content.filter(item => item.trangThaiHd != STATUS.HOAN_THANH_CAP_NHAT);
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    await this.spinner.hide();


    const modalQD = this.modal.create({
      nzTitle: 'Danh sách kết quả lựa chọn nhà thầu',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listKqLcnt,
        dataHeader: ['Số QĐ phê duyệt kết quả chào giá', 'Số QĐ phê duyệt kế hoạch mua trực tiếp'],
        dataColumn: ['soQd', 'soQdPdKh'],
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.bindingDataKqLcnt(data.id);
      }
    });
  }

  async bindingDataKqLcnt(idKqMtt) {
    await this.spinner.show();
    let res = await this.quyetDinhPheDuyetKetQuaChaoGiaMTTService.getDetail(idKqMtt);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data;
      this.bindingDataKqLcntLuongThuc(data);
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg)
    }
    await this.spinner.hide();
  }


  bindingDataKqLcntLuongThuc(data) {
    const dataDtl = data.hhQdPheduyetKhMttDx
    console.log(dataDtl, 777)
    // this.listGoiThau = dataDtl.dsGoiThau.filter(item => item.trangThai == STATUS.THANH_CONG && (data.listHopDong.map(e => e.idChaoGia).indexOf(item.id) < 0));
    this.formData.patchValue({
      soQdKqMtt: data.soQd,
      idQdKqLcnt: data.id,
      ngayQdKqMtt: data.ngayTao,
      soQdPdKhMtt: data.soQdPdKh,
      tenCongTy: dataDtl.hhChiTietTTinChaoGiaList[0].canhanTochuc,
      // loaiHdong: dataDtl.hhQdKhlcntHdr.loaiHdong,
      // cloaiVthh: dataDtl.hhQdKhlcntHdr.cloaiVthh,
      // tenLoaiVthh: dataDtl.hhQdKhlcntHdr.tenLoaiVthh,
      // loaiVthh: dataDtl.hhQdKhlcntHdr.loaiVthh,
      // tenCloaiVthh: dataDtl.hhQdKhlcntHdr.tenCloaiVthh,
      // moTaHangHoa: dataDtl.dxuatKhLcntHdr.moTaHangHoa,
      // tgianNkho: dataDtl.dxuatKhLcntHdr.tgianNhang
    })
  }

  convertTienTobangChu(tien: number): string {
    return convertTienTobangChu(tien);
  }

  back() {
    this.showListEvent.emit();
  }

  taiLieuDinhKem(type?: string) {
    const modal = this.modal.create({
      nzTitle: 'Tài liệu đính kèm',
      nzContent: UploadComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modal.afterClose.subscribe((res) => {
      if (res) {
        this.uploadFileService
          .uploadFile(res.file, res.tenTaiLieu)
          .then((resUpload) => {
            const fileDinhKem = new FileDinhKem();
            fileDinhKem.fileName = resUpload.filename;
            fileDinhKem.fileSize = resUpload.size;
            fileDinhKem.fileUrl = resUpload.url;
            this.fileDinhKem.push(fileDinhKem);
          });
      }
    });
  }

  downloadFile(taiLieu: any) {
    this.uploadFileService.downloadFile(taiLieu.fileUrl).subscribe((blob) => {
      saveAs(blob, taiLieu.fileName);
    });
  }

  deleteTaiLieu(index: number) {
    this.fileDinhKem = this.fileDinhKem.filter((item, i) => i !== index)
  }

  guiDuyet() {
    this._modalService.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: `Bạn có chắc chắn muốn ký hợp đồng này không?`,
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 365,
      nzOnOk: async () => {
        const body = {
          id: this.id,
          trangThai: STATUS.DA_KY,
        }
        let res = await this.hopDongService.approve(
          body,
        );
        if (res.msg == MESSAGE.SUCCESS) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.THAO_TAC_SUCCESS);
          this.back();
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      },
    });
  }

  xoaPhuLuc(id: any) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.spinner.show();
        try {
          this.thongTinPhuLucHopDongService.delete({ id: id })
            .then(async () => {
              await this.loadChiTiet(this.id);
            });
        } catch (e) {
          console.log('error: ', e);
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
        this.spinner.hide();
      },
    });
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      await this.spinner.show();
      await this.loadChiTiet(this.id);
      await this.spinner.hide()
    }
  }

  isDisableForm(): boolean {
    if (this.formData.value.trangThai == STATUS.DA_KY) {
      return true;
    } else {
      return false
    }
  }

  getNameFile($event) {

  }

  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  expandSet2 = new Set<number>();
  onExpandChange2(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet2.add(id);
    } else {
      this.expandSet2.delete(id);
    }
  }


  expandSet3 = new Set<number>();
  onExpandChange3(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet3.add(id);
    } else {
      this.expandSet3.delete(id);
    }
  }
}
