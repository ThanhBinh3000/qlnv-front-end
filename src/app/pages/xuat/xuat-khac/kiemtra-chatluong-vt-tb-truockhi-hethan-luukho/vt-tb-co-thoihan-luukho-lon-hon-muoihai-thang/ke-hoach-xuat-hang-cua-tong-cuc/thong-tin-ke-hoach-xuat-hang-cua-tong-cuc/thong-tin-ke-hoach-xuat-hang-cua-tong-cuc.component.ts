import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Base2Component } from "../../../../../../../components/base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { DonviService } from "../../../../../../../services/donvi.service";
import { DanhMucService } from "../../../../../../../services/danhmuc.service";
import { v4 as uuidv4 } from "uuid";
import {
  KeHoachXuatHangService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/KeHoachXuatHang.service";
import { AMOUNT_NO_DECIMAL } from "../../../../../../../Utility/utils";
import { MESSAGE } from "../../../../../../../constants/message";
import { STATUS } from "../../../../../../../constants/status";
import { NumberToRoman } from "../../../../../../../shared/commonFunction";
import { chain, cloneDeep, isEmpty } from "lodash";
import {
  DialogTableSelectionComponent
} from "../../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import { Validators } from "@angular/forms";
import { FILETYPE } from "../../../../../../../constants/fileType";
import { DialogTuChoiComponent } from "../../../../../../../components/dialog/dialog-tu-choi/dialog-tu-choi.component";
import dayjs from "dayjs";
import {
  TongHopKeHoachXuatHangService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/TongHopKeHoachXuatHang.service";
import { now } from "moment";
import {FileDinhKem} from "../../../../../../../models/FileDinhKem";

@Component({
  selector: 'app-thong-tin-ke-hoach-xuat-hang-cua-tong-cuc',
  templateUrl: './thong-tin-ke-hoach-xuat-hang-cua-tong-cuc.component.html',
  styleUrls: ['./thong-tin-ke-hoach-xuat-hang-cua-tong-cuc.component.scss']
})
export class ThongTinKeHoachXuatHangCuaTongCucComponent extends Base2Component implements OnInit {
  @Input('isViewDetail') isViewDetail: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input()
  idInput: number;
  @Input()
  dataTongHop: any;
  AMOUNT = AMOUNT_NO_DECIMAL;
  listCcPhapLy: any[] = [];
  listFileDinhKem: any[] = [];
  listFile: any[] = [];
  maTT: string;
  listLoaiHinhNhapXuat: any[] = []
  listKieuNhapXuat: any[] = []
  listMaTongHop: any[] = []
  listKeHoachDtlTreeByChiCuc: any[] = [];
  listKeHoachDtlTreeByVthh: any[] = [];
  expandSetStringCuc = new Set<string>();
  expandSetStringLoaiVthh = new Set<string>();
  @Output() tabFocus = new EventEmitter<number>();
  numberToRoman = NumberToRoman;
  templateName = "Biên bản lấy mẫu bàn giao mẫu vật tư";
  KE_HOACH: string = "00";
  keHoachTcuc: any;
  constructor(httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donviService: DonviService,
    private danhMucService: DanhMucService,
    private tongHopKeHoachXuatHangService: TongHopKeHoachXuatHangService,
    private keHoachXuatHangService: KeHoachXuatHangService) {
    super(httpClient, storageService, notification, spinner, modal, keHoachXuatHangService);
    super.ngOnInit()
    this.formData = this.fb.group({
      id: [],
      tenDvi: [null, [Validators.required]],
      maDvi: [null, [Validators.required]],
      diaChi: [],
      loaiHinhNhapXuat: [null, [Validators.required]],
      kieuNhapXuat: [null, [Validators.required]],
      namKeHoach: [dayjs().get('year'), [Validators.required]],
      soToTrinh: [null, [Validators.required]],
      trichYeu: [],
      ngayKeHoach: [dayjs().format("YYYY-MM-DD")],
      ngayDuyetKeHoach: [],
      ngayTrinhDuyetBtc: [],
      ngayDuyetBtc: [],
      ngayDxXuatHang: [],
      ngayDxXuatHangTu: [],
      ngayDxXuatHangDen: [],
      thoiGianDuKienXuatHang: [],
      thoiGianDuKienXuatTu: [],
      thoiGianDuKienXuatDen: [],
      moTa: [],
      loai: ["00"],
      capDvi: [this.userInfo.CAP_DVI],
      idCanCu: [null, [Validators.required]],
      lyDoTuChoi: [],
      soQdBtc: [],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự thảo'],
      xhXkKhXuatHangDtl: [new Array()],
      fileDinhKemReq: [new Array<FileDinhKem>()],
    })
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.maTT = "/" + this.userInfo.MA_TR;
      this.emitTab(4);
      await Promise.all([
        this.loadDmLoaiHinhNhapXuat(),
        this.loadDmKieuNhapXuat(),
        this.loadDanhSachTongHop(),
      ]);
      if (this.idInput) {
        await this.getDetail(this.idInput)
      } else {
        await this.bindingData();
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  async getDetail(id: number) {
    await this.keHoachXuatHangService
      .getDetail(id)
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          const dataDetail = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, dataDetail);
          if (dataDetail) {
            let thoiGianDxXuatHang = [dataDetail.ngayDxXuatHangTu, dataDetail.ngayDxXuatHangDen];
            let thoiGianDuKienXuat = [dataDetail.thoiGianDuKienXuatTu, dataDetail.thoiGianDuKienXuatDen];
            this.formData.patchValue({
              soToTrinh: dataDetail.soToTrinh?.split('/')[0],
              thoiGianDuKienXuatHang: thoiGianDuKienXuat,
              ngayDxXuatHang : thoiGianDxXuatHang,
              xhXkKhXuatHangDtl: dataDetail.xhXkKhXuatHangDtl,
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
            this.buildTableView(dataDetail.xhXkKhXuatHangDtl);
            this.buildTableViewByLoaiVthh(dataDetail.xhXkKhXuatHangDtl);
          }
        }
      })
      .catch((e) => {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      });
  }

  async bindingData() {
    try {
      this.spinner.show();
      let res = await this.donviService.getDonVi({ str: this.userInfo.MA_DVI });
      let loaiHinhNx = this.listLoaiHinhNhapXuat.find(item => item.ma == '142' && item.giaTri == 'Xuất khác');
      if (res && res.data) {
        this.formData.patchValue({
          maDvi: res.data.maDvi,
          tenDvi: res.data.tenDvi,
          diaChi: res.data.diaChi,
          loaiHinhNhapXuat: loaiHinhNx ? loaiHinhNx.ma : '',
          kieuNhapXuat: loaiHinhNx ? loaiHinhNx.ghiChu : '',
        })
      }
      if (this.dataTongHop) {
        let data = this.dataTongHop;
        let thoiGianDuKienXuat = [data.thoiGianDuKienXuatTu, data.thoiGianDuKienXuatDen];
        this.formData.patchValue({
          namKeHoach: data.namKeHoach,
          moTa: data.moTa,
          idCanCu: data.id,
          thoiGianDuKienXuatHang: thoiGianDuKienXuat,
          xhXkKhXuatHangDtl: data.xhXkKhXuatHangDtl,
        })
        this.buildTableView(data.xhXkKhXuatHangDtl);
        this.buildTableViewByLoaiVthh(data.xhXkKhXuatHangDtl);
      }
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  async loadDmLoaiHinhNhapXuat() {
    this.listLoaiHinhNhapXuat = [];
    let res = await this.danhMucService.danhMucChungGetAll('LOAI_HINH_NHAP_XUAT');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiHinhNhapXuat = res.data;
    }
  }

  async loadDmKieuNhapXuat() {
    this.listKieuNhapXuat = [];
    let res = await this.danhMucService.danhMucChungGetAll('KIEU_NHAP_XUAT');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listKieuNhapXuat = res.data;
    }
  }

  async loadDanhSachTongHop() {
    let body = {
      capTh: this.userInfo.CAP_DVI,
      loai: "01",
      namKeHoach: this.formData.value.namKeHoach,
      trangThai: STATUS.CHUATAO_KH,
      paggingReq: {
        limit: 1000,
        page: this.page - 1
      }
    }
    let rs = await this.tongHopKeHoachXuatHangService.search(body);
    if (rs.msg == MESSAGE.SUCCESS) {
      this.listMaTongHop = rs.data.content;
    }
  }

  async loadKeHoachTcuc() {
    await this.spinner.show();
    let body = {
      capDvi: "1",
      loai: this.KE_HOACH,
    }
    let res = await this.keHoachXuatHangService.search(body)
    const data = res.data;
    this.keHoachTcuc = data.content;
    console.log(this.keHoachTcuc,2)
    let tongHop = [
      ...this.listMaTongHop.filter((e) => {
        return !this.keHoachTcuc.some((bb) => {
          return e.id === bb.idCanCu;
        });
      }),
    ];
    this.listMaTongHop = tongHop;
    console.log(this.listMaTongHop,3)
    await this.spinner.hide();
  }

  async openDialogDsTongHop() {
    await this.loadKeHoachTcuc();
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách tổng hợp',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listMaTongHop,
        dataHeader: ['Năm', 'Mã tổng hợp', 'Trạng thái'],
        dataColumn: ['namKeHoach', 'id', 'tenTrangThai']
      },
    });
    modalQD.afterClose.subscribe((data) => {
      if (data) {
        try {
          this.spinner.show();
          let thoiGianDuKienXuat = [data.thoiGianDuKienXuatTu, data.thoiGianDuKienXuatDen];
          this.formData.patchValue({
            idCanCu: data.id,
            namKeHoach: data.namKeHoach,
            xhXkKhXuatHangDtl: data.xhXkKhXuatHangDtl,
            moTa: data.moTa,
            thoiGianDuKienXuatHang: thoiGianDuKienXuat
          });
          this.buildTableView(data.xhXkKhXuatHangDtl);
          this.buildTableViewByLoaiVthh(data.xhXkKhXuatHangDtl);
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        } finally {
          this.spinner.hide();
        }
      }
    });
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
      this.formData.value.fileDinhKemReq = this.listFile;
    }
    this.formData.value.soToTrinh = this.formData.value.soToTrinh + this.maTT;
    if (this.formData.get("thoiGianDuKienXuatHang").value) {
      this.formData.value.thoiGianDuKienXuatTu = this.formData.get("thoiGianDuKienXuatHang").value[0];
      this.formData.value.thoiGianDuKienXuatDen = this.formData.get("thoiGianDuKienXuatHang").value[1];
    }
    if (this.formData.get("ngayDxXuatHang").value) {
      this.formData.value.ngayDxXuatHangTu = this.formData.get("ngayDxXuatHang").value[0];
      this.formData.value.ngayDxXuatHangDen = this.formData.get("ngayDxXuatHang").value[1];
    }
    this.formData.value.xhXkKhXuatHangDtl.forEach(item => {
      delete item.id;
    });
    let data = await this.createUpdate(this.formData.value);
    if (data) {
      if (!this.idInput) {
        this.idInput = data.id;
        this.formData.patchValue({ id: data.id, trangThai: data.trangThai });
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
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_LDV;
        mess = 'Bạn có muốn gửi duyệt?'
        break;
      }
      case STATUS.CHO_DUYET_LDV: {
        trangThai = STATUS.CHO_DUYET_LDTC;
        mess = 'Bạn có chắc chắn muốn phê duyệt ?'
        break;
      }
      case STATUS.CHO_DUYET_LDTC: {
        trangThai = STATUS.CHODUYET_BTC;
        mess = 'Bạn có chắc chắn muốn phê duyệt ?'
        break;
      }
      case STATUS.CHODUYET_BTC: {
        trangThai = STATUS.DADUYET_BTC;
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
            await this.keHoachXuatHangService.approve(
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
            case STATUS.CHO_DUYET_LDV: {
              trangThai = STATUS.TU_CHOI_LDV
              break;
            }
            case STATUS.CHO_DUYET_LDTC: {
              trangThai = STATUS.TU_CHOI_LDTC
              break;
            }
            case STATUS.CHODUYET_BTC: {
              trangThai = STATUS.TUCHOI_BTC
              break;
            }
          }
          let body = {
            id: this.idInput,
            lyDoTuChoi: text,
            trangThai: trangThai,
          };
          const res = await this.keHoachXuatHangService.approve(body);
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

  async buildTableView(data: any) {
    this.listKeHoachDtlTreeByChiCuc = chain(data)
      .groupBy("tenCuc")
      .map((value, key) => {
        let idVirtual = uuidv4();
        this.expandSetStringCuc.add(idVirtual);
        let rs = chain(value)
          .groupBy("tenChiCuc")
          .map((v, k) => {
            return {
              idVirtual: uuidv4(),
              tenChiCuc: k,
              dataChild: v
            };
          }
          ).value();
        return {
          idVirtual: idVirtual,
          tenCuc: key,
          dataChild: rs
        };
      }).value();
  }

  async buildTableViewByLoaiVthh(data: any) {
    this.listKeHoachDtlTreeByVthh = chain(data)
      .groupBy("tenLoaiVthh")
      .map((value, key) => {
        let idVirtual = uuidv4();
        this.expandSetStringLoaiVthh.add(idVirtual);
        return {
          idVirtual: idVirtual,
          tenLoaiVthh: key,
          childData: value
        };
      }).value();
  }

  onExpandStringChange(id: string, checked: boolean) {
    if (checked) {
      this.expandSetStringCuc.add(id);
    } else {
      this.expandSetStringCuc.delete(id);
    }
  }

  onExpandStringChangeVthh(id: string, checked: boolean) {
    if (checked) {
      this.expandSetStringLoaiVthh.add(id);
    } else {
      this.expandSetStringLoaiVthh.delete(id);
    }
  }

  emitTab(tab) {
    this.tabFocus.emit(tab);
  }
}
