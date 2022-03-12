import {
  KeHoachVatTu,
  NhomVatTuThietBi,
  CacNamTruoc,
  VatTuThietBi,
} from './../../../models/KeHoachVatTu';
import { KeHoachMuoi } from 'src/app/models/KeHoachMuoi';
import { KeHoachLuongThuc } from 'src/app/models/KeHoachLuongThuc';
import { DialogThongTinLuongThucComponent } from './../../../components/dialog/dialog-thong-tin-luong-thuc/dialog-thong-tin-luong-thuc.component';
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
import { DialogThemThongTinMuoiComponent } from 'src/app/components/dialog/dialog-them-thong-tin-muoi/dialog-them-thong-tin-muoi.component';
import * as XLSX from 'xlsx';
import { DialogLuaChonInComponent } from 'src/app/components/dialog/dialog-lua-chon-in/dialog-lua-chon-in.component';
import { DialogThemThongTinVatTuTrongNamComponent } from 'src/app/components/dialog/dialog-them-thong-tin-vat-tu-trong-nam/dialog-them-thong-tin-vat-tu-trong-nam.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { HelperService } from 'src/app/services/helper.service';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';

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
  keHoachLuongThucDialog: KeHoachLuongThuc;
  keHoachMuoiDialog: KeHoachMuoi;
  keHoachVatTuDialog: KeHoachVatTu;
  fileDinhKem: string = null;

  constructor(
    private router: Router,
    private routerActive: ActivatedRoute,
    private chiTieuKeHoachNamService: ChiTieuKeHoachNamCapTongCucService,
    private cdr: ChangeDetectorRef,
    private modal: NzModalService,
    private spinner: NgxSpinnerService,
    private helperService: HelperService,
    private notification: NzNotificationService,
  ) { }

  ngOnInit(): void {
    this.id = +this.routerActive.snapshot.paramMap.get('id');
    this.loadThongTinChiTieuKeHoachNam(this.id);
  }

  themMoi(data?: any) {
    if (this.tabSelected == TAB_SELECTED.luongThuc) {
      const modalLuongThuc = this.modal.create({
        nzTitle: 'Thông tin lương thực',
        nzContent: DialogThongTinLuongThucComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          keHoachLuongThuc: data,
        },
      });
      modalLuongThuc.afterClose.subscribe((luongThuc) => {
        if (luongThuc) {
          this.keHoachLuongThucDialog = new KeHoachLuongThuc();
          this.keHoachLuongThucDialog.tenDonvi = luongThuc.value.tenDonvi;
          this.keHoachLuongThucDialog.maDonVi = luongThuc.value.maDonVi;
          this.keHoachLuongThucDialog.tkdnTongSoQuyThoc =
            +luongThuc.value.tkdnTongSoQuyThoc;
          this.keHoachLuongThucDialog.tkdnTongThoc =
            +luongThuc.value.tkdnThocSoLuong1 +
            +luongThuc.value.tkdnThocSoLuong2 +
            +luongThuc.value.tkdnThocSoLuong3;
          const tkdnThoc1 = {
            id: null,
            nam: 2019,
            soLuong: +luongThuc.value.tkdnThocSoLuong1,
            vatTuId: null,
          };
          const tkdnThoc2 = {
            id: null,
            nam: 2018,
            soLuong: +luongThuc.value.tkdnThocSoLuong2,
            vatTuId: null,
          };
          const tkdnThoc3 = {
            id: null,
            nam: 2017,
            soLuong: +luongThuc.value.tkdnThocSoLuong3,
            vatTuId: null,
          };
          this.keHoachLuongThucDialog.tkdnThoc = [
            tkdnThoc1,
            tkdnThoc2,
            tkdnThoc3,
          ];

          this.keHoachLuongThucDialog.tkdnTongGao =
            +luongThuc.value.tkdnGaoSoLuong1 + +luongThuc.value.tkdnGaoSoLuong2;

          const tkdnGao1 = {
            id: null,
            nam: 2019,
            soLuong: +luongThuc.value.tkdnGaoSoLuong1,
            vatTuId: null,
          };
          const tkdnGao2 = {
            id: null,
            nam: 2018,
            soLuong: +luongThuc.value.tkdnGaoSoLuong2,
            vatTuId: null,
          };
          this.keHoachLuongThucDialog.tkdnGao = [tkdnGao1, tkdnGao2];
          this.keHoachLuongThucDialog.ntnTongSoQuyThoc =
            +luongThuc.value.ntnTongSoQuyThoc;
          this.keHoachLuongThucDialog.ntnThoc = +luongThuc.value.ntnThoc;
          this.keHoachLuongThucDialog.ntnGao = +luongThuc.value.ntnGao;

          this.keHoachLuongThucDialog.xtnTongSoQuyThoc =
            +luongThuc.value.xtnTongSoQuyThoc;

          this.keHoachLuongThucDialog.xtnTongThoc =
            +luongThuc.value.xtnThocSoLuong1 +
            +luongThuc.value.xtnThocSoLuong2 +
            +luongThuc.value.xtnThocSoLuong3;

          const xtnThoc1 = {
            id: null,
            nam: 2019,
            soLuong: +luongThuc.value.xtnThocSoLuong1,
            vatTuId: null,
          };
          const xtnThoc2 = {
            id: null,
            nam: 2018,
            soLuong: +luongThuc.value.xtnThocSoLuong2,
            vatTuId: null,
          };
          const xtnThoc3 = {
            id: null,
            nam: 2017,
            soLuong: +luongThuc.value.xtnThocSoLuong3,
            vatTuId: null,
          };
          this.keHoachLuongThucDialog.xtnThoc = [xtnThoc1, xtnThoc2, xtnThoc3];

          this.keHoachLuongThucDialog.xtnTongGao =
            +luongThuc.value.xtnGaoSoLuong1 + +luongThuc.value.xtnGaoSoLuong2;
          const xtnGao1 = {
            id: null,
            nam: 2019,
            soLuong: +luongThuc.value.xtnGaoSoLuong1,
            vatTuId: null,
          };
          const xtnGao2 = {
            id: null,
            nam: 2018,
            soLuong: +luongThuc.value.xtnGaoSoLuong2,
            vatTuId: null,
          };
          this.keHoachLuongThucDialog.xtnGao = [xtnGao1, xtnGao2];

          this.keHoachLuongThucDialog.tkcnTongSoQuyThoc =
            +luongThuc.value.tkcnTongSoQuyThoc;

          this.keHoachLuongThucDialog.tkcnTongThoc =
            +luongThuc.value.tkcnTongThoc;

          this.keHoachLuongThucDialog.tkcnTongGao =
            +luongThuc.value.tkcnTongGao;

          this.keHoachLuongThucDialog.stt =
            this.thongTinChiTieuKeHoachNam.khLuongThuc?.length + 1;

          // this.thongTinChiTieuKeHoachNam.khLuongThuc = [
          //   ...this.thongTinChiTieuKeHoachNam.khLuongThuc,
          //   this.keHoachLuongThucDialog,
          // ];

          this.checkDataExistLuongThuc(this.keHoachLuongThucDialog);
        }
      });
    } else if (this.tabSelected == TAB_SELECTED.vatTu) {
      const modalVatTu = this.modal.create({
        nzTitle: 'Thông tin vật tư trong năm',
        nzContent: DialogThemThongTinVatTuTrongNamComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          // totalRecord: this.totalRecord,
          // date: event,
        },
      });
      modalVatTu.afterClose.subscribe((vatTu) => {
        if (vatTu) {
          this.keHoachVatTuDialog = new KeHoachVatTu();
          this.keHoachVatTuDialog.tenDonVi = vatTu.value.tenDonVi;
          this.keHoachVatTuDialog.maDonVi = vatTu.value.maDonVi;
          this.keHoachVatTuDialog.donViId = vatTu.value.donViId;
          this.keHoachVatTuDialog.stt =
            this.thongTinChiTieuKeHoachNam.khVatTu?.length + 1;
          this.keHoachVatTuDialog.nhomVatTuThietBi = [];
          let nhom = new NhomVatTuThietBi();
          let cacNam = [
            {
              id: null,
              nam: this.yearNow - 3,
              soLuong: +vatTu.value.soLuongTheoNam1,
              vatTuId: +vatTu.value.vatTuId,
            },
            {
              id: null,
              nam: this.yearNow - 2,
              soLuong: +vatTu.value.soLuongTheoNam2,
              vatTuId: +vatTu.value.vatTuId,
            },
            {
              id: null,
              nam: this.yearNow - 1,
              soLuong: +vatTu.value.soLuongTheoNam3,
              vatTuId: +vatTu.value.vatTuId,
            },
          ];

          nhom.cacNamTruoc = cacNam;
          nhom.donViTinh = vatTu.value.donViTinh;
          nhom.maVatTuCha = vatTu.value.maVatTuCha;
          nhom.nhapTrongNam = vatTu.value.soLuong;
          nhom.stt = 1;
          nhom.tenVatTuCha = vatTu.value.tenVatTuCha;
          nhom.tongCacNamTruoc =
            +vatTu.value.soLuongTheoNam1 +
            +vatTu.value.soLuongTheoNam2 +
            +vatTu.value.soLuongTheoNam3;
          nhom.tongNhap = +vatTu.value.tongSo + nhom.tongCacNamTruoc;
          nhom.vatTuChaId = +vatTu.value.vatTuChaId;

          let vatTuThietBi1 = new VatTuThietBi();
          vatTuThietBi1.cacNamTruoc = cacNam;
          vatTuThietBi1.donViTinh = vatTu.value.donViTinh;
          vatTuThietBi1.maVatTu = vatTu.value.maVatTu;
          vatTuThietBi1.maVatTuCha = vatTu.value.maVatTuCha;
          vatTuThietBi1.nhapTrongNam = vatTu.value.soLuong;
          vatTuThietBi1.stt = 1;
          vatTuThietBi1.tenVatTu = vatTu.value.tenHangHoa;
          vatTuThietBi1.tenVatTuCha = vatTu.value.tenVatTuCha;
          vatTuThietBi1.tongCacNamTruoc =
            +vatTu.value.soLuongTheoNam1 +
            +vatTu.value.soLuongTheoNam2 +
            +vatTu.value.soLuongTheoNam3;
          vatTuThietBi1.tongNhap =
            +vatTu.value.tongSo + vatTuThietBi1.tongCacNamTruoc;
          vatTuThietBi1.vatTuChaId = +vatTu.value.vatTuChaId;
          vatTuThietBi1.vatTuId = +vatTu.value.vatTuId;
          nhom.vatTuThietBi = [];
          nhom.vatTuThietBi.push(vatTuThietBi1);
          this.keHoachVatTuDialog.nhomVatTuThietBi.push(nhom);

          console.log(this.keHoachVatTuDialog);

          this.checkDataExistVatTu(this.keHoachVatTuDialog);
        }
      });
    } else if (this.tabSelected == TAB_SELECTED.muoi) {
      const modalMuoi = this.modal.create({
        nzTitle: 'Thông tin muối',
        nzContent: DialogThemThongTinMuoiComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          thongTinMuoi: data,
        },
      });
      modalMuoi.afterClose.subscribe((muoi) => {
        if (muoi) {
          console.log(muoi);
          this.keHoachMuoiDialog = new KeHoachMuoi();

          this.keHoachMuoiDialog.maDonVi = muoi.value.maDonVi;
          this.keHoachMuoiDialog.ntnTongSoMuoi = muoi.value.ntnTongSo;
          this.keHoachMuoiDialog.tenDonVi = muoi.value.tenDonVi;
          this.keHoachMuoiDialog.tkcnTongSoMuoi = +muoi.value.tkcnTongSo;
          const tkdnMuoi1 = {
            id: null,
            nam: 2019,
            soLuong: +muoi.value.tkdnSoLuong1,
            vatTuId: null,
          };
          const tkdnMuoi2 = {
            id: null,
            nam: 2018,
            soLuong: +muoi.value.tkdnSoLuong2,
            vatTuId: null,
          };
          const tkdnMuoi3 = {
            id: null,
            nam: 2017,
            soLuong: +muoi.value.tkdnSoLuong3,
            vatTuId: null,
          };
          this.keHoachMuoiDialog.tkdnMuoi = [tkdnMuoi1, tkdnMuoi2, tkdnMuoi3];
          this.keHoachMuoiDialog.tkdnTongSoMuoi = +muoi.value.tkdnTongSo;
          const xtnMuoi1 = {
            id: null,
            nam: 2019,
            soLuong: +muoi.value.xtnSoLuong1,
            vatTuId: null,
          };
          const xtnMuoi2 = {
            id: null,
            nam: 2018,
            soLuong: +muoi.value.xtnSoLuong2,
            vatTuId: null,
          };
          const xtnMuoi3 = {
            id: null,
            nam: 2017,
            soLuong: +muoi.value.xtnSoLuong3,
            vatTuId: null,
          };
          this.keHoachMuoiDialog.xtnMuoi = [xtnMuoi1, xtnMuoi2, xtnMuoi3];
          this.keHoachMuoiDialog.xtnTongSoMuoi = +muoi.value.xtnTongSo;
          this.keHoachMuoiDialog.stt =
            this.thongTinChiTieuKeHoachNam.khMuoiDuTru?.length + 1;

          // this.thongTinChiTieuKeHoachNam.khMuoiDuTru = [
          //   ...this.thongTinChiTieuKeHoachNam.khMuoiDuTru,
          //   this.keHoachMuoiDialog,
          // ];
          this.checkDataExistMuoi(this.keHoachMuoiDialog);
        }
      });
    }
  }

  redirectChiTieuKeHoachNam() {
    this.router.navigate(['/kehoach/chi-tieu-ke-hoach-nam-cap-tong-cuc']);
  }

  loadThongTinChiTieuKeHoachNam(id: number) {
    this.chiTieuKeHoachNamService
      .loadThongTinChiTieuKeHoachNam(id)
      .subscribe((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          this.thongTinChiTieuKeHoachNam = res.data;
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

  rowSpanVatTu(data: any): number {
    let rowspan = 1;
    data?.nhomVatTuThietBi?.forEach((nhomVatTuTb) => {
      rowspan += nhomVatTuTb?.vatTuThietBi.length + 1;
    });
    return rowspan;
  }

  exportData() {
    var workbook = XLSX.utils.book_new();
    const listTable = document.getElementsByTagName('table');
    for (let i = 0; i < listTable.length; i++) {
      if (i == 0) {
        let sheet1 = XLSX.utils.table_to_sheet(listTable[i]);
        sheet1['!cols'] = [];
        sheet1['!cols'][24] = { hidden: true };
        sheet1['!cols'][25] = { hidden: true };
        XLSX.utils.book_append_sheet(
          workbook,
          sheet1,
          'Sheet' + (i + 1).toString(),
        );
      } else if (i == 1) {
        let sheet2 = XLSX.utils.table_to_sheet(listTable[i]);
        sheet2['!cols'][12] = { hidden: true };
        sheet2['!cols'][13] = { hidden: true };
        sheet2['!cols'][14] = { hidden: true };
        XLSX.utils.book_append_sheet(
          workbook,
          sheet2,
          'Sheet' + (i + 1).toString(),
        );
      }
      else if (i == 2) {
        let sheet3 = XLSX.utils.table_to_sheet(listTable[i]);
        XLSX.utils.book_append_sheet(
          workbook,
          sheet3,
          'Sheet' + (i + 1).toString(),
        );
      }
    }
    XLSX.writeFile(workbook, 'thong-tin-chi-tieu-ke-hoach-nam.xlsx');
  }

  deleteKeHoachLuongThuc(stt: number) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.thongTinChiTieuKeHoachNam.khLuongThuc =
          this.thongTinChiTieuKeHoachNam.khLuongThuc.filter(
            (khlt) => khlt.stt !== stt,
          );
        this.thongTinChiTieuKeHoachNam?.khLuongThuc.forEach((lt, i) => {
          if (i >= stt - 1) {
            lt.stt = i + 1;
          }
        });
      },
    });
  }

  deleteKeHoachMuoi(stt: number) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.thongTinChiTieuKeHoachNam.khMuoiDuTru =
          this.thongTinChiTieuKeHoachNam.khMuoiDuTru.filter(
            (khlt) => khlt.stt !== stt,
          );
        this.thongTinChiTieuKeHoachNam?.khMuoiDuTru.forEach((lt, i) => {
          if (i >= stt - 1) {
            lt.stt = i + 1;
          }
        });
      },
    });
  }

  selectFile(idElement: string) {
    document.getElementById(idElement).click();
  }

  uploadFile(event: any) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.fileDinhKem = fileList[0].name;
    }
  }

  async importFileData(event: any) {
    this.spinner.show();
    try {
      const element = event.currentTarget as HTMLInputElement;
      let fileList: FileList | null = element.files;
      if (fileList) {
        let res = await this.chiTieuKeHoachNamService.importFile(fileList[0]);
        if (res.msg == MESSAGE.SUCCESS) {
          let temptData = res.data;
          if (temptData) {
            if (temptData.khluongthuc && temptData.khluongthuc.length > 0) {
              for (let i = 0; i < temptData.khluongthuc.length; i++) {
                this.checkDataExistLuongThuc(temptData.khluongthuc[i]);
              }
            }
            if (temptData.khMuoi && temptData.khMuoi.length > 0) {
              for (let i = 0; i < temptData.khMuoi.length; i++) {
                this.checkDataExistMuoi(temptData.khMuoi[i]);
              }
            }
            if (temptData.khVatTu && temptData.khVatTu.length > 0) {
              for (let i = 0; i < temptData.khVatTu.length; i++) {
                this.checkDataExistVatTu(temptData.khVatTu[i]);
              }
            }
          }
        }
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  checkDataExistLuongThuc(data: any) {
    if (this.thongTinChiTieuKeHoachNam.khLuongThuc) {
      let indexExist = this.thongTinChiTieuKeHoachNam.khLuongThuc.findIndex(
        (x) => x.maDonVi == data.maDonVi,
      );
      if (indexExist != -1) {
        this.thongTinChiTieuKeHoachNam.khLuongThuc.splice(indexExist, 1);
      }
    } else {
      this.thongTinChiTieuKeHoachNam.khLuongThuc = [];
    }
    // data.stt = this.thongTinChiTieuKeHoachNam.khLuongThuc.length + 1;
    this.thongTinChiTieuKeHoachNam.khLuongThuc = [
      ...this.thongTinChiTieuKeHoachNam.khLuongThuc,
      data,
    ];
    this.thongTinChiTieuKeHoachNam.khLuongThuc.forEach((lt, i) => {
      lt.stt = i + 1;
    });
  }

  checkDataExistMuoi(data: any) {
    if (this.thongTinChiTieuKeHoachNam.khMuoiDuTru) {
      let indexExist = this.thongTinChiTieuKeHoachNam.khMuoiDuTru.findIndex(
        (x) => x.maDonVi == data.maDonVi,
      );
      if (indexExist != -1) {
        this.thongTinChiTieuKeHoachNam.khMuoiDuTru.splice(indexExist, 1);
      }
    } else {
      this.thongTinChiTieuKeHoachNam.khMuoiDuTru = [];
    }
    this.thongTinChiTieuKeHoachNam.khMuoiDuTru = [
      ...this.thongTinChiTieuKeHoachNam.khMuoiDuTru,
      data,
    ];
    this.thongTinChiTieuKeHoachNam.khMuoiDuTru.forEach((lt, i) => {
      lt.stt = i + 1;
    });
  }

  checkDataExistVatTu(data: any) {
    if (this.thongTinChiTieuKeHoachNam.khVatTu) {
      let indexExist = this.thongTinChiTieuKeHoachNam.khVatTu.findIndex(
        (x) => x.maDonVi == data.maDonVi,
      );
      if (indexExist != -1) {
        let nhomVatTuTemp = [];
        if (
          this.thongTinChiTieuKeHoachNam.khVatTu[indexExist].nhomVatTuThietBi &&
          this.thongTinChiTieuKeHoachNam.khVatTu[indexExist].nhomVatTuThietBi
            .length > 0
        ) {
          nhomVatTuTemp =
            this.thongTinChiTieuKeHoachNam.khVatTu[indexExist].nhomVatTuThietBi;
        }
        for (let i = 0; i < data.nhomVatTuThietBi.length; i++) {
          let indexNhom = nhomVatTuTemp.findIndex(
            (x) => x.vatTuChaId == data.nhomVatTuThietBi[i].vatTuChaId,
          );
          if (indexNhom != -1) {
            let vatTuThietBiTemp = [];
            if (
              nhomVatTuTemp[indexNhom].vatTuThietBi &&
              nhomVatTuTemp[indexNhom].vatTuThietBi.length > 0
            ) {
              vatTuThietBiTemp = nhomVatTuTemp[indexNhom].vatTuThietBi;
            }
            for (
              let j = 0;
              j < data.nhomVatTuThietBi[i].vatTuThietBi.length;
              j++
            ) {
              let indexVatTu = vatTuThietBiTemp.findIndex(
                (x) =>
                  x.vatTuId == data.nhomVatTuThietBi[i].vatTuThietBi[j].vatTuId,
              );
              if (indexVatTu != -1) {
                vatTuThietBiTemp[indexVatTu] =
                  data.nhomVatTuThietBi[i].vatTuThietBi[j];
              } else {
                vatTuThietBiTemp.push(data.nhomVatTuThietBi[i].vatTuThietBi[j]);
              }
            }
            data.nhomVatTuThietBi[i].vatTuThietBi = vatTuThietBiTemp;
          } else {
            nhomVatTuTemp.push(data.nhomVatTuThietBi[i]);
          }
        }
        data.nhomVatTuThietBi = nhomVatTuTemp;
        this.thongTinChiTieuKeHoachNam.khVatTu.splice(indexExist, 1);
      }
    } else {
      this.thongTinChiTieuKeHoachNam.khVatTu = [];
    }
    this.thongTinChiTieuKeHoachNam.khVatTu = [
      ...this.thongTinChiTieuKeHoachNam.khVatTu,
      data,
    ];
    this.thongTinChiTieuKeHoachNam.khVatTu.forEach((lt, i) => {
      lt.stt = i + 1;
    });
  }

  printTable() {
    const modalIn = this.modal.create({
      nzTitle: 'Lựa chọn in',
      nzContent: DialogLuaChonInComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '600px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalIn.afterClose.subscribe((res) => {
      if (res) {
        let WindowPrt = window.open(
          '',
          '',
          'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0',
        );
        let printContent = '';
        if (res.luongThuc) {
          printContent = printContent + '<div>';
          printContent =
            printContent +
            document.getElementById('table-luong-thuc').innerHTML;
          printContent = printContent + '</div>';
        }
        if (res.muoi) {
          printContent = printContent + '<div>';
          printContent =
            printContent + document.getElementById('table-muoi').innerHTML;
          printContent = printContent + '</div>';
        }
        if (res.vatTu) {
          printContent = printContent + '<div>';
          printContent =
            printContent + document.getElementById('table-vat-tu').innerHTML;
          printContent = printContent + '</div>';
        }
        WindowPrt.document.write(printContent);
        WindowPrt.document.close();
        WindowPrt.focus();
        WindowPrt.print();
        WindowPrt.close();
      }
    });
  }

  guiDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn gửi duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            "id": 0,
            "lyDoTuChoi": null,
            "trangThai": "01"
          }
          await this.chiTieuKeHoachNamService.updateStatus(body);
          this.spinner.hide();
        }
        catch (e) {
          console.log('error: ', e)
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  pheDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn phê duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            "id": 0,
            "lyDoTuChoi": null,
            "trangThai": "01"
          }
          await this.chiTieuKeHoachNamService.updateStatus(body);
          this.spinner.hide();
        }
        catch (e) {
          console.log('error: ', e)
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  tuChoi() {
    const modalTuChoi = this.modal.create({
      nzTitle: 'Từ chối',
      nzContent: DialogTuChoiComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
      },
    });
    modalTuChoi.afterClose.subscribe(async (text) => {
      if (text) {
        this.spinner.show();
        try {
          let body = {
            "id": 0,
            "lyDoTuChoi": text,
            "trangThai": "01"
          }
          await this.chiTieuKeHoachNamService.updateStatus(body);
          this.spinner.hide();
        }
        catch (e) {
          console.log('error: ', e)
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      }
    });
  }

  huyBo() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn hủy bỏ các thao tác đang làm?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.router.navigate(['/kehoach/chi-tieu-ke-hoach-nam-cap-tong-cuc']);
      },
    });
  }
}
