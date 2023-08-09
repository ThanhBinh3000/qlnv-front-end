import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DonviService} from "../../../../../../services/donvi.service";
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {v4 as uuidv4} from "uuid";
import {chain, cloneDeep, isEmpty} from "lodash";
import {
  TongHopDanhSachVttbService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/TongHopDanhSachVttb.service";
import {
  QuyetDinhXuatGiamVattuService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/QuyetDinhXuatGiamVattu.service";
import {STATUS} from "../../../../../../constants/status";
import {MESSAGE} from "../../../../../../constants/message";
import {
  DialogTableSelectionComponent
} from "../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import {FILETYPE} from "../../../../../../constants/fileType";
import {DialogTuChoiComponent} from "../../../../../../components/dialog/dialog-tu-choi/dialog-tu-choi.component";
import {
  QuyetDinhXuatHangKhoiDmService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuathangkhoidm/QuyetDinhXuatHangKhoiDm.service";
import {
  DanhSachHangDtqgService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuathangkhoidm/DanhSachHangDtqg.service";
import {NumberToRoman} from "../../../../../../shared/commonFunction";

@Component({
  selector: 'app-thong-tin-quyet-dinh-xuat-hang-khoi-dm',
  templateUrl: './thong-tin-quyet-dinh-xuat-hang-khoi-dm.component.html',
  styleUrls: ['./thong-tin-quyet-dinh-xuat-hang-khoi-dm.component.scss']
})
export class ThongTinQuyetDinhXuatHangKhoiDmComponent extends Base2Component implements OnInit {
  @Input('isViewDetail') isViewDetail: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input()
  idInput: number;
  listCcPhapLy: any[] = [];
  listFileDinhKem: any[] = [];
  listFile: any[] = [];
  maQd: string;
  listMaTongHop: any[] = [];
  listDsHangLoaiKhoiKho: any[] = []
  dataTh: any[] = [];
  dataThEdit: any[] = [];
  dataThTree: any[] = [];
  dataThTreeXuatHuy: any[] = [];
  expandSetString = new Set<string>();
  numberToRoman = NumberToRoman;

  constructor(httpClient: HttpClient,
              storageService: StorageService,
              notification: NzNotificationService,
              spinner: NgxSpinnerService,
              modal: NzModalService,
              private donviService: DonviService,
              private danhMucService: DanhMucService,
              private danhSachHangDtqgService: DanhSachHangDtqgService,
              private quyetDinhXuatHangKhoiDmService: QuyetDinhXuatHangKhoiDmService) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhXuatHangKhoiDmService);
    this.formData = this.fb.group({
      id: [],
      soQd: [],
      ngayKy: [],
      ngayHieuLuc: [],
      maCanCu: [],
      idCanCu: [],
      lyDoTuChoi: [],
      trichYeu: [],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự thảo'],
      listDtl: []
    })
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.maQd = "/" + this.userInfo.MA_QD
      await Promise.all([
        this.loadDsHangLoaiKhoiKho(),
      ]);
      if (this.idInput) {
        this.getDetail(this.idInput)
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  openDialogDsHangNgoaiMuc() {
    this.dataTable = [];
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách tổng hợp',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDsHangLoaiKhoiKho,
        dataHeader: ['Mã danh sách', 'Trạng thái'],
        dataColumn: ['maDanhSach', 'tenTrangThai']
      },
    });
    modalQD.afterClose.subscribe((data) => {
      if (data) {
        this.formData.patchValue({
          idCanCu: data.id,
          maCanCu: data.maDanhSach
        });
        this.dataTable = data.xhXkDsHangDtqgDtl;
      }
    });
  }


  async loadDsHangLoaiKhoiKho() {
    this.listDsHangLoaiKhoiKho = [];
    let body = {
      loai: 1,
      trangThai: STATUS.DA_DUYET_LDV,
      paggingReq: {
        limit: 1000,
        page: this.page - 1
      }
    }
    let rs = await this.danhSachHangDtqgService.search(body);
    if (rs.msg == MESSAGE.SUCCESS) {
      this.listDsHangLoaiKhoiKho = rs.data.content;
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
    this.formData.value.soQd = this.formData.value.soQd + this.maQd;
    // this.formData.value.xhXkVtQdGiaonvXhDtl = this.dataTh;
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
            await this.quyetDinhXuatHangKhoiDmService.approve(
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
          const res = await this.quyetDinhXuatHangKhoiDmService.approve(body);
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
    await this.quyetDinhXuatHangKhoiDmService
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
            this.dataTh = cloneDeep(dataDetail.xhXkVtQdGiaonvXhDtl);
            this.dataTh.forEach((item) => {
              this.dataThEdit[item.id] = {...item};
            });
          }
        }
      })
      .catch((e) => {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      });
  }

  protected readonly NumberToRoman = NumberToRoman;
}
