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
    if (this.data && this.data.length > 0) {
      this.loadDataTree(this.data);
    }
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
    this.searchData.maDiemKho = '';
    this.searchData.maNhaKho = '';
    this.searchData.maNganKho = '';
    this.searchData.maNganLo = '';
    await this.loadDiemKho(this.selectedDonVi.id);
  }

  async clearFilter() {
    this.searchData = {
      maDvi: '',
      maDiemKho: '',
      maNhaKho: '',
      maNganKho: '',
      maNganLo: '',
    }
    this.inputDonVi = '';
    await this.loadTreeKho();
  }

  handleOk() {
    this._modalRef.close(this.deXuatCuc);
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
    this.searchData.maNhaKho = '';
    this.searchData.maNganKho = '';
    this.searchData.maNganLo = '';
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
    this.searchData.maNganKho = '';
    this.searchData.maNganLo = '';
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
    this.searchData.maNganLo = '';
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
    this.dataTreeKho = [];
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

  async search() {
    await this.loadTreeKho();
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
    this.sumGiam = 0;
    this.sumTang = 0;
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
    this.listOfMapData = [];
    this.listOfMapData = [
      ...this.listOfMapData,
      data
    ]
    this.listOfMapDataClone = [...this.listOfMapData];
    this.listOfMapData.forEach((item) => {
      this.mapOfExpandedData[item.id] = this.convertTreeToList(item);
    });
    this.sumGiam = data.sumGiam;
    this.sumTang = data.sumTang;
  }

  deleteDeXuat(data: any) {
    this.deXuatCuc = this.deXuatCuc.filter(x => x.id != data.id);
  }

  changeValue(type, item, data) {
    if (type == 'tang') {
      this.sumTang = 0;
      let listInput = document.getElementsByClassName('input-tang');
      if (listInput && listInput.length > 0) {
        for (let i = 0; i < listInput.length; i++) {
          this.sumTang = this.sumTang + (isNaN(parseInt(listInput[i].getElementsByTagName('input')[0].value)) ? 0 : parseInt(listInput[i].getElementsByTagName('input')[0].value));
        }
      }
    }
    else if (type == 'giam') {
      this.sumGiam = 0;
      let listInput = document.getElementsByClassName('input-giam');
      if (listInput && listInput.length > 0) {
        for (let i = 0; i < listInput.length; i++) {
          this.sumGiam = this.sumGiam + (isNaN(parseInt(listInput[i].getElementsByTagName('input')[0].value)) ? 0 : parseInt(listInput[i].getElementsByTagName('input')[0].value));
        }
      }
    }
    this.getSetDataTree('set', data, item);
  }

  saveDataTree(data) {
    let res = this.getSetDataTree('get', data);
    if (this.deXuatCuc && this.deXuatCuc.length > 0) {
      let index = this.deXuatCuc.findIndex(x => x.id == data.id);
      if (index != -1) {
        this.deXuatCuc.splice(index, 1);
      }
    }
    else {
      this.deXuatCuc = [];
    }
    this.deXuatCuc = [...this.deXuatCuc, res];
  }

  getSetDataTree(type: string, data: any, item?: any) {
    let sumTang = 0;
    let sumGiam = 0;
    let dataUpdate = [];
    if (data && data.child && data.child.length > 0) {
      let itemUpdate = {
        maDvi: '',
        maDiemKho: '',
        maNhaKho: '',
        maNganKho: '',
        maLoKho: '',
        soLuongGiam: 0,
        soLuongTang: 0
      };
      itemUpdate.maDvi = data.maTongKho;
      let hasItem = false;
      data.child.forEach(elementDiemKho => {
        itemUpdate.maDiemKho = elementDiemKho.maDiemkho;
        if (item && type == 'set' && item.maDiemkho && elementDiemKho.maDiemkho == item.maDiemkho) {
          elementDiemKho.slTang = item.slTang ?? 0;
          elementDiemKho.slGiam = item.slGiam ?? 0;
          hasItem = true;
        }
        else if (elementDiemKho && elementDiemKho.child && elementDiemKho.child.length > 0) {
          elementDiemKho.child.forEach(elementNhaKho => {
            itemUpdate.maNhaKho = elementNhaKho.maNhakho;
            if (item.maNhakho && elementNhaKho.maNhakho == item.maNhakho) {
              elementNhaKho.slTang = item.slTang ?? 0;
              elementNhaKho.slGiam = item.slGiam ?? 0;
              hasItem = true;
            }
            else if (elementNhaKho && elementNhaKho.child && elementNhaKho.child.length > 0) {
              elementNhaKho.child.forEach(elementNganKho => {
                itemUpdate.maNganKho = elementNganKho.maNgankho;
                if (item.maNgankho && elementNganKho.maNgankho == item.maNgankho) {
                  elementNganKho.slTang = item.slTang ?? 0;
                  elementNganKho.slGiam = item.slGiam ?? 0;
                  hasItem = true;
                }
                else if (elementNganKho && elementNganKho.child && elementNganKho.child.length > 0) {
                  elementNganKho.child.forEach(elementNganLo => {
                    itemUpdate.maLoKho = elementNganLo.maNganlo;
                    if (item.maNganlo && elementNganLo.maNganlo == item.maNganlo) {
                      elementNganLo.slTang = item.slTang ?? 0;
                      elementNganLo.slGiam = item.slGiam ?? 0;
                      hasItem = true;
                    }
                    else if ((elementNganLo.slTang || elementNganLo.slGiam) && type == 'get') {
                      sumTang = sumTang + (elementNganLo.slTang ?? 0);
                      sumGiam = sumGiam + (elementNganLo.slGiam ?? 0);
                      itemUpdate.soLuongTang = elementNganLo.slTang;
                      itemUpdate.soLuongGiam = elementNganLo.slGiam;
                      let add = cloneDeep(itemUpdate);
                      dataUpdate = [...dataUpdate, add];
                    }
                    if (hasItem && type == 'set') {
                      return;
                    }
                  });
                }
                else if ((elementNganKho.slTang || elementNganKho.slGiam) && type == 'get') {
                  sumTang = sumTang + (elementNganKho.slTang ?? 0);
                  sumGiam = sumGiam + (elementNganKho.slGiam ?? 0);
                  itemUpdate.soLuongTang = elementNganKho.slTang;
                  itemUpdate.soLuongGiam = elementNganKho.slGiam;
                  let add = cloneDeep(itemUpdate);
                  dataUpdate = [...dataUpdate, add];
                }
                if (hasItem && type == 'set') {
                  return;
                }
              });
            }
            else if ((elementNhaKho.slTang || elementNhaKho.slGiam) && type == 'get') {
              sumTang = sumTang + (elementNhaKho.slTang ?? 0);
              sumGiam = sumGiam + (elementNhaKho.slGiam ?? 0);
              itemUpdate.soLuongTang = elementNhaKho.slTang;
              itemUpdate.soLuongGiam = elementNhaKho.slGiam;
              let add = cloneDeep(itemUpdate);
              dataUpdate = [...dataUpdate, add];
            }
            if (hasItem && type == 'set') {
              return;
            }
          });
        }
        else if ((elementDiemKho.slTang || elementDiemKho.slGiam) && type == 'get') {
          sumTang = sumTang + (elementDiemKho.slTang ?? 0);
          sumGiam = sumGiam + (elementDiemKho.slGiam ?? 0);
          itemUpdate.soLuongTang = elementDiemKho.slTang;
          itemUpdate.soLuongGiam = elementDiemKho.slGiam;
          let add = cloneDeep(itemUpdate);
          dataUpdate = [...dataUpdate, add];
        }
        if (hasItem && type == 'set') {
          return;
        }
      });
    }
    if (type == 'get') {
      data.sumTang = sumTang;
      data.sumGiam = sumGiam;
      data.dataUpdate = dataUpdate;
      return data;
    }
  }

  loadDataTree(data) {
    this.deXuatCuc = [];
    if (data && data.length > 0) {
      const uniqueMaDvi = [...new Set(data.map(item => item.maDvi))];
      if (uniqueMaDvi && uniqueMaDvi.length > 0) {
        uniqueMaDvi.forEach(element => {
          let getDvi = this.dataTreeKho.filter(x => x.maTongKho == element);
          if (getDvi && getDvi.length > 0) {
            let itemDvi = getDvi[0];
            itemDvi.sumTang = 0;
            itemDvi.sumGiam = 0;
            if (itemDvi && itemDvi.child && itemDvi.child.length > 0) {
              itemDvi.dataUpdate = [];
              let listDataCheck = data.filter(x => x.maDvi == element);
              listDataCheck.forEach(elementCheck => {
                if (elementCheck.maDiemKho && elementCheck.maDiemKho != '') {
                  let indexDiemKho = itemDvi.child.findIndex(x => x.maDiemkho == elementCheck.maDiemKho);
                  if (indexDiemKho != -1) {
                    if (elementCheck.maNhaKho && elementCheck.maNhaKho != '' && itemDvi.child[indexDiemKho].child && itemDvi.child[indexDiemKho].child.length > 0) {

                    }
                    else {
                      itemDvi.child[indexDiemKho].slTang = elementCheck.soLuongTang;
                      itemDvi.child[indexDiemKho].slGiam = elementCheck.soLuongGiam;
                      itemDvi.sumTang = itemDvi.sumTang + elementCheck.soLuongTang;
                      itemDvi.sumGiam = itemDvi.sumGiam + elementCheck.soLuongGiam;
                    }
                  }
                }
                itemDvi.dataUpdate.push(elementCheck);
              });
              this.deXuatCuc.push(itemDvi);
            }
          }
        });
      }
    }
  }
}
