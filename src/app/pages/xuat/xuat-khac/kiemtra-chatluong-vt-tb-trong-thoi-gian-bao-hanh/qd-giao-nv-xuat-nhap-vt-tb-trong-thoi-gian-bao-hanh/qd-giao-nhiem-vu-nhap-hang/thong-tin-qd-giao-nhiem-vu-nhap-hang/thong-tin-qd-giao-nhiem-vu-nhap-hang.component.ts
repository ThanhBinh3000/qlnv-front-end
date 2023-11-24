import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { v4 as uuidv4 } from "uuid";
import { Validators } from "@angular/forms";
import * as dayjs from "dayjs";
import { Base2Component } from "../../../../../../../components/base2/base2.component";
import { StorageService } from "../../../../../../../services/storage.service";
import { DonviService } from "../../../../../../../services/donvi.service";
import { DanhMucService } from "../../../../../../../services/danhmuc.service";
import { STATUS } from "../../../../../../../constants/status";
import { MESSAGE } from "../../../../../../../constants/message";
import { LOAI_HH_XUAT_KHAC } from "../../../../../../../constants/config";
import { FILETYPE } from "../../../../../../../constants/fileType";
import { DialogTuChoiComponent } from "../../../../../../../components/dialog/dialog-tu-choi/dialog-tu-choi.component";
import {
  QdGiaoNvNhapHangTrongThoiGianBaoHanhService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvtbaohanh/QdGiaoNvNhapHangTrongThoiGianBaoHanh.service";
import {
  PhieuKdclVtTbTrongThoiGianBaoHanhService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvtbaohanh/PhieuKdclVtTbTrongThoiGianBaoHanh.service";
import {
  DialogTableCheckBoxComponent
} from "../../../../../../../components/dialog/dialog-table-check-box/dialog-table-check-box.component";
import { chain, cloneDeep } from 'lodash';
import { isArray } from "rxjs/internal-compatibility";
import {
  PhieuKtclVtTbTrongThoiGianBaoHanhService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvtbaohanh/PhieuKtclVtTbTrongThoiGianBaoHanh.service";

@Component({
  selector: 'app-thong-tin-qd-giao-nhiem-vu-nhap-hang',
  templateUrl: './thong-tin-qd-giao-nhiem-vu-nhap-hang.component.html',
  styleUrls: ['./thong-tin-qd-giao-nhiem-vu-nhap-hang.component.scss']
})
export class ThongTinQdGiaoNhiemVuNhapHangComponent extends Base2Component implements OnInit {
  @Input('isViewDetail') isViewDetail: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input()
  idInput: number;
  listCcPhapLy: any[] = [];
  listFileDinhKem: any[] = [];
  listFile: any[] = [];
  listPhieuKdcl: any[] = [];
  listPhieuKtcl: any[] = [];
  listDtl: any[] = [];
  allChecked: boolean;
  maQd: string;
  expandSetString = new Set<string>();


  constructor(httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donviService: DonviService,
    private danhMucService: DanhMucService,
    private phieuKdclVtTbTrongThoiGianBaoHanhService: PhieuKdclVtTbTrongThoiGianBaoHanhService,
    private phieuKtclVtTbTrongThoiGianBaoHanhService: PhieuKtclVtTbTrongThoiGianBaoHanhService,
    private qdGiaoNvNhapHangTrongThoiGianBaoHanhService: QdGiaoNvNhapHangTrongThoiGianBaoHanhService) {
    super(httpClient, storageService, notification, spinner, modal, qdGiaoNvNhapHangTrongThoiGianBaoHanhService);
    this.formData = this.fb.group({
      id: [],
      maDvi: [this.userInfo.MA_DVI],
      loai: ["NHAP_MAU", [Validators.required]],
      nam: [dayjs().get("year"), [Validators.required]],
      soQuyetDinh: [],
      ngayKy: [],
      soCanCu: [],
      idCanCu: [],
      tenDvi: [],
      soLanLm: [],
      thoiHanXuatHang: [],
      lyDoTuChoi: [],
      trichYeu: [],
      trangThai: [STATUS.DU_THAO],
      trangThaiXh: [STATUS.CHUA_THUC_HIEN],
      tenTrangThai: ['Dự thảo'],
      qdGiaonvXhDtl: [new Array<ItemXhXkVtQdGiaonvXhDtl>()],
      loaiCanCu: [],
      soBaoCaoKdm: [],
      idBaoCaoKdm: [],
      loaiXn: ["NHAP"],
      soPhieuNk: [],
      idPhieuNk: [],
      soBbKtNk: [],
      idBbKtNk: [],
    })
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.maQd = "/" + this.userInfo.MA_QD
      await Promise.all([
        // this.loadDanhSachPhieuKdcl(),
      ]);
      if (this.idInput) {
        this.getDetail(this.idInput)
      } else {
        this.bindingData();
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }


  async buildTableView(data?: any) {
    this.dataTable = chain(data)
      .groupBy("tenChiCuc")
      .map((v, k) => {
        let rowItem = v.find(s => s.tenChiCuc === k);
        let idVirtual = uuidv4();
        this.expandSetString.add(idVirtual);
        return {
          idVirtual: idVirtual,
          tenChiCuc: k,
          tenCuc: rowItem?.tenCuc,
          maDiaDiem: rowItem?.maDiaDiem,
          tenCloaiVthh: rowItem?.tenCloaiVthh,
          childData: v
        }
      }
      ).value();
  }

  async bindingData() {
    let res = await this.donviService.getDonVi({ str: this.userInfo.MA_DVI });
    if (res && res.data) {
      this.formData.patchValue({
        tenDvi: res.data.tenDvi,
      })
    }
  }


  onExpandStringChange(id: string, checked: boolean) {
    if (checked) {
      this.expandSetString.add(id);
    } else {
      this.expandSetString.delete(id);
    }
  }

  async save(isGuiDuyet?) {
    let body = this.formData.value;
    this.listFile = [];
    if (this.listFileDinhKem.length > 0) {
      this.listFileDinhKem.forEach(item => {
        item.fileType = FILETYPE.FILE_DINH_KEM
        this.listFile.push(item)
      });
    }
    if (this.listCcPhapLy.length > 0) {
      this.listCcPhapLy.forEach(element => {
        element.fileType = FILETYPE.CAN_CU_PHAP_LY
        this.listFile.push(element)
      });
    }
    if (this.listFile && this.listFile.length > 0) {
      this.formData.value.fileDinhKems = this.listFile;
    }
    this.formData.value.soQuyetDinh = this.formData.value.soQuyetDinh + this.maQd;
    if (body.soCanCu && isArray(body.soCanCu)) {
      body.soCanCu = body.soCanCu.join(",");
    }
    if (body.idCanCu && isArray(body.idCanCu)) {
      body.idCanCu = body.idCanCu.join(",");
    }
    if (body.loai == "NHAP_SAU_BH") {
      this.listDtl = this.listPhieuKtcl.map((item) => ({ ...item, id: null }));
    } else {
      this.listDtl = this.listPhieuKdcl.map((item) => ({ ...item, id: null }));
    }

    body.qdGiaonvXhDtl = this.listDtl;
    let data = await this.createUpdate(body);
    if (data) {
      if (isGuiDuyet) {
        this.idInput = data.id;
        this.pheDuyet();
      }
    }
  }

  async flattenTree(tree) {
    return tree.flatMap((item) => {
      return item.childData ? this.flattenTree(item.childData) : item;
    });
  }

  pheDuyet(id?) {
    let trangThai = ''
    let mess = ''
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
      nzWidth: 500,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: id ? id : this.idInput,
            trangThai: trangThai,
          };
          let res =
            await this.qdGiaoNvNhapHangTrongThoiGianBaoHanhService.approve(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.goBack()
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

  tuChoi() {
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
          let trangThai;
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
          let body = {
            id: this.idInput,
            lyDoTuChoi: text,
            trangThai: trangThai,
          };
          const res = await this.qdGiaoNvNhapHangTrongThoiGianBaoHanhService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TU_CHOI_SUCCESS);
            this.goBack();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      }
    });
  }

  async getDetail(id: number) {
    await this.qdGiaoNvNhapHangTrongThoiGianBaoHanhService
      .getDetail(id)
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          const dataDetail = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, dataDetail);
          if (dataDetail) {
            this.formData.patchValue({
              soQuyetDinh: dataDetail.soQuyetDinh?.split('/')[0],
            })
            this.listFile = dataDetail.fileDinhKems;
            this.dataTable = dataDetail.qdGiaonvXhDtl;
            this.buildTableView(this.dataTable)
            if (dataDetail.fileDinhKems && dataDetail.fileDinhKems.length > 0) {
              dataDetail.fileDinhKems.forEach(item => {
                if (item.fileType == FILETYPE.FILE_DINH_KEM) {
                  this.listFileDinhKem.push(item)
                } else if (item.fileType == FILETYPE.CAN_CU_PHAP_LY) {
                  this.listCcPhapLy.push(item)
                }
              })
            }
          }
        }
      })
      .catch((e) => {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      });
  }

  async loadDanhSachPhieuKdcl() {
    let body = {
      loai: LOAI_HH_XUAT_KHAC.VT_BH,
      nam: this.formData.value.nam,
      trangThai: STATUS.DA_DUYET_LDC,
      paggingReq: {
        limit: 1000,
        page: this.page - 1
      }
    }
    let rs = await this.phieuKdclVtTbTrongThoiGianBaoHanhService.search(body);
    if (rs.msg == MESSAGE.SUCCESS) {
      let data = rs.data.content;
      this.listPhieuKdcl = data.filter(i => i.mauBiHuy == false);
    }
    return this.listPhieuKdcl;
  }

  async openDialogPhieuKdcl() {
    await this.loadDanhSachPhieuKdcl();
    const modalQD = this.modal.create({
      nzTitle: 'CĂN CỨ BÁO CÁO KẾT QUẢ KIỂM ĐỊNH MẪU',
      nzContent: DialogTableCheckBoxComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listPhieuKdcl,
        dataHeader: ['Năm', 'Số phiếu KĐCL', 'Ngày Kiểm định'],
        dataColumn: ['nam', 'soPhieu', 'ngayKiemDinh'],
        allChecked: this.allChecked,
        actionRefresh: false,
      },
    })
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.bindingDataBaoCao(data)
      }
    });
  }

  bindingDataBaoCao(data: any) {
    this.listPhieuKdcl = cloneDeep(data.data);
    this.allChecked = data.allChecked;
    if (this.allChecked) {
      this.formData.patchValue({
        soCanCu: this.listPhieuKdcl.filter(f => f.checked).map(m => m.soPhieu),
        idCanCu: this.listPhieuKdcl.filter(f => f.checked).map(m => m.id)
      })
    } else {
      this.formData.patchValue({
        soCanCu: this.listPhieuKdcl.filter(f => f.checked).map(m => m.soPhieu),
        idCanCu: this.listPhieuKdcl.filter(f => f.checked).map(m => m.id)
      })
    }
    this.buildTableView(this.listPhieuKdcl);
  }

  async loadDanhSachPhieuKtcl() {
    let body = {
      nam: this.formData.value.nam,
      trangThai: STATUS.DA_HOAN_THANH,

    }
    let rs = await this.phieuKtclVtTbTrongThoiGianBaoHanhService.search(body);
    if (rs.msg == MESSAGE.SUCCESS) {
      let data = rs.data.content;
      this.listPhieuKtcl = data.filter(i => i.mauBiHuy == false);
      this.listPhieuKtcl = this.listPhieuKtcl.map((item) => ({ ...item, slLayMau: item.slBaoHanh }));
      console.log(this.listPhieuKtcl, 'this.listPhieuKtcl ')
    }
    return this.listPhieuKtcl;
  }

  async openDialogPhieuKtcl() {
    await this.loadDanhSachPhieuKtcl();
    const modalQD = this.modal.create({
      nzTitle: 'CĂN CỨ BÁO CÁO KẾT QUẢ KIỂM ĐỊNH MẪU',
      nzContent: DialogTableCheckBoxComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listPhieuKtcl,
        dataHeader: ['Năm', 'Số phiếu KTCL', 'Ngày Kiểm tra'],
        dataColumn: ['nam', 'soPhieu', 'ngayKiemTra'],
        allChecked: this.allChecked,
        actionRefresh: false,
      },
    })
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.bindingDataKtcl(data)
      }
    });
  }

  bindingDataKtcl(data: any) {
    this.listPhieuKtcl = cloneDeep(data.data);
    this.allChecked = data.allChecked;
    if (this.allChecked) {
      this.formData.patchValue({
        soCanCu: this.listPhieuKtcl.filter(f => f.checked).map(m => m.soPhieu),
        idCanCu: this.listPhieuKtcl.filter(f => f.checked).map(m => m.id)
      })
    } else {
      this.formData.patchValue({
        soCanCu: this.listPhieuKtcl.filter(f => f.checked).map(m => m.soPhieu),
        idCanCu: this.listPhieuKtcl.filter(f => f.checked).map(m => m.id)
      })
    }
    this.buildTableView(this.listPhieuKtcl);
  }
}


export class ItemXhXkVtQdGiaonvXhDtl {
  id: string;
  maDiaDiem: string;
  loaiVthh: string;
  cloaiVthh: string;
  donViTinh: string;
  tenCuc: string;
  tenChiCuc: string;
  tenDiemKho: string;
  tenNhaKho: string;
  tenNganKho: string;
  tenLoKho: string;
  maDviTsan: string;
  slLayMau: number;
  slTonKho: number;
}
