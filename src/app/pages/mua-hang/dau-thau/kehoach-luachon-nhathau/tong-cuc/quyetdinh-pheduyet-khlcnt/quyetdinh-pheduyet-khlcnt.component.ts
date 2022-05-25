import { saveAs } from 'file-saver';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { VatTu } from 'src/app/components/dialog/dialog-them-thong-tin-vat-tu-trong-nam/danh-sach-vat-tu-hang-hoa.type';
import { LEVEL, LIST_VAT_TU_HANG_HOA, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { QuyetDinhPheDuyetKeHoachLCNTService } from 'src/app/services/quyetDinhPheDuyetKeHoachLCNT.service';
import { UserLogin } from 'src/app/models/userlogin';
import { UserService } from 'src/app/services/user.service';
import { convertVthhToId } from 'src/app/shared/commonFunction';

@Component({
  selector: 'app-quyetdinh-pheduyet-khlcnt',
  templateUrl: './quyetdinh-pheduyet-khlcnt.component.html',
  styleUrls: ['./quyetdinh-pheduyet-khlcnt.component.scss']
})
export class QuyetdinhPheduyetKhlcntComponent implements OnInit {
  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
  yearNow = dayjs().get('year');
  searchFilter = {
    soQD: null,
    namKh: dayjs().get('year'),
    soQdinh: null,
    ngayTongHop: null,
    loaiVthh: null,
  };
  listVthh: any;
  listNam: any[] = [];
  startValue: Date | null = null;
  endValue: Date | null = null;
  //phê duyệt
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];
  //chưa phê quyệt
  pageNo: number = 1;
  pageSizeNo: number = PAGE_SIZE_DEFAULT;
  totalRecordNo: number = 0;
  dataTableNo: any[] = [];

  tabSelected: string = 'phuong-an-phe-duyet';
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = false;
  listOfMapData: VatTu[];
  listOfMapDataClone: VatTu[];
  mapOfExpandedData: { [key: string]: VatTu[] } = {};
  selectHang: any = { ten: "" };

  lastBreadcrumb: string;
  userInfo: UserLogin;

  selectedTab: string = 'phe-duyet';

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    private danhMucService: DanhMucService,
    private quyetDinhPheDuyetKeHoachLCNTService: QuyetDinhPheDuyetKeHoachLCNTService,
    private userService: UserService,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.listVthh = LIST_VAT_TU_HANG_HOA;
      this.userInfo = this.userService.getUserLogin();
      this.getTitleVthh();
      this.isVisibleChangeTab$.subscribe((value: boolean) => {
        this.visibleTab = value;
      });
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: this.yearNow - i,
          text: this.yearNow - i,
        });
      }
      this.loadDanhMucHang();
      await this.search();
      this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  loadDanhMucHang() {
    this.danhMucService.loadDanhMucHangHoa().subscribe((hangHoa) => {
      if (hangHoa.msg == MESSAGE.SUCCESS) {
        this.listOfMapData = hangHoa.data;
        this.listOfMapDataClone = [...this.listOfMapData];
        this.listOfMapData.forEach((item) => {
          this.mapOfExpandedData[item.id] = this.convertTreeToList(item);
        });
      }
    });
  }

  themMoi() {
    let loatVthh = this.router.url.split('/')[4]
    this.router.navigate(['/mua-hang/dau-thau/kehoach-luachon-nhathau/' + loatVthh + '/phe-duyet/them-moi']);
  }

  convertTreeToList(root: VatTu): VatTu[] {
    const stack: VatTu[] = [];
    const array: VatTu[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: false });
    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.child) {
        for (let i = node.child.length - 1; i >= 0; i--) {
          stack.push({
            ...node.child[i],
            level: node.level! + 1,
            expand: false,
            parent: node,
          });
        }
      }
    }
    return array;
  }

  visitNode(
    node: VatTu,
    hashMap: { [id: string]: boolean },
    array: VatTu[],
  ): void {
    if (!hashMap[node.id]) {
      hashMap[node.id] = true;
      array.push(node);
    }
  }

  collapse(array: VatTu[], data: VatTu, $event: boolean): void {
    if (!$event) {
      if (data.child) {
        data.child.forEach((d) => {
          const target = array.find((a) => a.id === d.id)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  getTitleVthh() {
    let loatVthh = this.router.url.split('/')[4]
    this.searchFilter.loaiVthh = convertVthhToId(loatVthh);
  }

  searchHangHoa(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.listOfMapData = this.listOfMapDataClone;
    } else {
      this.listOfMapData = this.listOfMapDataClone.filter(
        (x) => x.ten.toLowerCase().indexOf(value.toLowerCase()) != -1,
      );
    }
  }

  selectHangHoa(vatTu: any) {
    this.selectHang = vatTu;
  }

  clearFilter() {
    // this.searchFilter = {
    //   soQD: null,
    //   namKeHoach: this.yearNow
    // };
    this.startValue = null;
    this.endValue = null;
    this.selectHang = { ten: "" };
  }

  async selectTabData(tab: string) {
    this.spinner.show();
    try {
      this.tabSelected = tab;
      if (tab == 'phuong-an-phe-duyet') {
        await this.search();
      }
      else if (tab == 'phuong-an-chua-phe-duyet') {
        await this.search();
      }
      this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async search() {
    this.dataTable = [];
    //phê duyệt
    let param = {
      "denNgayQd": this.endValue
        ? dayjs(this.endValue).format('DD/MM/YYYY')
        : null,
      "loaiVthh": this.selectHang.ma ?? "00",
      "namKhoach": this.searchFilter.namKh,
      "paggingReq": {
        "limit": this.pageSize,
        "page": this.page
      },
      "soQd": this.searchFilter.soQD,
      "str": null,
      "trangThai": this.tabSelected == 'phuong-an-phe-duyet' ? '00' : '01',
      "tuNgayQd": this.startValue
        ? dayjs(this.startValue).format('DD/MM/YYYY')
        : null,
    }
    let res = await this.quyetDinhPheDuyetKeHoachLCNTService.timKiem(param);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      if (data && data.content && data.content.length > 0) {
        if (this.tabSelected == 'phuong-an-phe-duyet') {
          this.dataTable = data.content;
        } else {
          this.dataTableNo = data.content;
        }
        for (let i = 0; i < this.dataTable.length; i++) {
          if (this.dataTable[i].ngayQd) {
            this.dataTable[i].ngayQdStr = dayjs(this.dataTable[i].ngayQd).format('DD/MM/YYYY');
          }
          else {
            this.dataTable[i].ngayQdStr = "";
          }
        }
      }
      this.totalRecord = data.totalElements;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async changePageIndex(event) {
    this.spinner.show();
    try {
      this.page = event;
      await this.search();
      this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async changePageSize(event) {
    this.spinner.show();
    try {
      this.pageSize = event;
      await this.search();
      this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  redirectToChiTiet(_) {

  }

  convertDay(ngayTao?) {

  }

  async changePageIndexNo(event) {
    this.spinner.show();
    try {
      this.pageNo = event;
      await this.search();
      this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async changePageSizeNo(event) {
    this.spinner.show();
    try {
      this.pageSizeNo = event;
      await this.search();
      this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.endValue) {
      return false;
    }
    return startValue.getTime() > this.endValue.getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.startValue) {
      return false;
    }
    return endValue.getTime() <= this.startValue.getTime();
  };

  handleStartOpenChange(open: boolean): void {
    if (!open) {
      this.endDatePicker.open();
    }
  }

  handleEndOpenChange(open: boolean): void {
    console.log('handleEndOpenChange', open);
  }

  redirectChiTiet(id: number) {
    this.router.navigate([
      '/nhap/dau-thau/quyet-dinh-phe-duyet-ke-hoach-lua-chon-nha-thau/thong-tin-quyet-dinh-phe-duyet-ke-hoach-lua-chon-nha-thau/',
      id,
    ]);
  }

  convertTrangThai(status: string) {
    if (status == '01') {
      return "Đã duyệt";
    }
    else {
      return "Chưa duyệt";
    }
  }

  xoaItem(item: any) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: MESSAGE.DELETE_CONFIRM,
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.spinner.show();
        try {
          let body = {
            "id": item.id,
            "maDvi": null
          }
          this.quyetDinhPheDuyetKeHoachLCNTService.xoa(body).then(async (res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              await this.search();
              this.notification.error(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
            }
            else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
            this.spinner.hide();
          });
        }
        catch (e) {
          console.log('error: ', e)
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          "denNgayQd": this.endValue
            ? dayjs(this.endValue).format('DD/MM/YYYY')
            : null,
          "loaiVthh": this.selectHang.ma ?? "00",
          "namKhoach": this.searchFilter.namKh,
          "paggingReq": null,
          "soQd": this.searchFilter.soQD,
          "str": null,
          "trangThai": "01",
          "tuNgayQd": this.startValue
            ? dayjs(this.startValue).format('DD/MM/YYYY')
            : null,
        }
        this.quyetDinhPheDuyetKeHoachLCNTService.exportList(body).subscribe(
          blob => saveAs(blob, 'danh-sach-quyet-dinh-phe-duyet-ke-hoach-lua-chon-nha-thau.xlsx')
        );
        this.spinner.hide();
      }
      catch (e) {
        console.log('error: ', e)
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    }
  }
}
