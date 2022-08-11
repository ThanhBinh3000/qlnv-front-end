import { uniqBy } from 'lodash';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
import { API_STATUS_CODE, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
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
import { DialogThemMoiGoiThauComponent } from 'src/app/components/dialog/dialog-them-moi-goi-thau/dialog-them-moi-goi-thau.component';
import { DanhMucTieuChuanService } from 'src/app/services/danhMucTieuChuan.service';
import { DxuatKhLcntVatTuService } from 'src/app/services/dxuatKhLcntVatTuService.service';


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
  selector: 'app-themmoi-kehoach-lcnt-tong-cuc',
  templateUrl: './themmoi-kehoach-lcnt-tong-cuc.component.html',
  styleUrls: ['./themmoi-kehoach-lcnt-tong-cuc.component.scss']
})
export class ThemmoiKehoachLcntTongCucComponent implements OnInit {
  @Input()
  loaiVthh: string;
  @Input()
  idInput: number;

  @Output()
  showListEvent = new EventEmitter<any>();

  searchValue = '';
  searchFilter = {
    soDeXuat: '',
  };

  editCache: { [key: string]: { edit: boolean; data: DanhSachGoiThau } } = {};

  formData: FormGroup;
  // formThongTinChung: FormGroup;
  // listOfData: DanhSachGoiThau[] = [];
  cacheData: DanhSachGoiThau[] = [];
  fileDinhKem: Array<FileDinhKem> = [];
  userLogin: UserLogin
  titleStatus: string = '';
  titleButtonDuyet: string = '';
  iconButtonDuyet: string = '';
  styleStatus: string = 'du-thao-va-lanh-dao-duyet';
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

  urlUploadFile: string = `${environment.SERVICE_API}/qlnv-core/file/upload-attachment`;

  tongGiaTriCacGoiThau: number = 0;
  tenTaiLieuDinhKem: string;

  userInfo: UserLogin;

  maTrinh: string = '';

  addModelBaoGia: any = {
    moTa: '',
    taiLieu: [],
  };
  addModelCoSo: any = {
    moTa: '',
    taiLieu: [],
  };

  listOfOption: any[] = [
    {
      label: 'a',
      value: 1
    }, {
      label: 'b',
      value: 2
    }, {
      label: 'c',
      value: 3
    },
  ]

  taiLieuDinhKemList: any[] = [];
  dataGoiThau: any[] = [];

  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;

  allChecked = false;
  indeterminate = false;

  editBaoGiaCache: { [key: string]: { edit: boolean; data: any } } = {};
  editCoSoCache: { [key: string]: { edit: boolean; data: any } } = {};

  listVatTu = [];
  listVatTuUniq = [];
  constructor(
    private modal: NzModalService,
    private danhMucService: DanhMucService,
    private dauThauService: DanhSachDauThauService,
    private dxuatKhLcntVatTuService: DxuatKhLcntVatTuService,
    private spinner: NgxSpinnerService,
    private uploadFileService: UploadFileService,
    private notification: NzNotificationService,
    private fb: FormBuilder,
    public globals: Globals,
    public userService: UserService,
    private helperService: HelperService,
    private chiTieuKeHoachNamCapTongCucService: ChiTieuKeHoachNamCapTongCucService,

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
        ngayKy: [null, [Validators.required]],
        trangThai: [''],
        maDvi: [],
        tenDuAn: [null, [Validators.required]],
        tenDvi: [null],
        tongMucDt: [null],
        nguonVon: [null, [Validators.required]],
        dienGiai: [null],
        tchuanCluong: [null],
        tgianThienHd: [null, [Validators.required]],
      }
    );
    this.formData.controls['nguonVon'].valueChanges.subscribe(value => {
      if (value) {
        this.bindingDataNguonVon()
      }
    });
  }

  async ngOnInit() {
    this.spinner.show();
    this.userInfo = this.userService.getUserLogin();
    this.maTrinh = '/' + this.userInfo.MA_TR;
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
    if (this.idInput > 0) {
      this.loadThongTinDeXuatKeHoachLuaChonNhaThau(this.idInput);
    } else {
      this.initForm();
    }
    await this.nguonVonGetAll();
    await this.getDataChiTieu()
    this.spinner.hide();
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
        // tenVthh: dataDetail ? dataDetail.tenVthh : null,
        ngayKy: dataDetail ? dataDetail.ngayKy : null,
        trangThai: dataDetail ? dataDetail.trangThai : '00',
        maDvi: dataDetail ? dataDetail.maDvi : this.userInfo.MA_DVI,
        // cloaiVthh: dataDetail ? dataDetail.cloaiVthh : null,
        // tenCloaiVthh: dataDetail ? dataDetail.tenCloaiVthh : null,
        maVtu: dataDetail ? dataDetail.maVtu : null,
        tenVtu: dataDetail ? dataDetail.tenVtu : null,
        tenDuAn: dataDetail ? dataDetail.tenDuAn : null,
        tenDvi: dataDetail ? dataDetail.tenDvi : this.userInfo.TEN_DVI,
        tongMucDt: dataDetail ? dataDetail.tongMucDt : null,
        nguonVon: dataDetail ? dataDetail.nguonVon : null,
        tchuanCluong: dataDetail ? dataDetail.tchuanCluong : null,
        loaiHdong: dataDetail ? dataDetail.loaiHdong : null,
        hthucLcnt: dataDetail ? dataDetail.hthucLcnt : null,
        pthucLcnt: dataDetail ? dataDetail.pthucLcnt : null,
        tgianBdauTchuc: dataDetail ? dataDetail.tgianBdauTchuc : null,
        tgianMthau: dataDetail ? dataDetail.tgianMthau : null,
        tgianDthau: dataDetail ? dataDetail.tgianDthau : null,
        gtriDthau: dataDetail ? dataDetail.gtriDthau : null,
        gtriHdong: dataDetail ? dataDetail.gtriHdong : null,
        tgianThienHd: dataDetail ? dataDetail.tgianThienHd : null,
        tgianNhang: dataDetail ? dataDetail.tgianNhang : null,
      }
    );
    if (dataDetail) {
      this.fileDinhKem = dataDetail.fileDinhKems
      this.dataGoiThau = dataDetail.dsGtDtlList
    }
    this.setTitle();
  }

  async save(isGuiDuyet?) {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      console.log("Invalid");
      console.log(this.formData.value);
      return;
    }
    if (this.dataGoiThau.length == 0) {
      this.notification.error(MESSAGE.ERROR, this.userService.isTongCuc ? 'Danh sách gói thầu không được để trống' : 'Danh sách kế hoạch không được để trống');
      return;
    }
    let body = this.formData.value;
    body.soDxuat = body.soDxuat + this.maTrinh;
    body.dsGtReq = this.dataGoiThau;
    body.fileDinhKemReq = this.fileDinhKem;
    let res = null;
    if (this.formData.get('id').value) {
      res = await this.dxuatKhLcntVatTuService.update(body);
    } else {
      res = await this.dxuatKhLcntVatTuService.create(body);
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
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async nguonVonGetAll() {
    this.listNguonVon = [];
    let res = await this.danhMucService.nguonVonGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listNguonVon = res.data;
    }
  }

  async getDataChiTieu() {
    let res2 = await this.chiTieuKeHoachNamCapTongCucService.loadThongTinChiTieuKeHoachCucNam(+this.formData.get('namKhoach').value)
    if (res2.msg == MESSAGE.SUCCESS) {
      this.dataChiTieu = res2.data;
      this.listVatTu = res2.data.khVatTuList;
      this.listVatTuUniq = uniqBy(res2.data.khVatTuList, 'maVatTuCha', 'tenVatTuCha');
      this.formData.patchValue({
        soQd: this.dataChiTieu.soQuyetDinh,
      });
    }
  }

  async loadThongTinDeXuatKeHoachLuaChonNhaThau(id: number) {
    await this.dxuatKhLcntVatTuService.getDetail(id).then((res) => {
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
              body.trangThai = '02';
              break;
            }
          }
          // this.save()
          let res = await this.dxuatKhLcntVatTuService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, body.trangThai == '01' ? MESSAGE.GUI_DUYET_SUCCESS : MESSAGE.PHE_DUYET_SUCCESS);
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
            trangThai: ''
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
        this.titleButtonDuyet = 'Lưu và gửi duyệt';
        this.titleStatus = 'Dự thảo';
        break;
      }
      case '03': {
        this.iconButtonDuyet = 'htvbdh_tcdt_guiduyet'
        this.titleButtonDuyet = 'Lưu và gửi duyệt';
        this.titleStatus = 'Từ chối - TP';
        break;
      }
      case '01': {
        this.iconButtonDuyet = 'htvbdh_tcdt_pheduyet'
        this.titleButtonDuyet = 'Duyệt';
        this.titleStatus = 'Chờ duyệt - TP';
        break
      }
      case '09': {
        this.iconButtonDuyet = 'htvbdh_tcdt_baocao2'
        this.titleButtonDuyet = 'Duyệt';
        this.titleStatus = 'Chờ duyệt - LĐ Cục';
        break
      }
      case '12': {
        this.iconButtonDuyet = 'htvbdh_tcdt_guiduyet'
        this.titleButtonDuyet = 'Lưu và gửi duyệt';
        this.titleStatus = 'Từ chối - LĐ Cục';
        break;
      }
      case '02': {
        this.titleStatus = 'Đã duyệt';
        this.styleStatus = 'da-ban-hanh'
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

  mapOfExpandedData2: { [maDvi: string]: DanhSachGoiThau[] } = {};

  collapse2(array: DanhSachGoiThau[], data: DanhSachGoiThau, $event: boolean): void {
    if (!$event) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.idVirtual === d.idVirtual)!;
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
          stack.push({ ...node.children[i], level: node.level! + 1, expand: false, parent: node });
        }
      }
    }
    return array;
  }

  visitNode2(node: DanhSachGoiThau, hashMap: { [maDvi: string]: boolean }, array: DanhSachGoiThau[]): void {
    if (!hashMap[node.idVirtual]) {
      hashMap[node.idVirtual] = true;
      array.push(node);
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
    this.uploadFileService.uploadFile(event.file, event.name).then((resUpload) => {
      const fileDinhKem = new FileDinhKem();
      fileDinhKem.fileName = resUpload.filename;
      fileDinhKem.fileSize = resUpload.size;
      fileDinhKem.fileUrl = resUpload.url;
      if (type == 'bao-gia') {
        if (id == 0) {
          this.addModelBaoGia.taiLieu = [];
          this.addModelBaoGia.taiLieu = [...this.addModelBaoGia.taiLieu, item];
          this.addModelBaoGia.children = [];
          this.addModelBaoGia.children = [...this.addModelBaoGia.children, fileDinhKem];
        }
        else if (id > 0) {
          this.editBaoGiaCache[id].data.taiLieu = [];
          this.editBaoGiaCache[id].data.taiLieu = [...this.editBaoGiaCache[id]?.data?.taiLieu, item];
          this.editBaoGiaCache[id].data.children = [];
          this.editBaoGiaCache[id].data.children = [...this.editBaoGiaCache[id].data.children, fileDinhKem];
        }
      } else if (type == 'co-so') {
        if (id == 0) {
          this.addModelCoSo.taiLieu = [];
          this.addModelCoSo.taiLieu = [...this.addModelCoSo.taiLieu, item];
          this.addModelCoSo.children = [];
          this.addModelCoSo.children = [...this.addModelCoSo.children, fileDinhKem];
        }
        else if (id > 0) {
          this.editCoSoCache[id].data.taiLieu = [];
          this.editCoSoCache[id].data.taiLieu = [...this.editCoSoCache[id]?.data?.taiLieu, item];
          this.editCoSoCache[id].data.children = [];
          this.editCoSoCache[id].data.children = [...this.editCoSoCache[id].data.children, fileDinhKem];
        }
      }
    });
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
      "dataType": "",
      "dataId": 0
    }
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

  openDialogGoiThau(data?: any, index?) {
    if (!this.formData.get('loaiVthh').value) {
      this.notification.error(MESSAGE.NOTIFICATION, "Vui lòng chọn loại hàng hóa");
      return;
    }
    const modal = this.modal.create({
      nzTitle: 'Thông tin gói thầu',
      nzContent: DialogThemMoiGoiThauComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '800px',
      nzFooter: null,
      nzComponentParams: {
        data: data,
        loaiVthh: this.formData.get('loaiVthh').value
      },
    });
    modal.afterClose.subscribe((res) => {
      if (res) {
        console.log(res);
        if (index >= 0) {
          this.dataGoiThau[index] = res;
        } else {
          this.dataGoiThau.push(res);
        }
        this.bindingDataNguonVon()
        this.calendarDinhMuc();
      }
    });
  }

  bindingDataNguonVon() {
    const valueNv = this.formData.get('nguonVon') ? this.formData.get('nguonVon').value : null;
    let dataNguonVon = this.listNguonVon.filter(item => item.ma == valueNv);
    if (dataNguonVon.length > 0 && this.dataGoiThau.length > 0) {
      this.dataGoiThau.forEach(item => {
        item.nguonVon = dataNguonVon[0].ma;
        item.tenNguonVon = dataNguonVon[0].giaTri;
      })
    }
  }

  calendarDinhMuc() {
    let tongMucDt: number = 0;
    this.dataGoiThau.forEach(item => {
      tongMucDt = tongMucDt + item.thanhTien;
    })
    this.formData.get('tongMucDt').setValue(tongMucDt);
  }

  deleteRow(data: any) {
    this.dataGoiThau = this.dataGoiThau.filter(x => x.id != data.id);
  }

  deleteSelect() {
    let dataDelete = [];
    if (this.dataGoiThau && this.dataGoiThau.length > 0) {
      this.dataGoiThau.forEach((item) => {
        if (item.checked) {
          dataDelete.push(item.id);
        }
      });
    }
    if (dataDelete && dataDelete.length > 0) {
      this.modal.confirm({
        nzClosable: false,
        nzTitle: 'Xác nhận',
        nzContent: 'Bạn có chắc chắn muốn xóa các bản ghi đã chọn?',
        nzOkText: 'Đồng ý',
        nzCancelText: 'Không',
        nzOkDanger: true,
        nzWidth: 310,
        nzOnOk: async () => {
          this.spinner.show();
          try {
            // let res = await this.deXuatDieuChinhService.deleteMultiple(dataDelete);
            // if (res.msg == MESSAGE.SUCCESS) {
            //   this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
            // } else {
            //   this.notification.error(MESSAGE.ERROR, res.msg);
            // }
            this.spinner.hide();
          } catch (e) {
            console.log('error: ', e);
            this.spinner.hide();
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          }
        },
      });
    }
    else {
      this.notification.error(MESSAGE.ERROR, "Không có dữ liệu phù hợp để xóa.");
    }
  }

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

  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      if (this.dataGoiThau && this.dataGoiThau.length > 0) {
        this.dataGoiThau.forEach((item) => {
          if (item.trangThai == '00') {
            item.checked = true;
          }
        });
      }
    } else {
      if (this.dataGoiThau && this.dataGoiThau.length > 0) {
        this.dataGoiThau.forEach((item) => {
          item.checked = false;
        });
      }
    }
  }

  updateSingleChecked(): void {
    if (this.dataGoiThau.every(item => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.dataGoiThau.every(item => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }

}
