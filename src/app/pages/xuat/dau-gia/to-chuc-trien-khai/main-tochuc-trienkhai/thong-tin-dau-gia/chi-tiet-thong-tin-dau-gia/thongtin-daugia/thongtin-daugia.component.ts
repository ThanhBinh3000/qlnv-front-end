import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Validators } from '@angular/forms';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { ThongTinDauGiaService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/tochuc-trienkhai/thongTinDauGia.service';
import { StorageService } from 'src/app/services/storage.service';
import { chain, cloneDeep } from 'lodash'
import { QuyetDinhPdKhBdgService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/quyetDinhPdKhBdg.service';
import { MESSAGE } from 'src/app/constants/message';

@Component({
  selector: 'app-thongtin-daugia',
  templateUrl: './thongtin-daugia.component.html',
})
export class ThongtinDaugiaComponent extends Base2Component implements OnInit, OnChanges {

  @Input() data
  @Input() isView: boolean
  idDtl: number;
  dataDetail: any;
  soQdPd: string;
  isModal = false;
  rowItemKhach: any = {};
  rowItemDgv: any = {};
  rowItemToChuc: any = {};

  dataNguoiTgia: any[] = [];
  dataNguoiShow: any[] = [];

  dataTableGroup: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private thongTinDauGiaService: ThongTinDauGiaService,
    private quyetDinhPdKhBdgService: QuyetDinhPdKhBdgService,

  ) {
    super(httpClient, storageService, notification, spinner, modal, thongTinDauGiaService);
    this.formData = this.fb.group({
      id: [],
      soQdPd: [, [Validators.required]],
      idQdPdDtl: [, [Validators.required]],
      nam: [dayjs().get("year"), [Validators.required]],
      maThongBao: [, [Validators.required]],
      trichYeuTbao: ['', [Validators.required]],
      tenToChuc: [, [Validators.required]],
      sdtToChuc: [, [Validators.required]],
      diaChiToChuc: [, [Validators.required]],
      taiKhoanToChuc: [, [Validators.required]],
      soHd: [],
      ngayKyHd: [],
      hthucTchuc: [, [Validators.required]],
      tgianDky: [, [Validators.required]],
      tgianDkyTu: [,],
      tgianDkyDen: [,],
      ghiChuTgianDky: [, [Validators.required]],
      diaDiemDky: [, [Validators.required]],
      dieuKienDky: [, [Validators.required]],
      tienMuaHoSo: [, [Validators.required]],
      buocGia: [, [Validators.required]],
      tgianXem: [, [Validators.required]],
      tgianXemTu: [,],
      tgianXemDen: [,],
      ghiChuTgianXem: [, [Validators.required]],
      diaDiemXem: [, [Validators.required]],
      tgianNopTien: [, [Validators.required]],
      tgianNopTienTu: [,],
      tgianNopTienDen: [,],
      ghiChuTgianNopTien: [, [Validators.required]],
      pthucTtoan: [, [Validators.required]],
      donViThuHuong: [, [Validators.required]],
      stkThuHuong: [, [Validators.required]],
      nganHangThuHuong: [, [Validators.required]],
      chiNhanhNganHang: [, [Validators.required]],
      tgianDauGia: [, [Validators.required]],
      tgianDauGiaTu: [,],
      tgianDauGiaDen: [,],
      diaDiemDauGia: [, [Validators.required]],
      hthucDgia: [, [Validators.required]],
      pthucDgia: [, [Validators.required]],
      dkienCthuc: [, [Validators.required]],
      ghiChu: [,],
      ketQua: ['1', [Validators.required]],
      soBienBan: [, [Validators.required]],
      trichYeuBban: [, [Validators.required]],
      ngayKyBban: [, [Validators.required]],
      trangThai: ['00']
    })
  }


  async ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if (this.data) {
        this.spinner.show();
        this.getDetail(this.data.id);
        this.spinner.hide();
      }
    }
  }

  async ngOnInit() {
    if (this.dataDetail) {
      this.getDetail(this.dataDetail.id)
    } else {
      if (!this.isView) {
        this.spinner.show();
        let idThongBao = await this.helperService.getId("XH_TC_TTIN_BDG_HDR_SEQ");
        let res = await this.quyetDinhPdKhBdgService.getDtlDetail(this.idDtl);
        if (res.data) {
          const data = res.data
          console.log("🚀 ~ ngOnInit ~ data", data)
          if (data.listTtinDg && data.listTtinDg.length > 0) {
            // Nếu có thông tin đấu thầu thì sẽ lấy data laster => Set dataTable = children data lastest ý
            let tTinDthauLastest = data.listTtinDg.pop();
            let tTinDthau = await this.thongTinDauGiaService.getDetail(tTinDthauLastest.id);
            this.dataTable = tTinDthau.data?.children;
          } else {
            this.dataTable = data.children;
          }
          this.convertDataTable();
          // ( filter table sẽ không hiển thị mã đơn vị tàn sản của lần đấu giá trước;
          this.dataTable.forEach(item => {
            item.dataDviTsan.forEach((dvi, index) => {
              if (dvi.soLanTraGia) {
                item.dataDviTsan = item.dataDviTsan.filter(x => x.maDviTsan != dvi.maDviTsan);
                item.children = item.children.filter(x => x.maDviTsan != dvi.maDviTsan);
              }
            });
            if (item.dataDviTsan.length == 0) {
              this.dataTable = this.dataTable.filter(x => x.id != item.id);
            }
          });
          console.log("🚀 ~ ngOnInit ~ this.dataTable", this.dataTable)
        }
        this.formData.patchValue({
          maThongBao: idThongBao + "/" + this.formData.value.nam + "/TB-ĐG",
          idQdPdDtl: this.idDtl,
          soQdPd: this.soQdPd,
          soBienBan: idThongBao + "/" + this.formData.value.nam + "/BB-ĐG"
        });
        this.spinner.hide();
      }
    }
  }

  async getDetail(id) {
    let res = await this.thongTinDauGiaService.getDetail(id)
    if (res.data) {
      const data = res.data;
      this.helperService.bidingDataInFormGroup(this.formData, data);
      this.formData.patchValue({
        tgianDky: [data.tgianDkyTu, data.tgianDkyDen],
        tgianXem: [data.tgianXemTu, data.tgianXemDen],
        tgianNopTien: [data.tgianNopTienTu, data.tgianNopTienDen],
        tgianDauGia: [data.tgianDauGiaTu, data.tgianDauGiaDen],
        ketQua: data.ketQua.toString()
      })
      this.dataTable = data.children;
      this.dataNguoiTgia = data.listNguoiTgia
      this.dataNguoiShow = chain(this.dataNguoiTgia).groupBy('loai').map((value, key) => ({ loai: key, dataChild: value })).value();
      this.convertDataTable();
    }
  }

  calendarSoLuong(dviTsan) {
    let soLuong = 0;
    dviTsan.children.forEach(item => soLuong += item.soLuong);
    return soLuong
  }

  async handleCancel() {
    this.modal.closeAll();
  }

  convertDataTable() {
    this.dataTable.forEach((item) => {
      let dataGroup = chain(item.children).groupBy('maDviTsan').map((value, key) => ({ maDviTsan: key, children: value })).value();
      item.dataDviTsan = dataGroup;
      item.dataDviTsan.forEach(x => {
        x.soLanTraGia = x.children[0].soLanTraGia
        x.donGiaTraGia = x.children[0].donGiaTraGia
        x.toChucCaNhan = x.children[0].toChucCaNhan
      })
    })
    console.log("🚀 ~ this.dataTable.forEach ~ this.dataTable", this.dataTable)
  }

  isDisabled() {
    return !this.isModal
  }

  async handleOk(isHoanThanh?) {
    let body = this.formData.value;
    if (this.formData.value.ketQua == 1) {
      if (this.dataNguoiShow.length != 3) {
        this.notification.error(MESSAGE.ERROR, "Vui lòng thêm các thành phần tham dự đấu giá");
        return;
      }
    }
    if (this.formData.value.tgianDky) {
      body.tgianDkyTu = body.tgianDky[0];
      body.tgianDkyDen = body.tgianDky[1];
    }
    if (this.formData.value.tgianXem) {
      body.tgianXemTu = this.formData.value.tgianXem[0];
      body.tgianXemDen = this.formData.value.tgianXem[1];
    }
    if (this.formData.value.tgianNopTien) {
      body.tgianNopTienTu = this.formData.value.tgianNopTien[0];
      body.tgianNopTienDen = this.formData.value.tgianNopTien[1];
    }
    if (this.formData.value.tgianDauGia) {
      body.tgianDauGiaTu = body.tgianDauGia[0];
      body.tgianDauGiaDen = body.tgianDauGia[1];
    }
    body.listNguoiTgia = this.dataNguoiTgia;
    body.trangThai = isHoanThanh ? this.STATUS.DA_HOAN_THANH : this.STATUS.DU_THAO
    let soLuongDviTsan = 0
    let soLuongTrung = 0
    this.dataTable.forEach(item => {
      item.children.forEach(children => {
        let dataDviTsan = item.dataDviTsan.filter(x => x.maDviTsan == children.maDviTsan)[0];
        children.soLanTraGia = dataDviTsan?.soLanTraGia
        children.donGiaTraGia = dataDviTsan?.donGiaTraGia
        children.toChucCaNhan = dataDviTsan?.toChucCaNhan
      });
      soLuongTrung += item.dataDviTsan.filter(item => item.soLanTraGia > 0).length;
      soLuongDviTsan += item.dataDviTsan.length;
    });
    body.children = this.dataTable;
    body.ketQuaSl = soLuongTrung + "/" + soLuongDviTsan;
    let data = await this.createUpdate(body);
    if (data) {
      this.modal.closeAll();
    }
  }

  addRow(item, name) {
    let data = cloneDeep(item)
    data.loai = name;
    data.idVirtual = new Date().getTime();

    this.dataNguoiTgia.push(data)
    this.dataNguoiShow = chain(this.dataNguoiTgia).groupBy('loai').map((value, key) => ({ loai: key, dataChild: value })).value();
  }

  findTableName(name) {
    let data = this.dataNguoiShow ? this.dataNguoiShow.find(({ loai }) => loai == name) : [];
    return data
  }

  clearRow() {

  }

  confirmDone() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn hoàn thành thông tin đấu giá?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.spinner.show();
        try {
          this.handleOk(true);
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  deleteRow(idVirtual) {
    this.dataNguoiTgia = this.dataNguoiTgia.filter(item => item.idVirtual != idVirtual);
    this.dataNguoiShow = chain(this.dataNguoiTgia).groupBy('loai').map((value, key) => ({ loai: key, dataChild: value })).value();
  }

  editRow(idVirtual) {

  }

  cancelEdit(idVirtual) {

  }

}
