import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { MESSAGE } from 'src/app/constants/message';
import { DanhSachGoiThau } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
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
  listChiCuc: any[] = [];
  listDiemKho: any[] = [];

  listOfData: DanhSachGoiThau[] = [];
  mapOfExpandedData2: { [maDvi: string]: DanhSachGoiThau[] } = {};

  constructor(
    private _modalRef: NzModalRef,
    private helperService: HelperService,
    private cdr: ChangeDetectorRef,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    private donviService: DonviService
  ) { }

  editCache: { [key: string]: { edit: boolean; data: DanhSachGoiThau } } = {};

  addGoiThau: any = {};

  async ngOnInit() {
    console.log(this.data);
    this.data.children.forEach((value, index) => {
      this.editCache[index] = {
        edit: false,
        data: { ...value }
      };
    })
    this.loadDonVi();
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
    // this.dsGoiThauClone?.forEach((goiThau) => {
    //   goiThau.thanhTien = (goiThau.donGia * goiThau.soLuong * 1000).toString();
    //   this.tongGiaTriCacGoiThau += +goiThau.thanhTien;
    // });
    // if (this.tongGiaTriCacGoiThau > 10000000000) {
    //   this.thongTinChungDXKHLCNT.blanhDthau = '3%';
    // } else {
    //   this.thongTinChungDXKHLCNT.blanhDthau = '1%';
    // }
  }

  deleteRow(i: number): void {
    this.data.children = this.data.children.filter((d, index) => index !== i);
    // this.listOfData = this.listOfData.filter(d => d.idVirtual !== idVirtual);
    // this.chiTietThongTinDXKHLCNT.children2 =
    //   this.chiTietThongTinDXKHLCNT.children2.filter(
    //     (d) => d.idVirtual !== idVirtual,
    //   );
    // Object.assign(this.dsGoiThauClone, this.chiTietThongTinDXKHLCNT.children2);
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
}