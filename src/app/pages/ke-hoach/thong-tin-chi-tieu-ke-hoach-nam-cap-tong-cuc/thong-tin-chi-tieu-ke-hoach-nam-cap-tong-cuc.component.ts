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
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

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
  thongTinChiTieuKeHoachNam: ThongTinChiTieuKeHoachNam = new ThongTinChiTieuKeHoachNam();
  tableExist: boolean = false;
  keHoachLuongThucDialog: KeHoachLuongThuc;
  keHoachMuoiDialog: KeHoachMuoi;
  keHoachVatTuDialog: KeHoachVatTu;
  fileDinhKem: string = null;
  qdTCDT: string = MESSAGE.QD_TCDT;
  formData: FormGroup;
  errorInputRequired: string = 'Dữ liệu không được để trống.';
  listNam: any[] = [];

  mapOfExpandedData: { [key: string]: any[] } = {};

  constructor(
    private router: Router,
    private routerActive: ActivatedRoute,
    private chiTieuKeHoachNamService: ChiTieuKeHoachNamCapTongCucService,
    private cdr: ChangeDetectorRef,
    private modal: NzModalService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private fb: FormBuilder,
    private helperService: HelperService,
  ) { }

  ngOnInit(): void {
    this.id = +this.routerActive.snapshot.paramMap.get('id');
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: this.yearNow - i,
        text: this.yearNow - i,
      });
    }
    this.initForm();
    this.loadThongTinChiTieuKeHoachNam(this.id);
  }

  updateDataListVatTu(data: any) {
    for (let j = 0; j < data.length; j++) {
      let res = [];
      let parentList = data[j].vatTuThietBi.filter(x => x.maVatTuCha == null);
      for (let i = 0; i < parentList.length; i++) {
        let tempt = [];
        let hasChild = false;
        let checkChild = data[j].vatTuThietBi.filter(x => x.maVatTuCha == parentList[i].maVatTu);
        if (checkChild && checkChild.length > 0) {
          hasChild = true;
        }
        let item = {
          ...parentList[i],
          level: 0,
          hasChild: hasChild,
          expand: false,
          display: true,
        };
        tempt.push(item);
        let dataChild = this.updateDataChaCon(data[j].vatTuThietBi, item, tempt);
        res = [...res, ...dataChild];
      }
      data[j].listDisplay = [];
      if (res && res.length > 0) {
        data[j].listDisplay = res;
      }
    }
    return data;
  }

  updateDataChaCon(dataList: any, dataCha: any, dataReturn: any) {
    let listChild = dataList.filter(x => x.maVatTuCha == dataCha.maVatTu);
    for (let i = 0; i < listChild.length; i++) {
      let hasChild = false;
      let checkChild = dataList.filter(x => x.maVatTuCha == listChild[i].maVatTu);
      if (checkChild && checkChild.length > 0) {
        hasChild = true;
      }
      let item = {
        ...listChild[i],
        level: dataCha.level + 1,
        hasChild: hasChild,
        expand: false,
        display: (dataCha.level + 1) == 1 ? true : false,
      };
      dataReturn.push(item);
      this.updateDataChaCon(dataList, item, dataReturn);
    }
    return dataReturn;
  }

  displayChild(item: any, listCha: any, expand: boolean) {
    for (let i = 0; i < this.thongTinChiTieuKeHoachNam.khVatTu.length; i++) {
      if (this.thongTinChiTieuKeHoachNam.khVatTu[i].donViId == listCha.donViId) {
        for (let j = 0; j < this.thongTinChiTieuKeHoachNam.khVatTu[i].listDisplay.length; j++) {
          if (this.thongTinChiTieuKeHoachNam.khVatTu[i].listDisplay[j].maVatTu == item.maVatTu) {
            this.thongTinChiTieuKeHoachNam.khVatTu[i].listDisplay[j].expand = expand;
          }
          if (this.thongTinChiTieuKeHoachNam.khVatTu[i].listDisplay[j].maVatTuCha == item.maVatTu) {
            this.thongTinChiTieuKeHoachNam.khVatTu[i].listDisplay[j].display = expand;
          }
        }
        if (!expand) {
          this.thongTinChiTieuKeHoachNam.khVatTu[i].listDisplay =
            this.updateHideDisplayChild(item, this.thongTinChiTieuKeHoachNam.khVatTu[i].listDisplay);
        }
        break;
      }
    }
  }

  updateHideDisplayChild(itemCha: any, dataReturn: any) {
    for (let i = 0; i < dataReturn.length; i++) {
      if (dataReturn[i].maVatTuCha == itemCha.maVatTu) {
        dataReturn[i].display = false;
        dataReturn[i].expand = false;
        this.updateHideDisplayChild(dataReturn[i], dataReturn);
      }
    }
    return dataReturn;
  }

  initForm() {
    this.formData = this.fb.group({
      soQD: [
        this.thongTinChiTieuKeHoachNam
          ? this.thongTinChiTieuKeHoachNam.soQuyetDinh
          : null,
        [Validators.required],
      ],
      ngayKy: [
        this.thongTinChiTieuKeHoachNam
          ? this.thongTinChiTieuKeHoachNam.ngayKy
          : null,
        [Validators.required],
      ],
      ngayHieuLuc: [
        this.thongTinChiTieuKeHoachNam
          ? this.thongTinChiTieuKeHoachNam.ngayHieuLuc
          : null,
        [Validators.required],
      ],
      namKeHoach: [
        this.thongTinChiTieuKeHoachNam
          ? this.thongTinChiTieuKeHoachNam.namKeHoach
          : null,
        [Validators.required],
      ],
      trichYeu: [
        this.thongTinChiTieuKeHoachNam
          ? this.thongTinChiTieuKeHoachNam.trichYeu
          : null,
      ],
    });
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
          this.keHoachLuongThucDialog.donViId = luongThuc.value.donViId;
          this.keHoachLuongThucDialog.khGaoId = luongThuc.value.khGaoId;
          this.keHoachLuongThucDialog.khThocId = luongThuc.value.khThocId;

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
          this.keHoachVatTuDialog.vatTuThietBi = [];
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
          let temp = [];
          temp = this.getListVatTuThietBi(vatTu.value.vatTu, temp);
          if (temp && temp.length > 0) {
            for (let i = 0; i < temp.length; i++) {
              let vatTuThietBi1 = new VatTuThietBi();
              vatTuThietBi1.cacNamTruoc = cacNam;
              vatTuThietBi1.donViTinh = vatTu.value.donViTinh;
              vatTuThietBi1.maVatTu = temp[i].maVatTu;
              vatTuThietBi1.maVatTuCha = temp[i].maVatTuCha;
              vatTuThietBi1.nhapTrongNam = vatTu.value.soLuong;
              vatTuThietBi1.stt = 1;
              vatTuThietBi1.tenVatTu = temp[i].tenVatTu;
              vatTuThietBi1.tenVatTuCha = temp[i].tenVatTuCha;
              vatTuThietBi1.tongCacNamTruoc =
                +vatTu.value.soLuongTheoNam1 +
                +vatTu.value.soLuongTheoNam2 +
                +vatTu.value.soLuongTheoNam3;
              vatTuThietBi1.tongNhap =
                +vatTu.value.tongSo + vatTuThietBi1.tongCacNamTruoc;
              vatTuThietBi1.vatTuChaId = +temp[i].vatTuChaId;
              vatTuThietBi1.vatTuId = +temp[i].vatTuId;
              this.keHoachVatTuDialog.vatTuThietBi.push(vatTuThietBi1);
            }
          }
          this.checkDataExistVatTu(this.keHoachVatTuDialog);
          this.thongTinChiTieuKeHoachNam.khVatTu = this.updateDataListVatTu(this.thongTinChiTieuKeHoachNam.khVatTu);
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

          this.keHoachMuoiDialog.donViId = muoi.value.donViId;
          this.keHoachMuoiDialog.id = muoi.value.id;

          this.checkDataExistMuoi(this.keHoachMuoiDialog);
        }
      });
    }
  }

  getListVatTuThietBi(dataCon: any, dataReturn: any) {
    if (!dataReturn) {
      dataReturn = [];
    }
    if (dataCon) {
      let item = {
        maVatTu: dataCon.ma,
        maVatTuCha: null,
        vatTuId: dataCon.id,
        vatTuChaId: null,
        tenVatTu: dataCon.ten,
        tenVatTuCha: null,
      }
      if (dataCon.parent) {
        item.maVatTuCha = dataCon.parent.ma;
        item.vatTuChaId = dataCon.parent.id;
        item.tenVatTuCha = dataCon.parent.ten;
        dataReturn.push(item);
        this.getListVatTuThietBi(dataCon.parent, dataReturn);
      }
      else {
        dataReturn.push(item);
      }
    }
    return dataReturn;
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
          this.thongTinChiTieuKeHoachNam.khVatTu = this.updateDataListVatTu(this.thongTinChiTieuKeHoachNam.khVatTu);
          this.initForm();
          this.formData.patchValue({
            soQD: this.formData.get('soQD').value.split('/')[0],
          });
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
            parseFloat(this.helperService.replaceAll(table.rows[i].cells[indexCell].innerHTML, stringReplace, ''));
        }
      }
    }
    return sumVal;
  }

  rowSpanVatTu(data: any): number {
    let rowspan = 1;
    if (data && data?.listDisplay && data?.listDisplay?.length > 0) {
      let getDisplay = data?.listDisplay.filter(x => x.display == true);
      if (getDisplay && getDisplay.length > 0) {
        rowspan = getDisplay.length + 1;
      }

    }
    return rowspan;
  }

  exportData() {
    var workbook = XLSX.utils.book_new();
    const tableLuongThuc = document
      .getElementById('table-luong-thuc')
      .getElementsByTagName('table');
    if (tableLuongThuc && tableLuongThuc.length > 0) {
      let sheetLuongThuc = XLSX.utils.table_to_sheet(tableLuongThuc[0]);
      sheetLuongThuc['!cols'] = [];
      sheetLuongThuc['!cols'][24] = { hidden: true };
      sheetLuongThuc['!cols'][25] = { hidden: true };
      XLSX.utils.book_append_sheet(workbook, sheetLuongThuc, 'sheetLuongThuc');
    }
    const tableMuoi = document
      .getElementById('table-muoi')
      .getElementsByTagName('table');
    if (tableMuoi && tableMuoi.length > 0) {
      let sheetMuoi = XLSX.utils.table_to_sheet(tableMuoi[0]);
      sheetMuoi['!cols'] = [];
      sheetMuoi['!cols'][12] = { hidden: true };
      sheetMuoi['!cols'][13] = { hidden: true };
      XLSX.utils.book_append_sheet(workbook, sheetMuoi, 'sheetMuoi');
    }
    const tableVatTu = document
      .getElementById('table-vat-tu')
      .getElementsByTagName('table');
    if (tableVatTu && tableVatTu.length > 0) {
      let sheetVatTu = XLSX.utils.table_to_sheet(tableVatTu[0]);
      XLSX.utils.book_append_sheet(workbook, sheetVatTu, 'sheetVatTu');
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
      element.value = null;
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
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
          this.thongTinChiTieuKeHoachNam.khVatTu[indexExist].vatTuThietBi &&
          this.thongTinChiTieuKeHoachNam.khVatTu[indexExist].vatTuThietBi
            .length > 0
        ) {
          nhomVatTuTemp =
            this.thongTinChiTieuKeHoachNam.khVatTu[indexExist].vatTuThietBi;
        }
        for (let i = 0; i < data.vatTuThietBi.length; i++) {
          let indexNhom = nhomVatTuTemp.findIndex(
            (x) => x.maVatTu == data.vatTuThietBi[i].maVatTu,
          );
          if (indexNhom != -1) {
            this.thongTinChiTieuKeHoachNam.khVatTu[indexExist].vatTuThietBi[indexNhom] = data.vatTuThietBi[i];
          } else {
            this.thongTinChiTieuKeHoachNam.khVatTu[indexExist].vatTuThietBi.push(data.vatTuThietBi[i]);
          }
        }
      }
      else {
        this.thongTinChiTieuKeHoachNam.khVatTu = [...this.thongTinChiTieuKeHoachNam.khVatTu, data];
      }
    } else {
      this.thongTinChiTieuKeHoachNam.khVatTu = [];
      this.thongTinChiTieuKeHoachNam.khVatTu = [
        ...this.thongTinChiTieuKeHoachNam.khVatTu,
        data,
      ];
    }
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
            id: 0,
            lyDoTuChoi: null,
            trangThai: '01',
          };
          await this.chiTieuKeHoachNamService.updateStatus(body);
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
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
            id: 0,
            lyDoTuChoi: null,
            trangThai: '01',
          };
          await this.chiTieuKeHoachNamService.updateStatus(body);
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
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
      nzComponentParams: {},
    });
    modalTuChoi.afterClose.subscribe(async (text) => {
      if (text) {
        this.spinner.show();
        try {
          let body = {
            id: 0,
            lyDoTuChoi: text,
            trangThai: '01',
          };
          await this.chiTieuKeHoachNamService.updateStatus(body);
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
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

  save() {
    console.log('123: ', this.thongTinChiTieuKeHoachNam);

    this.thongTinChiTieuKeHoachNam.soQuyetDinh = `${this.formData.get('soQD').value
      }${MESSAGE.QD_TCDT}`;
    this.thongTinChiTieuKeHoachNam.ngayKy = this.formData.get('ngayKy').value;
    this.thongTinChiTieuKeHoachNam.ngayHieuLuc =
      this.formData.get('ngayHieuLuc').value;
    this.thongTinChiTieuKeHoachNam.namKeHoach =
      this.formData.get('namKeHoach').value;
    this.thongTinChiTieuKeHoachNam.trichYeu =
      this.formData.get('trichYeu').value;

    if (this.thongTinChiTieuKeHoachNam.id > 0) {
      this.chiTieuKeHoachNamService
        .chinhSuaChiTieuKeHoach(this.thongTinChiTieuKeHoachNam)
        .then((res) => {
          console.log(res);
        })
        .catch((e) => {
          console.error('error: ', e);
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        })
        .finally(() => {
          this.spinner.hide();
        });
    } else {
      this.thongTinChiTieuKeHoachNam.id = 0;
      this.thongTinChiTieuKeHoachNam.soQuyetDinh = `${this.thongTinChiTieuKeHoachNam.soQuyetDinh}${MESSAGE.QD_TCDT}`;
      this.chiTieuKeHoachNamService
        .themMoiChiTieuKeHoach(this.thongTinChiTieuKeHoachNam)
        .then((res) => {
          console.log(res);
        })
        .catch((e) => {
          console.error('error: ', e);
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        })
        .finally(() => {
          this.spinner.hide();
        });
    }
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
}
