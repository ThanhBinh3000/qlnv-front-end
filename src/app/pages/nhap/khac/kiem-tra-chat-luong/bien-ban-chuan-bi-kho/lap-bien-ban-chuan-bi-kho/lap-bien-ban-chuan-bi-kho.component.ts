import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {FileDinhKem} from "../../../../../../models/FileDinhKem";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {
  BbNghiemThuBaoQuanService
} from "../../../../../../services/qlnv-hang/nhap-hang/nhap-khac/bbNghiemThuBaoQuan.service";
import {
  QuyetDinhGiaoNhapHangKhacService
} from "../../../../../../services/qlnv-hang/nhap-hang/nhap-khac/quyetDinhGiaoNhapHangKhac.service";
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {DanhMucCongCuDungCuService} from "../../../../../../services/danh-muc-cong-cu-dung-cu.service";
import * as dayjs from "dayjs";
import {Validators} from "@angular/forms";
import {STATUS} from "../../../../../../constants/status";
import {MESSAGE} from "../../../../../../constants/message";
import {
  DialogTableSelectionComponent
} from "../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import {DialogTuChoiComponent} from "../../../../../../components/dialog/dialog-tu-choi/dialog-tu-choi.component";
import {convertMaCcdc,convertTienTobangChu} from "../../../../../../shared/commonFunction";
import {cloneDeep} from 'lodash';
@Component({
  selector: 'app-lap-bien-ban-chuan-bi-kho',
  templateUrl: './lap-bien-ban-chuan-bi-kho.component.html',
  styleUrls: ['./lap-bien-ban-chuan-bi-kho.component.scss']
})
export class LapBienBanChuanBiKhoComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  @Input() typeVthh: string;
  @Input() idQdGiaoNvNh: number;
  @Output() showListEvent = new EventEmitter<any>();
  listSoQuyetDinh: any[] = [];
  listDiaDiemNhap: any[] = [];
  listPhuongThucBaoQuan: any[] = [];
  listHinhThucBaoQuan: any[] = [];
  listSoPhieuNhapKho: any[] = [];
  listDviChuDongTh: any[] = [];
  listTongCucPdTh: any[] = [];
  danhSachFileDinhKem: FileDinhKem[] = [];
  create: any = {};
  createTc: any = {};
  listCcdc: any = [];
  createRowUpdate: any = {};
  createTcRowUpdate: any = {};
  tongKphi: any;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private bbNghiemThuBaoQuanService: BbNghiemThuBaoQuanService,
    private quyetDinhGiaoNhapHangKhacService: QuyetDinhGiaoNhapHangKhacService,
    private danhMucService: DanhMucService,
    private danhMucDinhMucCcdcService: DanhMucCongCuDungCuService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bbNghiemThuBaoQuanService);
    this.formData = this.fb.group(
      {
        id: [],
        namKhoach: [dayjs().get('year')],
        maDvi: ['', [Validators.required]],
        maQhns: ['',],
        tenDvi: ['', [Validators.required]],
        idQdGiaoNvNh: ['', [Validators.required]],
        soQdGiaoNvNh: [, [Validators.required]],
        tgianNkho: [''],
        soLuongQdGiaoNvNh: [''],
        soBbNtBq: ['', [Validators.required]],
        ngayTao: [dayjs().format('YYYY-MM-DD'), [Validators.required]],
        ngayNghiemThu: ['', [Validators.required]],

        tenNguoiTao: [''],
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
        tenNganKho: [''],
        maLoKho: [''],
        tenLoKho: [''],
        tenNganLoKho: [''],

        loaiHinhKho: [''],
        tichLuong: [''],

        idPhieuNhapKho: [],
        soPhieuNhapKho: [],
        soLuongPhieuNhapKho: [],
        hthucBquan: ['', [Validators.required]],
        pthucBquan: ['', [Validators.required]],
        dinhMucGiao: [''],
        dinhMucThucTe: [''],
        ketLuan: [''],

        lyDoTuChoi: [''],
        trangThai: [STATUS.DU_THAO],
        tenTrangThai: ['Dự thảo'],
      }
    );
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      await Promise.all([
        this.loadSoQuyetDinh(),
        this.loadListCcdc(),
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

  async loadChiTiet(id) {
    if (id > 0) {
      let res = await this.bbNghiemThuBaoQuanService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.listDviChuDongTh = res.data.dviChuDongThucHien;
          this.listTongCucPdTh = res.data.dmTongCucPdTruocThucHien;
          this.helperService.bidingDataInFormGroup(this.formData, res.data);
          await this.bindingDataQd(res.data?.idQdGiaoNvNh);
          this.danhSachFileDinhKem = res.data.fileDinhKems;
          await this.bindingDataDdNhap(res.data);
        }
      }
    }
  }

  async initForm() {
    let res = await this.userService.getId("HH_BB_NGHIEM_THU_NHAP_KHAC_SEQ");
    this.formData.patchValue({
      soBbNtBq: `${res}/${this.formData.get('namKhoach').value}/BBNTBQ-CCDTVP`,
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự thảo',
      nguoiTao: this.userInfo.sub,
      tenNguoiTao: this.userInfo.TEN_DAY_DU,
    });
    if (this.idQdGiaoNvNh) {
      await this.bindingDataQd(this.idQdGiaoNvNh, true);
    }
  }

  updateEditCache(): void {
    if (this.create && this.create.length > 0) {
      this.listDviChuDongTh = [];
      this.create.forEach((item) => {
        this.listDviChuDongTh.push(item)
      });
    }
  }

  back() {
    this.showListEvent.emit();
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
        dataColumn: ['soQd', 'ngayQdinh', 'tenLoaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (dataChose) => {
      if (dataChose) {
        await this.bindingDataQd(dataChose.id, true);
      }
    });
  };

  async loadSoQuyetDinh() {
    let body = {
      denNgayQd: null,
      maDvi: this.userInfo.MA_DVI,
      loaiVthh: this.typeVthh,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0,
      },
      trangThai: this.globals.prop.NHAP_BAN_HANH,
    }
    let res = await this.quyetDinhGiaoNhapHangKhacService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoQuyetDinh = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async bindingDataQd(id, isSetTc?) {
    await this.spinner.show();
    let dataRes = await this.quyetDinhGiaoNhapHangKhacService.getDetail(id)
    const data = dataRes.data;
    this.formData.patchValue({
      soQdGiaoNvNh: data.soQd,
      idQdGiaoNvNh: data.id,
      tgianNkho: data.tgianNkMnhat,
      soLuongQdGiaoNvNh: data.tongSlNhap,
      loaiVthh: data.loaiVthh,
      tenLoaiVthh: data.tenLoaiVthh,
      tenNganLoKho: '',
      maLoKho: '',
      tenLoKho: '',
      maNganKho: '',
      tenNganKho: '',
      maNhaKho: '',
      tenNhaKho: '',
      maDiemKho: '',
      tenDiemKho: '',
    });
    // let dataChiCuc = data.dtlList.filter(item => item.maChiCuc == this.userInfo.MA_DVI);
    let dataChiCuc = data.dtlList;
    if (dataChiCuc.length > 0) {
      this.listDiaDiemNhap = cloneDeep(dataChiCuc);
    }
    await this.spinner.hide();
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
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho', 'tongSlNhap']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      await this.bindingDataDdNhap(data);
      // await this.loadDataComboBox();
    });
  }

  async bindingDataDdNhap(data) {
    if (data) {
      // this.listSoPhieuNhapKho = data.listPhieuNhapKho.filter(item => item.trangThai == STATUS.DA_DUYET_LDCC);
      // this.listSoPhieuNhapKho.forEach(item => {
      //   let phieuKtraCL = data.listPhieuKtraCl.filter(x => x.soPhieu == item.soPhieuKtraCl)[0];
      //   item.soLuongThucNhap = phieuKtraCL ? phieuKtraCL.soLuongNhapKho : 0
      // })
      await this.getNganKho(data.maLoKho ? data.maLoKho : data.maNganKho);
      this.formData.patchValue({
        cloaiVthh: data.cloaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        maDiemKho: data.maDiemKho,
        tenDiemKho: data.tenDiemKho,
        maNhaKho: data.maNhaKho,
        tenNhaKho: data.tenNhaKho,
        maNganKho: data.maNganKho,
        tenNganKho: data.tenNganKho,
        maLoKho: data.maLoKho,
        tenLoKho: data.tenLoKho,
        tenNganLoKho: data.tenLoKho ? `${data.tenLoKho} - ${data.tenNganKho}` : data.tenNganKho,
      })
      await this.loadDataComboBox();
    }
  }

  changeCcdc(isEdit?): void {
    if (isEdit) {
      let item;
      item = this.listCcdc.filter(item => item.maCcdc == this.create.noiDung)[0];
      if (item) {
        this.createRowUpdate.dvt = item.donViTinh;
      }
    } else {
      let item;
      item = this.listCcdc.filter(item => item.maCcdc == this.create.noiDung)[0];
      if (item) {
        this.create.dvt = item.donViTinh;
      }
    }
  }

  changeCcdcTc(isEdit?): void {
    if (isEdit) {
      let item;
      item = this.listCcdc.filter(item => item.maCcdc == this.createTc.noiDung)[0];
      if (item) {
        this.createTcRowUpdate.dvt = item.donViTinh;
      }
    } else {
      let item;
      item = this.listCcdc.filter(item => item.maCcdc == this.createTc.noiDung)[0];
      if (item) {
        this.createTc.dvt = item.donViTinh;
      }
    }
  }

  cancelEdit(stt: number): void {
    const index = this.listDviChuDongTh.findIndex(item => item.stt === stt);
    this.listDviChuDongTh[index].edit = false;
  }

  async loadListCcdc() {
    this.listCcdc = [];
    let body = {
      trangThai: '01',
      paggingReq: {
        limit: 10000,
        page: 0,
      }
    };
    let res = await this.danhMucDinhMucCcdcService.search(body);
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

  async getNganKho(maDvi: any) {
    if (maDvi) {
      let res = await this.bbNghiemThuBaoQuanService.getDataKho(maDvi);
      this.formData.patchValue({
        tichLuong: (res.data.tichLuongTkLt - res.data.tichLuongKdLt) > 0 ? res.data.tichLuongTkLt - res.data.tichLuongKdLt : 0,
        loaiHinhKho: res.data.lhKho
      });
    }
  }

  async save(isGuiDuyet: boolean) {
    // if (this.validateSave()) {
    try {
      this.spinner.show();
      //     this.helperService.markFormGroupTouched(this.formData);
      //     if (this.formData.invalid) {
      //       await this.spinner.hide();
      //       return;
      //     }
      let body = this.formData.value;
      body.dviChuDongThucHien = this.listDviChuDongTh;
      body.dmTongCucPdTruocThucHien = this.listTongCucPdTh;
      // body.detailDm = this.detail;
      body.fileDinhKems = this.danhSachFileDinhKem;
      let res;
      if (this.formData.get('id').value > 0) {
        res = await this.bbNghiemThuBaoQuanService.update(body);
      } else {
        res = await this.bbNghiemThuBaoQuanService.create(body);
      }
      if (res.msg == MESSAGE.SUCCESS) {
        if (isGuiDuyet) {
          await this.spinner.hide();
          this.id = res.data.id;
          this.pheDuyet();
        } else {
          if (this.formData.get('id').value) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
          } else {
            this.formData.get("id").setValue(res.data.id);
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
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
    // }
  }

  pheDuyet() {
    let trangThai = ''
    switch (this.formData.value.trangThai) {
      case STATUS.TU_CHOI_LDCC:
      case STATUS.TU_CHOI_KT:
      case STATUS.TU_CHOI_TK:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_TK;
        break;
      }
      case STATUS.CHO_DUYET_TK: {
        trangThai = STATUS.CHO_DUYET_KT;
        break;
      }
      case STATUS.CHO_DUYET_KT: {
        trangThai = STATUS.CHO_DUYET_LDCC;
        break;
      }
      case STATUS.CHO_DUYET_LDCC: {
        trangThai = STATUS.DA_DUYET_LDCC;
        break;
      }
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn phê duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.id,
            lyDoTuChoi: null,
            trangThai: trangThai,
          };
          let res =
            await this.bbNghiemThuBaoQuanService.approve(
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
      },
    });
  }

  tuChoi() {
    let trangThai = ''
    switch (this.formData.value.trangThai) {
      case STATUS.CHO_DUYET_TK: {
        trangThai = STATUS.TU_CHOI_TK;
        break;
      }
      case STATUS.CHO_DUYET_KT: {
        trangThai = STATUS.TU_CHOI_KT;
        break;
      }
      case STATUS.CHO_DUYET_LDCC: {
        trangThai = STATUS.TU_CHOI_LDCC;
        break;
      }
    }
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
            lyDoTuChoi: text,
            trangThai: trangThai,
          };
          let res =
            await this.bbNghiemThuBaoQuanService.approve(
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

  caculatorSoLuong(item: any) {
    if (item) {
      item.thanhTienTn = (item?.soLuongTn ?? 0) * (item?.donGiaTn ?? 0);
      item.thanhTienQt = (item?.soLuongQt ?? 0) * (item?.donGiaQt ?? 0);
      item.tongGtri = parseInt(item?.thanhTienTn) + parseInt(item?.thanhTienQt);
    }
  }

  deleteRow(i: any, type?) {
    if (type == 'PDT') {
      this.listTongCucPdTh = this.listTongCucPdTh.filter((d, index) => index !== i);
    } else {
      this.listDviChuDongTh = this.listDviChuDongTh.filter((d, index) => index !== i);
    }
    // this.updateEditCache();
  }


  addRow(type?) {
    if (type == 'PDT') {
      this.listTongCucPdTh = [
        ...this.listTongCucPdTh,
        this.createTc
      ];
    } else {
      this.listDviChuDongTh = [
        ...this.listDviChuDongTh,
        this.create
      ];
    }
    this.clearItemRow(type);
  }

  clearItemRow(type?) {
    if (type == 'PDT') {
      this.createTc = {};
    } else {
      this.create = {};
    }
  }

  startEdit(index: number, type?): void {
    if (type == 'PDT') {
      this.listTongCucPdTh[index].edit = true;
      this.createTcRowUpdate = cloneDeep(this.listTongCucPdTh[index]);
    } else {
      this.listDviChuDongTh[index].edit = true;
      this.createRowUpdate = cloneDeep(this.listDviChuDongTh[index]);
    }
  }

  saveEdit(dataUpdate, index: any): void {
    this.listDviChuDongTh[index] = this.createRowUpdate;
    this.listDviChuDongTh[index].edit = false;
  }

  convertMaCcdc(maCcdc: string) {
    return convertMaCcdc(maCcdc);
  }

  sumslKho(column?: string, tenDvi?: string, type?: string): number {
    let result = 0;
    let arr = [];
    if (this.listDviChuDongTh) {
      this.listDviChuDongTh.forEach(item => {
        if (item) {
          arr.push(item)
        }
      })
    }
    if (arr) {
      if (type) {
        const sum = arr.reduce((prev, cur) => {
          prev += parseInt(cur[column]);
          return prev;
        }, 0);
        result = sum
      }
    }
    this.tongKphi = result;
    return result;
  }

  sumslKhoTc(column?: string, tenDvi?: string, type?: string): number {
    let result = 0;
    let arr = [];
    if (this.listTongCucPdTh) {
      this.listTongCucPdTh.forEach(item => {
        if (item) {
          arr.push(item)
        }
      })
    }
    if (arr) {
      if (type) {
        const sum = arr.reduce((prev, cur) => {
          prev += parseInt(cur[column]);
          return prev;
        }, 0);
        result = sum
      }
    }
    return result;
  }

  convertSoToChu(tien: number) {
    return convertTienTobangChu(tien);
  }

}
