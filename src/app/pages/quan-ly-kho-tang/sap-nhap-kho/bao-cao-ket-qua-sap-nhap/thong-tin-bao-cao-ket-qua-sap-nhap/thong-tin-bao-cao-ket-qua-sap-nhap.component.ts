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
import { BaoCaoKetQuaSapNhapService } from 'src/app/services/qlnv-kho/dieu-chuyen-sap-nhap-kho/bao-cao-ket-qua-sap-nhap.service';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-thong-tin-bao-cao-ket-qua-sap-nhap',
  templateUrl: './thong-tin-bao-cao-ket-qua-sap-nhap.component.html',
  styleUrls: ['./thong-tin-bao-cao-ket-qua-sap-nhap.component.scss']
})
export class ThongTinBaoCaoKetQuaSapNhapComponent extends Base2Component implements OnInit {
  @Input('isView') isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input() idInput: number;
  listCcPhapLy: any[] = [];
  listFileDinhKem: any[] = [];
  listFile: any[] = [];
  maBCSN: string;
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
  danhSachBienBanSapNhap: any[] = [];
  tableHeader: Array<{ [key: string]: string }> = [{ title: "Họ và tên", value: "hoVaTen" }, { title: "Chức vụ", value: "chucVu" }];
  baoCaoKetQuaHangDtl: any[] = [];
  baoCaoKetQuaCcDtl: any[] = [];
  baoCaoKetQuaVpDtl: any[] = [];
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
    private bienBanSapNhapKhoService: BienBanSapNhapKhoService,
    private quyetDinhDieuChuyenService: QuyetDinhDieuChuyenService,
    private baoCaoKetQuaSapNhapService: BaoCaoKetQuaSapNhapService
  ) {
    super(httpClient, storageService, notification, spinner, modal, baoCaoKetQuaSapNhapService);
    this.formData = this.fb.group({
      id: [],
      maDvi: [],
      tenDvi: [],
      nam: [dayjs().get("year"), [Validators.required]],
      soBienBanSapNhap: [],
      bienBanSapNhapId: [],
      soBaoCao: [],
      ngayBaoCao: [dayjs().format("YYYY-MM-DD")],
      soQuyetDinh: [],
      soQuyetDinhId: [],
      loai: [],
      tenLoai: [],
      noiDung: [],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: [this.ObTrangThai[STATUS.DU_THAO]],
    });
    this.maBCSN = "/" + this.formData.value.nam + "/" + "BCSN-" + this.userInfo.DON_VI.tenVietTat;
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
      body.soBaoCao = this.formData.value.soBaoCao + this.maBCSN;
      let baoCaoKetQuaHangDtl = [];
      let baoCaoKetQuaCcDtl = [];
      Array.isArray(this.dataViewHang) && this.dataViewHang.forEach(lv1 => {
        Array.isArray(lv1.childData) && lv1.childData.forEach(lv2 => {
          baoCaoKetQuaHangDtl.push({ ...lv2, id: undefined, hdrId: undefined, slThucTe: lv2.slThucTe ? lv2.slThucTe : 0, slHaoHut: lv2.slHaoHut ? lv2.slHaoHut : 0 })
        });
      })
      if (this.formData.value.loai === "SN_CHI_CUC") {
        Array.isArray(this.dataViewCcdc) && this.dataViewCcdc.forEach(lv1 => {
          Array.isArray(lv1.childData) && lv1.childData.forEach(lv2 => {
            baoCaoKetQuaCcDtl.push({ ...lv2, id: undefined, hdrId: undefined })
          });
        })
      };
      body.baoCaoKetQuaHangDtl = baoCaoKetQuaHangDtl;
      body.baoCaoKetQuaCcDtl = baoCaoKetQuaCcDtl;
      body.baoCaoKetQuaVpDtl = this.baoCaoKetQuaVpDtl.map(f => ({ ...f, id: undefined, hdrId: undefined }));
      let data = await this.createUpdate(body, null, isGuiDuyet);
      if (data) {
        this.idInput = data.id;
        this.formData.patchValue({ id: data.id, trangThai: data.trangThai, soBaoCao: typeof data.soBaoCao === 'string' || data.soBaoCao instanceof String ? data.soBaoCao?.split('/')[0] : "" });
        this.maBCSN = typeof data.soBaoCao === "string" || data.soBaoCao instanceof String ? "/" + data.soBaoCao.split("/")[1] + "/" + data.soBaoCao.split("/")[2] : "";
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
            await this.baoCaoKetQuaSapNhapService.approve(
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
    await this.baoCaoKetQuaSapNhapService
      .getDetail(id)
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          const dataDetail = res.data;
          if (dataDetail) {
            this.helperService.bidingDataInFormGroup(this.formData, dataDetail);
            this.listFileDinhKem = dataDetail.fileDinhKem;
            this.formData.patchValue({ soBaoCao: typeof dataDetail.soBaoCao === 'string' || dataDetail.soBaoCao instanceof String ? dataDetail.soBaoCao?.split('/')[0] : "" })
            this.maBCSN = typeof dataDetail.soBaoCao === "string" || dataDetail.soBaoCao instanceof String ? "/" + dataDetail.soBaoCao.split("/")[1] + "/" + dataDetail.soBaoCao.split("/")[2] : "";
            this.baoCaoKetQuaHangDtl = dataDetail.baoCaoKetQuaHangDtl.map(f => ({ ...f, groupBy: f.maDiemKhoDi ? `${f.maChiCucDi}${f.maDiemKhoDi}` : f.maChiCucDi }));
            this.baoCaoKetQuaCcDtl = dataDetail.baoCaoKetQuaCcDtl.map(f => ({ ...f, groupBy: f.maChiCucDi }));
            this.baoCaoKetQuaVpDtl = dataDetail.baoCaoKetQuaVpDtl;
            this.buidView("dataViewHang", "baoCaoKetQuaHangDtl");
            this.buidView("dataViewCcdc", "baoCaoKetQuaCcDtl");
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
  async getDanhsachBienBanSapNhap() {
    let body = {
      maDvi: this.userInfo.MA_DVI,
      paggingReq: { limit: 2147483647, page: 0 },
      trangThai: STATUS.DA_HOAN_THANH
    }
    let res = await this.bienBanSapNhapKhoService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.danhSachBienBanSapNhap = Array.isArray(res?.data?.content) ? res.data.content : [];
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }
  async openDialogSoBienBanSapNhap() {
    if (this.isView) return
    await this.getDanhsachBienBanSapNhap();
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH BIÊN BẢN SÁP NHẬP',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.danhSachBienBanSapNhap,
        dataHeader: ['Số biên bản', "Loại sáp nhập", 'Ngày tạo'],
        dataColumn: ['soBienBan', 'tenLoai', 'ngayTao'],
      },
    })
    modalQD.afterClose.subscribe(async (dataChose) => {
      this.dataTable = [];
      if (dataChose && dataChose.id) {
        const res = await this.bienBanSapNhapKhoService.getDetail(dataChose.id);
        if (res.msg === MESSAGE.SUCCESS) {
          const dataDetail = res.data;
          this.formData.patchValue({ soBienBanSapNhap: dataDetail.soBienBan, bienBanSapNhapId: dataDetail.id, soQuyetDinh: dataDetail.soQuyetDinh, soQuyetDinhId: dataDetail.soQuyetDinhId, loai: dataChose.loai, tenLoai: this.obTenLoai[dataDetail.loai] })
          this.baoCaoKetQuaHangDtl = Array.isArray(dataDetail.bienBanSapNhapHangDtl) ? dataDetail.bienBanSapNhapHangDtl.map(f => ({ ...f, groupBy: f.maDiemKhoDi ? `${f.maChiCucDi}${f.maDiemKhoDi}` : f.maChiCucDi })) : [];
          this.baoCaoKetQuaCcDtl = Array.isArray(dataDetail.bienBanSapNhapCcDtl) ? dataDetail.bienBanSapNhapCcDtl.map(f => ({ ...f, groupBy: f.maChiCucDi })) : [];
          this.baoCaoKetQuaVpDtl = Array.isArray(dataDetail.bienBanSapNhapVpDtl) ? dataDetail.bienBanSapNhapVpDtl : [];
          this.buidView("dataViewHang", "baoCaoKetQuaHangDtl");
          this.buidView("dataViewCcdc", "baoCaoKetQuaCcDtl");
        }
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
    return this.userService.isAccessPermisson("QLKT_THSDK_BCKQTH_EXP")
  };
  exportData(fileName?: string) {
    if (this.formData.value.id) {
      this.spinner.show();
      try {
        this.baoCaoKetQuaSapNhapService
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
    return trangThai == STATUS.DU_THAO && this.userService.isAccessPermisson("QLKT_THSDK_BCKQTH_THEM") && this.userService.isChiCuc();
  };
  checkRoleSave(trangThai: string) {
    return trangThai == STATUS.DU_THAO && this.userService.isAccessPermisson("QLKT_THSDK_BCKQTH_THEM") && this.userService.isChiCuc()
  }
}
