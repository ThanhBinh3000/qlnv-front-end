import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {ActivatedRoute, Router} from "@angular/router";
import {PhieuXuatKhoScService} from "../../../../../../../services/sua-chua/phieuXuatKhoSc.service";
import {QuyetDinhXhService} from "../../../../../../../services/sua-chua/quyetDinhXh.service";
import dayjs from "dayjs";
import {Validators} from "@angular/forms";
import {
  DialogTableSelectionComponent
} from "../../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import {STATUS} from "../../../../../../../constants/status";
import {MESSAGE} from "../../../../../../../constants/message";
import {convertTienTobangChu} from "../../../../../../../shared/commonFunction";
import {Base3Component} from "../../../../../../../components/base3/base3.component";
import { cloneDeep } from 'lodash';
import {
  PhieuKtraClThanhLyService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/PhieuKtraClThanhLy.service";
import {
  PhieuXuatKhoThanhLyService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/PhieuXuatKhoThanhLy.service";
import {
  QuyetDinhGiaoNhiemVuThanhLyService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/QuyetDinhGiaoNhiemVuThanhLy.service";
@Component({
  selector: 'app-xtl-them-phieu-xk',
  templateUrl: './xtl-them-phieu-xk.component.html',
  styleUrls: ['./xtl-them-phieu-xk.component.scss']
})
export class XtlThemPhieuXkComponent extends Base3Component implements OnInit {
  dataTableDiaDiem: any[] = [];
  rowItem: any = {};
  symbol: string = ''
  phanLoai : string;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private _service: PhieuXuatKhoThanhLyService,
    private quyetDinhXhService: QuyetDinhXhService,
    private phieuKtraClThanhLyService : PhieuKtraClThanhLyService,
    private quyetDinhGiaoNhiemVuThanhLyService : QuyetDinhGiaoNhiemVuThanhLyService
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, _service);
    router.events.subscribe((val) => {
      let routerUrl = this.router.url;
      const urlList = routerUrl.split("/");
      this.defaultURL  = 'xuat/xuat-thanh-ly/xuat-hang/' + urlList[4] + '/xtl-phieu-xk';
      this.phanLoai = urlList[4] == 'xuat-kho-lt' ? 'LT' : 'VT'
    })
    this.previewName = 'sc_phieu_xuat_kho'
    this.getId();
    this.formData = this.fb.group({
      id: [],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      nam: [dayjs().year(), [Validators.required]],
      tenDvi: ['', [Validators.required]],
      maQhns: [''],
      soPhieuXuatKho: ['', [Validators.required]],
      ngayTao: [''],
      ngayXuatKho: [''],
      soNo: [''],
      soCo: [''],
      soQdXh: ['', [Validators.required]],
      idQdXh: ['', [Validators.required]],
      ngayQdXh: ['', [Validators.required]],
      soPhieuKtcl: ['', [Validators.required]],
      idPhieuKtcl: ['', [Validators.required]],
      idDsHdr: ['', [Validators.required]],
      maDiaDiem: ['', [Validators.required]],
      tenDiemKho: ['', [Validators.required]],
      tenNhaKho: ['', [Validators.required]],
      tenNganKho: ['', [Validators.required]],
      tenLoKho: [''],
      loaiVthh: ['',[Validators.required]],
      tenLoaiVthh: ['',[Validators.required]],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      donViTinh: [''],
      tenThuKho: [''],
      tenLanhDaoCc: [''],
      idKtv : [''],
      tenKtv : [''],
      keToanTruong: [''],
      nguoiGiaoHang: ['',[Validators.required]],
      soCmt: ['',[Validators.required]],
      dviNguoiGiaoHang: ['',[Validators.required]],
      diaChi: ['',[Validators.required]],
      thoiGianGiaoNhan: ['',[Validators.required]],
      tenLoaiHinhNx : ['Xuất thanh lý'],
      loaiHinhNx : ['6'],
      tenKieuNx : ['Xuất bán'],
      kieuNx : ['03'],
      soBangKeCanHang: [''],
      ghiChu: [''],
      tongSoLuong: [''],
      lyDoTuChoi: ['']
    });
    this.symbol = '/PXK-' + this.userInfo.DON_VI.tenVietTat;
  }

  async ngOnInit() {
    this.spinner.show();
    await Promise.all([
      this.getId(),
      await this.initForm()
    ]);
    this.spinner.hide();
  }

  async initForm() {
    this.spinner.show();
    if (this.id) {
      await this.detail(this.id).then((res) => {
        if (res) {
          let data = res.children[0];
          this.rowItem = {
            donViTinh: data.donViTinh,
            tenMatHang: data.tenMatHang,
            duToanKinhPhi: data.duToanKinhPhi
          }
          this.dataTable = res.children;
        }
      })
    } else {
      await this.userService.getId("XH_TL_PHIEU_XUAT_KHO_HDR_SEQ").then((res) => {
        console.log(this.userInfo);
        this.formData.patchValue({
          soPhieuXuatKho: res + '/' + this.formData.value.nam + this.symbol,
          maQhns: this.userInfo.DON_VI.maQhns,
          tenDvi: this.userInfo.TEN_DVI,
          ngayTao: dayjs().format('YYYY-MM-DD'),
          ngayXuatKho: dayjs().format('YYYY-MM-DD'),
          tenThuKho: this.userInfo.TEN_DAY_DU
        })
      });
    }
  }

  openDialogQdGiaoNvxh() {
    if (this.disabled()) {
      return;
    }
    let body = {
      trangThai : STATUS.BAN_HANH,
      nam : this.formData.value.nam,
      phanLoai : this.phanLoai
    }
    this.spinner.show();
    this.quyetDinhGiaoNhiemVuThanhLyService.getAll(body).then((res) => {
      this.spinner.hide();
      if (res.data) {
        const modalQD = this.modal.create({
          nzTitle: 'Danh sách quyết định giao nhiệm vụ xuất hàng',
          nzContent: DialogTableSelectionComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzWidth: '900px',
          nzFooter: null,
          nzComponentParams: {
            dataTable: res.data,
            dataHeader: ['Số quyết định xuất hàng'],
            dataColumn: ['soBbQd']
          },
        });
        modalQD.afterClose.subscribe(async (data) => {
          if (data) {
            this.formData.patchValue({
              idQdXh : data.id,
              soQdXh : data.soBbQd,
              ngayQdXh: data.ngayKy
            })
          }
        });
      }
    })
  }

  openDialogKtraCluong() {
    if (!this.formData.value.idQdXh) {
      this.notification.error(MESSAGE.ERROR, "Vui lòng chọn số quyết định giao nhiệm vụ xuất hàng");
      return;
    }
    if (this.disabled()) {
      return;
    }
    this.spinner.show();
    let body = {
      idQdXh: this.formData.value.idQdXh,
      trangThai : STATUS.DA_DUYET_LDC,
      phanLoai : this.phanLoai
    }
    this.phieuKtraClThanhLyService.getDanhSachTaoPxk(body).then((res) => {
      this.spinner.hide();
      if (res.data) {
        const modalQD = this.modal.create({
          nzTitle: 'Danh sách phiếu kiểm tra chất lượng',
          nzContent: DialogTableSelectionComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzWidth: '900px',
          nzFooter: null,
          nzComponentParams: {
            dataTable: res.data,
            dataHeader: ['Số phiếu kiếm nghiệm chất lượng', 'Ngày kiểm nghiệm','Ghi chú'],
            dataColumn: ['soPhieuKtcl', 'ngayKnghiem','ghiChu']
          },
        });
        modalQD.afterClose.subscribe(async (data) => {
          if (data) {
            await this.bindingDataPhieuKtraCl(data.id)
          }
        });
      }
    })
  }

  async bindingDataPhieuKtraCl(idPhieuKtraCl){
    await this.phieuKtraClThanhLyService.getDetail(idPhieuKtraCl).then((res)=>{
      if(res.data){
        const data = res.data;
        this.formData.patchValue({
          idPhieuKtcl : data.id,
          soPhieuKtcl : data.soPhieuKtcl,
          maDiaDiem : data.maDiaDiem,
          idDsHdr : data.idDsHdr,
          tenDiemKho: data.tenDiemKho,
          tenNhaKho: data.tenNhaKho,
          tenNganKho: data.tenNganKho,
          tenLoKho: data.tenLoKho,
          loaiVthh : data.loaiVthh,
          cloaiVthh : data.cloaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          tenCloaiVthh: data.tenCloaiVthh,
          dviTinh : data.dviTinh,
          idKtv : data.idNguoiKnghiem,
          tenKtv : data.tenNguoiKnghiem
        });
        this.rowItem = {
          tenMatHang : data.tenCloaiVthh ? data.tenCloaiVthh : data.tenLoaiVthh,
          // donViTinh : data.donViTinh,
          duToanKinhPhi : data.duToanKinhPhi
        }
      }
    })
  }

  showSave() {
    let trangThai = this.formData.value.trangThai;
    return (trangThai == STATUS.DU_THAO || trangThai == STATUS.TU_CHOI_LDCC);
  }

  save(isGuiDuyet?) {
    this.spinner.show();
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.info(MESSAGE.NOTIFICATION, MESSAGE.FORM_REQUIRED_ERROR);
      this.spinner.hide();
      return;
    }
    // if (this.formData.value.tongSoLuong == null || this.formData.value.tongSoLuong <= 0) {
    //   this.spinner.hide();
    //   this.notification.error(MESSAGE.ERROR, "Tổng số lượng xuất phải lớn hơn 0");
    //   return;
    // }
    let body = this.formData.value;
    body.fileDinhKemReq = this.fileDinhKem;
    body.children = this.dataTable;
    this.createUpdate(body).then((res) => {
      if (res) {
        if (isGuiDuyet) {
          this.id = res.id;
          this.pheDuyet();
        } else {
          this.redirectDefault();
        }
      }
    })
  }

  pheDuyet() {
    let trangThai
    switch (this.formData.value.trangThai) {
      case STATUS.TU_CHOI_LDCC:
      case STATUS.DU_THAO:
        trangThai = STATUS.CHO_DUYET_LDCC;
        break;
      case STATUS.CHO_DUYET_LDCC:
        trangThai = STATUS.DA_DUYET_LDCC;
        break;
    }
    this.approve(this.id, trangThai, 'Bạn có muốn gửi duyệt', null, 'Phê duyệt thành công');
  }

  tuChoi() {
    let trangThai
    switch (this.formData.value.trangThai) {
      case STATUS.CHO_DUYET_LDCC:
        trangThai = STATUS.TU_CHOI_LDCC;
        break;
    }
    this.reject(this.id, trangThai);
  }

  disabled() {
    let trangThai = this.formData.value.trangThai;
    return !(trangThai == STATUS.DU_THAO || trangThai == STATUS.TU_CHOI_LDCC);
  }

  showPheDuyetTuChoi() {
    let trangThai = this.formData.value.trangThai;
    return trangThai == STATUS.CHO_DUYET_LDCC;
  }

  addRow() {
    // if (this.validateRow()) {
      let dataRow = cloneDeep(this.rowItem);
      this.dataTable.push(dataRow);
      this.rowItem.slXuatThucTe = 0;
      this.rowItem.maSo = null;
      this.rowItem.kinhPhiThucTe = null;
      this.formData.patchValue({
        tongSoLuong: this.calTongSlThucTe()
      })
    // }
  }

  deleteRow(i: number): void {
    this.dataTable = this.dataTable.filter((d, index) => index !== i);
  }

  validateRow(): boolean {
    if (this.rowItem.slThucTe && this.rowItem.maSo && this.rowItem.slDaDuyet) {
      if (this.dataTable.filter(i => i.maSo == this.rowItem.maSo).length > 0) {
        this.notification.error(MESSAGE.ERROR, "Mã số đã tồn tại");
        return false
      }
      if (this.rowItem.slThucTe <= 0) {
        this.notification.error(MESSAGE.ERROR, "Số lượng thực tế phải lớn hơn 0");
        return false
      }
      let tongSl = this.calTongSlThucTe();
      if (tongSl + this.rowItem.slThucTe > this.rowItem.slDaDuyet) {
        this.notification.error(MESSAGE.ERROR, "Số lượng thực tế không được lớn hơn số lượng phê duyệt");
        return false
      }
    } else {
      this.notification.error(MESSAGE.ERROR, "Vui lòng điền đủ thông tin");
      return false;
    }
    return true
  }

  calTongSlThucTe():number {
    if (this.dataTable) {
      let sum = 0
      this.dataTable.forEach(item => {
        sum += this.nvl(item.slXuatThucTe);
      })
      return sum;
    }
    return 0;
  }

  calTongSlKinhPhi():number {
    if (this.dataTable) {
      let sum = 0
      this.dataTable.forEach(item => {
        sum += this.nvl(item.kinhPhiThucTe);
      })
      return sum;
    }
    return 0;
  }

  convertTien(tien: number): string {
    if (tien) {
      return convertTienTobangChu(tien);
    }
  }

}
