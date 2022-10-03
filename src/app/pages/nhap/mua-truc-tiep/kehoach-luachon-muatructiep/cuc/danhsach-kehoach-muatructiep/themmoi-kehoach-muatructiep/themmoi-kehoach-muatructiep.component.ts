import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogThemMoiVatTuComponent } from 'src/app/components/dialog/dialog-them-moi-vat-tu/dialog-them-moi-vat-tu.component';
import { MESSAGE } from 'src/app/constants/message';
import {
  CanCuXacDinh,
  DanhSachGoiThau,
  FileDinhKem,
} from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { UploadFileService } from 'src/app/services/uploaFile.service';
import VNnum2words from 'vn-num2words';
import * as dayjs from 'dayjs';
import { Globals } from 'src/app/shared/globals';
import { API_STATUS_CODE, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { UserLogin } from 'src/app/models/userlogin';
import { UserService } from 'src/app/services/user.service';
import { VatTu } from 'src/app/components/dialog/dialog-them-thong-tin-vat-tu-trong-nam/danh-sach-vat-tu-hang-hoa.type';
import { UploadComponent } from 'src/app/components/dialog/dialog-upload/upload.component';
import { HelperService } from 'src/app/services/helper.service';
import { DonviService } from 'src/app/services/donvi.service';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { DialogDanhSachHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import { ChiTieuKeHoachNamCapTongCucService } from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
import { DialogThemMoiGoiThauComponent } from 'src/app/components/dialog/dialog-them-moi-goi-thau/dialog-them-moi-goi-thau.component';
import { DanhMucTieuChuanService } from 'src/app/services/quantri-danhmuc/danhMucTieuChuan.service';
import { STATUS } from "../../../../../../../constants/status";
import { DialogQuyetDinhGiaoChiTieuComponent } from 'src/app/components/dialog/dialog-quyet-dinh-giao-chi-tieu/dialog-quyet-dinh-giao-chi-tieu.component';
import { DanhSachMuaTrucTiepService } from 'src/app/services/danh-sach-mua-truc-tiep.service';
import { DANH_MUC_LEVEL } from 'src/app/pages/luu-kho/luu-kho.constant';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';

interface ItemData {
  id: string;
  stt: string;
  goiThau: string;
  soLuong: string;
  diaDiem: string;
  donGia: string;
  thanhTien: string;
  bangChu: string;
  giaTriDamBao: string;
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
  giaTriDamBao?: string;
  name: string;
  age?: number;
  level?: number;
  expand?: boolean;
  address?: string;
  children?: TreeNodeInterface[];
  parent?: TreeNodeInterface;
}
@Component({
  selector: 'app-themmoi-kehoach-muatructiep',
  templateUrl: './themmoi-kehoach-muatructiep.component.html',
  styleUrls: ['./themmoi-kehoach-muatructiep.component.scss']
})
export class ThemmoiKehoachMuatructiepComponent implements OnInit {
  @Input()
  loaiVthhInput: string;
  @Input()
  idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  dsDonVi = [];
  editCache: { [key: string]: { edit: boolean; data: DanhSachGoiThau } } = {};
  listLoaiHinhNhapXuat: any[] = [];
  listKieuNhapXuat: any[] = [];
  formData: FormGroup;
  // formThongTinChung: FormGroup;
  listOfData: DanhSachGoiThau[] = [];
  cacheData: DanhSachGoiThau[] = [];
  fileDinhKem: any[] = [];
  userLogin: UserLogin;
  listChiCuc: any[] = [];
  listDiemKho: any[] = [];
  titleStatus: string = '';
  titleButtonDuyet: string = '';
  iconButtonDuyet: string = '';
  styleStatus: string = 'du-thao-va-lanh-dao-duyet';
  danhMucDonVi: any;
  ktDiemKho: any;
  STATUS = STATUS;
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

  taiLieuDinhKemList: any[] = [];


  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  allChecked = false;
  indeterminate = false;
  editBaoGiaCache: { [key: string]: { edit: boolean; data: any } } = {};
  editCoSoCache: { [key: string]: { edit: boolean; data: any } } = {};

  constructor(
    private modal: NzModalService,
    private danhMucService: DanhMucService,
    private danhSachMuaTrucTiepService: DanhSachMuaTrucTiepService,
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
      maDvi: [''],
      tenDvi: [],
      loaiHinhNx: [],
      kieuNx: [],
      namKh: [dayjs().get("year"), [Validators.required]],
      soDxuat: [],
      trichYeu: [],
      ngayTao: [],
      ngayPduyet: [],
      tenDuAn: [],
      soQd: [],
      loaiVthh: [],
      tenloaiVthh: [],
      cloaiVthh: [],
      tenCloaiVthh: [],
      moTaHangHoa: [],
      ptMua: [],
      tchuanCluong: [],
      giaMua: [],
      giaChuaThue: [],
      giaCoThue: [],
      thueGtgt: [],
      tgianMkho: [],
      tgianKthuc: [],
      ghiChu: [],
      tongMucDt: [],
      tongSoLuong: [],
      nguonVon: [],
      tenChuDt: [],
      moTa: [],
      maDiemKho: [],
      diaDiemKho: [],
      soLuongCtieu: [],
      soLuongKhDd: [],
      soLuongDxmtt: [],
      trangThai: [STATUS.DU_THAO],
      trangThaiTh: [],
      donGiaVat: [],
      thanhTien: [],
    });
    this.loaiVTHHGetAll();
  }

  isDetailPermission() {
    if (this.loaiVthhInput === "02") {
      if (this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_VT_DEXUAT_SUA") && this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_VT_DEXUAT_THEM")) {
        return true;
      }
    }
    else {
      if (this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_LT_DEXUAT_SUA") && this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_LT_DEXUAT_THEM")) {
        return true;
      }
    }
    return false;
  }

  deleteRow(i: number): void {
    this.listOfData = this.listOfData.filter((d, index) => index !== i);
  }

  async ngOnInit() {
    this.spinner.show();
    this.userInfo = this.userService.getUserLogin();
    console.log(this.userInfo);

    this.maTrinh = '/' + this.userInfo.MA_TR;
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
    this.loadDonVi();
    this.initForm();

    await Promise.all([
      this.loaiVTHHGetAll(),
      this.nguonVonGetAll(),
      this.getDataChiTieu(),
      this.dsLoaiHinhNhapXuat(),
      this.dsKieuNhapXuat(),
    ]);
    this.spinner.hide();
  }

  initForm(dataDetail?) {
    this.formData.patchValue({
      id: dataDetail ? dataDetail.id : null,
      maDvi: dataDetail ? dataDetail.maDvi : this.userInfo.MA_DVI,
      tenDvi: dataDetail ? dataDetail.tenDvi : this.userInfo.TEN_DVI,
      loaiHinhNx: dataDetail ? dataDetail.loaiHinhNx : null,
      kieuNx: dataDetail ? dataDetail.kieuNx : null,
      namKh: dataDetail ? dataDetail.namKh : dayjs().get('year'),
      soDxuat: dataDetail ? dataDetail.soDxuat.split('/')[0] : null,
      trichYeu: dataDetail ? dataDetail.trichYeu : null,
      ngayTao: dataDetail ? dataDetail.ngayTao : null,
      ngayPduyet: dataDetail ? dataDetail.ngayPduyet : null,
      tenDuAn: dataDetail ? dataDetail.tenDuAn : null,
      soQd: dataDetail ? dataDetail.soQd : null,
      loaiVthh: dataDetail ? dataDetail.loaiVthh : this.loaiVthhInput,
      tenloaiVthh: dataDetail ? dataDetail.tenloaiVthh : null,
      cloaiVthh: dataDetail ? dataDetail.cloaiVthh : null,
      tenCloaiVthh: dataDetail ? dataDetail.tenCloaiVthh : null,
      moTaHangHoa: dataDetail ? dataDetail.moTaHangHoa : null,
      ptMua: dataDetail ? dataDetail.ptMua : null,
      tchuanCluong: dataDetail ? dataDetail.tchuanCluong : null,
      giaMua: dataDetail ? dataDetail.giaMua : null,
      giaChuaThue: dataDetail ? dataDetail.giaChuaThue : null,
      giaCoThue: dataDetail ? dataDetail.giaCoThue : null,
      thueGtgt: dataDetail ? dataDetail.thueGtgt : null,
      tgianMkho: dataDetail ? dataDetail.tgianMkho : null,
      tgianKthuc: dataDetail ? dataDetail.tgianKthuc : null,
      ghiChu: dataDetail ? dataDetail.ghiChu : null,
      tongMucDt: dataDetail ? dataDetail.tongMucDt : null,
      tongSoLuong: dataDetail ? dataDetail.tongSoLuong : null,
      nguonVon: dataDetail ? dataDetail.nguonVon : null,
      tenChuDt: dataDetail ? dataDetail.tenChuDt : null,
      moTa: dataDetail ? dataDetail.moTa : null,
      maDiemKho: dataDetail ? dataDetail.maDiemKho : null,
      diaDiemKho: dataDetail ? dataDetail.diaDiemKho : null,
      soLuongCtieu: dataDetail ? dataDetail.soLuongCtieu : null,
      soLuongKhDd: dataDetail ? dataDetail.soLuongKhDd : null,
      soLuongDxmtt: dataDetail ? dataDetail.soLuongDxmtt : null,
      trangThai: dataDetail ? dataDetail.trangThai : '00',
      tenTrangThai: dataDetail ? dataDetail.tenTrangThai : 'Dự Thảo',
      trangThaiTh: dataDetail ? dataDetail.trangThai : '24',
      tenTrangThaiTh: dataDetail ? dataDetail.tenTrangThaiTh : 'Chưa tổng họp',
      donGiaVat: dataDetail ? dataDetail.donGiaVat : null,
      thanhTien: dataDetail ? dataDetail.thanhTien : null,
    });
    if (dataDetail) {
      this.fileDinhKem = dataDetail.fileDinhKems;
      this.listOfData = dataDetail.dsGtDtlList;

      this.bindingCanCu(dataDetail.ccXdgDtlList);
    }
  }

  async dsLoaiHinhNhapXuat() {
    let res = await this.danhMucService.danhMucChungGetAll("LOAI_HINH_NHAP_XUAT");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiHinhNhapXuat = res.data;
    }
  }

  async dsKieuNhapXuat() {
    let res = await this.danhMucService.danhMucChungGetAll("KIEU_NHAP_XUAT");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listKieuNhapXuat = res.data;
    }
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
      nzComponentParams: {
        data,
        onlyLuongThuc: true,
      },
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
        cloaiVthh: data.ma,
        tenCloaiVthh: data.ten,
        loaiVthh: data.parent.ma,
        tenloaiVthh: data.parent.ten,
      });
    }
    if (data.loaiHang == 'VT') {
      if (data.cap == '3') {
        cloaiVthh = data;
        this.formData.patchValue({
          maVtu: data.ma,
          tenVtu: data.ten,
          cloaiVthh: data.parent.ma,
          tenCloaiVthh: data.parent.ten,
          loaiVthh: data.parent.parent.ma,
          tenloaiVthh: data.parent.parent.ten,
        });
      }
      if (data.cap == '2') {
        this.formData.patchValue({
          maVtu: null,
          tenVtu: null,
          cloaiVthh: data.ma,
          tenCloaiVthh: data.ten,
          loaiVthh: data.parent.ma,
          tenloaiVthh: data.parent.ten,
        });
      }
    }
    let res = await this.dmTieuChuanService.getDetailByMaHh(
      this.formData.get('cloaiVthh').value,
    );
    if (res.statusCode == API_STATUS_CODE.SUCCESS) {
      this.formData.patchValue({
        tchuanCluong: res.data ? res.data.tenQchuan : null,
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



  async save(isGuiDuyet?) {
    if (!this.isDetailPermission()) {
      return;
    }
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng điền đủ thông tin');
      console.log(this.formData);
      return;
    }

    let body = this.formData.value;
    body.soDxuat = body.soDxuat + this.maTrinh;
    body.fileDinhKemReq = this.fileDinhKem;
    body.dsGtReq = this.listOfData;
    body.ccXdgReq = [...this.baoGiaThiTruongList, ...this.canCuKhacList];
    let res = null;
    if (this.formData.get('id').value) {
      res = await this.danhSachMuaTrucTiepService.update(body);
    } else {
      res = await this.danhSachMuaTrucTiepService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isGuiDuyet) {
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

  async loaiVTHHGetAll() {
    this.listLoaiVthh = [];
    let res = await this.danhMucService.loaiVatTuHangHoaGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiVthh = res.data;
    }
  }


  async getDataChiTieu() {
    let res2 =
      await this.chiTieuKeHoachNamCapTongCucService.loadThongTinChiTieuKeHoachCucNam(
        +this.formData.get('namKh').value,
      );
    if (res2.msg == MESSAGE.SUCCESS) {
      this.dataChiTieu = res2.data;
      this.formData.patchValue({
        soQd: this.dataChiTieu.soQuyetDinh,
      });
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
            case STATUS.TU_CHOI_LDC:
            case STATUS.TU_CHOI_TP:
            case STATUS.DU_THAO: {
              body.trangThai = STATUS.CHO_DUYET_TP;
              break;
            }
            case STATUS.CHO_DUYET_TP: {
              body.trangThai = STATUS.CHO_DUYET_LDC;
              break;
            }
            case STATUS.CHO_DUYET_LDC: {
              body.trangThai = STATUS.DA_DUYET_LDC;
              break;
            }
          }
          let res = await this.danhSachMuaTrucTiepService.updateStatus(body);
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
            case STATUS.CHO_DUYET_TP: {
              body.trangThai = STATUS.TU_CHOI_TP;
              break;
            }
            case STATUS.CHO_DUYET_LDC: {
              body.trangThai = STATUS.TU_CHOI_LDC;
              break;
            }
          }
          const res = await this.danhSachMuaTrucTiepService.updateStatus(body);
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


  xoaItem(data: any) {
  }

  openDialogQuyetDinhGiaoChiTieu() {
    if (this.idInput >= 0 && !this.isView) {
      const modalQD = this.modal.create({
        nzTitle: 'Thông tin QĐ giao chỉ tiêu kế hoạch',
        nzContent: DialogQuyetDinhGiaoChiTieuComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          capDonVi: 2,
        },
      });
      modalQD.afterClose.subscribe(async (data) => {
        if (data) {
          this.formData.patchValue({
            qdGiaoChiTieuId: data ? data.id : null,
            soQd: data ? data.soQuyetDinh : null,
          });
          this.spinner.hide();
        }
      });
    }
  }


}
