import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { KeHoachLuongThuc } from 'src/app/models/KeHoachLuongThuc';
import { KeHoachMuoi } from 'src/app/models/KeHoachMuoi';
import { TAB_SELECTED } from './dieu-chinh-thong-tin-chi-tieu-ke-hoach-nam.constant';
import * as dayjs from 'dayjs';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DialogQuyetDinhGiaoChiTieuComponent } from 'src/app/components/dialog/dialog-quyet-dinh-giao-chi-tieu/dialog-quyet-dinh-giao-chi-tieu.component';
import { DialogDieuChinhThemThongTinLuongThucComponent } from 'src/app/components/dialog/dialog-dieu-chinh-them-thong-tin-luong-thuc/dialog-dieu-chinh-them-thong-tin-luong-thuc.component';
import { DialogDieuChinhThemThongTinMuoiComponent } from 'src/app/components/dialog/dialog-dieu-chinh-them-thong-tin-muoi/dialog-dieu-chinh-them-thong-tin-muoi.component';
import { DialogDieuChinhThemThongTinVatTuComponent } from 'src/app/components/dialog/dialog-dieu-chinh-them-thong-tin-vat-tu/dialog-dieu-chinh-them-thong-tin-vat-tu.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { DialogLuaChonInComponent } from 'src/app/components/dialog/dialog-lua-chon-in/dialog-lua-chon-in.component';
import { ThongTinChiTieuKeHoachNam } from 'src/app/models/ThongTinChiTieuKHNam';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { QuyetDinhDieuChinhChiTieuKeHoachNamService } from 'src/app/services/quyetDinhDieuChinhChiTieuKeHoachNam.service';
import { MESSAGE } from 'src/app/constants/message';
import * as XLSX from 'xlsx';
import { DieuChinhThongTinChiTieuKHNam } from 'src/app/models/DieuChinhThongTinChiTieuKHNam';
import { QuyetDinhChiTieuKHNam } from 'src/app/models/QuyetDinhChiTieuKHNam';
import { ChiTieuKeHoachNamCapTongCucService } from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
interface DataItem {
  name: string;
  age: number;
  street: string;
  building: string;
  number: number;
  companyAddress: string;
  companyName: string;
  gender: string;
}
@Component({
  selector: 'app-dieu-chinh-thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc',
  templateUrl:
    './dieu-chinh-thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc.component.html',
  styleUrls: [
    './dieu-chinh-thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc.component.scss',
  ],
})
export class DieuChinhThongTinChiTieuKeHoachNamComponent implements OnInit {
  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
  listThoc: KeHoachLuongThuc[] = [];
  listMuoi: KeHoachMuoi[] = [];
  listVatTu = [];
  modals = {
    luaChonIn: false,
    thongTinLuongThuc: false,
    thongTinVatTuTrongNam: false,
    thongTinMuoi: false,
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
  listNam: any[] = [];
  firstDayOfYear: string = '';
  lastDayOfYear: string = '';
  yearNow: number = 0;
  startValue: Date | null = null;
  endValue: Date | null = null;
  formData: FormGroup;
  errorInputRequired: string = 'Dữ liệu không được để trống.';
  selectedCanCu: any = null;
  dieuChinhThongTinChiTieuKHNam: DieuChinhThongTinChiTieuKHNam =
    new DieuChinhThongTinChiTieuKHNam();
  fileDinhKem: string = null;
  tableExist: boolean = false;

  constructor(
    private router: Router,
    private routerActive: ActivatedRoute,
    private fb: FormBuilder,
    private modal: NzModalService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private quyetDinhDieuChinhChiTieuKeHoachNamService: QuyetDinhDieuChinhChiTieuKeHoachNamService,
    private chiTieuKeHoachNamCapTongCucService: ChiTieuKeHoachNamCapTongCucService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.yearNow = dayjs().get('year');
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: this.yearNow - i,
        text: this.yearNow - i,
      });
    }
    this.firstDayOfYear = '01/01/' + (this.yearNow - 1).toString();
    this.lastDayOfYear = '31/12/' + (this.yearNow - 1).toString();
    this.id = +this.routerActive.snapshot.paramMap.get('id');
    this.loadDataChiTiet(this.id);
  }

  loadDataChiTiet(id: number) {
    this.dieuChinhThongTinChiTieuKHNam.qd = new QuyetDinhChiTieuKHNam();
    this.dieuChinhThongTinChiTieuKHNam.qdDc = new QuyetDinhChiTieuKHNam();
    this.dieuChinhThongTinChiTieuKHNam.qd.khLuongThuc = [];
    this.dieuChinhThongTinChiTieuKHNam.qd.khMuoi = [];
    this.dieuChinhThongTinChiTieuKHNam.qd.khVatTu = [];
    this.dieuChinhThongTinChiTieuKHNam.qdDc.khLuongThuc = [];
    this.dieuChinhThongTinChiTieuKHNam.qdDc.khMuoi = [];
    this.dieuChinhThongTinChiTieuKHNam.qdDc.khVatTu = [];
    this.formData = this.fb.group({
      canCu: [null],
      soQD: [null, [Validators.required]],
      ngayKy: [null, [Validators.required]],
      ngayHieuLuc: [null, [Validators.required]],
      namKeHoach: [null, [Validators.required]],
      trichYeu: [null],
      ghiChu: [null, [Validators.required]],
    });
    if (id > 0) {
    }
  }

  ngAfterViewChecked(): void {
    const table = document.getElementsByTagName('table');
    this.tableExist = table && table.length > 0 ? true : false;
    this.cdr.detectChanges();
  }

  themMoi(data?: any) {
    if (this.tabSelected == TAB_SELECTED.luongThuc) {
      const modalLuongThuc = this.modal.create({
        nzTitle: 'Thông tin lương thực',
        nzContent: DialogDieuChinhThemThongTinLuongThucComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          data: data,
        },
      });
      modalLuongThuc.afterClose.subscribe((res) => {
        if (res) {
        }
      });
    } else if (this.tabSelected == TAB_SELECTED.vatTu) {
      const modalVatTu = this.modal.create({
        nzTitle: 'Thông tin vật tư trong năm',
        nzContent: DialogDieuChinhThemThongTinVatTuComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          data: data,
        },
      });
      modalVatTu.afterClose.subscribe((res) => {
        if (res) {
        }
      });
    } else if (this.tabSelected == TAB_SELECTED.muoi) {
      const modalMuoi = this.modal.create({
        nzTitle: 'Thông tin muối',
        nzContent: DialogDieuChinhThemThongTinMuoiComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          data: data,
        },
      });
      modalMuoi.afterClose.subscribe((res) => {
        if (res) {
        }
      });
    }
  }

  redirectChiTieuKeHoachNam() {
    this.router.navigate([
      '/kehoach/dieu-chinh-chi-tieu-ke-hoach-nam-cap-tong-cuc',
    ]);
  }

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.formData.controls['ngayHieuLuc'].value) {
      return false;
    }
    return (
      startValue.getTime() >
      this.formData.controls['ngayHieuLuc'].value.getTime()
    );
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.formData.controls['ngayKy'].value) {
      return false;
    }
    return (
      endValue.getTime() <= this.formData.controls['ngayKy'].value.getTime()
    );
  };

  handleStartOpenChange(open: boolean): void {
    if (!open) {
      this.endDatePicker.open();
    }
  }

  handleEndOpenChange(open: boolean): void {
    console.log('handleEndOpenChange', open);
  }

  openDialogQuyetDinhGiaoChiTieu() {
    if (this.id == 0) {
      const modalQD = this.modal.create({
        nzTitle: 'Thông tin QĐ giao chỉ tiêu kế hoạch',
        nzContent: DialogQuyetDinhGiaoChiTieuComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {},
      });
      modalQD.afterClose.subscribe((data) => {
        if (data) {
          this.spinner.show();
          this.formData.controls['canCu'].setValue(data.soQuyetDinh);
          this.selectedCanCu = data;
          this.chiTieuKeHoachNamCapTongCucService
            .loadThongTinChiTieuKeHoachNam(this.selectedCanCu.id)
            .then((res) => {
              if (res.msg == MESSAGE.SUCCESS) {
                let tempData = res.data;
                this.formData.controls['namKeHoach'].setValue(
                  tempData.namKeHoach,
                );

                this.dieuChinhThongTinChiTieuKHNam.qdDc.khLuongThuc =
                  tempData.khLuongThuc;
                this.dieuChinhThongTinChiTieuKHNam.qdDc.khMuoi =
                  tempData.khMuoiDuTru;
                this.dieuChinhThongTinChiTieuKHNam.qdDc.khVatTu =
                  tempData.khVatTu;

                this.dieuChinhThongTinChiTieuKHNam.qd.khLuongThuc =
                  tempData.khLuongThuc;
                this.dieuChinhThongTinChiTieuKHNam.qd.khMuoi =
                  tempData.khMuoiDuTru;
                this.dieuChinhThongTinChiTieuKHNam.qd.khVatTu =
                  tempData.khVatTu;
                this.dieuChinhThongTinChiTieuKHNam.qd.id = tempData.id;
                this.dieuChinhThongTinChiTieuKHNam.qd.namKeHoach =
                  tempData.namKeHoach;
                this.dieuChinhThongTinChiTieuKHNam.qd.ngayHieuLuc =
                  tempData.ngayHieuLuc;
                this.dieuChinhThongTinChiTieuKHNam.qd.ngayKy = tempData.ngayKy;
                this.dieuChinhThongTinChiTieuKHNam.qd.soQuyetDinh =
                  tempData.soQuyetDinh;
                this.dieuChinhThongTinChiTieuKHNam.qd.trichYeu =
                  tempData.trichYeu;
              }
            });
          this.spinner.hide();
        }
      });
    }
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

  selectFile(idElement: string) {
    document.getElementById(idElement).click();
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
        this.dieuChinhThongTinChiTieuKHNam.qdDc.khLuongThuc =
          this.dieuChinhThongTinChiTieuKHNam.qdDc.khLuongThuc.filter(
            (khlt) => khlt.stt !== stt,
          );
        this.dieuChinhThongTinChiTieuKHNam.qdDc?.khLuongThuc.forEach(
          (lt, i) => {
            if (i >= stt - 1) {
              lt.stt = i + 1;
            }
          },
        );
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
        this.dieuChinhThongTinChiTieuKHNam.qdDc.khMuoi =
          this.dieuChinhThongTinChiTieuKHNam.qdDc.khMuoi.filter(
            (khlt) => khlt.stt !== stt,
          );
        this.dieuChinhThongTinChiTieuKHNam.qdDc?.khMuoi.forEach((lt, i) => {
          if (i >= stt - 1) {
            lt.stt = i + 1;
          }
        });
      },
    });
  }

  uploadFile(event: any) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.fileDinhKem = fileList[0].name;
    }
  }

  exportData() {
    var workbook = XLSX.utils.book_new();
    const tableLuongThuc = document
      .getElementById('table-luong-thuc-tong-hop')
      .getElementsByTagName('table');
    if (tableLuongThuc && tableLuongThuc.length > 0) {
      let sheetLuongThuc = XLSX.utils.table_to_sheet(tableLuongThuc[0]);
      sheetLuongThuc['!cols'] = [];
      sheetLuongThuc['!cols'][24] = { hidden: true };
      XLSX.utils.book_append_sheet(workbook, sheetLuongThuc, 'sheetLuongThuc');
    }
    const tableMuoi = document
      .getElementById('table-muoi-tong-hop')
      .getElementsByTagName('table');
    if (tableMuoi && tableMuoi.length > 0) {
      let sheetMuoi = XLSX.utils.table_to_sheet(tableMuoi[0]);
      sheetMuoi['!cols'] = [];
      sheetMuoi['!cols'][12] = { hidden: true };
      XLSX.utils.book_append_sheet(workbook, sheetMuoi, 'sheetMuoi');
    }
    const tableVatTu = document
      .getElementById('table-vat-tu-tong-hop')
      .getElementsByTagName('table');
    if (tableVatTu && tableVatTu.length > 0) {
      let sheetVatTu = XLSX.utils.table_to_sheet(tableVatTu[0]);
      XLSX.utils.book_append_sheet(workbook, sheetVatTu, 'sheetVatTu');
    }
    XLSX.writeFile(workbook, 'thong-tin-dieu-chinh-chi-tieu-ke-hoach-nam.xlsx');
  }

  async importFileData(event: any) {
    this.spinner.show();
    try {
      const element = event.currentTarget as HTMLInputElement;
      let fileList: FileList | null = element.files;
      if (fileList) {
        let res =
          await this.quyetDinhDieuChinhChiTieuKeHoachNamService.importFile(
            fileList[0],
          );
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
      element.value = null;
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  checkDataExistLuongThuc(data: any) {
    if (this.dieuChinhThongTinChiTieuKHNam.qdDc.khLuongThuc) {
      let indexExist =
        this.dieuChinhThongTinChiTieuKHNam.qdDc.khLuongThuc.findIndex(
          (x) => x.maDonVi == data.maDonVi,
        );
      if (indexExist != -1) {
        this.dieuChinhThongTinChiTieuKHNam.qdDc.khLuongThuc.splice(
          indexExist,
          1,
        );
      }
    } else {
      this.dieuChinhThongTinChiTieuKHNam.qdDc.khLuongThuc = [];
    }
    this.dieuChinhThongTinChiTieuKHNam.qdDc.khLuongThuc = [
      ...this.dieuChinhThongTinChiTieuKHNam.qdDc.khLuongThuc,
      data,
    ];
    this.dieuChinhThongTinChiTieuKHNam.qdDc.khLuongThuc.forEach((lt, i) => {
      lt.stt = i + 1;
    });
  }

  checkDataExistMuoi(data: any) {
    if (this.dieuChinhThongTinChiTieuKHNam.qdDc.khMuoi) {
      let indexExist = this.dieuChinhThongTinChiTieuKHNam.qdDc.khMuoi.findIndex(
        (x) => x.maDonVi == data.maDonVi,
      );
      if (indexExist != -1) {
        this.dieuChinhThongTinChiTieuKHNam.qdDc.khMuoi.splice(indexExist, 1);
      }
    } else {
      this.dieuChinhThongTinChiTieuKHNam.qdDc.khMuoi = [];
    }
    this.dieuChinhThongTinChiTieuKHNam.qdDc.khMuoi = [
      ...this.dieuChinhThongTinChiTieuKHNam.qdDc.khMuoi,
      data,
    ];
    this.dieuChinhThongTinChiTieuKHNam.qdDc.khMuoi.forEach((lt, i) => {
      lt.stt = i + 1;
    });
  }

  checkDataExistVatTu(data: any) {
    if (this.dieuChinhThongTinChiTieuKHNam.qdDc.khVatTu) {
      let indexExist =
        this.dieuChinhThongTinChiTieuKHNam.qdDc.khVatTu.findIndex(
          (x) => x.maDonVi == data.maDonVi,
        );
      if (indexExist != -1) {
        let nhomVatTuTemp = [];
        if (
          this.dieuChinhThongTinChiTieuKHNam.qdDc.khVatTu[indexExist]
            .nhomVatTuThietBi &&
          this.dieuChinhThongTinChiTieuKHNam.qdDc.khVatTu[indexExist]
            .nhomVatTuThietBi.length > 0
        ) {
          nhomVatTuTemp =
            this.dieuChinhThongTinChiTieuKHNam.qdDc.khVatTu[indexExist]
              .nhomVatTuThietBi;
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
        this.dieuChinhThongTinChiTieuKHNam.qdDc.khVatTu.splice(indexExist, 1);
      }
    } else {
      this.dieuChinhThongTinChiTieuKHNam.qdDc.khVatTu = [];
    }
    this.dieuChinhThongTinChiTieuKHNam.qdDc.khVatTu = [
      ...this.dieuChinhThongTinChiTieuKHNam.qdDc.khVatTu,
      data,
    ];
    this.dieuChinhThongTinChiTieuKHNam.qdDc.khVatTu.forEach((lt, i) => {
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
            document.getElementById('table-luong-thuc-tong-hop').innerHTML;
          printContent = printContent + '</div>';
        }
        if (res.muoi) {
          printContent = printContent + '<div>';
          printContent =
            printContent +
            document.getElementById('table-muoi-tong-hop').innerHTML;
          printContent = printContent + '</div>';
        }
        if (res.vatTu) {
          printContent = printContent + '<div>';
          printContent =
            printContent +
            document.getElementById('table-vat-tu-tong-hop').innerHTML;
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
      nzOnOk: async () => {},
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
      nzOnOk: async () => {},
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
      nzComponentParams: {},
    });
    modalTuChoi.afterClose.subscribe(async (text) => {
      if (text) {
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
        this.router.navigate([
          '/kehoach/dieu-chinh-chi-tieu-ke-hoach-nam-cap-tong-cuc',
        ]);
      },
    });
  }
}
