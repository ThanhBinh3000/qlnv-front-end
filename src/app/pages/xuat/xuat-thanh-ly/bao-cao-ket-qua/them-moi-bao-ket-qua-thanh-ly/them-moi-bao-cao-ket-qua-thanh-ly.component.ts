import {Component, Input, OnInit} from '@angular/core';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import * as dayjs from "dayjs";
import {Validators} from "@angular/forms";
import {STATUS} from "../../../../../constants/status";

import {ActivatedRoute, Router} from "@angular/router";
import {
  ThongBaoKqThanhLyService
} from "../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/ThongBaoKqThanhLy.service";
import {HoSoThanhLyService} from "../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/HoSoThanhLy.service";
import {
  DialogTableSelectionComponent
} from "../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import {Base3Component} from "../../../../../components/base3/base3.component";
import {
  QuyetDinhThanhLyService
} from "../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/QuyetDinhThanhLyService.service";

@Component({
  selector: 'app-them-moi-bao-cao-ket-qua-thanh-ly',
  templateUrl: './them-moi-bao-cao-ket-qua-thanh-ly.component.html',
  styleUrls: ['./them-moi-bao-cao-ket-qua-thanh-ly.component.scss']
})
export class ThemMoiBaoCaoKetQuaThanhLyComponent extends Base3Component implements OnInit {
  symbol: string = ''

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private _service: ThongBaoKqThanhLyService,
    private quyetDinhThanhLyService: QuyetDinhThanhLyService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, _service);
    this.defaultURL = 'xuat/xuat-thanh-ly/bao-cao-kq'
    this.getId();
    this.formData = this.fb.group({
      id: [],
      nam: [dayjs().get('year')],
      trangThai: ['00'],
      tenDvi : [''],
      tenTrangThai: ['Dự thảo'],
      soBaoCao: [null, [Validators.required]],
      ngayBaoCao: [null],
      soQd: [null, [Validators.required]],
      idQd: [null, [Validators.required]],
      ngayQd : [null],
      noiDung: [null, [Validators.required]],
      lyDoTuChoi: [null],
    })
    this.symbol = '/' + this.userInfo.DON_VI.tenVietTat + '-KH&QLHDT';

  }

  async ngOnInit() {
    this.spinner.show();
    await Promise.all([
      await this.getId(),
      await this.initForm()
    ])
    this.spinner.hide();
  }

  async initForm() {
    if (this.id) {
      await this.detail(this.id).then((res) => {
        if (res) {
          let soThongBao = res.soThongBao.split('/')[0];
          this.formData.patchValue({
            soThongBao: soThongBao,
          })
          this.getDetailQuyetDinh(res.idQd);
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
    this.quyetDinhThanhLyService.getQuyetDinhToBaoCao({}).then((res) => {
      this.spinner.hide();
      if (res.data) {
        res.data?.forEach(item => {
          item.ngayDen = item.thoiGianTlDen
          item.ngayTu = item.thoiGianTlTu
        })
        const modalQD = this.modal.create({
          nzTitle: 'Danh sách số hồ sơ',
          nzContent: DialogTableSelectionComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzWidth: '700px',
          nzFooter: null,
          nzComponentParams: {
            dataTable: res.data,
            dataHeader: ['Số hồ sơ', 'Trích yếu', 'Thời gian thanh lý từ', 'Thời gian thanh lý đến'],
            dataColumn: ['soHoSo', 'trichYeu', 'ngayTu', 'ngayDen']
          },
        });
        modalQD.afterClose.subscribe(async (data) => {
          if (data) {
            this.getDetailQuyetDinh(data.id);
          }
        });
      }
    })
  }

  getDetailQuyetDinh(idQD) {
    this.spinner.show();
    this.quyetDinhThanhLyService.getDetail(idQD).then((res) => {
      this.spinner.hide();
      if (res.data) {
        const dataHs = res.data
        this.formData.patchValue({
          soQd: dataHs.soQd,
          idQd: dataHs.id,
        })
      }
    });
  }

  showSave() {
    let trangThai = this.formData.value.trangThai;
    return (trangThai == STATUS.DU_THAO || this.isAccessPermisson('XHDTQG_XTL_BCKQ_THEM'));
  }

  save(isGuiDuyet?) {
    this.spinner.show();
    let body = this.formData.value;
    body.fileDinhKemReq = this.fileDinhKem;
    if (this.formData.value.soQd) {
      body.soQd = this.formData.value.soQd + this.symbol
    }
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

  disabled() {
    return this.formData.value.trangThai != STATUS.DU_THAO;
  }

  showPheDuyetTuChoi() {
    let trangThai = this.formData.value.trangThai;
    if (this.userService.isCuc()) {
      return (trangThai == STATUS.CHO_DUYET_TP && this.isAccessPermisson('XHDTQG_XTL_BCKQ_DUYETTP'))
        || (trangThai == STATUS.CHO_DUYET_LDC && this.isAccessPermisson('XHDTQG_XTL_BCKQ_DUYETLDC'));
    }
    return false
  }

  pheDuyet() {
    let trangThai
    switch (this.formData.value.trangThai) {
      // Approve
      case STATUS.DU_THAO:
        trangThai = STATUS.CHO_DUYET_TP;
        break;
      case STATUS.CHO_DUYET_TP:
        trangThai = STATUS.CHO_DUYET_LDC;
        break;
      case STATUS.CHO_DUYET_LDC:
        trangThai = STATUS.DA_DUYET_LDC;
        break;
      case STATUS.DANG_DUYET_CB_VU:
      case STATUS.DA_DUYET_LDC:
        trangThai = STATUS.CHO_DUYET_LDV;
        break;
      case STATUS.CHO_DUYET_LDV:
        trangThai = STATUS.CHO_DUYET_LDTC;
        break;
      case STATUS.CHO_DUYET_LDTC:
        trangThai = STATUS.DA_DUYET_LDTC;
        break;
      case STATUS.DA_DUYET_LDTC:
        trangThai = STATUS.CHODUYET_BTC;
        break;
      case STATUS.CHODUYET_BTC:
        trangThai = STATUS.DADUYET_BTC;
        break;
      //Reject
      case STATUS.TU_CHOI_TP:
      case STATUS.TU_CHOI_LDC:
      case STATUS.TU_CHOI_LDV:
      case STATUS.TU_CHOI_LDTC:
      case STATUS.TU_CHOI_CBV:
        trangThai = STATUS.CHO_DUYET_TP;
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
      case STATUS.CHO_DUYET_LDV:
        trangThai = STATUS.TU_CHOI_LDV;
        break;
      case STATUS.CHO_DUYET_LDTC:
        trangThai = STATUS.TU_CHOI_LDTC;
        break;
      case STATUS.DA_DUYET_LDC:
      case STATUS.DANG_DUYET_CB_VU:
        trangThai = STATUS.TU_CHOI_CBV;
        break;
      case STATUS.CHODUYET_BTC:
        trangThai = STATUS.TUCHOI_BTC;
        break;
    }
    this.reject(this.formData.value.id, trangThai);
  }
}
