import { NzNotificationService } from 'ng-zorro-antd/notification';
import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';
import { groupBy , chain } from 'lodash';
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
import {BaseComponent} from "../../../../../../../components/base/base.component";
import {DatePipe} from "@angular/common";


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
  selector: 'app-themmoi-kehoach-lcnt',
  templateUrl: './themmoi-kehoach-lcnt.component.html',
  styleUrls: ['./themmoi-kehoach-lcnt.component.scss'],
})
export class ThemmoiKehoachLcntComponent extends BaseComponent implements OnInit , OnChanges {
  @Input()
  loaiVthhInput: string;
  @Input()
  idInput: number;
  @Input()
  showFromTH: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();

  editCache: { [key: string]: { edit: boolean; data: DanhSachGoiThau } } = {};

  formData: FormGroup;
  listOfData: DanhSachGoiThau[] = [];
  cacheData: DanhSachGoiThau[] = [];
  fileDinhKem: any[] = [];
  userLogin: UserLogin;
  listChiCuc: any[] = [];
  listDiemKho: any[] = [];
  listLoaiHinhNx : any[] = [];
  listKieuNx : any[] = [];

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

  listDataGroup : any[] = [];

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
    private dauThauService: DanhSachDauThauService,
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
    super();
    this.formData = this.fb.group({
      id: [],
      maDvi: ['',[Validators.required]],
      tenDvi : ['',[Validators.required]],
      loaiHinhNx : ['',[Validators.required]],
      kieuNx : ['',[Validators.required]],
      diaChiDvi : [],
      namKhoach: [, [Validators.required]],
      soDxuat: [null, [Validators.required]],
      trichYeu: [null],
      ngayTao : [dayjs().format('YYYY-MM-DD')],
      ngayPduyet : [],
      soQd: [, [Validators.required]],
      loaiVthh: [, [Validators.required]],
      tenLoaiVthh: [, [Validators.required]],
      cloaiVthh: [, [Validators.required]],
      tenCloaiVthh: [, [Validators.required]],
      moTaHangHoa: [, [Validators.required]],
      tchuanCluong: [null],
      tenDuAn: [null, [Validators.required]],
      loaiHdong: [null, [Validators.required]],
      hthucLcnt: [null, [Validators.required]],
      pthucLcnt: [null, [Validators.required]],
      tgianBdauTchuc: [null, [Validators.required]],

      tgianDthau: [null, [Validators.required]],
      tgianMthau: [null, [Validators.required]],

      gtriDthau: [null, [Validators.required]],
      gtriHdong: [null, [Validators.required]],
      donGiaVat : [''],
      tongMucDt: [null, [Validators.required]],
      nguonVon: [null, [Validators.required]],
      tgianNhang: [null, [Validators.required]],
      ghiChu: [null],
      ldoTuchoi: [],
      trangThai: ['00'],
      tenTrangThai: ['Dự Thảo'],
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
    await this.spinner.hide();
  }

  async loadDataComboBox(){
    // List nguồn vốn
    this.listNguonVon = [];
    let resNv = await this.danhMucService.danhMucChungGetAll('NGUON_VON');
    if (resNv.msg == MESSAGE.SUCCESS) {
      this.listNguonVon = resNv.data;
    }
    // phương thức đấu thầu
    this.listPhuongThucDauThau = [];
    let resPt = await this.danhMucService.danhMucChungGetAll('PT_DTHAU');
    if (resPt.msg == MESSAGE.SUCCESS) {
      this.listPhuongThucDauThau = resPt.data;
    }
    // loại hình nhập xuất
    this.listLoaiHinhNx = [];
    let resNx = await this.danhMucService.danhMucChungGetAll('LOAI_HINH_NHAP_XUAT');
    if (resNx.msg == MESSAGE.SUCCESS) {
      this.listLoaiHinhNx = resNx.data.filter( item => item.phanLoai == 'N');
    }
    // kiểu nhập xuất
    this.listKieuNx = [];
    let resKieuNx = await this.danhMucService.danhMucChungGetAll('KIEU_NHAP_XUAT');
    if (resKieuNx.msg == MESSAGE.SUCCESS) {
      this.listKieuNx = resKieuNx.data
    }
    // hình thức đấu thầu
    this.listHinhThucDauThau = [];
    let resPtdt = await this.danhMucService.danhMucChungGetAll('HT_LCNT');
    if (resPtdt.msg == MESSAGE.SUCCESS) {
      this.listHinhThucDauThau = resPtdt.data;
    }
    // hợp đồng
    this.listLoaiHopDong = [];
    let resHd = await this.danhMucService.danhMucChungGetAll('LOAI_HDONG');
    if (resHd.msg == MESSAGE.SUCCESS) {
      this.listLoaiHopDong = resHd.data;
    }
  }

  async getDetail(id: number) {
    if(id){
      await this.dauThauService
        .getDetail(id)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const dataDetail = res.data;
            this.helperService.bidingDataInFormGroup(this.formData,dataDetail);
            this.formData.patchValue({
              soDxuat: dataDetail.soDxuat.split('/')[0]
            })
            // this.formData.patchValue({
            //   id: dataDetail ? dataDetail.id : null,
            //   soQd: dataDetail ? dataDetail.soQd : null,
            //   soDxuat: dataDetail ? dataDetail.soDxuat.split('/')[0] : null,
            //   trichYeu: dataDetail ? dataDetail.trichYeu : null,
            //   ghiChu: dataDetail ? dataDetail.ghiChu : null,
            //   namKhoach: dataDetail ? dataDetail.namKhoach : dayjs().get('year'),
            //   loaiVthh: dataDetail ? dataDetail.loaiVthh : this.loaiVthhInput,
            //   tenLoaiVthh: dataDetail ? dataDetail.tenLoaiVthh : null,
            //   ngayKy: dataDetail ? dataDetail.ngayKy : null,
            //   trangThai: dataDetail ? dataDetail.trangThai : '00',
            //   maDvi: dataDetail ? dataDetail.maDvi : this.userInfo.MA_DVI,
            //   cloaiVthh: dataDetail ? dataDetail.cloaiVthh : null,
            //   tenCloaiVthh: dataDetail ? dataDetail.tenCloaiVthh : null,
            //   moTaHangHoa: dataDetail ? dataDetail.moTaHangHoa : null,
            //   maVtu: dataDetail ? dataDetail.maVtu : null,
            //   tenVtu: dataDetail ? dataDetail.tenVtu : null,
            //   tenDuAn: dataDetail ? dataDetail.tenDuAn : null,
            //   tenDvi: dataDetail ? dataDetail.tenDvi : this.userInfo.TEN_DVI,
            //   tongMucDt: dataDetail ? dataDetail.tongMucDt : null,
            //   nguonVon: dataDetail ? dataDetail.nguonVon : null,
            //   tchuanCluong: dataDetail ? dataDetail.tchuanCluong : null,
            //   loaiHdong: dataDetail ? dataDetail.loaiHdong : null,
            //   hthucLcnt: dataDetail ? dataDetail.hthucLcnt : null,
            //   pthucLcnt: dataDetail ? dataDetail.pthucLcnt : null,
            //   tgianBdauTchuc: dataDetail ? dataDetail.tgianBdauTchuc : null,
            //   tgianMthau: dataDetail ? dataDetail.tgianMthau : null,
            //   tgianDthau: dataDetail ? dataDetail.tgianDthau : null,
            //   gtriDthau: dataDetail ? dataDetail.gtriDthau : null,
            //   gtriHdong: dataDetail ? dataDetail.gtriHdong : null,
            //   tgianThienHd: dataDetail ? dataDetail.tgianThienHd : null,
            //   tgianNhang: dataDetail ? dataDetail.tgianNhang : null,
            //   tenTrangThai: dataDetail ? dataDetail.tenTrangThai : 'Dự Thảo',
            //   lyDoTuChoi: dataDetail ? dataDetail.ldoTuchoi : null
            // });
            if (dataDetail) {
              this.fileDinhKem = dataDetail.fileDinhKems;
              this.listOfData = dataDetail.dsGtDtlList;
              this.convertListData();
              this.bindingCanCu(dataDetail.ccXdgDtlList);
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
      tenDvi : this.userInfo.TEN_DVI,
      maDvi : this.userInfo.MA_DVI,
      diaChiDvi : this.userInfo.DON_VI.diaChi,
      namKhoach : dayjs().get('year')
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

  themMoiGoiThau(data?: DanhSachGoiThau, index?: number) {
    if (!this.formData.get('loaiVthh').value) {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng chọn loại hàng hóa');
      return;
    }
    const modalGT = this.modal.create({
      nzTitle: 'Thêm địa điểm nhập kho',
      nzContent: DialogThemMoiVatTuComponent,
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
      const dsGoiThauDialog = new DanhSachGoiThau();
      dsGoiThauDialog.bangChu = res.value.bangChu;
      dsGoiThauDialog.giaTriDamBao = res.value.giaTriDamBao;
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
      if (index >= 0) {
        this.listOfData[index] = dsGoiThauDialog;
      } else {
        this.listOfData = [...this.listOfData, dsGoiThauDialog];
      }
      let tongMucDt: number = 0;
      this.listOfData.forEach((item) => {
        tongMucDt = tongMucDt + item.soLuong * item.donGia;
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
    if (this.listOfData.length == 0) {
      this.notification.error(
        MESSAGE.ERROR,
        'Danh sách kế hoạch không được để trống',
      );
      return;
    }
    let pipe = new DatePipe('en-US');
    let body = this.formData.value;
    body.soDxuat = this.formData.get('soDxuat').value + this.maTrinh;
    body.tgianDthau = pipe.transform(body.tgianDthau, 'yyyy-MM-dd HH:mm')
    body.tgianMthau = pipe.transform(body.tgianMthau, 'yyyy-MM-dd HH:mm')
    body.fileDinhKemReq = this.fileDinhKem;
    body.dsGtReq = this.listOfData;
    body.ccXdgReq = [...this.baoGiaThiTruongList, ...this.canCuKhacList];
    let res = null;
    if (this.formData.get('id').value) {
      res = await this.dauThauService.update(body);
    } else {
      res = await this.dauThauService.create(body);
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
        +this.formData.get('namKhoach').value,
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
          let res = await this.dauThauService.approve(body);
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
          const res = await this.dauThauService.approve(body);
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

  convertListData(){
    this.listDataGroup = chain(this.listOfData).groupBy('tenDvi').map((value, key) => ({ tenDvi : key, dataChild : value }))
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
    if(changes){
      await this.getDetail(this.idInput);
    };
    await this.spinner.hide();
  }

}
