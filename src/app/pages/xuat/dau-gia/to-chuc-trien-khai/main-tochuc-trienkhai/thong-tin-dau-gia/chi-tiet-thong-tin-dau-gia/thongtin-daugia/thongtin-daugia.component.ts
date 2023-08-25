import {HttpClient} from '@angular/common/http';
import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import dayjs from 'dayjs';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {
  ThongTinDauGiaService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/tochuc-trienkhai/thongTinDauGia.service';
import {StorageService} from 'src/app/services/storage.service';
import {chain, cloneDeep} from 'lodash'
import {
  QuyetDinhPdKhBdgService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/quyetDinhPdKhBdg.service';
import {MESSAGE} from 'src/app/constants/message';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {STATUS} from 'src/app/constants/status';
import {FileDinhKem} from "../../../../../../../../models/DeXuatKeHoachuaChonNhaThau";
import {Validators} from "@angular/forms";

@Component({
  selector: 'app-thongtin-daugia',
  templateUrl: './thongtin-daugia.component.html',
})
export class ThongtinDaugiaComponent extends Base2Component implements OnInit, OnChanges {
  @Input() isView: boolean
  @Input() isModal: boolean
  @Input() dataDetail
  @Input() dataThongTin
  @Input() idInput
  soLanDauGia: number;
  rowItemKhach: any = {};
  rowItemDgv: any = {};
  rowItemToChuc: any = {};
  dataNguoiTgia: any[] = [];
  dataNguoiShow: any[] = [];
  listHinhThucBDG: any[] = [];
  listPhuongThucBDG: any[] = [];
  listHinhThucLucChonToChucBDG: any[] = [];

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
      maDvi: [''],
      nam: [dayjs().get("year")],
      lanDauGia: [],
      maThongBao: [''],
      idQdPd: [],
      soQdPd: [''],
      idQdPdDtl: [],
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
      ketQua: ['1'], // 0 : Trượt 1 Trúng
      soBienBan: [''],
      trichYeuBban: [''],
      ngayKyBban: [''],
      ketQuaSl: [''],
      loaiVthh: [''],
      cloaiVthh: [''],
      moTaHangHoa: [''],
      khoanTienDatTruoc: [],
      thongBaoKhongThanh: [''],
      soDviTsan: [],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự Thảo'],
      canCu: [new Array<FileDinhKem>()],
      fileDinhKem: [new Array<FileDinhKem>()],
    })
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      if (this.dataThongTin) {
        await this.getDetail(this.dataThongTin.id)
      } else {
        if (!this.isView) {
          let idThongBao = await this.helperService.getId("XH_TC_TTIN_BDG_HDR_SEQ");
          this.formData.patchValue({
            maThongBao: idThongBao + "/" + this.formData.value.nam + "/TB-ĐG",
            idQdPdDtl: this.dataDetail.idQdPdDtl,
            soQdPd: this.dataDetail.soQdPd,
            soBienBan: idThongBao + "/" + this.formData.value.nam + "/BB-ĐG",
            lanDauGia: this.soLanDauGia + 1
          });
          await this.onChangeQdKhBdgDtl(this.formData.value.idQdPdDtl);
        }
      }
      if (this.idInput > 0 && this.idInput) {
        this.getDetail(this.idInput)
      }
      await this.loadDataComboBox();
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if (this.dataThongTin) {
        await this.getDetail(this.dataThongTin.id);
      }
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
        .then(async (res) => {
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
            await this.calculatorTable()
          }
        }).catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }
  }

  async calculatorTable() {
    this.dataTable.forEach((item) => {
      item.soLuongXuatBan = 0;
      item.tienDatTruoc = 0;
      item.children.forEach((child) => {
        child.soTienDatTruoc = child.soLuongDeXuat * child.donGiaDuocDuyet * this.formData.value.khoanTienDatTruoc / 100;
        item.soLuongXuatBan += child.soLuongDeXuat;
        item.tienDatTruoc += child.soTienDatTruoc;
      })
    })
  }

  async getDetail(id) {
    await this.spinner.show();
    if (id > 0) {
      await this.thongTinDauGiaService.getDetail(id)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const data = res.data;
            this.helperService.bidingDataInFormGroup(this.formData, data);
            this.formData.patchValue({
              tgianDky: (data.tgianDkyTu && data.tgianDkyDen) ? [data.tgianDkyTu, data.tgianDkyDen] : null,
              tgianXem: (data.tgianXemTu && data.tgianXemDen) ? [data.tgianXemTu, data.tgianXemDen] : null,
              tgianNopTien: (data.tgianNopTienTu && data.tgianNopTienDen) ? [data.tgianNopTienTu, data.tgianNopTienDen] : null,
              tgianDauGia: (data.tgianDauGiaTu && data.tgianDauGiaDen) ? [data.tgianDauGiaTu, data.tgianDauGiaDen] : null,
              ketQua: data.ketQua.toString()
            })
            this.dataTable = data.children;
            this.dataNguoiTgia = data.listNguoiTgia
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
    await this.spinner.hide();
  }

  async handleCancel() {
    this.modal.closeAll();
  }

  async handleOk() {
    await this.helperService.ignoreRequiredForm(this.formData);
    let body = this.formData.value;
    if (this.formData.get('tgianDky').value) {
      body.tgianDkyTu = dayjs(this.formData.get('tgianDky').value[0]).format('YYYY-MM-DD');
      body.tgianDkyDen = dayjs(this.formData.get('tgianDky').value[1]).format('YYYY-MM-DD')
    }
    if (this.formData.get('tgianXem').value) {
      body.tgianXemTu = dayjs(this.formData.get('tgianXem').value[0]).format('YYYY-MM-DD');
      body.tgianXemDen = dayjs(this.formData.get('tgianXem').value[1]).format('YYYY-MM-DD')
    }
    if (this.formData.get('tgianNopTien').value) {
      body.tgianNopTienTu = dayjs(this.formData.get('tgianNopTien').value[0]).format('YYYY-MM-DD');
      body.tgianNopTienDen = dayjs(this.formData.get('tgianNopTien').value[1]).format('YYYY-MM-DD')
    }
    if (this.formData.get('tgianDauGia').value) {
      body.tgianDauGiaTu = dayjs(this.formData.get('tgianDauGia').value[0]).format('YYYY-MM-DD');
      body.tgianDauGiaDen = dayjs(this.formData.get('tgianDauGia').value[1]).format('YYYY-MM-DD')
    }
    body.listNguoiTgia = this.dataNguoiTgia;
    body.children = this.dataTable;
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
    await this.createUpdate(body);
    await this.helperService.restoreRequiredForm(this.formData);
  }

  async saveAndSend() {
    this.setValidForm();
    if (this.formData.value.ketQua == 1) {
      if (this.dataNguoiShow.length != 3) {
        this.notification.error(MESSAGE.ERROR, "Vui lòng thêm các thành phần tham dự đấu giá");
        return;
      }
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: ' Bạn có chắc chắn hoàn thành thông tin đấu giá ? ',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        await this.spinner.show();
        try {
          this.helperService.markFormGroupTouched(this.formData);
          if (this.formData.invalid) {
            return;
          }
          let body = this.formData.value;
          if (this.formData.get('tgianDky').value) {
            body.tgianDkyTu = dayjs(this.formData.get('tgianDky').value[0]).format('YYYY-MM-DD');
            body.tgianDkyDen = dayjs(this.formData.get('tgianDky').value[1]).format('YYYY-MM-DD')
          }
          if (this.formData.get('tgianXem').value) {
            body.tgianXemTu = dayjs(this.formData.get('tgianXem').value[0]).format('YYYY-MM-DD');
            body.tgianXemDen = dayjs(this.formData.get('tgianXem').value[1]).format('YYYY-MM-DD')
          }
          if (this.formData.get('tgianNopTien').value) {
            body.tgianNopTienTu = dayjs(this.formData.get('tgianNopTien').value[0]).format('YYYY-MM-DD');
            body.tgianNopTienDen = dayjs(this.formData.get('tgianNopTien').value[1]).format('YYYY-MM-DD')
          }
          if (this.formData.get('tgianDauGia').value) {
            body.tgianDauGiaTu = dayjs(this.formData.get('tgianDauGia').value[0]).format('YYYY-MM-DD');
            body.tgianDauGiaDen = dayjs(this.formData.get('tgianDauGia').value[1]).format('YYYY-MM-DD')
          }
          body.listNguoiTgia = this.dataNguoiTgia;
          body.children = this.dataTable;
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
          let res: any = {};
          if (body.id && body.id > 0) {
            res = await this.thongTinDauGiaService.update(body);
          } else {
            res = await this.thongTinDauGiaService.create(body);
          }
          if (res.msg == MESSAGE.SUCCESS) {
            let res1 = await this.thongTinDauGiaService.approve({id: res.data.id, trangThai: STATUS.DA_HOAN_THANH});
            if (res1.msg == MESSAGE.SUCCESS) {
              this.notification.success(MESSAGE.NOTIFICATION, ' Bạn đã hoàn thành thông tin đấu giá thành công!' ? ' Bạn đã hoàn thành thông tin đấu giá thành công!' : MESSAGE.SUCCESS);
              this.modal.closeAll();
              return res1;
            } else {
              this.notification.error(MESSAGE.ERROR, res1.msg);
              return null;
            }
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
            return null;
          }
        } catch (e) {
          console.log('error: ', e);
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          return null;
        } finally {
          await this.spinner.hide();
        }
      },
    });
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

  setValidForm() {
    this.formData.controls["maThongBao"].setValidators([Validators.required]);
    this.formData.controls["soQdPd"].setValidators([Validators.required]);
    this.formData.controls["trichYeuTbao"].setValidators([Validators.required]);
    this.formData.controls["tenToChuc"].setValidators([Validators.required]);
    this.formData.controls["diaChiToChuc"].setValidators([Validators.required]);
    this.formData.controls["taiKhoanToChuc"].setValidators([Validators.required]);
    this.formData.controls["soHd"].setValidators([Validators.required]);
    this.formData.controls["hthucTchuc"].setValidators([Validators.required]);
    this.formData.controls["tgianDky"].setValidators([Validators.required]);
    this.formData.controls["diaDiemDky"].setValidators([Validators.required]);
    this.formData.controls["dieuKienDky"].setValidators([Validators.required]);
    this.formData.controls["tienMuaHoSo"].setValidators([Validators.required]);
    this.formData.controls["buocGia"].setValidators([Validators.required]);
    this.formData.controls["tgianXem"].setValidators([Validators.required]);
    this.formData.controls["diaDiemXem"].setValidators([Validators.required]);
    this.formData.controls["tgianNopTien"].setValidators([Validators.required]);
    this.formData.controls["pthucTtoan"].setValidators([Validators.required]);
    this.formData.controls["tgianDauGia"].setValidators([Validators.required]);
    this.formData.controls["diaDiemDauGia"].setValidators([Validators.required]);
    this.formData.controls["pthucTtoan"].setValidators([Validators.required]);
    this.formData.controls["pthucTtoan"].setValidators([Validators.required]);
    this.formData.controls["dkienCthuc"].setValidators([Validators.required]);
    this.formData.controls["soBienBan"].setValidators([Validators.required]);
    this.formData.controls["trichYeuBban"].setValidators([Validators.required]);
    this.formData.controls["ngayKyBban"].setValidators([Validators.required]);
    if (this.formData.get('ketQua').value != '1') {
      this.formData.controls["thongBaoKhongThanh"].setValidators([Validators.required]);
    }
  }
}
