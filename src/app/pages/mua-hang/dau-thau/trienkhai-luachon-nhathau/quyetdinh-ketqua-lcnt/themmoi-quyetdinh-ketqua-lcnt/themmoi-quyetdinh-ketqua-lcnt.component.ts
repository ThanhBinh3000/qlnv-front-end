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
import { environment } from 'src/environments/environment';
import { QuyetDinhPheDuyetKeHoachLCNTService } from 'src/app/services/quyetDinhPheDuyetKeHoachLCNT.service';
import { dauThauGoiThauService } from 'src/app/services/dauThauGoiThau.service';
import { QuyetDinhPheDuyetKetQuaLCNTService } from 'src/app/services/quyetDinhPheDuyetKetQuaLCNT.service';

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
  selector: 'app-themmoi-quyetdinh-ketqua-lcnt',
  templateUrl: './themmoi-quyetdinh-ketqua-lcnt.component.html',
  styleUrls: ['./themmoi-quyetdinh-ketqua-lcnt.component.scss']
})
export class ThemmoiQuyetdinhKetquaLcntComponent implements OnInit {
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
  listPheDuyetKhlcnt: any[] = [];
  listGoiThau: any[] = [];
  titleStatus: string = '';
  titleButtonDuyet: string = '';
  iconButtonDuyet: string = '';
  danhMucDonVi: any;
  ktDiemKho: any;
  urlUploadFile: string = `${environment.SERVICE_API}/qlnv-gateway/qlnv-core/file/upload-attachment`;
  fileList: any[] = [];
  id: number;

  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = false;
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
    private quyetDinhPheDuyetKeHoachLCNTService: QuyetDinhPheDuyetKeHoachLCNTService,
    private dauThauGoiThauService: dauThauGoiThauService,
    private quyetDinhPheDuyetKetQuaLCNTService: QuyetDinhPheDuyetKetQuaLCNTService
  ) {
    this.formData = this.fb.group(
      {
        id: [],
        soQd: [, [Validators.required]],
        ngayQd: [null, [Validators.required]],
        namKhoach: [, [Validators.required]],
        loaiVthh: [convertVthhToId(this.router.url.split('/')[4]), [Validators.required]],
        veViec: [null, [Validators.required]],
        canCu: [null, [Validators.required]],
        ngayQdPd: [null, [Validators.required]],
        idGoiThau: [null, [Validators.required]],
        ghiChu: [null, [Validators.required]],
        trungThau: [null, [Validators.required]],
        trangThai: [''],
        maDvi: []
      }
    );
    this.danhMucDonVi = JSON.parse(sessionStorage.getItem('danhMucDonVi'));
    this.ktDiemKho = JSON.parse(sessionStorage.getItem('ktDiemKho'));
  }

  xoaFile(any?) {

  }

  handleChange(event) {

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

  ngOnInit(): void {
    this.userInfo = this.userService.getUserLogin();
    console.log("🚀 ~ file: themmoi-quyetdinh-ketqua-lcnt.component.ts ~ line 183 ~ ThemmoiQuyetdinhKetquaLcntComponent ~ ngOnInit ~ this.userInfo", this.userInfo)
    this.id = +this.routerActive.snapshot.paramMap.get('id');
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
    this.listVthh = LIST_VAT_TU_HANG_HOA;
    if (this.id > 0) {
      this.getDetail(this.id);
    }
    this.loadDanhMucHang();
    Promise.all([
      this.nguonVonGetAll(),
      this.phuongThucDauThauGetAll(),
      this.hinhThucDauThauGetAll(),
      this.loaiHopDongGetAll(),
    ]);
  }


  async getDetail(id: number) {
    let res = await this.quyetDinhPheDuyetKetQuaLCNTService.getDetail(id);
    if (res.msg == MESSAGE.SUCCESS) {
      this.initForm(res.data);
    }
  }

  initForm(dataDetail?) {
    this.formData.patchValue({
      id: dataDetail ? dataDetail.id : null,
      soQd: dataDetail ? dataDetail.soQd : null,
      ngayQd: dataDetail ? dataDetail.ngayQd : null,
      namKhoach: dataDetail ? dataDetail.namKhoach : null,
      loaiVthh: dataDetail ? dataDetail.loaiVthh : convertVthhToId(this.router.url.split('/')[4]),
      veViec: dataDetail ? dataDetail.veViec : null,
      canCu: dataDetail.canCu ? dataDetail.canCu : null,
    })
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

  async save() {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      return;
    }
    let body = this.formData.value;
    let res = await this.quyetDinhPheDuyetKetQuaLCNTService.create(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (this.formData.get('id').value) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      } else {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
      }
      // this.initForm(res.data);
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

  async loaiHopDongGetAll() {
    this.listLoaiHopDong = [];
    let res = await this.danhMucService.loaiHopDongGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiHopDong = res.data;
    }
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

  onChangeSoQdKh(event) {
    if (event) {
      let data = this.listPheDuyetKhlcnt.filter(item => item.soQd === event);
      this.formData.patchValue({
        ngayQdPd: data[0].ngayQd
      })
      this.listGoiThau = data[0].children1;
    }
  }

  onChangeGoiThau(event) {
    if (event) {
      let data = this.dauThauGoiThauService.chiTietByGoiThauId(event);
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
          // this.initForm(res.data);
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
}
