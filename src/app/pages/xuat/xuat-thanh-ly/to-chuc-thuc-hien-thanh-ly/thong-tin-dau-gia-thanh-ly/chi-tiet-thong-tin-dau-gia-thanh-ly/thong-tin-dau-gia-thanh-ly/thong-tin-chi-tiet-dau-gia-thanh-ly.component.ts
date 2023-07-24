import {HttpClient} from '@angular/common/http';
import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import dayjs from 'dayjs';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {StorageService} from 'src/app/services/storage.service';
import {chain, cloneDeep} from 'lodash'
import {MESSAGE} from 'src/app/constants/message';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {STATUS} from 'src/app/constants/status';
import * as uuid from "uuid";
import {
  QuyetDinhThanhLyService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/QuyetDinhThanhLyService.service";
import {
  ToChucThucHienThanhLyService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/ToChucThucHienThanhLy.service";
import {Validators} from "@angular/forms";

@Component({
  selector: 'app-thong-tin-chi-tiet-dau-gia-thanh-ly',
  templateUrl: './thong-tin-chi-tiet-dau-gia-thanh-ly.component.html',
})
export class ThongTinChiTietDauGiaThanhLyComponent extends Base2Component implements OnInit, OnChanges {
  @Input() data
  @Input() isView: boolean
  @Input() idInput: number = 0;

  isModal = false;
  idQdTl: number
  idQdTlDtl: number;
  soQdTl: string;
  dataDetail: any;
  soLanDauGia: number;
  fileCanCu: any[] = []
  fileDinhKemDaKy: any[] = []
  rowItemKhach: any = {};
  rowItemDgv: any = {};
  rowItemToChuc: any = {};
  dataNguoiTgia: any[] = [];
  dataNguoiShow: any[] = [];
  listHinhThucLucChonToChucBDG: any[] = [];
  listHinhThucBDG: any[] = [];
  listPhuongThucBDG: any[] = [];
  listPhuongThucGiaoNhanBDG: any[] = [];
  listPhuongThucThanhToan: any[] = [];
  expandSetString = new Set<string>();
  dataDauGia: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private toChucThucHienThanhLyService: ToChucThucHienThanhLyService,
    private quyetDinhThanhLyService: QuyetDinhThanhLyService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, toChucThucHienThanhLyService);
    this.formData = this.fb.group({
      id: [],
      nam: [dayjs().get("year")],
      maDvi: [''],
      lanDauGia: [],
      maThongBao: [''],
      idQdTl: [],
      idQdTlDtl: [],
      soQdTl: [''],
      trichYeuTbao: [''],
      tenToChuc: [''],
      sdtToChuc: [''],
      diaChiToChuc: [''],
      taiKhoanToChuc: [''],
      nganHangToChuc: [''],
      chiNhanhNhangToChuc: [''],
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
      khoanTienDatTruoc: [, [Validators.required]],
      tgianXem: [''],
      tgianXemTu: [''],
      tgianXemDen: [''],
      ghiChuTgianXem: [''],
      diaDiemXem: [''],
      tgianNopTien: [''],
      tgianNopTienTu: [''],
      tgianNopTienDen: [''],
      pthucTtoan: [''],
      ghiChuTgianNopTien: [''],
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
      ghiChu: [''],
      thoiHanThanhToan: [''],
      pthucThanhtoanKhac: [''],
      thoiHanGiaoNhan: [''],
      pthucGnhan: [''],
      ketQua: ['1'],
      soBienBan: [''],
      trichYeuBban: [''],
      ngayKyBban: [''],
      ketQuaSl: [''],
      soDviTsan: [],
      thongBaoKhongThanh: [''],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['DU Thảo'],
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
      } else {
        if (!this.isView) {
          this.spinner.show();
          let idThongBao = await this.helperService.getId("XH_TL_TO_CHUC_HDR_SEQ");
          this.onChangeQdKhBdgDtl(this.idQdTl)
          this.formData.patchValue({
            maThongBao: idThongBao + "/" + this.formData.value.nam + "/TB-ĐG",
            idQdTl: this.idQdTl,
            idQdTlDtl: this.idQdTlDtl,
            soQdTl: this.soQdTl,
            soBienBan: idThongBao + "/" + this.formData.value.nam + "/BB-ĐG",
            lanDauGia: this.soLanDauGia + 1
          });
          this.spinner.hide();
        }
      }
      if (this.idInput > 0 && this.idInput) {
        this.getDetail(this.idInput)
      }
      await this.loadDataComboBox();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
  }

  expandAll() {
    this.dataTable.forEach(s => {
      this.expandSetString.add(s.idVirtual);
    });
  }

  onExpandStringChange(id: string, checked: boolean) {
    if (checked) {
      this.expandSetString.add(id);
    } else {
      this.expandSetString.delete(id);
    }
  }

  buildTableView(data?: any) {
    this.dataTable = chain(data)
      .groupBy("tenChiCuc")
      .map((value, key) => {
        return {
          idVirtual: uuid.v4(),
          tenChiCuc: key,
          childData: value,
        };
      }).value();
    this.expandAll()
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
    //   Phưng thức thanh toán khác
    this.listPhuongThucThanhToan = [
      {
        ma: '1',
        giaTri: 'Tiền mặt',
      },
      {
        ma: '2',
        giaTri: 'Chuyển khoản',
      },
    ];
    //   Phương thức giao nhận
    this.listPhuongThucGiaoNhanBDG = [];
    let resPtGnBdg = await this.danhMucService.danhMucChungGetAll('PT_GIAO_HANG');
    if (resPtGnBdg.msg == MESSAGE.SUCCESS) {
      this.listPhuongThucGiaoNhanBDG = resPtGnBdg.data
    }
  }

  async onChangeQdKhBdgDtl(id) {
    await this.spinner.show();
    if (id > 0) {
      await this.quyetDinhThanhLyService.getDetail(id)
        .then(async (res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const data = res.data
            // Nếu có thông tin đấu thầu thì sẽ lấy data laster => Set dataTable = children data lastest ý
            if (this.idQdTlDtl) {
              let dataDtl = data.quyetDinhDtl.filter(s => s.id == this.idQdTlDtl);
              for (const item of dataDtl) {
                if (item.xhTlToChucHdr && item.xhTlToChucHdr.length > 0) {
                  let dataToChuc = item.xhTlToChucHdr.pop();
                  let tTinDthau = await this.toChucThucHienThanhLyService.getDetail(dataToChuc.id);
                  tTinDthau.data?.toChucDtl.forEach(s => {
                    s.idVirtual = uuid.v4();
                  });
                  this.buildTableView(tTinDthau.data.toChucDtl);
                  this.dataDauGia = tTinDthau.data.toChucDtl;
                } else {
                  data.quyetDinhDtl.forEach(s => {
                    s.idVirtual = uuid.v4();
                  });
                  let dt = data.quyetDinhDtl.filter(s => s.maDiaDiem.substring(0, 6) === this.userInfo.MA_DVI)
                  this.buildTableView(dt);
                  this.calculatorTable();
                }
              }
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
            // ( filter table sẽ không hiển thị mã đơn vị tàn sản của lần đấu giá trước;
            this.dataTable.forEach((item) => {
              item.childData.forEach((child) => {
                if (child.soLanTraGia) {
                  item.childData = item.childData.filter(x => x.soLanTraGia == null && x.maDviTsan == null && x.toChucCaNhan == null);
                }
              })
              if (item.childData.length == 0) {
                this.dataTable = this.dataTable.filter(x => x.id != item.id);
              }
            });
          }
        }).catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }
  }

  calculatorTable() {
    this.dataTable.forEach(item => {
      item.childData.forEach(child => {
        if (this.dataDetail) {
          child.giaKhoiDiem = child.slDauGia * child.giaTlKhongVat
        } else {
          if(this.dataDauGia.length > 0){
            this.formData.value.ketQua == '1' ? child.soTienDatTruoc = null : child.soTienDatTruoc = child.slDauGia * child.giaTlKhongVat * this.formData.value.khoanTienDatTruoc / 100;
          }else {
            child.slDauGia = child.slDeXuat
            child.giaTlKhongVat = child.donGia
            this.formData.value.ketQua == '1' ? child.giaKhoiDiem = child.slDeXuat * child.donGia : child.giaKhoiDiem = null;
            this.formData.value.ketQua == '1' ? child.thanhTien = child.donGiaCaoNhat * child.slDeXuat : child.thanhTien = null;
            this.formData.value.ketQua == '1' ? child.soTienDatTruoc = null : child.soTienDatTruoc = child.slDeXuat * child.donGia * this.formData.value.khoanTienDatTruoc / 100;
          }
        }
      })
    })
  }

  async getDetail(id) {
    if (id > 0) {
      await this.toChucThucHienThanhLyService.getDetail(id)
        .then((res) => {
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
            this.buildTableView(data.toChucDtl);
            this.dataNguoiTgia = data.toChucNlq
            this.fileCanCu = data.fileCanCu;
            this.fileDinhKem = data.fileDinhKem;
            this.fileDinhKemDaKy = data.fileDinhKemDaKy;
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
    body.fileCanCu = this.fileCanCu;
    body.fileDinhKem = this.fileDinhKem;
    body.fileDinhKemDaKy = this.fileDinhKemDaKy;
    let soLuongDviTsan = 0
    let soLuongTrung = 0
    let soLuongTruot = 0
    this.dataTable.forEach(item => {
      if (this.formData.value.ketQua == 1) {
        soLuongTrung += item.childData.filter(item => item.soLanTraGia > 0 && item.toChucCaNhan != null).length;
      } else {
        item.childData.forEach(s => {
          s.toChucCaNhan = null;
          s.soLanTraGia = null;
        })
        soLuongTruot += item.childData.filter(item => item.soLanTraGia == null && item.toChucCaNhan == null).length;
      }
      soLuongDviTsan += item.childData.length;
    });
    let dt = this.dataTable.flatMap((item) => item.childData);
    body.toChucDtl = dt;
    body.toChucNlq = this.dataNguoiTgia;
    body.trangThai = isHoanThanh ? this.STATUS.DA_HOAN_THANH : this.STATUS.DU_THAO
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
    let data = this.dataNguoiShow ? this.dataNguoiShow.find(({loai}) => loai == name) : [];
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
        this.notification.error(MESSAGE.ERROR, "Vui lòng điền đủ thông tin tổ chức cá nhân tham gia đấu giá")
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
    if (this.validatemaDviTsan()) {
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
    if (!this.formData.get('khoanTienDatTruoc').value) {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng chọn khoản tiền đặt trước');
      this.dataTable[index].childData[indexLv2].toChucCaNhan = null
      return;
    }
    if (this.dataTable[index].childData[indexLv2].giaTlKhongVat > this.dataTable[index].childData[indexLv2].donGiaCaoNhat) {
      this.notification.error(MESSAGE.ERROR, "Đơn giá cao nhất phải lớn hơn hoặc bằng đơn giá chưa VAT")
      this.dataTable[index].childData[indexLv2].toChucCaNhan = null
      return;
    }
    let currentRow = this.dataTable[index].childData[indexLv2];
    if (currentRow.toChucCaNhan) {
      currentRow.soTienDatTruoc = currentRow.slDauGia * currentRow.giaTlKhongVat * this.formData.value.khoanTienDatTruoc / 100
    }
    if (currentRow.toChucCaNhan && (currentRow.soLanTraGia == null || currentRow.soLanTraGia == 0)) {
      currentRow.soLanTraGia = 1
    }
  }

  validatemaDviTsan(): boolean {
    if (this.dataTable && this.dataTable.length > 0) {
      let data = this.dataTable.flatMap(s => s.childData)
      const checkMaDviTsan = {};
      data.forEach((item) => {
        const maDviTsan = item.maDviTsan;
        if (checkMaDviTsan[maDviTsan]) {
          checkMaDviTsan[maDviTsan]++;
        } else {
          checkMaDviTsan[maDviTsan] = 1;
        }
      });
      let result = '';
      for (let prop in checkMaDviTsan) {
        if (checkMaDviTsan[prop] > 1) {
          result += `${prop} ( hiện đang bị lặp lại ${checkMaDviTsan[prop]} lần), `;
        }
      }
      let rs = Object.values(checkMaDviTsan).some(value => +value > 1);
      if (rs == true) {
        this.notification.error(MESSAGE.ERROR, "Mã đơn vị tài sản " + result.slice(0, -2) + " vui lòng nhập lại");
        return false;
      }
    }
    return true;
  }
}
