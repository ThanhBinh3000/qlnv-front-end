import { PhieuXuatHangHaoHutSapNhapService } from 'src/app/services/qlnv-kho/dieu-chuyen-sap-nhap-kho/phieu-xuat-hang-hao-hut.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { v4 as uuidv4 } from "uuid";
import { Validators } from "@angular/forms";
import * as dayjs from "dayjs";
import { Base2Component } from "../../../../../components/base2/base2.component";
import { StorageService } from "../../../../../services/storage.service";
import { DonviService } from "../../../../../services/donvi.service";
import { DanhMucService } from "../../../../../services/danhmuc.service";
import { STATUS } from "../../../../../constants/status";
import { MESSAGE } from "../../../../../constants/message";
import { chain, cloneDeep, groupBy } from 'lodash';
import { FILETYPE } from "../../../../../constants/fileType";
import { DataService } from 'src/app/services/data.service';
import {
  QuyetDinhDieuChuyenService
} from "../../../../../services/qlnv-kho/dieu-chuyen-sap-nhap-kho/quyet-dinh-dieu-chuyen.service";
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { DanhMucDuyetKhoService } from 'src/app/services/qlnv-kho/dieu-chuyen-sap-nhap-kho/danh-muc-duyet-kho.service';
import { DieuChuyenKhoService } from 'src/app/services/qlnv-kho/dieu-chuyen-sap-nhap-kho/dieu-chuyen-kho.service';
import { BienBanSapNhapKhoService } from './../../../../../services/qlnv-kho/dieu-chuyen-sap-nhap-kho/bien-ban-sap-nhap-kho.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-thong-tin-bien-ban-sap-nhap-kho',
  templateUrl: './thong-tin-bien-ban-sap-nhap-kho.component.html',
  styleUrls: ['./thong-tin-bien-ban-sap-nhap-kho.component.scss']
})
export class ThongTinBienBanSapNhapKhoComponent extends Base2Component implements OnInit {
  @Input('isView') isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input() idInput: number;
  listCcPhapLy: any[] = [];
  listFileDinhKem: any[] = [];
  listFile: any[] = [];
  maBBSN: string;
  expandSetString = new Set<string>();
  listTrangThaiSn: any[] = [
    { ma: this.STATUS.CHUA_THUC_HIEN, giaTri: "Chưa thực hiện" },
    { ma: this.STATUS.DANG_THUC_HIEN, giaTri: "Đang thực hiện" },
    { ma: this.STATUS.DA_HOAN_THANH, giaTri: "Đã hoàn thành" },
  ];
  ObTrangThai: { [key: string]: string } = {
    [this.STATUS.DU_THAO]: "Dự thảo",
    [this.STATUS.DA_HOAN_THANH]: "Hoàn thành"
  };
  obTenLoai: { [key: string]: string } = {
    "SN_DIEM_KHO": "Điều chuyển - Sáp nhập điểm kho",
    "SN_CHI_CUC": "Điều chuyển - sáp nhập chi cục"
  }
  dsCuc: any;
  dsCucDi: any;
  dsCucDen: any;
  dsChiCuc: any;
  dsChiCucDi: any;
  dsChiCucDen: any;
  dsKho: any;
  dsKhoDi: any;
  dsKhoDen: any;
  rowItem: any = {};
  dataEdit: { [key: string]: { edit: boolean; data: any } } = {};
  hasError: boolean = false;
  isDisabledThemMoi: boolean = false;
  danhSachQuyetDinh: any[] = [];
  daiDienCucData: any[] = [];
  donViChuyenDiData: any[] = [];
  donViChuyenDenData: any[] = [];
  rowInitialCuc: { [key: string]: any } = {
    chucVu: "",
    hoVaTen: "",
    type: "01"
  };
  rowInitialDi: { [key: string]: any } = {
    chucVu: "",
    hoVaTen: "",
    type: "02"
  };
  rowInitialDen: { [key: string]: any } = {
    chucVu: "",
    hoVaTen: "",
    type: "03"
  }
  tableHeader: Array<{ [key: string]: string | boolean }> = [{ title: "Họ và tên", value: "hoVaTen", edit: true, dataType: "string" }, { title: "Chức vụ", value: "chucVu", edit: true, dataType: "string" }];
  bienBanSapNhapHangDtl: any[] = [];
  bienBanSapNhapCcDtl: any[] = [];
  bienBanSapNhapVpDtl: any[] = [];
  dataViewHang: any[] = [];
  dataViewCcdc: any[] = [];
  constructor(httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donviService: DonviService,
    private danhMucService: DanhMucService,
    private dataService: DataService,
    private dieuChuyenKhoService: DieuChuyenKhoService,
    private quyetDinhDieuChuyenService: QuyetDinhDieuChuyenService,
    private bienBanSapNhapKhoService: BienBanSapNhapKhoService
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanSapNhapKhoService);
    this.formData = this.fb.group({
      id: [],
      maDvi: [],
      tenDvi: [],
      nam: [dayjs().get("year"), [Validators.required]],
      soBienBan: [, [Validators.required]],
      soQuyetDinh: [, [Validators.required]],
      soQuyetDinhId: [, [Validators.required]],
      ngayKy: [dayjs().format("YYYY-MM-DD"), [Validators.required]],
      loai: [],
      tenLoai: [],
      trichYeu: [, [Validators.required]],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: [this.ObTrangThai[STATUS.DU_THAO]],
      lyDoTuChoi: []
    });
    this.maBBSN = "/" + this.formData.value.nam + "/BBSN-" + this.userInfo.DON_VI.tenVietTat;
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      if (this.idInput) {
        await this.getDetail(this.idInput)
      } else {
        await this.bindingData();
      }
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    finally {
      await this.spinner.hide()
    }
  }

  async bindingData() {
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI,
      maDvi: this.userInfo.MA_DVI,
    })
  }

  async save(isGuiDuyet?: boolean) {
    try {
      await this.spinner.show();
      let body = this.formData.value;
      body.fileDinhKem = this.listFileDinhKem;
      body.bienBanSapNhapDtl = [...this.daiDienCucData, ...this.donViChuyenDenData, ...this.donViChuyenDiData];
      let bienBanSapNhapHangDtl = [];
      let bienBanSapNhapCcDtl = [];
      Array.isArray(this.dataViewHang) && this.dataViewHang.forEach(lv1 => {
        Array.isArray(lv1.childData) && lv1.childData.forEach(lv2 => {
          bienBanSapNhapHangDtl.push({ ...lv2, id: undefined, hdrId: undefined, slThucTe: lv2.slThucTe ? lv2.slThucTe : 0, slHaoHut: lv2.slHaoHut ? lv2.slHaoHut : 0, slTheoSoSach: lv2.slTheoSoSach ? lv2.slTheoSoSach : 0 })
        });
      })
      if (this.formData.value.loai === "SN_CHI_CUC") {
        Array.isArray(this.dataViewCcdc) && this.dataViewCcdc.forEach(lv1 => {
          Array.isArray(lv1.childData) && lv1.childData.forEach(lv2 => {
            bienBanSapNhapCcDtl.push({ ...lv2, id: undefined, hdrId: undefined })
          });
        })
      };
      body.bienBanSapNhapHangDtl = bienBanSapNhapHangDtl.map(f => ({ ...f, groupBy: undefined }));
      body.bienBanSapNhapCcDtl = bienBanSapNhapCcDtl.map(f => ({ ...f, groupBy: undefined }));
      body.bienBanSapNhapVpDtl = this.bienBanSapNhapVpDtl.map(f => ({ ...f, id: undefined, hdrId: undefined }));
      body.soBienBan = this.formData.value.soBienBan + this.maBBSN;
      let data = await this.createUpdate(body, null, isGuiDuyet);
      if (data) {
        this.idInput = data.id;
        this.formData.patchValue({ id: data.id, trangThai: data.trangThai, soBienBan: typeof data.soBienBan === "string" || data.soBienBan instanceof String ? data.soBienBan?.split('/')[0] : "" });
        this.maBBSN = typeof data.soBienBan === "string" || data.soBienBan instanceof String ? "/" + data.soBienBan.split("/")[1] + "/" + data.soBienBan.split("/")[2] : "";
        if (isGuiDuyet) {
          this.hoanThanh()
        }
      }
    } catch (error) {
      console.log("e", error)
    }
    finally {
      await this.spinner.hide()
    }
  }
  hoanThanh() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: "Bạn có muốn ban hành bản ghi này?.",
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
            await this.bienBanSapNhapKhoService.approve(
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

  // async flattenTree(tree) {
  //   return tree.flatMap((item) => {
  //     return item.childData ? this.flattenTree(item.childData) : item;
  //   });
  // }


  async getDetail(id: number) {
    await this.bienBanSapNhapKhoService
      .getDetail(id)
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          const dataDetail = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, dataDetail);
          const soBienBan = typeof dataDetail.soBienBan === "string" || dataDetail.soBienBan instanceof String ? dataDetail.soBienBan.split("/")[0] : "";
          this.maBBSN = typeof dataDetail.soBienBan === "string" || dataDetail.soBienBan instanceof String ? "/" + dataDetail.soBienBan.split("/")[1] + "/" + dataDetail.soBienBan.split("/")[2] : "";
          this.formData.patchValue({ soBienBan });
          if (dataDetail) {
            this.fileDinhKem = dataDetail.fileDinhKem;
            this.bienBanSapNhapHangDtl = dataDetail.bienBanSapNhapHangDtl.map(f => ({ ...f, groupBy: f.maDiemKhoDi ? `${f.maChiCucDi}${f.maDiemKhoDi}` : f.maChiCucDi }));
            this.bienBanSapNhapCcDtl = dataDetail.bienBanSapNhapCcDtl.map(f => ({ ...f, groupBy: f.maChiCucDi }));
            this.bienBanSapNhapVpDtl = dataDetail.bienBanSapNhapVpDtl;
            this.daiDienCucData = dataDetail.bienBanSapNhapDtl.filter(f => f.type === "01");
            this.donViChuyenDiData = dataDetail.bienBanSapNhapDtl.filter(f => f.type === "02");
            this.donViChuyenDenData = dataDetail.bienBanSapNhapDtl.filter(f => f.type === "03");
            this.buidView("dataViewHang", "bienBanSapNhapHangDtl");
            this.buidView("dataViewCcdc", "bienBanSapNhapCcDtl");
          };
        }
      })
      .catch((e) => {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      });
  }
  buidView(key1: string, key2: string) {
    this[key1] = chain(this[key2]).groupBy("groupBy").map((s, k) => {
      const groupBy = s.find(f => f.groupBy === k)
      return {
        ...groupBy,
        idVirtual: uuidv4(),
        childData: s

      }
    }
    ).value();
    this.expandAll(this[key1])
  }
  async getDanhsachQuyetDinh() {
    let body = {
      maDvi: this.userInfo.MA_DVI.slice(0, 6),
      paggingReq: { limit: 2147483647, page: 0 },
    }
    let res = await this.dieuChuyenKhoService.danhSach(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.danhSachQuyetDinh = Array.isArray(res?.data) ? res.data : [];
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }
  async openDialogSoQuyetDinhDCSN() {
    if (this.isView) return
    await this.getDanhsachQuyetDinh();
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH QUYẾT ĐỊNH XUẤT ĐIỀU CHUYỂN SÁP NHẬP',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.danhSachQuyetDinh,
        dataHeader: ['Số quyết định', "Loại sáp nhập", 'Ngày ký quyết định'],
        dataColumn: ['soQuyetDinh', 'tenLoai', 'ngayKy'],
      },
    })
    modalQD.afterClose.subscribe(async (dataChose) => {
      if (dataChose && dataChose.id) {
        const res = await this.dieuChuyenKhoService.getDetail(dataChose.id);
        this.bienBanSapNhapHangDtl = [];
        this.bienBanSapNhapCcDtl = [];
        this.bienBanSapNhapVpDtl = [];
        if (res.msg === MESSAGE.SUCCESS) {
          this.formData.patchValue({
            soQuyetDinh: res.data.soQuyetDinh,
            soQuyetDinhId: res.data.soQuyetDinhId,
            // ngayKy: res.data.ngayKy,
            loai: res.data.loai,
            tenLoai: this.obTenLoai[res.data.loai]
          });
          this.bienBanSapNhapHangDtl = Array.isArray(res.data.dieuChuyenKhoHangDtl) ? res.data.dieuChuyenKhoHangDtl.map(f => ({ ...f, groupBy: f.maDiemKhoDi ? `${f.maChiCucDi}${f.maDiemKhoDi}` : f.maChiCucDi, slTheoSoSach: f.slTon, slThucTe: (f.slTon || 0) - (f.slHaoHut || 0), slHaoHut: f.slHaoHut || 0 })) : [];
          this.bienBanSapNhapCcDtl = Array.isArray(res.data.dieuChuyenKhoCcDtl) ? res.data.dieuChuyenKhoCcDtl.map(f => ({ ...f, groupBy: f.maChiCucDi })) : [];
          this.bienBanSapNhapVpDtl = Array.isArray(res.data.dieuChuyenKhoVpDtl) ? res.data.dieuChuyenKhoVpDtl : [];
          this.buidView("dataViewHang", "bienBanSapNhapHangDtl");
          this.buidView("dataViewCcdc", "bienBanSapNhapCcDtl");
        }
        // await this.bindingDataQd(dataChose.id, false);
      }
    });
  };
  async expandAll(data: any[]) {
    data.forEach(s => {
      this.expandSetString.add(s.idVirtual);
    });
  }
  onExpandStringChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSetString.add(id);
    } else {
      this.expandSetString.delete(id);
    }
  }
  checkRoleExport() {
    return this.userService.isAccessPermisson("QLKT_THSDK_BBSN_EXP")
  };
  exportData(fileName?: string) {
    if (this.formData.value.id) {
      this.spinner.show();
      try {
        this.bienBanSapNhapKhoService
          .exportDetail(this.formData.value.id)
          .subscribe((blob) =>
            saveAs(blob, fileName ? fileName : 'data.xlsx'),
          );
        this.spinner.hide();
      } catch (e) {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY);
    }
  }
  checkRoleApprove(trangThai: string) {
    return trangThai == STATUS.DU_THAO && this.userService.isAccessPermisson("QLKT_THSDK_BBSN_THEM") && this.userService.isChiCuc();
  };
  checkRoleSave(trangThai: string) {
    return trangThai == STATUS.DU_THAO && this.userService.isAccessPermisson("QLKT_THSDK_BBSN_THEM") && this.userService.isChiCuc()
  }

}
