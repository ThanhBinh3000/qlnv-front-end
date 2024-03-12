import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {MESSAGE} from 'src/app/constants/message';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NgxSpinnerService} from 'ngx-spinner';
import {DanhMucService} from "../../../../services/danhmuc.service";
import {DanhMucDinhMucHaoHutService} from "../../../../services/danh-muc-dinh-muc-hao-hut.service";
import {AMOUNT} from "../../../../Utility/utils";
import {saveAs} from 'file-saver';
import {Base2Component} from "../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../services/storage.service";
import {STATUS} from "../../../../constants/status";
import {da, th} from "date-fns/locale";
import {DANH_MUC_LEVEL} from "../../../luu-kho/luu-kho.constant";
import {DonviService} from "../../../../services/donvi.service";
import {Validators} from "@angular/forms";

@Component({
  selector: 'app-them-moi-dm-hao-hut',
  templateUrl: './them-moi-dm-hao-hut.component.html',
  styleUrls: ['./them-moi-dm-hao-hut.component.scss']
})
export class ThemMoiDmHaoHutComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() isViewDetail: boolean = false;
  @Input() selectedId: number = 0;
  listLoaiVthh: any[] = [];
  listCloaiVthh: any[] = [];
  listHinhThucBq: any[] = [];
  listLoaiHinhBq: any[] = [];
  listPhuongThucBq: any[] = [];
  dsCuc: any[] = [];
  STATUS = STATUS
  rowItem: DmDinhMucHaoHut = new DmDinhMucHaoHut();
  dataEdit: { [key: string]: { edit: boolean; data: DmDinhMucHaoHut } } = {};
  amount = AMOUNT;

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    private router: Router,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private donViService: DonviService,
    private dmDinhMucHaoHut: DanhMucDinhMucHaoHutService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, dmDinhMucHaoHut);
    super.ngOnInit()
    this.formData = this.fb.group({
      id: [null],
      soTt: ['',[Validators.required]],
      ngayKy: ['', [Validators.required]],
      ngayHieuLuc: ['', [Validators.required]],
      ngayHetHieuLuc: [''],
      trichYeu: [''],
      trangThai: ['78'],
      tenTrangThai: ['Đang nhập dữ liệu'],
    });
  }

  async ngOnInit() {
    if (!this.userService.isAccessPermisson('QTDM_DM_DINHMUC_HAOHUT')) {
      this.router.navigateByUrl('/error/401')
    }
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      this.getListHtbq();
      this.getListLhbq();
      this.getListPtbq();
      this.loadDsVthh();
      this.loadDsCuc();
      if (this.selectedId > 0) {
        await this.getDetail(this.selectedId);
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async getDetail(id) {
    let res = await this.dmDinhMucHaoHut.getDetail(id);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data;
      this.helperService.bidingDataInFormGroup(this.formData, data);
      this.formData.patchValue({
        ngayKy : data.ngayKy,
        ngayHieuLuc : data.ngayHieuLuc,
        ngayHetHieuLuc : data.ngayHetHieuLuc,
      })
      this.fileDinhKem = data.fileDinhKem;
      this.dataTable = data.details;
      this.dataTable.forEach(item => {
        item.listHtbq = item.hinhThucBq ? item.hinhThucBq.split(',') : [];
        item.listLhbq = item.loaiHinhBq ? item.loaiHinhBq.split(',') : [];
        item.listPtbq = item.phuongThucBq ? item.phuongThucBq.split(',') : [];
        item.listCuc = item.apDungTai ? item.apDungTai.split(',') : [];
      });
      this.updateEditCache();
    }
  }

  async loadDsCuc() {
    const dsTong = await this.donViService.layTatCaDonViByLevel(2);
    if (dsTong.msg == MESSAGE.SUCCESS) {
      this.dsCuc = dsTong.data
      this.dsCuc = this.dsCuc.filter(item => item.type != "PB")
    }
  }

  async getListHtbq() {
    this.listHinhThucBq = [];
    let res = await this.danhMucService.danhMucChungGetAll('HINH_THUC_BAO_QUAN');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listHinhThucBq = res.data;
    }
  }

  async getListLhbq() {
    this.listLoaiHinhBq = [];
    let res = await this.danhMucService.danhMucChungGetAll('LOAI_HINH_BAO_QUAN');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiHinhBq = res.data;
    }
  }

  async getListPtbq() {
    this.listPhuongThucBq = [];
    let res = await this.danhMucService.danhMucChungGetAll('PT_BAO_QUAN');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listPhuongThucBq = res.data;
    }
  }

  async loadDsVthh() {
    this.listLoaiVthh = [];
    let res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiVthh = res.data;
      this.listLoaiVthh = res.data?.filter((x) => x.ma.length == 4);
    }
  }

  async selectLoaiHangHoa(event: any) {
    if (event) {
      const loaiVthh = this.listLoaiVthh.filter(item => item.ma == event);
      if (loaiVthh.length > 0) {
        this.rowItem.tenLoaiVthh = loaiVthh[0].ten;
      }
      let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha({str: event});
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.listCloaiVthh = res.data;
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  onChangeCloaiVthh(event) {
    const cloaiVthh = this.listCloaiVthh.filter(item => item.ma == event);
    if (cloaiVthh.length > 0) {
      this.rowItem.tenCloaiVthh = cloaiVthh[0].ten;
    }
  }

  async themMoiItem(data: DmDinhMucHaoHut) {
    this.spinner.show();
    if (!this.checkValidators(data)) {
      this.notification.error(MESSAGE.ERROR, "Vui lòng không để trống!!")
      this.spinner.hide();
      return;
    }
    this.dataTable = [...this.dataTable, this.rowItem];
    this.rowItem = new DmDinhMucHaoHut();
    this.updateEditCache();
    this.spinner.hide();
  }

  updateEditCache(): void {
    if (this.dataTable) {
      this.dataTable.forEach((item, index) => {
        this.dataEdit[index] = {
          edit: false,
          data: {...item},
        };
      });
    }
  }

  checkValidators(rowItem: DmDinhMucHaoHut) {
    let arr = [];
    let check = true;
    arr.push(rowItem.maDinhMuc, rowItem.tenDinhMuc, rowItem.loaiVthh, rowItem.dinhMuc)
    if (arr && arr.length > 0) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] == '' || arr[i] == null || arr[i] == undefined) {
          check = false;
          break;
        }
      }
    }
    return check;
  }


  refresh() {
    this.rowItem = new DmDinhMucHaoHut();
  }

  huyEdit(idx: number): void {
    this.dataEdit[idx] = {
      data: {...this.dataTable[idx]},
      edit: false,
    };
  }

  xoaItem(item: any) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.spinner.show();
        try {
          let body = {
            ids: item.id
          }
          this.dmDinhMucHaoHut.delete(body).then(async (res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS,);
              await this.search();
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
            await this.search();
            this.spinner.hide();
          });
        } catch (e) {
          console.log('error: ', e)
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  startEdit(i: number) {
    this.dataEdit[i].edit = true;
  }

  export() {
    this.spinner.show();
    try {
      let body = {};
      this.dmDinhMucHaoHut
        .export(body)
        .subscribe((blob) =>
          saveAs(blob, 'danh-muc-dm-hao-hut.xlsx'),
        );
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }


  async saveAndSend(trangThai: string, msg: string, msgSuccess?: string) {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.spinner.hide();
      return;
    }
    try {
      const body = this.formData.value;
      this.dataTable.forEach(data => {
        data.hinhThucBq = data.listHtbq && data.listHtbq.length > 0 ? data.listHtbq.toString() : this.listLoaiHinhBq.toString();
        data.phuongThucBq = data.listPtbq && data.listPtbq.length > 0 ? data.listPtbq.toString() : this.listPhuongThucBq.toString();
        data.loaiHinhBq = data.listLhbq && data.listLhbq.length > 0 ? data.listLhbq.toString() : this.listLoaiHinhBq.toString();
        data.apDungTai = data.listLhbq && data.listLhbq.length > 0 ? data.listCuc.toString() : this.dsCuc.toString();
      })
      body.maDvi = this.userInfo.MA_DVI;
      body.details = this.dataTable;
      await super.saveAndSend(body, trangThai, msg, msgSuccess);
    } catch (error) {
      console.log('error', error);
    }
  }

  async save() {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.spinner.hide();
      return;
    }
    try {
      const body = this.formData.value;
      body.maDvi = this.userInfo.MA_DVI;
      this.dataTable.forEach(data => {
        data.hinhThucBq = data.listHtbq && data.listHtbq.length > 0 ? data.listHtbq.toString() : this.listLoaiHinhBq.map(item => item.ma).toString();
        data.phuongThucBq = data.listPtbq && data.listPtbq.length > 0 ? data.listPtbq.toString() : this.listPhuongThucBq.map(item => item.ma).toString();
        data.loaiHinhBq = data.listLhbq && data.listLhbq.length > 0 ? data.listLhbq.toString() : this.listLoaiHinhBq.map(item => item.ma).toString();
        data.apDungTai = data.listLhbq && data.listLhbq.length > 0 ? data.listCuc.toString() : this.dsCuc.map(item => item.maDvi).toString();
      })
      body.details = this.dataTable;
      await this.createUpdate(body);
      await this.helperService.restoreRequiredForm(this.formData);
    } catch (error) {
      console.log('error', error);
    }
  }
}


export class DmDinhMucHaoHut {
  id: number;
  maDinhMuc: string;
  tenDinhMuc: string;
  loaiVthh: string;
  cloaiVthh: string;
  listCloaiVthh: string;
  hinhThucBq: string;
  loaiHinhBq: string;
  phuongThucBq: string;
  tgBaoQuanTu: number = 0;
  tgBaoQuanDen: number = 0;
  dinhMuc: number;
  apDungTai: string;
  tenLoaiVthh: string;
  tenCloaiVthh: string;
  listPtbq: any[];
  listHtbq: any[];
  listCuc: any[];
  listLhbq: any[];
}
