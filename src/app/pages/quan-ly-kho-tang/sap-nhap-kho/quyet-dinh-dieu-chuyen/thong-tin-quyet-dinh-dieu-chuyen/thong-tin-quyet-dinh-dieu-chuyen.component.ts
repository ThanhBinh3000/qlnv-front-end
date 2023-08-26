import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {v4 as uuidv4} from "uuid";
import {Validators} from "@angular/forms";
import * as dayjs from "dayjs";
import {Base2Component} from "../../../../../components/base2/base2.component";
import {StorageService} from "../../../../../services/storage.service";
import {DonviService} from "../../../../../services/donvi.service";
import {DanhMucService} from "../../../../../services/danhmuc.service";
import {STATUS} from "../../../../../constants/status";
import {MESSAGE} from "../../../../../constants/message";
import {chain, cloneDeep} from 'lodash';
import {FILETYPE} from "../../../../../constants/fileType";
import {
  QuyetDinhDieuChuyenService
} from "../../../../../services/qlnv-kho/dieu-chuyen-sap-nhap-kho/QuyetDinhDieuChuyen.service";

@Component({
  selector: 'app-thong-tin-quyet-dinh-dieu-chuyen',
  templateUrl: './thong-tin-quyet-dinh-dieu-chuyen.component.html',
  styleUrls: ['./thong-tin-quyet-dinh-dieu-chuyen.component.scss']
})
export class ThongTinQuyetDinhDieuChuyenComponent extends Base2Component implements OnInit {
  @Input('isView') isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input()
  idInput: number;
  listCcPhapLy: any[] = [];
  listFileDinhKem: any[] = [];
  listFile: any[] = [];
  maQd: string;
  expandSetString = new Set<string>();
  listTrangThaiSn: any[] = [
    {ma: this.STATUS.CHUA_THUC_HIEN, giaTri: "Chưa hoàn thành"},
    {ma: this.STATUS.DANG_THUC_HIEN, giaTri: "Đang hoàn thành"},
    {ma: this.STATUS.DA_HOAN_THANH, giaTri: "Đã hoàn thành"},
  ];
  dsCuc: any;
  dsCucDi: any;
  dsCucDen: any;
  dsChiCuc: any;
  dsChiCucDi: any;
  dsChiCucDen: any;
  dsKho: any;
  dsKhoDi: any;
  dsKhoDen: any;
  rowItem: ItemXhXkVtquyetDinhPdDtl = new ItemXhXkVtquyetDinhPdDtl;
  dataEdit: { [key: string]: { edit: boolean; data: ItemXhXkVtquyetDinhPdDtl } } = {};
  hasError: boolean = false;


  constructor(httpClient: HttpClient,
              storageService: StorageService,
              notification: NzNotificationService,
              spinner: NgxSpinnerService,
              modal: NzModalService,
              private donviService: DonviService,
              private danhMucService: DanhMucService,
              private quyetDinhDieuChuyenService: QuyetDinhDieuChuyenService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhDieuChuyenService);
    this.formData = this.fb.group({
      id: [],
      maDvi: [this.userInfo.MA_DVI],
      nam: [dayjs().get("year"), [Validators.required]],
      soQuyetDinh: [],
      ngayKy: [],
      lyDoTuChoi: [],
      trichYeu: [],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự thảo'],
      trangThaiSn: [],
      tenTrangThaiSn: [],
      quyetDinhPdDtl: [new Array<ItemXhXkVtquyetDinhPdDtl>()],
      loai: ["SN_DIEM_KHO"],
    })
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      await Promise.all([
        this.loadDsCuc()
      ])
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


  async buildTableView(data?: any) {
    this.dataTable = chain(data)
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

  async bindingData() {
    this.maQd = "/" + this.userInfo.MA_QD
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI,
    })
  }


  onExpandStringChange(id: string, checked: boolean) {
    if (checked) {
      this.expandSetString.add(id);
    } else {
      this.expandSetString.delete(id);
    }
  }

  async save(isGuiDuyet?) {
    let body = this.formData.value;
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
    body.soQuyetDinh = this.formData.value.soQuyetDinh + this.maQd;
    body.quyetDinhPdDtl = this.dataTable;


    let data = await this.createUpdate(body);
    if (data) {
      this.idInput = data.id;
    }
    await this.spinner.hide();
  }

  async flattenTree(tree) {
    return tree.flatMap((item) => {
      return item.childData ? this.flattenTree(item.childData) : item;
    });
  }


  async getDetail(id: number) {
    await this.quyetDinhDieuChuyenService
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
            this.dataTable = dataDetail.quyetDinhPdDtl;
            this.buildTableView(this.dataTable)
            if (dataDetail.fileDinhKems && dataDetail.fileDinhKems.length > 0) {
              dataDetail.fileDinhKems.forEach(item => {
                if (item.fileType == FILETYPE.FILE_DINH_KEM) {
                  this.listFileDinhKem.push(item)
                } else if (item.fileType == FILETYPE.CAN_CU_PHAP_LY) {
                  this.listCcPhapLy.push(item)
                }
              })
            }
          }
        }
      })
      .catch((e) => {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      });
  }

  async loadDsCuc() {
    const dsTong = await this.donviService.layTatCaDonViByLevel(2);
    this.dsCuc = dsTong.data
    this.dsCucDi = this.dsCuc.filter(item => item.type != "PB");
    this.dsCucDen = this.dsCuc.filter(item => item.type != "PB")
  }

  async changeCucDi(event) {
    const dsTong = await this.donviService.layTatCaDonViByLevel(3);
    this.dsChiCuc = dsTong.data
    this.dsChiCucDi = this.dsChiCuc.filter(item => item.maDvi.startsWith(event) && item.type != 'PB');
  }

  async changeCucDen(event) {
    const dsTong = await this.donviService.layTatCaDonViByLevel(3);
    this.dsChiCuc = dsTong.data
    this.dsChiCucDen = this.dsChiCuc.filter(item => item.maDvi.startsWith(event) && item.type != 'PB')
  }

  async loadDsDiemKhoDi(event) {
    const dsTong = await this.donviService.layTatCaDonViByLevel(4);
    this.dsKho = dsTong.data
    this.dsKhoDi = this.dsKho.filter(item => item.maDvi.startsWith(event) && item.type != 'PB');
  }

  async loadDsDiemKhoDen(event) {
    const dsTong = await this.donviService.layTatCaDonViByLevel(4);
    this.dsKho = dsTong.data
    this.dsKhoDen = this.dsKho.filter(item => item.maDvi.startsWith(event) && item.type != 'PB')
  }

  clearData() {
    this.rowItem = new ItemXhXkVtquyetDinhPdDtl();
  }

  themMoiItem() {
    this.rowItem.maDiaDiemDi = this.rowItem.maDiemKhoDi;
    this.rowItem.maDiaDiemDen = this.rowItem.maDiemKhoDen;
    if (this.rowItem.maDiaDiemDi && this.rowItem.maDiaDiemDen != null) {
      this.sortTableId();
      let item = cloneDeep(this.rowItem);
      item.tenCucDi = this.dsCucDi.find(s => s.key == item.maCucDi)?.title;
      item.tenChiCucDi = this.dsChiCucDi.find(s => s.key == item.maChiCucDi)?.title;
      item.tenDiemKhoDi = this.dsKhoDi.find(s => s.key == item.maDiemKhoDi)?.title;
      item.tenCucDen = this.dsCucDen.find(s => s.key == item.maCucDen)?.title;
      item.tenChiCucDen = this.dsChiCucDen.find(s => s.key == item.maChiCucDen)?.title;
      item.tenDiemKhoDen = this.dsKhoDen.find(s => s.key == item.maDiemKhoDen)?.title;
      item.stt = this.dataTable.length + 1;
      item.edit = false;
      this.dataTable = [
        ...this.dataTable,
        item,
      ]

      this.rowItem = new ItemXhXkVtquyetDinhPdDtl();
      this.updateEditCache();
    } else {
      this.notification.error(MESSAGE.ERROR, "Vui lòng điền đầy đủ thông tin")
    }
  }

  sortTableId() {
    this.dataTable.forEach((lt, i) => {
      lt.stt = i + 1;
    });
  }

  checkExitsData(item, dataItem): boolean {
    let rs = false;
    if (dataItem && dataItem.length > 0) {
      dataItem.forEach(it => {
        if (it.tenChiTieu == item.tenChiTieu) {
          rs = true;
          return;
        }
      });
    }
    return rs;
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
          this.updateEditCache();
          this.dataTable;
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  editItem(index: number): void {
    this.dataEdit[index].edit = true;
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

  huyEdit(id: number): void {
    const index = this.dataTable.findIndex((item) => item.idVirtual == id);
    this.dataEdit[id] = {
      data: {...this.dataTable[index]},
      edit: false,
    };
  }

  luuEdit(index: number): void {
    this.hasError = (false);
    let item = Object.assign(this.dataTable[index], this.dataEdit[index].data);
    item.tenCucDi = this.dsCucDi.find(s => s.key == item.maCucDi)?.title;
    item.tenChiCucDi = this.dsChiCucDi.find(s => s.key == item.maChiCucDi)?.title;
    item.tenDiemKhoDi = this.dsKhoDi.find(s => s.key == item.maDiemKhoDi)?.title;
    item.tenCucDen = this.dsCucDen.find(s => s.key == item.maCucDen)?.title;
    item.tenChiCucDen = this.dsChiCucDen.find(s => s.key == item.maChiCucDen)?.title;
    item.tenDiemKhoDen = this.dsKhoDen.find(s => s.key == item.maDiemKhoDen)?.title;
    this.dataEdit[index].edit = false;
  }

}


export class ItemXhXkVtquyetDinhPdDtl {
  id: string;
  maDiaDiemDi: string;
  maCucDi: string;
  tenCucDi: string;
  maChiCucDi: string;
  tenChiCucDi: string;
  maDiemKhoDi: string;
  tenDiemKhoDi: string;
  maDiaDiemDen: string;
  maCucDen: string;
  tenCucDen: string;
  maChiCucDen: string;
  tenChiCucDen: string;
  maDiemKhoDen: string;
  tenDiemKhoDen: string;
  ghiChu: string;
}
