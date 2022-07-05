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
import { UserLogin } from 'src/app/models/userlogin';
import { UserService } from 'src/app/services/user.service';
import { isEmpty } from 'lodash';
import { DANH_MUC_LEVEL } from '../../../luu-kho.constant';
import { MESSAGE } from 'src/app/constants/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-hang-trong-kho-theo-loai',
  templateUrl: './hang-trong-kho-theo-loai.component.html',
  styleUrls: ['./hang-trong-kho-theo-loai.component.scss'],
})
export class HangTrongKhoTheoLoaiComponent implements OnInit, OnChanges {
  @Input('idLoaiVthh') idLoaiVthh: string;
  userInfo: UserLogin;
  detail: any = {};
  dsTong;
  dsLoaiHangHoa = [];
  dsChungLoaiHangHoa = [];
  dsCuc = [];
  dsChiCuc = [];
  dsChiCucDataSource = [];
  dsNhaKho = [];
  dsNganKho = [];
  dsNganLo = [];
  formData: FormGroup;
  errorMessage = '';
  searchInTable: any = {
    donVi: null,
    chungLoaiHH: null,
    tonDauKy: null,
    nhapTrongKy: null,
    xuatTrongKy: null,
    tonCuoiKy: null,
    donViTinh: null,
  };

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
    private readonly userService: UserService,
    private readonly notification: NzNotificationService,
    public treeTableService: TreeTableService<HangTrongKhoRowItem>,
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.spinner.show();
      this.initForm();
      await this.initData();
      this.dataExample.forEach((item) => {
        this.mapOfExpandedData[item.id] =
          this.treeTableService.convertTreeToList(item);
      });
      this.dataTable = [...this.dataExample];
    } catch (error) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
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

  async initData() {
    this.userInfo = this.userService.getUserLogin();
    this.detail.maDvi = this.userInfo.MA_DVI;
    this.detail.tenDvi = this.userInfo.TEN_DVI;
    await this.loadDsTong();
  }

  async loadDsTong() {
    const body = {
      maDviCha: this.detail.maDvi,
      trangThai: '01',
    };

    const dsTong = await this.donviService.layDonViTheoCapDo(body);
    if (!isEmpty(dsTong)) {
      this.dsTong = dsTong;
      this.dsCuc = dsTong[DANH_MUC_LEVEL.CUC];
      // this.dsChiCuc = dsTong[DANH_MUC_LEVEL.CHI_CUC];
      // this.dsChiCucDataSource = dsTong[DANH_MUC_LEVEL.CHI_CUC].map(
      //   (item) => item.tenDvi,
      // );
      // this.dsNganKho = dsTong[DANH_MUC_LEVEL.NGAN_KHO];
      // this.dsNhaKho = dsTong[DANH_MUC_LEVEL.NHA_KHO];
      // this.dsNganLo = dsTong[DANH_MUC_LEVEL.NGAN_LO];
    }
  }

  onChangeCuc(id) {
    const cuc = this.dsCuc.find((item) => item.id === Number(id));
    this.formData.get('idChiCuc').setValue(null);
    this.formData.get('idNhaKho').setValue(null);
    this.formData.get('idNganKho').setValue(null);
    this.formData.get('idLoKho').setValue(null);

    if (cuc) {
      const result = {
        ...this.donviService.layDsPhanTuCon(this.dsTong, cuc),
      };
      this.dsChiCuc = result[DANH_MUC_LEVEL.CHI_CUC];
    } else {
      this.dsChiCuc = [];
    }
  }

  onChangeChiCuc(id) {
    const chiCuc = this.dsChiCuc.find((item) => item.id === Number(id));
    this.formData.get('idNhaKho').setValue(null);
    this.formData.get('idNganKho').setValue(null);
    this.formData.get('idLoKho').setValue(null);
    if (chiCuc) {
      const result = {
        ...this.donviService.layDsPhanTuCon(this.dsTong, chiCuc),
      };
      this.dsNhaKho = result[DANH_MUC_LEVEL.NHA_KHO];
    } else {
      this.dsNhaKho = [];
    }
  }

  onChangeNhaKho(id) {
    const nhaKho = this.dsNhaKho.find((item) => item.id === Number(id));
    this.formData.get('idNganKho').setValue(null);
    this.formData.get('idLoKho').setValue(null);
    if (nhaKho) {
      const result = {
        ...this.donviService.layDsPhanTuCon(this.dsTong, nhaKho),
      };
      this.dsNganKho = result[DANH_MUC_LEVEL.NGAN_KHO];
    } else {
      this.dsNganKho = [];
    }
  }

  onChangeNganKho(id) {
    const nganKho = this.dsNganKho.find((item) => item.id === Number(id));
    this.formData.get('idLoKho').setValue(null);
    if (nganKho) {
      const result = {
        ...this.donviService.layDsPhanTuCon(this.dsTong, nganKho),
      };
      this.dsNganLo = result[DANH_MUC_LEVEL.NGAN_LO];
    } else {
      this.dsNganLo = [];
    }
  }

  onChangeAutoComplete(e) {
    const value = (e.target as HTMLInputElement).value;
    if (value) {
      this.dsChiCucDataSource = this.dsChiCuc
        .filter((item) =>
          item?.tenDvi?.toLowerCase()?.includes(value.toLowerCase()),
        )
        .map((item) => item.tenDvi);
    } else {
      this.dsChiCucDataSource = this.dsChiCuc.map((item) => item.tenDvi);
    }
  }

  search() {}

  clearFilter() {
    this.formData.reset();
  }

  changePageIndex(event) {}

  changePageSize(event) {}

  viewDetail(data: HangTrongKhoRowItem) {}

  exportData() {}
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
