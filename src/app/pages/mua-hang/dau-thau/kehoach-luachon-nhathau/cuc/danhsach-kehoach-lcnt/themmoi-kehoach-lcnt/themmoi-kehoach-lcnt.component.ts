import { cloneDeep } from 'lodash';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { DialogThemMoiVatTuComponent } from 'src/app/components/dialog/dialog-them-moi-vat-tu/dialog-them-moi-vat-tu.component';
import { MESSAGE } from 'src/app/constants/message';
import { CanCuXacDinh, DanhSachGoiThau, FileDinhKem, ThongTinChung, ThongTinDeXuatKeHoachLuaChonNhaThau, ThongTinDeXuatKeHoachLuaChonNhaThauInput } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DanhSachDauThauService } from 'src/app/services/danhSachDauThau.service';
import { UploadFileService } from 'src/app/services/uploaFile.service';
import VNnum2words from 'vn-num2words';
import * as dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { Globals } from 'src/app/shared/globals';
import { LEVEL, LIST_VAT_TU_HANG_HOA, LOAI_HANG_DTQG } from 'src/app/constants/config';
import { UserLogin } from 'src/app/models/userlogin';
import { UserService } from 'src/app/services/user.service';
import { VatTu } from 'src/app/components/dialog/dialog-them-thong-tin-vat-tu-trong-nam/danh-sach-vat-tu-hang-hoa.type';
import { UploadComponent } from 'src/app/components/dialog/dialog-upload/upload.component';
import { DialogQuyetDinhGiaoChiTieuComponent } from 'src/app/components/dialog/dialog-quyet-dinh-giao-chi-tieu/dialog-quyet-dinh-giao-chi-tieu.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { convertVthhToId } from 'src/app/shared/commonFunction';
import { HelperService } from 'src/app/services/helper.service';
import { DonviService } from 'src/app/services/donvi.service';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { ObservableService } from 'src/app/services/observable.service';
import { environment } from 'src/environments/environment';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { DialogDanhSachHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import { ChiTieuKeHoachNamCapTongCucService } from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';


interface ItemData {
  id: string;
  stt: string;
  goiThau: string;
  soLuong: string;
  diaDiem: string;
  donGia: string;
  thanhTien: string;
  bangChu: string;
}

export interface TreeNodeInterface {
  key: string;
  maDvi: string;
  tenDvi: string;
  goiThau: string;
  soLuongTheoChiTieu?: number;
  maDiemKho?: string;
  soLuongDaMua?: number;
  diaDiemNhap?: string;
  soLuong?: number;
  donGia?: number;
  thanhTien?: string;
  bangChu?: string;
  name: string;
  age?: number;
  level?: number;
  expand?: boolean;
  address?: string;
  children?: TreeNodeInterface[];
  parent?: TreeNodeInterface;
}
@Component({
  selector: 'app-themmoi-kehoach-lcnt',
  templateUrl: './themmoi-kehoach-lcnt.component.html',
  styleUrls: ['./themmoi-kehoach-lcnt.component.scss']
})
export class ThemmoiKehoachLcntComponent implements OnInit {
  @Input()
  loaiVthh: string;
  @Input()
  id: number;

  @Output()
  showListEvent = new EventEmitter<any>();

  searchValue = '';
  searchFilter = {
    soDeXuat: '',
  };

  editCache: { [key: string]: { edit: boolean; data: DanhSachGoiThau } } = {};

  formData: FormGroup;
  formThongTinChung: FormGroup;
  listOfData: DanhSachGoiThau[] = [];
  cacheData: DanhSachGoiThau[] = [];
  fileDinhKem: Array<FileDinhKem> = [];
  userLogin: UserLogin
  listChiCuc: any[] = [];
  listDiemKho: any[] = [];
  listTieuChuan: any[] = [];
  titleStatus: string = '';
  titleButtonDuyet: string = '';
  iconButtonDuyet: string = '';
  danhMucDonVi: any;
  ktDiemKho: any;

  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = false;
  i = 0;
  editId: string | null = null;
  tabSelected: string = 'thongTinChung';
  listPhuongThucDauThau: any[] = [];
  listNguonVon: any[] = [];
  listNam: any[] = [];
  listLoaiVthh: any[] = [];
  listCLoaiVthh: any[] = [];
  listHangHoa: any[] = [];
  listHinhThucDauThau: any[] = [];
  listLoaiHopDong: any[] = [];
  listOfMapData: VatTu[];
  listOfMapDataClone: VatTu[];
  mapOfExpandedData: { [key: string]: VatTu[] } = {};
  selectHang: any = { ten: '' };
  errorInputRequired: string = 'Dữ liệu không được để trống.';
  dataChiTieu: any;
  dsGoiThauClone: Array<DanhSachGoiThau>;
  baoGiaThiTruongList: CanCuXacDinh[] = [];
  canCuKhacList: CanCuXacDinh[] = [];

  urlUploadFile: string = `${environment.SERVICE_API}/qlnv-gateway/qlnv-core/file/upload-attachment`;

  tongGiaTriCacGoiThau: number = 0;
  tenTaiLieuDinhKem: string;

  userInfo: UserLogin;

  maTrinh: string = ''

  constructor(
    private modal: NzModalService,
    private routerActive: ActivatedRoute,
    private router: Router,
    private danhMucService: DanhMucService,
    private dauThauService: DanhSachDauThauService,
    private spinner: NgxSpinnerService,
    private uploadFileService: UploadFileService,
    private notification: NzNotificationService,
    private fb: FormBuilder,
    public globals: Globals,
    private userService: UserService,
    private helperService: HelperService,
    private donviService: DonviService,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    private chiTieuKeHoachNamCapTongCucService: ChiTieuKeHoachNamCapTongCucService
  ) {
    this.formData = this.fb.group(
      {
        id: [],
        soQd: [, [Validators.required]],
        soDxuat: [null, [Validators.required]],
        trichYeu: [null],
        ghiChu: [null, [Validators.required]],
        namKhoach: [, [Validators.required]],
        loaiVthh: [, [Validators.required]],
        tenVthh: [, [Validators.required]],
        ngayKy: [null, [Validators.required]],
        trangThai: [''],
        maDvi: [],
        cloaiVthh: [, [Validators.required]],
        tenCloaiVthh: [, [Validators.required]],
        maVtu: [],
        tenVtu: []
      }
    );
    this.formThongTinChung = this.fb.group(
      {
        id: [],
        tenDuAn: [null, [Validators.required]],
        tenDvi: [null],
        tongMucDt: [null, [Validators.required]],
        nguonVon: [null, [Validators.required]],
        tchuanCluong: [null, [Validators.required]],
        loaiHdong: [null, [Validators.required]],
        hthucLcnt: [null, [Validators.required]],
        pthucLcnt: [null, [Validators.required]],
        donGia: [null, [Validators.required]],
        tgianTbao: [null, [Validators.required]],
        tgianPhatHanh: [null, [Validators.required]],
        tgianMoThau: [null, [Validators.required]],
        tgianDongThau: [null, [Validators.required]],
        tgianThHienHd: [null, [Validators.required]],
        tgianNhapHang: [null, [Validators.required]],
        maDvi: [null]
      }
    );
    this.danhMucDonVi = JSON.parse(sessionStorage.getItem('danhMucDonVi'));
    this.ktDiemKho = JSON.parse(sessionStorage.getItem('ktDiemKho'));
    this.loaiVTHHGetAll();
  }

  startEdit(index: number): void {
    this.editCache[index].edit = true;
    this.changeChiCuc(this.editCache[index].data.maDvi, null);
  }

  cancelEdit(index: number): void {
    this.editCache[index].edit = false;
  }

  saveEdit(index: number): void {
    Object.assign(
      this.listOfData[index],
      this.editCache[index].data,
    );
    this.editCache[index].edit = false;
  }

  deleteRow(i: number): void {
    this.listOfData = this.listOfData.filter((d, index) => index !== i);
  }

  ngOnInit(): void {
    this.userInfo = this.userService.getUserLogin();
    this.maTrinh = '/' + this.userInfo.MA_TR;
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
    this.loadDonVi();
    if (this.id > 0) {
      this.loadThongTinDeXuatKeHoachLuaChonNhaThau(this.id);
    } else {
      this.initForm();
    }
    Promise.all([
      this.loaiVTHHGetAll(),
      this.nguonVonGetAll(),
      this.phuongThucDauThauGetAll(),
      this.hinhThucDauThauGetAll(),
      this.loaiHopDongGetAll(),
      this.getDataChiTieu()
    ]);
  }

  initForm(dataDetail?) {
    this.formData.patchValue(
      {
        id: dataDetail ? dataDetail.id : null,
        soQd: dataDetail ? dataDetail.soQd : null,
        soDxuat: dataDetail ? dataDetail.soDxuat.split('/')[0] : null,
        trichYeu: dataDetail ? dataDetail.trichYeu : null,
        ghiChu: dataDetail ? dataDetail.ghiChu : null,
        namKhoach: dataDetail ? dataDetail.namKhoach : dayjs().get('year'),
        loaiVthh: dataDetail ? dataDetail.loaiVthh : this.loaiVthh,
        tenVthh: dataDetail ? dataDetail.tenVthh : null,
        ngayKy: dataDetail ? dataDetail.ngayKy : null,
        trangThai: dataDetail ? dataDetail.trangThai : '',
        maDvi: this.userInfo.MA_DVI,
        cloaiVthh: dataDetail ? dataDetail.cloaiVthh : null,
        tenCloaiVthh: dataDetail ? dataDetail.tenCloaiVthh : null,
        maVtu: dataDetail ? dataDetail.maVtu : null,
        tenVtu: dataDetail ? dataDetail.tenVtu : null,
      }
    );
    this.formThongTinChung.patchValue(
      {
        id: dataDetail?.children1 ? dataDetail.children1.id : null,
        tenDuAn: dataDetail?.children1 ? dataDetail.children1.tenDuAn : null,
        tenDvi: dataDetail?.children1 ? dataDetail.children1.maDvi : this.userInfo.MA_DVI,
        tongMucDt: dataDetail?.children1 ? dataDetail.children1.tongMucDt : null,
        nguonVon: dataDetail?.children1 ? dataDetail.children1.nguonVon : null,
        tchuanCluong: dataDetail?.children1 ? dataDetail.children1.tchuanCluong : null,
        loaiHdong: dataDetail?.children1 ? dataDetail.children1.loaiHdong : null,
        hthucLcnt: dataDetail?.children1 ? dataDetail.children1.hthucLcnt : null,
        pthucLcnt: dataDetail?.children1 ? dataDetail.children1.pthucLcnt : null,
        donGia: dataDetail?.children1 ? dataDetail.children1.donGia : 123,
        tgianTbao: dataDetail?.children1 ? dataDetail.children1.tgianTbao : null,
        tgianPhatHanh: dataDetail?.children1 ? dataDetail.children1.tgianPhatHanh : null,
        tgianMoThau: dataDetail?.children1 ? dataDetail.children1.tgianMoThau : null,
        tgianDongThau: dataDetail?.children1 ? dataDetail.children1.tgianDongThau : null,
        tgianThHienHd: dataDetail?.children1 ? dataDetail.children1.tgianThHienHd : null,
        tgianNhapHang: dataDetail?.children1 ? dataDetail.children1.tgianNhapHang : null,
        maDvi: this.userInfo.MA_DVI
      }
    )
    if (dataDetail) {
      this.fileDinhKem = dataDetail.children
      this.listOfData = dataDetail?.children2 ?? [];
      this.editCache = {};
      this.listOfData?.forEach((value, index) => {
        this.editCache[index] = {
          edit: false,
          data: { ...value }
        };
      })
      this.bindingCanCu(dataDetail.children3);
    }
    this.setTitle();
    this.getNameDanhSachDvi(this.formThongTinChung.get('tenDvi').value);
  }

  bindingCanCu(data) {
    if (data && data.length > 0) {
      data.forEach((chiTiet) => {
        if (chiTiet.loaiCanCu == '00') {
          this.baoGiaThiTruongList = [
            ...this.baoGiaThiTruongList,
            chiTiet,
          ];
        } else if (chiTiet.loaiCanCu == '01') {
          this.canCuKhacList = [
            ...this.canCuKhacList,
            chiTiet,
          ];
        }
      });
    }
  }

  getNameDanhSachDvi(maDvi: string) {
    let donVi = this.danhMucDonVi?.filter(item => item.maDvi == maDvi);
    this.formThongTinChung.patchValue({
      tenDvi: donVi.length > 0 ? donVi[0].tenDvi : null
    })
  }

  getTenDviTable(maDvi: string) {
    let donVi = this.danhMucDonVi?.filter(item => item.maDvi == maDvi);
    return donVi.length > 0 ? donVi[0].tenDvi : null
  }

  getTenDiemKhoTable(maDiemKho: string) {
    let diemKho = this.ktDiemKho?.filter(item => item.maDiemkho == maDiemKho);
    return diemKho.length > 0 ? diemKho[0].tenDiemkho : null
  }

  async changeChiCuc(event, index?) {
    const res = await this.tinhTrangKhoHienThoiService.getChiCucByMaTongCuc(event)
    this.listDiemKho = [];
    if (res.msg == MESSAGE.SUCCESS) {
      for (let i = 0; i < res.data?.child.length; i++) {
        const item = {
          'value': res.data.child[i].maDiemkho,
          'text': res.data.child[i].tenDiemkho,
          'diaDiemNhap': res.data.child[i].diaDiem,
        };
        this.listDiemKho.push(item);
      }
    }
  }

  changeDiemKho(index) {
    let chiCuc = this.listChiCuc.filter(item => item.value == this.editCache[index].data.maDvi);
    let diemKho = this.listDiemKho.filter(item => item.value == this.editCache[index].data.maDiemKho);
    if (chiCuc.length > 0 && diemKho.length > 0) {
      this.editCache[index].data.tenDvi = chiCuc[0].text;
      this.editCache[index].data.tenDiemKho = diemKho[0].text;
      this.editCache[index].data.diaDiemNhap = diemKho[0]?.text + " - " + chiCuc[0]?.text
    }
  }

  async loadDonVi() {
    const res = await this.donviService.layDonViCon();
    this.listChiCuc = [];
    if (res.msg == MESSAGE.SUCCESS) {
      for (let i = 0; i < res.data.length; i++) {
        const item = {
          'value': res.data[i].maDvi,
          'text': res.data[i].tenDvi
        };
        this.listChiCuc.push(item);
      }
    }
  }

  selectHangHoa() {
    let data = this.loaiVthh;
    const modalTuChoi = this.modal.create({
      nzTitle: 'Danh sách hàng hóa',
      nzContent: DialogDanhSachHangHoaComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: { data },
    });
    modalTuChoi.afterClose.subscribe(async (data) => {
      if (data) {
        this.bindingDataHangHoa(data);
      }
    });
  }

  bindingDataHangHoa(data) {
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

  editCanCuTaiLieuDinhKem(data: CanCuXacDinh, type?: string) {
    const modal = this.modal.create({
      nzTitle: 'Chỉnh sửa căn cứ xác định giá',
      nzContent: UploadComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataCanCuXacDinh: data,
        type: type,
      },
    });
    modal.afterClose.subscribe((res) => {
      if (res) {
        this.uploadFileService
          .uploadFile(res.file, res.tenTaiLieu)
          .then((resUpload) => {
            switch (type) {
              case 'bao-gia-thi-truong':
                this.baoGiaThiTruongList.forEach((baoGia) => {
                  if (baoGia.idVirtual == data.idVirtual) {
                    baoGia.children[0].fileName = resUpload.filename;
                    baoGia.children[0].fileSize = resUpload.size;
                    baoGia.children[0].fileUrl = resUpload.url;
                  }
                });
                break;
              case 'can-cu-khac':
                this.canCuKhacList.forEach((canCu) => {
                  if (canCu.idVirtual == data.idVirtual) {
                    canCu.children[0].fileName = resUpload.filename;
                    canCu.children[0].fileSize = resUpload.size;
                    canCu.children[0].fileUrl = resUpload.url;
                  }
                });
                break;
              default:
                break;
            }
          });
      }
    });
  }

  xoaFile(item) {

  }

  taiLieuDinhKem(type?: string) {
    const modal = this.modal.create({
      nzTitle: 'Thêm mới căn cứ xác định giá',
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
            switch (type) {
              case 'tai-lieu-dinh-kem':
                this.fileDinhKem.push(fileDinhKem);
                break;
              case 'bao-gia-thi-truong':
                const taiLieuBaoGiaThiTruong = new CanCuXacDinh();
                taiLieuBaoGiaThiTruong.loaiCanCu = '00';
                taiLieuBaoGiaThiTruong.tenTlieu = res.tenTaiLieu;
                taiLieuBaoGiaThiTruong.idVirtual = new Date().getTime();
                taiLieuBaoGiaThiTruong.children = [];
                taiLieuBaoGiaThiTruong.children = [
                  ...taiLieuBaoGiaThiTruong.children,
                  fileDinhKem,
                ];
                this.baoGiaThiTruongList = [
                  ...this.baoGiaThiTruongList,
                  taiLieuBaoGiaThiTruong,
                ];
                break;
              case 'can-cu-khac':
                const taiLieuCanCuKhac = new CanCuXacDinh();
                taiLieuCanCuKhac.loaiCanCu = '01';
                taiLieuCanCuKhac.tenTlieu = res.tenTaiLieu;
                taiLieuCanCuKhac.idVirtual = new Date().getTime();
                taiLieuCanCuKhac.children = [];
                taiLieuCanCuKhac.children = [
                  ...taiLieuCanCuKhac.children,
                  fileDinhKem,
                ];
                this.canCuKhacList = [...this.canCuKhacList, taiLieuCanCuKhac];
                console.log(this.canCuKhacList);
                break;
              default:
                break;
            }
          });
      }
    });
  }

  themMoiGoiThau(data?: DanhSachGoiThau) {
    // if (!this.formData.get('loaiVthh').value) {
    //   this.notification.error(MESSAGE.ERROR, 'Vui lòng chọn loại hàng hóa');
    //   return
    // }
    const modalGT = this.modal.create({
      nzTitle: 'Thông tin gói thầu',
      nzContent: DialogThemMoiVatTuComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1200px',
      nzFooter: null,
      nzComponentParams: {
        thongtinDauThau: data,
        dataChiTieu: this.dataChiTieu,
        donGia: this.formThongTinChung.get('donGia').value,
        loaiVthh: '0101'
      },
    });
    modalGT.afterClose.subscribe((res) => {
      if (!res) {
        return;
      }

      const dsGoiThauDialog = new DanhSachGoiThau();
      dsGoiThauDialog.bangChu = res.value.bangChu;
      dsGoiThauDialog.diaDiemNhap = res.value.diaDiemNhap;
      dsGoiThauDialog.maDvi = res.value.maDvi;
      dsGoiThauDialog.tenDvi = res.value.tenDvi;
      dsGoiThauDialog.maDiemKho = res.value.maDiemKho;
      dsGoiThauDialog.tenDiemKho = res.value.tenDiemKho;
      dsGoiThauDialog.donGia = +res.value.donGia;
      dsGoiThauDialog.goiThau = res.value.goiThau;
      dsGoiThauDialog.soLuong = +res.value.soLuong;
      dsGoiThauDialog.thanhTien = res.value.thanhTien;
      dsGoiThauDialog.idVirtual = new Date().getTime();
      dsGoiThauDialog.children = res.value.children;
      this.listOfData = [
        ...this.listOfData,
        dsGoiThauDialog
      ]
      this.listOfData.forEach(item => {
        this.mapOfExpandedData2[item.maDvi] = this.convertTreeToList2(item);
      });
      console.log(this.mapOfExpandedData2);
    });
  }

  async save() {
    this.helperService.markFormGroupTouched(this.formData);
    this.helperService.markFormGroupTouched(this.formThongTinChung);
    if (this.formData.invalid) {
      console.log("Invalid");
      return;
    }
    if (this.formThongTinChung.invalid) {
      console.log("Invalid");
      return;
    }
    if (this.listOfData.length == 0) {
      this.notification.error(MESSAGE.ERROR, 'Danh sách kế hoạch không được để trống');
      return;
    }
    let body = this.formData.value;
    body.soDxuat = body.soDxuat + this.maTrinh;
    body.children = this.fileDinhKem;
    body.children1 = this.formThongTinChung.value;
    body.children2 = this.listOfData;
    body.children3 = [...this.baoGiaThiTruongList, ... this.canCuKhacList];
    let res = null;
    if (this.formData.get('id').value) {
      res = await this.dauThauService.update(body);
    } else {
      res = await this.dauThauService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (this.formData.get('id').value) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      } else {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
      }
      this.loadThongTinDeXuatKeHoachLuaChonNhaThau(res.data.id)
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async phuongThucDauThauGetAll() {
    this.listPhuongThucDauThau = [];
    let res = await this.danhMucService.phuongThucDauThauGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listPhuongThucDauThau = res.data;
    }
  }


  async nguonVonGetAll() {
    this.listNguonVon = [];
    let res = await this.danhMucService.nguonVonGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listNguonVon = res.data;
    }
  }

  async hinhThucDauThauGetAll() {
    this.listHinhThucDauThau = [];
    let res = await this.danhMucService.hinhThucDauThauGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listHinhThucDauThau = res.data;
    }
  }

  async loaiVTHHGetAll() {
    this.listLoaiVthh = [];
    let res = await this.danhMucService.loaiVatTuHangHoaGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiVthh = res.data;
    }
  }

  async loaiHopDongGetAll() {
    this.listLoaiHopDong = [];
    let res = await this.danhMucService.loaiHopDongGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiHopDong = res.data;
    }
  }

  async getDataChiTieu() {
    let res2 = await this.chiTieuKeHoachNamCapTongCucService.loadThongTinChiTieuKeHoachCucNam(this.formData.get('namKhoach').value)
    if (res2.msg == MESSAGE.SUCCESS) {
      this.dataChiTieu = res2.data;
      this.formData.patchValue({
        soQd: this.dataChiTieu.soQuyetDinh,
      });
    }
  }

  async loadThongTinDeXuatKeHoachLuaChonNhaThau(id: number) {
    await this.dauThauService.getDetail(id).then((res) => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.initForm(res.data)
      }
    })
      .catch((e) => {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      });
  }


  convertTienTobangChu(tien: number): string {
    return VNnum2words(tien);
  }

  downloadFile(taiLieu: any) {
    this.uploadFileService.downloadFile(taiLieu.fileUrl).subscribe((blob) => {
      saveAs(blob, taiLieu.fileName);
    });
  }

  deleteTaiLieu(index: number, table: string) {
    if (table == 'bao-gia-thi-truong') {
      this.baoGiaThiTruongList = this.baoGiaThiTruongList.filter((item, i) => i !== index)
    }
    if (table == 'can-cu-khac') {
      this.canCuKhacList = this.canCuKhacList.filter((item, i) => i !== index)
    }
    if (table == 'file-dinhkem') {
      this.fileDinhKem = this.fileDinhKem.filter((item, i) => i !== index)
    }
  }

  quayLai() {
    this.showListEvent.emit();
  }

  async guiDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn gửi duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.formData.get('id').value,
            trangThai: ''
          };
          switch (this.formData.get('trangThai').value) {
            case '00':
            case '03': {
              body.trangThai = '01';
              break;
            }
            case '01': {
              body.trangThai = '09';
              break;
            }
            case '09': {
              body.trangThai = '11';
            }
          }
          let res = await this.dauThauService.updateStatus(body);
          this.loadThongTinDeXuatKeHoachLuaChonNhaThau(res.data.id)
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
            lyDo: text,
            trangThai: '03',
          };
          const res = await this.dauThauService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TU_CHOI_SUCCESS);
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
      }
    });
  }

  setTitle() {
    let trangThai = this.formData.get('trangThai').value
    switch (trangThai) {
      case '00': {
        this.iconButtonDuyet = 'htvbdh_tcdt_guiduyet'
        this.titleButtonDuyet = 'Gửi duyệt';
        break;
      }
      case '03': {
        this.iconButtonDuyet = 'htvbdh_tcdt_guiduyet'
        this.titleButtonDuyet = 'Gửi duyệt';
        break;
      }
      case '01': {
        this.iconButtonDuyet = 'htvbdh_tcdt_pheduyet'
        this.titleButtonDuyet = 'Duyệt';
        this.titleStatus = 'Trưởng phòng duyệt';
        break
      }
      case '09': {
        this.iconButtonDuyet = 'htvbdh_tcdt_baocao2'
        this.titleButtonDuyet = 'Ban hành';
        this.titleStatus = 'Lãnh đạo duyệt';
        break
      }
      case '11': {
        this.titleStatus = 'Ban hành';
        break
      }
    }
  }

  export() {
    const workbook = XLSX.utils.book_new();
    if (this.tabSelected == 'dsGoiThau') {
      const tableDanhSachGoiThau = document
        .getElementById('table-danh-sach-goi-thau')
        .getElementsByTagName('table');
      if (tableDanhSachGoiThau && tableDanhSachGoiThau.length > 0) {
        let sheetLuongThuc = XLSX.utils.table_to_sheet(tableDanhSachGoiThau[0]);
        sheetLuongThuc['!cols'] = [];
        sheetLuongThuc['!cols'][7] = { hidden: true };
        XLSX.utils.book_append_sheet(
          workbook,
          sheetLuongThuc,
          'Danh sách đấu thầu',
        );
        XLSX.writeFile(workbook, 'danh-sach-dau-thau.xlsx');
      }
    } else if (this.tabSelected == 'ccXacDinh') {
      const tableBaoGiaThiTruong = document
        .getElementById('table-bao-gia-thi-truong')
        .getElementsByTagName('table');
      if (tableBaoGiaThiTruong && tableBaoGiaThiTruong.length > 0) {
        let sheetLuongThuc = XLSX.utils.table_to_sheet(tableBaoGiaThiTruong[0]);
        sheetLuongThuc['!cols'] = [];
        sheetLuongThuc['!cols'][2] = { hidden: true };
        XLSX.utils.book_append_sheet(
          workbook,
          sheetLuongThuc,
          'Báo giá thị trường',
        );
      }
      const tableCanCuXacDinh = document
        .getElementById('table-can-cu-khac')
        .getElementsByTagName('table');
      if (tableCanCuXacDinh && tableCanCuXacDinh.length > 0) {
        let sheetLuongThuc = XLSX.utils.table_to_sheet(tableCanCuXacDinh[0]);
        sheetLuongThuc['!cols'] = [];
        sheetLuongThuc['!cols'][2] = { hidden: true };
        XLSX.utils.book_append_sheet(
          workbook,
          sheetLuongThuc,
          'Căn cứ xác định',
        );
      }
      XLSX.writeFile(workbook, 'can-cu-xac-dinh.xlsx');
    }
  }

  listOfMapData2: TreeNodeInterface[] = [
    {
      key: `Việt trì`,
      maDvi: '',
      tenDvi: '',
      goiThau: '',
      name: 'John Brown sr.',
      age: 60,
      address: 'New York No. 1 Lake Park',
      children: [
        {
          key: `1-1`,
          maDvi: '',
          tenDvi: '',
          goiThau: '',
          name: 'John Brown',
          age: 42,
          address: 'New York No. 2 Lake Park'
        },
        {
          key: `1-2`,
          maDvi: '',
          tenDvi: '',
          goiThau: '',
          name: 'John Brown jr.',
          age: 30,
          address: 'New York No. 3 Lake Park'
        },
        {
          key: `1-3`,
          maDvi: '',
          tenDvi: '',
          goiThau: '',
          name: 'Jim Green sr.',
          age: 72,
          address: 'London No. 1 Lake Park',
        }
      ]
    }
  ];

  mapOfExpandedData2: { [maDvi: string]: DanhSachGoiThau[] } = {};


  collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {
    if (!$event) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.key === d.key)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  collapse2(array: DanhSachGoiThau[], data: DanhSachGoiThau, $event: boolean): void {
    if (!$event) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.maDvi === d.maDvi)!;
          target.expand = false;
          this.collapse2(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  convertTreeToList2(root: DanhSachGoiThau): DanhSachGoiThau[] {
    const stack: DanhSachGoiThau[] = [];
    const array: DanhSachGoiThau[] = [];
    const hashMap = {};
    debugger;
    stack.push({ ...root, level: 0, expand: false });
    while (stack.length !== 0) {
      const node = stack.pop();
      this.visitNode2(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], level: node.level! + 1, expand: false, parent: node });
        }
      }
    }
    return array;
  }

  visitNode2(node: DanhSachGoiThau, hashMap: { [maDvi: string]: boolean }, array: DanhSachGoiThau[]): void {
    if (!hashMap[node.maDvi]) {
      hashMap[node.maDvi] = true;
      array.push(node);
    }
  }

}
