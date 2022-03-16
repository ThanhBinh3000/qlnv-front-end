import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'dialog-thong-tin-phu-luc-quyet-dinh-phe-duyet',
  templateUrl: './dialog-thong-tin-phu-luc-quyet-dinh-phe-duyet.component.html',
  styleUrls: ['./dialog-thong-tin-phu-luc-quyet-dinh-phe-duyet.component.scss'],
})
export class DialogThongTinPhuLucQuyetDinhPheDuyetComponent implements OnInit {
  ghiChu: string = null;
  tableExist: boolean = false;
  data: any = {};

  constructor(
    private _modalRef: NzModalRef,
    private helperService: HelperService,
    private cdr: ChangeDetectorRef,
  ) { }

  async ngOnInit() {
  }

  ngAfterViewChecked(): void {
    const table = document.getElementsByTagName('table');
    this.tableExist = table && table.length > 0 ? true : false;
    this.cdr.detectChanges();
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
