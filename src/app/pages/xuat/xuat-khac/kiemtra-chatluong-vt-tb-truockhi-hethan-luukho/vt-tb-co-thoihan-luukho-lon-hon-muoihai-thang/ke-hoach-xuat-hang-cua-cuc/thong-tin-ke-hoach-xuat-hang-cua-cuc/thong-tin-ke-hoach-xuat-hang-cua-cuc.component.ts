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
      namKeHoach: [null, [Validators.required]],
      soToTrinh: [],
      trichYeu: [],
      ngayKeHoach: [],
      ngayDuyetKeHoach: [],
      thoiGianDuKienXuatHang: [],
      thoiGianDuKienXuatTu: [],
      thoiGianDuKienXuatDen: [],
      moTa: [],
      idTongHopDs: [],
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
        this.detail(this.idInput)
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
    this.formData.value.xhXkKhXuatHangDtl = this.dataTh;
    if (isGuiDuyet) {
      this.modal.confirm({
        nzClosable: false,
        nzTitle: 'Xác nhận',
        nzContent: "Ban hành quyết định",
        nzOkText: 'Đồng ý',
        nzCancelText: 'Không',
        nzOkDanger: true,
        nzWidth: 350,
        nzOnOk: async () => {
          this.spinner.show();
          try {
            let res = await this.createUpdate(this.formData.value);
            if (res) {
              let body = {
                id: res.id,
                trangThai: STATUS.BAN_HANH,
              }
              let res1 = await this.keHoachXuatHangService.approve(body);
              if (res1.msg == MESSAGE.SUCCESS) {
                this.notification.success(MESSAGE.NOTIFICATION, "Ban hành quyết định thành công");
                this.formData.patchValue({
                  trangThai: STATUS.BAN_HANH,
                  tenTrangThai: "Ban hành",
                })
                this.isViewDetail = true;
                this.spinner.hide();
              } else {
                this.notification.error(MESSAGE.ERROR, res1.msg);
                this.spinner.hide();
              }
            }
          } catch (e) {
            console.log('error: ', e);
            this.spinner.hide();
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          } finally {
            this.spinner.hide();
          }
        },
      });
    } else {
      let res = await this.createUpdate(this.formData.value);
      if (res) {
        this.idInput = res.id;
        this.formData.patchValue({
          id : res.id
        })
      }
    }
  }

}
