import {Component, Input, OnInit} from "@angular/core";
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {MESSAGE} from "../../../../../../constants/message";
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {DonviService} from "../../../../../../services/donvi.service";
import {Validators} from "@angular/forms";
import {DanhMucKhoService} from "../../../../../../services/danh-muc-kho.service";
import {STATUS} from "../../../../../../constants/status";

@Component({
  selector: 'app-them-moi-danh-muc-du-an-kho',
  templateUrl: './them-moi-danh-muc-du-an-kho.component.html',
  styleUrls: ['./them-moi-danh-muc-du-an-kho.component.scss']
})
export class ThemMoiDanhMucDuAnKhoComponent extends Base2Component implements OnInit {
  @Input() dataDetail: any
  isViewDetail: boolean;
  listLoaiDuAn: any[] = [];
  listKhoi: any[] = [];
  dsKho: any[] = [];
  dsChiCuc: any[] = [];
  fileDinhKemDc: any[] = []
  listTrangThai: any[] = [
    {ma: this.STATUS.CHUA_THUC_HIEN, giaTri: 'Chưa thực hiện'},
    {ma: this.STATUS.DANG_THUC_HIEN, giaTri: 'Đang thực hiện'},
    {ma: this.STATUS.DA_HOAN_THANH, giaTri: 'Đã hoàn thành'},
  ];

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucKhoService: DanhMucKhoService,
    private danhMucService: DanhMucService,
    private danhMucSv: DanhMucService,
    private _modalRef: NzModalRef,
    private dviService: DonviService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, danhMucKhoService);
    super.ngOnInit()
    this.formData = this.fb.group({
      id: [null],
      maDvi: [null],
      maDuAn: [null, Validators.required],
      tenDuAn: [null, Validators.required],
      maChiCuc: [null, Validators.required],
      diaDiem: [null, Validators.required],
      khoi: [null, Validators.required],
      maDiemKho: [null, Validators.required],
      tgKhoiCong: [null, Validators.required],
      tgHoanThanh: [null, Validators.required],
      loaiDuAn: [null , Validators.required],
      tmdtDuKien: [null , Validators.required],
      nstwDuKien: [null , Validators.required],
      tmdtDuyet: [null , Validators.required],
      nstwDuyet: [null , Validators.required],
      soQdPd: [null ],
      ngayQdPd: [null ],
      soQdDcPd: [null],
      ngayQdDc: [null],
      soQdPdDtxd: [null],
      tongSoLuyKe: [null],
      luyKeNstw: [null],
      type : [null],
      trangThai: [STATUS.CHUA_THUC_HIEN],
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.loadDsChiCuc();
      this.loadDsLoaiDuAn();
      this.loadDsKhoi();
      if (this.dataDetail) {
        await this.getDetail(this.dataDetail.id)
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async getDetail(id) {
    this.spinner.show();
    try {
      let res = await this.danhMucKhoService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, data);
          this.fileDinhKem = data.fileDinhKems;
          this.fileDinhKemDc = data.fileDinhKemsDc;
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

  async changeChiCuc(event) {
    const dsTong = await this.dviService.layTatCaDonViByLevel(4);
    this.dsKho = dsTong.data
    this.dsKho = this.dsKho.filter(item => item.maDvi.startsWith(event) && item.type != 'PB')
  }

  async loadDsChiCuc() {
    const dsTong = await this.dviService.layTatCaDonViByLevel(3);
    this.dsChiCuc = dsTong.data
    this.dsChiCuc = this.dsChiCuc.filter(item => item.maDvi.startsWith(this.userInfo.MA_DVI) && item.type != 'PB')
  }

  async loadDsLoaiDuAn() {
    this.listLoaiDuAn = [];
    let res = await this.danhMucService.danhMucChungGetAll('LOAI_DU_AN_KT');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiDuAn = res.data;
    }
  }

  async loadDsKhoi() {
    this.listKhoi = [];
    let res = await this.danhMucService.danhMucChungGetAll('KHOI_DU_AN_KT');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listKhoi = res.data;
    }
  }

  async handleOk(data: string) {
    this.helperService.markFormGroupTouched(this.formData)
    if (this.formData.invalid) {
      return;
    }
    let body = this.formData.value
    body.maDvi = this.userInfo.MA_DVI
    body.fileDinhKems = this.fileDinhKem;
    body.fileDinhKemsDc = this.fileDinhKemDc;
    let res = await this.createUpdate(body);
    if (res) {
      this._modalRef.close(data);
    }
  }

  onCancel() {
    this._modalRef.close();
  }
}
