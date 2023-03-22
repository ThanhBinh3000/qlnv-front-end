import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup, Validators} from "@angular/forms";
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {chain} from 'lodash';
import * as uuid from "uuid";
import {NzModalService} from "ng-zorro-antd/modal";
import {DxChiCucPvcService} from "../../../../../../services/dinh-muc-nhap-xuat-bao-quan/pvc/dx-chi-cuc-pvc.service";
import {DanhMucCongCuDungCuService} from "../../../../../../services/danh-muc-cong-cu-dung-cu.service";
import dayjs from "dayjs";
import {MESSAGE} from "../../../../../../constants/message";
import {STATUS} from "../../../../../../constants/status";
import {
  PvcDxChiCucCtiet
} from "../../../../../dinh-muc/mang-pvc-cong-cu-dung-cu/de-xuat-nc-chi-cuc-pvc/them-moi-dx-chi-cuc-pvc/them-moi-dx-chi-cuc-pvc.component";
import {
  QuyetdinhpheduyetduandtxdService
} from "../../../../../../services/quan-ly-kho-tang/tiendoxaydungsuachua/quyetdinhpheduyetduandtxd.service";

@Component({
  selector: 'app-thong-tin-quyet-dinh-phe-duyet-du-an-dtxd',
  templateUrl: './thong-tin-quyet-dinh-phe-duyet-du-an-dtxd.component.html',
  styleUrls: ['./thong-tin-quyet-dinh-phe-duyet-du-an-dtxd.component.scss']
})
export class ThongTinQuyetDinhPheDuyetDuAnDtxdComponent extends Base2Component implements OnInit {
  formData: FormGroup;
  @Input('isViewDetail') isViewDetail: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input()
  idInput: number;
  isVisiblePopTongMucDauTu = false;
  STATUS = STATUS;
  maQd: string = '/QĐ-TCDT';
  listQdKhDtxd: any[] = []
  listDuAnDtxd: any[] = []
  dataTongMucDauTuSave: any[] = []
  formDataDetail: FormGroup;
  dataTreeTable: any[] = [];
  rowItemParent: TongMucDauTu = new TongMucDauTu();
  dataEdit: { [key: string]: { edit: boolean; data: TongMucDauTu } } = {};
  mapOfExpandedData: { [key: string]: TongMucDauTu[] } = {};

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetdinhpheduyetduandtxdService: QuyetdinhpheduyetduandtxdService
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetdinhpheduyetduandtxdService)
    super.ngOnInit()
    this.formData = this.fb.group({
      id: [null],
      maDvi: [null],
      soQd: [null, Validators.required],
      ngayKy: [null, Validators.required],
      soQdKhDtxd: [null],
      idQdKhDtxd: [null],
      trichYeu: [null, Validators.required],
      tenDuAn: [null],
      chuDauTu: [null, Validators.required],
      toChucTvtk: [null],
      chuNhiemDuAn: [null],
      mucTieuDt: [null],
      diaDiem: [null],
      dienTich: [null],
      paGpMb: [null],
      tongMucDt: [0],
      nguonVonDt: [null],
      hinhThucQlDa: [null],
      thoiGianTh: [null],
      thoiGianThTu: [null],
      thoiGianThDen: [null],
      noiDung: [null],
      paXayDung: [null],
      loaiCapCt: [null],
      noiDungKhac: [null],
      vonNsTw: [0],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      fileDinhKems: [null],
      lyDoTuChoi: [null],
      child: [null],
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      await Promise.all([
        // this.getAllDmCcdc(),
        // this.changeNamKh(this.formData.value.namKeHoach)
      ]);
      if (this.idInput) {
        this.detail(this.idInput)
      }
      this.convertListData();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async detail(id) {
    this.spinner.show();
    try {
      let res = await this.quyetdinhpheduyetduandtxdService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, data);
          this.formData.patchValue({
            soQd: data.soQd ? data.soQd.split('/')[0] : null
          })
          this.fileDinhKem = data.fileDinhKems;
          this.dataTable = data.listKtXdscQuyetDinhPdDtxdDtl;
          this.updateIdVirtual();
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


  updateIdVirtual() {
    if (this.dataTable) {
      this.dataTable.forEach((item, index) => {
        item.idVirtual = uuid.v4();
      });
    }
    this.dataTreeTable = this.dataTable;
    this.convertListData();
  }

  async save() {
    this.helperService.markFormGroupTouched(this.formData)
    if (this.formData.invalid) {
      return;
    }
    if (this.fileDinhKem && this.fileDinhKem.length > 0) {
      this.formData.value.fileDinhKems = this.fileDinhKem;
    }
    this.formData.value.soQd = this.formData.value.soQd + this.maQd;
    this.formData.value.listQlDinhMucPvcDxCcdcDtl = this.dataTable;
    this.formData.value.thoiGianThTu = dayjs(this.formData.value.thoiGianTh[0]).format('YYYY').toString();
    this.formData.value.thoiGianThDen = dayjs(this.formData.value.thoiGianTh[1]).format('YYYY').toString();
    let res = await this.createUpdate(this.formData.value)
    if (res) {
      this.goBack()
    }
  }

  changeSoQdKhDtxd(event) {

  }

  async themMoiCtiet(item?) {
    if (item) {
      this.formDataDetail = this.fb.group({
        idVirtual: uuid.v4(),
        chiMuc: null,
        noiDung: null,
        chiMucCha: item.chiMuc,
        capChiMuc: item.capChiMuc + 1,
        giaTri: 0,
        expand: true,
        thueVat: 0,
        chiPhiSauThue: 0,
      });
      this.isVisiblePopTongMucDauTu = true;
    } else {
      let msgRequired = this.required(this.rowItemParent);
      if (msgRequired) {
        this.notification.error(MESSAGE.ERROR, msgRequired);
        this.spinner.hide();
        return;
      }
      this.rowItemParent.idVirtual = uuid.v4();
      this.rowItemParent.thueVat = this.rowItemParent.giaTri ? (this.rowItemParent.giaTri * 10) / 100 : this.rowItemParent.giaTri;
      this.rowItemParent.chiPhiSauThue = this.rowItemParent.thueVat + this.rowItemParent.giaTri;
      this.rowItemParent.expand = true;
      this.dataTable = [...this.dataTable, this.rowItemParent];
      this.dataTreeTable = this.dataTable;
      this.rowItemParent = new TongMucDauTu();
      this.convertListData();
    }
  }

  required(item: TongMucDauTu) {
    let msgRequired = '';
    //validator
    if (!item.noiDung) {
      msgRequired = "Loại Ccdc không được để trống";
    }
    return msgRequired;
  }

  refresh() {
    this.rowItemParent = new TongMucDauTu();
  }

  convertListData() {
    if (this.dataTreeTable && this.dataTreeTable.length > 0) {
      let lv1 = this.dataTreeTable.filter(item => item.capChiMuc == 1);
      let lv2 = this.dataTreeTable.filter(item => item.capChiMuc == 2);
      let lv3 = this.dataTreeTable.filter(item => item.capChiMuc == 3);
      if (lv2 && lv2.length > 0) {
        lv2.forEach(it => {
          it.children = lv3 && lv3.length > 0 ? lv3.filter(lv3 =>
            lv3.chiMucCha == it.chiMuc
          ) : [];
        });
      }
      if (lv1 && lv1.length > 0) {
        lv1.forEach(it => {
          it.children = lv2 && lv2.length > 0 ? lv2.filter(lv2 => lv2.chiMucCha == it.chiMuc
          ) : [];
        });
      }
      this.dataTreeTable = lv1;
      lv1.forEach(item => {
        this.mapOfExpandedData[item.idVirtual] = this.convertTreeToList(item);
      });
    }
  }

  collapse(array: TongMucDauTu[], data: TongMucDauTu, $event: boolean): void {
    if (!$event) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.idVirtual === d.idVirtual)!;
          target.expand = true;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  visitNode(node: TongMucDauTu, hashMap: { [idVirtual: string]: boolean }, array: TongMucDauTu[]): void {
    if (!hashMap[node.idVirtual]) {
      hashMap[node.idVirtual] = true;
      array.push(node);
    }
  }

  convertTreeToList(root: TongMucDauTu): TongMucDauTu[] {
    const stack: TongMucDauTu[] = [];
    const array: TongMucDauTu[] = [];
    const hashMap = {};
    stack.push({...root, capChiMuc: 1, expand: true});
    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({...node.children[i], capChiMuc: node.capChiMuc! + 1, expand: true, parent: node});
        }
      }
    }
    return array;
  }

  deleteItem(data: any) {
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
          this.dataTable = this.dataTable.filter(it => it.idVirtual != data.idVirtual);
          this.dataTreeTable = this.dataTable;
          this.convertListData();
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  // expandAll() {
  //   this.dataTable.forEach(s => {
  //     this.expandSet.add(s.idVirtual);
  //   })
  // }

  handleCancel(): void {
    this.isVisiblePopTongMucDauTu = false;
  }

  handleOk(): void {
    let itemChild = this.formDataDetail.value;
    if (itemChild) {
      itemChild.thueVat = itemChild.giaTri ? (itemChild.giaTri * 10) / 100 : itemChild.giaTri;
      itemChild.chiPhiSauThue = itemChild.thueVat + itemChild.giaTri;
      itemChild.expand = true;
      this.dataTable = [...this.dataTable, itemChild];
      this.dataTreeTable = this.dataTable;
      this.formDataDetail.reset();
      this.convertListData();
    }
    this.isVisiblePopTongMucDauTu = false;
  }
}


export class TongMucDauTu {
  idVirtual: string;
  id: number;
  chiMuc: string;
  noiDung: string;
  chiMucCha: string;
  expand: boolean;
  capChiMuc: number = 1;
  giaTri: number = 0;
  thueVat: number = 0;
  children?: TongMucDauTu[];
  parent?: TongMucDauTu;
  chiPhiSauThue: number = 0;
}
