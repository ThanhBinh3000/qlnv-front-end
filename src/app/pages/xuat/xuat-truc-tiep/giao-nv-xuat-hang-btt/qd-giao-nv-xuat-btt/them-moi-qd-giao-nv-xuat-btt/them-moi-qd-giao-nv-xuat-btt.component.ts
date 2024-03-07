import {Component, EventEmitter, Input, OnInit, Output,} from '@angular/core';
import {Validators} from '@angular/forms';
import * as dayjs from 'dayjs';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {
  DialogTableSelectionComponent
} from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import {MESSAGE} from 'src/app/constants/message';
import {BAN_TRUC_TIEP, STATUS, THONG_TIN_BAN_TRUC_TIEP} from 'src/app/constants/status';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {
  QuyetDinhNvXuatBttService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/quyet-dinh-nv-xuat-btt/quyet-dinh-nv-xuat-btt.service';
import {HopDongBttService} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/hop-dong-btt/hop-dong-btt.service';
import {
  ChaoGiaMuaLeUyQuyenService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/chao-gia-mua-le-uy-quyen.service';
import {cloneDeep} from 'lodash';
import {FileDinhKem} from "../../../../../../models/DeXuatKeHoachBanTrucTiep";
import {LOAI_HANG_DTQG} from 'src/app/constants/config';
import _ from 'lodash';

@Component({
  selector: 'app-them-moi-qd-giao-nv-xuat-btt',
  templateUrl: './them-moi-qd-giao-nv-xuat-btt.component.html',
  styleUrls: ['./them-moi-qd-giao-nv-xuat-btt.component.scss']
})
export class ThemMoiQdGiaoNvXuatBttComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() isView: boolean;
  @Input() idInput: number;
  @Input() isViewOnModal: boolean;
  @Input() checkPrice: any;
  @Output() showListEvent = new EventEmitter<any>();
  LOAI_HANG_DTQG = LOAI_HANG_DTQG;
  TRUC_TIEP = BAN_TRUC_TIEP;
  templateNameVt = "Quyết định giao nhiệm vụ xuất vật tư";
  templateNameLt = "Quyết định giao nhiệm vụ xuất lương thực";
  maHauTo: any;
  flagInit: Boolean = false;
  listDviTsan: any[] = [];
  listAllDviTsan: any[] = [];
  loadQdNvXh: any[] = [];
  dsThongTinChaoGia: any[] = [];
  dsHdongBanTrucTiep: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private hopDongBttService: HopDongBttService,
    private chaoGiaMuaLeUyQuyenService: ChaoGiaMuaLeUyQuyenService,
    private quyetDinhNvXuatBttService: QuyetDinhNvXuatBttService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhNvXuatBttService);
    this.formData = this.fb.group({
      id: [],
      maDvi: [''],
      namKh: [dayjs().get('year')],
      soQdNv: [''],
      ngayKyQdNv: [''],
      idHopDong: [],
      soHopDong: [''],
      ngayKyHopDong: [''],
      idQdPd: [],
      soQdPd: [''],
      idQdDc: [],
      soQdDc: [''],
      soQd: [''],
      idChaoGia: [''],
      maDviTsan: [''],
      tenBenMua: [''],
      loaiVthh: [''],
      cloaiVthh: [''],
      tenHangHoa: [''],
      donViTinh: [''],
      soLuong: [''],
      tgianGiaoNhan: [''],
      loaiHinhNx: [''],
      kieuNx: [''],
      trichYeu: [''],
      pthucBanTrucTiep: [''], // 01 : chào giá: [''], 02 : Ủy quyền: [''], 03 : Bán lẻ
      phanLoai: [''],
      trangThaiXh: [''],
      trangThai: [''],
      lyDoTuChoi: [''],
      tenDvi: [''],
      tenLoaiVthh: [''],
      tenCloaiVthh: [''],
      tenLoaiHinhNx: [''],
      tenKieuNx: [''],
      tenTrangThai: [''],
      listMaDviTsan: [null],
      fileCanCu: [new Array<FileDinhKem>()],
      fileDinhKem: [new Array<FileDinhKem>()],
    })
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      this.maHauTo = '/' + this.userInfo.MA_QD;
      if (this.idInput > 0) {
        await this.getDetail(this.idInput);
      } else {
        await this.initForm();
      }
    } catch (error) {
      console.error('error: ', error);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
      this.flagInit = true;
    }
  }

  async initForm() {
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI,
      namKh: dayjs().get('year'),
      ngayKyQdNv: dayjs().format('YYYY-MM-DD'),
      phanLoai: BAN_TRUC_TIEP.CHAO_GIA,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự thảo',
    });
    await this.loadQdNvXuatHang();
  }

  async loadQdNvXuatHang() {
    const body = {
      maDvi: this.userInfo.MA_DVI,
      namKh: this.formData.value.namKh,
      loaiVthh: this.loaiVthh,
    };
    const res = await this.quyetDinhNvXuatBttService.search(body);
    if (res.msg !== MESSAGE.SUCCESS) {
      this.notification.error(MESSAGE.ERROR, res.msg);
      return;
    }
    const data = res.data.content;
    if (!data || data.length === 0) {
      return;
    }
    this.loadQdNvXh = data;
  }


  async getDetail(id: number) {
    if (id <= 0) {
      return;
    }
    const data = await this.detail(id);
    const {soQdNv, soHopDong, idChaoGia, children} = data;
    this.formData.patchValue({
      soQdNv: soQdNv?.split('/')[0] || null,
      soHopDong: idChaoGia ? null : soHopDong,
    });
    if (data.idChaoGia > 0) {
      await this.onChangeThongTin(data.idChaoGia);
    }
    this.dataTable = this.userService.isChiCuc() ? children.filter(item => item.maDvi === this.userInfo.MA_DVI) : children
  }

  async openDialogHopDong() {
    const phanLoai = this.formData.get('phanLoai').value;
    if (phanLoai !== BAN_TRUC_TIEP.CHAO_GIA) {
      return;
    }
    await this.spinner.show();
    const body = {
      trangThai: STATUS.DA_KY,
      namHd: this.formData.value.namKh,
      loaiVthh: this.loaiVthh,
    };
    try {
      const res = await this.hopDongBttService.search(body);
      if (res.msg === MESSAGE.SUCCESS) {
        const set = new Set(this.loadQdNvXh.map(item => item.soHopDong));
        this.dsHdongBanTrucTiep = res.data.content.filter(item => !set.has(item.soHopDong));
      }
      const modalQD = this.modal.create({
        nzTitle: 'DANH SÁCH HỢP ĐỒNG BÁN TRỰC TIẾP',
        nzContent: DialogTableSelectionComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          dataTable: this.dsHdongBanTrucTiep.filter(item => item.idQdNv === null && item.soQdNv === null),
          dataHeader: ['Số hợp đồng', 'Tên hợp đồng', 'Loại hàng hóa'],
          dataColumn: ['soHopDong', 'tenHopDong', 'tenLoaiVthh']
        },
      });
      modalQD.afterClose.subscribe(async (data) => {
        if (data) {
          await this.onChangeHopDong(data.id);
        }
      });
    } catch (error) {
      console.error(error);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  changeChaoGia(event) {
    if (this.flagInit && event && event !== this.formData.value.soHopDong) {
      this.formData.patchValue({
        idQdPd: null,
        soQdPd: null,
        idChaoGia: null,
        loaiVthh: null,
        tenLoaiVthh: null,
        cloaiVthh: null,
        tenCloaiVthh: null,
        tenHangHoa: null,
        soLuong: null,
        donViTinh: null,
        tgianGiaoNhan: null,
        loaiHinhNx: null,
        kieuNx: null,
        pthucBanTrucTiep: null,
        phanLoai: null,
        listMaDviTsan: [null],
      });
      this.dataTable = [];
    }
  }

  async onChangeHopDong(idHd) {
    if (idHd <= 0) {
      return;
    }
    try {
      await this.spinner.show();
      const res = await this.hopDongBttService.getDetail(idHd);
      if (res.msg !== MESSAGE.SUCCESS || !res.data) {
        return;
      }
      const data = res.data;
      this.formData.patchValue({
        idHopDong: data.id,
        soHopDong: data.soHopDong,
        ngayKyHopDong: data.ngayKyHopDong,
        maDviTsan: data.maDviTsan,
        tenBenMua: data.tenBenMua,
        loaiVthh: data.loaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        tenHangHoa: data.tenHangHoa,
        soLuong: data.soLuong,
        donViTinh: data.donViTinh,
        tgianGiaoNhan: data.tgianGiaoNhanDen,
        loaiHinhNx: data.loaiHinhNx,
        kieuNx: data.kieuNx,
        pthucBanTrucTiep: THONG_TIN_BAN_TRUC_TIEP.CHAO_GIA,
        phanLoai: BAN_TRUC_TIEP.CHAO_GIA,
      });
      this.dataTable = data.children
      this.dataTable.forEach(item => {
        item.soLuong = item.soLuongKyHopDong;
        item.children.forEach(child => {
          child.soLuong = child.soLuongKyHd;
          child.donGia = child.donGiaKyHd;
        });
      })
    } catch (error) {
      console.error('error: ', error);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async openDialogThongTin() {
    const phanLoai = this.formData.get('phanLoai').value;
    if (phanLoai !== BAN_TRUC_TIEP.UY_QUYEN_BAN_LE) {
      return;
    }
    await this.spinner.show();
    const body = {
      namKh: this.formData.value.namKh,
      loaiVthh: this.loaiVthh,
      trangThai: STATUS.DA_HOAN_THANH,
      pthucBanTrucTiep: [THONG_TIN_BAN_TRUC_TIEP.UY_QUYEN, THONG_TIN_BAN_TRUC_TIEP.BAN_LE],
      lastest: 1,
    };
    try {
      const res = await this.chaoGiaMuaLeUyQuyenService.search(body);
      if (res.msg === MESSAGE.SUCCESS) {
        this.dsThongTinChaoGia = res.data.content.map(item => ({
          soQd: item.soQdDc || item.soQdPd,
          phuongThuc: item.pthucBanTrucTiep === THONG_TIN_BAN_TRUC_TIEP.UY_QUYEN ? 'Ủy quyền' : 'Bán lẻ',
          ...item
        }));
      }
      const modalQD = this.modal.create({
        nzTitle: 'DANH SÁCH QUYẾT ĐỊNH ỦY QUYỀN/BÁN LẺ',
        nzContent: DialogTableSelectionComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          dataTable: this.dsThongTinChaoGia,
          dataHeader: ['Số QĐ phê duyệt/điều chỉnh KH BTT', 'Số đề xuất KH BTT', 'Loại hàng hóa', 'Phương thức bán trực tiếp'],
          dataColumn: ['soQd', 'soDxuat', 'tenLoaiVthh', 'phuongThuc']
        },
      });
      modalQD.afterClose.subscribe(async (data) => {
        if (data) {
          await this.onChangeThongTin(data.id);
        }
      });
    } catch (error) {
      console.error('error: ', error);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  changeUyQuenBanLe(event) {
    if (this.flagInit && event && event !== this.formData.value.soQd) {
      this.formData.patchValue({
        idHopDong: null,
        soHopDong: null,
        maDviTsan: null,
        tenBenMua: null,
        loaiVthh: null,
        tenLoaiVthh: null,
        cloaiVthh: null,
        tenCloaiVthh: null,
        tenHangHoa: null,
        soLuong: null,
        donViTinh: null,
        tgianGiaoNhan: null,
        loaiHinhNx: null,
        kieuNx: null,
        pthucBanTrucTiep: null,
        phanLoai: null,
      });
      this.dataTable = [];
    }
  }

  async onChangeThongTin(idThongTin) {
    if (idThongTin <= 0) {
      return;
    }
    try {
      await this.spinner.show();
      const res = await this.chaoGiaMuaLeUyQuyenService.getDetail(idThongTin);
      if (res.msg !== MESSAGE.SUCCESS || !res.data) {
        return;
      }
      const data = res.data;
      await this.setListDviTsan(data.children);
      if (!this.isView) {
        this.formData.patchValue({
          idQdPd: data.xhQdPdKhBttHdr.type === 'QDDC' ? data.xhQdPdKhBttHdr.idQdPd : data.idHdr,
          soQdPd: data.soQdPd,
          idQdDc: data.xhQdPdKhBttHdr.type === 'QDDC' ? data.idHdr : null,
          soQdDc: data.soQdDc,
          soQd: data.soQdDc || data.soQdPd,
          idChaoGia: data.id,
          loaiVthh: data.loaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          cloaiVthh: data.cloaiVthh,
          tenCloaiVthh: data.tenCloaiVthh,
          tenHangHoa: data.moTaHangHoa,
          tgianGiaoNhan: data.tgianDkienDen,
          donViTinh: data.donViTinh,
          loaiHinhNx: data.loaiHinhNx,
          kieuNx: data.kieuNx,
          pthucBanTrucTiep: data.pthucBanTrucTiep,
          phanLoai: BAN_TRUC_TIEP.UY_QUYEN_BAN_LE,
        });
      }
    } catch (error) {
      console.error('error: ', error);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  setListDviTsan(inputTable) {
    this.listDviTsan = [];
    inputTable.forEach((item) => {
      let dataGroup = _.chain(item.children).groupBy('maDviTsan').map((value, key) => ({
        maDviTsan: key,
        children: value
      })).value();
      dataGroup.forEach(child => {
        child.tenDvi = item.tenDvi
        child.maDvi = item.maDvi
        if (child.maDviTsan) {
          this.listDviTsan = [...this.listDviTsan, child];
        }
      })
    })
    const listQdNvXh = this.loadQdNvXh.filter(item => item.idChaoGia === this.formData.value.idChaoGia)
    this.listAllDviTsan = this.listDviTsan.filter(item => !listQdNvXh.some(child => child.maDviTsan.includes(item.maDviTsan)));
  }

  async selectMaDviTsan() {
    this.dataTable = [];
    let currentSelectList = cloneDeep(this.listAllDviTsan);
    if (this.formData.value.listMaDviTsan && this.formData.value.listMaDviTsan.length > 0) {
      const selectedItems = currentSelectList.filter(s => this.formData.value.listMaDviTsan.includes(s.maDviTsan));
      selectedItems.forEach((item) => {
        const existingItem = this.dataTable.find(child => child.maDvi === item.maDvi);
        if (existingItem) {
          existingItem.children.push(...item.children);
        } else {
          this.dataTable.push(item);
        }
      });
      await this.calculatorTable();
    } else {
      this.dataTable = []
    }
  }

  async calculatorTable() {
    this.dataTable.forEach(item => {
      item.children.forEach(child => {
        child.soLuong = child.soLuongDeXuat;
        child.donGia = child.donGiaDuocDuyet;
      })
      item.soLuong = item.children.reduce((acc, item) => acc + item.soLuongDeXuat, 0);
    })
    this.formData.patchValue({
      soLuong: this.dataTable.reduce((acc, item) => acc + item.soLuong, 0)
    });
  }

  async saveAndApproveAndReject(action: string, trangThai?: string, msg?: string, msgSuccess?: string) {
    try {
      if (this.checkPrice && this.checkPrice.boolean) {
        this.notification.error(MESSAGE.ERROR, this.checkPrice.msgSuccess);
        return;
      }
      if (this.checkPrice && this.checkPrice.booleanNhapXuat) {
        this.notification.error(MESSAGE.ERROR, this.checkPrice.msgNhapXuat);
        return;
      }
      await this.helperService.ignoreRequiredForm(this.formData);
      const body = {
        ...this.formData.value,
        soQdNv: this.formData.value.soQdNv ? this.formData.value.soQdNv + this.maHauTo : null,
        children: this.dataTable
      };
      switch (action) {
        case "createUpdate":
          this.setValidator();
          await this.createUpdate(body);
          break;
        case "saveAndSend":
          this.formData.controls["soQdNv"].setValidators([Validators.required]);
          await this.saveAndSend(body, trangThai, msg, msgSuccess);
          break;
        case "approve":
          await this.approve(this.idInput, trangThai, msg);
          break;
        case "reject":
          await this.reject(this.idInput, trangThai);
          break;
        default:
          console.error("Invalid action: ", action);
          break;
      }
    } catch (error) {
      console.error('Error: ', error);
    } finally {
      await this.helperService.restoreRequiredForm(this.formData);
    }
  }

  calcTong(columnName) {
    if (!this.dataTable) return 0;
    return this.dataTable.reduce((sum, cur) => sum + (cur[columnName] || 0), 0);
  }

  setValidator() {
    if (this.formData.value.phanLoai === BAN_TRUC_TIEP.CHAO_GIA) {
      this.formData.controls["soHopDong"].setValidators([Validators.required]);
    }
    if (this.formData.value.phanLoai === BAN_TRUC_TIEP.UY_QUYEN_BAN_LE) {
      this.formData.controls["soQd"].setValidators([Validators.required]);
      this.formData.controls["listMaDviTsan"].setValidators([Validators.required]);
    }
  }
}
