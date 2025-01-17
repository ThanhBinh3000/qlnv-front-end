import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {
  QdPdKetQuaBttService
} from "../../../../../../services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/qd-pd-ket-qua-btt.service";
import {
  ChaoGiaMuaLeUyQuyenService
} from "../../../../../../services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/chao-gia-mua-le-uy-quyen.service";
import {FileDinhKem} from "../../../../../../models/DeXuatKeHoachBanTrucTiep";
import {MESSAGE} from "../../../../../../constants/message";
import {STATUS} from "../../../../../../constants/status";
import * as dayjs from "dayjs";
import {
  DialogTableSelectionComponent
} from "../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import {Validators} from "@angular/forms";
import {saveAs} from 'file-saver';
import {LOAI_HANG_DTQG} from 'src/app/constants/config';

@Component({
  selector: 'app-chi-tiet-quyet-dinh-chao-gia',
  templateUrl: './chi-tiet-quyet-dinh-chao-gia.component.html',
  styleUrls: ['./chi-tiet-quyet-dinh-chao-gia.component.scss']
})
export class ChiTietQuyetDinhChaoGiaComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() isView: boolean;
  @Input() idInput: number;
  @Input() isViewOnModal: boolean;
  @Input() checkPrice: any;
  @Output() showListEvent = new EventEmitter<any>();
  LOAI_HANG_DTQG = LOAI_HANG_DTQG;
  templateNameVt = "Quyết định kết quả chào giá vật tư";
  templateNameLt = "Quyết định kết quả chào giá lương thực";
  maHauTo: any;
  listOfData: any[] = [];
  showFromTT: boolean = false;
  luaChon: boolean = false;
  loadQuyetDinhKetQua: any[] = [];
  dataThongTinChaoGia: any[] = [];

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private qdPdKetQuaBttService: QdPdKetQuaBttService,
    private chaoGiaMuaLeUyQuyenService: ChaoGiaMuaLeUyQuyenService
  ) {
    super(httpClient, storageService, notification, spinner, modal, qdPdKetQuaBttService);
    this.formData = this.fb.group({
      id: [],
      namKh: [],
      soQdKq: [''],
      ngayKy: [''],
      ngayHluc: [''],
      idQdPd: [],
      soQdPd: [''],
      idQdDc: [],
      soQdDc: [''],
      idChaoGia: [],
      loaiHinhNx: [''],
      kieuNx: [''],
      trichYeu: [''],
      maDvi: [''],
      diaDiemChaoGia: [''],
      ngayMkho: [''],
      ngayKthuc: [''],
      loaiVthh: [''],
      cloaiVthh: [''],
      moTaHangHoa: [''],
      ghiChu: [''],
      slHdDaKy: [],
      slHdChuaKy: [],
      tongSoLuong: [],
      tongGiaTriHdong: [],
      trangThai: [''],
      tenTrangThai: [''],
      lyDoTuChoi: [''],
      tenDvi: [''],
      tenLoaiHinhNx: [''],
      tenKieuNx: [''],
      tenLoaiVthh: [''],
      tenCloaiVthh: [''],
      donViTinh: [''],
      fileCanCu: [new Array<FileDinhKem>()],
      fileDaKy: [new Array<FileDinhKem>()],
    });
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
    } catch (e) {
      console.error('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  initForm() {
    this.formData.patchValue({
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự thảo',
      namKh: dayjs().get('year'),
    });
  }

  async getDetail(idInput) {
    if (!idInput) {
      return;
    }
    const data = await this.detail(idInput);
    this.formData.patchValue({
      soQdKq: data.soQdKq?.split('/')[0] || null,
    });
    if (data.idChaoGia) {
      const resChaoGia = await this.chaoGiaMuaLeUyQuyenService.getDetail(data.idChaoGia);
      this.dataTable = resChaoGia.data.children.map(item => {
        return {...item, expandSetAll: true};
      });
    }
    if (this.dataTable && this.dataTable.length > 0) {
      await this.selectRow(this.dataTable.flatMap(item => item.children)[0]);
    }
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
        soQdKq: this.formData.value.soQdKq ? this.formData.value.soQdKq + this.maHauTo : null,
        children: this.dataTable.flatMap(item => item.children.flatMap(child => child.children)),
      };
      switch (action) {
        case "createUpdate":
          this.formData.controls["soQdPd"].setValidators([Validators.required]);
          await this.createUpdate(body);
          break;
        case "saveAndSend":
          this.setValidForm();
          if (!this.validateSoLuong()) {
            return;
          }
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

  validateSoLuong() {
    for (let decision of this.dataTable) {
      for (let item of decision.children) {
        let tongLuongDaChon = 0;
        let giaCaoNhat = 0;
        let toChucLuaChon = null;
        for (let child of item.children) {
          if (child.luaChon) {
            tongLuongDaChon += child.soLuong;
            if (child.donGia > giaCaoNhat) {
              giaCaoNhat = child.donGia;
              toChucLuaChon = child.tochucCanhan;
            }
          }
        }
        if (tongLuongDaChon > item.soLuongDeXuat) {
          this.notification.error(MESSAGE.ERROR, `Tổng lượng đã chọn cho mục ${item.tenDiemKho} với mã phần hàng là ${item.maDviTsan} vượt quá lượng đề xuất.`);
          return false;
        }
        if (toChucLuaChon === null) {
          this.notification.error(MESSAGE.ERROR, `Không có tổ chức hoặc cá nhân nào được chọn cho mục ${item.tenDiemKho} với mã phần hàng là ${item.maDviTsan}.`);
          return false;
        }
      }
    }
    return true;
  }

  async openThongtinChaoGia() {
    try {
      this.spinner.show();
      const body = {
        namKh: this.formData.value.namKh,
        loaiVthh: this.loaiVthh,
        trangThai: STATUS.DA_HOAN_THANH,
        pthucBanTrucTiep: ['01'],
        lastest: 1,
      };
      await this.loadQdNvXuatHang();
      const res = await this.chaoGiaMuaLeUyQuyenService.search(body);
      if (res && res.msg === MESSAGE.SUCCESS) {
        const set = new Set(this.loadQuyetDinhKetQua.map(item => item.idChaoGia));
        this.dataThongTinChaoGia = res.data.content
          .filter(item => !set.has(item.id))
          .map(item => ({
            ...item,
            soQd: item.soQdDc || item.soQdPd
          }));
      }
      const modalQD = this.modal.create({
        nzTitle: 'DANH SÁCH THÔNG TIN CHÀO GIÁ',
        nzContent: DialogTableSelectionComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          dataTable: this.dataThongTinChaoGia,
          dataHeader: ['Số QĐ phê duyệt/điều chỉnh KH BTT', 'Số Đề xuất KH BTT', 'Loại hàng hóa'],
          dataColumn: ['soQd', 'soDxuat', 'tenLoaiVthh']
        },
      });
      modalQD.afterClose.subscribe(async (data) => {
        if (data) {
          await this.onChangeTtin(data.id);
        }
      });
    } catch (e) {
      console.error('Error: ', e);
    } finally {
      await this.spinner.hide();
    }
  }

  async loadQdNvXuatHang() {
    let body = {
      namKh: this.formData.value.namKh,
      loaiVthh: this.loaiVthh,
    };
    const res = await this.qdPdKetQuaBttService.search(body);
    if (res.msg !== MESSAGE.SUCCESS) {
      this.notification.error(MESSAGE.ERROR, res.msg);
      return;
    }
    const data = res.data.content;
    if (!data || data.length === 0) {
      return;
    }
    this.loadQuyetDinhKetQua = data
  }

  async onChangeTtin(id) {
    if (id <= 0) {
      return;
    }
    try {
      await this.spinner.show();
      const res = await this.chaoGiaMuaLeUyQuyenService.getDetail(id);
      if (res.msg !== MESSAGE.SUCCESS || !res.data) {
        return;
      }
      const data = res.data;
      this.formData.patchValue({
        idQdPd: data.xhQdPdKhBttHdr.type === 'QDDC' ? data.xhQdPdKhBttHdr.idQdPd : data.idHdr,
        soQdPd: data.soQdPd,
        idQdDc: data.xhQdPdKhBttHdr.type === 'QDDC' ? data.idHdr : null,
        soQdDc: data.soQdDc,
        idChaoGia: data.id,
        tenDvi: data.tenDvi,
        diaDiemChaoGia: data.diaDiemChaoGia,
        ngayMkho: data.tgianDkienTu,
        ngayKthuc: data.tgianDkienDen,
        loaiVthh: data.loaiVthh,
        tenLoaiVthh: data.tenLoaiVthh,
        cloaiVthh: data.cloaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        moTaHangHoa: data.moTaHangHoa,
        pthucBanTrucTiep: data.pthucBanTrucTiep,
        loaiHinhNx: data.loaiHinhNx,
        tenLoaiHinhNx: data.tenLoaiHinhNx,
        kieuNx: data.kieuNx,
        tenKieuNx: data.tenKieuNx,
        tongSoLuong: data.tongSoLuong,
        tongGiaTriHdong: data.thanhTienDuocDuyet,
        donViTinh: data.donViTinh,
      });
      this.dataTable = data.children.filter(item => item.children && item.children.length > 0).map(item => {
        return {...item, expandSetAll: true};
      });
      if (this.dataTable && this.dataTable.length > 0) {
        await this.selectRow(this.dataTable.flatMap(item => item.children)[0]);
      }
    } catch (e) {
      console.error('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  downloadFile(item: FileDinhKem) {
    this.uploadFileService.downloadFile(item.fileUrl)
      .subscribe((blob) => {
        saveAs(blob, item.fileName);
      }, (error) => {
        console.error('Error while downloading file:', error);
      });
  }

  async selectRow(data: any) {
    this.dataTableAll = this.dataTable.flatMap(item => item.children);
    if (!data.selected) {
      this.dataTableAll.forEach(item => item.selected = false);
      data.selected = true;
      const findndex = this.dataTableAll.findIndex(child => child.maDviTsan === data.maDviTsan
        && child.maDiemKho === data.maDiemKho
        && child.maNhaKho === data.maNhaKho
        && child.maNgankho === data.maNgankho
        && child.maLoKho === data.maLoKho);
      this.listOfData = this.dataTableAll[findndex].children;
      this.showFromTT = true;
    }
  }

  setValidForm() {
    const fieldsToValidate = [
      "soQdKq",
      "soQdPd",
      "ngayMkho",
      "ngayKthuc",
    ];
    fieldsToValidate.forEach(field => {
      this.formData.controls[field].setValidators([Validators.required]);
    });
  }
}
