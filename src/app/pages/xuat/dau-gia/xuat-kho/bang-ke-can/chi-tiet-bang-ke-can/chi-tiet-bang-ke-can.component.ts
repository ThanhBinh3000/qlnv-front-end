import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup, Validators} from "@angular/forms";
import {UserLogin} from "src/app/models/userlogin";
import {chiTietBangKeCanHangBdg} from "src/app/models/KeHoachBanDauGia";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "src/app/services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DanhMucService} from "src/app/services/danhmuc.service";
import {DonviService} from "src/app/services/donvi.service";
import {QuanLyHangTrongKhoService} from "src/app/services/quanLyHangTrongKho.service";
import * as dayjs from "dayjs";
import {MESSAGE} from "src/app/constants/message";
import {STATUS} from 'src/app/constants/status';
import {Base2Component} from "src/app/components/base2/base2.component";

import {
  DialogTableSelectionComponent
} from "src/app/components/dialog/dialog-table-selection/dialog-table-selection.component";
import {
  PhieuXuatKhoService
} from './../../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/xuat-kho/PhieuXuatKho.service';
import {
  BangKeCanService
} from './../../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/xuat-kho/BangKeCan.service';
import {
  QuyetDinhGiaoNvXuatHangService
} from "../../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/quyetdinh-nhiemvu-xuathang/quyet-dinh-giao-nv-xuat-hang.service";
import {convertTienTobangChu} from "../../../../../../shared/commonFunction";

@Component({
  selector: 'app-bdg-chi-tiet-bang-ke-can',
  templateUrl: './chi-tiet-bang-ke-can.component.html',
  styleUrls: ['./chi-tiet-bang-ke-can.component.scss']
})
export class ChiTietBangKeCanComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Input() idQdNv: number;
  @Output()
  showListEvent = new EventEmitter<any>();
  formData: FormGroup;
  listNam: any[] = [];
  userInfo: UserLogin;
  flagInit: Boolean = false;

  listSoQuyetDinh: any[] = [];
  listDiaDiemNhap: any[] = [];
  listDataBangCanKe: any[] = [];
  dataTableChange = new EventEmitter<any>();

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private donViService: DonviService,
    private quanLyHangTrongKhoService: QuanLyHangTrongKhoService,
    private quyetDinhGiaoNvXuatHangService: QuyetDinhGiaoNvXuatHangService,
    private phieuXuatKhoService: PhieuXuatKhoService,
    private bangKeCanService: BangKeCanService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bangKeCanService);
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
    this.formData = this.fb.group(
      {
        id: [''],
        nam: [dayjs().get("year")],
        maDvi: [''],
        maQhns: [''],
        soBangKe: [''],
        idQdGiaoNvXh: [''],
        soQdGiaoNvXh: ['', Validators.required],
        ngayQdGiaoNvXh: [''],
        idHdong: [''],
        soHdong: [''],
        ngayKyHd: [''],
        maDiemKho: [''],
        maNhaKho: [''],
        maNganKho: [''],
        maLoKho: [''],
        maKho: [''],
        idPhieuXuatKho: [''],
        soPhieuXuatKho: ['', Validators.required],
        ngayXuat: ['', Validators.required],
        diaDiemKho: ['', Validators.required],
        loaiVthh: [''],
        cloaiVthh: [''],
        donViTinh: [''],
        moTaHangHoa: [''],
        nlqHoTen: [''],
        nlqCmnd: [''],
        nlqDonVi: [''],
        nlqDiaChi: [''],
        thoiGianGiaoNhan: [''],
        tongTrongLuong: [''],
        tongTrongLuongBaoBi: ['', [Validators.required]],
        tongTrongLuongHang: [''],
        ngayGduyet: [''],
        nguoiGduyetId: [''],
        ngayPduyet: [''],
        nguoiPduyetId: [''],
        lyDoTuChoi: [''],
        trangThai: ['00'],
        type: [''],
        tenDvi: [''],
        diaChiDvi: [''],
        tenLoaiVthh: [''],
        tenCloaiVthh: [''],
        tenTrangThai: ['Dự thảo'],
        tenChiCuc: [''],
        tenDiemKho: [''],
        tenNhaKho: [''],
        tenNganKho: [''],
        tenLoKho: [''],
        nguoiPduyet: [''],
        nguoiGduyet: [''],
      }
    );
  }

  async ngOnInit() {
    try {
      this.spinner.show();
      this.userInfo = this.userService.getUserLogin();
      if(this.idInput){
        await this.loadDetail(this.idInput)
      }else {
        await this.initForm();
      }
      this.emitDataTable()
      this.updateEditCache()
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
    } finally {
      this.flagInit = true;
      this.spinner.hide();
    }
  }

  async initForm() {
    let id = await this.userService.getId('XH_CTVT_BANG_KE_HDR_SEQ')
    this.formData.patchValue({
      soBangKe: `${id}/${this.formData.value.nam}/BKCH-${this.userInfo.DON_VI?.tenVietTat}`,
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhNs: this.userInfo.DON_VI.maQhns,
      nguoiGduyet: this.userInfo.TEN_DAY_DU,
      loaiVthh: this.loaiVthh,
    });
    if(this.idQdNv){

    }else {
      await this.loadSoQuyetDinh();
    }
  }

  async loadDetail(idInput: number) {
    if (idInput > 0) {
      let data = await this.detail(idInput);
      this.formData.patchValue({
        soPhieuXuatKho: data.soPhieuXuatKho,
        ngayXuat: data.ngayXuat,
      });
      this.dataTable =data.bangKeDtl
    }
  }

  async loadSoQuyetDinh() {
    let body = {
      trangThai: STATUS.BAN_HANH,
      loaiVthh: this.loaiVthh,
    }
    let res = await this.quyetDinhGiaoNvXuatHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoQuyetDinh = data.content;
      this.listSoQuyetDinh = this.listSoQuyetDinh.filter(item => item.children.some(child => child.maDvi === this.userInfo.MA_DVI));
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }


  async openDialogSoQd() {
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH SỐ QUYẾT ĐỊNH GIAO NHIỆM VỤ XUẤT HÀNG',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listSoQuyetDinh,
        dataHeader: ['Số quyết định', 'Ngày quyết định', 'Loại hàng hóa'],
        dataColumn: ['soQd', 'ngayKy', 'tenLoaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.bindingDataQd(data.id)
      }
    });
  };

  async bindingDataQd(id) {
    await this.spinner.show();
    let dataRes = await this.quyetDinhGiaoNvXuatHangService.getDetail(id)
    const data = dataRes.data;
    console
    this.formData.patchValue({
      soQdGiaoNvXh: data.soQd,
      idQdGiaoNvXh: data.id,
      ngayQdGiaoNvXh: data.ngayKy,
      soHdong: data.soHd,
      idHdong: data.idHd,
      ngayKyHd: data.ngayKyHd,
    });
    await this.loadDsBangKeCan(data.soQd);
    let dataChiCuc = data.children.filter(item => item.maDvi == this.userInfo.MA_DVI);
    if (dataChiCuc) {
      this.listDiaDiemNhap = [];
      dataChiCuc.forEach(e => {
        this.listDiaDiemNhap = [...this.listDiaDiemNhap, e.children];
      });
      this.listDiaDiemNhap = this.listDiaDiemNhap.flat();

      let set1 = new Set(this.listDataBangCanKe.map(item => JSON.stringify({ maLoKho: item.maLoKho, maNganKho: item.maNganKho })));
      console.log(set1, 999)
      this.listDiaDiemNhap = this.listDiaDiemNhap.filter(item => {
        const key = JSON.stringify({ maLoKho: item.maLoKho, maNganKho: item.maNganKho });
        return !set1.has(key);
      });
    }
    await this.spinner.hide();
  }

  async loadDsBangKeCan(event) {
    let body = {
      soQdGiaoNvXh : event
    }
    let res = await this.bangKeCanService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listDataBangCanKe = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async openDialogDdiem() {
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH ĐỊA ĐIỂM XUẤT HÀNG',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDiaDiemNhap,
        dataHeader: ['Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho'],
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          maDiemKho: data.maDiemKho,
          tenDiemKho: data.tenDiemKho,
          maNhaKho: data.maNhaKho,
          tenNhaKho: data.tenNhaKho,
          maNganKho: data.maNganKho,
          tenNganKho: data.tenNganKho,
          maLoKho: data.maLoKho,
          tenLoKho: data.tenLoKho,
        })
        let body1 = {
          trangThai: "01",
          maDviCha: this.userInfo.MA_DVI
        };
        const res1 = await this.donViService.getAll(body1)
        const dataDk = res1.data;
        if (dataDk) {
          this.listDiaDiemNhap = dataDk.filter(item => item.maDvi == data.maDiemKho);
          this.listDiaDiemNhap.forEach(s => {
            this.formData.patchValue({
              diaDiemKho: s.diaChi,
            })
          })
        }
        await this.loadPhieuXuatKho(data)
      }
    });
  }

  async loadPhieuXuatKho(data){
    let body = {
      trangThai: STATUS.DU_THAO,
      loaiVthh: this.loaiVthh,
      soQdGiaoNvXh: this.formData.value.soQdGiaoNvXh,
    }
    let res = await this.phieuXuatKhoService.search(body)
    if (res.data){
      const list = res.data.content;
      let soPhieuXuat = list.find(item => (item.maDiemKho == data.maDiemKho && item.maNhaKho == data.maNhaKho && item.maNganKho == data.maNganKho && item.maLoKho == data.maLoKho));
      if(soPhieuXuat){
        await this.spinner.show();
        let dataDtail = await this.phieuXuatKhoService.getDetail(soPhieuXuat.id);
        if (dataDtail.data){
          const data = dataDtail.data;
          this.formData.patchValue({
            idPhieuXuatKho: data.id,
            soPhieuXuatKho: data.soPhieuXuatKho,
            ngayXuat: data.ngayXuatKho,
            nlqHoTen: data.nguoiGiaoHang,
            nlqCmnd: data.soCmt,
            nlqDonVi: data.ctyNguoiGh,
            nlqDiaChi: data.diaChi,
            loaiVthh: data.loaiVthh,
            cloaiVthh: data.cloaiVthh,
            tenLoaiVthh: data.tenLoaiVthh,
            tenCloaiVthh: data.tenCloaiVthh,
            moTaHangHoa: data.moTaHangHoa,
            donViTinh: data.donViTinh,
          });
        }
        await this.spinner.hide();
      }
    }
  }
  changeSoQd(event) {
    if (this.flagInit && event && event !== this.formData.value.soQdGiaoNvXh) {
      this.formData.patchValue({
        maDiemKho: null,
        tenDiemKho: null,
        maNhaKho: null,
        tenNhaKho: null,
        maNganKho: null,
        tenNganKho: null,
        maLoKho: null,
        tenLoKho: null,
        maKho: null,
        tenKho: null,
      });
    }
  }

  changeDd(event) {
    if (this.flagInit && event && event !== this.formData.value.maDiemKho) {
      this.formData.patchValue({
        idPhieuXuatKho: null,
        soPhieuXuatKho: null,
        ngayXuat: null,
        nlqHoTen: null,
        nlqCmnd: null,
        nlqDonVi: null,
        nlqDiaChi: null,
        loaiVthh: null,
        cloaiVthh: null,
        tenLoaiVthh: null,
        tenCloaiVthh: null,
        moTaHangHoa: null,
        donViTinh: null,
      });
    }
  }

  async save(isGuiDuyet?: boolean){
    let body = this.formData.value;
    body.bangKeDtl = this.dataTable;
    let data = await this.createUpdate(body);
    if (data) {
      if (isGuiDuyet) {
        this.idInput = data.id
        this.pheDuyet(true);
      } else {
        this.idInput = data.id
        await this.loadDetail(this.idInput);
      }
    }
  }

  pheDuyet(isPheDuyet) {
    if (this.dataTable.length == 0) {
      this.notification.error(
        MESSAGE.ERROR,
        'Danh sách mã cân, số bao bì, trọng lượng bao bì không được để trống',
      );
      return;
    }
    let trangThai = ''
    let msg = ''
    if (isPheDuyet) {
      switch (this.formData.value.trangThai) {
        case STATUS.TU_CHOI_LDCC:
        case STATUS.DU_THAO:
          trangThai = STATUS.CHO_DUYET_LDCC
          msg = 'Bạn có muốn gửi duyệt ?'
          break;
        case STATUS.CHO_DUYET_LDCC:
          trangThai = STATUS.DA_DUYET_LDCC
          msg = 'Bạn có muốn duyệt bản ghi ?'
          break;
      }
      this.approve(this.idInput, trangThai, msg);
    } else {
      switch (this.formData.value.trangThai) {
        case STATUS.CHO_DUYET_LDCC:
          trangThai = STATUS.TU_CHOI_LDCC
          break;
      }
      this.reject(this.idInput, trangThai)
    }
  }

  rowItem : chiTietBangKeCanHangBdg = new chiTietBangKeCanHangBdg();
  dataEdit : { [key : string]: {edit : boolean; data: chiTietBangKeCanHangBdg}} = {};

  emitDataTable() {
    this.dataTableChange.emit(this.dataTable);
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

  addRow() {
    if (this.validateDataRow()) {
      if (!this.dataTable) {
        this.dataTable = [];
      }
      this.dataTable = [...this.dataTable, this.rowItem];
      this.rowItem = new chiTietBangKeCanHangBdg();
      this.emitDataTable();
      this.updateEditCache()
    }
  }

  clearItemRow() {
    this.rowItem = new chiTietBangKeCanHangBdg();
    this.rowItem.id = null;
  }

  startEdit(index: number) {
    this.dataEdit[index].edit = true;
  }

  deleteRow(index: any) {
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
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  saveEdit(idx: number): void {
    Object.assign(this.dataTable[idx], this.dataEdit[idx].data);
    this.dataEdit[idx].edit = false;
  }

  cancelEdit(stt: number): void {
    this.dataEdit[stt] = {
      data: { ...this.dataTable[stt] },
      edit: false
    };
  }

  validateDataRow() {
    if (this.rowItem.maCan && this.rowItem.trongLuongBaoBi && this.rowItem.trongLuongCaBi) {
      let tongTrongLuong = this.calcTong('trongLuongCaBi');
      if (this.rowItem.trongLuongBaoBi >= this.rowItem.trongLuongCaBi) {
        this.notification.error(MESSAGE.ERROR, "Số lượng bì phải lớn lơn trọng lượng bao bì.");
        return false
      }
      if (tongTrongLuong + this.rowItem.trongLuongCaBi > this.formData.value.soLuong) {
        this.notification.error(MESSAGE.ERROR, "Trọng lượng bao bì không được vượt quá số lượng xuất kho.");
        return false
      }
      return true;
    } else {
      this.notification.error(MESSAGE.ERROR, "Vui lòng nhập đủ thông tin");
      return false
    }
  }

  calcTong(columnName) {
    if (this.dataTable) {
      const sum = this.dataTable.reduce((prev, cur) => {
        prev += cur[columnName];
        return prev;
      }, 0);
      return sum;
    }
  }

  convertTien(tien: number): string {
    return convertTienTobangChu(tien);
  }
}

