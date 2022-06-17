import { filter } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { cloneDeep } from 'lodash';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DonviService } from 'src/app/services/donvi.service';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { Globals } from 'src/app/shared/globals';
import { MESSAGE } from './../../../constants/message';
import { DanhMucService } from './../../../services/danhmuc.service';

@Component({
  selector: 'dialog-dia-diem-kho',
  templateUrl: './dialog-dia-diem-kho.component.html',
  styleUrls: ['./dialog-dia-diem-kho.component.scss'],
})
export class DialogDiaDiemKhoComponent implements OnInit {
  data?: any;
  maDvi: string;
  radioValue: string = 'trung';
  listOfMapData: any[];
  listOfMapDataClone: any[];
  mapOfExpandedData: { [key: string]: any[] } = {};
  options = {
    luongThuc: false,
    muoi: false,
    vatTu: false,
  };

  optionsDonVi: any[] = [];
  inputDonVi: string = '';
  optionsDonViShow: any[] = [];
  selectedDonVi: any = {};

  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganKho: any[] = [];
  listNganLo: any[] = [];

  searchData: any = {
    maDvi: '',
    maDiemKho: '',
    maNhaKho: '',
    maNganKho: '',
    maNganLo: '',
  }

  deXuatCuc: any[] = [];

  dataTreeKho: any;
  sumTang: number = 0;
  sumGiam: number = 0;

  constructor(
    private _modalRef: NzModalRef,
    private danhMucService: DanhMucService,
    private donViService: DonviService,
    private notification: NzNotificationService,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    public globals: Globals,
  ) { }

  async ngOnInit() {
    await this.loadTreeKho();
    await this.loadDonVi();
  }

  async loadDonVi() {
    const res = await this.donViService.layDonViCon();
    this.optionsDonVi = [];
    if (res.msg == MESSAGE.SUCCESS) {
      for (let i = 0; i < res.data.length; i++) {
        const item = {
          ...res.data[i],
          labelDonVi: res.data[i].maDvi + ' - ' + res.data[i].tenDvi,
        };
        this.optionsDonVi.push(item);
      }
      this.optionsDonViShow = cloneDeep(this.optionsDonVi);
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  onInputDonVi(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.optionsDonViShow = cloneDeep(this.optionsDonVi);
    } else {
      this.optionsDonViShow = this.optionsDonVi.filter(
        (x) => x.labelDonVi.toLowerCase().indexOf(value.toLowerCase()) != -1,
      );
    }
  }

  async selectDonVi(donVi) {
    this.inputDonVi = donVi.tenDvi;
    this.selectedDonVi = donVi;
    this.searchData.maDvi = this.selectedDonVi.maDvi;
    await this.loadDiemKho(this.selectedDonVi.id);
  }

  clearFilter() {
    this.searchData = {
      maDvi: '',
      maDiemKho: '',
      maNhaKho: '',
      maNganKho: '',
      maNganLo: '',
    }
    this.inputDonVi = '';
  }

  handleOk() {
    this._modalRef.close();
  }

  handleCancel() {
    this._modalRef.close();
  }

  async loadDiemKho(tongKhoId) {
    // let body = {
    //   "maDiemKho": null,
    //   "paggingReq": {
    //     "limit": 1000,
    //     "page": 1
    //   },
    //   "str": null,
    //   "tenDiemKho": null,
    //   "tongKhoId": tongKhoId,
    //   "trangThai": null
    // };
    // let res = await this.tinhTrangKhoHienThoiService.diemKhoGetList(body);
    // if (res.msg == MESSAGE.SUCCESS) {
    //   if (res.data) {
    //     this.listDiemKho = res.data;
    //   }
    // } else {
    //   this.notification.error(MESSAGE.ERROR, res.msg);
    // }
    if (this.searchData.maDvi && this.searchData.maDvi != '') {
      let getDataChiCuc = this.dataTreeKho.filter(x => x.maTongKho == this.searchData.maDvi);
      if (getDataChiCuc && getDataChiCuc.length > 0) {
        this.listDiemKho = getDataChiCuc[0].child;
      }
    }
  }

  async changeDiemKho() {
    let diemKho = this.listDiemKho.filter(x => x.maDiemkho == this.searchData.maDiemKho);
    this.searchData.maNhaKho = null;
    if (diemKho && diemKho.length > 0) {
      await this.loadNhaKho(diemKho[0].id);
    }
  }

  async loadNhaKho(diemKhoId: any) {
    let body = {
      "diemKhoId": diemKhoId,
      "maNhaKho": null,
      "paggingReq": {
        "limit": 1000,
        "page": 1
      },
      "str": null,
      "tenNhaKho": null,
      "trangThai": null
    };
    let res = await this.tinhTrangKhoHienThoiService.nhaKhoGetList(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content) {
        this.listNhaKho = res.data.content;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async changeNhaKho() {
    let nhaKho = this.listNhaKho.filter(x => x.maNhakho == this.searchData.maNhaKho);
    this.searchData.maNganKho = null;
    if (nhaKho && nhaKho.length > 0) {
      await this.loadNganKho(nhaKho[0].id);
    }
  }

  async loadNganKho(nhaKhoId: any) {
    let body = {
      "maNganKho": null,
      "nhaKhoId": nhaKhoId,
      "paggingReq": {
        "limit": 1000,
        "page": 1
      },
      "str": null,
      "tenNganKho": null,
      "trangThai": null
    };
    let res = await this.tinhTrangKhoHienThoiService.nganKhoGetList(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content) {
        this.listNganKho = res.data.content;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async changeNganKho() {
    let nganKho = this.listNganKho.filter(x => x.maNgankho == this.searchData.maNganKho);
    this.searchData.maNganKho = null;
    if (nganKho && nganKho.length > 0) {
      await this.loadNganLo(nganKho[0].id);
    }
  }

  async loadNganLo(nganKhoId: any) {
    let body = {
      "maNganLo": null,
      "nganKhoId": nganKhoId,
      "paggingReq": {
        "limit": 1000,
        "page": 1
      },
      "str": null,
      "tenNganLo": null,
      "trangThai": null
    };
    let res = await this.tinhTrangKhoHienThoiService.nganLoGetList(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content) {
        this.listNganLo = res.data.content;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadTreeKho() {
    let res = await this.tinhTrangKhoHienThoiService.getTreeKho();
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        if (this.maDvi) {
          let getDataCuc = res.data.child.filter(x => x.maDtqgkv == this.maDvi);
          if (getDataCuc && getDataCuc.length > 0) {
            this.dataTreeKho = getDataCuc[0].child;
          }
        }
        else {
          this.dataTreeKho = res.data;
        }
        // this.listOfMapData = [];
        // this.listOfMapData.push(res.data);
        // this.listOfMapDataClone = [...this.listOfMapData];
        // this.listOfMapData.forEach((item) => {
        //   this.mapOfExpandedData[item.id] = this.convertTreeToList(item);
        // });
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  convertTreeToList(root: any): any[] {
    const stack: any[] = [];
    const array: any[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: false });
    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.child) {
        for (let i = node.child.length - 1; i >= 0; i--) {
          stack.push({
            ...node.child[i],
            level: node.level! + 1,
            expand: false,
            parent: node,
          });
        }
      }
    }
    return array;
  }

  visitNode(
    node: any,
    hashMap: { [id: string]: boolean },
    array: any[],
  ): void {
    if (!hashMap[node.id]) {
      hashMap[node.id] = true;
      array.push(node);
    }
  }

  collapse(array: any[], data: any, $event: boolean): void {
    if (!$event) {
      if (data.child) {
        data.child.forEach((d) => {
          const target = array.find((a) => a.id === d.id)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  search() {
    let dataTree = [];
    if (this.searchData.maDvi && this.searchData.maDvi != '') {
      let getDataChiCuc = this.dataTreeKho.filter(x => x.maTongKho == this.searchData.maDvi);
      if (getDataChiCuc && getDataChiCuc.length > 0) {
        dataTree = getDataChiCuc;
        if (this.searchData.maDiemKho && this.searchData.maDiemKho != '') {
          let getDataDiemKho = dataTree[0].child.filter(x => x.maDiemkho == this.searchData.maDiemKho);
          if (getDataDiemKho && getDataDiemKho.length > 0) {
            dataTree[0].child = getDataDiemKho;
            if (this.searchData.maNhaKho && this.searchData.maNhaKho != '') {
              if (dataTree[0].child[0].child && dataTree[0].child[0].child.length > 0) {
                let getDataNhaKho = dataTree[0].child[0].child.filter(x => x.maNhakho == this.searchData.maNhaKho);
                if (getDataNhaKho && getDataNhaKho.length > 0) {
                  dataTree[0].child[0].child = getDataNhaKho;
                }
              }
            }
          }
        }
      }
    }
    else {
      dataTree = this.dataTreeKho;
    }
    this.listOfMapData = dataTree;
    this.listOfMapDataClone = [...this.listOfMapData];
    this.listOfMapData.forEach((item) => {
      this.mapOfExpandedData[item.id] = this.convertTreeToList(item);
    });
  }

  selectHangHoa(item: any) {
    this._modalRef.close(item);
  }

  editDeXuat(data: any) {

  }

  deleteDeXuat(data: any) {

  }

  changeValue(type, item) {
    if (type == 'tang') {
      if (item.oldDataTang && item.oldDataTang >= 0) {
        this.sumTang = this.sumTang - item.oldDataTang + item.slTang;
      }
      else {
        this.sumTang += item.slTang;
      }
      item.oldDataTang = item.slTang;
    }
    else if (type == 'giam') {
      if (item.oldDataGiam && item.oldDataGiam >= 0) {
        this.sumGiam = this.sumGiam - item.oldDataGiam + item.slGiam;
      }
      else {
        this.sumGiam += item.slGiam;
      }
      item.oldDataGiam = item.slGiam;
    }
  }

  saveDataTree(data, item) {

  }
}
