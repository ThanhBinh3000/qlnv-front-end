import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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
  @Input() idInput: number = 0;

  isModal = false;
  idDtl: number;
  soQdPd: string;
  dataDetail: any;
  soLanDauGia: number;
  fileDinhKems: any[] = []
  rowItemKhach: any = {};
  rowItemDgv: any = {};
  rowItemToChuc: any = {};
  dataNguoiTgia: any[] = [];
  dataNguoiShow: any[] = [];
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
      khoanTienDatTruoc: [],
      thongBaoKhongThanh: [''],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự Thảo'],
      soDviTsan: [],
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
    try {
      this.spinner.show();
      if (this.dataDetail) {
        this.getDetail(this.dataDetail.id)
        this.formData.value.trangThai = this.dataDetail.trangThai
      } else {
        if (!this.isView) {
          this.spinner.show();
          let idThongBao = await this.helperService.getId("XH_TC_TTIN_BDG_HDR_SEQ");
          this.onChangeQdKhBdgDtl(this.idDtl)
          this.formData.patchValue({
            maThongBao: idThongBao + "/" + this.formData.value.nam + "/TB-ĐG",
            idQdPdDtl: this.idDtl,
            soQdPd: this.soQdPd,
            soBienBan: idThongBao + "/" + this.formData.value.nam + "/BB-ĐG",
            lanDauGia: this.soLanDauGia + 1
          });
          this.spinner.hide();
        }
      }
      if (this.idInput > 0 && this.idInput) {
        this.getDetail(this.idInput)
      }
      await  this.loadDataComboBox();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
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
    // Phương thức đấu giá
    this.listPhuongThucBDG = [];
    let resPtBdg = await this.danhMucService.danhMucChungGetAll('PHUONG_THUC_DG');
    if (resPtBdg.msg == MESSAGE.SUCCESS) {
      this.listPhuongThucBDG = resPtBdg.data
    }
  }

  async onChangeQdKhBdgDtl(id) {
    await this.spinner.show();
    if (id > 0) {
      await this.quyetDinhPdKhBdgService.getDtlDetail(id)
        .then(async(res) =>{
          if (res.msg == MESSAGE.SUCCESS) {
            const data = res.data
            this.formData.patchValue({
              loaiVthh: data.loaiVthh,
              cloaiVthh: data.cloaiVthh,
              moTaHangHoa: data.moTaHangHoa,
              khoanTienDatTruoc: data.khoanTienDatTruoc
            })
            if (data.listTtinDg && data.listTtinDg.length > 0) {
              // Nếu có thông tin đấu thầu thì sẽ lấy data laster => Set dataTable = children data lastest ý
              let tTinDthauLastest = data.listTtinDg.pop();
              let tTinDthau = await this.thongTinDauGiaService.getDetail(tTinDthauLastest.id);
              this.dataTable = tTinDthau.data?.children;
            } else {
              this.dataTable = data.children;
            }
            // ( filter table sẽ không hiển thị mã đơn vị tàn sản của lần đấu giá trước;
            this.dataTable.forEach((item) => {
              item.soLuongChiCuc = 0
              item.soTienDatTruocChiCuc = 0
              item.children.forEach((child) => {
                if (child.soLanTraGia) {
                  item.children = item.children.filter(x => x.maDviTsan != child.maDviTsan);
                }
              })
              if (item.children.length == 0) {
                this.dataTable = this.dataTable.filter(x => x.id != item.id);
              }
            });
            this.calculatorTable()
          }
        }).catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }
  }

  calculatorTable() {
    this.dataTable.forEach((item) => {
      item.children.forEach((child) => {
        item.soLuongChiCuc += child.soLuongDeXuat;
        item.soTienDatTruocChiCuc += child.soLuongDeXuat * child.donGiaDuocDuyet * this.formData.value.khoanTienDatTruoc / 100;
        child.soTienDatTruoc = child.soLuongDeXuat * child.donGiaDuocDuyet * this.formData.value.khoanTienDatTruoc / 100;
      })
    })
  }

  async getDetail(id) {
    if(id > 0){
      await this.thongTinDauGiaService.getDetail(id)
        .then((res) =>{
          if (res.msg == MESSAGE.SUCCESS) {
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
            this.fileDinhKem = data.fileDinhKem;
            this.fileDinhKems = data.fileDinhKems;
            this.dataNguoiShow = chain(this.dataNguoiTgia).groupBy('loai').map((value, key) => ({
              loai: key,
              dataChild: value
            })).value();
          }
        })
        .catch((e) => {
            console.log('error: ', e);
            this.spinner.hide();
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          });
    }
  }

  async handleCancel() {
    this.modal.closeAll();
  }

  isDisabled() {
    return !this.isModal
  }

  isDisable() {
    if (this.formData.value.trangThai == STATUS.DU_THAO) {
      return false
    } else {
      return true
    }
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
    body.fileDinhKems = this.fileDinhKems;
    body.fileDinhKem = this.fileDinhKem;
    body.listNguoiTgia = this.dataNguoiTgia;
    body.children = this.dataTable;
    body.trangThai = isHoanThanh ? this.STATUS.DA_HOAN_THANH : this.STATUS.DU_THAO
    let soLuongDviTsan = 0
    let soLuongTrung = 0
    let soLuongTruot = 0
    this.dataTable.forEach(item => {
      if (this.formData.value.ketQua == 1) {
        soLuongTrung += item.children.filter(item => item.soLanTraGia > 0 && item.toChucCaNhan != null).length;
      } else {
        item.children.forEach(s => {
          s.toChucCaNhan = null;
          s.soLanTraGia = null;
        })
        soLuongTruot += item.children.filter(item => item.soLanTraGia == null && item.toChucCaNhan == null).length;
      }
      soLuongDviTsan += item.children.length;
    });
    if (this.formData.value.ketQua == 1) {
      body.ketQuaSl = soLuongTrung + "/" + soLuongDviTsan;
      body.soDviTsan = soLuongTrung;
    } else {
      body.ketQuaSl = soLuongTruot + "/" + soLuongDviTsan;
      body.soDviTsan = soLuongTruot;
    }
    let res = await this.createUpdate(body);
    if (res) {
      if (isHoanThanh) {
        this.modal.closeAll();
      } else {
        this.getDetail(res.id);
      }
    }
  }

  addRow(item, name) {
    if (this.validateThanhPhanThamDu(item, name)) {
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
  }

  findTableName(name) {
    let data = this.dataNguoiShow ? this.dataNguoiShow.find(({ loai }) => loai == name) : [];
    return data
  }

  validateThanhPhanThamDu(data, name): boolean {
    if (name == 'KM') {
      if (data.hoVaTen && data.chucVu && data.diaChi) {
        return true
      } else {
        this.notification.error(MESSAGE.ERROR, "Vui lòng điền đủ thông tin khách mời chứng kiến")
        return false;
      }
    } else if (name == 'DGV') {
      if (data.hoVaTen && data.chucVu && data.diaChi) {
        return true
      } else {
        this.notification.error(MESSAGE.ERROR, "Vui lòng điền đủ thông tin đấu giá viên")
        return false;
      }
    } else {
      if (data.hoVaTen && data.soCccd && data.diaChi) {
        return true
      } else {
        this.notification.error(MESSAGE.ERROR, "Vui lòng điền đủ thông tin tổ chức cá nhân tham giá đấu giá")
        return false;
      }
    }
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
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        } finally {
          this.spinner.hide();
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
    if (this.validateDonGiaCaoNhat(index, indexLv2)) {
      let currentRow = this.dataTable[index].children[indexLv2];
      if (currentRow.toChucCaNhan && (currentRow.soLanTraGia == null || currentRow.soLanTraGia == 0)) {
        this.dataTable[index].children[indexLv2].soLanTraGia = 1
      }
    }
  }

  validateDonGiaCaoNhat(index, indexLv2): boolean {
    if (this.dataTable[index].children[indexLv2].donGiaTraGia > this.dataTable[index].children[indexLv2].donGiaDuocDuyet) {
      return true
    } else {
      this.notification.error(MESSAGE.ERROR, "Đơn giá cao nhất phải lớn hơn hoặc bằng đơn giá chưa VAT")
      this.dataTable[index].children[indexLv2].toChucCaNhan = null
      return false;
    }
  }
}
