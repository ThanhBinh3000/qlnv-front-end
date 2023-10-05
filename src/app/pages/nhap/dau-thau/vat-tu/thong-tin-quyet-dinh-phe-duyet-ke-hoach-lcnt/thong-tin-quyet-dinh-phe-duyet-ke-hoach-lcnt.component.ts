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
import { QuyetDinhPheDuyetKeHoachLCNTService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/quyetDinhPheDuyetKeHoachLCNT.service';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { environment } from 'src/environments/environment';
import { ChiTietFile } from 'src/app/models/ChiTietFile';
import { DialogThongTinChiTietGoiThauComponent } from 'src/app/components/dialog/dialog-thong-tin-chi-tiet-goi-thau-vat-tu/dialog-thong-tin-chi-tiet-goi-thau-vat-tu.component';

@Component({
  selector: 'thong-tin-quyet-dinh-phe-duyet-ke-hoach-lcnt',
  templateUrl: './thong-tin-quyet-dinh-phe-duyet-ke-hoach-lcnt.component.html',
  styleUrls: ['./thong-tin-quyet-dinh-phe-duyet-ke-hoach-lcnt.component.scss'],
})
export class ThongTinQuyetDinhPheDuyetKeHoachLCNTComponent implements OnInit {
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = false;
  formData: FormGroup;
  editId: string | null = null;
  chiTiet: ThongTinQuyetDinhPheDuyetKHLCNT = new ThongTinQuyetDinhPheDuyetKHLCNT();
  id: number;
  selectedCanCu: any = {};
  selectedPhuongAn: any = {};
  listNam: any[] = [];
  yearNow = dayjs().get('year');

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
  listVatTuHangHoa: any[] = [];
  fileList: any[] = [];
  urlUploadFile: string = `${environment.SERVICE_API}/qlnv-gateway/qlnv-core/file/upload-attachment`

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
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: this.yearNow - i,
          text: this.yearNow - i,
        });
      }
      this.chiTiet.children1 = [];
      this.id = +this.routerActive.snapshot.paramMap.get('id');
      await Promise.all([
        this.loaiHangDTQGGetAll(),
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

  displayEditGoiThau(data: any): void {
    this.modal.create({
      nzTitle: 'cập nhật Thông tin chi tiết gói thầu',
      nzContent: DialogThongTinChiTietGoiThauComponent,
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
      if (this.chiTiet.children && this.chiTiet.children.length > 0) {
        this.getListFile(this.chiTiet.children);
      }
    }
  }

  getListFile(data: any) {
    if (!this.fileList) {
      this.fileList = [];
    }
    if (data && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        let item = {
          uid: 'fileOld_' + i.toString(),
          name: data[i].fileName,
          status: 'done',
          url: data[i].fileUrl,
          size: data[i].fileSize ? parseFloat(data[i].fileSize.replace('KB', '')) * 1024 : 0,
          id: data[i].id,
        };
        this.fileList.push(item);
      }
    }
  }

  handleChange(info: NzUploadChangeParam): void {
    if (info.file.status === 'done') {
      if (info.file.response) {
        let fileList = [...info.fileList];
        fileList = fileList.map(file => {
          if (file.response) {
            file.url = file.response.url;
          }
          return file;
        });
        this.fileList = [];
        for (let i = 0; i < fileList.length; i++) {
          let item = {
            uid: fileList[i].uid ?? 'fileNew_' + i.toString(),
            name: fileList[i].name,
            status: 'done',
            url: fileList[i].url,
            size: fileList[i].size,
            id: fileList[i].id,
          };
          this.fileList.push(item);
        }
      }
    } else if (info.file.status === 'error') {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  xoaFile(data) {
    this.fileList = this.fileList.filter(x => x.uid != data.uid);
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

  async loaiHangDTQGGetAll() {
    this.listVatTuHangHoa = [];
    let res = await this.danhMucService.danhMucChungGetAll('LOAI_HHOA');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listVatTuHangHoa = res.data;
    }
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
        if (this.id > 0) {
          this.selectedPhuongAn.id = this.chiTiet.idPaHdr;
          this.selectedPhuongAn.children = this.chiTiet.children;
          this.selectedPhuongAn.children1 = this.chiTiet.children1;
          this.selectedPhuongAn.hthucLcnt = this.chiTiet.hthucLcnt;
          this.selectedPhuongAn.loaiHdong = this.chiTiet.loaiHdong;
          this.selectedPhuongAn.loaiVthh = this.chiTiet.loaiVthh;
          this.selectedPhuongAn.namKhoach = this.chiTiet.namKhoach;
          this.selectedPhuongAn.ngayTao = this.chiTiet.ngayTao;
          this.selectedPhuongAn.nguoiTao = this.chiTiet.nguoiTao;
          this.selectedPhuongAn.nguonVon = this.chiTiet.nguonVon;
          this.selectedPhuongAn.pthucLcnt = this.chiTiet.pthucLcnt;
          this.selectedPhuongAn.tgianDthau = this.chiTiet.tgianDthau;
          this.selectedPhuongAn.tgianMthau = this.chiTiet.tgianMthau;
          this.selectedPhuongAn.tgianNhang = this.chiTiet.tgianNhang;
          this.selectedPhuongAn.tgianTbao = this.chiTiet.tgianTbao;
          this.selectedPhuongAn.veViec = this.chiTiet.veViec;
          this.selectedPhuongAn.tenLoaiVthh = this.selectHang.ten;
          this.getListFile(this.chiTiet.children);
        }
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
        this.chiTiet.children = [];
        if (this.fileList && this.fileList.length > 0) {
          for (let i = 0; i < this.fileList.length; i++) {
            let item = new ChiTietFile();
            item.dataType = null;
            item.id = this.fileList[i].id ?? 0;
            item.fileName = this.fileList[i].name;
            item.fileSize = ((this.fileList[i].size ?? 0) / 1024).toString() + 'KB';
            item.fileType = null;
            item.fileUrl = this.fileList[i].url;
            this.chiTiet.children.push(item);
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
          "veViec": this.chiTiet.veViec,
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
