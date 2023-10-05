import { filter } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { cloneDeep } from 'lodash';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DonviService } from 'src/app/services/donvi.service';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { Globals } from 'src/app/shared/globals';
import { MESSAGE } from './../../../constants/message';
import { DanhMucService } from '../../../services/danhmuc.service';

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
    await this.loadDiemKho(this.selectedDonVi);
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

  async loadDiemKho(donVi) {
    let body = {
      maDviCha: donVi.maDvi,
      trangThai: '01',
    }
    const res = await this.donViService.getTreeAll(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.length > 0) {
        res.data.forEach(element => {
          if (element && element.capDvi == '3' && element.children) {
            this.listDiemKho = [
              ...this.listDiemKho,
              ...element.children
            ]
          }
        });
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async changeDiemKho() {
    let diemKho = this.listDiemKho.filter(x => x.key == this.searchData.maDiemKho);
    this.searchData.maNhaKho = '';
    this.searchData.maNganKho = '';
    this.searchData.maNganLo = '';
    if (diemKho && diemKho.length > 0) {
      this.listNhaKho = diemKho[0].children;
    }
  }

  async changeNhaKho() {
    let nhaKho = this.listNhaKho.filter(x => x.key == this.searchData.maNhaKho);
    this.searchData.maNganKho = '';
    this.searchData.maNganLo = '';
    if (nhaKho && nhaKho.length > 0) {
      this.listNganKho = nhaKho[0].children;
    }
  }

  async changeNganKho() {
    let nganKho = this.listNganKho.filter(x => x.key == this.searchData.maNganKho);
    this.searchData.maNganLo = '';
    if (nganKho && nganKho.length > 0) {
      this.listNganLo = nganKho[0].children;
    }
  }

  async loadTreeKho() {
    this.dataTreeKho = [];
    let body = {
      maDviCha: this.maDvi,
      trangThai: '01',
    }
    const res = await this.donViService.getTreeAll(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        console.log(res.data);
        this.dataTreeKho = res.data;
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
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({
            ...node.children[i],
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
      if (data.children) {
        data.children.forEach((d) => {
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
      let getDataChiCuc = this.dataTreeKho.filter(x => x.key == this.searchData.maDvi);
      if (getDataChiCuc && getDataChiCuc.length > 0) {
        dataTree = getDataChiCuc;
        if (this.searchData.maDiemKho && this.searchData.maDiemKho != '') {
          let getDataDiemKho = dataTree[0].children.filter(x => x.key == this.searchData.maDiemKho);
          if (getDataDiemKho && getDataDiemKho.length > 0) {
            dataTree[0].children = getDataDiemKho;
            if (this.searchData.maNhaKho && this.searchData.maNhaKho != '') {
              if (dataTree[0].children[0].children && dataTree[0].children[0].children.length > 0) {
                let getDataNhaKho = dataTree[0].children[0].children.filter(x => x.key == this.searchData.maNhaKho);
                if (getDataNhaKho && getDataNhaKho.length > 0) {
                  dataTree[0].children[0].children = getDataNhaKho;
                  if (this.searchData.maNganKho && this.searchData.maNganKho != '') {
                    if (dataTree[0].children[0].children[0].children && dataTree[0].children[0].children[0].children.length > 0) {
                      let getDataNganKho = dataTree[0].children[0].children[0].children.filter(x => x.key == this.searchData.maNganKho);
                      if (getDataNganKho && getDataNganKho.length > 0) {
                        dataTree[0].children[0].children[0].children = getDataNganKho;
                        if (this.searchData.maNganLo && this.searchData.maNganLo != '') {
                          if (dataTree[0].children[0].children[0].children[0].children && dataTree[0].children[0].children[0].children[0].children.length > 0) {
                            let getDataNganLo = dataTree[0].children[0].children[0].children[0].children.filter(x => x.key == this.searchData.maNganLo);
                            if (getDataNganLo && getDataNganLo.length > 0) {
                              dataTree[0].children[0].children[0].children[0].children = getDataNganLo;
                            }
                          }
                        }
                      }
                    }
                  }
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
    if (data && data.children && data.children.length > 0) {
      let itemUpdate = {
        maDvi: '',
        maDiemKho: '',
        maNhaKho: '',
        maNganKho: '',
        maLoKho: '',
        soLuongGiam: 0,
        soLuongTang: 0
      };
      itemUpdate.maDvi = data.key;
      let hasItem = false;
      data.children.forEach(elementDiemKho => {
        itemUpdate.maDiemKho = elementDiemKho.key;
        if (item && type == 'set' && item.key && elementDiemKho.key == item.key) {
          elementDiemKho.slTang = item.slTang ?? 0;
          elementDiemKho.slGiam = item.slGiam ?? 0;
          hasItem = true;
        }
        else if (elementDiemKho && elementDiemKho.children && elementDiemKho.children.length > 0) {
          elementDiemKho.children.forEach(elementNhaKho => {
            itemUpdate.maNhaKho = elementNhaKho.key;
            if (item && type == 'set' && item.key && elementNhaKho.key == item.key) {
              elementNhaKho.slTang = item.slTang ?? 0;
              elementNhaKho.slGiam = item.slGiam ?? 0;
              hasItem = true;
            }
            else if (elementNhaKho && elementNhaKho.children && elementNhaKho.children.length > 0) {
              elementNhaKho.children.forEach(elementNganKho => {
                itemUpdate.maNganKho = elementNganKho.key;
                if (item && type == 'set' && item.key && elementNganKho.key == item.key) {
                  elementNganKho.slTang = item.slTang ?? 0;
                  elementNganKho.slGiam = item.slGiam ?? 0;
                  hasItem = true;
                }
                else if (elementNganKho && elementNganKho.children && elementNganKho.children.length > 0) {
                  elementNganKho.children.forEach(elementNganLo => {
                    itemUpdate.maLoKho = elementNganLo.key;
                    if (item && type == 'set' && item.key && elementNganLo.key == item.key) {
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
          let getDvi = this.dataTreeKho.filter(x => x.key == element);
          if (getDvi && getDvi.length > 0) {
            let itemDvi = getDvi[0];
            itemDvi.sumTang = 0;
            itemDvi.sumGiam = 0;
            if (itemDvi && itemDvi.children && itemDvi.children.length > 0) {
              itemDvi.dataUpdate = [];
              let listDataCheck = data.filter(x => x.maDvi == element);
              listDataCheck.forEach(elementCheck => {
                if (elementCheck.maDiemKho && elementCheck.maDiemKho != '') {
                  let indexDiemKho = itemDvi.children.findIndex(x => x.key == elementCheck.maDiemKho);
                  if (indexDiemKho != -1) {
                    if (elementCheck.maNhaKho && elementCheck.maNhaKho != '' && itemDvi.children[indexDiemKho].children && itemDvi.children[indexDiemKho].children.length > 0) {
                      let indexNhaKho = itemDvi.children[indexDiemKho].children.findIndex(x => x.key == elementCheck.maNhaKho);
                      if (indexNhaKho != -1) {
                        if (elementCheck.maNganKho && elementCheck.maNganKho != '' && itemDvi.children[indexDiemKho].children[indexNhaKho].children && itemDvi.children[indexDiemKho].children[indexNhaKho].children.length > 0) {
                          let indexNganKho = itemDvi.children[indexDiemKho].children[indexNhaKho].children.findIndex(x => x.key == elementCheck.maNganKho);
                          if (indexNganKho != -1) {
                            if (elementCheck.maLoKho && elementCheck.maLoKho != '' && itemDvi.children[indexDiemKho].children[indexNhaKho].children[indexNganKho].children && itemDvi.children[indexDiemKho].children[indexNhaKho].children[indexNganKho].children.length > 0) {
                              let indexNganLo = itemDvi.children[indexDiemKho].children[indexNhaKho].children[indexNganKho].children.findIndex(x => x.key == elementCheck.maLoKho);
                              if (indexNganLo != -1) {
                                itemDvi.children[indexDiemKho].children[indexNhaKho].children[indexNganKho].children[indexNganLo].slTang = elementCheck.soLuongTang;
                                itemDvi.children[indexDiemKho].children[indexNhaKho].children[indexNganKho].children[indexNganLo].slGiam = elementCheck.soLuongGiam;
                                itemDvi.sumTang = itemDvi.sumTang + elementCheck.soLuongTang;
                                itemDvi.sumGiam = itemDvi.sumGiam + elementCheck.soLuongGiam;
                              }
                            }
                            else {
                              itemDvi.children[indexDiemKho].children[indexNhaKho].children[indexNganKho].slTang = elementCheck.soLuongTang;
                              itemDvi.children[indexDiemKho].children[indexNhaKho].children[indexNganKho].slGiam = elementCheck.soLuongGiam;
                              itemDvi.sumTang = itemDvi.sumTang + elementCheck.soLuongTang;
                              itemDvi.sumGiam = itemDvi.sumGiam + elementCheck.soLuongGiam;
                            }
                          }
                        }
                        else {
                          itemDvi.children[indexDiemKho].children[indexNhaKho].slTang = elementCheck.soLuongTang;
                          itemDvi.children[indexDiemKho].children[indexNhaKho].slGiam = elementCheck.soLuongGiam;
                          itemDvi.sumTang = itemDvi.sumTang + elementCheck.soLuongTang;
                          itemDvi.sumGiam = itemDvi.sumGiam + elementCheck.soLuongGiam;
                        }
                      }
                    }
                    else {
                      itemDvi.children[indexDiemKho].slTang = elementCheck.soLuongTang;
                      itemDvi.children[indexDiemKho].slGiam = elementCheck.soLuongGiam;
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
