import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { saveAs } from 'file-saver';
import { chain } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DialogThemMoiVatTuComponent } from 'src/app/components/dialog/dialog-them-moi-vat-tu/dialog-them-moi-vat-tu.component';
import { MESSAGE } from 'src/app/constants/message';
import {
  CanCuXacDinh,
  DanhSachGoiThau,
  FileDinhKem,
} from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DanhSachDauThauService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/danhSachDauThau.service';
import VNnum2words from 'vn-num2words';
import * as dayjs from 'dayjs';
import { API_STATUS_CODE, LOAI_HANG_DTQG } from 'src/app/constants/config';
import { VatTu } from 'src/app/components/dialog/dialog-them-thong-tin-vat-tu-trong-nam/danh-sach-vat-tu-hang-hoa.type';
import { UploadComponent } from 'src/app/components/dialog/dialog-upload/upload.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { DialogDanhSachHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import { ChiTieuKeHoachNamCapTongCucService } from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
import { DialogThemMoiGoiThauComponent } from 'src/app/components/dialog/dialog-them-moi-goi-thau/dialog-them-moi-goi-thau.component';
import { DanhMucTieuChuanService } from 'src/app/services/quantri-danhmuc/danhMucTieuChuan.service';
import { STATUS } from "../../../../../../constants/status";
import { DatePipe } from "@angular/common";
import { QuyetDinhGiaTCDTNNService } from 'src/app/services/ke-hoach/phuong-an-gia/quyetDinhGiaTCDTNN.service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzNotificationService } from 'ng-zorro-antd/notification';


@Component({
  selector: 'app-themmoi-kehoach-lcnt',
  templateUrl: './themmoi-kehoach-lcnt.component.html',
  styleUrls: ['./themmoi-kehoach-lcnt.component.scss'],
})
export class ThemmoiKehoachLcntComponent extends Base2Component implements OnInit {
  @Input()
  loaiVthhInput: string;
  @Input()
  idInput: number;
  @Input()
  showFromTH: boolean;
  @Input()
  @Input() isView: boolean;
  @Input() isViewOnModal: boolean;
  @Input() soDx: string;
  @Output()
  showListEvent = new EventEmitter<any>();

  editCache: { [key: string]: { edit: boolean; data: DanhSachGoiThau } } = {};

  listOfData: any[] = [];
  fileDinhKem: any[] = [];
  listChiCuc: any[] = [];
  listDiemKho: any[] = [];
  listLoaiHinhNx: any[] = [];
  listKieuNx: any[] = [];
  i = 0;
  tabSelected: string = 'thongTinChung';
  listPhuongThucDauThau: any[] = [];
  listNguonVon: any[] = [];
  listNam: any[] = [];
  listHinhThucDauThau: any[] = [];
  listLoaiHopDong: any[] = [];
  listOfMapData: VatTu[];
  listOfMapDataClone: VatTu[];
  mapOfExpandedData: { [key: string]: VatTu[] } = {};
  dataChiTieu: any;
  baoGiaThiTruongList: CanCuXacDinh[] = [];
  canCuKhacList: CanCuXacDinh[] = [];
  maTrinh: string = '';
  addModelBaoGia: any = {
    moTa: '',
    tenTlieu: '',
    taiLieu: [],
  };
  addModelCoSo: any = {
    moTa: '',
    taiLieu: [],
  };
  taiLieuDinhKemList: any[] = [];
  listDataGroup: any[] = [];
  editBaoGiaCache: { [key: string]: { edit: boolean; data: any } } = {};
  editCoSoCache: { [key: string]: { edit: boolean; data: any } } = {};
  tongTienHopDong: any;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private dauThauService: DanhSachDauThauService,
    private chiTieuKeHoachNamCapTongCucService: ChiTieuKeHoachNamCapTongCucService,
    private dmTieuChuanService: DanhMucTieuChuanService,
    private quyetDinhGiaTCDTNNService: QuyetDinhGiaTCDTNNService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, dauThauService);
    this.formData = this.fb.group({
      id: [],
      maDvi: ['', [Validators.required]],
      tenDvi: ['', [Validators.required]],
      loaiHinhNx: ['', [Validators.required]],
      kieuNx: ['', [Validators.required]],
      diaChiDvi: [],
      namKhoach: [dayjs().get('year'), [Validators.required]],
      soDxuat: [null],
      trichYeu: [null],
      ngayTao: [dayjs().format('YYYY-MM-DD')],
      ngayPduyet: [],
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
      donGiaVat: [],
      vat: ['5'],
      tongMucDt: [null, [Validators.required]],
      tongMucDtDx: [null, [Validators.required]],
      nguonVon: ['NGV01', [Validators.required]],
      dienGiai: [''],
      tgianNhang: [null, [Validators.required]],
      tgianThien: [null, [Validators.required]],
      ghiChu: [null],
      ldoTuchoi: [],
      trangThai: ['00'],
      tenTrangThai: ['Dự Thảo'],
      diaDiemDuAn: ['']
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
    this.formData.get('loaiVthh').setValue(this.loaiVthhInput);
    if (this.loaiVthhInput.startsWith('02')){
      this.formData.get('vat').setValue('10');
    }
    this.loadDanhMucHang();
    if (this.idInput > 0) {
      await this.getDetail(this.idInput, null);
    } else {
      if (this.soDx) {
        await this.getDetail(null, this.soDx);
      }
      this.initForm();
    }
    await Promise.all([
      this.loadDataComboBox(),
      this.getDataChiTieu()
    ]);
    await this.spinner.hide();
  }

  async loadDataComboBox() {
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
      this.listLoaiHinhNx = resNx.data.filter(item => item.apDung == 'NHAP_DT');
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

  async loadDanhMucHang() {
    await this.danhMucService.loadDanhMucHangHoa().subscribe((hangHoa) => {
      if (hangHoa.msg == MESSAGE.SUCCESS) {
        const data = hangHoa.data.filter(item => item.ma == this.loaiVthhInput.slice(0, 2));
        if (this.loaiVthhInput == LOAI_HANG_DTQG.MUOI || this.loaiVthhInput == LOAI_HANG_DTQG.VAT_TU) {
          this.formData.get('tenLoaiVthh').setValue(data[0].ten);
        } else {
          const dataChild = data[0].child.filter(item => item.ma == this.loaiVthhInput)
          this.formData.get('tenLoaiVthh').setValue(dataChild[0].ten);
        }
      }
    })
  }

  onChangeLhNx($event) {
    let dataNx = this.listLoaiHinhNx.filter(item => item.ma == $event);
    if (dataNx.length > 0) {
      this.formData.patchValue({
        kieuNx: dataNx[0].ghiChu
      })
    }
  }

  async getDetail(id?: number, soDx?: string) {
    if (id) {
      await this.dauThauService
        .getDetail(id)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const dataDetail = res.data;
            this.helperService.bidingDataInFormGroup(this.formData, dataDetail);
            this.formData.patchValue({
              soDxuat: dataDetail.soDxuat?.split('/')[0]
            })
            if (dataDetail) {
              this.fileDinhKem = dataDetail.fileDinhKems;
              this.listOfData = dataDetail.dsGtDtlList;
              if (dataDetail.loaiVthh != '02') {
                this.convertListDataLuongThuc()
              } else {
                this.convertListData();
              }
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
    if (soDx) {
      var body = this.formData.value
      body.soDxuat = soDx
      await this.dauThauService
        .getDetailBySoDx(body)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const dataDetail = res.data;
            this.helperService.bidingDataInFormGroup(this.formData, dataDetail);
            this.formData.patchValue({
              soDxuat: dataDetail.soDxuat?.split('/')[0]
            })
            if (dataDetail) {
              this.fileDinhKem = dataDetail.fileDinhKems;
              this.listOfData = dataDetail.dsGtDtlList;
              if (dataDetail.loaiVthh != '02') {
                this.convertListDataLuongThuc()
              } else {
                this.convertListData();
              }
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
      if (this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_VT_DEXUAT_THEM")) {
        return true;
      }
    }
    else {
      if (this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_LT_DEXUAT_THEM")) {
        return true;
      }
    }
    this.notification.error(MESSAGE.ERROR, "Bạn không có quyền truy cập chức năng này !")
    return false;
  }

  initForm() {
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI,
      maDvi: this.userInfo.MA_DVI,
      diaChiDvi: this.userInfo.DON_VI.diaChi,
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
    let bodyParamVatTu = {
      data,
      isCaseSpecial: true,
      onlyVatTu: true
    }
    let bodyParamLT = {
      data,
      onlyLuongThuc: true
    }
    const modalTuChoi = this.modal.create({
      nzTitle: 'Danh sách hàng hóa',
      nzContent: DialogDanhSachHangHoaComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: this.userService.isCuc() ? bodyParamLT : bodyParamVatTu
    });
    modalTuChoi.afterClose.subscribe(async (data) => {
      if (data) {
        if (this.userService.isCuc()) {
          this.formData.patchValue({
            cloaiVthh: data.ma,
            tenCloaiVthh: data.ten,
            loaiVthh: data.parent.ma,
            tenLoaiVthh: data.parent.ten,
          });
          let res = await this.dmTieuChuanService.getDetailByMaHh(
            this.formData.get('cloaiVthh').value,
          );
          let bodyPag = {
            namKeHoach: this.formData.value.namKhoach,
            loaiVthh: this.formData.value.loaiVthh,
            cloaiVthh: this.formData.value.cloaiVthh,
            trangThai: STATUS.BAN_HANH,
            maDvi: this.formData.value.maDvi,
            loaiGia: 'LG03'
          }
          let pag = await this.quyetDinhGiaTCDTNNService.getPag(bodyPag)
          if (pag.msg == MESSAGE.SUCCESS) {
            const data = pag.data;
            this.formData.patchValue({
              donGiaVat: data.giaQdVat
            })
            // if (!data.giaQdVat) {
            //   this.notification.error(MESSAGE.ERROR, "Chủng loại hàng hóa đang chưa có giá, xin vui lòng thêm phương án giá!")
            // }
          }
          if (res.statusCode == API_STATUS_CODE.SUCCESS) {
            this.formData.patchValue({
              tchuanCluong: res.data ? res.data.tenQchuan : null,
            });
          }
        } else {
          this.formData.patchValue({
            cloaiVthh: data.ma,
            loaiVthh: data.ma,
            tenLoaiVthh: data.ten
          });
        }
      }
    });
  }

  themMoiGoiThau(data?: DanhSachGoiThau, index?: number) {
    if (this.userService.isTongCuc()) {
      this.themMoiTongCuc(data, index);
    } else {
      this.themMoiCuc();
    }
  }

  themMoiTongCuc(data?: any, index?: number) {
    if (this.formData.get('loaiVthh').value == null || this.formData.get('cloaiVthh').value == null) {
      this.notification.error(MESSAGE.NOTIFICATION, "Vui lòng chọn loại hàng hóa");
      return;
    }
    let listGoiThau = [];
    this.listOfData.forEach(item => {
      listGoiThau.push(item.goiThau)
    })
    let setListGoiThau = new Set(listGoiThau);
    listGoiThau = [...setListGoiThau]
    let isReadOnly = false;
    if (data != null) {
      isReadOnly = true;
    }
    const modal = this.modal.create({
      nzTitle: 'Địa điểm nhập hàng',
      nzContent: DialogThemMoiGoiThauComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1500px',
      nzFooter: null,
      nzClassName: 'dialog-vat-tu',
      nzComponentParams: {
        trangThai: this.formData.get('trangThai').value,
        data: data,
        dataAll: this.listOfData,
        listGoiThau: listGoiThau,
        isReadOnly: isReadOnly,
        dataChiTieu: this.dataChiTieu,
        loaiVthh: this.formData.get('loaiVthh').value,
        dviTinh: this.formData.get('loaiVthh').value.maDviTinh,
        namKeHoach: this.formData.value.namKhoach,
      },
    });
    modal.afterClose.subscribe((res) => {
      if (res) {
        let isUpdate = false;
        for (let i = 0; index < this.listOfData.length; i++) {
          if (this.listOfData[i].goiThau == res.goiThau) {
            this.listOfData[i] = res;
            isUpdate = true;
          }
        }
        if (!isUpdate) {
          this.listOfData.push(res);
        }
        let tongMucDt: number = 0;
        let tongMucDtDx: number = 0;
        this.listOfData.forEach((item) => {
          tongMucDt = tongMucDt + item.soLuong * item.donGiaVat;
          tongMucDtDx = tongMucDtDx + item.soLuong * item.donGiaTamTinh;
        });
        this.formData.patchValue({
          tongMucDt: tongMucDt,
          tongMucDtDx: tongMucDtDx,
        });
      }
    });
  }

  themMoiCuc(goiThau?: string) {
    if (!this.formData.get('loaiVthh').value) {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng chọn loại hàng hóa');
      return;
    }
    let data = [];
    let listGoiThau = [];
    this.listOfData.forEach(item => {
      listGoiThau.push(item.goiThau)
      if (goiThau && goiThau != '' && item.goiThau == goiThau) {
        data.push(item)
      }
    })
    let setListGoiThau = new Set(listGoiThau);
    listGoiThau = [...setListGoiThau]
    let disabledGoiThau = false;
    if (goiThau && goiThau != '') {
      disabledGoiThau = true;
    }
    const modalGT = this.modal.create({
      nzTitle: '',
      nzContent: DialogThemMoiVatTuComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1500px',
      nzFooter: null,
      nzClassName: 'dialog-luong-thuc',
      nzComponentParams: {
        disabledGoiThau: disabledGoiThau,
        dataAll: this.listOfData,
        listGoiThau: listGoiThau,
        dataEdit: data,
        dataChiTieu: this.dataChiTieu,
        loaiVthh: this.formData.get('loaiVthh').value,
        cloaiVthh: this.formData.get('cloaiVthh').value,
        tenCloaiVthh: this.formData.get('tenCloaiVthh').value,
        namKhoach: this.formData.get('namKhoach').value,
        donGiaVat: this.formData.get('donGiaVat').value
      },
    });
    modalGT.afterClose.subscribe((res) => {
      if (!res) {
        return;
      }
      let isReplace = false;
      if (res.value.goiThau && res.value.goiThau != '') {
        for (let i = 0; i < this.listOfData.length; i++) {
          if (this.listOfData[i].goiThau == res.value.goiThau) {
            this.listOfData.splice(i, 1, res.value)
            isReplace = true;
          }
        }
      }
      if (isReplace == false) {
        this.listOfData = [...this.listOfData, res.value]
      }
      let tongMucDt: number = 0;
      let tongMucDtDx: number = 0;
      this.listOfData.forEach((item) => {
        tongMucDt = tongMucDt + (item.soLuong * item.donGiaVat *1000);
        tongMucDtDx = tongMucDtDx + (item.soLuong * item.donGiaTamTinh * 1000);
      });
      this.formData.patchValue({
        tongMucDt: tongMucDt,
        tongMucDtDx: tongMucDtDx,
      });
      this.convertListDataLuongThuc();
    });

  }
  deleteRowLt(i: number, goiThau: string, z?: number) {
    for (let index = 0; index < this.listOfData.length; index++) {
      if (this.listOfData[index].goiThau == goiThau) {
        if (z) {
          for (let v = 0; v < this.listOfData[index].children.length; v++) {
            if (this.listOfData[index].children[v].idx == i) {
              this.listOfData[index].children[v].children.splice(z, 1)
              if (this.listOfData[index].children[v].children.length == 0) {
                this.listOfData[index].children = this.listOfData[index].children.filter((d, index) => d.idx !== i);
                if (this.listOfData[index].children.length == 0) {
                  this.listOfData.splice(index, 1)
                }
              }
            }
          }
        } else {
          this.listOfData[index].children = this.listOfData[index].children.filter((d, index) => d.idx !== i);
          if (this.listOfData[index].children.length == 0) {
            this.listOfData.splice(index, 1)
          }
        }
        this.helperService.setIndexArray(this.listOfData);
        this.convertListDataLuongThuc()
      }
    }
  }

  deleteRow(i: number): void {
    this.listOfData = this.listOfData.filter((d, index) => index !== i);
    this.helperService.setIndexArray(this.listOfData);
    this.convertListData();
  }

  async save(isGuiDuyet?) {
    if (!this.isDetailPermission()) {
      return;
    }
    this.setValidator(isGuiDuyet);
    if (!isGuiDuyet && this.formData.get('trangThai').value == this.STATUS.DU_THAO) {
      this.clearValidatorLuuDuThao();
      this.helperService.markFormGroupTouched(this.formData);
      if (this.formData.invalid) {
        return;
      }
      if (this.formData.get('loaiVthh').value == null) {
        this.formData.get('loaiVthh').setValue(this.loaiVthhInput)
      }
      await this.luuVaGuiDuyet(isGuiDuyet);
    } else {
      this.khoiPhucValidator()
      this.setValidator(isGuiDuyet);
      this.helperService.markFormGroupTouched(this.formData);
      if (this.formData.invalid) {
        return;
      }
      if (this.listOfData.length == 0) {
        this.notification.error(
          MESSAGE.ERROR,
          'Danh sách kế hoạch không được để trống',
        );
        return;
      }
      if (this.validateSave()) {
        await this.luuVaGuiDuyet(isGuiDuyet)
      }
    }
  }

  async luuVaGuiDuyet(isGuiDuyet) {
    let pipe = new DatePipe('en-US');
    let body = this.formData.value;
    if (this.formData.get('soDxuat').value) {
      body.soDxuat = this.formData.get('soDxuat').value + this.maTrinh;
    }
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
          // this.quayLai();
        } else {
          this.formData.get('id').setValue(res.data.id);
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
          // this.quayLai();
        }
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  setValidator(isGuiDuyet) {
    if (isGuiDuyet) {
      this.formData.controls["soDxuat"].setValidators([Validators.required]);
    } else {
      this.formData.controls["soDxuat"].clearValidators();
    }
    if (this.userService.isTongCuc()) {
      this.formData.controls["cloaiVthh"].clearValidators();
      this.formData.controls["tenCloaiVthh"].clearValidators();
      this.formData.controls["moTaHangHoa"].clearValidators();
      // this.formData.controls["donGiaVat"].clearValidators();
      this.formData.controls["tgianNhang"].clearValidators();
      this.formData.controls["tgianThien"].setValidators([Validators.required]);
    } else {
      this.formData.controls["cloaiVthh"].setValidators([Validators.required]);
      this.formData.controls["tenCloaiVthh"].setValidators([Validators.required]);
      this.formData.controls["moTaHangHoa"].setValidators([Validators.required]);
      // this.formData.controls["donGiaVat"].setValidators([Validators.required]);
      this.formData.controls["tgianNhang"].setValidators([Validators.required]);
      this.formData.controls["tgianThien"].clearValidators();
    }
  }

  khoiPhucValidator() {
    this.formData.controls["tenDvi"].setValidators([Validators.required]);
    this.formData.controls["loaiHinhNx"].setValidators([Validators.required]);
    this.formData.controls["kieuNx"].setValidators([Validators.required]);
    this.formData.controls["namKhoach"].setValidators([Validators.required]);
    this.formData.controls["soQd"].setValidators([Validators.required]);
    this.formData.controls["loaiVthh"].setValidators([Validators.required]);
    this.formData.controls["tenLoaiVthh"].setValidators([Validators.required]);
    this.formData.controls["cloaiVthh"].setValidators([Validators.required]);
    this.formData.controls["tenCloaiVthh"].setValidators([Validators.required]);
    this.formData.controls["moTaHangHoa"].setValidators([Validators.required]);
    this.formData.controls["tenDuAn"].setValidators([Validators.required]);
    this.formData.controls["hthucLcnt"].setValidators([Validators.required]);
    this.formData.controls["pthucLcnt"].setValidators([Validators.required]);
    this.formData.controls["tgianBdauTchuc"].setValidators([Validators.required]);
    this.formData.controls["tgianDthau"].setValidators([Validators.required]);
    this.formData.controls["tgianMthau"].setValidators([Validators.required]);
    this.formData.controls["gtriDthau"].setValidators([Validators.required]);
    this.formData.controls["gtriHdong"].setValidators([Validators.required]);
    this.formData.controls["tongMucDt"].setValidators([Validators.required]);
    this.formData.controls["tongMucDtDx"].setValidators([Validators.required]);
    this.formData.controls["nguonVon"].setValidators([Validators.required]);
    this.formData.controls["tgianNhang"].setValidators([Validators.required]);
    this.formData.controls["tgianThien"].setValidators([Validators.required]);
  }

  clearValidatorLuuDuThao() {
    Object.keys(this.formData.controls).forEach(key => {
      const control = this.formData.controls[key];
      control.clearValidators();
      control.updateValueAndValidity();
    });
    this.formData.updateValueAndValidity();
  }

  validateSave() {
    let pipe = new DatePipe('en-US');
    let tgianBdauTchuc = new Date(pipe.transform(this.formData.value.tgianBdauTchuc, 'yyyy-MM-dd') + " 23:59:59");
    let tgianMthau = new Date(this.formData.value.tgianMthau)
    let tgianDthau = new Date(this.formData.value.tgianDthau)
    let tgianNhang = new Date(pipe.transform(this.formData.value.tgianNhang, 'yyyy-MM-dd') + " 00:00:00");
    if (tgianBdauTchuc >= tgianMthau) {
      this.notification.error(MESSAGE.ERROR, "Thời gian bắt đầu tổ chức không được vượt quá thời gian mở thầu")
      return false
    } else if (tgianMthau >= tgianDthau) {
      this.notification.error(MESSAGE.ERROR, "Thời gian mở thầu không được vượt quá thời gian đóng thầu")
      return false
    } else if (tgianDthau >= tgianNhang) {
      this.notification.error(MESSAGE.ERROR, "Thời gian đóng thầu không được vượt quá thời gian nhập hàng")
      return false
    }
    return true;
  }

  async getDataChiTieu() {
    let res2 = null;
    if (this.loaiVthhInput.startsWith('02')) {
      res2 = await this.chiTieuKeHoachNamCapTongCucService.loadThongTinChiTieuKeHoachVtNam(
        +this.formData.get('namKhoach').value,
      );
    } else {
      res2 = await this.chiTieuKeHoachNamCapTongCucService.loadThongTinChiTieuKeHoachCucNam(
        +this.formData.get('namKhoach').value,
      );
    }
    if (res2.msg == MESSAGE.SUCCESS) {
      this.dataChiTieu = res2.data;
      this.formData.patchValue({
        soQd: this.dataChiTieu.soQuyetDinh
      });
    } else {
      this.dataChiTieu = null;
      this.formData.patchValue({
        soQd: null
      });
    }
  }

  onChangeNamKh() {
    this.getDataChiTieu();
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
    this.userService.isTongCuc() ? await this.guiDuyetTongCuc() : await this.guiDuyetCuc()
  }

  async guiDuyetTongCuc() {
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
          if (this.formData.get('loaiVthh').value.startsWith('02')) {
            switch (this.formData.get('trangThai').value) {
              case STATUS.TU_CHOI_LDV:
              case STATUS.DU_THAO: {
                body.trangThai = STATUS.CHO_DUYET_LDV;
                break;
              }
              case STATUS.CHO_DUYET_LDV: {
                body.trangThai = STATUS.DA_DUYET_LDV;
                break;
              }
            }
          } else {
            switch (this.formData.get('trangThai').value) {
              case STATUS.CHUA_TONG_HOP: {
                body.trangThai = STATUS.DA_TONG_HOP;
                break;
              }
            }
          }
          let res = await this.dauThauService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.DUYET_SUCCESS);
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


  async guiDuyetCuc() {
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
              MESSAGE.DUYET_SUCCESS,
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
      nzTitle: 'TỪ CHỐI PHÊ DUYỆT',
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
            case STATUS.CHO_DUYET_LDV: {
              body.trangThai = STATUS.TU_CHOI_LDV;
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
        const lastPeriodIndex = resUpload.filename.lastIndexOf(".");
        let fileName = '';
        if (lastPeriodIndex !== -1) {
          fileName = resUpload.filename.slice(0, lastPeriodIndex);
        } else {
          fileName = resUpload.filename;
        }
        fileDinhKem.noiDung = fileName
        if (type == 'bao-gia') {
          if (id == 0) {
            if (this.addModelBaoGia.tenTlieu == null || this.addModelBaoGia.tenTlieu == '') {
              this.addModelBaoGia.tenTlieu = fileName;
            }
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
            if (this.editBaoGiaCache[id].data.tenTlieu == null || this.editBaoGiaCache[id].data.tenTlieu == '') {
              this.editBaoGiaCache[id].data.tenTlieu = fileName;
            }
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
            if (this.addModelCoSo.tenTlieu == null || this.addModelCoSo.tenTlieu == '') {
              this.addModelCoSo.tenTlieu = fileName;
            }
            this.addModelCoSo.taiLieu = [];
            this.addModelCoSo.taiLieu = [...this.addModelCoSo.taiLieu, item];
            this.addModelCoSo.children = [];
            this.addModelCoSo.children = [
              ...this.addModelCoSo.children,
              fileDinhKem,
            ];
          } else if (id > 0) {
            if (this.editCoSoCache[id].data.tenTlieu == null || this.editBaoGiaCache[id].data.tenTlieu == '') {
              this.editCoSoCache[id].data.tenTlieu = fileName;
            }
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
    // if (this.addModelBaoGia.taiLieu == null || this.addModelBaoGia.taiLieu == '') {
    //   this.notification.error(
    //     MESSAGE.ERROR,
    //     'Vui lòng nhập file đính kèm',
    //   );
    //   return;
    // }
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
    // if (this.addModelCoSo.taiLieu == null || this.addModelCoSo.taiLieu == '') {
    //   this.notification.error(
    //     MESSAGE.ERROR,
    //     'Vui lòng nhập file đính kèm',
    //   );
    //   return;
    // }
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

  convertListData() {
    this.helperService.setIndexArray(this.listOfData);
    this.listDataGroup = chain(this.listOfData).groupBy('tenDvi').map((value, key) => ({ tenDvi: key, dataChild: value }))
      .value()
  }

  convertListDataLuongThuc() {
    let listChild = [];
    this.listOfData.forEach(item => {
      item.children.forEach(i => {
        listChild.push(i)
      })
    })
    this.helperService.setIndexArray(listChild);
    this.listDataGroup = chain(listChild).groupBy('tenDvi').map((value, key) => (
      {
        tenDvi: key,
        soLuongTheoChiTieu: value[0].soLuongTheoChiTieu,
        soLuong: null,
        soLuongDaMua: value[0].soLuongDaMua,
        dataChild: value
      })).value()
    this.listDataGroup.forEach(item => {
      let sluong = 0;
      item.dataChild.forEach(i => {
        sluong = sluong + i.soLuong
      })
      item.soLuong = sluong;
    })
  }

  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  expandSet2 = new Set<number>();
  onExpandChange2(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet2.add(id);
    } else {
      this.expandSet2.delete(id);
    }
  }

  expandSet3 = new Set<number>();
  onExpandChange3(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet3.add(id);
    } else {
      this.expandSet3.delete(id);
    }
  }

  isDisbleForm(): boolean {
    if (this.formData.value.trangThai == STATUS.DU_THAO || this.formData.value.trangThai == STATUS.TU_CHOI_TP || this.formData.value.trangThai == STATUS.TU_CHOI_LDC) {
      return false
    } else {
      return true
    }
  }

  calcTongSl() {
    if (this.listOfData) {
      let sum = 0
      this.listOfData.forEach(item => {
        const sumChild = item.children.reduce((prev, cur) => {
          prev += cur.soLuong;
          return prev;
        }, 0);
        sum += sumChild;
      })
      return sum;
    }
  }

  calcTongThanhTien() {
    if (this.listOfData) {
      let sum = 0
      this.listOfData.forEach(item => {
        const sumChild = item.children.reduce((prev, cur) => {
          prev += cur.soLuong * item.donGiaTamTinh;
          return prev;
        }, 0);
        sum += sumChild;
      })
      if (this.loaiVthhInput.startsWith('02')){
        return sum;
      } else {
        return sum * 1000;
      }
    }
  }

  calcTongThanhTienBaoLanh() {
    if (this.listOfData) {
      let sum = 0
      this.listOfData.forEach(item => {
        const sumChild = item.children.reduce((prev, cur) => {
          prev += cur.soLuong * item.donGiaTamTinh * 1000;
          return prev;
        }, 0);
        sum += sumChild;
      })
      return sum * this.formData.get('gtriDthau').value / 100;
    }
  }

}
