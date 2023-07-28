import { chain, cloneDeep } from 'lodash';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { StorageService } from 'src/app/services/storage.service';
import { HttpClient } from '@angular/common/http';
import { BangCaoDieuChuyenService } from '../bao-cao.service';
import { STATUS } from 'src/app/constants/status';
import { MESSAGE } from 'src/app/constants/message';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { DonviService } from 'src/app/services/donvi.service';
import { QuyetDinhDieuChuyenCucService } from 'src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-c.service';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { DialogTableCheckBoxComponent } from 'src/app/components/dialog/dialog-table-check-box/dialog-table-check-box.component';
@Component({
  selector: 'app-them-moi-bao-cao',
  templateUrl: './them-moi-bao-cao.component.html',
  styleUrls: ['./them-moi-bao-cao.component.scss']
})
export class ThemMoiBaoCaoComponent extends Base2Component implements OnInit {
  @Input() idInput: number;
  @Input() isView: boolean;
  @Input() isViewOnModal: boolean;
  @Input() loaiBc: string;
  @Output()
  showListEvent = new EventEmitter<any>();
  expandSetString = new Set<string>();
  dataView: any[] = [];
  listSoQuyetDinh: any[] = [];
  TRANG_THAI: { [key: string]: string } = {
    [STATUS.DU_THAO]: "Dự thảo",
    [STATUS.CHO_DUYET_TP]: "Chờ duyệt - TP",
    [STATUS.CHO_DUYET_LDC]: "Chờ duyệt - LĐ Cục",
    [STATUS.TU_CHOI_TP]: "Từ chối - TP",
    [STATUS.DA_DUYET_LDC]: "Đã duyệt - LĐ Cục",
    [STATUS.TU_CHOI_LDC]: "Từ chối - LĐ Cục"
  };
  danhSachKetQua: any[] = [];
  listBaoCaoChiCuc: any[] = [];
  initialAllChecked: boolean = true;
  allChecked: boolean = true;
  isTongHop: boolean = false;
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private bangCaoDieuChuyenService: BangCaoDieuChuyenService,
    private donviService: DonviService,
    private quyetDinhDieuChuyenCucService: QuyetDinhDieuChuyenCucService
  ) {
    super(httpClient, storageService, notification, spinner, modal, bangCaoDieuChuyenService);
    this.formData = this.fb.group({
      nam: [dayjs().get('year'), [Validators.required]],
      tenDvi: [],
      maDviNhan: [],
      tenDviNhan: [],
      tenBc: [],
      soBc: ['', Validators.required],
      ngayBc: [dayjs().format('YYYY-MM-DD'), [Validators.required]],
      soQdDcCuc: [],
      qdDcCucId: [],
      ngayKyQdCuc: [],
      trangThai: ['00'],
      noiDung: [],
      fileDinhKems: [new Array()],
      listTenBaoCaoSelect: [["Tất cả"]]

    })
  }

  async ngOnInit(): Promise<void> {
    try {
      this.spinner.show();
      await this.loadDetail(this.idInput)
    } catch (error) {
      console.log('e', error)
    }
    finally {
      this.spinner.hide()
    }
  }
  async loadDetail(id: number): Promise<void> {
    if (id) {
      const res = await this.bangCaoDieuChuyenService.getDetail(id);
      if (res.msg === MESSAGE.SUCCESS) {
        this.formData.patchValue({ ...res.data });
        this.dataTable = res.data.dataTable
      }

    }
    else {
      const maDviNhan = this.userInfo?.DON_VI?.maDviCha;
      const data = await this.getChiTietDonViCha(maDviNhan);
      this.formData.patchValue({
        maDvi: this.userInfo.MA_DVI,
        tenDvi: this.userInfo.TEN_DVI,
        maDviNhan,
        tenDviNhan: data ? data.tenDvi : ''
      })
    }
  }
  async getChiTietDonViCha(maDviNhan: string): Promise<any> {
    if (this.userService.isCuc()) {
      return { tenDvi: "Tổng cục Dự trữ Nhà nước" }
    }
    let res = await this.donviService.getDonVi({ str: maDviNhan });
    if (res.msg == MESSAGE.SUCCESS) {
      return res.data
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
      return;
    }
  }
  async loadSoQuyetDinh() {
    let body = {
      trangThai: STATUS.BAN_HANH,
      maDvi: this.userInfo.MA_DVI,
      // listTrangThaiXh: [STATUS.CHUA_THUC_HIEN, STATUS.DANG_THUC_HIEN],
    }
    try {
      let res = await this.quyetDinhDieuChuyenCucService.getDsSoQuyetDinhDieuChuyenChiCuc(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        this.listSoQuyetDinh = Array.isArray(data) ? data.reduce((arr, cur) => {
          if (arr.findIndex(f => f.soQdinh == cur.soQdinh) < 0) {
            arr.push(cur)
          }
          return arr
        }, []) : [];
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    } catch (error) {
      console.log("error", error)
    }
  }
  async openDialogSoQd() {
    await this.loadSoQuyetDinh();
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH QUYẾT ĐỊNH XUẤT ĐIỀU CHUYỂN HÀNG HÓA',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listSoQuyetDinh,
        // dataHeader: ['Số quyết định', 'Ngày quyết định', 'Loại hàng hóa'],
        // dataColumn: ['soQdinh', 'ngayKyQdinh', 'tenLoaiVthh'],
        dataHeader: ['Số quyết định', 'Ngày ký quyết định'],
        dataColumn: ['soQdinh', 'ngayKyQdinh'],
      },
    })
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.bindingDataQd(data)
      }
    });
  };
  bindingDataQd(data: any) {
    this.formData.patchValue({
      soQdDcCuc: data.soQdinh,
      ngayKyQdCuc: data.ngayKyQdinh
    });
    if (this.formData.value.soQdDcCuc) {
      this.getThongTinhNhapXuatHangHoa(this.formData.value.soQdDcCuc)
    }
  };
  async getThongTinhNhapXuatHangHoa(soQdinhCuc: string) {
    try {
      this.spinner.show()
      let res;
      if (this.loaiBc === "CHI_CUC") {
        res = await this.bangCaoDieuChuyenService.getThongTinNhapXuatChiCuc({ soQdinhCuc });
      } else if (this.loaiBc === "CUC") {
        res = await this.bangCaoDieuChuyenService.getThongTinNhapXuatCuc({ soQdinhCuc });
      }
      if (res.msg === MESSAGE.SUCCESS) {
        this.danhSachKetQua = cloneDeep(res.data)
      }
    } catch (error) {
      console.log("e", error)
    }
    finally {
      this.spinner.hide()
    }
  }

  async loadListBaoCaoChiCuc() {
    try {

      this.listBaoCaoChiCuc = [
        { id: 111, ten: "Báo cáo số 111", donViGui: "Chi cục Việt Trì" },
        { id: 222, ten: "Báo cáo số 222", donViGui: "Chi cục Vinh Phú" },
        { id: 333, ten: "Báo cáo số 111", donViGui: "Chi cục phong Châu" },
      ];
      this.isTongHop = true;
      return this.listBaoCaoChiCuc
    } catch (error) {

    }
  }
  async openDialogTongHopBaoCao() {
    if (!this.isTongHop) {
      await this.loadListBaoCaoChiCuc();

    }
    const modalQD = this.modal.create({
      nzTitle: 'CHỌN BÁO CÁO TỪ CHI CỤC GỬI LÊN',
      nzContent: DialogTableCheckBoxComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listBaoCaoChiCuc,
        // dataHeader: ['Số quyết định', 'Ngày quyết định', 'Loại hàng hóa'],
        // dataColumn: ['soQdinh', 'ngayKyQdinh', 'tenLoaiVthh'],
        dataHeader: ['tenBaoCao', 'Đơn vị gửi'],
        dataColumn: ['ten', 'donViGui'],
        initialAllChecked: this.initialAllChecked,
        allChecked: this.allChecked,
        actionRefresh: true,
        refreshData: this.loadListBaoCaoChiCuc
      },
    })
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.bindingDataBaoCao(data)
      }
    });
  };
  bindingDataBaoCao(data: any) {
    this.listBaoCaoChiCuc = cloneDeep(data.data);
    this.allChecked = data.allChecked;
    if (this.allChecked) {
      this.formData.patchValue({ listTenBaoCaoSelect: ['Tất cả'] })
    }
    else {
      this.formData.patchValue({ listTenBaoCaoSelect: this.listBaoCaoChiCuc.filter(f => f.checked).map(m => m.ten) })
    }
  }
  expandAll() {
    this.dataView.forEach(s => {
      this.expandSetString.add(s.idVirtual);
    })
  }

  onExpandStringChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSetString.add(id);
    } else {
      this.expandSetString.delete(id);
    }
  }
  buildTableView() {
    let dataView = Array.isArray(this.dataTable) ?
      chain(this.dataTable).groupBy("soQdinh").map((rs, i) => {
        const dataSoQdinh = rs.find(f => f.soQdinh == i);
        return {
          ...dataSoQdinh,
          idVirtual: uuidv4(),
          childData: dataSoQdinh ? rs : []
        }
      }).value() : [];
    this.dataView = cloneDeep(dataView);
    this.expandAll()
  }
  async save(isGuiDuyet: boolean): Promise<void> {
    try {
      await this.spinner.show();
      this.setValidator(isGuiDuyet);
      let body = this.formData.value;
      body.danhSachKetQua = this.danhSachKetQua;
      let data = await this.createUpdate(body);
      if (!data) return;
      this.formData.patchValue({ id: data.id, trangThai: data.trangThai })
      if (isGuiDuyet) {
        this.pheDuyet();
      }
    } catch (error) {
      console.log("error", error)
    } finally {
      await this.spinner.hide();

    }
  }
  async pheDuyet(): Promise<void> {
    let trangThai = '';
    let mess = '';
    switch (this.formData.get('trangThai').value) {
      case STATUS.TU_CHOI_TP:
      case STATUS.TU_CHOI_LDC:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_TP;
        mess = 'Bạn có muối gửi duyệt ?'
        break;
      }
      case STATUS.CHO_DUYET_TP: {
        trangThai = STATUS.CHO_DUYET_LDC;
        mess = 'Bạn có chắc chắn muốn phê duyệt ?'
        break;
      }
      case STATUS.CHO_DUYET_LDC: {
        trangThai = STATUS.DA_DUYET_LDC;
        mess = 'Bạn có chắc chắn muốn phê duyệt ?'
        break;
      }
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: mess,
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.formData.value.id,
            trangThai: trangThai
          };
          let res =
            await this.bangCaoDieuChuyenService.approve(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.THAO_TAC_SUCCESS);
            this.back();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }
  async tuChoi(): Promise<void> {
    const modalTuChoi = this.modal.create({
      nzTitle: 'Từ chối',
      nzContent: DialogTuChoiComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalTuChoi.afterClose.subscribe(async (text) => {
      if (text) {
        this.spinner.show();
        try {
          let body = {
            id: this.formData.value.id,
            lyDoTuChoi: text,
            trangThai: STATUS.TU_CHOI_LDCC,
          };
          let res =
            await this.bangCaoDieuChuyenService.approve(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.back();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      }
    });
  }
  back() {
    this.showListEvent.emit();
  }
  checkRoleReject(): boolean {
    const { trangThai } = this.formData.value;
    return this.userService.isCuc() && [STATUS.CHO_DUYET_TP, STATUS.CHO_DUYET_LDC].includes(trangThai)
  }
  checkRoleDuyet(): boolean {
    const { trangThai } = this.formData.value;
    return this.userService.isCuc() && [STATUS.CHO_DUYET_TP, STATUS.CHO_DUYET_LDC].includes(trangThai)
  }
  setValidator(isGuiDuyet: boolean) {

  }
  quayLai() {
    this.showListEvent.emit();
  }
}
