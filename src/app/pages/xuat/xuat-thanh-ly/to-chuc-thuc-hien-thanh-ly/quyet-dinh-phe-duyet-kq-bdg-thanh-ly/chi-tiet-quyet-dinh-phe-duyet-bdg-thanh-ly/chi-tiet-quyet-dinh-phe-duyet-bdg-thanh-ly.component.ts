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

@Component({
  selector: 'app-chi-tiet-quyet-dinh-phe-duyet-bdg-thanh-ly',
  templateUrl: './chi-tiet-quyet-dinh-phe-duyet-bdg-thanh-ly.component.html',
  styleUrls: ['./chi-tiet-quyet-dinh-phe-duyet-bdg-thanh-ly.component.scss']
})
export class ChiTietQuyetDinhPheDuyetBdgThanhLyComponent extends Base2Component implements OnInit {
  @Input() isView: boolean;
  @Input() idSelected: number;
  @Input() isViewOnModal: boolean;
  @Output() showListEvent = new EventEmitter<any>();
  public dsToChucThanhLy: any;
  expandSetString = new Set<string>();
  quyetDinhDtlView: any[] = [];
  maHauTo: any;
  listPhuongThucGiaoNhanBDG: any[] = [];

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private donViService: DonviService,
    private quyetDinhPheDuyetKetQuaService: QuyetDinhPheDuyetKetQuaService,
    private toChucThucHienThanhLyService: ToChucThucHienThanhLyService
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhPheDuyetKetQuaService);
    this.formData = this.fb.group({
      id: [],
      maDvi: [''],
      tenDvi: [''],
      nam: [dayjs().get('year')],
      soQd: [''],
      trichYeu: [''],
      ngayKy: [''],
      ngayHieuLuc: [''],
      loaiHinhNhapXuat: [''],
      tenLoaiHinhNx: [''],
      kieuNhapXuat: [''],
      tenKieuNx: [''],
      idThongBao: [],
      maThongBao: [''],
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
      ])
      await this.loadDetail(this.idSelected)
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
  }

  async loadDataComboBox() {
    //   Phương thức giao nhận
    this.listPhuongThucGiaoNhanBDG = [];
    let resPtGnBdg = await this.danhMucService.danhMucChungGetAll('PT_GIAO_HANG');
    if (resPtGnBdg.msg == MESSAGE.SUCCESS) {
      this.listPhuongThucGiaoNhanBDG = resPtGnBdg.data
    }
  }

  async loadDetail(idInput: number) {
    if (idInput > 0) {
      await this.quyetDinhPheDuyetKetQuaService.getDetail(idInput)
        .then(async (res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            if (res.data.soQd) {
              this.maHauTo = '/' + res.data.soQd?.split("/")[1];
              res.data.soQd = res.data.soQd?.split("/")[0];
            }
            this.formData.patchValue(res.data);
            this.formData.value.quyetDinhDtl.forEach(s => {
              s.idVirtual = uuidv4();
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

  async buildTableView() {
    this.quyetDinhDtlView = chain(this.formData.value.quyetDinhDtl)
      .groupBy("tenChiCuc")
      .map((v, k) => {
          let rowItem = v.find(s => s.tenChiCuc === k);
          let soLuong = v.reduce((prev, cur) => prev + cur.soLuong, 0);
          let idVirtual = uuidv4();
          return {
            idVirtual: idVirtual,
            tenChiCuc: k,
            soLuong: soLuong,
            childData: v
          }
        }
      ).value();
    await this.expandAll();
  }

  async loadDsToChucThanhLy() {
    this.toChucThucHienThanhLyService.search({
      trangThai: STATUS.DA_HOAN_THANH,
      nam: this.formData.get('nam').value,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: this.page - 1,
      },
    }).then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        if (data && data.content && data.content.length > 0) {
          this.dsToChucThanhLy = data.content.filter(item => item.soQdPdKq == null);
          this.dsToChucThanhLy = this.dsToChucThanhLy.filter(s => s.maDvi.substring(0, 6) === this.userInfo.MA_DVI);
        }
      } else {
        this.dsToChucThanhLy = [];
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    });
  }

  async save() {
    await this.helperService.ignoreRequiredForm(this.formData);
    let body = {...this.formData.value, soQd: this.formData.value.soQd ? this.formData.value.soQd + this.maHauTo : null}
    await this.createUpdate(body);
    await this.helperService.restoreRequiredForm(this.formData);
  }

  async saveAndSend(trangThai: string, msg: string, msgSuccess?: string) {
    let body = {...this.formData.value, soQd: this.formData.value.soQd + this.maHauTo}
    await super.saveAndSend(body, trangThai, msg, msgSuccess);
  }

  expandAll() {
    if (this.quyetDinhDtlView && this.quyetDinhDtlView.length > 0) {
      this.quyetDinhDtlView.forEach(s => {
        this.expandSetString.add(s.idVirtual);
      });
    }
  }

  onExpandStringChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSetString.add(id);
    } else {
      this.expandSetString.delete(id);
    }
  }

  async openDialogToChucThanhLy() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách Thông tin đấu giá thanh lý hàng DTQG',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.dsToChucThanhLy,
        dataHeader: ['Mã thông báo', 'Số biên bản', 'TB bán đấu giá không thành', 'Ngày tạo'],
        dataColumn: ['maThongBao', 'soBienBan', 'thongBaoKhongThanh', 'ngayTao'],
      },
    })
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          idThongBao: data.id,
          maThongBao: data.maThongBao,
          soBienBan: data.soBienBan,
          thongBaoKhongThanh: data.thongBaoKhongThanh,
          loaiVthh: data.loaiVthh,
          cloaiVthh: data.cloaiVthh,
          tenLoaiVthh: data.loaiVthh,
          tenCloaiVthh: data.cloaiVthh,
          pthucGnhan: data.pthucGnhan,
          thoiHanGiaoNhan: data.thoiHanGiaoNhan,
          hthucDgia: data.hthucDgia,
          pthucDgia: data.pthucDgia,
          idQdTl: data.idQdTl,
          soQdTl: data.soQdTl,
          quyetDinhDtl: data.toChucDtl,
          tongSlXuatBan: data.toChucDtl.reduce((prev, cur) => prev + cur.slDauGia, 0),
          thanhTien: data.toChucDtl.reduce((prev, cur) => prev + cur.thanhTien, 0),
        })
        await this.buildTableView();
      }
    });
  };

  isDisabled() {
    if (this.formData.value.trangThai == STATUS.CHO_DUYET_TP || this.formData.value.trangThai == STATUS.CHO_DUYET_LDC || this.formData.value.trangThai == STATUS.DA_DUYET_LDC || this.formData.value.trangThai == STATUS.BAN_HANH) {
      return true
    } else {
      return false;
    }
  }
}
