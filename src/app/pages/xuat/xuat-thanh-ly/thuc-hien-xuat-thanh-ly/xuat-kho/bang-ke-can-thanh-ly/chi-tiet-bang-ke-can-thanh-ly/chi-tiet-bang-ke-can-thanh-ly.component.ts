import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Base2Component} from "../../../../../../../components/base2/base2.component";
import {Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DonviService} from "../../../../../../../services/donvi.service";
import * as dayjs from "dayjs";
import {MESSAGE} from "../../../../../../../constants/message";
import {STATUS} from "../../../../../../../constants/status";
import {
  DialogTableSelectionComponent
} from "../../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import {convertTienTobangChu} from "../../../../../../../shared/commonFunction";
import {FileDinhKem} from "../../../../../../../models/CuuTro";
import {
  QuyetDinhGiaoNhiemVuThanhLyService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/QuyetDinhGiaoNhiemVuThanhLy.service";
import {
  PhieuXuatKhoThanhLyService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/PhieuXuatKhoThanhLy.service";
import {
  BangCanKeHangThanhLyService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/BangCanKeHangThanhLy.service";

@Component({
  selector: 'app-chi-tiet-bang-ke-can-thanh-ly',
  templateUrl: './chi-tiet-bang-ke-can-thanh-ly.component.html',
  styleUrls: ['./chi-tiet-bang-ke-can-thanh-ly.component.scss']
})
export class ChiTietBangKeCanThanhLyComponent extends Base2Component implements OnInit {
  @Input() idInput: number;
  @Input() isView: boolean;
  @Input() idBbQd: number;
  @Output()
  showListEvent = new EventEmitter<any>();

  maBangKe: string
  flagInit: Boolean = false;
  listDiaDiemXuat: any[] = [];
  listDataBangCanKe: any[] = [];
  listSoQuyetDinh: any[] = [];
  bangKeDtlCreate: any = {};
  bangKeDtlClone: any = {};
  templateName = "Bảng kê cân hàng";

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donViService: DonviService,
    private quyetDinhGiaoNhiemVuThanhLyService: QuyetDinhGiaoNhiemVuThanhLyService,
    private phieuXuatKhoThanhLyService: PhieuXuatKhoThanhLyService,
    private bangCanKeHangThanhLyService: BangCanKeHangThanhLyService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bangCanKeHangThanhLyService);
    this.formData = this.fb.group(
      {
        id: [],
        nam: [dayjs().get("year")],
        maDvi: [''],
        tenDvi: [''],
        maQhNs: [''],
        soBangKe: [''],
        idBbQd: [],
        soBbQd: [''],
        ngayKyBbQd: [''],
        idHopDong: [''],
        soHopDong: [''],
        ngayKyHopDong: [''],
        maDiaDiem: [''],
        tenCuc: [''],
        tenChiCuc: [''],
        tenDiemKho: [''],
        tenNhaKho: [''],
        tenNganKho: [''],
        tenLoKho: [''],
        idPhieuXuatKho: [''],
        soPhieuXuatKho: [''],
        ngayXuatKho: [''],
        diaDiemKho: [''],
        tenNguoiPduyet: [''],
        thuKho: [''],
        tenNguoiGiao: [''],
        cmtNguoiGiao: [''],
        congTyNguoiGiao: [''],
        diaChiNguoiGiao: [''],
        thoiGianGiaoNhan: [''],
        loaiVthh: [''],
        tenLoaiVthh: [''],
        cloaiVthh: [''],
        tenCloaiVthh: [''],
        tenVthh: [''],
        donViTinh: [''],
        soLuong: [],
        tongTrongLuongBaoBi: ['', [Validators.required]],
        trangThai: [''],
        tenTrangThai: [''],
        lyDoTuChoi: [''],
        fileDinhKem: [new Array<FileDinhKem>()],
        bangKeDtl: [[]],
      });
  }

  async ngOnInit() {
    await this.spinner.show()
    try {
      this.userInfo = this.userService.getUserLogin();
      this.maBangKe = 'BKCH-' + this.userInfo.DON_VI.tenVietTat;
      if (this.idInput) {
        await this.loadDetail(this.idInput);
      } else {
        await this.initForm();
      }
      await this.spinner.hide();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      await this.spinner.hide();
    } finally {
      await this.spinner.hide();
    }
  }

  async initForm() {
    let id = await this.userService.getId('XH_TL_BANG_KE_HDR_SEQ')
    this.formData.patchValue({
      soBangKe: `${id}/${this.formData.get('nam').value}/${this.maBangKe}`,
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhNs: this.userInfo.DON_VI.maQhns,
      thuKho: this.userInfo.TEN_DAY_DU,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự thảo',
    });
    if (this.idBbQd) {
      this.bindingDataQd(this.idBbQd)
    }
  }

  async loadDetail(idInput: number) {
    if (idInput > 0) {
      await this.detail(idInput);

    }
  }

  async openDialogSoQd() {
    await this.spinner.show();
    let body = {
      nam: this.formData.value.nam,
      trangThai: this.STATUS.DU_THAO,
    }
    let res = await this.quyetDinhGiaoNhiemVuThanhLyService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data.content;
      if (data && data.length > 0) {
        this.listSoQuyetDinh = data;
        this.listSoQuyetDinh = this.listSoQuyetDinh.filter(item => item.quyetDinhDtl.some(child => child.maDiaDiem.substring(0, 8) === this.userInfo.MA_DVI));
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
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
        dataColumn: ['soBbQd', 'ngayKy', 'tenLoaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.bindingDataQd(data.id);
      }
    });
    await this.spinner.hide();
  }

  changeSoQd(event) {

  }

  async bindingDataQd(id) {
    await this.spinner.show();
    if (id > 0) {
      await this.quyetDinhGiaoNhiemVuThanhLyService.getDetail(id)
        .then(async (res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const dataQd = res.data
            this.formData.patchValue({
              idBbQd: dataQd.id,
              soBbQd: dataQd.soBbQd,
              ngayKyBbQd: dataQd.ngayKy,
              idHopDong: dataQd.idHopDong,
              soHopDong: dataQd.soHopDong,
              ngayKyHopDong: dataQd.ngayKyHopDong,
            });
            await this.loadDsBangKeCan(dataQd.soBbQd);
            let dataChiCuc = dataQd.quyetDinhDtl.filter(item => item.maDiaDiem.substring(0, 8) === this.userInfo.MA_DVI);
            if (dataChiCuc) {
              this.listDiaDiemXuat = [];
              this.listDiaDiemXuat = [...this.listDiaDiemXuat, dataChiCuc];
              this.listDiaDiemXuat = this.listDiaDiemXuat.flat();
              let set1 = new Set(this.listDataBangCanKe.map(item => JSON.stringify({
                maDiaDiem: item.maDiaDiem,
              })));
              this.listDiaDiemXuat = this.listDiaDiemXuat.filter(item => {
                const key = JSON.stringify({
                  maDiaDiem: item.maDiaDiem,
                });
                return !set1.has(key);
              });
            }
          }
        }).catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }
    await this.spinner.hide();
  }

  async loadDsBangKeCan(event) {
    let body = {
      soBbQd: event
    }
    let res = await this.bangCanKeHangThanhLyService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      if (data && data.content && data.content.length > 0) {
        this.listDataBangCanKe = data.content;
      }
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
        dataTable: this.listDiaDiemXuat,
        dataHeader: ['Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho'],
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          maDiaDiem: data.maDiaDiem,
          tenDiemKho: data.tenDiemKho,
          tenNhaKho: data.tenNhaKho,
          tenNganKho: data.tenNganKho,
          tenLoKho: data.tenLoKho,
        })
        let body1 = {
          trangThai: "01",
          maDviCha: this.userInfo.MA_DVI
        };
        const res1 = await this.donViService.getAll(body1)
        const dataDk = res1.data;
        if (dataDk) {
          this.listDiaDiemXuat = dataDk.filter(item => item.maDvi == data.maDiaDiem.substring(0, 10));
          this.listDiaDiemXuat.forEach(s => {
            this.formData.patchValue({
              diaDiemKho: s.diaChi,
            })
          })
        }
        await this.loadPhieuXuatKho(data)
      }
    });
  }

  async loadPhieuXuatKho(data) {
    let body = {
      trangThai: STATUS.DU_THAO,
      soBbQd: this.formData.value.soBbQd,
    }
    let res = await this.phieuXuatKhoThanhLyService.search(body)
    if (res.msg == MESSAGE.SUCCESS) {
      let danhSachPhieu = res.data.content
      if (danhSachPhieu && danhSachPhieu.length > 0) {
        let danhSach = danhSachPhieu.find(item => (
          item.maDiaDiem == data.maDiaDiem));
        if (danhSach) {
          await this.spinner.show();
          await this.phieuXuatKhoThanhLyService.getDetail(danhSach.id)
            .then((dataDtail) => {
              if (dataDtail.msg == MESSAGE.SUCCESS) {
                const dataPhieu = dataDtail.data
                this.formData.patchValue({
                  idPhieuXuatKho: dataPhieu.id,
                  soPhieuXuatKho: dataPhieu.soPhieuXuatKho,
                  ngayXuatKho: dataPhieu.ngayXuatKho,
                  tenNguoiGiao: dataPhieu.tenNguoiGiao,
                  cmtNguoiGiao: dataPhieu.cmtNguoiGiao,
                  congTyNguoiGiao: dataPhieu.congTyNguoiGiao,
                  diaChiNguoiGiao: dataPhieu.diaChiNguoiGiao,
                  thoiGianGiaoNhan: dataPhieu.thoiGianGiaoNhan,
                  loaiVthh: dataPhieu.loaiVthh,
                  cloaiVthh: dataPhieu.cloaiVthh,
                  tenLoaiVthh: dataPhieu.tenLoaiVthh,
                  tenCloaiVthh: dataPhieu.tenCloaiVthh,
                  tenVthh: dataPhieu.tenVthh,
                  donViTinh: dataPhieu.donViTinh,
                  soLuong: dataPhieu.thucXuat,
                });
              }
            }).catch((e) => {
              console.log('error: ', e);
              this.spinner.hide();
              this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            });
          await this.spinner.hide();
        }
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  changeDd(event) {
    if (this.flagInit && event && event !== this.formData.value.maDiaDiem) {
      this.formData.patchValue({
        idPhieuXuatKho: null,
        soPhieuXuatKho: null,
        ngayXuatKho: null,
        tenNguoiGiao: null,
        cmtNguoiGiao: null,
        congTyNguoiGiao: null,
        diaChiNguoiGiao: null,
        thoiGianGiaoNhan: null,
        loaiVthh: null,
        cloaiVthh: null,
        tenLoaiVthh: null,
        tenCloaiVthh: null,
        tenVthh: null,
        donViTinh: null,
      });
    }
  }

  async save() {
    if (this.formData.value.bangKeDtl.length == 0) {
      this.notification.error(
        MESSAGE.ERROR,
        'Danh sách mã cân, số bao bì, trọng lượng bao bì không được để trống',
      );
      return;
    }
    await this.helperService.ignoreRequiredForm(this.formData);
    let body = this.formData.value;
    await this.createUpdate(body);
    await this.helperService.restoreRequiredForm(this.formData);
  }

  async addRow() {
    if (Object.keys(this.bangKeDtlCreate).length !== 0) {
      if (this.validateDataRow()) {
        let bangKeDtl = [...this.formData.value.bangKeDtl, this.bangKeDtlCreate];
        this.formData.patchValue({
          bangKeDtl: bangKeDtl
        })
        this.clearRow();
      }
    }
  }

  async clearRow() {
    this.bangKeDtlCreate = {}
  }

  async editRow(index: number) {
    this.formData.value.bangKeDtl.forEach(s => s.isEdit = false);
    this.formData.value.bangKeDtl[index].isEdit = true;
    Object.assign(this.bangKeDtlClone, this.formData.value.bangKeDtl[index]);
  }

  async saveRow(index: number) {
    this.formData.value.bangKeDtl[index].isEdit = false;
  }

  async cancelRow(index: number) {
    Object.assign(this.formData.value.bangKeDtl[index], this.bangKeDtlClone);
    this.formData.value.bangKeDtl[index].isEdit = false;
  }

  async deleteRow(index: number) {
    this.formData.value.bangKeDtl.splice(index, 1);
  }

  validateDataRow() {
    if (this.bangKeDtlCreate.maCan && this.bangKeDtlCreate.soBaoBi && this.bangKeDtlCreate.trongLuongBaoBi) {

      // let tongTrongLuong = this.dataTable.reduce((prev, cur) => prev + cur.trongLuongBaoBi, 0);
      if (this.bangKeDtlCreate.soBaoBi >= this.bangKeDtlCreate.trongLuongBaoBi) {
        this.notification.error(MESSAGE.ERROR, "Số bao bì phải bé hơn trọng lượng bao bì.");
        return false
      }
      // if (tongTrongLuong > this.formData.value.soLuong) {
      //   this.notification.error(MESSAGE.ERROR, "Trọng lượng bao bì không được vượt quá số lượng xuất kho.");
      //   return false
      // }
      return true;
    } else {
      this.notification.error(MESSAGE.ERROR, "Vui lòng nhập đủ thông tin");
      return false
    }
  }

  calcTong(columnName) {
    if (this.formData.value.bangKeDtl) {
      const sum = this.formData.value.bangKeDtl.reduce((prev, cur) => {
        prev += cur[columnName];
        return prev;
      }, 0);
      return sum;
    }
  }

  convertTien(tien: number): string {
    return convertTienTobangChu(tien);
  }

  isDisabled() {
    let trangThai = this.formData.value.trangThai;
    if (trangThai == STATUS.CHO_DUYET_LDCC) {
      return true
    }
    return false;
  }
}

