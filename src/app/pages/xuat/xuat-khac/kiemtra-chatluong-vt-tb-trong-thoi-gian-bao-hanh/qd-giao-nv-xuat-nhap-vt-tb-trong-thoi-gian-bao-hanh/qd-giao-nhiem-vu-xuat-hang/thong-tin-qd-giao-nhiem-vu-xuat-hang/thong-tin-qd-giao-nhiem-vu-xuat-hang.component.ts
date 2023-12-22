import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {v4 as uuidv4} from "uuid";
import {chain, cloneDeep} from "lodash";
import {Validators} from "@angular/forms";
import * as dayjs from "dayjs";
import {Base2Component} from "../../../../../../../components/base2/base2.component";
import {StorageService} from "../../../../../../../services/storage.service";
import {DonviService} from "../../../../../../../services/donvi.service";
import {DanhMucService} from "../../../../../../../services/danhmuc.service";
import {
  TongHopDanhSachVtTbTrongThoiGIanBaoHanh
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvtbaohanh/TongHopDanhSachVtTbTrongThoiGIanBaoHanh.service";
import {
  QdGiaoNvXuatHangTrongThoiGianBaoHanhService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvtbaohanh/QdGiaoNvXuatHangTrongThoiGianBaoHanh.service";
import {STATUS} from "../../../../../../../constants/status";
import {MESSAGE} from "../../../../../../../constants/message";
import {
  DialogTableSelectionComponent
} from "../../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import {LOAI_HH_XUAT_KHAC} from "../../../../../../../constants/config";
import {FILETYPE} from "../../../../../../../constants/fileType";
import {DialogTuChoiComponent} from "../../../../../../../components/dialog/dialog-tu-choi/dialog-tu-choi.component";
import {
  QuyetDinhXuatGiamVtBaoHanhService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvtbaohanh/QuyetDinhXuatGiamVtBaoHanh.service";
import {
  PhieuKdclVtTbTrongThoiGianBaoHanhService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvtbaohanh/PhieuKdclVtTbTrongThoiGianBaoHanh.service";
import {isArray} from "rxjs/internal-compatibility";
import {
  BienBanYeuCauBaoHanhService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvtbaohanh/BienBanYeuCauBaoHanh.service";
import {
  DialogTableCheckBoxComponent
} from "../../../../../../../components/dialog/dialog-table-check-box/dialog-table-check-box.component";
import {MangLuoiKhoService} from "../../../../../../../services/qlnv-kho/mangLuoiKho.service";

@Component({
  selector: 'app-thong-tin-qd-giao-nhiem-vu-xuat-hang',
  templateUrl: './thong-tin-qd-giao-nhiem-vu-xuat-hang.component.html',
  styleUrls: ['./thong-tin-qd-giao-nhiem-vu-xuat-hang.component.scss']
})
export class ThongTinQdGiaoNhiemVuXuatHangComponent extends Base2Component implements OnInit {
  @Input('isViewDetail') isViewDetail: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input()
  idInput: number;
  listCcPhapLy: any[] = [];
  listFileDinhKem: any[] = [];
  listFile: any[] = [];
  listSoQdXuatGiam: any[] = [];
  listSoBbBaoHanh: any[] = [];
  maQd: string;
  listMaTongHop: any[] = []
  listPhieuKdcl: any[] = []
  dataTh: any[] = [];
  dataThEdit: any[] = [];
  dataThTree: any[] = [];
  expandSetString = new Set<string>();

  isViewModel: boolean = false;
  maDviTsan: any;
  slLayMau: any;

  constructor(httpClient: HttpClient,
              storageService: StorageService,
              notification: NzNotificationService,
              spinner: NgxSpinnerService,
              modal: NzModalService,
              private donviService: DonviService,
              private danhMucService: DanhMucService,
              private mangLuoiKhoService: MangLuoiKhoService,
              private tongHopDanhSachVtTbTrongThoiGIanBaoHanh: TongHopDanhSachVtTbTrongThoiGIanBaoHanh,
              private phieuKdclVtTbTrongThoiGianBaoHanhService: PhieuKdclVtTbTrongThoiGianBaoHanhService,
              private quyetDinhXuatGiamVtBaoHanhService: QuyetDinhXuatGiamVtBaoHanhService,
              private banYeuCauBaoHanhService: BienBanYeuCauBaoHanhService,
              private qdGiaoNvXuatHangTrongThoiGianBaoHanhService: QdGiaoNvXuatHangTrongThoiGianBaoHanhService) {
    super(httpClient, storageService, notification, spinner, modal, qdGiaoNvXuatHangTrongThoiGianBaoHanhService);
    this.formData = this.fb.group({
      id: [],
      maDvi: [this.userInfo.MA_DVI],
      loai: ["XUAT_MAU", [Validators.required]],
      nam: [dayjs().get("year"), [Validators.required]],
      soQuyetDinh: ['', [Validators.required]],
      ngayKy: [],
      soCanCu: [],
      idCanCu: [],
      tenDvi: [],
      soLanLm: [1],
      thoiHanXuatHang: [],
      lyDoTuChoi: [],
      trichYeu: [],
      trangThai: [STATUS.DU_THAO],
      trangThaiXh: [STATUS.CHUA_THUC_HIEN],
      tenTrangThai: ['Dự thảo'],
      qdGiaonvXhDtl: [new Array<ItemXhXkVtQdGiaonvXhDtl>()],
      loaiCanCu: [],
      loaiXn: ["XUAT"],
    })
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.maQd = "/" + this.userInfo.MA_QD
      await Promise.all([
        this.loadDanhSachTongHop(),
        this.loadDanhSachPhieuKdcl(),
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
    this.dataThTree = chain(data)
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
    let res = await this.donviService.getDonVi({str: this.userInfo.MA_DVI});
    if (res && res.data) {
      this.formData.patchValue({
        tenDvi: res.data.tenDvi,
      })
    }
  }

  async loadDanhSachTongHop() {
    let body = {
      loai: LOAI_HH_XUAT_KHAC.VT_BH,
      namKeHoach: this.formData.value.namKeHoach,
      trangThai: STATUS.GUI_DUYET,
      paggingReq: {
        limit: 1000,
        page: this.page - 1
      }
    }
    let rs = await this.tongHopDanhSachVtTbTrongThoiGIanBaoHanh.search(body);
    if (rs.msg == MESSAGE.SUCCESS) {
      this.listMaTongHop = rs.data.content;
    }
  }

  async loadDanhSachPhieuKdcl() {
    let body = {
      nam: this.formData.value.namKeHoach,
      trangThai: STATUS.DA_DUYET_LDC,
      paggingReq: {
        limit: 1000,
        page: this.page - 1
      }
    }
    let rs = await this.phieuKdclVtTbTrongThoiGianBaoHanhService.search(body);
    if (rs.msg == MESSAGE.SUCCESS) {
      this.listPhieuKdcl = rs.data.content.filter(i => i.isDat == false);
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
    this.helperService.markFormGroupTouched(this.formData)
    if (this.formData.invalid) {
      return;
    }
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
    if (this.formData.value.loai == "XUAT_MAU") {
      if (this.formData.value.loaiCanCu == "TONG_HOP") {
        this.formData.value.qdGiaonvXhDtl = this.conVertTreeToList(this.dataThTree);
      } else if (this.formData.value.loaiCanCu == "PHIEU_KDCL") {
        let body = this.formData.value;
        if (body.soCanCu && isArray(body.soCanCu)) {
          body.soCanCu = body.soCanCu.join(",");
        }
        if (body.idCanCu && isArray(body.idCanCu)) {
          body.idCanCu = body.idCanCu.join(",");
        }
        this.formData.value.qdGiaonvXhDtl = this.conVertTreeToList(this.dataThTree);
      }
    }
    if (this.formData.value.loai == "XUAT_BH") {
      let body = this.formData.value;
      if (body.soCanCu && isArray(body.soCanCu)) {
        body.soCanCu = body.soCanCu.join(",");
      }
      if (body.idCanCu && isArray(body.idCanCu)) {
        body.idCanCu = body.idCanCu.join(",");
      }
      this.formData.value.qdGiaonvXhDtl = this.conVertTreeToList(this.dataThTree);
    }
    let data = await this.createUpdate(this.formData.value);
    if (data) {
      if (!this.idInput) {
        this.idInput = data.id;
        this.formData.patchValue({id: data.id, trangThai: data.trangThai});
      }
      if (isGuiDuyet) {
        this.pheDuyet(this.formData.get("id").value)
      }
    } else {
      this.notification.error(MESSAGE.ERROR, data.msg);
    }
  }

  conVertTreeToList(data) {
    let arr = [];
    data.forEach(item => {
      if (item.childData && item.childData.length > 0) {
        item.childData.forEach(data => {
          arr.push(data);
        });
      } else {
        arr.push(item);
      }
    });
    return arr;
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
            await this.qdGiaoNvXuatHangTrongThoiGianBaoHanhService.approve(
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
          const res = await this.qdGiaoNvXuatHangTrongThoiGianBaoHanhService.approve(body);
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
    await this.qdGiaoNvXuatHangTrongThoiGianBaoHanhService
      .getDetail(id)
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          const dataDetail = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, dataDetail);
          if (dataDetail) {
            this.formData.patchValue({
              soQuyetDinh: dataDetail.soQuyetDinh ? dataDetail.soQuyetDinh.split('/')[0] : '',
            })
            this.listFile = dataDetail.fileDinhKems;
            if (dataDetail.fileDinhKems && dataDetail.fileDinhKems.length > 0) {
              dataDetail.fileDinhKems.forEach(item => {
                if (item.fileType == FILETYPE.FILE_DINH_KEM) {
                  this.listFileDinhKem.push(item)
                } else if (item.fileType == FILETYPE.CAN_CU_PHAP_LY) {
                  this.listCcPhapLy.push(item)
                }
              })
            }
            if (this.formData.value.loai == "XUAT_MAU") {
              this.dataTh = cloneDeep(dataDetail.qdGiaonvXhDtl);
              this.dataTh.forEach((item) => {
                this.dataThEdit[item.id] = {...item};
              });
              this.buildTableView(this.dataTh);
            } else if (this.formData.value.loai == "XUAT_HUY") {
              let dataXg = cloneDeep(dataDetail.qdGiaonvXhDtl);
              this.buildTableView(dataXg);
            } else {
              this.dataTh = cloneDeep(dataDetail.qdGiaonvXhDtl);
              this.dataTh.forEach((item) => {
                this.dataThEdit[item.id] = {...item};
              });
              this.buildTableView(this.dataTh);
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

  showModal(isViewModel: boolean) {
    this.isViewModel = isViewModel;
  }

  closeModal() {
    this.isViewModel = false;
  }

  async NamNhapKHo(event) {
    let body = {
      maDvi: event,
      capDvi: (event?.length / 2 - 1),
    };
    const detail = await this.mangLuoiKhoService.getDetailByMa(body);
    if (detail.statusCode == 0) {
      return detail.data.object.namNhap ? detail.data.object.namNhap : null;
    }
  }

  async handleOk(data) {
    this.isViewModel = false;
    if (data) {
      if (this.formData.value.loaiCanCu == "TONG_HOP") {
        this.formData.patchValue({
          idCanCu: data.id,
          soCanCu: data.maDanhSach
        });
        this.dataTh = [];
        const promises = data.tongHopDtl.map(async (item) => {
          let namNhapKHo = await this.NamNhapKHo(item.maDiaDiem);
          let it = new ItemXhXkVtQdGiaonvXhDtl();
          it.id = item.id;
          it.maDiaDiem = item.maDiaDiem;
          it.loaiVthh = item.loaiVthh;
          it.cloaiVthh = item.cloaiVthh;
          it.tenLoaiVthh = item.tenLoaiVthh;
          it.tenCloaiVthh = item.tenCloaiVthh;
          it.namNhap = namNhapKHo;
          it.donViTinh = item.donViTinh;
          it.tenCuc = item.tenCuc;
          it.tenChiCuc = item.tenChiCuc;
          it.tenDiemKho = item.tenDiemKho;
          it.tenNhaKho = item.tenNhaKho;
          it.tenNganKho = item.tenNganKho;
          it.tenLoKho = item.tenLoKho;
          it.slTonKho = item.slTonKho;
          it.maDviTsan = "";
          it.slLayMau = 0;
          this.dataTh.push(it);
        });

        await Promise.all(promises);
        this.dataTh.forEach((item) => {
          this.dataThEdit[item.id] = { ...item };
        });

        this.buildTableView(this.dataTh);
      } else if (this.formData.value.loaiCanCu == "PHIEU_KDCL") {
        this.listPhieuKdcl = cloneDeep(data)
        this.listPhieuKdcl = this.listPhieuKdcl.filter(f => f.checked);
        this.dataTable = this.listPhieuKdcl;
        this.formData.patchValue({
          soCanCu: this.listPhieuKdcl.map(m => m.soPhieu),
          idCanCu: this.listPhieuKdcl.map(m => m.id),
          qdGiaonvXhDtl: this.listPhieuKdcl,
        });
        this.buildTableView(this.dataTable);
      }

    }
  }

  changeLoai(loai) {
    if (loai == "XUAT_MAU") {
      this.formData.patchValue({
        loaiCanCu: 'TONG_HOP'
      });
    } else {
      this.formData.patchValue({
        loaiCanCu: null,
      });
    }

  }

  chonLoaiCc(loai) {
    if (loai == "TONG_HOP") {
      this.formData.patchValue({
        soLanLm: 1
      });
    }
    if (loai == "PHIEU_KDCL") {
      this.formData.patchValue({
        soLanLm: 2
      });
    }
  }

  async loadSoQdXuatGiam() {
    let body = {
      namKeHoach: this.formData.get("nam").value,
      dvql: this.userInfo.MA_DVI,
      trangThai: STATUS.BAN_HANH,
    }
    let res = await this.quyetDinhXuatGiamVtBaoHanhService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoQdXuatGiam = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async openDialogSoQdXuatGiam() {
    await this.loadSoQdXuatGiam();
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách quyết định xuất giảm vật tư',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listSoQdXuatGiam,
        dataHeader: ['Năm', 'Số quyết định', 'Ngày ký',],
        dataColumn: ['namKeHoach', 'soQuyetDinh', 'ngayKy',],
      },
    })
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.bindingDataQd(data);
      }
    });
  }

  async bindingDataQd(data) {
    try {
      await this.spinner.show();
      let dataRes = await this.quyetDinhXuatGiamVtBaoHanhService.getDetail(data.id)
      const responseData = dataRes.data;
      this.dataTable = responseData.qdXuatGiamVtDtl;
      this.formData.patchValue({
        soCanCu: responseData.soQuyetDinh,
        idCanCu: responseData.id,
        ngayKy: responseData.ngayKy,
        qdGiaonvXhDtl: this.dataTable,
      });
      this.buildTableView(this.dataTable)
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e.msg);
    } finally {
      await this.spinner.hide();
    }
  }

  async loadSoBbBaoHanh() {
    let body = {
      nam: this.formData.get("nam").value,
      dvql: this.userInfo.MA_DVI,
      trangThai: STATUS.DA_HOAN_THANH,
    }
    let res = await this.banYeuCauBaoHanhService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoBbBaoHanh = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async openDialogBbBaoHanh() {
    await this.loadSoBbBaoHanh();
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách số quyết định giao nhiệm vụ xuất hàng',
      nzContent: DialogTableCheckBoxComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listSoBbBaoHanh,
        dataHeader: ['Năm', 'Số quyết định', 'Ngày lập biên bản',],
        dataColumn: ['nam', 'soBienBan', 'ngayLapBb',],
        allChecked: this.allChecked,
        actionRefresh: false,
      },
    })
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.bindingDataBb(data);
      }
    });
  }

  bindingDataBb(data: any) {
    this.listSoBbBaoHanh = cloneDeep(data.data);
    this.allChecked = data.allChecked;

    this.listSoBbBaoHanh = this.listSoBbBaoHanh.filter(f => f.checked);
    this.dataTable = this.listSoBbBaoHanh
    console.log(this.dataTable, "this.dataTable")
    this.formData.patchValue({
      soCanCu: this.listSoBbBaoHanh.map(m => m.soBienBan),
      idCanCu: this.listSoBbBaoHanh.map(m => m.id),
      qdGiaonvXhDtl: this.dataTable,
    });
    this.buildTableView(this.dataTable);
  }

}

export class ItemXhXkVtQdGiaonvXhDtl {
  id: string;
  maDiaDiem: string;
  loaiVthh: string;
  cloaiVthh: string;
  tenLoaiVthh: string;
  tenCloaiVthh: string;
  namNhap: number;
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
