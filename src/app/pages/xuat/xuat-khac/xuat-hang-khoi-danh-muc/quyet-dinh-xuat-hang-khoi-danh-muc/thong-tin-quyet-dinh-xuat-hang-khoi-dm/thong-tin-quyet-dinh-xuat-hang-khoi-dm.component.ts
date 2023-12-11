import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Base2Component } from '../../../../../../components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../../../../../../services/storage.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DonviService } from '../../../../../../services/donvi.service';
import { DanhMucService } from '../../../../../../services/danhmuc.service';
import { v4 as uuidv4 } from 'uuid';
import { chain, cloneDeep, isEmpty } from 'lodash';
import {
  TongHopDanhSachVttbService,
} from '../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/TongHopDanhSachVttb.service';
import {
  QuyetDinhXuatGiamVattuService,
} from '../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/QuyetDinhXuatGiamVattu.service';
import { STATUS } from '../../../../../../constants/status';
import { MESSAGE } from '../../../../../../constants/message';
import {
  DialogTableSelectionComponent,
} from '../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component';
import { FILETYPE } from '../../../../../../constants/fileType';
import { DialogTuChoiComponent } from '../../../../../../components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import {
  QuyetDinhXuatHangKhoiDmService,
} from '../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuathangkhoidm/QuyetDinhXuatHangKhoiDm.service';
import {
  DanhSachHangDtqgService,
} from '../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuathangkhoidm/DanhSachHangDtqg.service';
import { NumberToRoman } from '../../../../../../shared/commonFunction';
import { Validators } from '@angular/forms';
import printJS from 'print-js';

@Component({
  selector: 'app-thong-tin-quyet-dinh-xuat-hang-khoi-dm',
  templateUrl: './thong-tin-quyet-dinh-xuat-hang-khoi-dm.component.html',
  styleUrls: ['./thong-tin-quyet-dinh-xuat-hang-khoi-dm.component.scss'],
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
  listDsHangLoaiKhoiKho: any[] = [];
  dataTh: any[] = [];
  dataThEdit: any[] = [];
  dataThTree: any[] = [];
  dataPrint: any[] = [];
  loaiHinhXuatOptions: any[] = [{ value: 'TL', text: 'Thanh lý' }, { value: 'TH', text: 'Tiêu hủy' }];
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
      soQd: [null, [Validators.required]],
      ngayKy: [null, [Validators.required]],
      ngayHieuLuc: [null, [Validators.required]],
      maCanCu: [null, [Validators.required]],
      idCanCu: [null, [Validators.required]],
      lyDoTuChoi: [],
      trichYeu: [null, [Validators.required]],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự thảo'],
      listDtl: [],
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.maQd = '/' + this.userInfo.MA_QD;
      await Promise.all([
        this.loadDsHangLoaiKhoiKho(),
      ]);
      if (this.idInput) {
        this.getDetail(this.idInput);
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
        dataColumn: ['maDanhSach', 'tenTrangThai'],
      },
    });
    modalQD.afterClose.subscribe((data) => {
      if (data) {
        this.formData.patchValue({
          idCanCu: data.id,
          maCanCu: data.maDanhSach,
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
        page: this.page - 1,
      },
    };
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
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      return;
    }
    this.listFile = [];
    if (this.listFileDinhKem.length > 0) {
      this.listFileDinhKem.forEach(item => {
        item.fileType = FILETYPE.FILE_DINH_KEM;
        this.listFile.push(item);
      });
    }
    if (this.listCcPhapLy.length > 0) {
      this.listCcPhapLy.forEach(element => {
        element.fileType = FILETYPE.CAN_CU_PHAP_LY;
        this.listFile.push(element);
      });
    }
    if (this.listFile && this.listFile.length > 0) {
      this.formData.value.fileDinhKems = this.listFile;
    }
    this.convertTreeToList();
    this.formData.value.soQd = this.formData.value.soQd + this.maQd;
    this.formData.value.listDtl = this.dataTh;
    let data = await this.createUpdate(this.formData.value);
    if (data) {
      if (!this.idInput) {
        this.idInput = data.id;
        this.formData.patchValue({ id: data.id, trangThai: data.trangThai });
      }
      if (isGuiDuyet) {
        this.pheDuyet(this.formData.get('id').value);
      }
    } else {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
    }
  }


  convertTreeToList() {
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTh = [];
      this.dataTable.forEach(item => {
        this.dataTh.push(item);
        if (item.children && item.children.length > 0) {
          item.children.forEach(child => {
            this.dataTh.push(child);
          });
        }
      });
    }
  }

  pheDuyet(id?) {
    let trangThai = '';
    let mess = '';
    switch (this.formData.get('trangThai').value) {
      case STATUS.DU_THAO:
      case STATUS.TU_CHOI_LDTC: {
        trangThai = STATUS.CHO_DUYET_LDV;
        mess = 'Bạn có muốn gửi duyệt?';
        break;
      }
      case STATUS.CHO_DUYET_LDV: {
        trangThai = STATUS.CHO_DUYET_LDTC;
        mess = 'Bạn có chắc chắn muốn phê duyệt ?';
        break;
      }
      case STATUS.CHO_DUYET_LDTC: {
        trangThai = STATUS.DA_DUYET_LDTC;
        mess = 'Bạn có chắc chắn muốn phê duyệt ?';
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
            this.goBack();
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
              trangThai = STATUS.TU_CHOI_LDV;
              break;
            }
            case STATUS.CHO_DUYET_LDTC: {
              trangThai = STATUS.TU_CHOI_LDTC;
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
              soQd: dataDetail.soQd?.split('/')[0],
            });
            this.listFile = dataDetail.fileDinhKems;
            if (dataDetail.fileDinhKems && dataDetail.fileDinhKems.length > 0) {
              dataDetail.fileDinhKems.forEach(item => {
                if (item.fileType == FILETYPE.FILE_DINH_KEM) {
                  this.listFileDinhKem.push(item);
                } else if (item.fileType == FILETYPE.CAN_CU_PHAP_LY) {
                  this.listCcPhapLy.push(item);
                }
              });
            }
            this.dataPrint = cloneDeep(dataDetail.listDtl);
            this.dataTable = cloneDeep(dataDetail.listDtl);
          }
        }
      })
      .catch((e) => {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      });
  }

  print() {
    this.convertTreeToList();
    let data = this.dataTh.filter(item => item.tenCha);
    console.log(data, 'datadatadata');
    let dataPrint = data.map((item, index) => {
      return {
        ...item,
        'stt': index + 1,
        'dviQly': 'TCDT',
        'moTa': '',
      };
    });
    printJS({
      printable: dataPrint,
      gridHeaderStyle: 'border: 2px solid #3971A5; text-align:center',
      gridStyle: 'border: 2px solid #3971A5;text-align:center;with:fit-content',
      properties: [
        {
          field: 'stt',
          displayName: 'STT',
          columnSize: '40px',
        },
        {
          field: 'tenNhomHang',
          displayName: 'Nhóm hàng DTQG',
          columnSize: '100px',
        },
        {
          field: 'tenCha',
          displayName: 'Loại hàng DTQG',
          columnSize: '250px',
        },
        {
          field: 'ten',
          displayName: 'Chủng loại hàng DTQG',
          columnSize: '250px',
        },
        {
          field: 'moTa',
          displayName: 'Mô tả',
          columnSize: 'calc(100% - calc( 40px + 900px)) px',
        },
        {
          field: 'maDviTinh',
          displayName: 'DVT',
          columnSize: '100px',
        }, {
          field: 'dviQly',
          displayName: 'Đơn vị quản lý',
          columnSize: '100px',
        }, {
          field: 'tenLoaiHinhXuat',
          displayName: 'Loại hình xuất',
          columnSize: '100px',
        },
      ],
      type: 'json',
      header: 'QUYẾT ĐỊNH XUẤT HÀNG KHỎI DANH MỤC',
    });
  }


  protected readonly NumberToRoman = NumberToRoman;
}
