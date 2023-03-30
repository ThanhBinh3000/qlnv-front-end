import {Component, OnInit} from '@angular/core';
import {Base2Component} from "../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {MmHienTrangMmService} from "../../../services/mm-hien-trang-mm.service";
import {DanhMucService} from "../../../services/danhmuc.service";
import {FileDinhKem} from "../../../models/FileDinhKem";
import {HienTrangMayMoc} from "../../../constants/status";
import {DonviService} from "../../../services/donvi.service";
import {saveAs} from "file-saver";
import {MESSAGE} from "../../../constants/message";
import {DANH_MUC_LEVEL} from "../../../pages/luu-kho/luu-kho.constant";

@Component({
  selector: 'app-dialog-kt-giao-kho',
  templateUrl: './dialog-kt-giao-kho.component.html',
  styleUrls: ['./dialog-kt-giao-kho.component.scss']
})
export class DialogKtGiaoKhoComponent extends Base2Component implements OnInit {
  isViewDetail: boolean;
  dataDetail: any
  dsNganKho : any[] = [];
  dsNganLo : any[] = [];
  rowItem: KtGiaoKho = new KtGiaoKho();
  dataEdit: { [key: string]: { edit: boolean; data: KtGiaoKho } } = {};
  statusMm = HienTrangMayMoc
  listTinhTrang : any[] = ['Hoạt động','Đã thu hồi']

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private hienTrangSv: MmHienTrangMmService,
    private danhMucSv: DanhMucService,
    private _modalRef: NzModalRef,
    private dviService: DonviService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, hienTrangSv);
    super.ngOnInit()
    this.formData = this.fb.group({
      maDvi: [null],
      tenDvi: [null],
      namKeHoach: [null],
      tenCcdc: [null],
      maCcdc: [null],
      donViTinh: [null],
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.initForm();
      // this.getDetail(this.dataDetail.id)
      this.loadDsNganKho()
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  downloadFile(item: FileDinhKem) {
    if (item) {
      this.uploadFileService.downloadFile(item.fileUrl).subscribe((blob) => {
        saveAs(blob, item.fileName);
      });
    } else {
      this.notification.error(MESSAGE.ERROR, 'Không tìm thấy file đính kèm');
    }
  }

  async getDetail(id) {
    this.spinner.show();
    try {
      let res = await this.hienTrangSv.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data;
          this.dataTable = data.listQlDinhMucPhiHienTrangMmtbDtl
          this.updateEditCache()
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
        this.spinner.hide();
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e);
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
  }

  initForm() {
    // this.formData.patchValue({
    //   tenDvi: this.dataDetail.tenDvi,
    //   tenCcdc: this.dataDetail.tenTaiSan,
    //   donViTinh: this.dataDetail.donViTinh,
    //   namKeHoach: this.dataDetail.namKeHoach
    // })
    // this.updateEditCache()
  }

  themMoiCtiet() {
    let msgRequired = this.required(this.rowItem);
    if (msgRequired) {
      this.notification.error(MESSAGE.ERROR, msgRequired);
      this.spinner.hide();
      return;
    }
    if (!this.dataTable) {
      this.dataTable = []
    }
    this.dataTable = [...this.dataTable, this.rowItem];
    this.rowItem = new KtGiaoKho();
    this.updateEditCache();
  }



  required(item: KtGiaoKho) {
    let msgRequired = '';
    if (!item.maNganKho || !item.maNganKho ) {
      msgRequired = "Vui lòng nhập đủ dữ liệu!";
    }
    return msgRequired;
  }

  updateEditCache() {
    if (this.dataTable) {
      this.dataTable.forEach((item, index) => {
        this.dataEdit[index] = {
          edit: false,
          data: {...item},
        };
      });
    }
  }

  async loadDsNganKho() {
    const body = {
      maDviCha: this.userInfo.DON_VI.maDvi,
      trangThai: '01',
    };

    const dsTong = await this.dviService.layDonViTheoCapDo(body);
    this.dsNganKho = dsTong[DANH_MUC_LEVEL.NGAN_KHO];
  }

  refresh() {
    this.rowItem = new KtGiaoKho();
  }

  editRow(stt: number) {
    this.dataEdit[stt].edit = true;
  }

  cancelEdit(stt: number): void {
    this.dataEdit[stt] = {
      data: {...this.dataTable[stt]},
      edit: false
    };
  }

  async saveEdit(idx: number) {
    let msgRequired = this.required(this.dataEdit[idx].data)
    if (msgRequired) {
      this.notification.error(MESSAGE.ERROR, msgRequired);
      this.spinner.hide();
      return;
    }
    this.dataEdit[idx].edit = false;
    Object.assign(this.dataTable[idx], this.dataEdit[idx].data);
    this.updateEditCache();
  }

  deleteItem(index: any) {
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
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  async handleOk(data : string) {
    let body = this.dataDetail
    if (!this.dataTable) {
      this.notification.error(MESSAGE.ERROR,'Vui lòng nhập danh sách chi tiết!')
      return;
    }
    body.listQlDinhMucHienTrangMmtbDtlReq = this.dataTable
    let res = await this.createUpdate(body);
    if (res) {
      this._modalRef.close(data);
    }
  }

  onCancel() {
    this._modalRef.close();
  }

  changNganKho(event: any) {
    let nganLo = this.dsNganKho.filter(item => item.maDvi == event)
    if(nganLo && nganLo.length >0) {
      this.dsNganLo = nganLo[0].children
    }
  }

  changeNganLo($event: any) {

  }
}

export class KtGiaoKho {
  id : number;
  maNganLo : string;
  tenNganLo :string;
  maNganKho : string;
  tenNganKho : string;
  tenThuKho : string;
  maThuKho : string;
  giaoTuNgay : string;
  giaoDenNgay : string;
  ngayThuHoi : string;
  tinhTrang : string
}
