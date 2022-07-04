import { DialogThemMoiGoiThauComponent } from 'src/app/components/dialog/dialog-them-moi-goi-thau/dialog-them-moi-goi-thau.component';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { VatTu } from 'src/app/components/dialog/dialog-them-thong-tin-vat-tu-trong-nam/danh-sach-vat-tu-hang-hoa.type';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { LIST_VAT_TU_HANG_HOA, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { CanCuXacDinh, DanhSachGoiThau, FileDinhKem, ThongTinChung, ThongTinDeXuatKeHoachLuaChonNhaThau, ThongTinDeXuatKeHoachLuaChonNhaThauInput } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DanhSachDauThauService } from 'src/app/services/danhSachDauThau.service';
import { dauThauGoiThauService } from 'src/app/services/dauThauGoiThau.service';
import { DonviService } from 'src/app/services/donvi.service';
import { HelperService } from 'src/app/services/helper.service';
import { ObservableService } from 'src/app/services/observable.service';
import { QuyetDinhPheDuyetKeHoachLCNTService } from 'src/app/services/quyetDinhPheDuyetKeHoachLCNT.service';
import { QuyetDinhPheDuyetKetQuaLCNTService } from 'src/app/services/quyetDinhPheDuyetKetQuaLCNT.service';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { UploadFileService } from 'src/app/services/uploaFile.service';
import { UserService } from 'src/app/services/user.service';
import { convertVthhToId } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
import { environment } from 'src/environments/environment';
import VNnum2words from 'vn-num2words';
import { DialogDanhSachHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import { DauThauService } from 'src/app/services/dauThau.service';

@Component({
  selector: 'app-themmoi-quyetdinh-ketqua-lcnt',
  templateUrl: './themmoi-quyetdinh-ketqua-lcnt.component.html',
  styleUrls: ['./themmoi-quyetdinh-ketqua-lcnt.component.scss']
})
export class ThemmoiQuyetdinhKetquaLcntComponent implements OnInit {
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input() isViewDetail: boolean;
  @Input() idInput: number;


  editCache: { [key: string]: { edit: boolean; data: DanhSachGoiThau } } = {};

  formData: FormGroup;
  formThongTinChung: FormGroup;
  listOfData: DanhSachGoiThau[] = [];
  cacheData: DanhSachGoiThau[] = [];
  fileDinhKem: Array<FileDinhKem> = [];
  userLogin: UserLogin
  listChiCuc: any[] = [];
  listDiemKho: any[] = [];
  listPheDuyetKhlcnt: any[] = [];
  listGoiThau: any[] = [];
  titleStatus: string = '';
  styleStatus: string = 'du-thao-va-lanh-dao-duyet';
  titleButtonDuyet: string = '';
  iconButtonDuyet: string = '';
  danhMucDonVi: any;
  ktDiemKho: any;
  urlUploadFile: string = `${environment.SERVICE_API}/qlnv-gateway/qlnv-core/file/upload-attachment`;
  fileList: any[] = [];

  editId: string | null = null;
  tabSelected: string = 'thongTinChung';
  listPhuongThucDauThau: any[] = [];
  listNguonVon: any[] = [];
  listNam: any[] = [];
  listVthh: any[] = [];
  listHinhThucDauThau: any[] = [];
  listLoaiHopDong: any[] = [];

  listQdPdKhlcnt: any[] = [];
  maQd: string = '';


  chiTietThongTinDXKHLCNT: ThongTinDeXuatKeHoachLuaChonNhaThau = new ThongTinDeXuatKeHoachLuaChonNhaThau();
  thongTinChungDXKHLCNT: ThongTinChung = new ThongTinChung();
  listOfMapData: VatTu[];
  listOfMapDataClone: VatTu[];
  mapOfExpandedData: { [key: string]: VatTu[] } = {};
  selectHang: any = { ten: '' };
  errorInputRequired: string = 'Dữ liệu không được để trống.';
  thongTinDXKHLCNTInput: ThongTinDeXuatKeHoachLuaChonNhaThauInput = new ThongTinDeXuatKeHoachLuaChonNhaThauInput();



  tongGiaTriCacGoiThau: number = 0;
  tenTaiLieuDinhKem: string;

  userInfo: UserLogin;

  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;

  constructor(
    private modal: NzModalService,
    private danhMucService: DanhMucService,
    private spinner: NgxSpinnerService,
    private uploadFileService: UploadFileService,
    private notification: NzNotificationService,
    private fb: FormBuilder,
    public globals: Globals,
    public userService: UserService,
    private helperService: HelperService,
    private quyetDinhPheDuyetKeHoachLCNTService: QuyetDinhPheDuyetKeHoachLCNTService,
    private dauThauGoiThauService: dauThauGoiThauService,
    private quyetDinhPheDuyetKetQuaLCNTService: QuyetDinhPheDuyetKetQuaLCNTService,
    private ttinDauThauService: DauThauService,

  ) {
    this.formData = this.fb.group(
      {
        id: [],
        soQd: [,],
        ngayQd: [null,],
        ngayHluc: [null,],
        namKhoach: [dayjs().get('year'),],
        loaiVthh: ['',],
        tenVthh: ['',],
        cloaiVthh: [''],
        tenCloaiVthh: [''],
        trichYeu: [null,],
        soQdPdKhlcnt: [''],
        ngayQdPdKhlcnt: [null,],
        idGoiThau: [null,],
        ghiChu: [null,],
        trungThau: [true],
        trangThai: ['00'],
        maDvi: [],
        tenDviTthau: [],
        tgianThienHd: [],
        giaTrungThau: [],
        loaiHdong: [],
        lyDoHuy: ['']
      }
    );
    this.formData.controls['soQdPdKhlcnt'].valueChanges.subscribe(value => {
      if (value) {
        this.onChangeSoQdKh(value);
      }
    });
    this.formData.controls['idGoiThau'].valueChanges.subscribe(value => {
      if (value) {
        this.onChangeGoiThau(value);
      }
    });
  }

  async getListPheDuyetLcnt() {
    let body = {
      trangThai: '11',
      namKhoach: this.formData.get('namKhoach').value,
      loaiVthh: this.formData.get('loaiVthh').value
    }
    let res = await this.quyetDinhPheDuyetKeHoachLCNTService.getAll(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.formData.patchValue({
        canCu: null,
        idGoiThau: null,
        ngayQdPd: null
      })
      this.listPheDuyetKhlcnt = res.data;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async ngOnInit() {
    this.spinner.show();
    this.userInfo = this.userService.getUserLogin();
    this.maQd = "/" + this.userInfo.MA_QD;
    await this.loaiHopDongGetAll()

    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
    this.listVthh = LIST_VAT_TU_HANG_HOA;
    if (this.idInput > 0) {
      await this.getDetail(this.idInput);
    }
    this.setTitle();
    this.spinner.hide();
  }

  async getDetail(id: number) {
    let res = await this.quyetDinhPheDuyetKetQuaLCNTService.getDetail(id);
    if (res.msg == MESSAGE.SUCCESS) {
      const dataDetail = res.data;
      this.formData.patchValue({
        soQdPdKhlcnt: dataDetail ? dataDetail.soQdPdKhlcnt : null,
        id: dataDetail ? dataDetail.id : null,
        soQd: dataDetail ? dataDetail.soQd.split('/')[0] : null,
        ngayQd: dataDetail ? dataDetail.ngayQd : null,
        ngayHluc: dataDetail ? dataDetail.ngayHluc : null,
        namKhoach: dataDetail ? +dataDetail.namKhoach : dayjs().get('year'),
        trichYeu: dataDetail ? dataDetail.trichYeu : null,
        loaiVthh: dataDetail ? dataDetail.loaiVthh : null,
        cloaiVthh: dataDetail ? dataDetail.cloaiVthh : null,
        tenVthh: dataDetail ? dataDetail.tenVthh : null,
        tenCloaiVthh: dataDetail ? dataDetail.tenCloaiVthh : null,
        ngayQdPdKhlcnt: dataDetail ? dataDetail.ngayQdPdKhlcnt : null,
        idGoiThau: dataDetail ? dataDetail.idGoiThau : null,
        trungThau: dataDetail ? dataDetail.trungThau : null,
        trangThai: dataDetail ? dataDetail.trangThai : null,
        lyDoHuy: dataDetail ? dataDetail.lyDoHuy : null,
        ghiChu: dataDetail ? dataDetail.ghiChu : null,
      })
    }
  }

  async save() {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      return;
    }
    let body = this.formData.value;
    body.soQd = body.soQd + this.maQd;
    let res;
    if (this.formData.get('id').value > 0) {
      res = await this.quyetDinhPheDuyetKetQuaLCNTService.update(body);
    } else {
      res = await this.quyetDinhPheDuyetKetQuaLCNTService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (this.formData.get('id').value) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        this.quayLai();
      } else {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        this.quayLai();
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loaiHopDongGetAll() {
    this.listLoaiHopDong = [];
    let res = await this.danhMucService.loaiHopDongGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiHopDong = res.data;
    }
  }

  downloadFile(taiLieu: any) {
    this.uploadFileService.downloadFile(taiLieu.fileUrl).subscribe((blob) => {
      saveAs(blob, taiLieu.fileName);
    });
  }

  quayLai() {
    this.showListEvent.emit();
  }

  setTitle() {
    let trangThai = this.formData.get('trangThai').value
    switch (trangThai) {
      case '00': {
        this.titleStatus = 'DỰ THẢO';
        this.iconButtonDuyet = 'htvbdh_tcdt_guiduyet'
        this.titleButtonDuyet = 'Gửi duyệt';
        break;
      }
      case '11': {
        this.titleStatus = 'BAN HÀNH';
        this.styleStatus = 'da-ban-hanh'
        break
      }
    }
  }

  pheDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn ban hành ?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.idInput,
            lyDoTuChoi: null,
            trangThai: '11',
          };
          const res = await this.quyetDinhPheDuyetKetQuaLCNTService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
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

  chiTiet() {
    const modalTuChoi = this.modal.create({
      nzTitle: 'Thông tin gói thầu',
      nzContent: DialogThemMoiGoiThauComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalTuChoi.afterClose.subscribe(async (text) => {

    });
  }

  selectHangHoa() {
    // let data = this.loaiVthh;
    const modalTuChoi = this.modal.create({
      nzTitle: 'Danh sách hàng hóa',
      nzContent: DialogDanhSachHangHoaComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalTuChoi.afterClose.subscribe(async (data) => {
      if (data) {
        this.bindingDataHangHoa(data);
      }
    });
  }

  async bindingDataHangHoa(data) {
    let cloaiVthh = null;
    if (data.loaiHang == "M" || data.loaiHang == "LT") {
      cloaiVthh = data.ma;
      this.formData.patchValue({
        maVtu: null,
        tenVtu: null,
        cloaiVthh: data.ma,
        tenCloaiVthh: data.ten,
        loaiVthh: data.parent.ma,
        tenVthh: data.parent.ten
      })
      this.getListQdPdKhlcnt();
    }
    if (data.loaiHang == "VT") {
      if (data.cap == "3") {
        cloaiVthh = data
        this.formData.patchValue({
          maVtu: data.ma,
          tenVtu: data.ten,
          cloaiVthh: data.parent.ma,
          tenCloaiVthh: data.parent.ten,
          loaiVthh: data.parent.parent.ma,
          tenVthh: data.parent.parent.ten
        })
      }
      if (data.cap == "2") {
        this.formData.patchValue({
          maVtu: null,
          tenVtu: null,
          cloaiVthh: data.ma,
          tenCloaiVthh: data.ten,
          loaiVthh: data.parent.ma,
          tenVthh: data.parent.ten
        })
      }
    }
  }

  async getListQdPdKhlcnt() {
    let body = {
      namKhoach: this.formData.get('namKhoach').value,
      loaiVthh: this.formData.get('loaiVthh').value,
      cloaiVthh: this.formData.get('cloaiVthh').value,
      trangThai: "11"
    };
    let res = await this.quyetDinhPheDuyetKeHoachLCNTService.getAll(body);
    this.listQdPdKhlcnt = res.data;
  }

  async onChangeSoQdKh(event) {
    let body = {
      namKhoach: this.formData.get('namKhoach').value,
      loaiVthh: this.formData.get('loaiVthh').value,
      cloaiVthh: this.formData.get('cloaiVthh').value,
      trangThai: "02",
      soQdPd: event,
      maDvi: this.userInfo.MA_DVI
    };
    const data = this.listQdPdKhlcnt.filter(item => item.soQd == event);
    if (data.length > 0) {
      this.formData.patchValue({
        ngayQdPdKhlcnt: data[0].ngayQd
      });
    }
    let res = await this.ttinDauThauService.getAll(body);
    this.listGoiThau = res.data;
  }

  async onChangeGoiThau(event) {
    let res = await this.dauThauGoiThauService.chiTietByGoiThauId(event);
    const data = res.data;
    let nhaThau = data.nthauDuThauList.filter(item => item.idNhaThau == data.idNhaThau);
    this.formData.patchValue({
      tenDviTthau: nhaThau[0].tenDvi,
      tgianThienHd: data.tgianThienHd,
      giaTrungThau: (data.donGiaTrcVat + (data.donGiaTrcVat * data.vat / 100)) * data.donGia,
      loaiHdong: data.loaiHdong,
      maDvi: this.userInfo.MA_DVI
    });
    let exisData = this.listGoiThau.filter(item => item.idGt == event)
    if (exisData.length == 0) {
      this.listGoiThau = [...this.listGoiThau, {
        idGt: data.idGoiThau,
        goiThau: data.tenGthau
      }]
    }
  }
}
