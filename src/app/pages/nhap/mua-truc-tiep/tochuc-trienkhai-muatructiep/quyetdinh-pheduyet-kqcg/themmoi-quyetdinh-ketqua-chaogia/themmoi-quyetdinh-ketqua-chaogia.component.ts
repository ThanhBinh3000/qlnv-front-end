import { DialogThemMoiGoiThauComponent } from 'src/app/components/dialog/dialog-them-moi-goi-thau/dialog-them-moi-goi-thau.component';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { VatTu } from 'src/app/components/dialog/dialog-them-thong-tin-vat-tu-trong-nam/danh-sach-vat-tu-hang-hoa.type';
import { LIST_VAT_TU_HANG_HOA, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { DanhSachGoiThau, FileDinhKem, ThongTinChung, ThongTinDeXuatKeHoachLuaChonNhaThau, ThongTinDeXuatKeHoachLuaChonNhaThauInput } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { dauThauGoiThauService } from 'src/app/services/dauThauGoiThau.service';
import { HelperService } from 'src/app/services/helper.service';
import { QuyetDinhPheDuyetKeHoachLCNTService } from 'src/app/services/quyetDinhPheDuyetKeHoachLCNT.service';
import { QuyetDinhPheDuyetKetQuaLCNTService } from 'src/app/services/quyetDinhPheDuyetKetQuaLCNT.service';
import { UploadFileService } from 'src/app/services/uploaFile.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { environment } from 'src/environments/environment';
import { DialogDanhSachHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import { DauThauService } from 'src/app/services/dauThau.service';
import { STATUS } from "../../../../../../constants/status";
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';

@Component({
  selector: 'app-themmoi-quyetdinh-ketqua-chaogia',
  templateUrl: './themmoi-quyetdinh-ketqua-chaogia.component.html',
  styleUrls: ['./themmoi-quyetdinh-ketqua-chaogia.component.scss']
})
export class ThemmoiQuyetdinhKetquaChaogiaComponent implements OnInit {
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input() isViewDetail: boolean;
  @Input() idInput: number;
  editCache: { [key: string]: { edit: boolean; data: DanhSachGoiThau } } = {};
  formData: FormGroup;
  taiLieuDinhKemList: any[] = [];
  formThongTinChung: FormGroup;
  listOfData: DanhSachGoiThau[] = [];
  cacheData: DanhSachGoiThau[] = [];
  // fileDinhKem: Array<FileDinhKem> = [];
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
  urlUploadFile: string = `${environment.SERVICE_API}/qlnv-core/file/upload-attachment`;
  fileList: any[] = [];
  editId: string | null = null;
  tabSelected: string = 'thongTinChung';
  listPhuongThucDauThau: any[] = [];
  listNguonVon: any[] = [];
  listNam: any[] = [];
  listVthh: any[] = [];
  listHinhThucDauThau: any[] = [];
  listLoaiHopDong: any[] = [];
  dataTableGoiThau: any[] = [];
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
  STATUS = STATUS
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
        soQd: [, [Validators.required]],
        ngayQd: [null, [Validators.required]],
        ngayHluc: [null, [Validators.required]],
        namKhoach: [dayjs().get('year'), [Validators.required]],
        loaiVthh: ['',],
        tenVthh: ['',],
        cloaiVthh: [''],
        tenCloaiVthh: [''],
        moTaHangHoa: [''],
        trichYeu: [null,],
        soQdPdKhlcnt: ['', [Validators.required]],
        ngayQdPdKhlcnt: [null,],
        idGoiThau: [null,],
        ghiChu: [null,],
        trangThai: ['00'],
        maDvi: [],
        tenDviTthau: [],
        tgianThienHd: [],
        giaTrungThau: [],
        loaiHdong: [],
        tenTrangThai: ['Dự thảo'],
        lyDoHuy: [''],
        trungThau: [''],
      }
    );
  }

  async ngOnInit() {
    this.spinner.show();
    this.userInfo = this.userService.getUserLogin();
    this.maQd = "/" + this.userInfo.MA_QD;
    await this.loaiHopDongGetAll()
    await this.getListQdPdKhlcnt();
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
    if (this.idInput > 0) {
      await this.getDetail(this.idInput);
    }
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
        namKhoach: dataDetail ? +dataDetail.namKhoach : null,
        trichYeu: dataDetail ? dataDetail.trichYeu : null,
        loaiVthh: dataDetail ? dataDetail.loaiVthh : null,
        cloaiVthh: dataDetail ? dataDetail.cloaiVthh : null,
        tenVthh: dataDetail ? dataDetail.tenVthh : null,
        tenCloaiVthh: dataDetail ? dataDetail.tenCloaiVthh : null,
        moTaHangHoa: dataDetail ? dataDetail.moTaHangHoa : null,
        ngayQdPdKhlcnt: dataDetail ? dataDetail.ngayQdPdKhlcnt : null,
        idGoiThau: dataDetail ? dataDetail.idGoiThau : null,
        trungThau: dataDetail ? dataDetail.trungThau : null,
        trangThai: dataDetail ? dataDetail.trangThai : null,
        lyDoHuy: dataDetail ? dataDetail.lyDoHuy : null,
        ghiChu: dataDetail ? dataDetail.ghiChu : null,
      })
      this.taiLieuDinhKemList = dataDetail.fileDinhKems;
      this.dataTableGoiThau = dataDetail.hhQdPduyetKqlcntDtlList;
    }
  }

  async save(isBanHanh?) {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
      return;
    }
    if (this.dataTableGoiThau.length == 0) {
      this.notification.error(MESSAGE.ERROR, 'Danh sách quyết định phê duyệt không được để trống');
      return
    }
    let body = this.formData.value;
    body.soQd = body.soQd + this.maQd;
    body.detailList = this.dataTableGoiThau;
    body.fileDinhKems = this.taiLieuDinhKemList;
    let res;
    if (this.formData.get('id').value > 0) {
      res = await this.quyetDinhPheDuyetKetQuaLCNTService.update(body);
    } else {
      res = await this.quyetDinhPheDuyetKetQuaLCNTService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isBanHanh) {
        this.idInput = res.data.id;
        this.pheDuyet();
      } else {
        if (this.formData.get('id').value) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
          this.quayLai();
        } else {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
          this.quayLai();
        }
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  deleteTaiLieuDinhKemTag(data: any) {
    if (!this.isViewDetail) {
      this.taiLieuDinhKemList = this.taiLieuDinhKemList.filter(
        (x) => x.id !== data.id,
      );
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

  // setTitle() {
  //   let trangThai = this.formData.get('trangThai').value
  //   switch (trangThai) {
  //     case STATUS.DU_THAO: {
  //       this.titleStatus = 'DỰ THẢO';
  //       this.iconButtonDuyet = 'htvbdh_tcdt_guiduyet'
  //       this.titleButtonDuyet = 'Gửi duyệt';
  //       break;
  //     }
  //     case STATUS.BAN_HANH: {
  //       this.titleStatus = 'BAN HÀNH';
  //       this.styleStatus = 'da-ban-hanh'
  //       break;
  //     }
  //   }
  // }

  pheDuyet() {
    let trangThai = '';
    let msg = '';
    switch (this.formData.get('trangThai').value) {
      case STATUS.DU_THAO: {
        trangThai = STATUS.BAN_HANH;
        msg = 'Bạn có muốn ban hành ?'
        break;
      }
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: msg,
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
            trangThai: trangThai,
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

  async chiTiet(data) {
    const res = await this.quyetDinhPheDuyetKeHoachLCNTService.getDetailGoiThau(data.idGt);
    const modalTuChoi = this.modal.create({
      nzTitle: 'Thông tin gói thầu',
      nzContent: DialogThemMoiGoiThauComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        data: res.data,
        loaiVthh: res.data.loaiVthh,
        isReadOnly: true
      },
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
      nzComponentParams: { onlyLuongThuc: true },
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
      trangThai: STATUS.BAN_HANH,
      lastest: 1,
      maDvi: this.userInfo.MA_DVI,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0,
      },
    };
    let res = await this.quyetDinhPheDuyetKeHoachLCNTService.search(body);
    this.listQdPdKhlcnt = res.data.content;
  }


  openDialogSoQdKhlcnt() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách số quyết định kế hoạch lựa chọn nhà thầu',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listQdPdKhlcnt,
        dataHeader: ['Số quyết định', 'Ngày quyết định', 'Loại hàng hóa', 'Chủng loại hàng hóa'],
        code: 'dsQdKhlcnt'
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      this.formData.patchValue({
        soQdPdKhlcnt: data.soQd,
        ngayQdPdKhlcnt: data.ngayQd,
        loaiVthh: data.loaiVthh,
        tenVthh: data.tenVthh,
        cloaiVthh: data.cloaiVthh,
        tenCloaiVthh: data.tenCloaiVthh
      })
      this.onChangeSoQdKh(data.soQd);
    });
  }


  async onChangeSoQdKh(event) {
    let body = {
      namKhoach: this.formData.get('namKhoach').value,
      loaiVthh: this.formData.get('loaiVthh').value,
      cloaiVthh: this.formData.get('cloaiVthh').value,
      trangThai: STATUS.HOAN_THANH_CAP_NHAT,
      soQd: event,
      maDvi: this.userInfo.MA_DVI
    };
    let res = await this.ttinDauThauService.getAll(body);
    this.dataTableGoiThau = res.data;
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
  }
}
