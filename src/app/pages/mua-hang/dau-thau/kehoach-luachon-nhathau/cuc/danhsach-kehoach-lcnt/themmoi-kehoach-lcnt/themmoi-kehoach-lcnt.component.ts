import { cloneDeep } from 'lodash';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Component, OnInit } from '@angular/core';
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
@Component({
  selector: 'app-themmoi-kehoach-lcnt',
  templateUrl: './themmoi-kehoach-lcnt.component.html',
  styleUrls: ['./themmoi-kehoach-lcnt.component.scss']
})
export class ThemmoiKehoachLcntComponent implements OnInit {
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
  titleStatus: string = '';
  titleButtonDuyet: string = '';
  iconButtonDuyet: string = '';
  danhMucDonVi: any;
  ktDiemKho: any;

  id: number;

  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = false;
  i = 0;
  editId: string | null = null;
  tabSelected: string = 'thongTinChung';
  listPhuongThucDauThau: any[] = [];
  listNguonVon: any[] = [];
  listNam: any[] = [];
  listVthh: any[] = [];
  listHinhThucDauThau: any[] = [];
  listLoaiHopDong: any[] = [];
  chiTietThongTinDXKHLCNT: ThongTinDeXuatKeHoachLuaChonNhaThau = new ThongTinDeXuatKeHoachLuaChonNhaThau();
  thongTinChungDXKHLCNT: ThongTinChung = new ThongTinChung();
  listOfMapData: VatTu[];
  listOfMapDataClone: VatTu[];
  mapOfExpandedData: { [key: string]: VatTu[] } = {};
  selectHang: any = { ten: '' };
  errorInputRequired: string = 'Dữ liệu không được để trống.';
  thongTinDXKHLCNTInput: ThongTinDeXuatKeHoachLuaChonNhaThauInput = new ThongTinDeXuatKeHoachLuaChonNhaThauInput();

  // editCache: { [key: string]: { edit: boolean; data: DanhSachGoiThau }; } = {};

  dsGoiThauClone: Array<DanhSachGoiThau>;
  baoGiaThiTruongList: CanCuXacDinh[] = [];
  canCuKhacList: CanCuXacDinh[] = [];

  // muoiIdDefault: number = 78;
  tongGiaTriCacGoiThau: number = 0;
  tenTaiLieuDinhKem: string;

  lastBreadcrumb: string;
  userInfo: UserLogin;

  selectedTab: string = 'tong-hop';

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
    private observableService: ObservableService,
  ) {
    this.formData = this.fb.group(
      {
        id: [],
        soQd: [, [Validators.required]],
        soDxuat: [null, [Validators.required]],
        maHangHoa: [null],
        trichYeu: [null],
        ghiChu: [null, [Validators.required]],
        namKhoach: [, [Validators.required]],
        loaiVthh: [, [Validators.required]],
        ngayKy: [null, [Validators.required]],
        trangThai: [''],
        maDvi: []
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
    // this.dsGoiThauClone?.forEach((goiThau) => {
    //   goiThau.thanhTien = (goiThau.donGia * goiThau.soLuong * 1000).toString();
    //   this.tongGiaTriCacGoiThau += +goiThau.thanhTien;
    // });
    // if (this.tongGiaTriCacGoiThau > 10000000000) {
    //   this.thongTinChungDXKHLCNT.blanhDthau = '3%';
    // } else {
    //   this.thongTinChungDXKHLCNT.blanhDthau = '1%';
    // }
  }

  deleteRow(i: number): void {
    this.listOfData = this.listOfData.filter((d, index) => index !== i);
    // this.listOfData = this.listOfData.filter(d => d.idVirtual !== idVirtual);
    // this.chiTietThongTinDXKHLCNT.children2 =
    //   this.chiTietThongTinDXKHLCNT.children2.filter(
    //     (d) => d.idVirtual !== idVirtual,
    //   );
    // Object.assign(this.dsGoiThauClone, this.chiTietThongTinDXKHLCNT.children2);
  }

  ngOnInit(): void {
    this.userInfo = this.userService.getUserLogin();
    this.id = +this.routerActive.snapshot.paramMap.get('id');
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
    this.listVthh = LIST_VAT_TU_HANG_HOA;
    this.loadDonVi();

    if (this.id > 0) {
      this.loadThongTinDeXuatKeHoachLuaChonNhaThau(this.id);
    } else {
      this.initForm();
    }
    this.loadDanhMucHang();
    Promise.all([
      this.nguonVonGetAll(),
      this.phuongThucDauThauGetAll(),
      this.hinhThucDauThauGetAll(),
      this.loaiHopDongGetAll(),
    ]);
  }

  initForm(dataDetail?) {
    let vthh = this.router.url.split('/')[4];
    this.formData.patchValue(
      {
        id: dataDetail ? dataDetail.id : null,
        soQd: dataDetail ? dataDetail.soQd : null,
        soDxuat: dataDetail ? dataDetail.soDxuat : null,
        maHangHoa: dataDetail ? dataDetail.maHangHoa : null,
        trichYeu: dataDetail ? dataDetail.trichYeu : null,
        ghiChu: dataDetail ? dataDetail.ghiChu : null,
        namKhoach: dataDetail ? dataDetail.namKhoach : dayjs().get('year'),
        loaiVthh: dataDetail ? dataDetail.loaiVthh : convertVthhToId(vthh),
        ngayKy: dataDetail ? dataDetail.ngayKy : null,
        trangThai: dataDetail ? dataDetail.trangThai : '',
        maDvi: this.userInfo.MA_DVI
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
        donGia: dataDetail?.children1 ? dataDetail.children1.donGia : null,
        tgianTbao: dataDetail?.children1 ? dataDetail.children1.tgianTbao : null,
        tgianPhatHanh: dataDetail?.children1 ? dataDetail.children1.tgianPhatHanh : null,
        tgianMoThau: dataDetail?.children1 ? dataDetail.children1.tgianMoThau : null,
        tgianDongThau: dataDetail?.children1 ? dataDetail.children1.tgianDongThau : null,
        tgianThHienHd: dataDetail?.children1 ? dataDetail.children1.tgianThHienHd : null,
        tgianNhapHang: dataDetail?.children1 ? dataDetail.children1.tgianNhapHang : null,
        maDvi: this.userInfo.MA_DVI
      }
    )
    // this.tenTaiLieuDinhKem = dataDetail?.children ? dataDetail?.children[0].fileName : null;
    this.listOfData = dataDetail?.children2 ?? [];
    this.editCache = {};
    this.listOfData?.forEach((value, index) => {
      this.editCache[index] = {
        edit: false,
        data: { ...value }
      };
    })
    this.setTitle();
    this.getNameDanhSachDvi(this.formThongTinChung.get('tenDvi').value)
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
          'text': res.data.child[i].tenDiemkho
        };
        this.listDiemKho.push(item);
      }
    }

    // if (index > -1) {
    //   this.editCache[index].data.maDiemKho = "";
    //   this.editCache[index].data.diaDiemNhap = "";
    // };
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
                this.tenTaiLieuDinhKem = resUpload.filename;
                this.chiTietThongTinDXKHLCNT.children = [];
                this.chiTietThongTinDXKHLCNT.children = [
                  ...this.chiTietThongTinDXKHLCNT.children,
                  fileDinhKem,
                ];
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
                this.chiTietThongTinDXKHLCNT?.children3.push(
                  taiLieuBaoGiaThiTruong,
                );
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
                this.chiTietThongTinDXKHLCNT?.children3.push(taiLieuCanCuKhac);
                this.canCuKhacList = [...this.canCuKhacList, taiLieuCanCuKhac];
                break;
              default:
                break;
            }
          });
      }
    });
  }

  themMoiGoiThau(data?: DanhSachGoiThau) {
    const modalGT = this.modal.create({
      nzTitle: 'Thông tin gói thầu',
      nzContent: DialogThemMoiVatTuComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        thongtinDauThau: data,
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
      dsGoiThauDialog.id = +res.value.id;
      dsGoiThauDialog.soLuong = +res.value.soLuong;
      dsGoiThauDialog.thanhTien = res.value.thanhTien;
      dsGoiThauDialog.idVirtual = new Date().getTime();

      // this.chiTietThongTinDXKHLCNT.children2 = [
      //   ...this.chiTietThongTinDXKHLCNT.children2,
      //   dsGoiThauDialog,
      // ];

      this.listOfData = [
        ...this.listOfData,
        dsGoiThauDialog
      ]

      this.listOfData.forEach((value, index) => {
        this.editCache[index] = {
          edit: false,
          data: { ...value }
        };
      })
      // this.cacheData = this.listOfData;
      // this.dsGoiThauClone = this.chiTietThongTinDXKHLCNT.children2;
      // this.dsGoiThauClone?.forEach((goiThau) => {
      //   this.tongGiaTriCacGoiThau += +goiThau.thanhTien;
      // });
      // if (this.tongGiaTriCacGoiThau > 10000000000) {
      //   this.thongTinChungDXKHLCNT.blanhDthau = '3%';
      // } else {
      //   this.thongTinChungDXKHLCNT.blanhDthau = '1%';
      // }
    });
  }

  async save() {
    // console.log(this.formData.value);
    this.helperService.markFormGroupTouched(this.formData);
    this.helperService.markFormGroupTouched(this.formThongTinChung);
    if (this.formData.invalid) {
      return;
    }
    if (this.formThongTinChung.invalid) {
      return;
    }
    let body = this.formData.value;
    body.children = this.fileDinhKem;
    body.children1 = this.formThongTinChung.value;
    body.children2 = this.listOfData;
    body.chidlren3 = this.baoGiaThiTruongList;
    console.log(body);
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
      this.initForm(res.data);
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  redirectToDanhSachDauThau() {
    this.router.navigate(['nhap/dau-thau/danh-sach-dau-thau']);
  }

  openDialogQuyetDinhGiaoChiTieu() {
    const modalQD = this.modal.create({
      nzTitle: 'Thông tin QĐ giao chỉ tiêu kế hoạch',
      nzContent: DialogQuyetDinhGiaoChiTieuComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalQD.afterClose.subscribe((data) => {
      if (data) {
        this.formData.patchValue({
          soQd: data.soQuyetDinh,
        });
      }
    });
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

  async loaiHopDongGetAll() {
    this.listLoaiHopDong = [];
    let res = await this.danhMucService.loaiHopDongGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiHopDong = res.data;
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

  convertDataCanCuXacDinh() {
    this.chiTietThongTinDXKHLCNT.children3.forEach((chiTiet) => {
      if (chiTiet.loaiCanCu == '00') {
        this.baoGiaThiTruongList.push(chiTiet);
      } else if (chiTiet.loaiCanCu == '01') {
        this.canCuKhacList.push(chiTiet);
      }
    });
  }

  convertTreeToList(root: VatTu): VatTu[] {
    const stack: VatTu[] = [];
    const array: VatTu[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: false });
    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.child) {
        for (let i = node.child.length - 1; i >= 0; i--) {
          stack.push({
            ...node.child[i],
            level: node.level! + 1,
            expand: false,
            parent: node,
          });
        }
      }
    }
    return array;
  }

  visitNode(
    node: VatTu,
    hashMap: { [id: string]: boolean },
    array: VatTu[],
  ): void {
    if (!hashMap[node.id]) {
      hashMap[node.id] = true;
      array.push(node);
    }
  }

  collapse(array: VatTu[], data: VatTu, $event: boolean): void {
    if (!$event) {
      if (data.child) {
        data.child.forEach((d) => {
          const target = array.find((a) => a.id === d.id)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  searchHangHoa(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.listOfMapData = this.listOfMapDataClone;
    } else {
      this.listOfMapData = this.listOfMapDataClone.filter(
        (x) => x.ten.toLowerCase().indexOf(value.toLowerCase()) != -1,
      );
    }
  }

  selectHangHoa(vatTu: any) {
    this.formData.patchValue({
      hangHoa: vatTu.ten,
      maHangHoa: vatTu.ma,
    });
  }
  loadDanhMucHang() {
    this.danhMucService.loadDanhMucHangHoa().subscribe((hangHoa) => {
      if (hangHoa.msg == MESSAGE.SUCCESS) {
        this.listOfMapData = hangHoa.data;
        this.listOfMapDataClone = [...this.listOfMapData];
        this.listOfMapData.forEach((item) => {
          this.mapOfExpandedData[item.id] = this.convertTreeToList(item);
        });
      }
    });
  }
  convertTienTobangChu(tien: number): string {
    return VNnum2words(tien);
  }

  saveThongTinDeXuatKeHoachLCNT(isGuiDuyet?: boolean) {
    this.chiTietThongTinDXKHLCNT.qdCanCu = this.formData.get('canCu').value;
    this.chiTietThongTinDXKHLCNT.soDxuat = this.formData.get('soDeXuat').value;
    this.chiTietThongTinDXKHLCNT.loaiVthh = this.formData.get('hangHoa').value;
    this.chiTietThongTinDXKHLCNT.trichYeu = this.formData.get('trichYeu').value;
    this.chiTietThongTinDXKHLCNT.ghiChu = this.formData.get('ghiChu').value;
    this.thongTinDXKHLCNTInput = cloneDeep(this.chiTietThongTinDXKHLCNT);

    this.thongTinChungDXKHLCNT.tuNgayThHien = this.thongTinChungDXKHLCNT
      .tuNgayThHien
      ? dayjs(this.thongTinChungDXKHLCNT.tuNgayThHien).format('YYYY-MM-DD')
      : null;
    this.thongTinChungDXKHLCNT.denNgayThHien = this.thongTinChungDXKHLCNT
      .denNgayThHien
      ? dayjs(this.thongTinChungDXKHLCNT.denNgayThHien).format('YYYY-MM-DD')
      : null;
    this.thongTinChungDXKHLCNT.tgianTbao = this.thongTinChungDXKHLCNT.tgianTbao
      ? dayjs(this.thongTinChungDXKHLCNT.tgianTbao).format('YYYY-MM-DD')
      : null;
    this.thongTinChungDXKHLCNT.tgianDongThau = this.thongTinChungDXKHLCNT
      .tgianDongThau
      ? dayjs(this.thongTinChungDXKHLCNT.tgianDongThau).format('YYYY-MM-DD')
      : null;
    this.thongTinChungDXKHLCNT.tgianMoThau = this.thongTinChungDXKHLCNT
      .tgianMoThau
      ? dayjs(this.thongTinChungDXKHLCNT.tgianMoThau).format('YYYY-MM-DD')
      : null;
    this.thongTinChungDXKHLCNT.tgianThHienHd = this.thongTinChungDXKHLCNT
      .tgianThHienHd
      ? dayjs(this.thongTinChungDXKHLCNT.tgianThHienHd).format('YYYY-MM-DD')
      : null;
    this.thongTinChungDXKHLCNT.tgianNhapHang = this.thongTinChungDXKHLCNT
      .tgianNhapHang
      ? dayjs(this.thongTinChungDXKHLCNT.tgianNhapHang).format('YYYY-MM-DD')
      : null;

    this.chiTietThongTinDXKHLCNT.children1 = [];
    this.chiTietThongTinDXKHLCNT.children1[0] = this.thongTinChungDXKHLCNT;

    this.thongTinDXKHLCNTInput.fileDinhKems =
      this.chiTietThongTinDXKHLCNT.children;
    this.thongTinDXKHLCNTInput.detail1 = this.chiTietThongTinDXKHLCNT.children1;
    this.thongTinDXKHLCNTInput.detail2 = this.chiTietThongTinDXKHLCNT.children2;
    this.thongTinDXKHLCNTInput.detail3 = this.chiTietThongTinDXKHLCNT.children3;
    if (this.thongTinDXKHLCNTInput?.detail3?.length > 0) {
      this.thongTinDXKHLCNTInput.detail3.forEach((thongTin) => {
        thongTin.fileDinhKems = thongTin.children;
        delete thongTin.children;
      });
    }
    delete this.thongTinDXKHLCNTInput.children;
    delete this.thongTinDXKHLCNTInput.children1;
    delete this.thongTinDXKHLCNTInput.children2;
    delete this.thongTinDXKHLCNTInput.children3;

    this.thongTinDXKHLCNTInput?.detail2?.forEach((thongTin) => {
      delete thongTin.idVirtual;
    });

    if (this.id > 0) {
      this.spinner.show();
      this.dauThauService
        .suaThongTinKeHoachLCNT(this.thongTinDXKHLCNTInput)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            if (isGuiDuyet) {
              let body = {
                id: res.data.id,
                lyDoTuChoi: null,
                trangThai: '01',
              };
              this.dauThauService.updateStatus(body);
              if (res.msg == MESSAGE.SUCCESS) {
                this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
                this.redirectChiTieuKeHoachNam();
              } else {
                this.notification.error(MESSAGE.ERROR, res.msg);
              }
            } else {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
              this.redirectChiTieuKeHoachNam();
            }
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.redirectChiTieuKeHoachNam();
        })
        .catch((err) => { })
        .finally(() => {
          this.spinner.hide();
        });
    } else {
      this.spinner.show();
      this.dauThauService
        .themThongTinKeHoachLCNT(this.thongTinDXKHLCNTInput)
        .then((res) => {
          if (isGuiDuyet) {
            let body = {
              id: res.data.id,
              lyDoTuChoi: null,
              trangThai: '01',
            };
            this.dauThauService.updateStatus(body);
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
              this.redirectChiTieuKeHoachNam();
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
          } else {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
            this.redirectChiTieuKeHoachNam();
          }
        })
        .catch((err) => { })
        .finally(() => {
          this.spinner.hide();
        });
    }
  }

  downloadFile(taiLieu: any) {
    this.uploadFileService.downloadFile(taiLieu.fileUrl).subscribe((blob) => {
      saveAs(blob, taiLieu.fileName);
    });
  }

  calclatorThanhTien() {
    // this.editCache[data.id].data.soLuong
  }

  deleteTaiLieu(idVirtual: number) {
    this.chiTietThongTinDXKHLCNT.children3 =
      this.chiTietThongTinDXKHLCNT.children3.filter(
        (chiTiet) => chiTiet.idVirtual !== idVirtual,
      );

    this.baoGiaThiTruongList = this.baoGiaThiTruongList.filter(
      (cc1) => cc1.idVirtual !== idVirtual,
    );
    this.canCuKhacList = this.canCuKhacList.filter(
      (cc2) => cc2.idVirtual !== idVirtual,
    );
  }

  redirectChiTieuKeHoachNam() {
    this.router.navigate(['/nhap/dau-thau/danh-sach-dau-thau']);
  }

  quayLai() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn quay lại ?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        let loatVthh = this.router.url.split('/')[4]
        this.router.navigate(['/mua-hang/dau-thau/kehoach-luachon-nhathau/' + loatVthh + '/danh-sach']);
      },
    });
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
          this.initForm(res.data);
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
            let loatVthh = this.router.url.split('/')[4]
            this.router.navigate(['/mua-hang/dau-thau/kehoach-luachon-nhathau/' + loatVthh + '/danh-sach']);
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

  pheDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn phê duyệt?',
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
            trangThai: '02',
          };
          const res = await this.dauThauService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
            this.redirectChiTieuKeHoachNam();
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

  huyBo() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn hủy bỏ các thao tác đang làm?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.redirectChiTieuKeHoachNam();
      },
    });
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
}
