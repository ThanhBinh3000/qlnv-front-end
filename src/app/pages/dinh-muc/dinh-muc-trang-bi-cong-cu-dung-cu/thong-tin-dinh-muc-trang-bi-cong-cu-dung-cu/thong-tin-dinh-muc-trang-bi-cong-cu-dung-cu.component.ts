import { Component, Input, OnInit } from '@angular/core';
import { Base2Component } from '../../../../components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { DonviService } from '../../../../services/donvi.service';
import { StorageService } from '../../../../services/storage.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzModalService } from 'ng-zorro-antd/modal';
import * as uuid from 'uuid';
import { QlDinhMucPhiService } from '../../../../services/qlnv-kho/QlDinhMucPhi.service';
import { DanhMucDinhMucService } from '../../../../services/danh-muc-dinh-muc.service';
import { DanhMucService } from '../../../../services/danhmuc.service';
import { FormGroup, Validators } from '@angular/forms';
import { MESSAGE } from '../../../../constants/message';
import { DanhMucCongCuDungCuService } from '../../../../services/danh-muc-cong-cu-dung-cu.service';
import { STATUS } from '../../../../constants/status';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-thong-tin-dinh-muc-trang-bi-cong-cu-dung-cu',
  templateUrl: './thong-tin-dinh-muc-trang-bi-cong-cu-dung-cu.component.html',
  styleUrls: ['./thong-tin-dinh-muc-trang-bi-cong-cu-dung-cu.component.scss'],
})
export class ThongTinDinhMucTrangBiCongCuDungCuComponent extends Base2Component implements OnInit {
  @Input('isViewDetail') isViewDetail: boolean;
  dataTableDetail: any[] = [];
  isVisible = false;
  formDataDetail: FormGroup;
  listCcdc: any = [];
  listDonVi: any = [];
  listHangHoaLT: any = [{ ma: '01', ten: 'Thóc tẻ' }, { ma: '02', ten: 'Gạo tẻ' }];
  listHangHoaVT: any = [];
  listHangHoa: any = [];
  listHangHoaAll: any = [];
  listHtBaoQuan: any = [];
  listdmBaoQuan: any = [];
  isAddetail: boolean = true;
  @Input()
  idInput: number;

  constructor(
    httpClient: HttpClient,
    private donViService: DonviService,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private qlDinhMucPhiService: QlDinhMucPhiService,
    private danhMucDinhMucCcdcService: DanhMucCongCuDungCuService,
    private danhMucService: DanhMucService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, qlDinhMucPhiService);
    this.formData = this.fb.group({
      id: [''],
      soQd: ['', [Validators.required]],
      trangThai: [STATUS.DANG_NHAP_DU_LIEU],
      tenTrangThai: ['Đang nhập dữ liệu'],
      ngayKy: ['', [Validators.required]],
      ngayHieuLuc: ['', [Validators.required]],
      ngayHetHieuLuc: [''],
      loai: ['01'],
      trichYeu: ['', [Validators.required]],
      listQlDinhMucPhis: [null],
      listQlDinhMucTbCcdcDtl: [null],
      fileDinhKems: [null],
    });
    this.filterTable = {};
  }


  async ngOnInit() {
    this.dataTableDetail = [];
    this.spinner.show();
    try {
      await this.loadListCcdc();
      await this.loadDonVi();
      await this.initFormDataDetail();
      await this.loadDsVatTu();
      await this.getListDinhMucBq();
      await this.getListHinhThucBq();
      this.listHangHoaAll = this.listHangHoaAll.concat(this.listHangHoaLT);
      this.listHangHoaAll = this.listHangHoaAll.concat(this.listHangHoaVT);
      this.listHangHoa = this.listHangHoaLT;
      if (this.idInput > 0) {
        await this.detail(this.idInput);
      }
      this.spinner.hide();
    } catch (e) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  initFormDataDetail(dvt: string = 'kg') {
    this.formDataDetail = this.fb.group({
      id: [''],
      idVirtual: [''],
      tenCcdc: [''],
      maCcdc: ['', [Validators.required]],
      donViTinh: ['', [Validators.required]],
      apDungTai: [[]],
      dmVpCuc: [''],
      dmVpChiCuc: [''],
      cucKtbq: [''],
      chiCucKtbq: [''],
      ccRaDm: ['', [Validators.required]],
      loaiHhBq: [[]],
      htBaoQuan: [''],
      dmBaoQuan: [[]],
      dmTheoDiemKho: [null],
      ghiChu: [null],
      ycKyThuat: [null],
      trangBi: [null],
      dmTrangBi: [null],
      khoiLuong: [null],
      dvt: dvt,
      tenNhomCcdc: [''],
      nhomCcdc: ['', [Validators.required]],
    });
  }

  quayLai() {
    this.goBack();
  }

  ngungHieuLuc(id, trangThai) {
    this.approve(id, trangThai, 'Bạn có chắc chắn muốn ban ngừng hiệu lực văn bản này?');
  }

  async loadListCcdc() {
    this.listCcdc = [];
    let body = {
      paggingReq: {
        limit: 10000,
        page: 0,
      },
    };
    let res = await this.danhMucDinhMucCcdcService.searchDsChuaSuDung(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content && res.data.content.length > 0) {
        for (let item of res.data.content) {
          this.listCcdc.push(item);
        }
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  };

  async getListDinhMucBq() {
    this.listdmBaoQuan = [];
    let res = await this.danhMucService.danhMucChungGetAll('LOAI_DINH_MUC');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listdmBaoQuan = res.data;
    }
  }

  async getListHinhThucBq() {
    this.listHtBaoQuan = [];
    let res = await this.danhMucService.danhMucChungGetAll('LOAI_HINH_BAO_QUAN');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listHtBaoQuan = res.data;
    }
  }

  async loadDonVi() {
    const res = await this.donViService.layDonViCon();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDonVi = res.data.filter(item => item.type !== 'PB');
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async saveAndSend(trangThai: string, msg: string, msgSuccess?: string) {
    try {
      if (this.dataTableDetail.length <= 0) {
        this.notification.error(MESSAGE.ERROR, 'Bạn chưa nhập chi tiết định mức phí công cụ dụng cụ.');
        return;
      }
      this.helperService.markFormGroupTouched(this.formData);
      if (this.formData.invalid) {
        return;
      }
      if (this.fileDinhKem && this.fileDinhKem.length > 0) {
        this.formData.value.fileDinhKems = this.fileDinhKem;
      }
      this.dataTableDetail.forEach(item => {
        item.loaiHhBq = item.loaiHhBq ? item.loaiHhBq.toString() : null;
        item.apDungTai = item.apDungTai ? item.apDungTai.toString() : null;
        item.dmBaoQuan = item.dmBaoQuan ? item.dmBaoQuan.toString() : null;
      });
      this.formData.value.listQlDinhMucPhiCcdc = this.dataTableDetail;
      await super.saveAndSend(this.formData.value, trangThai, msg, msgSuccess);
    } catch (error) {
      console.error("Lỗi khi lưu và gửi dữ liệu:", error);
    }
  }

  save() {
    if (this.dataTableDetail.length <= 0) {
      this.notification.error(MESSAGE.ERROR, 'Bạn chưa nhập chi tiết định mức phí công cụ dụng cụ.');
      return;
    }
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      return;
    }
    if (this.fileDinhKem && this.fileDinhKem.length > 0) {
      this.formData.value.fileDinhKems = this.fileDinhKem;
    }
    this.dataTableDetail.forEach(item => {
      item.loaiHhBq = item.loaiHhBq ? item.loaiHhBq.toString() : null;
      item.apDungTai = item.apDungTai ? item.apDungTai.toString() : null;
      item.dmBaoQuan = item.dmBaoQuan ? item.dmBaoQuan.toString() : null;
    });
    this.formData.value.listQlDinhMucPhiCcdc = this.dataTableDetail;
    this.createUpdate(this.formData.value);
    this.goBack();
  }

  async themMoi() {
    this.initFormDataDetail();
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
  }


  handleOk(): void {
    this.helperService.markFormGroupTouched(this.formDataDetail);
    if (this.formDataDetail.invalid) {
      return;
    }
    this.formDataDetail.value.idVirtual = this.formDataDetail.value.idVirtual ? this.formDataDetail.value.idVirtual : uuid.v4();
    let index = this.dataTableDetail.findIndex(s => s.idVirtual === this.formDataDetail.value.idVirtual);
    let table = this.dataTableDetail;
    if (this.formDataDetail.value.apDungTai && this.formDataDetail.value.apDungTai.length > 0) {
      this.formDataDetail.value.apDungTaiStr = this.getStrTenDonVi(this.formDataDetail.value.apDungTai.join(','));
    } else {
      this.formDataDetail.value.apDungTaiStr = 'Tất cả';
    }
    if (index != -1) {
      table.splice(index, 1, this.formDataDetail.value);
    } else {
      this.dataTableDetail = [...this.dataTableDetail, this.formDataDetail.value];
    }
    this.isVisible = false;
    this.initFormDataDetail();
  };

  changeCcdc(): void {
    let item;
    item = this.listCcdc.filter(item => item.maCcdc == this.formDataDetail.value.maCcdc)[0];
    if (item) {
      this.formDataDetail.patchValue({
        nhomCcdc: item.nhomCcdc,
        tenCcdc: item.tenCcdc,
        tenNhomCcdc: item.tenNhomCcdc,
        donViTinh: item.donViTinh,
        ycKyThuat: item.yeuCauKt,
      });
    }
  }

  async loadDsVatTu() {
    this.listHangHoaVT = [];
    let res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
    if (res.msg == MESSAGE.SUCCESS) {
      this.listHangHoaVT = res.data?.filter((x) => x.ma.length == 4 && !x.ma.startsWith('01') && !x.ma.startsWith('04'));
      this.listHangHoaAll.concat(this.listHangHoaVT);
    }
  }

  async changeCanCu() {
    if (this.formDataDetail.value.ccRaDm && this.formDataDetail.value.ccRaDm == 'DK') {
      if (this.formDataDetail.value.nhomCcdc && this.formDataDetail.value.nhomCcdc == '3') {
        this.listHangHoa = [...this.listHangHoaVT];
      } else {
        this.listHangHoa = [...this.listHangHoaLT];
      }
    } else {
      this.listHangHoa = [...this.listHangHoaLT];
    }
  }

  async detail(id) {
    this.spinner.show();
    try {
      let res = await this.qlDinhMucPhiService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, data);
          this.fileDinhKem = data.fileDinhKem;
          this.dataTableDetail = data.listQlDinhMucTbCcdcDtl;
          this.dataTableDetail.forEach(s => s.idVirtual = uuid.v4());
          this.dataTableDetail.forEach(item => {
            item.apDungTaiStr = this.getStrTenDonVi(item.apDungTai);
          });
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
        this.spinner.hide();
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e);
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
  }

  async editRow(data: any) {
    this.initFormDataDetail();
    let dataDetailItem;
    if (data.id) {
      dataDetailItem = this.dataTableDetail.find(s => s.id == data.id);
    } else if (data.idVirtual) {
      dataDetailItem = this.dataTableDetail.find(s => s.idVirtual == data.idVirtual);
    }
    if (dataDetailItem.loaiHhBq && dataDetailItem.loaiHhBq.includes(',')) {
      dataDetailItem.loaiHhBq = dataDetailItem.loaiHhBq.split(',');
    }
    if (dataDetailItem.apDungTai && dataDetailItem.apDungTai.includes(',')) {
      dataDetailItem.apDungTai = dataDetailItem.apDungTai.split(',');
    }
    if (dataDetailItem.dmBaoQuan && dataDetailItem.dmBaoQuan.includes(',')) {
      dataDetailItem.dmBaoQuan = dataDetailItem.dmBaoQuan.split(',');
    }
    if (dataDetailItem) {
      this.formDataDetail.patchValue(dataDetailItem);
      let loaiHhBq = typeof dataDetailItem.loaiHhBq == 'string' ? dataDetailItem.loaiHhBq.split(',') : dataDetailItem.loaiHhBq;
      let dmBaoQuan = typeof dataDetailItem.dmBaoQuan == 'string' ? dataDetailItem.dmBaoQuan.split(',') : dataDetailItem.dmBaoQuan;
      this.formDataDetail.patchValue({
        dmVpChiCuc: dataDetailItem.dmVpChiCuc,
        dmVpCuc: dataDetailItem.dmVpCuc,
        loaiHhBq: loaiHhBq,
        dmBaoQuan: dmBaoQuan,
      });
    } else {
      this.notification.error(MESSAGE.ERROR, 'Không tìm thấy dữ liệu');
    }
    await this.changeCanCu();
    this.isVisible = true;
  }

  getStrTenDonVi(strMaDonVi) {
    let str = '';
    if (strMaDonVi) {
      let arrMaDvi = strMaDonVi.split(',');
      arrMaDvi.forEach((item) => {
        this.listDonVi.forEach(donvi => {
          if (item == donvi.maDvi) {
            str = str + donvi.tenDvi + ',';
          }
        });
      });
    }
    return str.slice(0, -1);
  }

  deleteItem(index: any) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        try {
          this.dataTableDetail.splice(index, 1);
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  async viewRow(data: any) {
    this.initFormDataDetail();
    let dataDetailItem;
    if (data.id) {
      dataDetailItem = this.dataTableDetail.find(s => s.id == data.id);
    } else if (data.idVirtual) {
      dataDetailItem = this.dataTableDetail.find(s => s.idVirtual == data.idVirtual);
    }
    if (dataDetailItem.loaiHhBq && dataDetailItem.loaiHhBq.includes(',')) {
      dataDetailItem.loaiHhBq = dataDetailItem.loaiHhBq.split(',');
    }
    if (dataDetailItem.apDungTai && dataDetailItem.apDungTai.includes(',')) {
      dataDetailItem.apDungTai = dataDetailItem.apDungTai.split(',');
    }
    if (dataDetailItem.dmBaoQuan && dataDetailItem.dmBaoQuan.includes(',')) {
      dataDetailItem.dmBaoQuan = dataDetailItem.dmBaoQuan.split(',');
    }
    if (dataDetailItem) {
      this.formDataDetail.patchValue(dataDetailItem);
      let loaiHhBq = typeof dataDetailItem.loaiHhBq == 'string' ? dataDetailItem.loaiHhBq.split(',') : dataDetailItem.loaiHhBq;
      let dmBaoQuan = typeof dataDetailItem.dmBaoQuan == 'string' ? dataDetailItem.dmBaoQuan.split(',') : dataDetailItem.dmBaoQuan;
      this.formDataDetail.patchValue({
        dmVpChiCuc: dataDetailItem.dmVpChiCuc,
        dmVpCuc: dataDetailItem.dmVpCuc,
        loaiHhBq: loaiHhBq,
        dmBaoQuan: dmBaoQuan,
      });
    } else {
      this.notification.error(MESSAGE.ERROR, 'Không tìm thấy dữ liệu');
    }
    await this.changeCanCu();
    this.isVisible = true;
  }

  getTenLoaiHang(loaiHhBq: any) {
    let ten = [];
    if (loaiHhBq) {
      if (typeof loaiHhBq === "string") {
        loaiHhBq.split(',').forEach(item => {
          let t = this.listHangHoaAll.find(item1 => item1.ma == item);
          if (t) {
            ten.push(t.ten);
          }
        });
        return ten.join(',');
      }
    }
    if (loaiHhBq && loaiHhBq.length > 0) {
      for (let l of loaiHhBq) {
        let t = this.listHangHoaAll.find(item => item.ma == l);
        if (t) {
          ten.push(t.ten);
        }
      }
    }
    return ten.join(',');
  }

  exportDataDetail() {
    this.spinner.show();
    try {
      let body = this.formData.value;
      this.qlDinhMucPhiService
        .exportDetailCCDC(body)
        .subscribe((blob) =>
          saveAs(blob, 'danh-sach-chi-tiet-dinh-muc-phi-ccdc.xlsx'),
        );
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

}
