import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Base2Component} from "src/app/components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "src/app/services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {STATUS} from 'src/app/constants/status';
import {MESSAGE} from 'src/app/constants/message';
import {
  DialogTableSelectionComponent
} from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {FileDinhKem} from "src/app/models/DeXuatKeHoachuaChonNhaThau";
import dayjs from "dayjs";
import {DonviService} from "src/app/services/donvi.service";
import {
  QuyetDinhPheDuyetKetQuaService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-thanh-ly/QuyetDinhPheDuyetKetQua.service";
import {chain} from "lodash";
import {v4 as uuidv4} from "uuid";
import {
  ToChucThucHienThanhLyService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-thanh-ly/ToChucThucHienThanhLy.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Base3Component} from "../../../../../../components/base3/base3.component";
import {Validators} from "@angular/forms";

@Component({
  selector: 'app-chi-tiet-quyet-dinh-phe-duyet-bdg-thanh-ly',
  templateUrl: './chi-tiet-quyet-dinh-phe-duyet-bdg-thanh-ly.component.html',
  styleUrls: ['./chi-tiet-quyet-dinh-phe-duyet-bdg-thanh-ly.component.scss']
})
export class ChiTietQuyetDinhPheDuyetBdgThanhLyComponent extends Base3Component implements OnInit {

  maHauTo: any;
  listPhuongThucGiaoNhanBDG: any[] = [];

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
    private _service: QuyetDinhPheDuyetKetQuaService,
    private toChucThucHienThanhLyService: ToChucThucHienThanhLyService
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, _service);
    this.defaultURL = '/xuat/xuat-thanh-ly/to-chuc/qd-pd-kq'
    this.formData = this.fb.group({
      id: [],
      maDvi: [''],
      tenDvi: [''],
      nam: [dayjs().get('year')],
      soQd: ['', [Validators.required]],
      trichYeu: ['', [Validators.required]],
      ngayKy: [''],
      ngayHieuLuc: [''],
      loaiHinhNhapXuat: ['89'],
      tenLoaiHinhNx: ['Xuất bán đấu giá'],
      kieuNhapXuat: ['03'],
      tenKieuNx: ['Xuất bán'],
      idThongBao: ['', [Validators.required]],
      maThongBao: ['', [Validators.required]],
      soBienBan: [''],
      thongBaoKhongThanh: [''],
      loaiVthh: [''],
      tenLoaiVthh: [''],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      pthucGnhan: [''],
      thoiHanGiaoNhan: [],
      thoiHanGiaoNhanGhiChu: [''],
      ghiChu: [''],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự Thảo'],
      hthucDgia: [''],
      pthucDgia: [''],
      idQdTl: [],
      soQdTl: [''],
      tongSoDviTsan: [],
      soDviTsanThanhCong: [],
      tongSlXuatBan: [],
      thanhTien: [],
      quyetDinhDtl: [],
      fileDinhKem: [new Array<FileDinhKem>()],
      canCu: [new Array<FileDinhKem>()],
    });
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.maHauTo = '/QĐ-' + this.userInfo.DON_VI.tenVietTat;
      await Promise.all([
        this.loadDsToChucThanhLy(),
        this.loadDataComboBox(),
        this.getId(),
        this.initForm()
      ])
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
  }

  async initForm() {
    if (this.id > 0) {
      await this._service.getDetail(this.id)
        .then(async (res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            if (res.data.soQd) {
              this.maHauTo = '/' + res.data.soQd?.split("/")[1];
              res.data.soQd = res.data.soQd?.split("/")[0];
            }
            this.fileCanCu = res.data.fileCanCu;
            this.fileDinhKem = res.data.fileDinhKem;
            this.formData.patchValue(res.data);
            await this.getDetailThongBao(res.data.idThongBao);
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }
  }

  async loadDataComboBox() {
    //   Phương thức giao nhận
    this.listPhuongThucGiaoNhanBDG = [];
    let resPtGnBdg = await this.danhMucService.danhMucChungGetAll('PT_GIAO_HANG');
    if (resPtGnBdg.msg == MESSAGE.SUCCESS) {
      this.listPhuongThucGiaoNhanBDG = resPtGnBdg.data
    }
  }

  async buildTableView() {
    this.dataTable = chain(this.dataTable).groupBy('xhTlDanhSachHdr.tenChiCuc').map((value, key) => ({
        tenDonVi: key,
        children: value,
        expandSet: true
      })
    ).value()
  }

  async loadDsToChucThanhLy() {

  }

  async saveAndSend(trangThai: string, msg: string, msgSuccess?: string) {
    let body = {...this.formData.value, soQd: this.formData.value.soQd + this.maHauTo}
    await super.saveAndSend(body, trangThai, msg, msgSuccess);
  }

  async openDialogToChucThanhLy() {
    let data = []
    await this.toChucThucHienThanhLyService.getDsTaoQuyetDinhPdKq({
      trangThai: STATUS.DA_HOAN_THANH,
    }).then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        console.log(res)
        data = res.data;
      }
    });

    const modalQD = this.modal.create({
      nzTitle: 'Danh sách Thông tin đấu giá thanh lý hàng DTQG',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: data,
        dataHeader: ['Mã thông báo', 'Số biên bản', 'TB bán đấu giá không thành', 'Ngày tạo'],
        dataColumn: ['maThongBao', 'soBienBan', 'thongBaoKhongThanh', 'ngayTao'],
      },
    })
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.getDetailThongBao(data.id);
      }
    });
  };

  async getDetailThongBao(idThongBao) {
    await this.toChucThucHienThanhLyService.getDetail(idThongBao).then((res) => {
      if (res.data) {
        const data = res.data;
        this.formData.patchValue({
          idThongBao: data.id,
          maThongBao: data.maThongBao,
          soBienBan: data.soBienBan,
          thongBaoKhongThanh: data.thongBaoKhongThanh,
          pthucGnhan: data.pthucGnhan,
          thoiHanGiaoNhan : data.thoiHanGiaoNhan
        });
        this.dataTable = data.children.filter(item => item.maDviTsan != null && item.toChucCaNhan != null);
        this.buildTableView();

      }
    })
  }

  isDisabled() {
    if (this.formData.value.trangThai == STATUS.CHO_DUYET_TP || this.formData.value.trangThai == STATUS.CHO_DUYET_LDC || this.formData.value.trangThai == STATUS.DA_DUYET_LDC || this.formData.value.trangThai == STATUS.BAN_HANH) {
      return true
    } else {
      return false;
    }
  }

  showSave() {
    let trangThai = this.formData.value.trangThai;
    return (trangThai == STATUS.DU_THAO || trangThai == STATUS.TU_CHOI_TP || trangThai == STATUS.TU_CHOI_LDC) && this.isAccessPermisson('XHDTQG_XTL_TCKHBDG_QDKQDG_THEM');
  }

  save(isGuiDuyet?) {
    this.spinner.show();
    let body = this.formData.value;
    body.fileDinhKemReq = this.fileDinhKem;
    body.fileCanCuReq = this.fileCanCu;
    if (this.formData.value.soQd) {
      body.soQd = this.formData.value.soQd + this.maHauTo
    }
    this.createUpdate(body).then((res) => {
      if (res) {
        if (isGuiDuyet) {
          this.id = res.id;
          this.formData.patchValue({
            id : res.id,
          })
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
      return (trangThai == STATUS.CHO_DUYET_TP && this.userService.isAccessPermisson('XHDTQG_XTL_TCKHBDG_QDKQDG_DUYET_TP'))
        || (trangThai == STATUS.CHO_DUYET_LDC && this.userService.isAccessPermisson('XHDTQG_XTL_TCKHBDG_QDKQDG_DUYET_LDC'));
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
        trangThai = STATUS.BAN_HANH;
        break;
      //Reject
      case STATUS.TU_CHOI_TP:
      case STATUS.TU_CHOI_LDC:
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
    }
    this.reject(this.formData.value.id, trangThai);
  }
}
