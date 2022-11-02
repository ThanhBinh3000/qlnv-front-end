import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, Pipe, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';
import { chain } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import {
  CanCuXacDinh,
  DanhSachMuaTrucTiep,
  FileDinhKem,
} from 'src/app/models/DeXuatKeHoachMuaTrucTiep';
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
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { HelperService } from 'src/app/services/helper.service';
import { DonviService } from 'src/app/services/donvi.service';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { DialogDanhSachHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import { ChiTieuKeHoachNamCapTongCucService } from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
import { DanhMucTieuChuanService } from 'src/app/services/quantri-danhmuc/danhMucTieuChuan.service';
import { DatePipe } from "@angular/common";
import { DanhSachMuaTrucTiepService } from 'src/app/services/danh-sach-mua-truc-tiep.service';
import { DialogThemMoiKeHoachMuaTrucTiepComponent } from 'src/app/components/dialog/dialog-them-moi-ke-hoach-mua-truc-tiep/dialog-them-moi-ke-hoach-mua-truc-tiep.component';
import { STATUS } from 'src/app/constants/status';
import { convertTienTobangChu } from 'src/app/shared/commonFunction';
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
  bangChu?: string;
  name: string;
  age?: number;
  level?: number;
  expand?: boolean;
  address?: string;
  ccFileDinhkems?: TreeNodeInterface[];
  parent?: TreeNodeInterface;
}

@Component({
  selector: 'app-themmoi-kehoach-muatructiep',
  templateUrl: './themmoi-kehoach-muatructiep.component.html',
  styleUrls: ['./themmoi-kehoach-muatructiep.component.scss']
})

export class ThemmoiKehoachMuatructiepComponent implements OnInit, OnChanges {
  @Input()
  loaiVthhInput: string;
  @Input()
  idInput: number;
  @Input()
  showFromTH: boolean;
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
  listNguonVon: any[] = [];
  listNam: any[] = [];
  listOfMapData: VatTu[];
  listOfMapDataClone: VatTu[];
  mapOfExpandedData: { [key: string]: VatTu[] } = {};
  selectHang: any = { ten: '' };
  errorInputRequired: string = 'Dữ liệu không được để trống.';
  dataChiTieu: any;
  canCuXacDinhList: CanCuXacDinh[] = [];
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
  datePipe = new DatePipe('en-US');
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
      diaChiDvi: [],
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
      tongMucDt: [null, [Validators.required]],
      tongSoLuong: [],
      nguonVon: ['', [Validators.required]],
      tenChuDt: ['', [Validators.required]],
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
    console.log(this.userInfo)
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
    await this.getDataChiTieu()
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
              this.fileDinhKem = dataDetail.fileDinhKems;
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
          this.canCuXacDinhList = [...this.canCuXacDinhList, chiTiet];
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
      if (index >= 0) {
        this.listOfData[index] = res.value;
      } else {
        this.listOfData = [...this.listOfData, res.value];
      }
      let tongMucDt: number = 0;
      this.listOfData.forEach((item) => {
        tongMucDt = tongMucDt + (item.soLuongDxmtt * item.donGiaVat);

      });
      this.formData.patchValue({
        tongMucDt: tongMucDt,
      });
      this.helperService.setIndexArray(this.listOfData);
      this.convertListData();
    });
  }

  deleteRow(i: number): void {
    this.listOfData = this.listOfData.filter((d, index) => index !== i);
    this.helperService.setIndexArray(this.listOfData);
    this.convertListData();
  }

  async save(isGuiDuyet?) {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng điền đủ thông tin');
      console.log(this.formData);
      return;
    }

    let body = this.formData.value;
    body.soDxuat = this.formData.get('soDxuat').value + this.maTrinh;
    body.fileDinhkems = this.fileDinhKem;
    body.ngayTao = this.datePipe.transform(body.ngayTao, 'yyyy-MM-dd');
    body.tgianKthuc = this.datePipe.transform(body.tgianKthuc, 'yyyy-MM-dd ');
    body.tgianMkho = this.datePipe.transform(body.tgianMkho, 'yyyy-MM-dd ')
    body.soLuongDiaDiemList = this.listOfData;
    body.ccXdgList = [...this.canCuXacDinhList, ...this.canCuKhacList];
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
    return convertTienTobangChu(tien);
  }

  downloadFile(taiLieu: any) {
    this.uploadFileService.downloadFile(taiLieu.fileUrl).subscribe((blob) => {
      saveAs(blob, taiLieu.fileName);
    });
  }

  deleteTaiLieu(index: number, table: string) {
    if (table == 'bao-gia-thi-truong') {
      this.canCuXacDinhList = this.canCuXacDinhList.filter(
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

  deleteTaiLieuDinhKemTag(data: any, id, type) {
    if (type == 'bao-gia') {
      if (id == 0) {
        this.addModelBaoGia.taiLieu = [];
        this.addModelBaoGia.ccFileDinhkems = [];
      } else if (id > 0) {
        this.editBaoGiaCache[id].data.taiLieu = [];
        this.editBaoGiaCache[id].data.ccFileDinhkems = [];
        this.checkDataExistBaoGia(this.editBaoGiaCache[id].data);
      }
    } else if (type == 'co-so') {
      if (id == 0) {
        this.addModelCoSo.taiLieu = [];
        this.addModelCoSo.ccFileDinhkems = [];
      } else if (id > 0) {
        this.editCoSoCache[id].data.taiLieu = [];
        this.editCoSoCache[id].data.ccFileDinhkems = [];
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
                taiLieuBaoGiaThiTruong.moTa = res.tenTaiLieu;
                taiLieuBaoGiaThiTruong.idVirtual = new Date().getTime();
                taiLieuBaoGiaThiTruong.ccFileDinhkems = [];
                taiLieuBaoGiaThiTruong.ccFileDinhkems = [
                  ...taiLieuBaoGiaThiTruong.ccFileDinhkems,
                  fileDinhKem,
                ];
                this.canCuXacDinhList = [
                  ...this.canCuXacDinhList,
                  taiLieuBaoGiaThiTruong,
                ];
                break;
              case 'can-cu-khac':
                const taiLieuCanCuKhac = new CanCuXacDinh();
                taiLieuCanCuKhac.loaiCanCu = '01';
                taiLieuCanCuKhac.moTa = res.tenTaiLieu;
                taiLieuCanCuKhac.idVirtual = new Date().getTime();
                taiLieuCanCuKhac.ccFileDinhkems = [];
                taiLieuCanCuKhac.ccFileDinhkems = [
                  ...taiLieuCanCuKhac.ccFileDinhkems,
                  fileDinhKem,
                ];
                this.canCuKhacList = [...this.canCuKhacList, taiLieuCanCuKhac];
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
            this.addModelBaoGia.ccFileDinhkems = [];
            this.addModelBaoGia.ccFileDinhkems = [
              ...this.addModelBaoGia.ccFileDinhkems,
              fileDinhKem,
            ];
          } else if (id > 0) {
            this.editBaoGiaCache[id].data.taiLieu = [];
            this.editBaoGiaCache[id].data.taiLieu = [
              ...this.editBaoGiaCache[id]?.data?.taiLieu,
              item,
            ];
            this.editBaoGiaCache[id].data.ccFileDinhkems = [];
            this.editBaoGiaCache[id].data.ccFileDinhkems = [
              ...this.editBaoGiaCache[id].data.ccFileDinhkems,
              fileDinhKem,
            ];
          }
        } else if (type == 'co-so') {
          if (id == 0) {
            this.addModelCoSo.taiLieu = [];
            this.addModelCoSo.taiLieu = [...this.addModelCoSo.taiLieu, item];
            this.addModelCoSo.ccFileDinhkems = [];
            this.addModelCoSo.ccFileDinhkems = [
              ...this.addModelCoSo.ccFileDinhkems,
              fileDinhKem,
            ];
          } else if (id > 0) {
            this.editCoSoCache[id].data.taiLieu = [];
            this.editCoSoCache[id].data.taiLieu = [
              ...this.editCoSoCache[id]?.data?.taiLieu,
              item,
            ];
            this.editCoSoCache[id].data.ccFileDinhkems = [];
            this.editCoSoCache[id].data.ccFileDinhkems = [
              ...this.editCoSoCache[id].data.ccFileDinhkems,
              fileDinhKem,
            ];
          }
        }
      });
  }

  addBaoGia() {
    const taiLieuBaoGiaThiTruong = new CanCuXacDinh();
    taiLieuBaoGiaThiTruong.loaiCanCu = '00';
    taiLieuBaoGiaThiTruong.moTa = this.addModelBaoGia.moTa;
    taiLieuBaoGiaThiTruong.id = new Date().getTime() + 1;
    taiLieuBaoGiaThiTruong.ccFileDinhkems = this.addModelBaoGia.ccFileDinhkems;
    taiLieuBaoGiaThiTruong.taiLieu = this.addModelBaoGia.taiLieu;
    this.checkDataExistBaoGia(taiLieuBaoGiaThiTruong);
    this.clearBaoGia();
  }

  clearBaoGia() {
    this.addModelBaoGia = {
      moTa: '',
      taiLieu: [],
      ccFileDinhkems: [],
    };
  }

  editRowBaoGia(id) {
    this.editBaoGiaCache[id].edit = true;
  }

  deleteRowBaoGia(data) {
    this.canCuXacDinhList = this.canCuXacDinhList.filter(
      (x) => x.id != data.id,
    );
  }

  cancelEditBaoGia(id: number): void {
    const index = this.canCuXacDinhList.findIndex((item) => item.id === id);
    this.editBaoGiaCache[id] = {
      data: { ...this.canCuXacDinhList[index] },
      edit: false,
    };
  }

  saveEditBaoGia(id: number): void {
    this.editBaoGiaCache[id].edit = false;
    this.checkDataExistBaoGia(this.editBaoGiaCache[id].data);
  }

  updatEditBaoGiaCache(): void {
    if (this.canCuXacDinhList && this.canCuXacDinhList.length > 0) {
      this.canCuXacDinhList.forEach((item) => {
        this.editBaoGiaCache[item.id] = {
          edit: false,
          data: { ...item },
        };
      });
    }
  }

  checkDataExistBaoGia(data) {
    if (this.canCuXacDinhList && this.canCuXacDinhList.length > 0) {
      let index = this.canCuXacDinhList.findIndex((x) => x.id == data.id);
      if (index != -1) {
        this.canCuXacDinhList.splice(index, 1);
      }
    } else {
      this.canCuXacDinhList = [];
    }
    this.canCuXacDinhList = [...this.canCuXacDinhList, data];
    this.updatEditBaoGiaCache();
  }

  addCoSo() {
    const taiLieuCanCuKhac = new CanCuXacDinh();
    taiLieuCanCuKhac.loaiCanCu = '01';
    taiLieuCanCuKhac.moTa = this.addModelCoSo.moTa;
    taiLieuCanCuKhac.id = new Date().getTime() + 1;
    taiLieuCanCuKhac.ccFileDinhkems = this.addModelCoSo.ccFileDinhkems;
    taiLieuCanCuKhac.taiLieu = this.addModelCoSo.taiLieu;
    this.checkDataExistCoSo(taiLieuCanCuKhac);
    this.clearCoSo();
  }

  clearCoSo() {
    this.addModelCoSo = {
      moTa: '',
      taiLieu: [],
      ccFileDinhkems: [],
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

  downloadFileKeHoach(event) {
    let body = {
      dataType: '',
      dataId: 0,
    };
    switch (event) {
      case 'tai-lieu-dinh-kem':
        break;
      default:
        break;
    }
  }

  openDialogGoiThau(data?: any) {
    this.modal.create({
      nzTitle: 'Thông tin gói thầu',
      nzContent: DialogThemMoiKeHoachMuaTrucTiepComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '800px',
      nzFooter: null,
      nzComponentParams: {
        data: data,
      },
    });
  }

  convertListData() {
    this.helperService.setIndexArray(this.listOfData);
    this.listDataGroup = chain(this.listOfData).groupBy('tenDvi').map((value, key) => ({ tenDvi: key, dataChild: value }))
      .value()
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
