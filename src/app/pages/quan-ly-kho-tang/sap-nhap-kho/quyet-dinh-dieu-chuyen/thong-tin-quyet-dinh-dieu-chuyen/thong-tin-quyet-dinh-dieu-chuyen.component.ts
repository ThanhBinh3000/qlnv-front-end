import { QuyetDinhDieuChuyenSapNhapKhoComponent } from './../quyet-dinh-dieu-chuyen-sap-nhap-kho.component';
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
import { chain, cloneDeep } from 'lodash';
import { FILETYPE } from "../../../../../constants/fileType";
import { DataService } from 'src/app/services/data.service';
import {
  QuyetDinhDieuChuyenService
} from "../../../../../services/qlnv-kho/dieu-chuyen-sap-nhap-kho/quyet-dinh-dieu-chuyen.service";

@Component({
  selector: 'app-thong-tin-quyet-dinh-dieu-chuyen',
  templateUrl: './thong-tin-quyet-dinh-dieu-chuyen.component.html',
  styleUrls: ['./thong-tin-quyet-dinh-dieu-chuyen.component.scss']
})
export class ThongTinQuyetDinhDieuChuyenComponent extends Base2Component implements OnInit {
  @Input('isView') isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input() idInput: number;
  @Output("selectTab") selectTab = new EventEmitter<any>();
  listCcPhapLy: any[] = [];
  listFileDinhKem: any[] = [];
  listFile: any[] = [];
  maQd: string;
  expandSetString = new Set<string>();
  listTrangThaiSn: any[] = [
    { ma: this.STATUS.CHUA_THUC_HIEN, giaTri: "Chưa thực hiện" },
    { ma: this.STATUS.DANG_THUC_HIEN, giaTri: "Đang thực hiện" },
    { ma: this.STATUS.DA_HOAN_THANH, giaTri: "Đã hoàn thành" },
  ];
  ObTrangThai: { [key: string]: string } = {
    [this.STATUS.DANG_NHAP_DU_LIEU]: "Đang nhập dữ liệu",
    [this.STATUS.BAN_HANH]: "Ban hành"
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
  rowItem: ItemXhXkVtquyetDinhPdDtl = new ItemXhXkVtquyetDinhPdDtl;
  dataEdit: { [key: string]: { edit: boolean; data: ItemXhXkVtquyetDinhPdDtl } } = {};
  hasError: boolean = false;
  isDisabledThemMoi: boolean = false;

  constructor(httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donviService: DonviService,
    private danhMucService: DanhMucService,
    private dataService: DataService,
    private quyetDinhDieuChuyenService: QuyetDinhDieuChuyenService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhDieuChuyenService);
    this.formData = this.fb.group({
      id: [],
      maDvi: [],
      tenDvi: [],
      nam: [dayjs().get("year"), [Validators.required]],
      soQuyetDinh: [],
      ngayKy: [],
      lyDoTuChoi: [],
      trichYeu: [],
      trangThai: [STATUS.DANG_NHAP_DU_LIEU],
      tenTrangThai: [this.ObTrangThai[STATUS.DANG_NHAP_DU_LIEU]],
      trangThaiSn: [],
      tenTrangThaiSn: [],
      quyetDinhPdDtl: [new Array<ItemXhXkVtquyetDinhPdDtl>()],
      loai: ["SN_DIEM_KHO"],
    });
    this.maQd = "/" + this.userInfo.MA_QD;

  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      await this.loadDsCuc();
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


  // async buildTableView(data?: any) {
  //   this.dataTable = chain(data)
  //     .groupBy("tenChiCuc")
  //     .map((v, k) => {
  //       let rowItem = v.find(s => s.tenChiCuc === k);
  //       let idVirtual = uuidv4();
  //       this.expandSetString.add(idVirtual);
  //       return {
  //         idVirtual: idVirtual,
  //         tenChiCuc: k,
  //         tenCuc: rowItem?.tenCuc,
  //         maDiaDiem: rowItem?.maDiaDiem,
  //         tenCloaiVthh: rowItem?.tenCloaiVthh,
  //         childData: v
  //       }
  //     }
  //     ).value();
  // }

  async bindingData() {
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI,
      maDvi: this.userInfo.MA_DVI
    })
  }


  onExpandStringChange(id: string, checked: boolean) {
    if (checked) {
      this.expandSetString.add(id);
    } else {
      this.expandSetString.delete(id);
    }
  }

  async save(isGuiDuyet?: boolean) {

    // body.fileDinhKem=cloneDeep(this.listFileDinhKem);
    // body.canCu=cloneDeep(this.listCcPhapLy);
    try {
      await this.spinner.show();
      // this.listFile = [];
      // if (this.listFileDinhKem.length > 0) {
      //   this.listFileDinhKem.forEach(item => {
      //     item.fileType = FILETYPE.FILE_DINH_KEM
      //     this.listFile.push(item)
      //   });
      // }
      // if (this.listCcPhapLy.length > 0) {
      //   this.listCcPhapLy.forEach(element => {
      //     element.fileType = FILETYPE.CAN_CU_PHAP_LY
      //     this.listFile.push(element)
      //   });
      // }
      // if (this.listFile && this.listFile.length > 0) {
      //   this.formData.value.fileDinhKems = this.listFile;
      // }
      let body = this.formData.value;
      body.tenLoai = this.obTenLoai[this.formData.value.loai]
      body.soQuyetDinh = this.formData.value.soQuyetDinh + this.maQd;
      body.quyetDinhPdDtl = this.dataTable;
      body.fileDinhKem = this.listFileDinhKem;
      body.canCu = this.listCcPhapLy;
      let data = await this.createUpdate(body, null, isGuiDuyet);
      if (data) {
        this.idInput = data.id;
        this.formData.patchValue({ id: data.id, trangThai: data.trangThai, soQuyetDinh: data.soQuyetDinh?.split('/')[0] });
        if (isGuiDuyet) {
          this.banHanh()
        }
      }
    } catch (error) {
      console.log("e", error)
    }
    finally {
      await this.spinner.hide()
    }
  }
  banHanh() {
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
            trangThai: STATUS.BAN_HANH
          };
          let res =
            await this.quyetDinhDieuChuyenService.approve(
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
  goToDanhMucDuyetKho() {
    const obj = {
      quyetDinhId: this.formData.value.id
    };
    this.dataService.changeData(obj);
    this.selectTab.emit(1)
  }

  // async flattenTree(tree) {
  //   return tree.flatMap((item) => {
  //     return item.childData ? this.flattenTree(item.childData) : item;
  //   });
  // }


  async getDetail(id: number) {
    await this.quyetDinhDieuChuyenService
      .getDetail(id)
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          const dataDetail = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, dataDetail);
          if (dataDetail) {
            this.formData.patchValue({
              soQuyetDinh: dataDetail.soQuyetDinh?.split('/')[0],
            })
            // this.listFile = dataDetail.fileDinhKems;
            this.dataTable = dataDetail.quyetDinhPdDtl;
            this.updateEditCache();
            // this.buildTableView(this.dataTable)
            // if (dataDetail.fileDinhKems && dataDetail.fileDinhKems.length > 0) {
            //   dataDetail.fileDinhKems.forEach(item => {
            //     if (item.fileType == FILETYPE.FILE_DINH_KEM) {
            //       this.listFileDinhKem.push(item)
            //     } else if (item.fileType == FILETYPE.CAN_CU_PHAP_LY) {
            //       this.listCcPhapLy.push(item)
            //     }
            //   })
            // }
            this.listFileDinhKem = cloneDeep(dataDetail.fileDinhKem);
            this.listCcPhapLy = cloneDeep(dataDetail.canCu);
          }
        }
      })
      .catch((e) => {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      });
  }
  handleChangeLoaiSapNhap = (loai: string) => {
    if (loai === "SN_CHI_CUC") {
      this.dataTable = this.dataTable.map(f => ({ ...f, maDiemKhoDi: '', tenDiemKhoDi: '', maDiemKhoDen: '', tenDiemKhoDen: '' }));
      this.updateEditCache();
    };
    this.clearData();
  }
  async loadDsCuc() {
    const dsTong = await this.donviService.layTatCaDonViByLevel(2);
    this.dsCuc = dsTong && Array.isArray(dsTong.data) ? dsTong.data.filter(item => item.type != "PB") : []
    this.dsCucDi = cloneDeep(this.dsCuc);
    this.dsCucDen = cloneDeep(this.dsCuc);
  }

  async changeCucDi(event, node) {
    await this.loadDsChiCuc();
    this.dsChiCucDi = this.dsChiCuc.filter(item => item.maDvi.startsWith(event));
    if (node) {
      node.maChiCucDi = null;
      node.maDiemKhoDi = null;
    }
  }

  async changeCucDen(event, node) {
    await this.loadDsChiCuc();
    this.dsChiCucDen = this.dsChiCuc.filter(item => item.maDvi.startsWith(event));
    if (node) {
      node.maChiCucDen = null;
      node.diemKhoDen = null;
    }

  }
  async loadDsChiCuc() {
    const dsTong = await this.donviService.layTatCaDonViByLevel(3);
    this.dsChiCuc = dsTong && Array.isArray(dsTong.data) ? dsTong.data.filter(item => item.type != "PB") : [];
  }
  async changeChiCucDi(event, node) {
    if (this.formData.value.loai !== 'SN_DIEM_KHO') return;
    await this.loadDsDiemKho()
    this.dsKhoDi = this.dsKho.filter(item => item.maDvi.startsWith(event));
    if (node) {
      node.diemKhoDi = null;
    }
  };
  async changeChiCucDen(event, node) {
    if (this.formData.value.loai !== 'SN_DIEM_KHO') return;
    await this.loadDsDiemKho();
    this.dsKhoDen = this.dsKho.filter(item => item.maDvi.startsWith(event));
    if (node) {
      node.diemKhoDen = null;
    }
  };
  async loadDsDiemKho() {
    const dsTong = await this.donviService.layTatCaDonViByLevel(4);
    this.dsKho = dsTong && Array.isArray(dsTong.data) ? dsTong.data.filter(item => item.type != 'PB') : [];
  };
  clearData() {
    this.rowItem = new ItemXhXkVtquyetDinhPdDtl();
  }

  themMoiItem() {
    // this.rowItem.maDiaDiemDi = this.rowItem.maDiemKhoDi;
    // this.rowItem.maDiaDiemDen = this.rowItem.maDiemKhoDen;
    // if (this.rowItem.maDiaDiemDi && this.rowItem.maDiaDiemDen != null) {
    const { loai } = this.formData.value
    if (loai === "SN_DIEM_KHO" && this.rowItem.maDiemKhoDi && this.rowItem.maDiemKhoDen) {
      this.sortTableId();
      let item = cloneDeep(this.rowItem);
      item.tenCucDi = this.dsCucDi.find(s => s.key == item.maCucDi)?.title;
      item.tenChiCucDi = this.dsChiCucDi.find(s => s.key == item.maChiCucDi)?.title;
      item.tenDiemKhoDi = this.dsKhoDi.find(s => s.key == item.maDiemKhoDi)?.title;
      item.tenCucDen = this.dsCucDen.find(s => s.key == item.maCucDen)?.title;
      item.tenChiCucDen = this.dsChiCucDen.find(s => s.key == item.maChiCucDen)?.title;
      item.tenDiemKhoDen = this.dsKhoDen.find(s => s.key == item.maDiemKhoDen)?.title;
      item.stt = this.dataTable.length + 1;
      item.edit = false;
      this.dataTable = [
        ...this.dataTable,
        item,
      ]

      this.rowItem = new ItemXhXkVtquyetDinhPdDtl();
      this.updateEditCache();
    }
    else if (loai === "SN_CHI_CUC" && this.rowItem.maChiCucDi && this.rowItem.maChiCucDen) {
      this.sortTableId();
      let item = cloneDeep(this.rowItem);
      item.tenCucDi = this.dsCucDi.find(s => s.key == item.maCucDi)?.title;
      item.tenChiCucDi = this.dsChiCucDi.find(s => s.key == item.maChiCucDi)?.title;
      item.tenCucDen = this.dsCucDen.find(s => s.key == item.maCucDen)?.title;
      item.tenChiCucDen = this.dsChiCucDen.find(s => s.key == item.maChiCucDen)?.title;
      item.stt = this.dataTable.length + 1;
      item.edit = false;
      this.dataTable = [
        ...this.dataTable,
        item,
      ]

      this.rowItem = new ItemXhXkVtquyetDinhPdDtl();
      this.updateEditCache();
    } else {
      this.notification.error(MESSAGE.ERROR, "Vui lòng điền đầy đủ thông tin")
    }
  }

  sortTableId() {
    this.dataTable.forEach((lt, i) => {
      lt.stt = i + 1;
    });
  }

  checkExitsData(item, dataItem): boolean {
    let rs = false;
    if (dataItem && dataItem.length > 0) {
      dataItem.forEach(it => {
        if (it.tenChiTieu == item.tenChiTieu) {
          rs = true;
          return;
        }
      });
    }
    return rs;
  }

  xoaItem(index: number) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        try {
          this.dataTable.splice(index, 1);
          this.updateEditCache();
          this.dataTable;
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  editItem(index: number): void {
    for (const index in this.dataEdit) {
      if (this.dataEdit[index]) {
        this.dataEdit[index].edit = false
      }
    }
    this.dataEdit[index].edit = true;
    if (this.dataEdit[index]?.edit) {
      if (this.dataEdit[index].data.maCucDi) {
        this.changeCucDi(this.dataEdit[index].data.maCucDi, this.dataEdit[index])
      }
      if (this.dataEdit[index].data.maCucDen) {
        this.changeCucDen(this.dataEdit[index].data.maCucDen, this.dataEdit[index])
      }
      if (this.dataEdit[index].data.maChiCucDi) {
        this.changeChiCucDi(this.dataEdit[index].data.maChiCucDi, this.dataEdit[index])
      }
      if (this.dataEdit[index].data.maChiCucDen) {
        this.changeChiCucDen(this.dataEdit[index].data.maChiCucDen, this.dataEdit[index])
      }
    }
    this.disabledThemMoi();
  }

  updateEditCache(): void {
    if (this.dataTable) {
      this.dataTable.forEach((item, index) => {
        this.dataEdit[index] = {
          edit: false,
          data: { ...item },
        };
      });
    }
    this.disabledThemMoi()
  }

  huyEdit(index: number): void {
    this.dataEdit[index] = {
      data: { ...this.dataTable[index] },
      edit: false,
    };
    this.disabledThemMoi();
  }

  luuEdit(index: number): void {
    this.hasError = (false);
    let item = Object.assign(this.dataTable[index], this.dataEdit[index].data);
    item.tenCucDi = this.dsCucDi.find(s => s.key == item.maCucDi)?.title;
    item.tenChiCucDi = this.dsChiCucDi.find(s => s.key == item.maChiCucDi)?.title;
    item.tenDiemKhoDi = this.dsKhoDi.find(s => s.key == item.maDiemKhoDi)?.title;
    item.tenCucDen = this.dsCucDen.find(s => s.key == item.maCucDen)?.title;
    item.tenChiCucDen = this.dsChiCucDen.find(s => s.key == item.maChiCucDen)?.title;
    item.tenDiemKhoDen = this.dsKhoDen.find(s => s.key == item.maDiemKhoDen)?.title;
    this.dataEdit[index].edit = false;
    this.disabledThemMoi()

  }
  disabledThemMoi() {
    this.clearData();
    this.dsChiCuc = [];
    this.dsChiCucDi = [];
    this.dsChiCucDen = [];
    this.dsKho = [];
    this.dsKhoDi = [];
    this.dsKhoDen = [];
    let result = [];
    for (const index in this.dataEdit) {
      if (this.dataEdit[index]?.edit) {
        result.push(index)
      }
    };
    if (result.length > 0) {
      this.isDisabledThemMoi = true
    } else {
      this.isDisabledThemMoi = false;
    }
  };

  checkRoleApprove(trangThai: string) {
    return trangThai !== STATUS.BAN_HANH && this.userService.isAccessPermisson("QLKT_THSDK_QDDCSN_THEM") && this.userService.isCuc()
  }
  checkRoleSave(trangThai: string) {
    return trangThai !== STATUS.BAN_HANH && this.userService.isAccessPermisson("QLKT_THSDK_QDDCSN_THEM") && this.userService.isCuc()
  }
  checkRoleDuyetDMKho(trangThai: string) {
    return trangThai === STATUS.BAN_HANH && (this.userService.isAccessPermisson("QLKT_THSDK_DDMK_XEM") || this.userService.isAccessPermisson("QLKT_THSDK_DDMK_DUYET")) && this.userService.isCuc();
  }

}


export class ItemXhXkVtquyetDinhPdDtl {
  id: string;
  maDiaDiemDi: string;
  maCucDi: string;
  tenCucDi: string;
  maChiCucDi: string;
  tenChiCucDi: string;
  maDiemKhoDi: string;
  tenDiemKhoDi: string;
  maDiaDiemDen: string;
  maCucDen: string;
  tenCucDen: string;
  maChiCucDen: string;
  tenChiCucDen: string;
  maDiemKhoDen: string;
  tenDiemKhoDen: string;
  ghiChu: string;
}
