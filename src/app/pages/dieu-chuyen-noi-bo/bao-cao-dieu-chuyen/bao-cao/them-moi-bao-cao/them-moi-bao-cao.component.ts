import { chain, cloneDeep, includes } from 'lodash';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { StorageService } from 'src/app/services/storage.service';
import { HttpClient } from '@angular/common/http';
import { BaoCaoDieuChuyenService } from '../bao-cao.service';
import { STATUS } from 'src/app/constants/status';
import { MESSAGE } from 'src/app/constants/message';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { DonviService } from 'src/app/services/donvi.service';
import { QuyetDinhDieuChuyenCucService } from 'src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-c.service';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { DialogTableCheckBoxComponent } from 'src/app/components/dialog/dialog-table-check-box/dialog-table-check-box.component';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
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
    [STATUS.TU_CHOI_LDC]: "Từ chối - LĐ Cục",
    [STATUS.DA_DUYET_LDC]: "Đã duyệt - LĐ Cục",
    [STATUS.DA_HOAN_THANH]: "Hoàn thành",
  };
  danhSachKetQua: any[] = [];
  listBaoCaoChiCuc: any[] = [];
  initialAllChecked: boolean = true;
  allChecked: boolean = true;
  isTongHop: boolean = false;
  idsChiCuc: number[];
  tongKinhPhiDcQd: number = 0;
  tongKinhPhiXuatDcTt: number = 0;
  tongKinhPhiNhapDcTt: number = 0;
  duocLapBBThuaThieu: boolean = false;
  maBc: string;
  ObKetQua: { [key: string]: string } = {
    [STATUS.CHUA_THUC_HIEN]: "Chưa thực hiện",
    [STATUS.DANG_THUC_HIEN]: "Đang thực hiện",
    [STATUS.DA_HOAN_THANH]: "Hoàn thành"
  }
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private baoCaoDieuChuyenService: BaoCaoDieuChuyenService,
    private donviService: DonviService,
    private quyetDinhDieuChuyenCucService: QuyetDinhDieuChuyenCucService,
    private dataService: DataService,
    private router: Router
  ) {
    super(httpClient, storageService, notification, spinner, modal, baoCaoDieuChuyenService);
    this.formData = this.fb.group({
      id: [0],
      nam: [dayjs().get('year'), [Validators.required]],
      tenDvi: [, [Validators.required]],
      maDvi: [, [Validators.required]],
      maDviNhan: [],
      tenDviNhan: [],
      tenBc: [, [Validators.required]],
      soBc: ['', [Validators.required]],
      ngayBc: [dayjs().format('YYYY-MM-DD'), [Validators.required]],
      soQdDcCuc: [, [Validators.required]],
      qdDcCucId: [, [Validators.required]],
      ngayKyQd: [, [Validators.required]],
      trangThai: ['00'],
      lyDoTuChoi: [],
      noiDung: [],
      fileDinhKems: [new Array()],
      listTenBaoCaoSelect: [["Tất cả"]]
    });
    this.maBc = "/BC-" + this.userInfo.DON_VI.tenVietTat;
  }

  async ngOnInit(): Promise<void> {
    try {
      if (this.loaiBc !== "CHI_CUC") {
        this.formData.controls["soQdDcCuc"].clearValidators();
        this.formData.controls["qdDcCucId"].clearValidators();
        this.formData.controls["ngayKyQd"].clearValidators();
      }
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
      this.allChecked = false;
      const res = await this.baoCaoDieuChuyenService.getDetail(id);
      if (res.msg === MESSAGE.SUCCESS) {
        this.formData.patchValue({ ...res.data, soBc: typeof res.data.soBc === "string" || res.data.soBc instanceof String ? res.data.soBc.split("/")[0] : "" });
        this.maBc = typeof res.data.soBc === "string" || res.data.soBc instanceof String ? "/" + res.data.soBc.split("/")[1] : "";
        this.danhSachKetQua = res.data.danhSachKetQua;
        this.idsChiCuc = res.data.idsChiCuc && Array.isArray(res.data.idsChiCuc.split(",")) ? res.data.idsChiCuc.split(",").map(f => Number(f)) : []
        if (this.loaiBc === "CUC") {
          await this.loadListBaoCaoChiCuc();
          this.listBaoCaoChiCuc = this.listBaoCaoChiCuc.map(f => {
            if (this.idsChiCuc?.includes(f.id)) {
              return {
                ...f, checked: true
              }
            }
            return { ...f }
          })
          // this.danhSachKetQua = Array.isArray(this.listBaoCaoChiCuc) ? this.listBaoCaoChiCuc.reduce((arr, cur) => {
          //   arr = arr.concat(cur.danhSachKetQua);
          //   return arr
          // }, []) : [];
          if (this.listBaoCaoChiCuc.every(f => !!f.checked)) {
            this.allChecked = true;
            this.formData.patchValue({ listTenBaoCaoSelect: ['Tất cả'] })
          } else {
            this.formData.patchValue({ listTenBaoCaoSelect: this.listBaoCaoChiCuc.filter(f => f.checked).map(m => m.tenBc) })
          }
        };
        this.buildTableView();
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
      if (this.loaiBc === "CUC") {
        if (this.allChecked) {
          await this.loadListBaoCaoChiCuc();
          this.danhSachKetQua = Array.isArray(this.listBaoCaoChiCuc) ? this.listBaoCaoChiCuc.reduce((arr, cur) => {
            arr = arr.concat(cur.danhSachKetQua);
            return arr
          }, []) : [];
          this.buildTableView();

        }
      }
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
      ngayKyQd: data.ngayKyQdinh,
      qdDcCucId: data.id
    });
    if (this.formData.value.soQdDcCuc) {
      this.getThongTinhNhapXuatHangHoa(this.formData.value.soQdDcCuc)
    }
  };
  checkTinhTrangThuaThieu(data: { [key: string]: any }): boolean {
    if ((data.slXuatTt - data.slDieuChuyenQd) === 0 && (data.slNhapTt - data.slXuatTt) === 0) {
      return false
    }
    return true
  }
  async getThongTinhNhapXuatHangHoa(soQdinhCuc: string) {
    try {
      this.spinner.show()
      let res;
      if (this.loaiBc === "CHI_CUC") {
        res = await this.baoCaoDieuChuyenService.getThongTinNhapXuatChiCuc({ soQdinhCuc });
        if (res.msg === MESSAGE.SUCCESS) {
          this.danhSachKetQua = res.data.map(f => ({ ...f, tinhTrang: this.checkTinhTrangThuaThieu(f) }));
          this.buildTableView();
        }
      } else if (this.loaiBc === "CUC") {
        res = await this.baoCaoDieuChuyenService.getThongTinNhapXuatCuc({ soQdinhCuc });
        if (res.msg === MESSAGE.SUCCESS) {
          this.danhSachKetQua = cloneDeep(res.data);
          this.buildTableView();
        }
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
      const body = {
        trangThai: STATUS.DA_HOAN_THANH
      }
      const res = await this.baoCaoDieuChuyenService.danhSach(body);
      if (res.msg === MESSAGE.SUCCESS) {
        this.listBaoCaoChiCuc = Array.isArray(res.data) ? res.data : [];
      }
      this.isTongHop = true;
      return this.listBaoCaoChiCuc
    } catch (error) {
      console.log("e", error)
    }
  }
  async openDialogTongHopBaoCao() {
    if (!this.isTongHop) {
      await this.loadListBaoCaoChiCuc();

    };
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
        dataHeader: ['Số báo cáo', 'Đơn vị gửi'],
        dataColumn: ['soBc', 'tenDvi'],
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
      this.formData.patchValue({ listTenBaoCaoSelect: this.listBaoCaoChiCuc.filter(f => f.checked).map(m => this.loaiBc === "CUC" ? m.tenBc : m.ten) });
    };
    this.danhSachKetQua = Array.isArray(this.listBaoCaoChiCuc) ? this.listBaoCaoChiCuc.filter(f => f.checked).reduce((arr, cur) => {
      const hasId = this.idsChiCuc?.includes(cur.id);
      arr = arr.concat(cur.danhSachKetQua.map(f => ({ ...f, id: hasId ? f.id : undefined, hdrId: hasId ? f.hdrId : undefined })));
      return arr
    }, []) : [];
    this.buildTableView();
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
  checkThuaThieu(list: any[]) {
    this.duocLapBBThuaThieu = this.formData.value.trangThai === STATUS.DA_HOAN_THANH && Array.isArray(list) ? list.some(f => f.tinhTrang) : false;
  }
  buildTableView() {
    let dataView = Array.isArray(this.danhSachKetQua) ?
      chain(this.danhSachKetQua.map(f => ({ ...f, keyGroup: `${f.cloaiVthh}${f.maLoKho ? f.maLoKho + f.maNganKho : f.maNganKho}` }))).groupBy("keyGroup").map((rs, i) => {
        const dataSoQdinh = rs.find(f => f.keyGroup == i);
        const sumKinhPhiNhapTt = dataSoQdinh && Array.isArray(rs) ? rs.reduce((sum, cur) => sum += cur.kinhPhiNhapTt, 0) : 0;
        return {
          ...dataSoQdinh,
          idVirtual: uuidv4(),
          childData: dataSoQdinh ? rs : [],
          sumKinhPhiNhapTt
        }
      }).value() : [];
    this.expandAll();
    const { tongKinhPhiDcQd, tongKinhPhiXuatDcTt, tongKinhPhiNhapDcTt } = Array.isArray(dataView) ? dataView.reduce((obj, cur) => {
      obj.tongKinhPhiDcQd += Number(cur.kinhPhiTheoQd);
      obj.tongKinhPhiXuatDcTt += Number(cur.kinhPhiXuatTt);
      obj.tongKinhPhiNhapDcTt += Number(cur.sumKinhPhiNhapTt);
      return obj
    }, { tongKinhPhiDcQd: 0, tongKinhPhiXuatDcTt: 0, tongKinhPhiNhapDcTt: 0 }) : { tongKinhPhiDcQd: 0, tongKinhPhiXuatDcTt: 0, tongKinhPhiNhapDcTt: 0 };
    this.tongKinhPhiDcQd = tongKinhPhiDcQd;
    this.tongKinhPhiXuatDcTt = tongKinhPhiXuatDcTt;
    this.tongKinhPhiNhapDcTt = tongKinhPhiNhapDcTt;
    this.dataView = cloneDeep(dataView);
    this.checkThuaThieu(this.danhSachKetQua)
  }
  async save(isGuiDuyet: boolean): Promise<void> {
    try {
      await this.spinner.show();
      this.setValidator(isGuiDuyet);
      let body = this.formData.value;
      body.danhSachKetQua = this.danhSachKetQua;
      body.listTenBaoCaoSelect = undefined;
      body.type = this.loaiBc;
      body.soBc = this.formData.value.soBc + this.maBc;
      if (this.loaiBc === "CUC") {
        body.idsChiCuc = this.allChecked ? this.listBaoCaoChiCuc.map(f => f.id).join(",") : this.listBaoCaoChiCuc.filter(f => f.checked).map(f => f.id).join(",");
      }
      let data = await this.createUpdate(body, null, isGuiDuyet);
      if (!data) return;
      this.formData.patchValue({ id: data.id, soBc: typeof data.soBc === "string" || data.soBc instanceof String ? data.soBc.split("/")[0] : "", trangThai: data.trangThai });
      this.maBc = typeof data.soBc === "string" || data.soBc instanceof String ? "/" + data.soBc.split("/")[1] : "";
      this.idsChiCuc = data.idsChiCuc && Array.isArray(data.idsChiCuc.split(",")) ? data.idsChiCuc.split(",").map(f => Number(f)) : [];
      if (isGuiDuyet) {
        if (this.loaiBc === 'CUC') {
          this.pheDuyet();
        } else {
          this.hoanThanh();
        }
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
        mess = 'Bạn có muốn gửi duyệt ?'
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
            await this.baoCaoDieuChuyenService.approve(
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
    let trangThai = '';
    switch (this.formData.get('trangThai').value) {
      case STATUS.CHO_DUYET_TP: {
        trangThai = STATUS.TU_CHOI_TP;
        break;
      }
      case STATUS.CHO_DUYET_LDC: {
        trangThai = STATUS.TU_CHOI_LDC;
        break;
      }
    }
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
            trangThai: trangThai,
          };
          let res =
            await this.baoCaoDieuChuyenService.approve(
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
  hoanThanh() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: "Bạn có muốn hoàn thành bản ghi này?.",
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.formData.value.id,
            trangThai: STATUS.DA_HOAN_THANH
          };
          let res =
            await this.baoCaoDieuChuyenService.hoanThanh(
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
  back() {
    this.showListEvent.emit();
  }
  lapBBThuaThieu() {
    const obj = {
      soQdDcCuc: this.formData.value.soQdDcCuc,
      qdDcCucId: this.formData.value.qdDcCucId,
      ngayKyQd: this.formData.value.ngayKyQd,
      soBc: this.formData.value.soBc + this.maBc,
      tenBc: this.formData.value.tenBc,
      ngayBc: this.formData.value.ngayBc,
      bcKetQuaDcId: this.formData.value.id,
      maDviNhan: this.formData.value.maDviNhan,
    };
    this.dataService.changeData(obj);
    this.router.navigate(['dieu-chuyen-noi-bo/bien-ban-thua-thieu']);
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
  checkLoaiBc(loaiBc: string): boolean {
    if (this.loaiBc === loaiBc) {
      return true
    };
    return false
  }
  checkRoleHoanThanh() {
    if (!this.isViewOnModal && (this.loaiBc === "CHI_CUC" && this.userService.isChiCuc()) && this.formData.value.trangThai === STATUS.DU_THAO) {
      return true
    }
    return false
  }
  checkRoleLapBBThuaThieu() {
    // return this.duocLapBBThuaThieu;
    return (this.loaiBc === "CHI_CUC" && this.userService.isChiCuc() && this.formData.value.trangThai === STATUS.DA_HOAN_THANH && this.duocLapBBThuaThieu)
  }
}
