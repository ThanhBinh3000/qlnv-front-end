import { ThongTinLuongThucComponent } from './../../xuat/dau-gia/thong-tin-luong-thuc/thong-tin-luong-thuc.component';
import { ThongTinChiTieuKeHoachNam } from './../../../models/ThongTinChiTieuKHNam';
import { ChiTieuKeHoachNamCapTongCucService } from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TAB_SELECTED } from './thong-tin-chi-tieu-ke-hoach-nam.constant';
import { MESSAGE } from 'src/app/constants/message';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc',
  templateUrl: './thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc.component.html',
  styleUrls: ['./thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThongTinChiTieuKeHoachNamComponent implements OnInit {
  listThoc: any[] = [];
  listMuoi: any[] = [];
  listVatTu = [];
  modals = {
    luaChonIn: false,
    thongTinLuongThuc: false,
    thongTinVatTuTrongNam: false,
  };
  xuongCaoTocCacLoais = new Array(4);
  id: number;
  tabSelected: string = TAB_SELECTED.luongThuc;
  detail = {
    soQD: null,
    ngayKy: null,
    ngayHieuLuc: null,
    namKeHoach: null,
    trichYeu: null,
  };
  tab = TAB_SELECTED;
  yearNow = 2022;
  thongTinChiTieuKeHoachNam: ThongTinChiTieuKeHoachNam =
    new ThongTinChiTieuKeHoachNam();
  tableExist: boolean = false;

  constructor(
    private router: Router,
    private routerActive: ActivatedRoute,
    private chiTieuKeHoachNamService: ChiTieuKeHoachNamCapTongCucService,
    private cdr: ChangeDetectorRef,
    private modal: NzModalService,
  ) {}

  ngOnInit(): void {
    this.id = +this.routerActive.snapshot.paramMap.get('id');
    this.loadThongTinChiTieuKeHoachNam(this.id);
  }

  themMoi() {
    if (this.tabSelected == TAB_SELECTED.luongThuc) {
      // this.handleOpenModal('thongTinLuongThuc');
      this.modal.create({
        nzTitle: 'Thông tin lương thực',
        nzContent: ThongTinLuongThucComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          // totalRecord: this.totalRecord,
          // date: event,
        },
      });
    } else if (this.tabSelected == TAB_SELECTED.vatTu) {
      this.handleOpenModal('thongTinVatTuTrongNam');
    }
  }

  handleOpenModal(modalName: string) {
    this.modals[modalName] = true;
  }

  redirectChiTieuKeHoachNam() {
    this.router.navigate(['/kehoach/chi-tieu-ke-hoach-nam-cap-tong-cuc']);
  }

  loadThongTinChiTieuKeHoachNam(id: number) {
    this.chiTieuKeHoachNamService
      .loadThongTinChiTieuKeHoachNam(id)
      .subscribe((res) => {
        console.log(res);
        if (res.msg == MESSAGE.SUCCESS) {
          this.thongTinChiTieuKeHoachNam = res.data;
          this.listThoc = res.data.khLuongThuc;
          this.listMuoi = res.data.khMuoiDuTru;
          this.listVatTu = res.data.khVatTu;
        }
      });
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
            parseFloat(
              table.rows[i].cells[indexCell].innerHTML.replace(
                stringReplace,
                '',
              ),
            );
        }
      }
    }
    return sumVal;
  }
}
