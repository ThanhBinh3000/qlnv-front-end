import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Base2Component } from "../../../../../../components/base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { PhieuKtraCluongService } from "../../../../../../services/qlnv-hang/nhap-hang/nhap-khac/phieuKtraCluong.service";
import dayjs from "dayjs";
import { Validators } from "@angular/forms";
import { FileDinhKem } from "../../../../../../models/CuuTro";
import { MESSAGE } from "../../../../../../constants/message";
import {
  QuyetDinhGiaoNhapHangKhacService
} from "../../../../../../services/qlnv-hang/nhap-hang/nhap-khac/quyetDinhGiaoNhapHangKhac.service";
import {
  DialogTableSelectionComponent
} from "../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import { cloneDeep } from 'lodash';
import { DanhMucTieuChuanService } from "../../../../../../services/quantri-danhmuc/danhMucTieuChuan.service";
import { STATUS } from "../../../../../../constants/status";
import {
  BbNghiemThuBaoQuanService
} from "../../../../../../services/qlnv-hang/nhap-hang/nhap-khac/bbNghiemThuBaoQuan.service";
import { DialogTuChoiComponent } from "../../../../../../components/dialog/dialog-tu-choi/dialog-tu-choi.component";
import { DanhMucService } from "../../../../../../services/danhmuc.service";
import {KhCnQuyChuanKyThuat} from "../../../../../../services/kh-cn-bao-quan/KhCnQuyChuanKyThuat";
@Component({
  selector: 'app-lap-phieu-ktra-cluong',
  templateUrl: './lap-phieu-ktra-cluong.component.html',
  styleUrls: ['./lap-phieu-ktra-cluong.component.scss']
})
export class LapPhieuKtraCluongComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  @Input() typeVthh: string;
  @Input() idQdGiaoNvNh: number;
  @Output() showListEvent = new EventEmitter<any>();
  dataTableChiTieu: any[] = [];
  fileDinhKemCtgd: any[] = [];
  fileDinhKemKtcl: any[] = [];
  listSoQuyetDinh: any[] = [];
  listDiaDiemNhap: any[] = [];
  listBbNtbqld: any[] = [];
  dsDanhGia: any[] = [{
    ma: 'Đạt',
    giaTri: 'Đạt',
  },
  {
    ma: 'Không Đạt',
    giaTri: 'Không Đạt',
  },];
  previewName: string = 'nk_phieu_ktra_cl';
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private phieuKtraCluongService: PhieuKtraCluongService,
    private quyetDinhGiaoNhapHangKhacService: QuyetDinhGiaoNhapHangKhacService,
    private danhMucTieuChuanService: DanhMucTieuChuanService,
    private bbNghiemThuBaoQuanService: BbNghiemThuBaoQuanService,
    private khCnQuyChuanKyThuat: KhCnQuyChuanKyThuat,
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuKtraCluongService);
    this.formData = this.fb.group(
      {
        id: [],
        namKhoach: dayjs().get('year'),
        maDvi: ['',],
        maQhns: ['',],
        tenDvi: ['',],
        idQdGiaoNvNh: ['',],
        soQdGiaoNvNh: [, [Validators.required]],
        ngayQdGiaoNvNh: ['',],
        soPhieu: ['', [Validators.required]],
        ngayTao: [dayjs().format('YYYY-MM-DD')],
        ktvBaoQuan: [''],
        loaiVthh: ['',],
        tenLoaiVthh: ['',],
        cloaiVthh: [''],
        tenCloaiVthh: [''],
        soHd: [''],
        ngayHd: [null,],
        soLuongNhapKho: [null,],
        soLuongTheoChungTu: [null,],
        soLuongKhKhaiBao: [null,],
        soLuongTtKtra: [null,],
        idBbNtBq: [null,],
        soBbNtBq: [null, [Validators.required]],

        idDdiemGiaoNvNh: [],
        maDiemKho: ['', [Validators.required]],
        tenDiemKho: ['', [Validators.required]],
        maNhaKho: ['', [Validators.required]],
        tenNhaKho: ['', [Validators.required]],
        maNganKho: ['', [Validators.required]],
        tenNganKho: ['', [Validators.required]],
        maLoKho: [''],
        tenLoKho: [''],
        tenNganLoKho: [''],
        soLuongQdGiaoNvNh: [''],
        soLuongDaNhap: [''],
        nguoiGiaoHang: ['', [Validators.required]],
        cmtNguoiGiaoHang: ['',],
        donViGiaoHang: ['', [Validators.required]],
        diaChi: ['',],
        bienSoXe: ['',],
        soLuongDeNghiKt: ['',],
        soChungThuGiamDinh: ['',],
        ngayGdinh: ['',],
        tchucGdinh: ['',],
        fileDinhKem: [FileDinhKem],
        ketLuan: [],
        kqDanhGia: [],
        ldoTuChoi: [''],
        trangThai: [],
        tenTrangThai: [],
        tenNguoiTao: [],
        soHieuQuyChuan: [],
      }
    );
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      await Promise.all([
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
    let res = await this.userService.getId("HH_NK_PHIEU_KTCL_SEQ");
    this.formData.patchValue({
      soPhieu: `${res}/${this.formData.get('namKhoach').value}/KTCL-CCDTKVVP`,
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự thảo',
      nguoiTao: this.userInfo.sub,
      tenNguoiTao: this.userInfo.TEN_DAY_DU,
    });
    if (this.idQdGiaoNvNh) {
      await this.bindingDataQd(this.idQdGiaoNvNh);
    }
  }

  back() {
    this.showListEvent.emit();
  }

  async save(isGuiDuyet: boolean) {
    // if (this.validateSave()) {
    try {
      await this.spinner.show();
      await this.helperService.markFormGroupTouched(this.formData);
      if (this.formData.invalid) {
        await this.spinner.hide();
        return;
      }
      let body = this.formData.value;
      body.fileDinhKemCtgd = this.fileDinhKemCtgd;
      body.fileDinhKemKtcl = this.fileDinhKemKtcl;
      body.chiTieu = this.dataTableChiTieu;
      let res;
      if (this.formData.get('id').value > 0) {
        res = await this.phieuKtraCluongService.update(body);
      } else {
        res = await this.phieuKtraCluongService.create(body);
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
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
    // }
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
            lyDoTuChoi: text,
            trangThai: STATUS.TU_CHOI_LDCC,
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

  pheDuyet() {
    let trangThai = ''
    switch (this.formData.value.trangThai) {
      case STATUS.TU_CHOI_LDCC:
      case STATUS.DU_THAO: {
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
      },
    });
  }

  async loadSoQuyetDinh() {
    let body = {
      maDvi: this.userInfo.MA_DVI,
      loaiVthh: this.typeVthh,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0,
      },
      trangThai: this.globals.prop.NHAP_BAN_HANH,
    }
    let res = await this.phieuKtraCluongService.dsQdNvuDuocLapPhieuKtcl(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listSoQuyetDinh = res.data;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
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
        dataColumn: ['soQd', 'ngayQdinh', 'tenLoaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (dataChose) => {
      if (dataChose) {
        await this.bindingDataQd(dataChose.id, true);
      }
    });
  }

  async bindingDataQd(id, isSetTc?) {
    await this.spinner.show();
    let dataRes = await this.quyetDinhGiaoNhapHangKhacService.getDetail(id)
    const data = dataRes.data;
    this.formData.patchValue({
      soQdGiaoNvNh: data.soQd,
      idQdGiaoNvNh: data.id,
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
    let dataChiCuc = data.dtlList;
    if (dataChiCuc.length > 0) {
      this.listDiaDiemNhap = cloneDeep(dataChiCuc);
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
    await this.spinner.hide();
  }

  openDialogBqld() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách biên bản nghiệm thu bảo quản lần đầu',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listBbNtbqld,
        dataHeader: ['Số BB NT kê lót, BQLĐ', 'Ngày lập biên bản', 'Ngày kết thúc NT kê lót, BQLĐ'],
        dataColumn: ['soBbNtBq', 'ngayTao', 'ngayNghiemThu']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      this.formData.patchValue({
        soBbNtBq: data.soBbNtBq,
        idBbNtBq: data.id
      })
    });
  }

  openDialogDdiemNhapHang(isSetTc?) {
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
      await this.loadDsBbnt();
      // if (isSetTc) {
      //   let dmTieuChuan = await this.danhMucTieuChuanService.getDetailByMaHh(data.cloaiVthh);
      //   if (dmTieuChuan.data) {
      //     this.dataTableChiTieu = dmTieuChuan.data.children;
      //     this.dataTableChiTieu.forEach(element => {
      //       element.edit = false
      //     });
      //   }
      // }
    });
  }

  async bindingDataDdNhap(data) {
    if (data) {
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
    }
  }

  async loadDsBbnt() {
    let body = {
      idQdGiaoNvnh: this.formData.get('idQdGiaoNvNh').value,
      maLoKho: this.formData.get('maLoKho').value,
      maNganKho: this.formData.get('maNganKho').value,
    }
    let res = await this.bbNghiemThuBaoQuanService.timKiemBbtheoMaNganLo(body);
    console.log(res.data, "loadDsBbnt")
    if (res.msg == MESSAGE.SUCCESS) {
      this.listBbNtbqld = res.data;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  isDisableField(): boolean {
    return false;
  }

  editRow(index: number) {
    this.dataTableChiTieu[index].edit = true;
  }

  cancelEdit(index: number): void {
    this.dataTableChiTieu[index].edit = false;
  }

  saveEdit(index: number): void {
    this.dataTableChiTieu[index].edit = false;
  }

  async loadChiTiet(id) {
    if (id > 0) {
      let res = await this.phieuKtraCluongService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.helperService.bidingDataInFormGroup(this.formData, res.data);
          await this.bindingDataQd(res.data.idQdGiaoNvNh);
          this.fileDinhKemCtgd = res.data.fileDinhKemCtgd;
          this.fileDinhKemKtcl = res.data.fileDinhKemKtcl;
          this.dataTableChiTieu = res.data.listChiTieu;
          await this.bindingDataDdNhap(res.data);
        }
      }
    }
  }
}
