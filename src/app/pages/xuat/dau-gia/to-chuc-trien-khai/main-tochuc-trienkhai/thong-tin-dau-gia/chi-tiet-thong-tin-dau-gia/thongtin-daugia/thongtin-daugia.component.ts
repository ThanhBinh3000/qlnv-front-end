import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Validators } from '@angular/forms';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Base2Component } from 'src/app/components/base2/base2.component';
import {
  ThongTinDauGiaService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/tochuc-trienkhai/thongTinDauGia.service';
import { StorageService } from 'src/app/services/storage.service';
import { chain, cloneDeep } from 'lodash'
import {
  QuyetDinhPdKhBdgService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/quyetDinhPdKhBdg.service';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { STATUS } from 'src/app/constants/status';

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

  listHinhThucLucChonToChucBDG: any[] = [];
  listHinhThucBDG: any[] = [];
  listPhuongThucBDG: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private thongTinDauGiaService: ThongTinDauGiaService,
    private quyetDinhPdKhBdgService: QuyetDinhPdKhBdgService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, thongTinDauGiaService);
    this.formData = this.fb.group({
      id: [],
      soQdPd: [''],
      idQdPdDtl: [],
      nam: [dayjs().get("year")],
      maThongBao: [''],
      trichYeuTbao: [''],
      tenToChuc: [''],
      sdtToChuc: [''],
      diaChiToChuc: [''],
      taiKhoanToChuc: [''],
      soHd: [''],
      ngayKyHd: [''],
      hthucTchuc: [''],
      tgianDky: [''],
      tgianDkyTu: [''],
      tgianDkyDen: [''],
      ghiChuTgianDky: [''],
      diaDiemDky: [''],
      dieuKienDky: [''],
      tienMuaHoSo: [''],
      buocGia: [''],
      ghiChuBuocGia: [''],
      tgianXem: [''],
      tgianXemTu: [''],
      tgianXemDen: [''],
      ghiChuTgianXem: [''],
      diaDiemXem: [''],
      tgianNopTien: [''],
      tgianNopTienTu: [''],
      tgianNopTienDen: [''],
      ghiChuTgianNopTien: [''],
      pthucTtoan: [''],
      donViThuHuong: [''],
      stkThuHuong: [''],
      nganHangThuHuong: [''],
      chiNhanhNganHang: [''],
      tgianDauGia: [''],
      tgianDauGiaTu: [''],
      tgianDauGiaDen: [''],
      diaDiemDauGia: [''],
      hthucDgia: [''],
      pthucDgia: [''],
      dkienCthuc: [''],
      ketQua: ['1'],
      soBienBan: [''],
      trichYeuBban: [''],
      ngayKyBban: [''],
      lanDauGia: [],
      ketQuaSl: [''],
      ghiChu: [''],
      loaiVthh: [''],
      cloaiVthh: [''],
      moTaHangHoa: [''],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự Thảo'],
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
        console.log("🚀 ~ file: thongtin-daugia.component.ts:121 ~ ngOnInit ~ res", res)
        if (res.data) {
          const data = res.data
          this.formData.patchValue({
            loaiVthh: data.loaiVthh,
            cloaiVthh: data.cloaiVthh,
            moTaHangHoa: data.moTaHangHoa
          })
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

    await Promise.all([
      this.loadDataComboBox(),
    ]);
  }

  async loadDataComboBox() {
    // Hình thức lựa chọn tổ chức bán đấu giá
    this.listHinhThucLucChonToChucBDG = [];
    let resLcBdg = await this.danhMucService.danhMucChungGetAll('HT_LCNT');
    if (resLcBdg.msg == MESSAGE.SUCCESS) {
      this.listHinhThucLucChonToChucBDG = resLcBdg.data;
    }

    // Hình thức đấu giá
    this.listHinhThucBDG = [];
    let resHtBdg = await this.danhMucService.danhMucChungGetAll('HINH_THUC_DG');
    if (resHtBdg.msg == MESSAGE.SUCCESS) {
      this.listHinhThucBDG = resHtBdg.data;
    }

    this.listPhuongThucBDG = [];
    let resPtBdg = await this.danhMucService.danhMucChungGetAll('PHUONG_THUC_DG');
    if (resPtBdg.msg == MESSAGE.SUCCESS) {
      this.listPhuongThucBDG = resPtBdg.data
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
      this.fileDinhKem = data.fileDinhKems;
      this.dataNguoiShow = chain(this.dataNguoiTgia).groupBy('loai').map((value, key) => ({
        loai: key,
        dataChild: value
      })).value();
      this.convertDataTable();
    }
  }

  calendarSoLuong(dviTsan) {
    let soLuong = 0;
    //ten cot khong trung khop nen fix nhu vay
    if (dviTsan.children[0].soLuong) {
      dviTsan.children.forEach(item => soLuong += item.soLuong);
    } else {
      dviTsan.children.forEach(item => soLuong += item.soLuongDeXuat);
    }

    return soLuong
  }

  async handleCancel() {
    this.modal.closeAll();
  }

  convertDataTable() {
    this.dataTable.forEach((item) => {
      let dataGroup = chain(item.children).groupBy('maDviTsan').map((value, key) => {
        let current = value.find(s => s.maDviTsan == key);
        return {
          maDviTsan: key,
          children: value,
          soLanTraGia: current.soLanTraGia,
          donGiaTraGia: current.donGiaTraGia,
          toChucCaNhan: current.toChucCaNhan,
          id: current.id
        }
      }).value();
      item.dataDviTsan = dataGroup;
    })
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
    body.fileDinhKems = this.fileDinhKem;
    body.listNguoiTgia = this.dataNguoiTgia;
    body.trangThai = isHoanThanh ? this.STATUS.DA_HOAN_THANH : this.STATUS.DU_THAO
    let soLuongDviTsan = 0
    let soLuongTrung = 0
    this.dataTable.forEach(item => {
      soLuongTrung += item.dataDviTsan.filter(item => item.soLanTraGia > 0).length;
      soLuongDviTsan += item.dataDviTsan.length;
    });
    body.children = this.dataTable;
    body.ketQuaSl = soLuongTrung + "/" + soLuongDviTsan;
    body.children.forEach(s => {
      s.children.forEach(s1 => {
        let dataDviTsanCurrent = s.dataDviTsan.find(s2 => s1.id === s2.id);
        s1.soLanTraGia = dataDviTsanCurrent.soLanTraGia;
        s1.donGiaTraGia = dataDviTsanCurrent.donGiaTraGia;
        s1.toChucCaNhan = dataDviTsanCurrent.toChucCaNhan;
      })
    });
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
    this.dataNguoiShow = chain(this.dataNguoiTgia).groupBy('loai').map((value, key) => ({
      loai: key,
      dataChild: value
    })).value();
    if (name == 'KM') {
      this.rowItemKhach = {};
    } else if (name == 'DGV') {
      this.rowItemDgv = {};
    } else {
      this.rowItemToChuc = {};
    }

  }

  findTableName(name) {
    let data = this.dataNguoiShow ? this.dataNguoiShow.find(({ loai }) => loai == name) : [];
    return data
  }

  clearRow(name) {
    if (name == 'KM') {
      this.rowItemKhach = {};
    } else if (name == 'DGV') {
      this.rowItemDgv = {};
    } else {
      this.rowItemToChuc = {};
    }
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
          this.dataNguoiTgia = this.dataNguoiTgia.filter(item => item.idVirtual != idVirtual);
          this.dataNguoiShow = chain(this.dataNguoiTgia).groupBy('loai').map((value, key) => ({
            loai: key,
            dataChild: value
          })).value();
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  editRow(data: any) {
    this.dataNguoiTgia.forEach(s => s.isEdit = false);
    let currentRow = this.dataNguoiTgia.find(s => s.idVirtual == data.idVirtual);
    currentRow.isEdit = true;
    this.dataNguoiShow = chain(this.dataNguoiTgia).groupBy('loai').map((value, key) => ({
      loai: key,
      dataChild: value
    })).value();
  }

  saveRow(data: any, index: number) {
    this.dataNguoiTgia.filter(s => s.loai == data.loai)[index].isEdit = false;
  }

  cancelEdit(data: any, index: number) {
    this.dataNguoiTgia.filter(s => s.loai == data.loai)[index].isEdit = false;
  }

  changeNTG(index, indexLv2) {
    let currentRow = this.dataTable[index].dataDviTsan[indexLv2];
    if (currentRow.toChucCaNhan && (currentRow.soLanTraGia == null || currentRow.soLanTraGia == 0)) {
      this.dataTable[index].dataDviTsan[indexLv2].soLanTraGia = 1
    }
  }
}
