import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { ActivatedRoute, Router } from "@angular/router";
import { BienBanKetThucNhapScService } from "../../../../services/sua-chua/bienBanKetThucNhapSc.service";
import { QuyetDinhNhService } from "../../../../services/sua-chua/quyetDinhNh.service";
import { DanhMucDungChungService } from "../../../../services/danh-muc-dung-chung.service";
import { DanhSachSuaChuaService } from "../../../../services/sua-chua/DanhSachSuaChua.service";
import dayjs from "dayjs";
import { Validators } from "@angular/forms";
import { MESSAGE } from "../../../../constants/message";
import {
  DialogTableSelectionComponent
} from "../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import { STATUS } from "../../../../constants/status";
import { convertTienTobangChu } from "../../../../shared/commonFunction";
import { cloneDeep, chain } from 'lodash';
import { Base3Component } from "../../../../components/base3/base3.component";
import { QuyetDinhXhService } from "../../../../services/sua-chua/quyetDinhXh.service";
import { BaoCaoScService } from "../../../../services/sua-chua/baoCaoSc.service";

@Component({
  selector: 'app-them-moi-bc',
  templateUrl: './them-moi-bc.component.html',
  styleUrls: ['./them-moi-bc.component.scss']
})
export class ThemMoiBcComponent extends Base3Component implements OnInit {

  symbol: string = ''

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private baoCaoScService: BaoCaoScService,
    private quyetDinhXhService: QuyetDinhXhService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, baoCaoScService);
    this.defaultURL = 'sua-chua/bao-cao'
    this.getId();
    this.formData = this.fb.group({
      id: [],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      nam: [dayjs().year(), [Validators.required]],
      tenDvi: ['', [Validators.required]],
      tenDviNhan: ['Vụ Quản lý Hàng dự trữ'],
      maDviNhan: ['010124'],
      soBaoCao: ['', [Validators.required]],
      ngayBaoCao: ['', [Validators.required]],
      tenBaoCao: ['', [Validators.required]],
      soQdXh: ['', [Validators.required]],
      idQdXh: ['', [Validators.required]],
      ngayQdXh: [''],
      soQdTc: ['', [Validators.required]],
      ngayQdTc: [''],
      noiDung: [''],
      lyDoTuChoi: ['']
    })
    this.symbol = '/' + this.userInfo.DON_VI.tenVietTat + '-KH&QLHDT';
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
          let soBc = res.soBaoCao.split('/')
          this.formData.patchValue({
            soBaoCao: soBc[0]
          })
          this.dataTableAll = []
          this.dataTable = res.children;
          this.dataTable.forEach(item => {
            let scDsHdr = item.scDanhSachHdr;
            scDsHdr.soLuongXuat = item.soLuongXuat;
            scDsHdr.soLuongNhap = item.soLuongNhap;
            scDsHdr.tongKinhPhiThucTe = item.tongKinhPhiThucTe;
            this.dataTableAll.push(scDsHdr)
          })
          this.dataTableView = chain(this.dataTableAll).groupBy('tenChiCuc').map((value, key) => ({
            tenDonVi: key,
            children: value,
          })
          ).value();
        }
      })
    } else {
      this.formData.patchValue({
        tenDvi: this.userInfo.TEN_DVI,
        ngayBaoCao: dayjs().format('YYYY-MM-DD'),
      })
    }
  }

  openDialogDanhSach() {
    if (this.disabled()) {
      return;
    }
    this.spinner.show();
    this.quyetDinhXhService.getDanhSachTaoBaoCao({}).then((res) => {
      this.spinner.hide();
      if (res.data) {
        console.log(res);
        res.data?.forEach(item => {
          item.ngayXuat = item.thoiHanNhap;
          item.ngayNhap = item.thoiHanXuat;
        })
        const modalQD = this.modal.create({
          nzTitle: 'Danh sách quyết định giao nhiệm vụ xuất hàng',
          nzContent: DialogTableSelectionComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzWidth: '900px',
          nzFooter: null,
          nzComponentParams: {
            dataTable: res.data,
            dataHeader: ['Số QĐ giao NV xuất hàng', 'Ngày ký QĐ'],
            dataColumn: ['soQd', 'ngayKy']
          },
        });
        modalQD.afterClose.subscribe(async (data) => {
          if (data) {
            this.bindingQdXh(data.id)
          }
        });
      }
    })
  }

  bindingQdXh(id) {
    this.quyetDinhXhService.getDetail(id).then((res) => {
      if (res.data) {
        console.log(res.data);
        const data = res.data
        this.formData.patchValue({
          soQdXh: data.soQd,
          idQdXh: data.id,
          ngayQdXh: data.ngayKy,
          soQdTc: data.soQdSc,
          ngayQdTc: data.ngayKyQdSc
        })
      }
    });
    this.spinner.show();
    this.quyetDinhXhService.getChiTietBaoCao(id).then((res) => {
      this.spinner.hide();
      if (res.data) {
        this.dataTable = res.data
        this.dataTable.forEach(item => {
          item.idDanhSachHdr = item.id;
        })
        this.dataTableView = chain(this.dataTable).groupBy('tenChiCuc').map((value, key) => ({
          tenDonVi: key,
          children: value,
        })
        ).value();
      }
    });
  }


  showSave() {
    let trangThai = this.formData.value.trangThai;
    return (trangThai == STATUS.DU_THAO || trangThai == STATUS.TU_CHOI_TP || trangThai == STATUS.TU_CHOI_LDC) && this.userService.isAccessPermisson('SCHDTQG_BC_THEM');
  }

  save(isGuiDuyet?) {
    this.spinner.show();
    let body = this.formData.value;
    if (this.formData.value.soBaoCao) {
      body.soBaoCao = this.formData.value.soBaoCao + this.symbol
    }
    body.fileDinhKemReq = this.fileDinhKem;
    body.children = this.dataTable;
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
      case STATUS.DU_THAO:
      case STATUS.TU_CHOI_TP:
      case STATUS.TU_CHOI_LDC:
        trangThai = STATUS.CHO_DUYET_TP;
        break;
      case STATUS.CHO_DUYET_TP:
        trangThai = STATUS.CHO_DUYET_LDC;
        break;
      case STATUS.CHO_DUYET_LDC:
        trangThai = STATUS.DA_DUYET_LDC;
        break;
    }
    this.approve(this.id, trangThai, 'Bạn có muốn gửi duyệt', null, 'Phê duyệt thành công');
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
    this.reject(this.id, trangThai);
  }

  disabled() {
    let trangThai = this.formData.value.trangThai;
    return !(trangThai == STATUS.DU_THAO || trangThai == STATUS.TU_CHOI_TP || trangThai == STATUS.TU_CHOI_LDC);
  }

  showPheDuyetTuChoi() {
    let trangThai = this.formData.value.trangThai;
    return ((trangThai == STATUS.CHO_DUYET_TP && this.userService.isAccessPermisson('SCHDTQG_BC_DUYETTP'))
      || (trangThai == STATUS.CHO_DUYET_LDC && this.userService.isAccessPermisson('SCHDTQG_BC_DUYETLDCUC')))
  }

}
