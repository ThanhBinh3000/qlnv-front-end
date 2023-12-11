import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {DonviService} from "../../../../../../services/donvi.service";
import dayjs from "dayjs";
import {STATUS} from "../../../../../../constants/status";
import {FileDinhKem} from "../../../../../../models/DeXuatKeHoachuaChonNhaThau";
import {MESSAGE} from "../../../../../../constants/message";
import {
  DialogTableSelectionComponent
} from "../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import * as uuid from "uuid";
import {chain} from "lodash";
import {
  QuyetDinhGiaoNhiemVuThanhLyService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/QuyetDinhGiaoNhiemVuThanhLy.service";
import {
  HopDongThanhLyService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/HopDongThanhLy.service";
import {Base3Component} from "../../../../../../components/base3/base3.component";
import {ActivatedRoute, Router} from "@angular/router";
import {Validators} from "@angular/forms";

@Component({
  selector: 'app-chi-tiet-quyet-dinh-giao-nhiem-vu-thanh-ly',
  templateUrl: './chi-tiet-quyet-dinh-giao-nhiem-vu-thanh-ly.component.html',
  styleUrls: ['./chi-tiet-quyet-dinh-giao-nhiem-vu-thanh-ly.component.scss']
})
export class ChiTietQuyetDinhGiaoNhiemVuThanhLyComponent extends Base3Component implements OnInit {

  maHauTo: any;

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private danhMucService: DanhMucService,
    private donViService: DonviService,
    private _service: QuyetDinhGiaoNhiemVuThanhLyService,
    private hopDongThanhLyService: HopDongThanhLyService,
  ) {
    super(httpClient, storageService, notification, spinner, modal,route,router, _service);
    this.defaultURL = '/xuat/xuat-thanh-ly/to-chuc/qd-giao-nv-xh'
    this.formData = this.fb.group({
      id: [],
      nam: [dayjs().get('year')],
      maDvi: [''],
      tenDvi: [''],
      soBbQd: ['',[Validators.required]],
      ngayKy: ['',[Validators.required]],
      idHopDong: ['',[Validators.required]],
      soHopDong: ['',[Validators.required]],
      maDviTsan: [''],
      toChucCaNhan: [''],
      thoiGianGiaoNhan: [''],
      loaiHinhNx: [''],
      tenLoaiHinhNx: [''],
      kieuNx: [''],
      tenKieuNx: [''],
      trichYeu: [''],
      lyDoTuChoi: [''],
      trangThai: [''],
      tenTrangThai: [''],
    });
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.maHauTo = '/QĐ-' + this.userInfo.DON_VI.tenVietTat;
      this.getId();
      await this.initForm()
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
  }

  async initForm() {
    if(this.id){
      await this.detail(this.id).then((res)=>{
        console.log(res);
        this.formData.patchValue({
          soBbQd: res?.soBbQd?.split('/')[0],
        });
        this.dataTable = res.children;
        this.buildTableView();
      })
    }else{
      this.formData.patchValue({
        maDvi: this.userInfo.MA_DVI ?? null,
        tenDvi: this.userInfo.TEN_DVI ?? null,
        trangThai: STATUS.DU_THAO,
        tenTrangThai: 'Dự thảo',
      })
    }
  }

  async openDialogHopDong() {
    await this.spinner.show();
    let dataHopDong = [];
    let body = {
      trangThai: STATUS.DA_KY,
      nam: this.formData.value.nam,
    }
    let res = await this.hopDongThanhLyService.searchDsTaoQdGiaoNvXh(body);
    if (res.msg == MESSAGE.SUCCESS) {
      dataHopDong = res.data
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH CĂN CỨ TRÊN HỢP ĐỒNG',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: dataHopDong,
        dataHeader: ['Số hợp đồng', 'Tên hợp đồng'],
        dataColumn: ['soHd', 'tenHd']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.loadDtailHopDong(data.id);
      }
    });
    await this.spinner.hide();
  }

  async loadDtailHopDong(idHd: number) {
    await this.spinner.show();
    if (idHd > 0) {
      await this.hopDongThanhLyService.getDetail(idHd)
        .then(async (res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const dataHd = res.data;
            console.log(dataHd);
            this.formData.patchValue({
              idHopDong: dataHd.id,
              soHopDong: dataHd.soHd,
              ngayKyHopDong: dataHd.ngayHieuLuc,
              maDviTsan: dataHd.maDviTsan,
              toChucCaNhan: dataHd.toChucCaNhan,
              thoiGianGiaoNhan: dataHd.thoiHanXuatKho,
              loaiHinhNx: dataHd.loaiHinhNx,
              tenLoaiHinhNx: dataHd.tenLoaiHinhNx,
              kieuNx: dataHd.kieuNx,
              tenKieuNx: dataHd.tenKieuNx,
            });
            this.dataTable = dataHd.children;
            await this.buildTableView();
          }
        }).catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }
    await this.spinner.hide();
  }

  async buildTableView() {
    this.dataTableAll = chain(this.dataTable)
      .groupBy('xhTlDanhSachHdr.tenChiCuc').map((value, key) => ({
          expandSet: true,
          tenDonVi: key,
          children: value,
        })
      ).value();
    console.log(this.dataTableAll)
  }

  async save(isGuiDuyet?) {
    let body = {
      ...this.formData.value,
      soBbQd: this.formData.value.soBbQd ? this.formData.value.soBbQd + this.maHauTo : null
    }
    body.fileDinhKemReq = this.fileDinhKem;
    body.fileCanCuReq = this.fileCanCu;
    body.children = this.dataTable;
    let data = await this.createUpdate(body);
    if (data) {
      if (isGuiDuyet) {
        this.formData.patchValue({
          id : data.id
        })
        this.pheDuyet();
      } else {
        this.redirectDefault()
      }
    }
  }

  async loadChiTiet(idInput: number) {
    if (idInput > 0) {
      await this._service.getDetail(idInput)
        .then(async (res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            if (res.data.soBbQd) {
              this.maHauTo = '/' + res.data.soBbQd?.split("/")[1];
              res.data.soBbQd = res.data.soBbQd?.split("/")[0];
            }
            this.fileCanCu = res.data.fileCanCu;
            this.fileDinhKem = res.data.fileDinhKem;
            this.formData.patchValue(res.data);
            this.formData.value.quyetDinhDtl.forEach(s => {
              s.idVirtual = uuid.v4()
            });
            await this.buildTableView();
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }
  }

  isDisabled() {
    if (this.formData.value.trangThai == STATUS.CHO_DUYET_TP || this.formData.value.trangThai == STATUS.CHO_DUYET_LDC || this.formData.value.trangThai == STATUS.DA_DUYET_LDC || this.formData.value.trangThai == STATUS.BAN_HANH) {
      return true
    } else {
      return false;
    }
  }

  showPheDuyetTuChoi() {
    let trangThai = this.formData.value.trangThai;
    if (this.userService.isCuc()) {
      return (trangThai == STATUS.CHO_DUYET_TP && this.userService.isAccessPermisson('XHDTQG_XTL_HSTL_DUYETTP'))
        || (trangThai == STATUS.CHO_DUYET_LDC && this.userService.isAccessPermisson('XHDTQG_XTL_HSTL_DUYETLDC'));
    }
    if (this.userService.isTongCuc()) {
      return (trangThai == STATUS.CHO_DUYET_LDV && this.userService.isAccessPermisson('XHDTQG_XTL_HSTL_DUYETLDV'))
        || (trangThai == STATUS.CHO_DUYET_LDTC && this.userService.isAccessPermisson('XHDTQG_XTL_HSTL_DUYETLDTC'))
        || (trangThai == STATUS.CHODUYET_BTC && this.userService.isAccessPermisson('XHDTQG_XTL_HSTL_DUYETBTC'));
    }
    return false
  }

  pheDuyet() {
    let trangThai
    switch (this.formData.value.trangThai) {
      //Reject
      case STATUS.TU_CHOI_TP:
      case STATUS.TU_CHOI_LDC:
      // Approve
      case STATUS.DU_THAO:
        trangThai = STATUS.CHO_DUYET_TP;
        break;
      case STATUS.CHO_DUYET_TP:
        trangThai = STATUS.CHO_DUYET_LDC;
        break;
      case STATUS.CHO_DUYET_LDC:
        trangThai = STATUS.BAN_HANH;
        break;
    }
    this.approve(this.formData.value.id, trangThai, 'Bạn có muốn gửi duyệt', null, 'Phê duyệt thành công');
  }

  tuChoi() {
    let trangThai
    switch (this.formData.value.trangThai) {
      case STATUS.CHO_DUYET_TP:
        trangThai = STATUS.TU_CHOI_TP;
        break;
      case STATUS.CHO_DUYET_LDC:
        trangThai = STATUS.TU_CHOI_LDC;
        break;
    }
    this.reject(this.formData.value.id, trangThai);
  }

  showSave(){
    let trangThai = this.formData.value.trangThai;
    return trangThai == STATUS.DU_THAO || trangThai == STATUS.TU_CHOI_TP || trangThai == STATUS.TU_CHOI_LDCC
  }
}
