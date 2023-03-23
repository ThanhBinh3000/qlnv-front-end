import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup, Validators} from "@angular/forms";
import {
  TongMucDauTu
} from "../../quyet-dinh-phe-duyet-du-an-dtxd/thong-tin-quyet-dinh-phe-duyet-du-an-dtxd/thong-tin-quyet-dinh-phe-duyet-du-an-dtxd.component";
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import * as uuid from "uuid";
import {
  QuyetdinhpheduyetduandtxdService
} from "../../../../../../services/quan-ly-kho-tang/tiendoxaydungsuachua/quyetdinhpheduyetduandtxd.service";
import {KtQdXdHangNamService} from "../../../../../../services/kt-qd-xd-hang-nam.service";
import {MESSAGE} from "../../../../../../constants/message";
import {STATUS} from "../../../../../../constants/status";
import dayjs from "dayjs";
import {
  QuyetdinhpheduyetTktcTdtService
} from "../../../../../../services/quan-ly-kho-tang/tiendoxaydungsuachua/quyetdinhpheduyetTktcTdt.service";

@Component({
  selector: 'app-thong-tin-quyet-dinh-phe-duyet-tktc-tdt',
  templateUrl: './thong-tin-quyet-dinh-phe-duyet-tktc-tdt.component.html',
  styleUrls: ['./thong-tin-quyet-dinh-phe-duyet-tktc-tdt.component.scss']
})
export class ThongTinQuyetDinhPheDuyetTktcTdtComponent extends Base2Component implements OnInit {
  formData: FormGroup;
  @Input('isViewDetail') isViewDetail: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input()
  idInput: number;
  isVisiblePopDuToanXayDung = false;
  STATUS = STATUS;
  maQd: string = '/QĐ-TCDT';
  listQdPdDtxd: any[] = []
  formDataDetail: FormGroup;
  dataTreeTable: any[] = [];
  rowItemParent: DuToanXayDung = new DuToanXayDung();
  dataEdit: { [key: string]: { edit: boolean; data: DuToanXayDung } } = {};
  mapOfExpandedData: { [key: string]: DuToanXayDung[] } = {};

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetdinhpheduyetTktcTdtService: QuyetdinhpheduyetTktcTdtService,
    private quyetdinhpheduyetduandtxdService: QuyetdinhpheduyetduandtxdService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetdinhpheduyetTktcTdtService)
    super.ngOnInit()
    this.formData = this.fb.group({
      id: [null],
      maDvi: [this.userInfo.MA_DVI],
      soQd: [null, Validators.required],
      ngayKy: [null, Validators.required],
      soQdPdDtxd: [null, Validators.required],
      idQdPdDtxd: [null, Validators.required],
      trichYeu: [null, Validators.required],
      tenDuAn: [null, Validators.required],
      chuDauTu: [null],
      tenCongTrinh: [null],
      diaDiem: [null],
      nhaThauBc: [null],
      nhaThauTk: [null],
      giaTriDt: [0],
      donViTt: [null],
      noiDung: [null],
      quyMo: [null],
      loaiCapCt: [null],
      noiDungKhac: [null],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      fileDinhKems: [null],
      child: [null],
      listKtXdscQuyetDinhPdTktcTdtDtl: null
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      await Promise.all([
        this.loadQdPdĐtxd(),
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

  async loadQdPdĐtxd() {
    this.spinner.show();
    try {
      let body = {
        "maDvi": this.userInfo.MA_DVI,
        "trangThai": STATUS.BAN_HANH,
        "paggingReq": {
          "limit": 10000,
          "page": this.page - 1
        },
      };
      let res = await this.quyetdinhpheduyetduandtxdService.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.listQdPdDtxd = res.data.content;
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

  async detail(id) {
    this.spinner.show();
    try {
      let res = await this.quyetdinhpheduyetTktcTdtService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, data);
          this.formData.patchValue({
            soQd: data.soQd ? data.soQd.split('/')[0] : null
          })
          this.fileDinhKem = data.fileDinhKems;
          this.dataTable = data.listKtXdscQuyetDinhPdTktcTdtDtl;
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

  async tinhTongGiaTriDuToan() {
    let total = this.dataTable.reduce((accumulator, object) => {
      return accumulator + object.giaTri;
    }, 0);
    this.formData.patchValue({
      giaTriDt: total
    });
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
    this.formData.value.listKtXdscQuyetDinhPdTktcTdtDtl = this.dataTable;
    let res = await this.createUpdate(this.formData.value)
    if (res) {
      this.goBack()
    }
  }

  changeSoQdPdDtxd(event) {
    if (event) {
      let item = this.listQdPdDtxd.filter(it => it.soQd == event)[0];
      if (item) {
        this.formData.patchValue({
          idQdPdDtxd: item.id,
          tenDuAn: item.tenDuAn,
          chuDauTu: item.chuDauTu,
          diaDiem: item.diaDiem,
        });
      }
    }
  }

  async banHanh(id) {
    let trangThai = STATUS.BAN_HANH;
    let mesg = 'Ban hành quyết định'
    this.approve(id, trangThai, mesg);
  }

  initFormDataDetail() {
    this.formDataDetail = this.fb.group({
      id: [null],
      idVirtual: uuid.v4(),
      chiMuc: [null, Validators.required],
      noiDung: [null, Validators.required],
      chiMucCha: [null],
      capChiMuc: [null, Validators.required],
      giaTri: [0],
      expand: true,
      kyHieu: null,
    });
  }

  async themMoiCtiet(item?) {
    if (item) {
      this.formDataDetail = this.fb.group({
        idVirtual: uuid.v4(),
        chiMuc: [null, Validators.required],
        noiDung: [null, Validators.required],
        chiMucCha: item.chiMuc,
        capChiMuc: item.capChiMuc + 1,
        giaTri: [null, Validators.required],
        expand: true,
        kyHieu: [null],
      });
      this.isVisiblePopDuToanXayDung = true;
    } else {
      let msgRequired = this.required(this.rowItemParent);
      if (msgRequired) {
        this.notification.error(MESSAGE.ERROR, msgRequired);
        this.spinner.hide();
        return;
      }
      this.rowItemParent.idVirtual = uuid.v4();
      this.rowItemParent.expand = true;
      this.dataTable = [...this.dataTable, this.rowItemParent];
      this.dataTreeTable = this.dataTable;
      this.rowItemParent = new DuToanXayDung();
      this.convertListData();
      this.tinhTongGiaTriDuToan();
    }
  }

  editRow(item) {
    if (item) {
      this.initFormDataDetail();
      this.formDataDetail.patchValue({
        id: item.id,
        idVirtual: item.idVirtual,
        chiMuc: item.chiMuc,
        noiDung: item.noiDung,
        chiMucCha: item.chiMucCha,
        capChiMuc: item.capChiMuc,
        giaTri: item.giaTri,
        expand: true,
        kyHieu: item.kyHieu,
      });
      this.isVisiblePopDuToanXayDung = true;
    }
  }

  required(item: DuToanXayDung) {
    let msgRequired = '';
    //validator
    if (!item.noiDung || !item.chiMuc || !item.giaTri) {
      msgRequired = "Chỉ mục, nội dung, và giá trị không được để trống";
    }
    return msgRequired;
  }

  refresh() {
    this.rowItemParent = new DuToanXayDung();
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

  collapse(array: DuToanXayDung[], data: DuToanXayDung, $event: boolean): void {
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

  visitNode(node: DuToanXayDung, hashMap: { [idVirtual: string]: boolean }, array: DuToanXayDung[]): void {
    if (!hashMap[node.idVirtual]) {
      hashMap[node.idVirtual] = true;
      array.push(node);
    }
  }

  convertTreeToList(root: DuToanXayDung): DuToanXayDung[] {
    const stack: DuToanXayDung[] = [];
    const array: DuToanXayDung[] = [];
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
          this.tinhTongGiaTriDuToan();
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  handleCancel(): void {
    this.isVisiblePopDuToanXayDung = false;
  }

  handleOk(): void {
    this.helperService.markFormGroupTouched(this.formDataDetail)
    if (this.formDataDetail.invalid) {
      return;
    }
    let itemChild = this.formDataDetail.value;
    if (itemChild) {
      if (itemChild.id && itemChild.id > 0) {
        this.dataTable = this.dataTable.map(obj => {
          if (obj.id == itemChild.id) {
            itemChild.expand = true;
            return itemChild;
          }
          return obj;
        });
      } else {
        itemChild.expand = true;
        this.dataTable = [...this.dataTable, itemChild];
      }
      this.dataTreeTable = this.dataTable;
      this.formDataDetail.reset();
      this.convertListData();
      this.tinhTongGiaTriDuToan();
    }
    this.isVisiblePopDuToanXayDung = false;
  }
}


export class DuToanXayDung {
  idVirtual: string;
  id: number;
  chiMuc: string;
  noiDung: string;
  chiMucCha: string;
  expand: boolean;
  capChiMuc: number = 1;
  giaTri: number = 0;
  kyHieu: string;
  children?: DuToanXayDung[];
  parent?: DuToanXayDung;
}


