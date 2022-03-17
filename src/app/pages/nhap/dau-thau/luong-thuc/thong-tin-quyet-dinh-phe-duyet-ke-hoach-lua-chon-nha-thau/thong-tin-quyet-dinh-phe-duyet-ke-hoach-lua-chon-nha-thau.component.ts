import {
  Component,
  OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { DialogPhuongAnTrinhTongCucComponent } from 'src/app/components/dialog/dialog-phuong-an-trinh-tong-cuc/dialog-phuong-an-trinh-tong-cuc.component';
import { DialogQuyetDinhGiaoChiTieuComponent } from 'src/app/components/dialog/dialog-quyet-dinh-giao-chi-tieu/dialog-quyet-dinh-giao-chi-tieu.component';
import { VatTu } from 'src/app/components/dialog/dialog-them-thong-tin-vat-tu-trong-nam/danh-sach-vat-tu-hang-hoa.type';
import { DialogThongTinPhuLucQuyetDinhPheDuyetComponent } from 'src/app/components/dialog/dialog-thong-tin-phu-luc-quyet-dinh-phe-duyet/dialog-thong-tin-phu-luc-quyet-dinh-phe-duyet.component';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { ThongTinQuyetDinhPheDuyetKHLCNT } from 'src/app/models/ThongTinQuyetDinhPheDuyetKHLCNT';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { QuyetDinhPheDuyetKeHoachLCNTService } from 'src/app/services/quyetDinhPheDuyetKeHoachLCNT.service';

@Component({
  selector: 'thong-tin-quyet-dinh-phe-duyet-ke-hoach-lua-chon-nha-thau',
  templateUrl: './thong-tin-quyet-dinh-phe-duyet-ke-hoach-lua-chon-nha-thau.component.html',
  styleUrls: ['./thong-tin-quyet-dinh-phe-duyet-ke-hoach-lua-chon-nha-thau.component.scss'],
})
export class ThongTinQuyetDinhPheDuyetKeHoachLuaChonNhaThauComponent implements OnInit {
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = false;
  formData: FormGroup;
  editId: string | null = null;
  chiTiet: ThongTinQuyetDinhPheDuyetKHLCNT = new ThongTinQuyetDinhPheDuyetKHLCNT();
  id: number;
  selectedCanCu: any = {};
  selectedPhuongAn: any = {};

  listOfMapData: VatTu[];
  listOfMapDataClone: VatTu[];
  mapOfExpandedData: { [key: string]: VatTu[] } = {};
  selectHang: any = { ten: "" };
  errorInputRequired: string = null;
  errorGhiChu: boolean = false;

  listPhuongThucDauThau: any[] = [];
  listNguonVon: any[] = [];
  listHinhThucDauThau: any[] = [];
  listLoaiHopDong: any[] = [];

  constructor(
    private router: Router,
    private modal: NzModalService,
    private routerActive: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private danhMucService: DanhMucService,
    private quyetDinhPheDuyetKeHoachLCNTService: QuyetDinhPheDuyetKeHoachLCNTService,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.errorInputRequired = MESSAGE.ERROR_NOT_EMPTY;
      this.isVisibleChangeTab$.subscribe((value: boolean) => {
        this.visibleTab = value;
      });
      this.chiTiet.children1 = [];
      this.id = +this.routerActive.snapshot.paramMap.get('id');
      await Promise.all([
        this.loadDanhMucHang(),
        this.phuongThucDauThauGetAll(),
        this.nguonVonGetAll(),
        this.hinhThucDauThauGetAll(),
        this.loaiHopDongGetAll(),
        this.loadChiTiet(this.id),
      ]);
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  openDialogQuyetDinhGiaoChiTieu() {
    const modalQD = this.modal.create({
      nzTitle: 'Thông tin QĐ giao chỉ tiêu kế hoạch',
      nzContent: DialogQuyetDinhGiaoChiTieuComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
      },
    });
    modalQD.afterClose.subscribe((data) => {
      if (data) {
        this.selectedCanCu = data;
      }
    });
  }

  openDialogPhuongAnTrinhTongCuc() {
    const modalQD = this.modal.create({
      nzTitle: 'Thông tin phương án trình tổng cục',
      nzContent: DialogPhuongAnTrinhTongCucComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
      },
    });
    modalQD.afterClose.subscribe((data) => {
      if (data) {
        this.selectedPhuongAn = data;
      }
    });
  }

  displayDialogPhuLuc(data: any): void {
    this.modal.create({
      nzTitle: 'Thông tin phụ lục KH LNCT cho các Cục DTNN KV',
      nzContent: DialogThongTinPhuLucQuyetDinhPheDuyetComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        data: data
      },
    });
  }

  layThongTinPhuongAn() {
    if (this.selectedPhuongAn) {
      this.chiTiet.children = this.selectedPhuongAn.children;
      this.chiTiet.children1 = this.selectedPhuongAn.children1;
      this.chiTiet.hthucLcnt = this.selectedPhuongAn.hthucLcnt;
      this.chiTiet.idPaHdr = this.selectedPhuongAn.id;
      this.chiTiet.loaiHdong = this.selectedPhuongAn.loaiHdong;
      this.chiTiet.loaiVthh = this.selectedPhuongAn.loaiVthh;
      this.chiTiet.namKhoach = this.selectedPhuongAn.namKhoach;
      this.chiTiet.ngayTao = this.selectedPhuongAn.ngayTao;
      this.chiTiet.nguoiTao = this.selectedPhuongAn.nguoiTao;
      this.chiTiet.nguonVon = this.selectedPhuongAn.nguonVon;
      this.chiTiet.pthucLcnt = this.selectedPhuongAn.pthucLcnt;
      this.chiTiet.tgianDthau = this.selectedPhuongAn.tgianDthau;
      this.chiTiet.tgianMthau = this.selectedPhuongAn.tgianMthau;
      this.chiTiet.tgianNhang = this.selectedPhuongAn.tgianNhang;
      this.chiTiet.tgianTbao = this.selectedPhuongAn.tgianTbao;
      this.chiTiet.veViec = this.selectedPhuongAn.veViec;
      this.selectHang.ten = this.selectedPhuongAn.tenLoaiVthh;
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

  async phuongThucDauThauGetAll() {
    this.listPhuongThucDauThau = [];
    let res = await this.danhMucService.phuongThucDauThauGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listPhuongThucDauThau = res.data;
    }
  }

  async nguonVonGetAll() {
    this.listNguonVon = [];
    let res = await this.danhMucService.nguonVonGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listNguonVon = res.data;
    }
  }

  async hinhThucDauThauGetAll() {
    this.listHinhThucDauThau = [];
    let res = await this.danhMucService.hinhThucDauThauGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listHinhThucDauThau = res.data;
    }
  }

  async loaiHopDongGetAll() {
    this.listLoaiHopDong = [];
    let res = await this.danhMucService.loaiHopDongGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiHopDong = res.data;
    }
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
    this.chiTiet.loaiVthh = this.selectHang.ma
  }

  async loadChiTiet(id: number) {
    if (id > 0) {
      let res = await this.quyetDinhPheDuyetKeHoachLCNTService.chiTiet(id);
      if (res.msg == MESSAGE.SUCCESS) {
        this.chiTiet = res.data;
      }
    }
  }

  back() {
    this.router.navigate([`/nhap/dau-thau/quyet-dinh-phe-duyet-ke-hoach-lua-chon-nha-thau`])
  }

  async save() {
    if (this.chiTiet.ghiChu && this.chiTiet.ghiChu != '') {
      this.spinner.show();
      try {
        let detail = [];
        detail = [...this.chiTiet.children1];
        for (let i = 0; i < detail.length; i++) {
          if (detail[i] && detail[i].children) {
            let detailChild = detail[i].children;
            delete detail[i].children;
            detail[i].detail = detailChild;
          }
        }
        let body = {
          "blanhDthau": null,
          "detail": detail,
          "fileDinhKems": this.chiTiet.children,
          "ghiChu": this.chiTiet.ghiChu,
          "hthucLcnt": this.chiTiet.hthucLcnt,
          "id": this.id,
          "idPaHdr": this.chiTiet.idPaHdr,
          "loaiHdong": this.chiTiet.loaiHdong,
          "loaiVthh": this.chiTiet.loaiVthh ?? "00",
          "namKhoach": this.chiTiet.namKhoach,
          "ngayQd": this.chiTiet.ngayQd ? dayjs(this.chiTiet.ngayQd).format("YYYY-MM-DD") : null,
          "nguonVon": this.chiTiet.nguonVon,
          "pthucLcnt": this.chiTiet.pthucLcnt,
          "soQd": this.chiTiet.soQd,
          "tgianDthau": this.chiTiet.tgianDthau ? dayjs(this.chiTiet.tgianDthau).format("YYYY-MM-DD") : null,
          "tgianMthau": this.chiTiet.tgianMthau ? dayjs(this.chiTiet.tgianMthau).format("YYYY-MM-DD") : null,
          "tgianNhang": this.chiTiet.tgianNhang ? dayjs(this.chiTiet.tgianNhang).format("YYYY-MM-DD") : null,
          "tgianTbao": this.chiTiet.tgianTbao ? dayjs(this.chiTiet.tgianTbao).format("YYYY-MM-DD") : null,
          "veViec": this.chiTiet.veViec
        }
        if (this.id == 0) {
          let res = await this.quyetDinhPheDuyetKeHoachLCNTService.create(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
            this.back();
          }
          else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        }
        else {
          let res = await this.quyetDinhPheDuyetKeHoachLCNTService.update(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.back();
          }
          else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        }
        this.spinner.hide();
      } catch (e) {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    }
    else {
      this.errorGhiChu = true;
    }
  }

  validateGhiChu(e: Event) {
    if (this.chiTiet.ghiChu && this.chiTiet.ghiChu != '') {
      this.errorGhiChu = false;
    }
    else {
      this.errorGhiChu = true;
    }
  }

  async trinhDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn trình duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            "id": this.id,
            "lyDo": null,
            "trangThai": "01"
          }
          await this.quyetDinhPheDuyetKeHoachLCNTService.updateStatus(body);
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.TRINH_DUYET_SUCCESS);
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }
}
