import {Component, Input, OnInit,} from '@angular/core';
import {Validators} from "@angular/forms";
import {NgxSpinnerService} from "ngx-spinner";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NzModalService} from "ng-zorro-antd/modal";
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {DonviService} from "../../../../../../services/donvi.service";
import {MESSAGE} from "../../../../../../constants/message";
import {
  DeXuatScLonService
} from "../../../../../../services/qlnv-kho/quy-hoach-ke-hoach/ke-hoach-sc-lon/de-xuat-sc-lon.service";
import {
  DanhMucSuaChuaService
} from "../../../../../../services/qlnv-kho/quy-hoach-ke-hoach/danh-muc-kho/danh-muc-sua-chua.service";
import dayjs from "dayjs";
import {STATUS} from "../../../../../../constants/status";

@Component({
  selector: 'app-them-moi-sc-lon',
  templateUrl: './them-moi-sc-lon.component.html',
  styleUrls: ['./them-moi-sc-lon.component.scss']
})
export class ThemMoiScLonComponent extends Base2Component implements OnInit {

  @Input() isViewDetail: boolean;
  @Input() typeHangHoa: string;
  @Input() idInput: number;
  maQd: string;
  dsCuc: any[] = [];
  dsChiCuc: any[] = [];
  rowItem: KtKhDxScLonCtiet = new KtKhDxScLonCtiet();
  rowItemDm: KtKhScLonDMuc = new KtKhScLonDMuc();
  dataEdit: { [key: string]: { edit: boolean; data: KtKhDxScLonCtiet } } = {};
  dataTableDm: any[] = [];
  listQdKhTh: any[] = [];
  listDmSuaChua: any[] = [];

  listLoaiDuAn: any[] = [];
  dsKho: any[] = [];

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private dexuatService: DeXuatScLonService,
    private danhMucService: DanhMucSuaChuaService,
    private dviService: DonviService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, dexuatService);
    super.ngOnInit()
    this.formData = this.fb.group({
      id: [null],
      maDvi: [null],
      capDvi: [null],
      tenDvi: [null],
      soCongVan: [null, Validators.required],
      namKeHoach: [dayjs().get('year'), Validators.required],
      trichYeu: [null, Validators.required],
      ngayKy: [null, Validators.required],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      lyDoTuChoi: [null],
    });
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.maQd = '/' + this.userInfo.MA_QD;
      await Promise.all([
        this.getAllDmSuaCHua(),
        this.loadDsDiemKho()
      ]);
      if (this.idInput) {
        await this.getDataDetail(this.idInput)
      } else {
        this.formData.patchValue({
          tenDvi: this.userInfo.TEN_DVI
        })
      }
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
  }

  async getAllDmSuaCHua() {
    let body = {
      type: "00",
      paggingReq: {
        limit: 99999,
        page: 0
      }
    }
    let res = await this.danhMucService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data.content && res.data.content.length > 0) {
        this.listDmSuaChua = res.data.content
        if (this.listDmSuaChua && this.listDmSuaChua.length > 0) {
          this.listDmSuaChua = this.listDmSuaChua.filter(item => item.maDiemKho.startsWith(this.userInfo.MA_DVI))
        }
      }
    }
  }

  async loadDsDiemKho() {
    const dsTong = await this.dviService.layTatCaDonViByLevel(4);
    this.dsKho = dsTong.data
    this.dsKho = this.dsKho.filter(item => item.maDvi.startsWith(this.userInfo.MA_DVI) && item.type != 'PB')
  }


  async getDataDetail(id) {
    if (id > 0) {
      let res = await this.dexuatService.getDetail(id);
      const data = res.data;
      this.helperService.bidingDataInFormGroup(this.formData, data);
      this.fileDinhKem = data.fileDinhKems
      this.dataTable = data.chiTiets;
      this.dataTableDm = data.chiTietDms;
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
    body.capDvi = this.userInfo.CAP_DVI
    body.soCongVan = body.soCongVan + this.maQd
    body.fileDinhKems = this.fileDinhKem
    body.chiTiets = this.dataTable
    body.chiTietDms = this.dataTableDm
    let data = await this.createUpdate(body);
    if (data) {
      if (isOther) {
        let trangThai;
        switch (this.formData.value.trangThai) {
          case STATUS.DU_THAO :
          case STATUS.TU_CHOI_TP :
          case STATUS.TU_CHOI_CBV : {
            trangThai = STATUS.CHO_DUYET_TP;
            break;
          }
          case STATUS.TU_CHOI_LDC : {
            trangThai = STATUS.CHO_DUYET_LDC;
            break;
          }
        }
        this.approve(data.id, trangThai, "Bạn có chắc chắn muốn gửi duyệt ?")
      } else {
        this.goBack()
      }
    }
  }

  duyet() {
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
        trangThai = STATUS.DA_DUYET_CBV;
        break;
      }
    }
    this.approve(this.idInput, trangThai, "Bạn có chắc chắn muốn duyệt ?")
  }

  tuChoi() {
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
        trangThai = STATUS.TU_CHOI_CBV;
        break;
      }
    }
    this.reject(this.idInput, trangThai);
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
    this.rowItem.maDvi = this.userInfo.MA_DVI
    this.dataTable = [...this.dataTable, this.rowItem]
    this.dataTableDm = [...this.dataTableDm, this.rowItemDm]
    this.rowItem = new KtKhDxScLonCtiet();
    this.updateEditCache()
  }

  clearData() {
    this.rowItem = new KtKhDxScLonCtiet();
  }

  huyEdit(idx: number): void {
    this.dataEdit[idx] = {
      data: {...this.dataTable[idx]},
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
          data: {...item},
        }
      });
    }
  }

  editItem(index: number): void {
    this.dataEdit[index].edit = true;
  }

  changDmSuaChua(event: any) {
    if (event) {
      let result = this.listDmSuaChua.filter(item => item.maCongTrinh == event)
      if (result && result.length > 0) {
        this.rowItem.tenCongTrinh = result[0].tenCongTrinh;
        this.rowItem.tenDiemKho = result[0].tenDiemKho;
        this.rowItem.maDiemKho = result[0].maDiemKho
        this.rowItem.tgThucHien = result[0].tgThucHien + '-' + result[0].tgHoanThanh
        let detailKho = this.dsKho.filter(item => item.maDvi == result[0].maDiemKho)
        if (detailKho && detailKho.length > 0) {
          this.rowItem.diaDiem = detailKho[0].diaChi
        }
        this.rowItemDm.tenCongTrinh = result[0].tenCongTrinh;
        this.rowItemDm.tieuChuan = result[0].tieuChuan;
        this.rowItemDm.tgSuaChua = result[0].tgSuaChua;
        this.rowItemDm.lyDo = result[0].lyDo;
        this.rowItemDm.duToan = result[0].lyDo;
        this.rowItemDm.tgThucHien = result[0].tgThucHien + '-' + result[0].tgHoanThanh
        this.rowItemDm.ghiChu = result[0].ghiChu
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
    if (arr && arr.length > 0) {
      let result = arr[0];
      this.dataTable = result.ctiets
      this.updateEditCache()
    }
  }
}

export class KtKhDxScLonCtiet {
  id: number;
  diaDiem: string;
  giaTriPd: number = 0;
  giaTriTmdt: number = 0;
  hdrId: number = 0;
  luyKeDuToan: number = 0;
  luyKeKh: number = 0;
  maCongTrinh: string;
  maDiemKho: string;
  tenDiemKho: string;
  maDvi: string;
  ncKhVon: number = 0;
  ngayBhPd: string;
  ngayBhTmdt: string;
  tenCongTrinh: string;
  tgThucHien: string;
  tinhHinh: number = 0
}

export class KtKhScLonDMuc {
  id: number;
  tenCongTrinh: string
  hdrId: number;
  lyDo: string;
  qdThamQuyen: string;
  duToan: string;
  tgSuaChua: string;
  tgThucHien: string;
  tieuChuan: string;
  ghiChu: string;
}
