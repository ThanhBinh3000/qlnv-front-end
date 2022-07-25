import { DialogThemDiaDiemNhapKhoComponent } from './../../../../../../../components/dialog/dialog-them-dia-diem-nhap-kho/dialog-them-dia-diem-nhap-kho.component';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { DialogDanhSachHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import { DialogQuyetDinhGiaoChiTieuComponent } from 'src/app/components/dialog/dialog-quyet-dinh-giao-chi-tieu/dialog-quyet-dinh-giao-chi-tieu.component';
import { DialogThemMoiGoiThauComponent } from 'src/app/components/dialog/dialog-them-moi-goi-thau/dialog-them-moi-goi-thau.component';
import { DialogThemMoiVatTuComponent } from 'src/app/components/dialog/dialog-them-moi-vat-tu/dialog-them-moi-vat-tu.component';
import { VatTu } from 'src/app/components/dialog/dialog-them-thong-tin-vat-tu-trong-nam/danh-sach-vat-tu-hang-hoa.type';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { UploadComponent } from 'src/app/components/dialog/dialog-upload/upload.component';
import { API_STATUS_CODE, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import {
  CanCuXacDinh,
  DanhSachGoiThau,
  FileDinhKem
} from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import { UserLogin } from 'src/app/models/userlogin';
import { ChiTieuKeHoachNamCapTongCucService } from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DanhMucTieuChuanService } from 'src/app/services/danhMucTieuChuan.service';
import { DeXuatKeHoachBanDauGiaService } from 'src/app/services/deXuatKeHoachBanDauGia.service';
import { DonviService } from 'src/app/services/donvi.service';
import { HelperService } from 'src/app/services/helper.service';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { UploadFileService } from 'src/app/services/uploaFile.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { environment } from 'src/environments/environment';
import VNnum2words from 'vn-num2words';

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
  styleUrls: ['./themmoi-kehoach-lcnt.component.scss'],
})
export class ThemmoiKehoachLcntComponent implements OnInit {
  @Input() loaiVthhInput: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();

  searchValue = '';
  searchFilter = {
    soDeXuat: '',
  };

  editCache: { [key: string]: { edit: boolean; data: any } } = {};

  formData: FormGroup;
  // formThongTinChung: FormGroup;
  listOfData: any[] = [];
  cacheData: any[] = [];
  fileDinhKem: Array<FileDinhKem> = [];
  userLogin: UserLogin;
  listChiCuc: any[] = [];
  listDiemKho: any[] = [];
  listTieuChuan: any[] = [];
  titleStatus: string = '';
  titleButtonDuyet: string = '';
  iconButtonDuyet: string = '';
  styleStatus: string = 'du-thao-va-lanh-dao-duyet';
  danhMucDonVi: any;
  ktDiemKho: any;
  dataTable = [];

  formatter = (value) =>
    value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 0;
  parser = (value) => (value ? value.replace(/\$\s?|(,*)/g, '') : 0);

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
  listPhuongThucThanhToan: any[] = [
    {
      ma: 1,
      giaTri: 'Tiền mặt'
    }, {
      ma: 2,
      giaTri: 'Chuyển khoản'
    },
  ];

  urlUploadFile: string = `${environment.SERVICE_API}/qlnv-core/file/upload-attachment`;

  tongGiaTriCacGoiThau: number = 0;
  tenTaiLieuDinhKem: string;

  userInfo: UserLogin;

  maKeHoach: string = '';

  addModelBaoGia: any = {
    moTa: '',
    taiLieu: [],
  };
  addModelCoSo: any = {
    moTa: '',
    taiLieu: [],
  };

  taiLieuDinhKemList: any[] = [];
  listFileDinhKem: any[] = [];

  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;

  allChecked = false;
  indeterminate = false;

  editBaoGiaCache: { [key: string]: { edit: boolean; data: any } } = {};
  editCoSoCache: { [key: string]: { edit: boolean; data: any } } = {};

  detail: any;
  mapOfExpandedData2: { [maDvi: string]: any[] } = {};

  constructor(
    private modal: NzModalService,
    private danhMucService: DanhMucService,
    private deXuatKeHoachBanDauGiaService: DeXuatKeHoachBanDauGiaService,
    private spinner: NgxSpinnerService,
    private uploadFileService: UploadFileService,
    private notification: NzNotificationService,
    private fb: FormBuilder,
    public globals: Globals,
    public userService: UserService,
    private helperService: HelperService,
    private donviService: DonviService,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    private chiTieuKeHoachNamCapTongCucService: ChiTieuKeHoachNamCapTongCucService,
    private dmTieuChuanService: DanhMucTieuChuanService,
  ) {
    this.formData = this.fb.group({
      id: [],
      namKeHoach: [null],
      soKeHoach: [null, [Validators.required]],
      trichYeu: [null, [Validators.required]],
      ngayLapKeHoach: [null, [Validators.required]],
      ngayKy: [null],
      loaiHangHoa: [, [Validators.required]],
      loaiHopDong: [null, [Validators.required]],
      qdGiaoChiTieuId: [null, [Validators.required]],
      qdGiaoChiTieuNam: [null],
      tieuChuanChatLuong: [null],
      soLuong: [null],
      khoanTienDatTruoc: [null, [Validators.required]],
      thoiGianKyHd: [null, [Validators.required]],
      thoiGianDuKien: [null, [Validators.required]],
      thoiHanThanhToan: [null, [Validators.required]],
      phuongThucThanhToan: [null, [Validators.required]],
      thongBaoKhBdg: [null, [Validators.required]],
      phuongThucGiaoNhan: [null, [Validators.required]],
      thoiHanGiaoNhan: [null, [Validators.required]],
      ghiChu: [null, [Validators.required]],
      tenHangHoa: [null, [Validators.required]],
      trangThai: [null],
      maDvi: [null],
      tenDvi: [null],
    });
  }

  startEdit(index: number): void {
    this.editCache[index].edit = true;
    this.changeChiCuc(this.editCache[index].data.maDvi, null);
  }

  cancelEdit(index: number): void {
    this.editCache[index].edit = false;
  }

  saveEdit(index: number): void {
    Object.assign(this.listOfData[index], this.editCache[index].data);
    this.editCache[index].edit = false;
  }

  deleteRow(i: number): void {
    this.listOfData = this.listOfData.filter((d, index) => index !== i);
  }

  async ngOnInit() {
    this.spinner.show();
    this.userInfo = this.userService.getUserLogin();
    this.maKeHoach = '/' + this.userInfo.MA_TR;
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
    this.loadDonVi();
    if (this.idInput > 0) {
      this.loadThongTinDeXuatKeHoachLuaChonNhaThau(this.idInput);
    } else {
      this.initForm();
    }
    await Promise.all([
      this.loaiVTHHGetAll(),
      this.nguonVonGetAll(),
      this.phuongThucDauThauGetAll(),
      this.hinhThucDauThauGetAll(),
      this.loaiHopDongGetAll(),
      this.getDataChiTieu(),
    ]);
    this.spinner.hide();
  }

  initForm(dataDetail?) {
    this.formData.patchValue({
      id: dataDetail ? dataDetail.id : null,
      namKeHoach: dataDetail ? dataDetail.namKeHoach : dayjs().get('year'),
      trichYeu: dataDetail ? dataDetail.trichYeu : null,
      soKeHoach: dataDetail ? dataDetail.soKeHoach.split('/')[0] : null,
      ngayLapKeHoach: dataDetail ? dataDetail.ngayLapKeHoach : null,
      ngayKy: dataDetail ? dataDetail.ngayKy : null,
      loaiHangHoa: dataDetail ? dataDetail.loaiHangHoa : this.loaiVthhInput,
      loaiHopDong: dataDetail ? dataDetail.loaiHopDong : null,
      qdGiaoChiTieuId: dataDetail ? dataDetail.qdGiaoChiTieuId : null,
      qdGiaoChiTieuName: dataDetail ? dataDetail.qdGiaoChiTieuName : null,
      tieuChuanChatLuong: dataDetail ? dataDetail.tieuChuanChatLuong : null,
      soLuong: dataDetail ? dataDetail.soLuong : null,
      khoanTienDatTruoc: dataDetail ? dataDetail.khoanTienDatTruoc : null,
      thoiGianKyHd: dataDetail ? dataDetail.thoiGianKyHd : null,
      thoiGianDuKien: dataDetail ? dataDetail.thoiGianDuKien : null,
      thoiHanThanhToan: dataDetail ? dataDetail.thoiHanThanhToan : null,
      phuongThucThanhToan: dataDetail ? dataDetail.phuongThucThanhToan : null,
      thongBaoKhBdg: dataDetail ? dataDetail.thongBaoKhBdg : null,
      phuongThucGiaoNhan: dataDetail ? dataDetail.phuongThucGiaoNhan : null,
      thoiHanGiaoNhan: dataDetail ? dataDetail.thoiHanGiaoNhan : null,
      ghiChu: dataDetail ? dataDetail.ghiChu : null,
      tenHangHoa: dataDetail ? dataDetail.tenHangHoa : null,
      trangThai: dataDetail ? dataDetail.trangThai : '00',
      maDv: dataDetail ? dataDetail.maDv : this.userInfo.MA_DVI,
      tenDvi: dataDetail ? dataDetail.tenDvi : this.userInfo.TEN_DVI,
    });
    if (dataDetail) {
      this.fileDinhKem = dataDetail.fileDinhKems;
      this.listOfData = dataDetail.dsGtDtlList;
      this.listOfData.forEach((item) => {
        this.mapOfExpandedData2[item.idVirtual] = this.convertTreeToList2(item);
      });
      this.bindingCanCu(dataDetail.ccXdgDtlList);
    }
    this.setTitle();
  }

  bindingCanCu(data) {
    if (data && data.length > 0) {
      data.forEach((chiTiet) => {
        if (chiTiet.loaiCanCu == '00') {
          this.baoGiaThiTruongList = [...this.baoGiaThiTruongList, chiTiet];
        } else if (chiTiet.loaiCanCu == '01') {
          this.canCuKhacList = [...this.canCuKhacList, chiTiet];
        }
      });
    }
  }

  openDialogQuyetDinhGiaoChiTieu() {
    if (this.idInput == 0 && !this.isView) {
      const modalQD = this.modal.create({
        nzTitle: 'Thông tin QĐ giao chỉ tiêu kế hoạch',
        nzContent: DialogQuyetDinhGiaoChiTieuComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          capDonVi: 2
        },
      });
      modalQD.afterClose.subscribe((data) => {
        if (data) {
          console.log(data);

          this.formData.patchValue({
            qdGiaoChiTieuId: data ? data.id : null,
            qdGiaoChiTieuNam: data ? data.soQuyetDinh : null,
          });
          this.spinner.hide();
        }
      });
    }
  }

  getTenDviTable(maDvi: string) {
    let donVi = this.danhMucDonVi?.filter((item) => item.maDvi == maDvi);
    return donVi.length > 0 ? donVi[0].tenDvi : null;
  }

  getTenDiemKhoTable(maDiemKho: string) {
    let diemKho = this.ktDiemKho?.filter((item) => item.maDiemkho == maDiemKho);
    return diemKho.length > 0 ? diemKho[0].tenDiemkho : null;
  }

  async changeChiCuc(event, index?) {
    const res = await this.tinhTrangKhoHienThoiService.getChiCucByMaTongCuc(
      event,
    );
    this.listDiemKho = [];
    if (res.msg == MESSAGE.SUCCESS) {
      for (let i = 0; i < res.data?.child.length; i++) {
        const item = {
          value: res.data.child[i].maDiemkho,
          text: res.data.child[i].tenDiemkho,
          diaDiemNhap: res.data.child[i].diaDiem,
        };
        this.listDiemKho.push(item);
      }
    }
  }

  changeDiemKho(index) {
    let chiCuc = this.listChiCuc.filter(
      (item) => item.value == this.editCache[index].data.maDvi,
    );
    let diemKho = this.listDiemKho.filter(
      (item) => item.value == this.editCache[index].data.maDiemKho,
    );
    if (chiCuc.length > 0 && diemKho.length > 0) {
      this.editCache[index].data.tenDvi = chiCuc[0].text;
      this.editCache[index].data.tenDiemKho = diemKho[0].text;
      this.editCache[index].data.diaDiemNhap =
        diemKho[0]?.text + ' - ' + chiCuc[0]?.text;
    }
  }

  async loadDonVi() {
    const res = await this.donviService.layDonViCon();
    this.listChiCuc = [];
    if (res.msg == MESSAGE.SUCCESS) {
      for (let i = 0; i < res.data.length; i++) {
        const item = {
          value: res.data[i].maDvi,
          text: res.data[i].tenDvi,
        };
        this.listChiCuc.push(item);
      }
    }
  }

  selectHangHoa() {
    let data = this.loaiVthhInput;
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

  async bindingDataHangHoa(data) {
    let cloaiVthh = null;
    if (data.loaiHang == 'M' || data.loaiHang == 'LT') {
      cloaiVthh = data.ma;
      this.formData.patchValue({
        maVtu: null,
        tenVtu: null,
        loaiVatTuHangHoa: data.ma,
        tenVatTuHangHoa: data.ten,
        loaiHangHoa: data.parent.ma,
        tenHangHoa: data.parent.ten,
      });
    }
    if (data.loaiHang == 'VT') {
      if (data.cap == '3') {
        cloaiVthh = data;
        this.formData.patchValue({
          maVtu: data.ma,
          tenVtu: data.ten,
          loaiVatTuHangHoa: data.parent.ma,
          tenVatTuHangHoa: data.parent.ten,
          loaiHangHoa: data.parent.parent.ma,
          tenHangHoa: data.parent.parent.ten,
        });
      }
      if (data.cap == '2') {
        this.formData.patchValue({
          maVtu: null,
          tenVtu: null,
          loaiVatTuHangHoa: data.ma,
          tenVatTuHangHoa: data.ten,
          loaiHangHoa: data.parent.ma,
          tenHangHoa: data.parent.ten,
        });
      }
    }
    let res = await this.dmTieuChuanService.getDetailByMaHh(
      this.formData.get('cloaiVthh').value,
    );
    if (res.statusCode == API_STATUS_CODE.SUCCESS) {
      this.formData.patchValue({
        tchuanCluong: res.data.tenQchuan,
      });
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

  xoaFile(item) { }

  themMoiGoiThau(data?: DanhSachGoiThau) {
    if (!this.formData.get('loaiHangHoa').value) {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng chọn loại hàng hóa');
      return;
    }
    const modalGT = this.modal.create({
      nzTitle: 'Thêm địa điểm nhập kho',
      nzContent: DialogThemDiaDiemNhapKhoComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1162px',
      nzFooter: null,
      nzComponentParams: {
        // thongtinDauThau: data,
        // dataChiTieu: this.dataChiTieu,
        // loaiVthh: this.formData.get('loaiHangHoa').value,
        loaiHangHoa: this.formData.get("loaiHangHoa").value,
        idChiTieu: this.formData.get("qdGiaoChiTieuId").value,
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
      this.listOfData = [...this.listOfData, dsGoiThauDialog];
      let tongMucDt: number = 0;
      this.listOfData.forEach((item) => {
        tongMucDt = tongMucDt + item.soLuong * item.donGia;
        this.mapOfExpandedData2[item.idVirtual] = this.convertTreeToList2(item);
      });
      console.log(tongMucDt);
      this.formData.patchValue({
        tongMucDt: tongMucDt,
      });
    });
  }

  async save(isGuiDuyet?) {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      console.log('Invalid');
      console.log(this.formData.value);
      return;
    }
    if (this.listOfData.length == 0) {
      this.notification.error(
        MESSAGE.ERROR,
        'Danh sách kế hoạch không được để trống',
      );
      return;
    }
    let body = this.formData.value;
    if (body && body.thoiGianDuKien) {
      body.tgDkTcTuNgay = body.thoiGianDuKien ? dayjs(body.thoiGianDuKien[0]).format('YYYY-MM-DD') : null;
      body.tgDkTcDenNgay = body.thoiGianDuKien ? dayjs(body.thoiGianDuKien[1]).format('YYYY-MM-DD') : null;
    }
    body.soKeHoach = body.soKeHoach + this.maKeHoach;
    body.fileDinhKemReq = this.fileDinhKem;
    body.dsGtReq = this.listOfData;
    body.ccXdgReq = [...this.baoGiaThiTruongList, ...this.canCuKhacList];
    let res = null;
    if (this.formData.get('id').value) {
      res = await this.deXuatKeHoachBanDauGiaService.update(body);
    } else {
      res = await this.deXuatKeHoachBanDauGiaService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isGuiDuyet) {
        await this.loadThongTinDeXuatKeHoachLuaChonNhaThau(res.data.id);
        this.guiDuyet();
      } else {
        if (this.formData.get('id').value) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
          this.quayLai();
        } else {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
          this.quayLai();
        }
      }
      this.loadThongTinDeXuatKeHoachLuaChonNhaThau(res.data.id);
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
      if (!this.loaiVthhInput) {
        this.listHangHoa = res.data;
      }
      else {
        this.listHangHoa = res.data.filter(x => x.ma == this.loaiVthhInput);
      }
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
    let res2 =
      await this.chiTieuKeHoachNamCapTongCucService.loadThongTinChiTieuKeHoachCucNam(
        +this.formData.get('namKeHoach').value,
      );
    if (res2.msg == MESSAGE.SUCCESS) {
      this.dataChiTieu = res2.data;
      this.formData.patchValue({
        soQd: this.dataChiTieu.soQuyetDinh,
      });
    }
  }

  async loadThongTinDeXuatKeHoachLuaChonNhaThau(id: number) {
    await this.deXuatKeHoachBanDauGiaService
      .getDetail(id)
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          this.detail = res.data;
          this.initForm(res.data);
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
      this.baoGiaThiTruongList = this.baoGiaThiTruongList.filter(
        (item, i) => i !== index,
      );
    }
    if (table == 'can-cu-khac') {
      this.canCuKhacList = this.canCuKhacList.filter((item, i) => i !== index);
    }
    if (table == 'file-dinhkem') {
      this.fileDinhKem = this.fileDinhKem.filter((item, i) => i !== index);
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
            trangThai: '',
          };
          switch (this.formData.get('trangThai').value) {
            case '00':
            case '03':
            case '00': {
              body.trangThai = '01';
              break;
            }
            case '01': {
              body.trangThai = '09';
              break;
            }
            case '09': {
              body.trangThai = '02';
            }
          }
          let res = await this.deXuatKeHoachBanDauGiaService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(
              MESSAGE.SUCCESS,
              MESSAGE.GUI_DUYET_SUCCESS,
            );
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
            id: this.idInput,
            lyDo: text,
            trangThai: '',
          };
          switch (this.formData.get('trangThai').value) {
            case '01': {
              body.trangThai = '03';
              break;
            }
            case '09': {
              body.trangThai = '12';
              break;
            }
          }
          const res = await this.deXuatKeHoachBanDauGiaService.updateStatus(body);
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
    let trangThai = this.formData.get('trangThai').value;
    switch (trangThai) {
      case '00': {
        this.titleStatus = 'Dự thảo';
        break;
      }
      case '03': {
        this.iconButtonDuyet = 'htvbdh_tcdt_guiduyet';
        this.titleButtonDuyet = 'Lưu và gửi duyệt';
        this.titleStatus = 'Từ chối - TP';
        break;
      }
      case '01': {
        this.iconButtonDuyet = 'htvbdh_tcdt_pheduyet';
        this.titleButtonDuyet = 'Duyệt';
        this.titleStatus = 'Chờ duyệt - TP';
        break;
      }
      case '09': {
        this.iconButtonDuyet = 'htvbdh_tcdt_baocao2';
        this.titleButtonDuyet = 'Duyệt';
        this.titleStatus = 'Chờ duyệt - LĐ Cục';
        break;
      }
      case '12': {
        this.iconButtonDuyet = 'htvbdh_tcdt_guiduyet';
        this.titleButtonDuyet = 'Lưu và gửi duyệt';
        this.titleStatus = 'Từ chối - LĐ Cục';
        break;
      }
      case '02': {
        this.titleStatus = 'Đã duyệt';
        this.styleStatus = 'da-ban-hanh';
        break;
      }
      case '05': {
        this.titleStatus = 'Tổng hợp';
        this.styleStatus = 'da-ban-hanh';
        break;
      }
    }
  }

  collapse2(
    array: DanhSachGoiThau[],
    data: DanhSachGoiThau,
    $event: boolean,
  ): void {
    if (!$event) {
      if (data.children) {
        data.children.forEach((d) => {
          const target = array.find((a) => a.idVirtual === d.idVirtual)!;
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
    stack.push({ ...root, level: 0, expand: false });
    while (stack.length !== 0) {
      const node = stack.pop();
      this.visitNode2(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({
            ...node.children[i],
            level: node.level! + 1,
            expand: false,
            parent: node,
          });
        }
      }
    }
    return array;
  }

  visitNode2(
    node: DanhSachGoiThau,
    hashMap: { [maDvi: string]: boolean },
    array: DanhSachGoiThau[],
  ): void {
    if (!hashMap[node.idVirtual]) {
      hashMap[node.idVirtual] = true;
      array.push(node);
    }
  }

  deleteTaiLieuDinhKemTag(data: any, id, type) {
    if (type == 'bao-gia') {
      if (id == 0) {
        this.addModelBaoGia.taiLieu = [];
        this.addModelBaoGia.children = [];
      } else if (id > 0) {
        this.editBaoGiaCache[id].data.taiLieu = [];
        this.editBaoGiaCache[id].data.children = [];
        this.checkDataExistBaoGia(this.editBaoGiaCache[id].data);
      }
    } else if (type == 'co-so') {
      if (id == 0) {
        this.addModelCoSo.taiLieu = [];
        this.addModelCoSo.children = [];
      } else if (id > 0) {
        this.editCoSoCache[id].data.taiLieu = [];
        this.editCoSoCache[id].data.children = [];
        this.checkDataExistCoSo(this.editCoSoCache[id].data);
      }
    }
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

  openFile(event, id, type) {
    let item = {
      id: new Date().getTime(),
      text: event.name,
    };
    this.uploadFileService
      .uploadFile(event.file, event.name)
      .then((resUpload) => {
        const fileDinhKem = new FileDinhKem();
        fileDinhKem.fileName = resUpload.filename;
        fileDinhKem.fileSize = resUpload.size;
        fileDinhKem.fileUrl = resUpload.url;
        if (type == 'bao-gia') {
          if (id == 0) {
            this.addModelBaoGia.taiLieu = [];
            this.addModelBaoGia.taiLieu = [
              ...this.addModelBaoGia.taiLieu,
              item,
            ];
            this.addModelBaoGia.children = [];
            this.addModelBaoGia.children = [
              ...this.addModelBaoGia.children,
              fileDinhKem,
            ];
          } else if (id > 0) {
            this.editBaoGiaCache[id].data.taiLieu = [];
            this.editBaoGiaCache[id].data.taiLieu = [
              ...this.editBaoGiaCache[id]?.data?.taiLieu,
              item,
            ];
            this.editBaoGiaCache[id].data.children = [];
            this.editBaoGiaCache[id].data.children = [
              ...this.editBaoGiaCache[id].data.children,
              fileDinhKem,
            ];
          }
        } else if (type == 'co-so') {
          if (id == 0) {
            this.addModelCoSo.taiLieu = [];
            this.addModelCoSo.taiLieu = [...this.addModelCoSo.taiLieu, item];
            this.addModelCoSo.children = [];
            this.addModelCoSo.children = [
              ...this.addModelCoSo.children,
              fileDinhKem,
            ];
          } else if (id > 0) {
            this.editCoSoCache[id].data.taiLieu = [];
            this.editCoSoCache[id].data.taiLieu = [
              ...this.editCoSoCache[id]?.data?.taiLieu,
              item,
            ];
            this.editCoSoCache[id].data.children = [];
            this.editCoSoCache[id].data.children = [
              ...this.editCoSoCache[id].data.children,
              fileDinhKem,
            ];
          }
        }
      });
  }

  addBaoGia() {
    const taiLieuBaoGiaThiTruong = new CanCuXacDinh();
    taiLieuBaoGiaThiTruong.loaiCanCu = '00';
    taiLieuBaoGiaThiTruong.tenTlieu = this.addModelBaoGia.tenTlieu;
    taiLieuBaoGiaThiTruong.id = new Date().getTime() + 1;
    taiLieuBaoGiaThiTruong.children = this.addModelBaoGia.children;
    taiLieuBaoGiaThiTruong.taiLieu = this.addModelBaoGia.taiLieu;
    this.checkDataExistBaoGia(taiLieuBaoGiaThiTruong);
    this.clearBaoGia();
  }

  clearBaoGia() {
    this.addModelBaoGia = {
      tenTlieu: '',
      taiLieu: [],
      children: [],
    };
  }

  editRowBaoGia(id) {
    this.editBaoGiaCache[id].edit = true;
  }

  deleteRowBaoGia(data) {
    this.baoGiaThiTruongList = this.baoGiaThiTruongList.filter(
      (x) => x.id != data.id,
    );
  }

  cancelEditBaoGia(id: number): void {
    const index = this.baoGiaThiTruongList.findIndex((item) => item.id === id);
    this.editBaoGiaCache[id] = {
      data: { ...this.baoGiaThiTruongList[index] },
      edit: false,
    };
  }

  saveEditBaoGia(id: number): void {
    this.editBaoGiaCache[id].edit = false;
    this.checkDataExistBaoGia(this.editBaoGiaCache[id].data);
  }

  updatEditBaoGiaCache(): void {
    if (this.baoGiaThiTruongList && this.baoGiaThiTruongList.length > 0) {
      this.baoGiaThiTruongList.forEach((item) => {
        this.editBaoGiaCache[item.id] = {
          edit: false,
          data: { ...item },
        };
      });
    }
  }

  checkDataExistBaoGia(data) {
    if (this.baoGiaThiTruongList && this.baoGiaThiTruongList.length > 0) {
      let index = this.baoGiaThiTruongList.findIndex((x) => x.id == data.id);
      if (index != -1) {
        this.baoGiaThiTruongList.splice(index, 1);
      }
    } else {
      this.baoGiaThiTruongList = [];
    }
    this.baoGiaThiTruongList = [...this.baoGiaThiTruongList, data];
    this.updatEditBaoGiaCache();
  }

  addCoSo() {
    const taiLieuCanCuKhac = new CanCuXacDinh();
    taiLieuCanCuKhac.loaiCanCu = '01';
    taiLieuCanCuKhac.tenTlieu = this.addModelCoSo.tenTlieu;
    taiLieuCanCuKhac.id = new Date().getTime() + 1;
    taiLieuCanCuKhac.children = this.addModelCoSo.children;
    taiLieuCanCuKhac.taiLieu = this.addModelCoSo.taiLieu;
    this.checkDataExistCoSo(taiLieuCanCuKhac);
    this.clearCoSo();
  }

  clearCoSo() {
    this.addModelCoSo = {
      tenTlieu: '',
      taiLieu: [],
      children: [],
    };
  }

  editRowCoSo(id) {
    this.editCoSoCache[id].edit = true;
  }

  deleteRowCoSo(data) {
    this.canCuKhacList = this.canCuKhacList.filter((x) => x.id != data.id);
  }

  cancelEditCoSo(id: number): void {
    const index = this.canCuKhacList.findIndex((item) => item.id === id);
    this.editCoSoCache[id] = {
      data: { ...this.canCuKhacList[index] },
      edit: false,
    };
  }

  saveEditCoSo(id: number): void {
    this.editCoSoCache[id].edit = false;
    this.checkDataExistCoSo(this.editCoSoCache[id].data);
  }

  updatEditCoSoCache(): void {
    if (this.canCuKhacList && this.canCuKhacList.length > 0) {
      this.canCuKhacList.forEach((item) => {
        this.editCoSoCache[item.id] = {
          edit: false,
          data: { ...item },
        };
      });
    }
  }

  checkDataExistCoSo(data) {
    if (this.canCuKhacList && this.canCuKhacList.length > 0) {
      let index = this.canCuKhacList.findIndex((x) => x.id == data.id);
      if (index != -1) {
        this.canCuKhacList.splice(index, 1);
      }
    } else {
      this.canCuKhacList = [];
    }
    this.canCuKhacList = [...this.canCuKhacList, data];
    this.updatEditCoSoCache();
  }

  checkCanUpdate() {
    return false;
  }

  deleteTaiLieuDinhKemFormTag(data: any) {
    this.taiLieuDinhKemList = this.taiLieuDinhKemList.filter(
      (x) => x.id !== data.id,
    );
  }

  openFileTaiLieu(event) {
    let item = {
      id: new Date().getTime(),
      text: event.name,
    };
    this.taiLieuDinhKemList.push(item);
  }

  downloadFileKeHoach(event) {
    let body = {
      dataType: '',
      dataId: 0,
    };
    switch (event) {
      case 'tai-lieu-dinh-kem':
        // body.dataType = this.deXuatDieuChinh.fileDinhKems[0].dataType;
        // body.dataId = this.deXuatDieuChinh.fileDinhKems[0].dataId;
        // if (this.taiLieuDinhKemList.length > 0) {
        //   this.chiTieuKeHoachNamService.downloadFileKeHoach(body).subscribe((blob) => {
        //     saveAs(blob, this.deXuatDieuChinh.fileDinhKems.length > 1 ? 'Tai-lieu-dinh-kem.zip' : this.deXuatDieuChinh.fileDinhKems[0].fileName);
        //   });
        // }
        break;
      default:
        break;
    }
  }

  openDialogGoiThau(data?: any) {
    this.modal.create({
      nzTitle: 'Thông tin gói thầu',
      nzContent: DialogThemMoiGoiThauComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '800px',
      nzFooter: null,
      nzComponentParams: {
        data: data,
      },
    });
  }

  xoaItem(data: any) { }

  async changePageIndex(event) {
    this.spinner.show();
    try {
      this.page = event;

      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async changePageSize(event) {
    this.spinner.show();
    try {
      this.pageSize = event;
      if (this.page === 1) {
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }
}
