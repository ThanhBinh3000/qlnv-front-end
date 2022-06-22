import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { TreeTableService } from 'src/app/services/tree-table.service';
import { DonviService } from '../../../../../services/donvi.service';
import { DanhMucService } from '../../../../../services/danhmuc.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-hang-trong-kho-theo-loai',
  templateUrl: './hang-trong-kho-theo-loai.component.html',
  styleUrls: ['./hang-trong-kho-theo-loai.component.scss'],
})
export class HangTrongKhoTheoLoaiComponent implements OnInit, OnChanges {
  @Input('idLoaiVthh') idLoaiVthh: string;
  dsLoaiHangHoa: ISelectOptionItem[] = [];
  dsChungLoaiHangHoa: ISelectOptionItem[] = [];
  dsCuc: ISelectOptionItem[] = [];
  dsChiCuc: ISelectOptionItem[] = [];
  dsNhaKho: ISelectOptionItem[] = [];
  dsNganKho: ISelectOptionItem[] = [];
  dsLoKho: ISelectOptionItem[] = [];
  formData: FormGroup;
  errorMessage = '';
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 10;
  dataTable: any[] = [];

  dataExample: HangTrongKhoRowItem[] = [
    {
      id: 1,
      tenDonVi: 'test 1',
      chungLoaiHH: 'test 2',
      tonKhoDauKy: 1000,
      nhapTrongKy: 1000,
      xuatTrongKy: 1000,
      tonKhoCuoiKy: 1000,
      donViTinh: 'kg',
      child: [
        {
          id: 1.1,
          tenDonVi: 'test 1.1',
          chungLoaiHH: 'test 2',
          tonKhoDauKy: 1000,
          nhapTrongKy: 1000,
          xuatTrongKy: 1000,
          tonKhoCuoiKy: 1000,
          donViTinh: 'kg',
          child: [
            {
              id: 1.11,
              tenDonVi: 'test 1.1.1',
              chungLoaiHH: 'test 2',
              tonKhoDauKy: 1000,
              nhapTrongKy: 1000,
              xuatTrongKy: 1000,
              tonKhoCuoiKy: 1000,
              donViTinh: 'kg',
            },
          ],
        },
        {
          id: 1.2,
          tenDonVi: 'test 1.2',
          chungLoaiHH: 'test 2',
          tonKhoDauKy: 1000,
          nhapTrongKy: 1000,
          xuatTrongKy: 1000,
          tonKhoCuoiKy: 1000,
          donViTinh: 'kg',
          child: [
            {
              id: 1.21,
              tenDonVi: 'test 1.2.1',
              chungLoaiHH: 'test 2',
              tonKhoDauKy: 1000,
              nhapTrongKy: 1000,
              xuatTrongKy: 1000,
              tonKhoCuoiKy: 1000,
              donViTinh: 'kg',
            },
            {
              id: 1.22,
              tenDonVi: 'test 1.2.2',
              chungLoaiHH: 'test 2',
              tonKhoDauKy: 1000,
              nhapTrongKy: 1000,
              xuatTrongKy: 1000,
              tonKhoCuoiKy: 1000,
              donViTinh: 'kg',
              child: [
                {
                  id: 1.221,
                  tenDonVi: 'test 1.2.2.1',
                  chungLoaiHH: 'test 2',
                  tonKhoDauKy: 1000,
                  nhapTrongKy: 1000,
                  xuatTrongKy: 1000,
                  tonKhoCuoiKy: 1000,
                  donViTinh: 'kg',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 1,
      tenDonVi: 'test 1',
      chungLoaiHH: 'test 2',
      tonKhoDauKy: 1000,
      nhapTrongKy: 1000,
      xuatTrongKy: 1000,
      tonKhoCuoiKy: 1000,
      donViTinh: 'kg',
      child: [
        {
          id: 1.1,
          tenDonVi: 'test 1.1',
          chungLoaiHH: 'test 2',
          tonKhoDauKy: 1000,
          nhapTrongKy: 1000,
          xuatTrongKy: 1000,
          tonKhoCuoiKy: 1000,
          donViTinh: 'kg',
          child: [
            {
              id: 1.11,
              tenDonVi: 'test 1.1.1',
              chungLoaiHH: 'test 2',
              tonKhoDauKy: 1000,
              nhapTrongKy: 1000,
              xuatTrongKy: 1000,
              tonKhoCuoiKy: 1000,
              donViTinh: 'kg',
            },
          ],
        },
        {
          id: 1.2,
          tenDonVi: 'test 1.2',
          chungLoaiHH: 'test 2',
          tonKhoDauKy: 1000,
          nhapTrongKy: 1000,
          xuatTrongKy: 1000,
          tonKhoCuoiKy: 1000,
          donViTinh: 'kg',
          child: [
            {
              id: 1.21,
              tenDonVi: 'test 1.2.1',
              chungLoaiHH: 'test 2',
              tonKhoDauKy: 1000,
              nhapTrongKy: 1000,
              xuatTrongKy: 1000,
              tonKhoCuoiKy: 1000,
              donViTinh: 'kg',
            },
            {
              id: 1.22,
              tenDonVi: 'test 1.2.2',
              chungLoaiHH: 'test 2',
              tonKhoDauKy: 1000,
              nhapTrongKy: 1000,
              xuatTrongKy: 1000,
              tonKhoCuoiKy: 1000,
              donViTinh: 'kg',
              child: [
                {
                  id: 1.221,
                  tenDonVi: 'test 1.2.2.1',
                  chungLoaiHH: 'test 2',
                  tonKhoDauKy: 1000,
                  nhapTrongKy: 1000,
                  xuatTrongKy: 1000,
                  tonKhoCuoiKy: 1000,
                  donViTinh: 'kg',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 1,
      tenDonVi: 'test 1',
      chungLoaiHH: 'test 2',
      tonKhoDauKy: 1000,
      nhapTrongKy: 1000,
      xuatTrongKy: 1000,
      tonKhoCuoiKy: 1000,
      donViTinh: 'kg',
      child: [
        {
          id: 1.1,
          tenDonVi: 'test 1.1',
          chungLoaiHH: 'test 2',
          tonKhoDauKy: 1000,
          nhapTrongKy: 1000,
          xuatTrongKy: 1000,
          tonKhoCuoiKy: 1000,
          donViTinh: 'kg',
          child: [
            {
              id: 1.11,
              tenDonVi: 'test 1.1.1',
              chungLoaiHH: 'test 2',
              tonKhoDauKy: 1000,
              nhapTrongKy: 1000,
              xuatTrongKy: 1000,
              tonKhoCuoiKy: 1000,
              donViTinh: 'kg',
            },
          ],
        },
        {
          id: 1.2,
          tenDonVi: 'test 1.2',
          chungLoaiHH: 'test 2',
          tonKhoDauKy: 1000,
          nhapTrongKy: 1000,
          xuatTrongKy: 1000,
          tonKhoCuoiKy: 1000,
          donViTinh: 'kg',
          child: [
            {
              id: 1.21,
              tenDonVi: 'test 1.2.1',
              chungLoaiHH: 'test 2',
              tonKhoDauKy: 1000,
              nhapTrongKy: 1000,
              xuatTrongKy: 1000,
              tonKhoCuoiKy: 1000,
              donViTinh: 'kg',
            },
            {
              id: 1.22,
              tenDonVi: 'test 1.2.2',
              chungLoaiHH: 'test 2',
              tonKhoDauKy: 1000,
              nhapTrongKy: 1000,
              xuatTrongKy: 1000,
              tonKhoCuoiKy: 1000,
              donViTinh: 'kg',
              child: [
                {
                  id: 1.221,
                  tenDonVi: 'test 1.2.2.1',
                  chungLoaiHH: 'test 2',
                  tonKhoDauKy: 1000,
                  nhapTrongKy: 1000,
                  xuatTrongKy: 1000,
                  tonKhoCuoiKy: 1000,
                  donViTinh: 'kg',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 1,
      tenDonVi: 'test 1',
      chungLoaiHH: 'test 2',
      tonKhoDauKy: 1000,
      nhapTrongKy: 1000,
      xuatTrongKy: 1000,
      tonKhoCuoiKy: 1000,
      donViTinh: 'kg',
      child: [
        {
          id: 1.1,
          tenDonVi: 'test 1.1',
          chungLoaiHH: 'test 2',
          tonKhoDauKy: 1000,
          nhapTrongKy: 1000,
          xuatTrongKy: 1000,
          tonKhoCuoiKy: 1000,
          donViTinh: 'kg',
          child: [
            {
              id: 1.11,
              tenDonVi: 'test 1.1.1',
              chungLoaiHH: 'test 2',
              tonKhoDauKy: 1000,
              nhapTrongKy: 1000,
              xuatTrongKy: 1000,
              tonKhoCuoiKy: 1000,
              donViTinh: 'kg',
            },
          ],
        },
        {
          id: 1.2,
          tenDonVi: 'test 1.2',
          chungLoaiHH: 'test 2',
          tonKhoDauKy: 1000,
          nhapTrongKy: 1000,
          xuatTrongKy: 1000,
          tonKhoCuoiKy: 1000,
          donViTinh: 'kg',
          child: [
            {
              id: 1.21,
              tenDonVi: 'test 1.2.1',
              chungLoaiHH: 'test 2',
              tonKhoDauKy: 1000,
              nhapTrongKy: 1000,
              xuatTrongKy: 1000,
              tonKhoCuoiKy: 1000,
              donViTinh: 'kg',
            },
            {
              id: 1.22,
              tenDonVi: 'test 1.2.2',
              chungLoaiHH: 'test 2',
              tonKhoDauKy: 1000,
              nhapTrongKy: 1000,
              xuatTrongKy: 1000,
              tonKhoCuoiKy: 1000,
              donViTinh: 'kg',
              child: [
                {
                  id: 1.221,
                  tenDonVi: 'test 1.2.2.1',
                  chungLoaiHH: 'test 2',
                  tonKhoDauKy: 1000,
                  nhapTrongKy: 1000,
                  xuatTrongKy: 1000,
                  tonKhoCuoiKy: 1000,
                  donViTinh: 'kg',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 1,
      tenDonVi: 'test 1',
      chungLoaiHH: 'test 2',
      tonKhoDauKy: 1000,
      nhapTrongKy: 1000,
      xuatTrongKy: 1000,
      tonKhoCuoiKy: 1000,
      donViTinh: 'kg',
      child: [
        {
          id: 1.1,
          tenDonVi: 'test 1.1',
          chungLoaiHH: 'test 2',
          tonKhoDauKy: 1000,
          nhapTrongKy: 1000,
          xuatTrongKy: 1000,
          tonKhoCuoiKy: 1000,
          donViTinh: 'kg',
          child: [
            {
              id: 1.11,
              tenDonVi: 'test 1.1.1',
              chungLoaiHH: 'test 2',
              tonKhoDauKy: 1000,
              nhapTrongKy: 1000,
              xuatTrongKy: 1000,
              tonKhoCuoiKy: 1000,
              donViTinh: 'kg',
            },
          ],
        },
        {
          id: 1.2,
          tenDonVi: 'test 1.2',
          chungLoaiHH: 'test 2',
          tonKhoDauKy: 1000,
          nhapTrongKy: 1000,
          xuatTrongKy: 1000,
          tonKhoCuoiKy: 1000,
          donViTinh: 'kg',
          child: [
            {
              id: 1.21,
              tenDonVi: 'test 1.2.1',
              chungLoaiHH: 'test 2',
              tonKhoDauKy: 1000,
              nhapTrongKy: 1000,
              xuatTrongKy: 1000,
              tonKhoCuoiKy: 1000,
              donViTinh: 'kg',
            },
            {
              id: 1.22,
              tenDonVi: 'test 1.2.2',
              chungLoaiHH: 'test 2',
              tonKhoDauKy: 1000,
              nhapTrongKy: 1000,
              xuatTrongKy: 1000,
              tonKhoCuoiKy: 1000,
              donViTinh: 'kg',
              child: [
                {
                  id: 1.221,
                  tenDonVi: 'test 1.2.2.1',
                  chungLoaiHH: 'test 2',
                  tonKhoDauKy: 1000,
                  nhapTrongKy: 1000,
                  xuatTrongKy: 1000,
                  tonKhoCuoiKy: 1000,
                  donViTinh: 'kg',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 1,
      tenDonVi: 'test 1',
      chungLoaiHH: 'test 2',
      tonKhoDauKy: 1000,
      nhapTrongKy: 1000,
      xuatTrongKy: 1000,
      tonKhoCuoiKy: 1000,
      donViTinh: 'kg',
      child: [
        {
          id: 1.1,
          tenDonVi: 'test 1.1',
          chungLoaiHH: 'test 2',
          tonKhoDauKy: 1000,
          nhapTrongKy: 1000,
          xuatTrongKy: 1000,
          tonKhoCuoiKy: 1000,
          donViTinh: 'kg',
          child: [
            {
              id: 1.11,
              tenDonVi: 'test 1.1.1',
              chungLoaiHH: 'test 2',
              tonKhoDauKy: 1000,
              nhapTrongKy: 1000,
              xuatTrongKy: 1000,
              tonKhoCuoiKy: 1000,
              donViTinh: 'kg',
            },
          ],
        },
        {
          id: 1.2,
          tenDonVi: 'test 1.2',
          chungLoaiHH: 'test 2',
          tonKhoDauKy: 1000,
          nhapTrongKy: 1000,
          xuatTrongKy: 1000,
          tonKhoCuoiKy: 1000,
          donViTinh: 'kg',
          child: [
            {
              id: 1.21,
              tenDonVi: 'test 1.2.1',
              chungLoaiHH: 'test 2',
              tonKhoDauKy: 1000,
              nhapTrongKy: 1000,
              xuatTrongKy: 1000,
              tonKhoCuoiKy: 1000,
              donViTinh: 'kg',
            },
            {
              id: 1.22,
              tenDonVi: 'test 1.2.2',
              chungLoaiHH: 'test 2',
              tonKhoDauKy: 1000,
              nhapTrongKy: 1000,
              xuatTrongKy: 1000,
              tonKhoCuoiKy: 1000,
              donViTinh: 'kg',
              child: [
                {
                  id: 1.221,
                  tenDonVi: 'test 1.2.2.1',
                  chungLoaiHH: 'test 2',
                  tonKhoDauKy: 1000,
                  nhapTrongKy: 1000,
                  xuatTrongKy: 1000,
                  tonKhoCuoiKy: 1000,
                  donViTinh: 'kg',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 1,
      tenDonVi: 'test 1',
      chungLoaiHH: 'test 2',
      tonKhoDauKy: 1000,
      nhapTrongKy: 1000,
      xuatTrongKy: 1000,
      tonKhoCuoiKy: 1000,
      donViTinh: 'kg',
      child: [
        {
          id: 1.1,
          tenDonVi: 'test 1.1',
          chungLoaiHH: 'test 2',
          tonKhoDauKy: 1000,
          nhapTrongKy: 1000,
          xuatTrongKy: 1000,
          tonKhoCuoiKy: 1000,
          donViTinh: 'kg',
          child: [
            {
              id: 1.11,
              tenDonVi: 'test 1.1.1',
              chungLoaiHH: 'test 2',
              tonKhoDauKy: 1000,
              nhapTrongKy: 1000,
              xuatTrongKy: 1000,
              tonKhoCuoiKy: 1000,
              donViTinh: 'kg',
            },
          ],
        },
        {
          id: 1.2,
          tenDonVi: 'test 1.2',
          chungLoaiHH: 'test 2',
          tonKhoDauKy: 1000,
          nhapTrongKy: 1000,
          xuatTrongKy: 1000,
          tonKhoCuoiKy: 1000,
          donViTinh: 'kg',
          child: [
            {
              id: 1.21,
              tenDonVi: 'test 1.2.1',
              chungLoaiHH: 'test 2',
              tonKhoDauKy: 1000,
              nhapTrongKy: 1000,
              xuatTrongKy: 1000,
              tonKhoCuoiKy: 1000,
              donViTinh: 'kg',
            },
            {
              id: 1.22,
              tenDonVi: 'test 1.2.2',
              chungLoaiHH: 'test 2',
              tonKhoDauKy: 1000,
              nhapTrongKy: 1000,
              xuatTrongKy: 1000,
              tonKhoCuoiKy: 1000,
              donViTinh: 'kg',
              child: [
                {
                  id: 1.221,
                  tenDonVi: 'test 1.2.2.1',
                  chungLoaiHH: 'test 2',
                  tonKhoDauKy: 1000,
                  nhapTrongKy: 1000,
                  xuatTrongKy: 1000,
                  tonKhoCuoiKy: 1000,
                  donViTinh: 'kg',
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  mapOfExpandedData: { [key: string]: HangTrongKhoRowItem[] } = {};

  constructor(
    private readonly fb: FormBuilder,
    private readonly tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    private readonly donviService: DonviService,
    private readonly danhMucService: DanhMucService,
    private readonly spinner: NgxSpinnerService,
    public treeTableService: TreeTableService<HangTrongKhoRowItem>,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.initForm();
    // this.initData();
    this.dataExample.forEach((item) => {
      this.mapOfExpandedData[item.id] =
        this.treeTableService.convertTreeToList(item);
    });
    this.dataTable = [...this.dataExample];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.idLoaiVthh.currentValue) {
      // Get list
    }
  }

  initForm(): void {
    this.formData = this.fb.group({
      idLoaiHH: [null],
      idChungLoaiHH: [null],
      idCuc: [null],
      idChiCuc: [null],
      idNhaKho: [null],
      idNganKho: [null],
      idLoKho: [null],
      ngay: [null],
    });
  }

  async initData(): Promise<void> {
    // this.spinner.show();
    const result = await Promise.all([
      this.danhMucService.loaiVatTuHangHoaGetAll(),
      this.donviService.layTatCaDonViCha(),
      this.donviService.layDonViChiCuc(),
      this.tinhTrangKhoHienThoiService.nhaKhoGetList({}),
      this.tinhTrangKhoHienThoiService.nganKhoGetList({}),
      this.tinhTrangKhoHienThoiService.nganLoGetList({}),
    ]);
    // this.spinner.hide();

    this.dsLoaiHangHoa = this.transformToSelectOptItem(
      result[0],
      'loaiHangHoa',
    );
    this.dsCuc = this.transformToSelectOptItem(result[1], 'cuc');
    this.dsChiCuc = this.transformToSelectOptItem(result[2], 'chiCuc');
    this.dsNhaKho = this.transformToSelectOptItem(result[3], 'nhaKHo');
    this.dsNganKho = this.transformToSelectOptItem(result[4], 'nganKho');
    this.dsLoKho = this.transformToSelectOptItem(result[5], 'loKho');
  }

  search() {}

  clearFilter() {}

  changePageIndex(event) {}

  changePageSize(event) {}

  viewDetail(data: HangTrongKhoRowItem) {}

  transformToSelectOptItem(
    data: any[],
    fieldName: string,
  ): ISelectOptionItem[] {
    return data?.map((item) => ({
      fieldName,
      id: item.id,
      giaTri: item.giaTri,
    }));
  }

  exportData() {}
}

interface ISelectOptionItem {
  id: number;
  giaTri: string;
  fieldName: string;
}

interface IHangTrongKho {
  id: number;
  child?: IHangTrongKho[];
  tenDonVi: string;
  chungLoaiHH: string;
  tonKhoDauKy: number;
  nhapTrongKy: number;
  xuatTrongKy: number;
  tonKhoCuoiKy: number;
  donViTinh: string;
}

interface ITreeTableItem {
  parent?: any;
  expand?: boolean;
  level?: number;
}

class HangTrongKhoRowItem implements IHangTrongKho, ITreeTableItem {
  parent?: HangTrongKhoRowItem;
  expand?: boolean;
  level?: number;
  id: number;
  child?: IHangTrongKho[];
  tenDonVi: string;
  chungLoaiHH: string;
  tonKhoDauKy: number;
  nhapTrongKy: number;
  xuatTrongKy: number;
  tonKhoCuoiKy: number;
  donViTinh: string;
}
