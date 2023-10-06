import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {ActivatedRoute, Router} from "@angular/router";
import {BienBanKetThucNhapScService} from "../../../../../../../services/sua-chua/bienBanKetThucNhapSc.service";
import {QuyetDinhNhService} from "../../../../../../../services/sua-chua/quyetDinhNh.service";
import {DanhMucDungChungService} from "../../../../../../../services/danh-muc-dung-chung.service";
import {DanhSachSuaChuaService} from "../../../../../../../services/sua-chua/DanhSachSuaChua.service";
import dayjs from "dayjs";
import {Validators} from "@angular/forms";
import {MESSAGE} from "../../../../../../../constants/message";
import {
  DialogTableSelectionComponent
} from "../../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import {STATUS} from "../../../../../../../constants/status";
import {convertTienTobangChu} from "../../../../../../../shared/commonFunction";
import {Base3Component} from "../../../../../../../components/base3/base3.component";
import { cloneDeep } from 'lodash';
import {
  QuyetDinhGiaoNhiemVuThanhLyService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/QuyetDinhGiaoNhiemVuThanhLy.service";
import {
  BienBanTinhKhoThanhLyService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/BienBanTinhKhoThanhLy.service";
import {
  BienBanHaoDoiThanhLyService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/BienBanHaoDoiThanhLy.service";

@Component({
  selector: 'app-xtl-them-bb-hao-doi',
  templateUrl: './xtl-them-bb-hao-doi.component.html',
  styleUrls: ['./xtl-them-bb-hao-doi.component.scss']
})
export class XtlThemBbHaoDoiComponent extends Base3Component implements OnInit {

  fileCanCu: any[] = []
  rowItem: any = {};
  phanLoai : string;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private _service : BienBanHaoDoiThanhLyService,
    private quyetDinhNhService: QuyetDinhNhService,
    private danhMucService: DanhMucDungChungService,
    private danhSachSuaChuaService: DanhSachSuaChuaService,
    private quyetDinhGiaoNhiemVuThanhLyService : QuyetDinhGiaoNhiemVuThanhLyService,
    private bienBanTinhKhoThanhLyService : BienBanTinhKhoThanhLyService,

  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, _service);
    this.formData = this.fb.group({
      id: [],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      nam: [dayjs().year(), [Validators.required]],
      tenDvi: ['', [Validators.required]],
      maQhns: [''],
      soBbHaoDoi: ['', [Validators.required]],
      ngayLapBienBan: [''],
      soQdXh: ['', [Validators.required]],
      idQdXh: ['', [Validators.required]],
      idBbTinhKho : ['', [Validators.required]],
      soBbTinhKho : ['', [Validators.required]],
      ngayQdXh : ['',[Validators.required]],
      idDsHdr: ['', [Validators.required]],
      maDiaDiem: ['', [Validators.required]],
      tenDiemKho: ['', [Validators.required]],
      tenNhaKho: ['', [Validators.required]],
      tenNganKho: ['', [Validators.required]],
      tenLoKho: ['', [Validators.required]],
      loaiVthh: ['',[Validators.required]],
      tenLoaiVthh: ['',[Validators.required]],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      donViTinh : [''],
      tenKtv: [''],
      tenKt: [''],
      tenThuKho: [''],
      tenLdcc: [''],
      ngayKetThucXuat: [''],
      ngayBatDauXuat: [''],
      idPhieuKtcl : [],
      soPhieuKtcl : [],
      ghiChu: [''],
      slQuyetDinh: [''],
      slThucTe: [''],
      slConLai: [''],
      slTteConLaiKhiXk: [''],
      slThua: [''],
      slThieu: [''],
      nguyenNhan: [''],
      kienNghi: [''],
      lyDoTuChoi: [''],
    })
    router.events.subscribe((val) => {
      let routerUrl = this.router.url;
      const urlList = routerUrl.split("/");
      this.phanLoai = urlList[4] == 'xuat-kho-lt' ? 'LT' : 'VT'
      this.defaultURL  = 'xuat/xuat-thanh-ly/xuat-hang/' + urlList[4] + '/xtl-bb-hao-doi';
    })
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
          console.log(res);
          this.bindingDataBbTinhKho(res.idBbTinhKho);
        }
      })
    } else {
      await this.userService.getId("XH_TL_HAO_DOI_HDR_SEQ").then((res) => {
        this.formData.patchValue({
          soBbHaoDoi: res + '/' + this.formData.value.nam + '/BBHD',
          maQhns: this.userInfo.DON_VI.maQhns,
          tenDvi: this.userInfo.TEN_DVI,
          ngayLapBienBan: dayjs().format('YYYY-MM-DD'),
          ngayKetThucXuat: dayjs().format('YYYY-MM-DD'),
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

  openDialogBbTinhKho() {
    if (!this.formData.value.idQdXh) {
      this.notification.error(MESSAGE.ERROR, "Vui lòng chọn số quyết định giao nhiệm vụ nhập hàng");
      return;
    }
    if (this.disabled()) {
      return;
    }
    this.spinner.show();
    let body = {
      idQdXh : this.formData.value.idQdXh,
      trangThai : this.STATUS.DA_DUYET_LDCC
    }
    this.bienBanTinhKhoThanhLyService.getDsTaoBbTinhKho(body).then((res) => {
      this.spinner.hide();
      console.log(res)
      // const data = res.data;
      //
      const modalQD = this.modal.create({
        nzTitle: 'Danh sách biên bản tịnh kho',
        nzContent: DialogTableSelectionComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '1200px',
        nzFooter: null,
        nzComponentParams: {
          dataTable: res.data,
          dataHeader: ['Số biên bản tịnh kho',],
          dataColumn: ['soBbTinhKho']
        },
      });
      modalQD.afterClose.subscribe(async (data) => {
        if (data) {
          this.bindingDataBbTinhKho(data.id);
          this.spinner.hide();
        }
      });
    })
  }

  bindingDataBbTinhKho(idBbTinhKho){
      this.bienBanTinhKhoThanhLyService.getDetail(idBbTinhKho).then((res)=>{
        const data = res.data;
        this.formData.patchValue({
          soBbTinhKho : data.soBbTinhKho,
          idBbTinhKho : data.id,
          idDsHdr: data.idDsHdr,
          maDiaDiem: data.maDiaDiem,
          tenDiemKho: data.tenDiemKho,
          tenNhaKho: data.tenNhaKho,
          tenNganKho: data.tenNganKho,
          tenLoKho: data.tenLoKho,
          loaiVthh: data.loaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          cloaiVthh: data.cloaiVthh,
          tenCloaiVthh: data.tenCloaiVthh,
          donViTinh: data.donViTinh,
        });
        this.dataTable = data.children;
      });
  }

  showSave() {
    let trangThai = this.formData.value.trangThai;
    return (trangThai == STATUS.DU_THAO || trangThai == STATUS.TU_CHOI_KTVBQ
      || trangThai == STATUS.TU_CHOI_KT || trangThai == STATUS.TU_CHOI_LDCC);
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
    body.fileCanCuReq = this.fileCanCu;
    body.children = this.dataTable;
    body.daiDienList = this.dataTableAll;
    console.log(body)
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
      case STATUS.TU_CHOI_KTVBQ:
      case STATUS.TU_CHOI_KT:
      case STATUS.TU_CHOI_LDCC:
      case STATUS.DU_THAO:
        trangThai = STATUS.CHO_DUYET_KTVBQ;
        break;
      case STATUS.CHO_DUYET_KTVBQ:
        trangThai = STATUS.CHO_DUYET_KT;
        break;
      case STATUS.CHO_DUYET_KT:
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
      case STATUS.CHO_DUYET_KTVBQ:
        trangThai = STATUS.TU_CHOI_KTVBQ;
        break;
      case STATUS.CHO_DUYET_KT:
        trangThai = STATUS.TU_CHOI_KT;
        break;
      case STATUS.CHO_DUYET_LDCC:
        trangThai = STATUS.TU_CHOI_LDCC;
        break;
    }
    this.reject(this.id, trangThai);
  }

  disabled() {
    let trangThai = this.formData.value.trangThai;
    return !(trangThai == STATUS.DU_THAO || trangThai == STATUS.TU_CHOI_KTVBQ
      || trangThai == STATUS.TU_CHOI_KT || trangThai == STATUS.TU_CHOI_LDCC);
  }

  showPheDuyetTuChoi() {
    let trangThai = this.formData.value.trangThai;
    return (trangThai == STATUS.CHO_DUYET_LDCC )
      || (trangThai == STATUS.CHO_DUYET_KTVBQ )
      || (trangThai == STATUS.CHO_DUYET_KT);
  }

  addRow() {
    let dataRow = cloneDeep(this.rowItem);
    this.rowItem = {};
    this.dataTableAll.push(dataRow);
  }

  deleteRow(i: number): void {
    this.dataTableAll = this.dataTableAll.filter((d, index) => index !== i);
  }

  calTongSoLuong() {
    if (this.dataTable) {
      let sum = 0
      this.dataTable.forEach(item => {
        sum += this.nvl(item.slXuat);
      })
      return sum;
    }
  }


  convertTien(tien: number): string {
    if (tien) {
      return convertTienTobangChu(tien);
    }
  }

}
