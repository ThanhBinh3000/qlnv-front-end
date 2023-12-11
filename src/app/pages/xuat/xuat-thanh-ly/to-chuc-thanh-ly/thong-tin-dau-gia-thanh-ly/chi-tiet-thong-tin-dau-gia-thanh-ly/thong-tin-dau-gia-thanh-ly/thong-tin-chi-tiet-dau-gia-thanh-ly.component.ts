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
import {FileDinhKem} from "../../../../../../../models/DeXuatKeHoachuaChonNhaThau";
import {Base3Component} from "../../../../../../../components/base3/base3.component";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-thong-tin-chi-tiet-dau-gia-thanh-ly',
  templateUrl: './thong-tin-chi-tiet-dau-gia-thanh-ly.component.html',
})
export class ThongTinChiTietDauGiaThanhLyComponent extends Base3Component implements OnInit, OnChanges {
  @Input() data
  @Input() isView: boolean
  @Input() idInput: number = 0;

  isCreate = false;
  isModal = false;
  idQdTl: number
  soLanDauGia: number;
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

  fileDinhKemDaKy: any[] = [];


  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private _service: ToChucThucHienThanhLyService,
    private danhMucService: DanhMucService,
    private quyetDinhThanhLyService: QuyetDinhThanhLyService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, _service);
    this.formData = this.fb.group({
      id: [],
      nam: [dayjs().get("year")],
      maDvi: [''],
      lanDauGia: [],
      maThongBao: ['',[Validators.required]],
      idQdTl: ['',[Validators.required]],
      soQdTl: ['',[Validators.required]],
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
      khoanTienDatTruoc: [],
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
      soBienBan: ['',[Validators.required]],
      trichYeuBban: [''],
      ngayKyBban: [''],
      ketQuaSl: [''],
      soDviTsan: [],
      thongBaoKhongThanh: [''],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự thảo'],
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
      await this.loadDataComboBox();
      // Is create
      if(this.idQdTl){
        let idThongBao = await this.helperService.getId("XH_TL_TO_CHUC_HDR_SEQ");
        await this.onChangeQdKhBdgDtl(this.idQdTl)
        this.formData.patchValue({
          maThongBao: idThongBao + "/" + this.formData.value.nam + "/TB-ĐG",
          soBienBan : idThongBao + "/" + this.formData.value.nam + "/BB-DG",
          lanDauGia: this.soLanDauGia + 1
        });
      }
      if (this.idInput > 0 && this.idInput) {
        this.getDetail(this.idInput)
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
  }

  // buildTableView(data?: any) {
  //   this.dataTable = chain(data)
  //     .groupBy("tenChiCuc")
  //     .map((value, key) => {
  //       return {
  //         idVirtual: uuid.v4(),
  //         tenChiCuc: key,
  //         childData: value,
  //       };
  //     }).value();
  // }

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
    this.dataTable = [];
    if (id > 0) {
      await this.quyetDinhThanhLyService.getDetail(id)
        .then(async (res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const data = res.data
            this.formData.patchValue({
              idQdTl : data.id,
              soQdTl : data.soQd,
            })
            data.xhTlHoSoHdr.children.forEach( item => {
              let dsHdr = item.xhTlDanhSachHdr;
              dsHdr.idDsHdr = dsHdr.id;
              dsHdr.soLanTraGia = this.soLanDauGia + 1;
              // Nếu không có kết quả đấu giá rồi thì mới thêm
              if(dsHdr.ketQuaDauGia == null){
                this.dataTable.push(dsHdr);
              }
            })
            await this.buildTableView();
          }
        }).catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }
  }

  async buildTableView() {
    this.dataTable = chain(this.dataTable).groupBy('tenChiCuc').map((value, key) => ({
        tenDonVi: key,
        children: value,
        expandSet : true
      })
    ).value()
  }

  onChangeKetQua($event){
    console.log($event);
  }

  async getDetail(id) {
    if (id > 0) {
      this.dataTable = [];
      await this._service.getDetail(id)
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
            data.children.forEach( item => {
              let dsHdr = item.xhTlDanhSachHdr;
              dsHdr.idDsHdr = dsHdr.id;
              this.dataTable.push(item.xhTlDanhSachHdr);
            })
            this.buildTableView();
            this.dataNguoiTgia = data.childrenNlq;
            this.dataNguoiShow = chain(this.dataNguoiTgia).groupBy('loai').map((value, key) => ({
              loai: key,
              dataChild: value
            })).value();
            this.fileDinhKemDaKy = data.fileDinhKemDaKy;
            this.fileDinhKem = data.fileDinhKem;
            this.fileCanCu = data.fileCanCu;
          }
        })
      .catch((e) => {
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

  async save(isHoanThanh?) {
    if(this.validateMaDviTsan()){
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
      let soLuongDviTsan = 0
      let soLuongTrung = 0
      let soLuongTruot = 0
      let dataTableSaved = [];
      this.dataTable.forEach(item => {
        dataTableSaved = [...dataTableSaved,...item.children]
      });
      body.childrenNlq = this.dataNguoiTgia;
      body.trangThai = isHoanThanh ? this.STATUS.DA_HOAN_THANH : this.STATUS.DU_THAO
      body.children = dataTableSaved;
      body.fileDinhKemReq = this.fileDinhKem
      body.fileCanCuReq = this.fileCanCu
      body.fileDinhKemDaKyReq = this.fileDinhKemDaKy
      if (this.formData.value.ketQua == 1) {
        body.ketQuaSl = soLuongTrung + "/" + soLuongDviTsan;
      } else {
        body.ketQuaSl = soLuongTruot + "/" + soLuongDviTsan;
      }
      let res = await this.createUpdate(body);
      if (res) {
        this.modal.closeAll();
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
          this.save(true);
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

  changeThanhTien(index, indexLv2) {
    let currentRow = this.dataTable[index].childData[indexLv2];
    if (currentRow.donGiaCaoNhat != 0 && currentRow.donGiaCaoNhat != null) {
      currentRow.thanhTien = currentRow.slDauGia * currentRow.donGiaCaoNhat;
    }
  }

  validateMaDviTsan(): boolean {
    if (this.dataTable && this.dataTable.length > 0) {
      let data = this.dataTable.flatMap(s => s.children)
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
    }else{
      this.notification.error(MESSAGE.ERROR, "Không có danh sách thông tin đấu giá");
      return false;
    }
    return true;
  }
}
