
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ThongTinQuyetDinh} from "../../../../../../models/DeXuatKeHoachuaChonNhaThau";
import {Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {UserService} from "../../../../../../services/user.service";
import {Globals} from "../../../../../../shared/globals";
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {NzModalService} from "ng-zorro-antd/modal";
import {HelperService} from "../../../../../../services/helper.service";
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {KtKhXdHangNamService} from "../../../../../../services/kt-kh-xd-hang-nam.service";
import {DonviService} from "../../../../../../services/donvi.service";
import {DanhMucKho} from "../../../danh-muc-du-an/danh-muc-du-an.component";
import {MESSAGE} from "../../../../../../constants/message";
import {DanhMucKhoService} from "../../../../../../services/danh-muc-kho.service";
import {QuyetDinhKhTrungHanService} from "../../../../../../services/quyet-dinh-kh-trung-han.service";
import {STATUS} from "../../../../../../constants/status";

@Component({
  selector: 'app-them-moi-dx-nhu-cau',
  templateUrl: './them-moi-dx-nhu-cau.component.html',
  styleUrls: ['./them-moi-dx-nhu-cau.component.scss']
})
export class ThemMoiDxNhuCauComponent extends Base2Component implements OnInit {

  @Input() isViewDetail: boolean;
  @Input() typeHangHoa: string;
  @Input() idInput: number;
  maQd: string;
  dsCuc: any[] = [];
  dsChiCuc: any[] = [];
  rowItem: DanhMucKho = new DanhMucKho();
  dataEdit: { [key: string]: { edit: boolean; data: DanhMucKho } } = {};
  listQdKhTh: any[] = [];
  listDmKho: any[] = [];

  listLoaiDuAn: any[] = [];

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private dexuatService : KtKhXdHangNamService,
    private dviService : DonviService,
    private dmKhoService : DanhMucKhoService,
    private danhMucService : DanhMucService,
    private qdTrungHanSv : QuyetDinhKhTrungHanService
  ) {
    super(httpClient, storageService, notification, spinner, modal, dexuatService);
    super.ngOnInit()
    this.formData = this.fb.group({
      id: [null],
      maDvi : [null],
      tenDvi : [null],
      soCongVan : [null, Validators.required],
      namKeHoach : [null, Validators.required],
      soQdTrunghan : [null, Validators.required],
      trichYeu : [null, Validators.required],
      ngayKy : [null, Validators.required],
      trangThai : ['00'],
      tenTrangThai : ['Dự thảo'],
    });
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.maQd = '/' + this.userInfo.MA_QD;
      await Promise.all([
        this.getAllDmKho(),
        this.getAllLoaiDuAn(),
        this.getAllQdTrungHan()
      ]);
      if (this.idInput) {
        await this.getDataDetail(this.idInput)
      } else {
        this.formData.patchValue({
          tenDvi : this.userInfo.TEN_DVI
        })
      }
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
  }

  async getAllDmKho() {
    let res = await this.dmKhoService.getAllDmKho('DMK');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDmKho = res.data
    }
  }

  async getAllLoaiDuAn() {
    let res = await this.danhMucService.danhMucChungGetAll("LOAI_DU_AN_KT");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiDuAn = res.data;
    }
  }

  async getAllQdTrungHan() {
    let res = await this.qdTrungHanSv.getListQd();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listQdKhTh = res.data
    }
  }


  async getDataDetail(id) {
    if (id > 0) {
      let res = await this.dexuatService.getDetail(id);
      const data = res.data;
      this.formData.patchValue({
        id: data.id,
        maDvi : data.maDvi,
        tenDvi : data.tenDvi,
        soCongVan: data.soCongVan ? data.soCongVan.split('/')[0] : '',
        namKeHoach : data.namKeHoach,
        soQdTrunghan :data.soQdTrunghan,
        trichYeu : data.trichYeu,
        ngayKy : data.ngayKy,
        trangThai : data.trangThai,
        tenTrangThai : data.tenTrangThai,
      });
      this.fileDinhKem = data.fileDinhKems
      this.dataTable = data.ctiets;
      this.updateEditCache()
    }
  }




  async save(isOther: boolean) {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    body.maDvi = this.userInfo.MA_DVI
    body.soCongVan = body.soCongVan + this.maQd
    body.fileDinhKems = this.fileDinhKem
    body.ctiets = this.dataTable
    body.tmdt = this.calcTong('1') ? this.calcTong('1') : 0 ;
    let data = await this.createUpdate(body);
    if (data) {
      if (isOther) {
        let trangThai;
        switch (this.formData.value.trangThai) {
          case STATUS.DU_THAO :
          case STATUS.TU_CHOI_TP : {
            trangThai = STATUS.CHO_DUYET_TP;
            break;
          }
          case STATUS.TU_CHOI_LDC:
          case STATUS.TU_CHOI_LDV:
          case STATUS.CHO_DUYET_TP : {
            trangThai = STATUS.CHO_DUYET_LDC;
            break;
          }
        }
        this.approve(data.id, trangThai, "Bạn có chắc chắn muốn gửi duyệt?");
      } else {
        this.goBack()
      }
    }
  }

  async duyet() {
    let trangThai;
    switch (this.formData.value.trangThai) {
      case STATUS.CHO_DUYET_TP : {
        trangThai = STATUS.CHO_DUYET_LDC;
        break;
      }
      case STATUS.CHO_DUYET_LDC : {
        trangThai = STATUS.DA_DUYET_LDC;
        break;
      }
      case STATUS.DA_DUYET_LDC : {
        trangThai = STATUS.DA_DUYET_LDV;
        break;
      }
    }
    await this.approve(this.formData.value.id, trangThai, "Bạn có chắc chắn muốn duyệt?")
  }

  async tuChoi() {
    let trangThai;
    switch (this.formData.value.trangThai) {
      case STATUS.CHO_DUYET_TP : {
        trangThai = STATUS.TU_CHOI_TP;
        break;
      }
      case STATUS.CHO_DUYET_LDC : {
        trangThai = STATUS.TU_CHOI_LDC;
        break;
      }
      case STATUS.DA_DUYET_LDC : {
        trangThai = STATUS.TU_CHOI_LDV;
        break;
      }
    }
    await this.reject(this.formData.value.id, trangThai, "Bạn có chắc chắn muốn từ chối?")
  }

  xoaItem(index: number) {
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
          this.updateEditCache()
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  themMoiItem() {
    if (!this.dataTable) {
      this.dataTable = [];
    }
    this.dataTable = [...this.dataTable, this.rowItem]
    this.rowItem = new DanhMucKho();
    this.updateEditCache()
  }

  clearData() {
    this.rowItem = new DanhMucKho();
  }

  huyEdit(idx: number): void {
    this.dataEdit[idx] = {
      data: { ...this.dataTable[idx] },
      edit: false,
    };
  }

  luuEdit(index: number): void {
    Object.assign(this.dataTable[index], this.dataEdit[index].data);
    this.dataEdit[index].edit = false;
  }

  updateEditCache(): void {
    if (this.dataTable) {
      this.dataTable.forEach((item, index) => {
        this.dataEdit[index] = {
          edit: false,
          data: { ...item },
        }
      });
    }
  }
  editItem(index: number): void {
    this.dataEdit[index].edit = true;
  }

  changeDmucDuAn(event: any) {
    if (event) {
      let result = this.listDmKho.filter(item => item.maDuAn == event)
      if (result && result.length > 0) {
        this.rowItem = result[0];
        this.rowItem.tgKcHt = this.rowItem.tgKhoiCong + ' - ' + this.rowItem.tgHoanThanh
      }
    }
  }
  calcTong(type) {
    let sum;
    if (this.dataTable && this.dataTable.length > 0) {
      sum = this.dataTable.reduce((prev, cur) => {
        switch (type) {
          case '1' : {
            prev += cur.tmdtDuKien;
            break;
          }
          case '2' : {
            prev += cur.nstwDuKien;
            break;
          }
          case '3' : {
            prev += cur.tongSoLuyKe;
            break;
          }
          case '4' : {
            prev += cur.luyKeNstw;
            break;
          }
          case '5' : {
            prev += cur.tmdtDuyet;
            break;
          }
          case '6' : {
            prev += cur.nstwDuyet;
            break;
          }
        }
        return prev;
      }, 0);
    }
    return sum;
  }

  async updateDx(event) {
    let arr = this.listQdKhTh.filter(item => item.soCongVan == event);
    if (arr && arr.length >0) {
      let result = arr[0];
      this.dataTable = result.ctiets
      this.updateEditCache()
    }
  }
}

