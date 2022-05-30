import {
  Component,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { LEVEL, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { ThongTinQuyetDinhPheDuyetKHLCNT } from 'src/app/models/ThongTinQuyetDinhPheDuyetKHLCNT';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { QuyetDinhPheDuyetKeHoachLCNTService } from 'src/app/services/quyetDinhPheDuyetKeHoachLCNT.service';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { environment } from 'src/environments/environment';
import { ChiTietFile } from 'src/app/models/ChiTietFile';
import { UserLogin } from 'src/app/models/userlogin';
import { UserService } from 'src/app/services/user.service';
import { TongHopDeXuatKHLCNTService } from 'src/app/services/tongHopDeXuatKHLCNT.service';
import { HelperService } from 'src/app/services/helper.service';
import { convertVthhToId } from 'src/app/shared/commonFunction';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { R } from '@angular/cdk/keycodes';
import { DanhSachDauThauService } from 'src/app/services/danhSachDauThau.service';

@Component({
  selector: 'app-themmoi-quyetdinh-khlcnt',
  templateUrl: './themmoi-quyetdinh-khlcnt.component.html',
  styleUrls: ['./themmoi-quyetdinh-khlcnt.component.scss']
})
export class ThemmoiQuyetdinhKhlcntComponent implements OnInit {

  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = false;
  formData: FormGroup;
  formThongTinDX: FormGroup;
  editId: string | null = null;
  chiTiet: ThongTinQuyetDinhPheDuyetKHLCNT = new ThongTinQuyetDinhPheDuyetKHLCNT();
  id: number;
  selectedCanCu: any = {};
  selectedPhuongAn: any = {};
  idTongHop: number
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
  listDanhSachTongHop: any[] = [];
  urlUploadFile: string = `${environment.SERVICE_API}/qlnv-gateway/qlnv-core/file/upload-attachment`;

  lastBreadcrumb: string;
  userInfo: UserLogin;

  selectedTab: string = 'phe-duyet';
  danhMucDonVi: any;
  danhsachDx: any;
  iconButtonDuyet: string;
  titleButtonDuyet: string;
  titleStatus: string;

  constructor(
    private router: Router,
    private modal: NzModalService,
    private routerActive: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private danhMucService: DanhMucService,
    private quyetDinhPheDuyetKeHoachLCNTService: QuyetDinhPheDuyetKeHoachLCNTService,
    private tongHopDeXuatKHLCNTService: TongHopDeXuatKHLCNTService,
    private userService: UserService,
    private fb: FormBuilder,
    private helperService: HelperService,
    private dauThauService: DanhSachDauThauService
  ) {
    this.formData = this.fb.group({
      id: [null],
      soQdCc: ['', [Validators.required]],
      soQd: ['', [Validators.required]],
      ngayQd: ['', [Validators.required]],
      idThHdr: ['', [Validators.required]],
      veViec: [''],
      hthucLcnt: ['', [Validators.required]],
      pthucLcnt: ['', [Validators.required]],
      loaiHdong: ['', [Validators.required]],
      nguonVon: ['', [Validators.required]],
      tgianPhanh: ['', [Validators.required]],
      tgianTbao: ['', [Validators.required]],
      tgianDthau: ['', [Validators.required]],
      tgianMthau: ['', [Validators.required]],
      tgianNhang: ['', [Validators.required]],
      ghiChu: ['', Validators.required],
      loaiVthh: [''],
      namKhoach: [''],
      trangThai: ['']
    })
    this.formThongTinDX = this.fb.group({
      hthucLcnt: ['', [Validators.required]],
      pthucLcnt: ['', [Validators.required]],
      loaiHdong: ['', [Validators.required]],
      nguonVon: ['', [Validators.required]],
      tgianPhanh: ['', [Validators.required]],
      tgianTbao: ['', [Validators.required]],
      tgianDthau: ['', [Validators.required]],
      tgianMthau: ['', [Validators.required]],
      tgianNhang: ['', [Validators.required]]
    })
    this.danhMucDonVi = JSON.parse(sessionStorage.getItem('danhMucDonVi'));
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      this.errorInputRequired = MESSAGE.ERROR_NOT_EMPTY;
      this.isVisibleChangeTab$.subscribe((value: boolean) => {
        this.visibleTab = value;
      });
      this.chiTiet.children1 = [];
      this.id = +this.routerActive.snapshot.paramMap.get('id');
      await Promise.all([
        this.loaiHangDTQGGetAll(),
        this.phuongThucDauThauGetAll(),
        this.nguonVonGetAll(),
        this.hinhThucDauThauGetAll(),
        this.loaiHopDongGetAll(),
        this.loadChiTiet(this.id),
        this.danhSachTongHopGetAll(),
      ]);
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  openDialogQuyetDinhGiaoChiTieu() {
    let tt = this.formData.get('trangThai').value;
    if (tt == '01' || tt == '11') {
      return;
    }
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
        // this.chiTiet.qdCanCu = this.selectedCanCu.soQuyetDinh;
        this.formData.patchValue({
          soQdCc: this.selectedCanCu.soQuyetDinh
        })
      }
    });
  }

  openDialogPhuongAnTrinhTongCuc() {
    const modalQD = this.modal.create({
      nzTitle: 'Thông tin phương án trình tổng cục',
      nzContent: DialogPhuongAnTrinhTongCucComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1100px',
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

  // layThongTinPhuongAn() {
  //   if (this.selectedPhuongAn) {
  //     this.chiTiet.children = this.selectedPhuongAn.children;
  //     this.chiTiet.children1 = this.selectedPhuongAn.children1;
  //     this.chiTiet.hthucLcnt = this.selectedPhuongAn.hthucLcnt;
  //     this.chiTiet.idPaHdr = this.selectedPhuongAn.id;
  //     this.chiTiet.loaiHdong = this.selectedPhuongAn.loaiHdong;
  //     this.chiTiet.loaiVthh = this.selectedPhuongAn.loaiVthh;
  //     this.chiTiet.namKhoach = this.selectedPhuongAn.namKhoach;
  //     this.chiTiet.ngayTao = this.selectedPhuongAn.ngayTao;
  //     this.chiTiet.nguoiTao = this.selectedPhuongAn.nguoiTao;
  //     this.chiTiet.nguonVon = this.selectedPhuongAn.nguonVon;
  //     this.chiTiet.pthucLcnt = this.selectedPhuongAn.pthucLcnt;
  //     this.chiTiet.tgianDthau = this.selectedPhuongAn.tgianDthau;
  //     this.chiTiet.tgianMthau = this.selectedPhuongAn.tgianMthau;
  //     this.chiTiet.tgianNhang = this.selectedPhuongAn.tgianNhang;
  //     this.chiTiet.tgianTbao = this.selectedPhuongAn.tgianTbao;
  //     this.chiTiet.veViec = this.selectedPhuongAn.veViec;
  //     this.selectHang.ten = this.selectedPhuongAn.tenLoaiVthh;
  //     if (this.chiTiet.children && this.chiTiet.children.length > 0) {
  //       this.getListFile(this.chiTiet.children);
  //     }
  //   }
  // }

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

  async danhSachTongHopGetAll() {
    this.listDanhSachTongHop = [];
    let loatVthh = this.router.url.split('/')[4]
    let body = {
      trangThai: "00",
      loaiVthh: convertVthhToId(loatVthh)
    }
    let res = await this.tongHopDeXuatKHLCNTService.getAll(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDanhSachTongHop = res.data;
    }
  }

  async openDialogDeXuat(index) {
    let data = this.danhsachDx[index]
    this.modal.create({
      nzTitle: 'Thông tin phụ lục KH LNCT cho các Cục DTNN KV',
      nzContent: DialogThongTinPhuLucQuyetDinhPheDuyetComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '90%',
      nzFooter: null,
      nzComponentParams: {
        data: data
      },
    });
  }

  deleteItem(data) {

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

  selectMaTongHop(event) {
    let data = this.listDanhSachTongHop.filter(item => item.id == event);
    if (data.length > 0) {
      this.bindingData(data[0]);
    }
  }

  // async save2() {
  //   if (this.chiTiet.ghiChu && this.chiTiet.ghiChu != '') {
  //     this.spinner.show();
  //     try {
  //       let detail = [];
  //       detail = [...this.chiTiet.children1];
  //       for (let i = 0; i < detail.length; i++) {
  //         if (detail[i] && detail[i].children) {
  //           let detailChild = detail[i].children;
  //           delete detail[i].children;
  //           detail[i].detail = detailChild;
  //         }
  //       }
  //       this.chiTiet.children = [];
  //       if (this.fileList && this.fileList.length > 0) {
  //         for (let i = 0; i < this.fileList.length; i++) {
  //           let item = new ChiTietFile();
  //           item.dataType = null;
  //           item.id = this.fileList[i].id ?? 0;
  //           item.fileName = this.fileList[i].name;
  //           item.fileSize = ((this.fileList[i].size ?? 0) / 1024).toString() + 'KB';
  //           item.fileType = null;
  //           item.fileUrl = this.fileList[i].url;
  //           this.chiTiet.children.push(item);
  //         }
  //       }
  //       let body = {
  //         "blanhDthau": null,
  //         "detail": detail,
  //         "fileDinhKems": this.chiTiet.children,
  //         "ghiChu": this.chiTiet.ghiChu,
  //         "hthucLcnt": this.chiTiet.hthucLcnt,
  //         "id": this.id,
  //         "idPaHdr": this.chiTiet.idPaHdr,
  //         "loaiHdong": this.chiTiet.loaiHdong,
  //         "loaiVthh": this.chiTiet.loaiVthh ?? "00",
  //         "namKhoach": this.chiTiet.namKhoach,
  //         "ngayQd": this.chiTiet.ngayQd ? dayjs(this.chiTiet.ngayQd).format("YYYY-MM-DD") : null,
  //         "nguonVon": this.chiTiet.nguonVon,
  //         "pthucLcnt": this.chiTiet.pthucLcnt,
  //         "soQd": this.chiTiet.soQd,
  //         "tgianDthau": this.chiTiet.tgianDthau ? dayjs(this.chiTiet.tgianDthau).format("YYYY-MM-DD") : null,
  //         "tgianMthau": this.chiTiet.tgianMthau ? dayjs(this.chiTiet.tgianMthau).format("YYYY-MM-DD") : null,
  //         "tgianNhang": this.chiTiet.tgianNhang ? dayjs(this.chiTiet.tgianNhang).format("YYYY-MM-DD") : null,
  //         "tgianTbao": this.chiTiet.tgianTbao ? dayjs(this.chiTiet.tgianTbao).format("YYYY-MM-DD") : null,
  //         "veViec": this.chiTiet.veViec,
  //         "qdCanCu": this.chiTiet.qdCanCu,
  //       }
  //       if (this.id == 0) {
  //         let res = await this.quyetDinhPheDuyetKeHoachLCNTService.create(body);
  //         if (res.msg == MESSAGE.SUCCESS) {
  //           this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
  //           // this.back();
  //         }
  //         else {
  //           this.notification.error(MESSAGE.ERROR, res.msg);
  //         }
  //       }
  //       else {
  //         let res = await this.quyetDinhPheDuyetKeHoachLCNTService.update(body);
  //         if (res.msg == MESSAGE.SUCCESS) {
  //           this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
  //           // this.back();
  //         }
  //         else {
  //           this.notification.error(MESSAGE.ERROR, res.msg);
  //         }
  //       }
  //       this.spinner.hide();
  //     } catch (e) {
  //       console.log('error: ', e);
  //       this.spinner.hide();
  //       this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
  //     }
  //   }
  //   else {
  //     this.errorGhiChu = true;
  //   }
  // }

  async save() {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      return;
    }
    let body = this.formData.value;
    body.detail = this.danhsachDx;
    let res = null;
    if (this.formData.get('id').value) {
      res = await this.quyetDinhPheDuyetKeHoachLCNTService.update(body);
    } else {
      res = await this.quyetDinhPheDuyetKeHoachLCNTService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (this.formData.get('id').value) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      } else {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
      }
      this.loadChiTiet(res.data.id)
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
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
            id: this.id,
            lyDo: text,
            trangThai: '03',
          };
          const res = await this.quyetDinhPheDuyetKeHoachLCNTService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TU_CHOI_SUCCESS);
            let loatVthh = this.router.url.split('/')[4]
            this.router.navigate(['/mua-hang/dau-thau/kehoach-luachon-nhathau/' + loatVthh + '/phe-duyet']);
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      }
    });
  }

  quayLai() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn quay lại ?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        let loatVthh = this.router.url.split('/')[4]
        this.router.navigate(['/mua-hang/dau-thau/kehoach-luachon-nhathau/' + loatVthh + '/phe-duyet']);
      },
    });
  }

  async guiDuyet() {
    let trangThai = ''
    let mesg = ''
    switch (this.formData.get('trangThai').value) {
      case '00':
      case '03': {
        trangThai = '01';
        mesg = 'Bạn có muốn gửi duyệt ?'
        break;
      }
      case '01': {
        trangThai = '11';
        mesg = 'Văn bản sẵn sàng ban hành ?'
        break;
      }
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: mesg,
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            "id": this.id,
            "trangThai": trangThai
          }
          let res = await this.quyetDinhPheDuyetKeHoachLCNTService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.loadChiTiet(res.data.id);
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TRINH_DUYET_SUCCESS);
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  getTenDviTable(maDvi: string) {
    let donVi = this.danhMucDonVi?.filter(item => item.maDvi == maDvi);
    return donVi.length > 0 ? donVi[0].tenDvi : null
  }

  setTitle() {
    let trangThai = this.formData.get('trangThai').value
    switch (trangThai) {
      case '00': {
        this.iconButtonDuyet = 'htvbdh_tcdt_guiduyet'
        this.titleButtonDuyet = 'Gửi duyệt';
        break;
      }
      case '03': {
        this.iconButtonDuyet = 'htvbdh_tcdt_guiduyet'
        this.titleButtonDuyet = 'Gửi duyệt';
        break;
      }
      case '01': {
        this.iconButtonDuyet = 'htvbdh_tcdt_pheduyet'
        this.titleButtonDuyet = 'Duyệt';
        this.titleStatus = 'Lãnh đạo duyệt';
        break
      }
      case '11': {
        this.titleStatus = 'Ban hành';
        break
      }
    }
  }

  async bindingData(data) {
    console.log(data);
    this.formThongTinDX.patchValue({
      loaiHdong: data.loaiHdong,
      pthucLcnt: data.pthucLcnt,
      hthucLcnt: data.hthucLcnt,
      nguonVon: data.nguonVon,
      tgianPhanh: [data.tuTgianTbao, data.denTgianTbao],
      tgianTbao: [data.tuTgianTbao, data.denTgianTbao],
      tgianDthau: [data.tuTgianDthau, data.denTgianDthau],
      tgianMthau: [data.tuTgianMthau, data.denTgianMthau],
      tgianNhang: [data.tuTgianNhang, data.denTgianNhang],
    });
    this.formData.patchValue({
      loaiHdong: data.loaiHdong,
      pthucLcnt: data.pthucLcnt,
      hthucLcnt: data.hthucLcnt,
      nguonVon: data.nguonVon,
      tgianPhanh: data.tuTgianTbao,
      tgianTbao: data.tuTgianTbao,
      tgianDthau: data.tuTgianDthau,
      tgianMthau: data.tuTgianMthau,
      tgianNhang: data.tuTgianNhang,
      loaiVthh: data.loaiVthh,
      namKhoach: data.namKhoach
    })
    this.danhsachDx = data.children;
    this.danhsachDx.forEach(async (item, index) => {
      await this.dauThauService.getDetail(item.idDxHdr).then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          item.children = res.data.children2;
        }
      })
    })
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
      let data = res.data;
      this.formData.patchValue({
        id: data.id,
        soQdCc: data.soQdCc,
        soQd: data.soQd,
        ngayQd: data.ngayQd,
        idThHdr: data.idThHdr,
        veViec: data.veViec,
        loaiHdong: data.loaiHdong,
        pthucLcnt: data.pthucLcnt,
        hthucLcnt: data.hthucLcnt,
        nguonVon: data.nguonVon,
        tgianPhanh: data.tgianPhanh,
        tgianTbao: data.tgianTbao,
        tgianDthau: data.tgianDthau,
        tgianMthau: data.tgianMthau,
        tgianNhang: data.tgianNhang,
        loaiVthh: data.loaiVthh,
        namKhoach: data.namKhoach,
        ghiChu: data.ghiChu,
        trangThai: data.trangThai
      })
      this.danhsachDx = data.children1;
      let dataDX = await this.tongHopDeXuatKHLCNTService.getDetail(data.idThHdr);
      let obj = this.listDanhSachTongHop.filter(item => item.id === data.idThHdr);
      this.listDanhSachTongHop = [
        ...this.listDanhSachTongHop,
        dataDX.data
      ]
      this.formThongTinDX.patchValue({
        loaiHdong: dataDX.data.loaiHdong,
        pthucLcnt: dataDX.data.pthucLcnt,
        hthucLcnt: dataDX.data.hthucLcnt,
        nguonVon: dataDX.data.nguonVon,
        tgianPhanh: [dataDX.data.tuTgianTbao, dataDX.data.denTgianTbao],
        tgianTbao: [dataDX.data.tuTgianTbao, dataDX.data.denTgianTbao],
        tgianDthau: [dataDX.data.tuTgianDthau, dataDX.data.denTgianDthau],
        tgianMthau: [dataDX.data.tuTgianMthau, dataDX.data.denTgianMthau],
        tgianNhang: [dataDX.data.tuTgianNhang, dataDX.data.denTgianNhang],
      });
    };
    this.setTitle();
  }


}
