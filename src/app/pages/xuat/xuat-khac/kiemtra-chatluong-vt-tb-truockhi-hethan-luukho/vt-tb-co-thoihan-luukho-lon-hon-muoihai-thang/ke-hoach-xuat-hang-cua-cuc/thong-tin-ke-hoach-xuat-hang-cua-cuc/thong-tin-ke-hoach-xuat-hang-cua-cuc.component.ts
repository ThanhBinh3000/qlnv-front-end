import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Base2Component} from "../../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DonviService} from "../../../../../../../services/donvi.service";
import {DanhMucService} from "../../../../../../../services/danhmuc.service";
import {v4 as uuidv4} from "uuid";
import {
  KeHoachXuatHangService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/KeHoachXuatHang.service";
import {AMOUNT_NO_DECIMAL} from "../../../../../../../Utility/utils";
import {MESSAGE} from "../../../../../../../constants/message";
import {STATUS} from "../../../../../../../constants/status";
import {NumberToRoman} from "../../../../../../../shared/commonFunction";
import {chain, cloneDeep, isEmpty} from "lodash";
import {
  DialogTableSelectionComponent
} from "../../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import {
  TongHopDanhSachVttbService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/TongHopDanhSachVttb.service";
import {LOAI_HH_XUAT_KHAC} from "../../../../../../../constants/config";
import {Validators} from "@angular/forms";
import {FILETYPE} from "../../../../../../../constants/fileType";
import {DialogTuChoiComponent} from "../../../../../../../components/dialog/dialog-tu-choi/dialog-tu-choi.component";
import dayjs from "dayjs";

@Component({
  selector: 'app-thong-tin-ke-hoach-xuat-hang-cua-cuc',
  templateUrl: './thong-tin-ke-hoach-xuat-hang-cua-cuc.component.html',
  styleUrls: ['./thong-tin-ke-hoach-xuat-hang-cua-cuc.component.scss']
})
export class ThongTinKeHoachXuatHangCuaCucComponent extends Base2Component implements OnInit {
  @Input('isViewDetail') isViewDetail: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input()
  idInput: number;
  AMOUNT = AMOUNT_NO_DECIMAL;
  listCcPhapLy: any[] = [];
  listFileDinhKem: any[] = [];
  listFile: any[] = [];
  maTT: string;
  listLoaiHinhNhapXuat: any[] = []
  listKieuNhapXuat: any[] = []
  listMaTongHop: any[] = []
  dataTh: any[] = [];
  dataThTree: any[] = []
  expandSetString = new Set<string>();
  numberToRoman = NumberToRoman;
  keHoachCuc: any;
  KE_HOACH: string = "00";
  constructor(httpClient: HttpClient,
              storageService: StorageService,
              notification: NzNotificationService,
              spinner: NgxSpinnerService,
              modal: NzModalService,
              private donviService: DonviService,
              private danhMucService: DanhMucService,
              private tongHopDanhSachVttbService: TongHopDanhSachVttbService,
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
      trichYeu: [null, [Validators.required]],
      ngayKeHoach: [],
      ngayDuyetKeHoach: [],
      thoiGianDuKienXuatHang: [],
      thoiGianDuKienXuatTu: [],
      thoiGianDuKienXuatDen: [],
      moTa: [null, [Validators.required]],
      loai : ["00"],
      capDvi: [this.userInfo.CAP_DVI],
      idTongHopDs: [],
      lyDoTuChoi: [],
      maTongHopDs: [null, [Validators.required]],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự thảo'],
      xhXkKhXuatHangDtl: [new Array()]
    })
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.maTT = "/" + this.userInfo.MA_TR;
      await Promise.all([
        this.loadDmLoaiHinhNhapXuat(),
        this.loadDmKieuNhapXuat(),
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

  async getDetail(id: number) {
    await this.keHoachXuatHangService
      .getDetail(id)
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          const dataDetail = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, dataDetail);
          if (dataDetail) {
            let thoiGianDuKienXuat = [dataDetail.thoiGianDuKienXuatTu, dataDetail.thoiGianDuKienXuatDen];
            this.formData.patchValue({
              soToTrinh: dataDetail.soToTrinh?.split('/')[0],
              thoiGianDuKienXuatHang: thoiGianDuKienXuat
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
            this.dataTh = cloneDeep(dataDetail.xhXkKhXuatHangDtl);
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

  async bindingData() {
    let res = await this.donviService.getDonVi({str: this.userInfo.MA_DVI});
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
      loai: LOAI_HH_XUAT_KHAC.VT_12_THANG,
      namKeHoach: this.formData.value.namKeHoach,
      paggingReq: {
        limit: 1000,
        page: this.page - 1
      }
    }
    let rs = await this.tongHopDanhSachVttbService.search(body);
    if (rs.msg == MESSAGE.SUCCESS) {
      this.listMaTongHop = rs.data.content;
    }
    console.log(this.listMaTongHop,1)
  }

  async loadKeHoachCuc() {
    // await this.spinner.show();
    let body = {
      capDvi: "2",
      loai: this.KE_HOACH,
    }
    let res = await this.keHoachXuatHangService.search(body)
    const data = res.data;
    this.keHoachCuc = data.content;
    console.log(this.keHoachCuc,2)
    let tongHop = [
      ...this.listMaTongHop.filter((e) => {
        return !this.keHoachCuc.some((bb) => {
          return e.maDanhSach === bb.maTongHopDs;
        });
      }),
    ];
    this.listMaTongHop = tongHop;
    console.log(this.listMaTongHop,3)
  }


  async openDialogDsTongHop() {
    await this.loadKeHoachCuc();
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
          idTongHopDs: data.id,
          maTongHopDs: data.maDanhSach
        });
        this.dataTh = data.tongHopDtl;
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
    this.formData.value.soToTrinh = this.formData.value.soToTrinh + this.maTT;
    if (this.formData.get("thoiGianDuKienXuatHang").value) {
      this.formData.value.thoiGianDuKienXuatTu = this.formData.get("thoiGianDuKienXuatHang").value[0];
      this.formData.value.thoiGianDuKienXuatDen = this.formData.get("thoiGianDuKienXuatHang").value[1];
    }
    this.formData.value.xhXkKhXuatHangDtl = this.dataTh;
    this.formData.value.xhXkKhXuatHangDtl.forEach(item => {
      delete item.id;
    });
    let data = await this.createUpdate(this.formData.value);
    if (data) {
      if (!this.idInput) {
        this.idInput = data.id;
        this.formData.patchValue({id: data.id, trangThai: data.trangThai});
      }
      if (isGuiDuyet) {
        this.pheDuyet(this.formData.get("id").value)
      }
    }
  }


  pheDuyet(id?) {
    let trangThai = ''
    let mess = ''
    switch (this.formData.get('trangThai').value) {
      case STATUS.DU_THAO:
      case STATUS.TU_CHOI_TP:
      case STATUS.TU_CHOI_LDC: {
        trangThai = STATUS.CHO_DUYET_TP;
        mess = 'Bạn có muốn gửi duyệt?'
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
            case STATUS.CHO_DUYET_TP: {
              trangThai = STATUS.TU_CHOI_TP
              break;
            }
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
}
