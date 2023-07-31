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
  maQd: string;
  listMaTongHop: any[] = []
  dataTh: any[] = [];
  dataThEdit: any[] = [];
  dataThTree: any[] = [];
  expandSetString = new Set<string>();

  isViewModel: boolean = false;

  constructor(httpClient: HttpClient,
              storageService: StorageService,
              notification: NzNotificationService,
              spinner: NgxSpinnerService,
              modal: NzModalService,
              private donviService: DonviService,
              private danhMucService: DanhMucService,
              private tongHopDanhSachVtTbTrongThoiGIanBaoHanh: TongHopDanhSachVtTbTrongThoiGIanBaoHanh,
              private qdGiaoNvXuatHangTrongThoiGianBaoHanhService: QdGiaoNvXuatHangTrongThoiGianBaoHanhService) {
    super(httpClient, storageService, notification, spinner, modal, qdGiaoNvXuatHangTrongThoiGianBaoHanhService);
    this.formData = this.fb.group({
      id: [],
      maDvi: [this.userInfo.MA_DVI],
      loai: ["XUAT_MAU", [Validators.required]],
      nam: [dayjs().get("year"), [Validators.required]],
      soQuyetDinh: [],
      ngayKy: [],
      soCanCu: [],
      idCanCu: [],
      tenDvi: [],
      soLanLm: [1],
      thoiHanXuatHang: [],
      lyDoTuChoi: [],
      trichYeu: [],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự thảo'],
      qdGiaonvXhDtl: [new Array<ItemXhXkVtQdGiaonvXhDtl>()],
      loaiCanCu: ["TONG_HOP"],
      loaiXn: ["XUAT"],
    })
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.maQd = "/" + this.userInfo.MA_QD
      await Promise.all([
        this.loadDanhSachTongHop(),
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

  openDialogDsTongHop() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách tổng hợp',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listMaTongHop,
        dataHeader: ['Năm', 'Mã danh sách', 'Trạng thái'],
        dataColumn: ['nam', 'maDanhSach', 'tenTrangThai']
      },
    });
    modalQD.afterClose.subscribe((data) => {
      if (data) {
        this.formData.patchValue({
          idCanCu: data.id,
          soCanCu: data.maDanhSach
        });
        console.log(data.tongHopDtl, ' data.tongHopDtl data.tongHopDtl')
        data.tongHopDtl.forEach(item => {
          let it = new ItemXhXkVtQdGiaonvXhDtl();
          it.id = item.id;
          it.maDiaDiem = item.maDiaDiem;
          it.loaiVthh = item.loaiVthh;
          it.cloaiVthh = item.cloaiVthh;
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
        this.dataTh.forEach((item) => {
          this.dataThEdit[item.id] = {...item};
        });
        this.buildTableView(this.dataTh);
      }
    });
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
    console.log(this.dataThTree, 'this.dataThTreethis.dataThTree')
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
    if (this.dataTh && this.dataThEdit) {
      this.dataTh.forEach(item => {
        item.maDviTsan = this.dataThEdit[item.id]?.maDviTsan ? this.dataThEdit[item.id].maDviTsan : null;
        item.slLayMau = this.dataThEdit[item.id]?.slLayMau ? this.dataThEdit[item.id]?.slLayMau : 0;
      })
    }
    this.formData.value.qdGiaonvXhDtl = this.dataTh;
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
      this.notification.error(MESSAGE.ERROR, "Có lỗi xảy ra.");
    }
  }

  pheDuyet(id?) {
    let trangThai = ''
    let mess = ''
    switch (this.formData.get('trangThai').value) {
      case STATUS.DU_THAO:
      case STATUS.TU_CHOI_LDC: {
        trangThai = STATUS.CHO_DUYET_LDC;
        mess = 'Bạn có muối gửi duyệt?'
        break;
      }
      case STATUS.CHO_DUYET_LDC: {
        trangThai = STATUS.DA_DUYET_LDC;
        mess = 'Bạn có chắc chắn muốn phê duyệt ?'
        break;
      }
      case STATUS.CHO_DUYET_LDC: {
        trangThai = STATUS.TU_CHOI_LDC;
        mess = 'Bạn có chắc chắn muốn từ chối ?'
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
            case STATUS.CHO_DUYET_LDC: {
              trangThai = STATUS.TU_CHOI_LDC
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
              soQuyetDinh: dataDetail.soQuyetDinh?.split('/')[0],
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
            this.dataTh = cloneDeep(dataDetail.qdGiaonvXhDtl);
            this.dataTh.forEach((item) => {
              this.dataThEdit[item.id] = {...item};
            });
            this.buildTableView(this.dataTh);
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

  handleOk(data) {
    this.isViewModel = false;
    if (data) {
      this.formData.patchValue({
        idCanCu: data.id,
        soCanCu: data.maDanhSach
      });
      console.log(data.tongHopDtl, ' data.tongHopDtl data.tongHopDtl')
      data.tongHopDtl.forEach(item => {
        let it = new ItemXhXkVtQdGiaonvXhDtl();
        it.id = item.id;
        it.maDiaDiem = item.maDiaDiem;
        it.loaiVthh = item.loaiVthh;
        it.cloaiVthh = item.cloaiVthh;
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
      this.dataTh.forEach((item) => {
        this.dataThEdit[item.id] = {...item};
      });
      this.buildTableView(this.dataTh);
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
