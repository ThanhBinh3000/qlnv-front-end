import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { DialogThemBienbanNghiemThuKeLotComponent } from 'src/app/components/dialog/dialog-them-bien-ban-nghiem-thu-ke-lot/dialog-them-bien-ban-nghiem-thu-ke-lot.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { QuanLyPhieuKiemTraChatLuongHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kiemtra-cl/quanLyPhieuKiemTraChatLuongHang.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/qd-giaonv-nh/quyetDinhGiaoNhapHang.service';
import { STATUS } from "../../../../../../constants/status";
import { DanhMucTieuChuanService } from 'src/app/services/quantri-danhmuc/danhMucTieuChuan.service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import {formatNumber} from "@angular/common";
import {KhCnQuyChuanKyThuat} from "../../../../../../services/kh-cn-bao-quan/KhCnQuyChuanKyThuat";
import {CurrencyMaskInputMode} from "ngx-currency";


@Component({
  selector: 'them-moi-phieu-kiem-tra-chat-luong-hang',
  templateUrl: './them-moi-phieu-kiem-tra-chat-luong-hang.component.html',
  styleUrls: ['./them-moi-phieu-kiem-tra-chat-luong-hang.component.scss'],
})
export class ThemMoiPhieuKiemTraChatLuongHangComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  @Input() isTatCa: boolean;
  @Input() loaiVthh: string;
  @Input() idQdGiaoNvNh: number;
  @Input() maNganLoKho: string;
  @Output()
  showListEvent = new EventEmitter<any>();

  detail: any = {};
  detailGiaoNhap: any = {};
  detailHopDong: any = {};

  create: any = {};
  editDataCache: { [key: string]: { edit: boolean; data: any } } = {};

  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganKho: any[] = [];
  listNganLo: any[] = [];
  listTieuChuan: any[] = [];
  listSoQuyetDinh: any[] = [];
  listHopDong: any[] = [];
  dataTableChiTieu: any[] = [];
  listDiaDiemNhap: any[] = [];
  listFileDinhKem: any[] = [];
  listFileDinhKemKTCL: any[] = [];
  previewName: string = 'phieu_ktra_cl_dau_thau_lt';
  listHinhThucBaoQuan: any[] = [];
  listDanhGia: any[] = [];
  formattedSlNhapKho: any;
  amount = {
    allowZero: true,
    allowNegative: false,
    precision: 2,
    prefix: '',
    thousands: '.',
    decimal: ',',
    align: "right",
    nullable: true,
    min: 0,
    max: 1000000000000,
    inputMode: CurrencyMaskInputMode.NATURAL,
  }
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private phieuKtraCluongService: QuanLyPhieuKiemTraChatLuongHangService,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService,
    private danhMucService: DanhMucService,
    private danhMucTieuChuanService: DanhMucTieuChuanService,
    private khCnQuyChuanKyThuat: KhCnQuyChuanKyThuat,
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuKtraCluongService);
    this.formData = this.fb.group(
      {
        id: [],
        nam: [dayjs().get('year')],
        maDvi: [''],
        maQhns: ['',],
        tenDvi: [''],
        idQdGiaoNvNh: [''],
        soQdGiaoNvNh: [],
        ngayQdGiaoNvNh: [],
        soPhieu: [''],
        ngayTao: [dayjs().format('YYYY-MM-DD')],

        loaiVthh: ['',],
        tenLoaiVthh: ['',],
        cloaiVthh: [''],
        tenCloaiVthh: [''],
        moTaHangHoa: [''],
        soHd: [''],
        ngayHd: [null,],

        idDdiemGiaoNvNh: [],
        maDiemKho: [''],
        tenDiemKho: [''],
        maNhaKho: [''],
        tenNhaKho: [''],
        maNganKho: [''],
        tenNganKho: [''],
        maLoKho: [''],
        tenLoKho: [''],
        tenNganLoKho: [''],

        soLuongQdGiaoNvNh: [''],
        soLuongDaNhap: [''],

        nguoiGiaoHang: [''],
        cmtNguoiGiaoHang: [''],
        donViGiaoHang: [''],
        diaChi: [''],
        bienSoXe: [''],
        soChungThuGiamDinh: [''],
        ngayGdinh: [''],
        tchucGdinh: [''],
        ketLuan: [],
        ketLuanCuoi: [],
        kqDanhGia: [],
        lyDoTuChoi: [''],
        trangThai: [],
        tenTrangThai: [],
        soBbNtbq: [],
        tenThuKho: [],
        tenKtvBq: [],
        soLuongNhapKho: [],
        tenLdcc: [],
        slKhKb: [],
        slTtKtra: [],
        hthucBquan: [],
        soHieuQuyChuan: [],
      }
    );
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      super.ngOnInit();
      this.userInfo = this.userService.getUserLogin();
      await Promise.all([
        // this.loadTieuChuan(),
        this.loadData(),
        this.loadDsHthucBquan(),
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
    let maBb = 'KTCL-' + this.userInfo.DON_VI.tenVietTat;
    let res = await this.userService.getId("PHIEU_KT_CHAT_LUONG_SEQ");
    this.formData.patchValue({
      soPhieu: `${res}/${this.formData.get('nam').value}/${maBb}`,
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự thảo',
    });
    if (this.idQdGiaoNvNh) {
      await this.bindingDataQd(this.idQdGiaoNvNh, true);
    }
  }

  isDisableField() {
    if (this.detail && (this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_TP || this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC || this.detail.trangThai == this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC)) {
      return true;
    }
  }

  async loadSoQuyetDinh() {
    let body = {
      "maDvi": this.userInfo.MA_DVI,
      "loaiVthh": this.loaiVthh,
      "paggingReq": {
        "limit": this.globals.prop.MAX_INTERGER,
        "page": 0
      },
      "trangThai": STATUS.BAN_HANH,
      "namNhap": this.formData.get('nam').value
    }
    let res = await this.quyetDinhGiaoNhapHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoQuyetDinh = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async openDialogSoQd() {
    await this.loadSoQuyetDinh();
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách số quyết định kế hoạch giao nhiệm vụ nhập hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listSoQuyetDinh,
        dataHeader: ['Số quyết định', 'Ngày quyết định', 'Loại hàng DTQG'],
        dataColumn: ['soQd', 'ngayQdinh', 'tenLoaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (dataChose) => {
      if (dataChose) {
        await this.bindingDataQd(dataChose.id, true);
      }
    });
  };

  async bindingDataQd(id, isSetTc?) {
    await this.spinner.show();
    let dataRes = await this.quyetDinhGiaoNhapHangService.getDetail(id)
    const data = dataRes.data;
    this.formData.patchValue({
      soQdGiaoNvNh: data.soQd,
      idQdGiaoNvNh: data.id,
      ngayQdGiaoNvNh: data.ngayQdinh,
      loaiVthh: data.loaiVthh,
      cloaiVthh: data.cloaiVthh,
      tenLoaiVthh: data.tenLoaiVthh,
      tenCloaiVthh: data.tenCloaiVthh,
      moTaHangHoa: data.moTaHangHoa,
      soHd: data.soHd,
      ngayHd: data.hopDong?.ngayHlucHd,
    });
    let dataChiCuc;
    if (this.userService.isChiCuc()) {
      dataChiCuc = data.dtlList.filter(item => item.maDvi == this.userInfo.MA_DVI);
    } else {
      dataChiCuc = data.dtlList
    }
    if (dataChiCuc.length > 0) {
      this.listDiaDiemNhap = dataChiCuc[0].children;
    }
    if (isSetTc) {
      let dmTieuChuan = await this.khCnQuyChuanKyThuat.getQuyChuanTheoCloaiVthh(data.cloaiVthh);
      if (dmTieuChuan.data) {
        this.dataTableChiTieu = dmTieuChuan.data;
        this.dataTableChiTieu = this.dataTableChiTieu.map(element => {
          return {
            ...element,
            edit: true,
            tenTchuan: element.tenChiTieu,
            chiSoNhap: element.mucYeuCauXuat,
            ketQuaKiemTra: element.ketQuaPt,
            phuongPhap: element.phuongPhapXd,
            danhGia: element.danhGia
          }
        });
        this.formData.get('soHieuQuyChuan').setValue(this.dataTableChiTieu[0].soHieuQuyChuan)
      }
    }
    if (this.maNganLoKho != null) {
      let dataDdiem = null;
      if (this.maNganLoKho.length == 16) {
        dataDdiem = this.listDiaDiemNhap.find(x => x.maLoKho == this.maNganLoKho);
      } else if (this.maNganLoKho.length == 14) {
        dataDdiem = this.listDiaDiemNhap.find(x => x.maNganKho == this.maNganLoKho);
      }
      if (dataDdiem != null) {
        this.bindingDataDdNhap(dataDdiem);
      }
    }
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
      let soLuongNhap = await this.phieuKtraCluongService.getSoLuongNhap({ "idDdiemGiaoNvNh": data.id });
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
        soLuongQdGiaoNvNh: data.soLuong * 1000,
        soLuongDaNhap: soLuongNhap.data,
        soLuongNhapKho: data.soLuong,
        soBbNtbq: data.listBbNtbqld?.find(item => item.id === Math.min(...data.listBbNtbqld?.map(item => item.id)))?.soBbNtBq,
        hthucBquan: data.listBbNtbqld?.find(item => item.id === Math.min(...data.listBbNtbqld?.map(item => item.id)))?.hthucBquan,
        tenNganLoKho: data.tenLoKho ? `${data.tenLoKho} - ${data.tenNganKho}` : data.tenNganKho,
      })
      this.formattedSlNhapKho = this.formData.get('soLuongNhapKho') ? formatNumber(this.formData.get('soLuongNhapKho').value * 1000, 'vi_VN', '1.0-99') : '0';
      await this.loadDsHthucBquan();
    }
  }

  async loadTieuChuan() {
    let body = {
      "maHang": this.loaiVthh,
      "namQchuan": null,
      "paggingReq": {
        "limit": 1000,
        "page": 1
      },
      "str": null,
      "tenQchuan": null,
      "trangThai": "01"
    }
    let res = await this.danhMucService.traCuuTieuChuanKyThuat(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content.length > 0) {
        if (res.data.content[0].children && res.data.content[0].children.length > 0) {
          this.listTieuChuan = res.data.content[0].children;
        }
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  changeChiTieu(item) {
    if (item) {
      let getChiTieu = this.listTieuChuan.filter(x => x.tenTchuan == item.tenChiTieu);
      if (getChiTieu && getChiTieu.length > 0) {
        item.tieuChuan = getChiTieu[0].chiSoNhap;
        item.phuongPhapXacDinh = getChiTieu[0].phuongPhap;
      }
    }
  }

  async loadData() {
    this.listDanhGia = [];
    let resNx = await this.danhMucService.danhMucChungGetAll("KET_QUA_DANH_GIA");
    if (resNx.msg == MESSAGE.SUCCESS) {
      this.listDanhGia = resNx.data;
    }
  }

  async loadDsHthucBquan () {
    if (this.formData.value.cloaiVthh) {
      let res = await this.danhMucService.getDetail(this.formData.value.cloaiVthh);
      if (res.msg == MESSAGE.SUCCESS) {
        this.listHinhThucBaoQuan = res.data?.hinhThucBq
      }
    }
  }
  async loadChiTiet(id: number) {
    if (id > 0) {
      let res = await this.phieuKtraCluongService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data;
          data.ketQuaKiemTra.forEach(item => {
            item.tenDanhGia = this.listDanhGia.find(i => i.ma == item.danhGia)?.giaTri;
          })
          this.dataTableChiTieu = data.ketQuaKiemTra;
          this.listFileDinhKem = data.fileDinhKems;
          this.listFileDinhKemKTCL = data.fileDinhKemsKtcl;
          this.helperService.bidingDataInFormGroup(this.formData, data);
          await this.bindingDataQd(data.idQdGiaoNvNh);
          let dataDdiem = this.listDiaDiemNhap.filter(item => item.id == data.idDdiemGiaoNvNh)[0];
          this.bindingDataDdNhap(dataDdiem);
        }
      }
    }
    this.updateEditCache();
  }
  setValidator(isGuiDuyet) {
    if (isGuiDuyet) {
      this.formData.controls["soQdGiaoNvNh"].setValidators([Validators.required]);
      this.formData.controls["maDiemKho"].setValidators([Validators.required]);
      this.formData.controls["maNhaKho"].setValidators([Validators.required]);
      this.formData.controls["maNganKho"].setValidators([Validators.required]);
      // this.formData.controls["maLoKho"].setValidators([Validators.required]);
      this.formData.controls["soBbNtbq"].setValidators([Validators.required]);
      this.formData.controls["nguoiGiaoHang"].setValidators([Validators.required]);
      this.formData.controls["donViGiaoHang"].setValidators([Validators.required]);
    } else {
      this.formData.controls["soQdGiaoNvNh"].clearValidators();
      this.formData.controls["maDiemKho"].clearValidators();
      this.formData.controls["maNhaKho"].clearValidators();
      this.formData.controls["maNganKho"].clearValidators();
      this.formData.controls["maLoKho"].clearValidators();
      this.formData.controls["soBbNtbq"].clearValidators();
      this.formData.controls["nguoiGiaoHang"].clearValidators();
      this.formData.controls["donViGiaoHang"].clearValidators();
    }
  }

  async save(isGuiDuyet: boolean) {
    if (this.validateSave()) {
      await this.spinner.show();
      this.setValidator(isGuiDuyet);
      await this.helperService.markFormGroupTouched(this.formData);
      if (this.formData.invalid) {
        await this.spinner.hide();
        return;
      }
      let body = this.formData.value;
      body.fileDinhKems = this.listFileDinhKem;
      body.fileDinhKemsKtcl = this.listFileDinhKemKTCL;
      body.ketQuaKiemTra = this.dataTableChiTieu;
      let res;
      if (this.formData.get('id').value > 0) {
        res = await this.phieuKtraCluongService.update(body);
      } else {
        res = await this.phieuKtraCluongService.create(body);
      }
      if (res.msg == MESSAGE.SUCCESS) {
        this.id = res.data.id;
        this.formData.get('id').setValue(res.data.id)
        if (isGuiDuyet) {
          await this.spinner.hide();
          this.pheDuyet();
        } else {
          if (this.formData.get('id').value) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
          } else {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
          }
          await this.spinner.hide();
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
        await this.spinner.hide();
      }
    }
  }

  validateSave() {
    let soLuongConLai = this.formData.value.soLuongQdGiaoNvNh - this.formData.value.soLuongDaNhap
    if (this.formData.value.soLuongNhapKho > soLuongConLai) {
      this.notification.error(MESSAGE.ERROR, "Số lượng nhập hàng vượt quá số lượng còn trống, xin vui lòng nhập lại")
      return false;
    }
    return true
  }

  pheDuyet() {
    if (this.formData.value.soBbNtbq == null) {
      this.notification.error(MESSAGE.ERROR, "Bạn cần tạo biên bản nghiệm thu bảo quản lần đầu trước.")
      return;
    }
    let trangThai = ''
    let mess = ''
    switch (this.formData.get('trangThai').value) {
      case STATUS.TU_CHOI_LDCC:
      case STATUS.TU_CHOI_TK:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_LDCC;
        mess = 'Bạn có muốn gửi duyệt ?'
        break;
      }
      case STATUS.CHO_DUYET_LDCC: {
        trangThai = STATUS.DA_DUYET_LDCC;
        mess = 'Bạn có chắc chắn muốn phê duyệt ?'
        break;
      }
      case STATUS.CHO_DUYET_TK: {
        trangThai = STATUS.CHO_DUYET_LDCC;
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
            await this.phieuKtraCluongService.approve(
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
    let trangThai = ''
    switch (this.formData.get('trangThai').value) {
      case STATUS.CHO_DUYET_LDCC: {
        trangThai = STATUS.TU_CHOI_LDCC;
        break;
      }
      case STATUS.CHO_DUYET_TK: {
        trangThai = STATUS.TU_CHOI_TK;
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
            await this.phieuKtraCluongService.approve(
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

  themBienBanNgiemThuKeLot() {
    const modalLuongThuc = this.modal.create({
      nzTitle: 'Thêm mới thông tin chi tiết',
      nzContent: DialogThemBienbanNghiemThuKeLotComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalLuongThuc.afterClose.subscribe((res) => {
      if (res) {
      }
    });
  }

  cancelEdit(index: number): void {
    this.dataTableChiTieu[index].edit = false;
  }

  saveEdit(index: number): void {
    this.dataTableChiTieu[index].tenDanhGia = this.listDanhGia.find(i => i.ma == this.dataTableChiTieu[index].danhGia)?.giaTri;
    this.dataTableChiTieu[index].edit = false;
  }

  deleteRow(data: any) {
    this.detail.ketQuaKiemTra = this.detail?.ketQuaKiemTra.filter(x => x.stt != data.stt);
    this.sortTableId();
    this.updateEditCache();
  }

  editRow(index: number) {
    this.dataTableChiTieu[index].edit = true;
  }

  addRow() {
    if (!this.detail?.ketQuaKiemTra) {
      this.detail.ketQuaKiemTra = [];
    }
    this.sortTableId();
    let item = cloneDeep(this.create);
    item.stt = this.detail?.ketQuaKiemTra.length + 1;
    this.detail.ketQuaKiemTra = [
      ...this.detail?.ketQuaKiemTra,
      item,
    ]
    this.updateEditCache();
    this.clearItemRow();
  }

  clearItemRow() {
    this.create = {};
  }

  updateEditCache(): void {
    if (this.detail?.ketQuaKiemTra && this.detail?.ketQuaKiemTra.length > 0) {
      this.detail?.ketQuaKiemTra.forEach((item) => {
        this.editDataCache[item.stt] = {
          edit: false,
          data: { ...item },
        };
      });
    }
  }

  sortTableId() {
    this.detail?.ketQuaKiemTra.forEach((lt, i) => {
      lt.stt = i + 1;
    });
  }

}
