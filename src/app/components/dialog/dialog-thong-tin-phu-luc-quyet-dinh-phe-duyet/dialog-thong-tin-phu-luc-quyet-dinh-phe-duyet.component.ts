import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { MESSAGE } from 'src/app/constants/message';
import { DanhSachGoiThau } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import { DanhSachDauThauService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/danhSachDauThau.service';
import { DonviService } from 'src/app/services/donvi.service';
import { HelperService } from 'src/app/services/helper.service';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { convertTienTobangChu } from 'src/app/shared/commonFunction';

@Component({
  selector: 'dialog-thong-tin-phu-luc-quyet-dinh-phe-duyet',
  templateUrl: './dialog-thong-tin-phu-luc-quyet-dinh-phe-duyet.component.html',
  styleUrls: ['./dialog-thong-tin-phu-luc-quyet-dinh-phe-duyet.component.scss'],
})
export class DialogThongTinPhuLucQuyetDinhPheDuyetComponent implements OnInit {
  ghiChu: string = null;
  tableExist: boolean = false;
  data: any = {};
  dataEdit: any = {};
  isEdit: boolean;
  listChiCuc: any[] = [];
  listDiemKho: any[] = [];

  listOfData: DanhSachGoiThau[] = [];
  mapOfExpandedData2: { [maDvi: string]: DanhSachGoiThau[] } = {};

  constructor(
    private _modalRef: NzModalRef,
    private helperService: HelperService,
    private cdr: ChangeDetectorRef,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    private donviService: DonviService,
    private dauThauService: DanhSachDauThauService
  ) { }

  editCache: { [key: string]: { edit: boolean; data: DanhSachGoiThau } } = {};

  addGoiThau: any = {};

  async ngOnInit() {
    if (this.data) {
      let res = await this.dauThauService.getDetail(this.data.idDxHdr);
      this.listOfData = res.data.dsGtDtlList;
    }
  }

  collapse2(array: DanhSachGoiThau[], data: DanhSachGoiThau, $event: boolean): void {
    if (!$event) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.idVirtual === d.idVirtual)!;
          target.expand = false;
          this.collapse2(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  convertTreeToList2(root: DanhSachGoiThau): DanhSachGoiThau[] {
    const stack: DanhSachGoiThau[] = [];
    const array: DanhSachGoiThau[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: false });
    while (stack.length !== 0) {
      const node = stack.pop();
      this.visitNode2(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], level: node.level! + 1, expand: false, parent: node });
        }
      }
    }
    return array;
  }

  visitNode2(node: DanhSachGoiThau, hashMap: { [maDvi: string]: boolean }, array: DanhSachGoiThau[]): void {
    if (!hashMap[node.idVirtual]) {
      hashMap[node.idVirtual] = true;
      array.push(node);
    }
  }


  convertTienTobangChu(tien: number): string {
    return convertTienTobangChu(tien);
  }

  ngAfterViewChecked(): void {
    const table = document.getElementsByTagName('table');
    this.tableExist = table && table.length > 0 ? true : false;
    this.cdr.detectChanges();
  }

  startEdit(index: number): void {
    this.editCache[index].edit = true;
    console.log(this.editCache);
    this.changeChiCuc(this.editCache[index].data.maDvi, null);
  }

  saveEdit(index: number): void {
    console.log(index)
    Object.assign(
      this.data.children[index],
      this.editCache[index].data,
    );
    this.editCache[index].edit = false;
  }

  deleteRow(i: number): void {
    this.data.children = this.data.children.filter((d, index) => index !== i);
  }

  cancelEdit(index: number): void {
    this.editCache[index].edit = false;
  }

  async changeChiCuc(event, index?) {
    const res = await this.tinhTrangKhoHienThoiService.getChiCucByMaTongCuc(event)
    this.listDiemKho = [];
    if (res.msg == MESSAGE.SUCCESS) {
      for (let i = 0; i < res.data?.child.length; i++) {
        const item = {
          'value': res.data.child[i].maDiemkho,
          'text': res.data.child[i].tenDiemkho
        };
        this.listDiemKho.push(item);
      }
    }
  }

  changeDiemKho(index) {
    let chiCuc = this.listChiCuc.filter(item => item.value == this.editCache[index].data.maDvi);
    let diemKho = this.listDiemKho.filter(item => item.value == this.editCache[index].data.maDiemKho);
    if (chiCuc.length > 0 && diemKho.length > 0) {
      this.editCache[index].data.tenDvi = chiCuc[0].text;
      this.editCache[index].data.tenDiemKho = diemKho[0].text;
      this.editCache[index].data.diaDiemNhap = diemKho[0]?.text + " - " + chiCuc[0]?.text
    }
  }

  async loadDonVi() {
    let body = {
      capDvi: '3',
      trangThai: '01'
    }
    const res = await this.donviService.getAll(body);
    this.listChiCuc = [];
    if (res.msg == MESSAGE.SUCCESS) {
      for (let i = 0; i < res.data.length; i++) {
        const item = {
          'value': res.data[i].maDvi,
          'text': res.data[i].tenDvi
        };
        this.listChiCuc.push(item);
      }
    }
  }

  changeDiemKhoAdd() {

  }

  addNew() {

  }

  clearData() {
    this.addGoiThau = {};
  }

  reduceRowData(
    indexTable: number,
    indexCell: number,
    indexRow: number,
    stringReplace: string,
    idTable: string,
  ): number {
    let sumVal = 0;
    const listTable = document
      .getElementById(idTable)
      ?.getElementsByTagName('table');

    if (listTable && listTable.length >= indexTable) {
      const table = listTable[indexTable];
      for (let i = indexRow; i < table.rows.length - 1; i++) {
        if (
          table.rows[i]?.cells[indexCell]?.innerHTML &&
          table.rows[i]?.cells[indexCell]?.innerHTML != ''
        ) {
          sumVal =
            sumVal +
            parseFloat(this.helperService.replaceAll(table.rows[i].cells[indexCell].innerHTML, stringReplace, ''));
        }
      }
    }
    return sumVal;
  }

  onCancel() {
    this._modalRef.close();
  }
  editRow(idGoiThau) {
    // console.log(idGoiThau);
    const dataRow = this.listOfData.filter(item => item.id === idGoiThau);
    console.log(dataRow);
    this.dataEdit.tenGthau = dataRow[0].goiThau;
    this.dataEdit.tenDvi = dataRow[0].tenDvi;
    this.dataEdit.maDvi = dataRow[0].maDvi;
    this.dataEdit.soLuong = dataRow[0].soLuong;
    this.dataEdit.donGia = dataRow[0].donGia;
    this.dataEdit.tongTien = dataRow[0].thanhTien;
    this.dataEdit.children = dataRow[0].children;
    this.changeChiCuc(dataRow[0].maDvi);

  }



  // async changeChiCuc(event) {
  //   const res = await this.tinhTrangKhoHienThoiService.getChiCucByMaTongCuc(event)
  //   let data = this.listChiCuc.filter(item => item.maDvi === event);
  //   this.formData.get('tenDvi').setValue(data[0].tenDonVi);
  //   this.listDiemKho = [];
  //   if (res.msg == MESSAGE.SUCCESS) {
  //     for (let i = 0; i < res.data?.child.length; i++) {
  //       const item = {
  //         'value': res.data.child[i].maDiemkho,
  //         'text': res.data.child[i].tenDiemkho,
  //         'diaDiemNhap': res.data.child[i].diaChi,
  //       };
  //       this.listDiemKho.push(item);
  //       this.filterData();
  //     }
  //   }
  // }

  onApplyEdit() {

  }
}
