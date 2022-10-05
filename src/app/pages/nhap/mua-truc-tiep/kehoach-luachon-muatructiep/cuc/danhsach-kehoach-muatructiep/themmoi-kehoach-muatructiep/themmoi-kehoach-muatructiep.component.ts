import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';
import { groupBy, chain } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogThemMoiVatTuComponent } from 'src/app/components/dialog/dialog-them-moi-vat-tu/dialog-them-moi-vat-tu.component';
import { MESSAGE } from 'src/app/constants/message';
import {
  CanCuXacDinh,
  DanhSachMuaTrucTiep,
} from 'src/app/models/DeXuatKeHoachMuaTrucTiep';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DanhSachDauThauService } from 'src/app/services/danhSachDauThau.service';
import { UploadFileService } from 'src/app/services/uploaFile.service';
import VNnum2words from 'vn-num2words';
import * as dayjs from 'dayjs';
import { Globals } from 'src/app/shared/globals';
import { API_STATUS_CODE, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { UserLogin } from 'src/app/models/userlogin';
import { UserService } from 'src/app/services/user.service';
import { VatTu } from 'src/app/components/dialog/dialog-them-thong-tin-vat-tu-trong-nam/danh-sach-vat-tu-hang-hoa.type';
import { UploadComponent } from 'src/app/components/dialog/dialog-upload/upload.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { HelperService } from 'src/app/services/helper.service';
import { DonviService } from 'src/app/services/donvi.service';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { DialogDanhSachHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import { ChiTieuKeHoachNamCapTongCucService } from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
import { DialogThemMoiGoiThauComponent } from 'src/app/components/dialog/dialog-them-moi-goi-thau/dialog-them-moi-goi-thau.component';
import { DanhMucTieuChuanService } from 'src/app/services/quantri-danhmuc/danhMucTieuChuan.service';
import { STATUS } from "../../../../../../../constants/status";
import { BaseComponent } from "../../../../../../../components/base/base.component";
import { DatePipe } from "@angular/common";
import { DanhSachMuaTrucTiepService } from 'src/app/services/danh-sach-mua-truc-tiep.service';
import { DialogThemMoiKeHoachMuaTrucTiepComponent } from 'src/app/components/dialog/dialog-them-moi-ke-hoach-mua-truc-tiep/dialog-them-moi-ke-hoach-mua-truc-tiep.component';

interface ItemData {
  id: string;
  stt: string;
  goiThau: string;
  soLuongDxmtt: string;
  diaDiem: string;
  donGia: string;
  thanhTien: string;
  giaTriDamBao: string;
}

export interface TreeNodeInterface {
  key: string;
  maDvi: string;
  tenDvi: string;
  maDiemKho?: string;
  soLuongDaMua?: number;
  diaDiemNhap?: string;
  soLuongCtieu: number;
  soLuongKhDd: number;
  soLuongDxmtt: number;
  donGiaVat: number;
  thanhTien: number;
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
  @Output()
  showListEvent = new EventEmitter<any>();

  editCache: { [key: string]: { edit: boolean; data: DanhSachMuaTrucTiep } } = {};

  formData: FormGroup;
  listOfData: DanhSachMuaTrucTiep[] = [];
  cacheData: DanhSachMuaTrucTiep[] = [];
  fileDinhKem: any[] = [];
  userLogin: UserLogin;
  listChiCuc: any[] = [];
  listDiemKho: any[] = [];
  listLoaiHinhNx: any[] = [];
  listKieuNx: any[] = [];

  danhMucDonVi: any;
  STATUS = STATUS;
  i = 0;
  editId: string | null = null;
  tabSelected: string = 'thongTinChung';
  listPhuongThucDauThau: any[] = [];
  listNguonVon: any[] = [];
  listNam: any[] = [];
  listHinhThucDauThau: any[] = [];
  listLoaiHopDong: any[] = [];
  listOfMapData: VatTu[];
  listOfMapDataClone: VatTu[];
  mapOfExpandedData: { [key: string]: VatTu[] } = {};
  selectHang: any = { ten: '' };
  errorInputRequired: string = 'Dữ liệu không được để trống.';
  dataChiTieu: any;
  baoGiaThiTruongList: CanCuXacDinh[] = [];
  canCuKhacList: CanCuXacDinh[] = [];
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

  listDataGroup: any[] = [];

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
      maDvi: [],
      tenDvi: ['', [Validators.required]],
      loaiHinhNx: ['', [Validators.required]],
      kieuNx: ['', [Validators.required]],
      namKh: ['', [Validators.required]],
      soDxuat: ['', [Validators.required]],
      trichYeu: [null],
      ngayTao: [dayjs().format('YYYY-MM-DD')],
      ngayPduyet: [],
      tenDuAn: ['', [Validators.required]],
      soQd: ['', [Validators.required]],
      loaiVthh: [],
      tenLoaiVthh: ['', [Validators.required]],
      cloaiVthh: [],
      tenCloaiVthh: ['', [Validators.required]],
      moTaHangHoa: ['', [Validators.required]],
      ptMua: ['', [Validators.required]],
      tchuanCluong: [null],
      giaMua: ['', [Validators.required]],
      giaChuaThue: ['', [Validators.required]],
      giaCoThue: ['', [Validators.required]],
      thueGtgt: [],
      tgianMkho: ['', [Validators.required]],
      tgianKthuc: ['', [Validators.required]],
      ghiChu: [null],
      tongMucDt: [],
      tongSoLuong: [],
      nguonVon: ['', [Validators.required]],
      tenChuDt: [],
      moTa: [],
      maDiemKho: [],
      diaDiemKho: [],
      soLuongCtieu: [],
      soLuongKhDd: [],
      soLuongDxmtt: [],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự thảo'],
      trangThaiTh: [],
      donGiaVat: [],
      thanhTien: [],
    });

  }

  async ngOnInit() {
    await this.spinner.show();
    this.userInfo = this.userService.getUserLogin();
    this.maTrinh = '/' + this.userInfo.MA_TR;
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
    await Promise.all([
      this.loadDataComboBox(),
    ]);
    if (this.idInput > 0) {
      await this.getDetail(this.idInput);
    } else {
      this.initForm();
    }
    await this.spinner.hide();
  }

  async loadDataComboBox() {
    // List nguồn vốn
    this.listNguonVon = [];
    let resNv = await this.danhMucService.danhMucChungGetAll('NGUON_VON');
    if (resNv.msg == MESSAGE.SUCCESS) {
      this.listNguonVon = resNv.data;
    }

    // loại hình nhập xuất
    this.listLoaiHinhNx = [];
    let resNx = await this.danhMucService.danhMucChungGetAll('LOAI_HINH_NHAP_XUAT');
    if (resNx.msg == MESSAGE.SUCCESS) {
      this.listLoaiHinhNx = resNx.data.filter(item => item.phanLoai == 'N');
    }
    // kiểu nhập xuất
    this.listKieuNx = [];
    let resKieuNx = await this.danhMucService.danhMucChungGetAll('KIEU_NHAP_XUAT');
    if (resKieuNx.msg == MESSAGE.SUCCESS) {
      this.listKieuNx = resKieuNx.data
    }
  }

  async getDetail(id: number) {
    if (id) {
      await this.danhSachMuaTrucTiepService
        .getDetail(id)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const dataDetail = res.data;
            this.helperService.bidingDataInFormGroup(this.formData, dataDetail);
            this.formData.patchValue({
              soDxuat: dataDetail.soDxuat.split('/')[0]
            })
            if (dataDetail) {
              this.taiLieuDinhKemList = dataDetail.fileDinhkems;
              this.listOfData = dataDetail.soLuongDiaDiemList;
              this.convertListData();
              this.bindingCanCu(dataDetail.ccXdgList);
            }
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }
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

  initForm() {
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI,
      maDvi: this.userInfo.MA_DVI,
      diaChiDvi: this.userInfo.DON_VI.diaChi,
      namKh: dayjs().get('year')
    })
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
        this.formData.patchValue({
          cloaiVthh: data.ma,
          tenCloaiVthh: data.ten,
          loaiVthh: data.parent.ma,
          tenLoaiVthh: data.parent.ten,
        });
        let res = await this.dmTieuChuanService.getDetailByMaHh(
          this.formData.get('cloaiVthh').value,
        );
        if (res.statusCode == API_STATUS_CODE.SUCCESS) {
          this.formData.patchValue({
            tchuanCluong: res.data ? res.data.tenQchuan : null,
          });
        }
      }
    });
  }

  themMoiSoLuongDiaDiem(data?: DanhSachMuaTrucTiep, index?: number) {
    if (!this.formData.get('loaiVthh').value) {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng chọn loại hàng hóa');
      return;
    }
    const modalGT = this.modal.create({
      nzTitle: 'Thêm địa điểm nhập kho',
      nzContent: DialogThemMoiKeHoachMuaTrucTiepComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1200px',
      nzFooter: null,
      nzComponentParams: {
        dataEdit: data,
        dataChiTieu: this.dataChiTieu,
        loaiVthh: this.formData.get('loaiVthh').value,
      },
    });
    modalGT.afterClose.subscribe((res) => {
      if (!res) {
        return;
      }
      const dsMuaTrucTiepDialog = new DanhSachMuaTrucTiep();
      dsMuaTrucTiepDialog.maDvi = res.value.maDvi;
      dsMuaTrucTiepDialog.tenDvi = res.value.tenDvi;
      dsMuaTrucTiepDialog.maDiemKho = res.value.maDiemKho;
      dsMuaTrucTiepDialog.tenDiemKho = res.value.tenDiemKho;
      dsMuaTrucTiepDialog.diaDiemNhap = res.value.diaDiemNhap;
      dsMuaTrucTiepDialog.soLuongCtieu = res.value.soLuongCtieu;
      dsMuaTrucTiepDialog.soLuongKhDd = res.value.soLuongKhDd;
      dsMuaTrucTiepDialog.soLuongDxmtt = +res.value.soLuongDxmtt;
      dsMuaTrucTiepDialog.donGiaVat = res.value.donGiaVat;
      if (index >= 0) {
        this.listOfData[index] = dsMuaTrucTiepDialog;
      } else {
        this.listOfData = [...this.listOfData, dsMuaTrucTiepDialog];
      }
      let tongMucDt: number = 0;
      this.listOfData.forEach((item) => {
        tongMucDt = tongMucDt + item.soLuongDxmtt * item.donGiaVat;
      });
      this.formData.patchValue({
        tongMucDt: tongMucDt,
      });
      this.convertListData();
    });
  }

  deleteRow(i: number): void {
    this.listOfData = this.listOfData.filter((d, index) => index !== i);
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
    // if (this.listOfData.length == 0) {
    //   this.notification.error(
    //     MESSAGE.ERROR,
    //     'Danh sách kế hoạch không được để trống',
    //   );
    //   return;
    // }
    let pipe = new DatePipe('en-US');
    let body = this.formData.value;
    body.soDxuat = this.formData.get('soDxuat').value + this.maTrinh;
    // body.tgianDthau = pipe.transform(body.tgianDthau, 'yyyy-MM-dd HH:mm')
    // body.tgianMthau = pipe.transform(body.tgianMthau, 'yyyy-MM-dd HH:mm')
    body.fileDinhKems = this.taiLieuDinhKemList;
    body.soLuongDiaDiemList = this.listOfData;
    body.ccXdgList = [...this.baoGiaThiTruongList, ...this.canCuKhacList];
    let res = null;
    if (this.formData.get('id').value) {
      res = await this.danhSachMuaTrucTiepService.update(body);
    } else {
      res = await this.danhSachMuaTrucTiepService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isGuiDuyet) {
        this.idInput = res.data.id;
        await this.guiDuyet();
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

  convertTienTobangChu(tien: number): string {
    return VNnum2words(tien);
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
        await this.spinner.show();
        try {
          let body = {
            id: this.idInput,
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
          let res = await this.danhSachMuaTrucTiepService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(
              MESSAGE.SUCCESS,
              MESSAGE.THAO_TAC_SUCCESS,
            );
            this.quayLai();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          await this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          await this.spinner.hide();
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
          const res = await this.danhSachMuaTrucTiepService.approve(body);
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

  deleteTaiLieuDinhKemTag(data: any) {
    this.taiLieuDinhKemList = this.taiLieuDinhKemList.filter(
      (x) => x.id !== data.id,
    );
  }

  openFile(event, id, type) {

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



  convertListData() {
    this.listDataGroup = chain(this.listOfData).groupBy('tenDvi').map((value, key) => ({ tenDvi: key, dataChild: value }))
      .value()
    console.log(this.listDataGroup);
  }

  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  async ngOnChanges(changes: SimpleChanges) {
    await this.spinner.show();
    if (changes) {
      await this.getDetail(this.idInput);
    };
    await this.spinner.hide();
  }

}
