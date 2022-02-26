import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EMPTY_ID, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzFormatEmitEvent, NzTreeComponent } from 'ng-zorro-antd/tree';
import { MESSAGE } from 'src/app/constants/message';
import { OldResponseData } from 'src/app/interfaces/response';
import { DonviService } from 'src/app/services/donvi.service';
import { HelperService } from 'src/app/services/helper.service';
import { NguoiDungService } from 'src/app/services/nguoidung.service';
import { Router } from '@angular/router';
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
  selector: 'app-thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc',
  templateUrl: './thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc.component.html',
  styleUrls: ['./thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc.component.scss'],
})
export class ThongTinChiTieuKeHoachNamComponent implements OnInit {
  @ViewChild('nzTreeComponent', { static: false })
  nzTreeComponent!: NzTreeComponent;
  visible = false;
  nodes: any = [];
  nodeDetail: any;
  listDonViDuoi = [];
  cureentNodeParent: any = [];
  datasNguoiDung: any = [];
  nodeSelected: any = [];
  listHTDV: any = [];
  listKPB: any = [];
  detailDonVi: FormGroup;
  noParent = true;
  searchValue = '';
  ////////
  listOfData: DataItem[] = [];
  sortAgeFn = (a: DataItem, b: DataItem): number => a.age - b.age;
  nameFilterFn = (list: string[], item: DataItem): boolean =>
    list.some((name) => item.name.indexOf(name) !== -1);
  filterName = [
    { text: 'Joe', value: 'Joe' },
    { text: 'John', value: 'John' },
  ];
  /////////
  constructor(
    private fb: FormBuilder,
    private donviService: DonviService,
    private helperService: HelperService,
    private _modalService: NzModalService,
    private notification: NzNotificationService,
    private nguoidungService: NguoiDungService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    /////////
    const data = [];
    for (let i = 0; i < 100; i++) {
      data.push({
        name: 'John Brown',
        age: i + 1,
        street: 'Lake Park',
        building: 'C',
        number: 2035,
        companyAddress: 'Lake Street 42',
        companyName: 'SoftLake Co',
        gender: 'M',
      });
    }
    this.listOfData = data;
    //////////////
    this.initForm();
    this.layTatCaDonViTheoTree();
    this.layDonViPhongBan();
  }

  layDonViPhongBan() {
    this.helperService
      .initDMChung('hinhthucdonvi;kieuphongban')
      .then((res: OldResponseData) => {
        if (res.success && res.data) {
          this.listHTDV = res.data.hinhthucdonvi;
          this.listKPB = res.data.kieuphongban;
        } else {
          this.notification.error(MESSAGE.ERROR, res.error);
        }
      });
  }

  showDetailDonVi(id?: any) {
    if (id) {
      this.danhSachNguoiDung(id);

      this.donviService.TimTheoId(id).then((res: OldResponseData) => {
        if (res.success) {
          this.nodeDetail = res.data;
          if (res.data.parentId == '00000000-0000-0000-0000-000000000000') {
            this.nodeDetail.parentId = null;
          }
          // gán giá trị vào form
          this.detailDonVi.patchValue({
            name: res.data.name,
            code: res.data.code,
            nameShort: res.data.nameShort,
            fax: res.data.fax,
            nameEng: res.data.nameEng,
            address: res.data.address,
            taxCode: res.data.taxCode,
            phoneNumber: res.data.phoneNumber,
            email: res.data.email,
            parentId: res.data.parentId,
            // identifyCode: res.data.identifyCode,
            isActive: res.data.isActive,
            index: res.data.index,
            deptType: String(res.data.deptType),
            type: String(res.data.type),
          });
        } else {
          this.notification.error(MESSAGE.ERROR, res.error);
        }
      });
    }
  }

  initForm() {
    this.detailDonVi = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      deptType: ['0', Validators.required],
      nameShort: [''],
      fax: [''],
      nameEng: [''],
      address: [''],
      taxCode: ['', Validators.required],
      phoneNumber: [''],
      email: [''],
      parentId: [''],
      type: ['0', Validators.required],
      // identifyCode: [''],
      isActive: [true],
      index: [],
    });
  }

  /**
   * bắt đầu sử lý phân trang
   */
  pageNguoiDung: number = 1;
  pageSizeNguoiDung: number = PAGE_SIZE_DEFAULT;
  totalRecordNguoiDung: number = 0;
  changePageSizeNguoiDung(event) {
    this.pageSizeNguoiDung = event;
    this.danhSachNguoiDung(this.cureentNodeParent);
  }
  changePageIndexNguoiDung(event) {
    this.pageNguoiDung = event;
    this.danhSachNguoiDung(this.cureentNodeParent);
  }

  pageDonVi: number = 1;
  pageSizeDonVi: number = PAGE_SIZE_DEFAULT;
  totalRecordDonVi: number = 0;
  changePageSizeDonVi(event) {
    this.pageSizeDonVi = event;
    this.showDetailDonVi(this.nodeSelected);
  }
  changePageIndexDonVi(event) {
    this.pageDonVi = event;
    this.showDetailDonVi(this.nodeSelected);
  }

  /**
   * kết thúc sử lý phân trang
   */

  /**
   * call api init
   */

  layTatCaDonViTheoTree() {
    this.donviService.layDonViTheoUser().then((res: OldResponseData) => {
      if (res.success) {
        this.nodes = res.data;
        //  lúc đầu mắc định lấy node gốc to nhất
        this.nodeSelected = this.nodes[0].key;

        // lấy detail đon vị hiện tại
        this.showDetailDonVi(res.data[0].key);
      } else {
        this.notification.error(MESSAGE.ERROR, res.error);
      }
    });
  }

  danhSachNguoiDung(DepartmentId) {
    let body = {
      page: this.pageNguoiDung,
      pageSize: this.pageSizeNguoiDung,
      searchKey: '',
      searchUnitId: '',
      searchDepartmentId: DepartmentId,
      searchPositionId: '',
      searchPhone: '',
    };

    this.nguoidungService.danhSach(body).subscribe((res: OldResponseData) => {
      if (res.success) {
        this.datasNguoiDung = res.data;
        this.totalRecordNguoiDung = res.totalRecord;
      } else {
        this.notification.error(MESSAGE.ERROR, res.error);
      }
    });
  }

  /**
   * Xử lý tree
   *
   */
  parentNodeSelected: any = [];
  nzClickNodeTree(event: any): void {
    if (event.keys.length > 0) {
      this.nodeSelected = event.keys[0];
      // this.selectedKeys = event.node.origin.data;
      this.parentNodeSelected = event?.parentNode?.origin;
      this.showDetailDonVi(event.keys[0]);
    }
  }

  nzCheck(event: NzFormatEmitEvent): void {
    // this.nodeSelected = event.keys[0];
    // this.selectedKeys = event.node.origin.data;
    // this.showDetailDonVi()
  }

  /**
   * thêm sửa mới nhóm quyền
   */

  themmoi(data?) {
    // var nodesTree = this.nodes;
    // var cureentNodeParent = this.cureentNodeParent;
    // let modal = this._modalService.create({
    //   nzTitle: 'Thêm mới đơn vị',
    //   nzContent: NewDonViComponent,
    //   nzClosable: true,
    //   nzFooter: null,
    //   nzStyle: { top: '50px' },
    //   nzWidth: 600,
    //   nzComponentParams: { data, nodesTree, cureentNodeParent },
    // });
    // modal.afterClose.subscribe((res) => {
    //   if (res) {
    //     this.layTatCaDonViTheoTree();
    //   }
    // });
  }

  /**
   * xoa đơn vị
   */

  xoa() {
    this._modalService.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.donviService
          .delete(
            this.nodeSelected?.id == undefined
              ? this.nodeSelected
              : this.nodeSelected?.id,
          )
          .then((res: OldResponseData) => {
            if (res.success) {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.DELETE_SUCCESS,
              );
              // xét node về không
              this.nodeSelected = [];
              this.layTatCaDonViTheoTree();
            } else {
              this.notification.error(MESSAGE.ERROR, res.error);
            }
          });
      },
    });
  }

  sua() {
    this.helperService.markFormGroupTouched(this.detailDonVi);
    if (this.detailDonVi.invalid) {
      return;
    }
    let body = {
      ...this.detailDonVi.value,
      id: this.nodeSelected,
      deptType: Number(this.detailDonVi.value.deptType),
      type: Number(this.detailDonVi.value.type),
    };
    this._modalService.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn sửa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.donviService.update(body).then((res: OldResponseData) => {
          if (res.success) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            // this.layTatCaDonViTheoTree()
          } else {
            this.notification.error(MESSAGE.ERROR, res.error);
          }
        });
      },
    });
  }
  redirectChiTieuKeHoachNam() {
    this.router.navigate(['/kehoach/chi-tieu-ke-hoach-nam-cap-tong-cuc']);
  }
}
