import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { Subject } from 'rxjs';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DonviService } from 'src/app/services/donvi.service';
import { convertTienTobangChu, thongTinTrangThaiNhap } from 'src/app/shared/commonFunction';
import * as dayjs from 'dayjs';
import { STATUS } from "../../../../../../constants/status";
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { QuyetDinhGiaoNvNhapHangService } from 'src/app/services/qlnv-hang/nhap-hang/mua-truc-tiep/qdinh-giao-nvu-nh/quyetDinhGiaoNvNhapHang.service';
import { DanhMucTieuChuanService } from './../../../../../../services/quantri-danhmuc/danhMucTieuChuan.service';
import { Base2Component } from './../../../../../../components/base2/base2.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MttBienBanNghiemThuBaoQuan } from './../../../../../../services/qlnv-hang/nhap-hang/mua-truc-tiep/MttBienBanNghiemThuBaoQuan.service';
import { BienBanNghiemThuBaoQuanDtl } from './../../../../../../models/KiemTraChatLuong';
import { cloneDeep } from 'lodash';
import { FileDinhKem } from './../../../../../../models/DeXuatKeHoachuaChonNhaThau';
import { UploadFileService } from './../../../../../../services/uploaFile.service';

@Component({
  selector: 'app-them-moi-bien-ban-nghiem-thu-bao-quan',
  templateUrl: './them-moi-bien-ban-nghiem-thu-bao-quan.component.html',
  styleUrls: ['./them-moi-bien-ban-nghiem-thu-bao-quan.component.scss']
})
export class ThemMoiBienBanNghiemThuBaoQuanComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  @Input() typeVthh: string;
  @Input() idQdGiaoNvNh: number;
  @Output()
  showListEvent = new EventEmitter<any>();

  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = false;

  userInfo: UserLogin;
  detailGiaoNhap: any = {};
  detailHopDong: any = {};

  listLoaiKho: any[] = [];
  listPhuongThucBaoQuan: any[] = [];
  listHinhThucBaoQuan: any[] = [];
  listDonViTinh: any[] = [];
  listSoQuyetDinh: any[] = [];
  listHopDong: any[] = [];
  listDiaDiemNhap: any[] = [];
  listSoPhieuNhapKho: any[] = [];

  hasError: boolean = false;
  rowItem: BienBanNghiemThuBaoQuanDtl = new BienBanNghiemThuBaoQuanDtl;
  dataTable: any[] = [];
  dataEdit: { [key: string]: { edit: boolean; data: BienBanNghiemThuBaoQuanDtl } } = {};

  rowItem1: BienBanNghiemThuBaoQuanDtl = new BienBanNghiemThuBaoQuanDtl;
  dataTable1: any[] = [];
  dataEdit1: { [key: string]: { edit: boolean; data: BienBanNghiemThuBaoQuanDtl } } = {};
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donViService: DonviService,
    private danhMucService: DanhMucService,
    private bienBanNghiemThuBaoQuan: MttBienBanNghiemThuBaoQuan,
    private quyetDinhGiaoNvNhapHangService: QuyetDinhGiaoNvNhapHangService,
    private danhMucTieuChuanService: DanhMucTieuChuanService,
    private uploadFileService: UploadFileService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanNghiemThuBaoQuan);

    this.formData = this.fb.group(
      {
        id: [],
        namKh: [dayjs().get('year')],
        maDvi: ['', [Validators.required]],
        maQhns: ['',],
        tenDvi: ['', [Validators.required]],
        idQdGiaoNvNh: ['', [Validators.required]],
        soQdGiaoNvNh: [, [Validators.required]],
        tgianNkho: [''],
        slThucNhap: [''],
        soBb: ['', [Validators.required]],
        ngayTao: [dayjs().format('YYYY-MM-DD'),],
        ngayNghiemThu: [''],

        nguoiTao: [''],
        tenThuKho: [''],
        tenKeToan: [''],
        tenNguoiPduyet: [''],

        loaiVthh: ['',],
        tenLoaiVthh: ['',],
        cloaiVthh: [''],
        tenCloaiVthh: [''],
        moTaHangHoa: [''],

        idDdiemGiaoNvNh: [, [Validators.required]],
        maDiemKho: ['', [Validators.required]],
        tenDiemKho: ['', [Validators.required]],
        maNhaKho: ['', [Validators.required]],
        tenNhaKho: ['', [Validators.required]],
        maNganKho: ['', [Validators.required]],
        tenNganKho: ['', [Validators.required]],
        maLoKho: [''],
        tenLoKho: [''],

        loaiHinhKho: [''],
        tichLuong: [''],

        idPhieuNhapKho: [],
        soPhieuNhapKho: [],
        soLuongPhieuNhapKho: [],
        hthucBquan: [''],
        pthucBquan: [''],
        dinhMucGiao: [''],
        dinhMucThucTe: [''],
        ketLuan: [''],

        ldoTuChoi: [''],
        trangThai: [],
        tenTrangThai: [],
        dviChuDongThucHien: [],
        dmTongCucPdTruocThucHien: [],
        fileDinhKem: [FileDinhKem],
        kinhPhiThucTe: [''],
        kinhPhiTcPd: [''],
      }
    );

  }

  async ngOnInit() {
    this.spinner.show();
    super.ngOnInit();
    try {
      this.userInfo = this.userService.getUserLogin();
      await Promise.all([
        this.loadDataComboBox(),
        this.loadSoQuyetDinh(),
      ]);
      if (this.id) {
        await this.loadChiTiet(this.id);
      } else {
        await this.initForm();
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async initForm() {
    let res = await this.userService.getId("HH_BIEN_BAN_NGHIEM_THU_SEQ");
    this.formData.patchValue({
      soBb: `${res}/${this.formData.get('namKh').value}/BBNTBQ-CCDTKVVP`,
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự thảo',
      nguoiTao: this.userInfo.sub
    });
    if (this.idQdGiaoNvNh) {
      await this.bindingDataQd(this.idQdGiaoNvNh, true);
    }
  }

  async loadDataComboBox() {
    if (this.formData.value.cloaiVthh) {
      let res = await this.danhMucService.getDetail(this.formData.value.cloaiVthh);
      if (res.msg == MESSAGE.SUCCESS) {
        this.listPhuongThucBaoQuan = res.data?.phuongPhapBq
        this.listHinhThucBaoQuan = res.data?.hinhThucBq
      }
    }
  }

  async openDialogSoQd() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách số quyết định kế hoạch giao nhiệm vụ nhập hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listSoQuyetDinh,
        dataHeader: ['Số quyết định', 'Ngày quyết định', 'Loại hàng hóa'],
        dataColumn: ['soQd', 'ngayQd', 'tenLoaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.bindingDataQd(data.id, true);
      }
    });
  };

  async bindingDataQd(id, isSetTc?) {
    await this.spinner.show();
    let dataRes = await this.quyetDinhGiaoNvNhapHangService.getDetail(id)
    const data = dataRes.data;
    this.formData.patchValue({
      soQdGiaoNvNh: data.soQd,
      idQdGiaoNvNh: data.id,
      tgianNkho: data.tgianNkho,
      slThucNhap: data.soLuong * 1000,
      loaiVthh: data.loaiVthh,
      cloaiVthh: data.cloaiVthh,
      tenLoaiVthh: data.tenLoaiVthh,
      tenCloaiVthh: data.tenCloaiVthh,
      moTaHangHoa: data.moTaHangHoa,
    });
    let dataChiCuc = data.hhQdGiaoNvNhangDtlList.filter(item => item.maDvi == this.userInfo.MA_DVI);
    if (dataChiCuc.length > 0) {
      this.listDiaDiemNhap = dataChiCuc[0].hhQdGiaoNvNhDdiemList;
    }
    this.loadDataComboBox();
    await this.spinner.hide();
  }

  openDialogDdiemNhapHang() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách địa điểm nhập hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDiaDiemNhap,
        dataHeader: ['Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho', 'SL theo QĐ giao NV NH'],
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho', 'soLuong']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      this.bindingDataDdNhap(data);
    });
  }

  async bindingDataDdNhap(data) {
    if (data) {
      if (data.listPhieuNhapKho) {
        this.listSoPhieuNhapKho = data.listPhieuNhapKho.filter(item => item.trangThai == STATUS.DA_DUYET_LDCC);
        this.listSoPhieuNhapKho.forEach(item => {
          let phieuKtraCL = data.listPhieuKtraCl.filter(x => x.soPhieu == item.soPhieuKtraCl)[0];
          item.soLuongThucNhap = phieuKtraCL.soLuongNhapKho
        })
      }

      this.formData.patchValue({
        idDdiemGiaoNvNh: data.id,
        maDiemKho: data.maDiemKho,
        tenDiemKho: data.tenDiemKho,
        maNhaKho: data.maNhaKho,
        tenNhaKho: data.tenNhaKho,
        maNganKho: data.maNganKho,
        tenNganKho: data.tenNganKho,
        maLoKho: data.maLoKho,
        tenLoKho: data.tenLoKho,
      })
    }
  }

  openSoPhieuNhapKho() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách số phiếu nhập kho ',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listSoPhieuNhapKho,
        dataHeader: ['Số Phiếu nhập kho', 'Số phiếu kiểm tra CL', 'Số lượng thực nhập'],
        dataColumn: ['soPhieuNhapKho', 'soPhieuKtraCl', 'soLuongThucNhap']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      this.bindingDataSoPhieuNk(data);
    });
  }

  async bindingDataSoPhieuNk(data) {
    this.formData.patchValue({
      soPhieuNhapKho: data.soPhieuNhapKho,
      soLuongPhieuNhapKho: data.soLuongThucNhap
    })
  }


  async loadSoQuyetDinh() {
    let body = {
      "denNgayQd": null,
      "loaiQd": "",
      "maDvi": this.userInfo.MA_DVI,
      "maVthh": this.typeVthh,
      "namNhap": null,
      "ngayQd": "",
      "orderBy": "",
      "orderDirection": "",
      "paggingReq": {
        "limit": 1000,
        "orderBy": "",
        "orderType": "",
        "page": 0
      },
      "soHd": "",
      "soQd": null,
      "str": "",
      "trangThai": this.globals.prop.NHAP_BAN_HANH,
      "tuNgayQd": null,
      "veViec": null
    }
    let res = await this.quyetDinhGiaoNvNhapHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoQuyetDinh = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadChiTiet(id) {
    if (id > 0) {
      let res = await this.bienBanNghiemThuBaoQuan.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        const data = res.data;
        this.helperService.bidingDataInFormGroup(this.formData, data);
        await this.bindingDataQd(res.data?.idQdGiaoNvNh);
        let dataDdNhap = this.listDiaDiemNhap.filter(item => item.id == res.data.idDdiemGiaoNvNh)[0];
        this.bindingDataDdNhap(dataDdNhap);
        this.formData.patchValue({
          tenDvi: this.userInfo.TEN_DVI,
        })
        this.dataTable = data.dviChuDongThucHien;
        this.updateEditCache()
        this.dataTable1 = data.dmTongCucPdTruocThucHien;
        this.updateEditCache1()
      }
    }
  }

  convertTien(tien: number): string {
    return convertTienTobangChu(tien);
  }

  deleteRow(index: number) {
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
          this.dataTable.splice(index, 1);
          this.updateEditCache();
          this.dataTable;
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  editRow(index: number) {
    this.dataEdit[index].edit = true;
  }


  addRow() {
    if (!this.dataTable) {
      this.dataTable = [];
    }
    if (this.rowItem.noiDung != null) {
      this.sortTableId();
      let item = cloneDeep(this.rowItem);
      item.stt = this.dataTable.length + 1;
      item.edit = false;
      this.dataTable = [
        ...this.dataTable,
        item,
      ]

      this.rowItem = new BienBanNghiemThuBaoQuanDtl();
      this.updateEditCache();
      this.emitDataTable();
    } else {
      this.notification.error(MESSAGE.ERROR, "Vui lòng điền đầy đủ thông tin")
    }
  }

  sortTableId() {
    this.dataTable.forEach((lt, i) => {
      lt.stt = i + 1;
    });
  }
  emitDataTable() {

  }

  clearItemRow() {
    this.rowItem = new BienBanNghiemThuBaoQuanDtl();
  }


  cancelEdit(id: number): void {
    const index = this.dataTable.findIndex((item) => item.idVirtual == id);
    this.dataEdit[id] = {
      data: { ...this.dataTable[index] },
      edit: false,
    };
  }

  saveEdit(index: number): void {
    this.hasError = (false);
    Object.assign(this.dataTable[index], this.dataEdit[index].data);
    this.dataEdit[index].edit = false;
  }

  updateEditCache(): void {
    if (this.dataTable) {
      this.dataTable.forEach((item, index) => {
        this.dataEdit[index] = {
          edit: false,
          data: { ...item },
        };
      });
    }
  }

  caculatorSoLuong(item: any) {
    if (item) {
      item.thanhTienTn = (item?.soLuongTn ?? 0) * (item?.donGiaTn ?? 0);
      item.tongGtri = +(item?.thanhTienTn ?? 0) + +(item?.thanhTienQt ?? 0);
    }
  }
  calcTong() {
    if (this.dataTable) {
      const sum = this.dataTable.reduce((prev, cur) => {
        prev += cur.tongGtri;
        return prev;
      }, 0);
      this.formData.patchValue({
        kinhPhiThucTe: sum,
      })
      return sum;

    }
  }


  addRow1() {
    if (!this.dataTable1) {
      this.dataTable1 = [];
    }
    if (this.rowItem1.noiDung != null) {
      this.sortTableId1();
      let item = cloneDeep(this.rowItem1);
      item.stt = this.dataTable1.length + 1;
      item.edit = false;
      this.dataTable1 = [
        ...this.dataTable1,
        item,
      ]

      this.rowItem1 = new BienBanNghiemThuBaoQuanDtl();
      this.updateEditCache1();
      this.emitDataTable();
    } else {
      this.notification.error(MESSAGE.ERROR, "Vui lòng điền đầy đủ thông tin")
    }
  }
  updateEditCache1(): void {
    if (this.dataTable1) {
      this.dataTable1.forEach((item, index) => {
        this.dataEdit1[index] = {
          edit: false,
          data: { ...item },
        };
      });
    }
  }
  sortTableId1() {
    this.dataTable1.forEach((lt, i) => {
      lt.stt = i + 1;
    });
  }
  clearItemRow1() {
    this.rowItem = new BienBanNghiemThuBaoQuanDtl();
  }
  cancelEdit1(id: number): void {
    const index = this.dataTable1.findIndex((item) => item.idVirtual == id);
    this.dataEdit1[id] = {
      data: { ...this.dataTable1[index] },
      edit: false,
    };
  }

  editRow1(index: number) {
    this.dataEdit1[index].edit = true;
  }

  saveEdit1(index: number): void {
    this.hasError = (false);
    Object.assign(this.dataTable1[index], this.dataEdit1[index].data);
    this.dataEdit1[index].edit = false;
  }

  deleteRow1(index: number) {
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
          this.dataTable1.splice(index, 1);
          this.updateEditCache1();
          this.dataTable1;
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  calcTong1() {
    if (this.dataTable1) {
      const sum = this.dataTable1.reduce((prev, cur) => {
        prev += cur.tongGtri;
        return prev;
      }, 0);
      this.formData.patchValue({
        kinhPhiTcPd: sum,
      })
      return sum;

    }
  }

  async loadHinhThucBaoQuan() {
    let body = {
      "maHthuc": null,
      "paggingReq": {
        "limit": 1000,
        "page": 1
      },
      "str": null,
      "tenHthuc": null,
      "trangThai": null
    }
    let res = await this.danhMucService.loadDanhMucHinhThucBaoQuan(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content) {
        this.listHinhThucBaoQuan = res.data.content;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadLoaiKho() {
    let body = {
      "maLhKho": null,
      "paggingReq": {
        "limit": 1000,
        "page": 1
      },
      "str": null,
      "tenLhKho": null,
      "trangThai": null
    };
    let res = await this.danhMucService.danhMucLoaiKhoGetList(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content) {
        this.listLoaiKho = res.data.content;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadDonViTinh() {
    try {
      const res = await this.donViService.loadDonViTinh();
      this.listDonViTinh = [];
      if (res.msg == MESSAGE.SUCCESS) {
        for (let i = 0; i < res.data.length; i++) {
          const item = {
            ...res.data[i],
            labelDonViTinh: res.data[i].tenDviTinh,
          };
          this.listDonViTinh.push(item);
        }
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


  async save(isGuiDuyet: boolean) {
    if (this.validateSave()) {
      try {
        this.spinner.show();
        this.helperService.markFormGroupTouched(this.formData);
        if (this.formData.invalid) {
          await this.spinner.hide();
          return;
        }
        let body = this.formData.value;
        body.dviChuDongThucHien = this.dataTable;
        body.dmTongCucPdTruocThucHien = this.dataTable1;

        let res;
        if (this.formData.get('id').value > 0) {
          res = await this.bienBanNghiemThuBaoQuan.update(body);
        } else {
          res = await this.bienBanNghiemThuBaoQuan.create(body);
        }
        if (res.msg == MESSAGE.SUCCESS) {
          if (isGuiDuyet) {
            await this.spinner.hide();
            this.id = res.data.id;
            this.pheDuyet();
          } else {
            if (this.formData.get('id').value) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
              this.back();
            } else {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
              this.back();
            }
            await this.spinner.hide();
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
          await this.spinner.hide();
        }
      } catch (e) {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      } finally {
        this.spinner.hide();
      }
    }

  }

  pheDuyet() {
    let trangThai = ''
    let mess = ''
    switch (this.formData.get('trangThai').value) {
      case STATUS.TU_CHOI_TK:
      case STATUS.TU_CHOI_KT:
      case STATUS.TU_CHOI_KT:
      case STATUS.TU_CHOI_LDCC:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_TK;
        mess = 'Bạn có muối gửi duyệt ?'
        break;
      }
      case STATUS.CHO_DUYET_TK: {
        trangThai = STATUS.CHO_DUYET_KT;
        mess = 'Bạn có chắc chắn muốn phê duyệt ?'
        break;
      }
      case STATUS.CHO_DUYET_KT: {
        trangThai = STATUS.CHO_DUYET_LDCC;
        mess = 'Bạn có chắc chắn muốn phê duyệt ?'
        break;
      }
      case STATUS.CHO_DUYET_LDCC: {
        trangThai = STATUS.DA_DUYET_LDCC;
        mess = 'Bạn có chắc chắn muốn phê duyệt ?'
        break;
      }
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: mess,
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.id,
            trangThai: trangThai
          };
          let res =
            await this.bienBanNghiemThuBaoQuan.approve(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.THAO_TAC_SUCCESS);
            this.back();
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
            id: this.id,
            lyDo: text,
            trangThai: '',
          };
          switch (this.formData.get('trangThai').value) {
            case STATUS.CHO_DUYET_TK: {
              body.trangThai = STATUS.TU_CHOI_TK;
              break;
            }
            case STATUS.CHO_DUYET_KT: {
              body.trangThai = STATUS.TU_CHOI_KT;
              break;
            }
            case STATUS.CHO_DUYET_LDCC: {
              body.trangThai = STATUS.TU_CHOI_LDCC;
              break;
            }
          }
          let res =
            await this.bienBanNghiemThuBaoQuan.approve(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.back();
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

  back() {
    this.showListEvent.emit();
  }

  getNameFile($event: any) {
    if ($event.target.files) {
      const itemFile = {
        name: $event.target.files[0].name,
        file: $event.target.files[0] as File,
      };
      this.uploadFileService
        .uploadFile(itemFile.file, itemFile.name)
        .then((resUpload) => {
          let fileDinhKemQd = new FileDinhKem();
          fileDinhKemQd.fileName = resUpload.filename;
          fileDinhKemQd.fileSize = resUpload.size;
          fileDinhKemQd.fileUrl = resUpload.url;
          fileDinhKemQd.idVirtual = new Date().getTime();
          this.formData.patchValue({ fileDinhKem: fileDinhKemQd, fileName: itemFile.name })
        });
    }
  }

  validateSave() {
    return true;
  }

  thongTinTrangThai(trangThai: string): string {
    return thongTinTrangThaiNhap(trangThai);
  }

  print() {

  }
}

