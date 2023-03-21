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
  STATUS = STATUS;
  maQd: string = '/QĐ-TCDT';
  listQdKhDtxd: any[] = []
  listDuAnDtxd: any[] = []
  rowItemParent: TongMucDauTu = new TongMucDauTu();
  dataEdit: { [key: string]: { edit: boolean; data: TongMucDauTu } } = {};
  mapOfExpandedData: { [key: string]: TongMucDauTu[] } = {};

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private dxChiCucService: DxChiCucPvcService,
    private danhMucCongCuDungCuService: DanhMucCongCuDungCuService
  ) {
    super(httpClient, storageService, notification, spinner, modal, dxChiCucService)
    super.ngOnInit()
    this.formData = this.fb.group({
      id: [null],
      maDvi: [null],
      soQd: [null, Validators.required],
      ngayKy: [null, Validators.required],
      soQdKhDtxd: [null],
      idQdKhDtxd: [null],
      trichYeu: [null],
      tenDuAn: [null],
      chuDauTu: [null],
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
      this.dataTable = [{
        id: 1,
        chiMuc: "A",
        noiDungCha: "Chi phí xây dựng",
        noiDung: "Phần thân",
        tenKho: "Kho lương thực 1",
        chiMucCha: null,
        capChiMuc: 1,
        giaTri: 0,
        thueVat: 0,
        chiPhiSauThue: 0
      }, {
        id: 2,
        chiMuc: "A",
        noiDungCha: "Chi phí nội thất",
        noiDung: "Phần điện",
        tenKho: "Kho lương thực 2",
        chiMucCha: null,
        capChiMuc: 1,
        giaTri: 0,
        thueVat: 0,
        chiPhiSauThue: 0
      }, {
        id: 3,
        chiMuc: "A",
        noiDungCha: "CCCCC",
        noiDung: "Phần aaaaa",
        tenKho: "Kho lương thực 1",
        chiMucCha: "A",
        capChiMuc: 2,
        giaTri: 0,
        thueVat: 0,
        chiPhiSauThue: 0
      },
        {
          id: 4,
          chiMuc: "B",
          noiDungCha: "CCCCC",
          noiDung: "Phần cc",
          tenKho: "Kho lương thực 234121",
          chiMucCha: "A",
          capChiMuc: 2,
          giaTri: 0,
          thueVat: 0,
          chiPhiSauThue: 0
        },
        {
          id: 5,
          chiMuc: "C",
          noiDungCha: "a",
          noiDung: "ádds cc",
          tenKho: "Kho lương thực 234121",
          chiMucCha: "A",
          capChiMuc: 2,
          giaTri: 0,
          thueVat: 0,
          chiPhiSauThue: 0
        }
      ];
      // this.convertListData();
      this.buildViewTree()
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }


  async save() {
    if (this.dataTable.length <= 0) {
      this.notification.error(MESSAGE.ERROR, "Bạn chưa nhập chi tiết đề xuất");
      return;
    }
    this.helperService.markFormGroupTouched(this.formData)
    if (this.formData.invalid) {
      return;
    }
    if (this.fileDinhKem && this.fileDinhKem.length > 0) {
      this.formData.value.fileDinhKems = this.fileDinhKem;
    }
    this.formData.value.listQlDinhMucPvcDxCcdcDtl = this.dataTable;
    this.formData.value.maDvi = this.userInfo.MA_DVI;
    this.formData.value.capDvi = this.userInfo.CAP_DVI;
    this.formData.value.soQd = this.formData.value.soQd + this.maQd;
    let res = await this.createUpdate(this.formData.value)
    if (res) {
      this.goBack()
    }
  }

  buildViewTree() {
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable = chain(this.dataTable)
        .groupBy("chiMuc")
        .map((value, key) => {
          let rs = chain(value)
            .groupBy("capChiMuc")
            .map((v, k) => {
                return {
                  idVirtual: uuid.v4(),
                  capChiMuc: k,
                  childData: v,
                  noiDung  : v && v[0] ? v[0].tenKho : null,
                  noiDungCha : v && v[0] ? v[0].noiDungCha : null
                }
              }
            ).value();
          return {
            idVirtual: uuid.v4(),
            chiMuc: key,
            childData: rs,
            noiDung :  rs && rs[0] ? rs[0].noiDungCha : null
          };
        }).value();
      console.log(this.dataTable)
    }
    // this.expandAll()
  }

  changeSoQdKhDtxd(event) {

  }

  async themMoiCtiet() {
    let msgRequired = this.required(this.rowItemParent);
    if (msgRequired) {
      this.notification.error(MESSAGE.ERROR, msgRequired);
      this.spinner.hide();
      return;
    }
    // this.dataTable = [...this.dataTable, this.rowItemParent];
    this.rowItemParent = new TongMucDauTu();
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
    if (this.dataTable && this.dataTable.length > 0) {
      let lv1 = this.dataTable.filter(item => item.capChiMuc == 1);
      let lv2 = this.dataTable.filter(item => item.capChiMuc == 2);
      let lv3 = this.dataTable.filter(item => item.capChiMuc == 3);
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
      this.dataTable = lv1;
      lv1.forEach(item => {
        this.mapOfExpandedData[item.chiMuc] = this.convertTreeToList(item);
      });
    }
  }
  collapse(array: TongMucDauTu[], data: TongMucDauTu, $event: boolean): void {
    if (!$event) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.chiMuc === d.chiMuc)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }
  visitNode(node: TongMucDauTu, hashMap: { [key: string]: boolean }, array: TongMucDauTu[]): void {
    if (!hashMap[node.chiMuc]) {
      hashMap[node.chiMuc] = true;
      array.push(node);
    }
  }

  convertTreeToList(root: TongMucDauTu): TongMucDauTu[] {
    const stack: TongMucDauTu[] = [];
    const array: TongMucDauTu[] = [];
    const hashMap = {};
    stack.push({...root, capChiMuc: 1, expand: false});
    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({...node.children[i], capChiMuc: node.capChiMuc! + 1, expand: false, parent: node});
        }
      }
    }
    return array;
  }

  expandAll() {
    this.dataTable.forEach(s => {
      this.expandSet.add(s.idVirtual);
    })
  }
}


export class TongMucDauTu {
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
