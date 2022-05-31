import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogChonKeHoachPhanBoGiaoDuToanChoChiCucVanPhongCucComponent } from 'src/app/components/dialog/dialog-chon-ke-hoach-phan-bo-giao-du-toan-cho-chi-cuc-van-phong-cuc/dialog-chon-ke-hoach-phan-bo-giao-du-toan-cho-chi-cuc-van-phong-cuc.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Utils } from 'src/app/Utility/utils';
import * as uuid from "uuid";
import { DanhMucHDVService } from '../../../../../services/danhMucHDV.service';
import { divMoney, DON_VI_TIEN, LA_MA, MONEY_LIMIT, mulMoney } from "../../../../../Utility/utils";
import { NOI_DUNG } from './nhap-quyet-dinh-giao-du-toan-chi-NSNN.constant';

export class ItemData {
  id: any;
  stt: string;
  level: number;
  maNdung: number;
  tongCong: number;
  nguonNsnn: number;
  nguonKhac: number;
  checked!: boolean;
}

export class ItemSoQuyetDinh {
	fileName: string;
	fileSize: number;
	fileUrl: number;
  id: number;
}
@Component({
  selector: 'app-nhap-quyet-dinh-giao-du-toan-chi-NSNN',
  templateUrl: './nhap-quyet-dinh-giao-du-toan-chi-NSNN.component.html',
  styleUrls: ['./nhap-quyet-dinh-giao-du-toan-chi-NSNN.component.scss']
})

export class NhapQuyetDinhGiaoDuToanChiNSNNComponent implements OnInit {
  //danh muc
  donVis: any = [];
  noiDungs: any[] = NOI_DUNG;
  lstCtietBcao: ItemData[] = [];
  donViTiens: any[] = DON_VI_TIEN;
  soLaMa: any[] = LA_MA;

  //thong tin chung
  id: any;
  userInfo: any;
  soQd: ItemSoQuyetDinh;
  nam: number;
  noiQd: string = "Bộ tài chính";
  ngayQd: any;
  maPhanGiao: string = "1";
  thuyetMinh: string;
  maDviTien: string = '1';
  trangThaiBanGhi: string = "1";              // trang thai cua ban ghi
  nguoiNhap: string;
  maDonViTao!: any;
  listIdDelete: string = "";
  newDate = new Date();
  initItem: ItemData = {
    id: null,
    stt: "0",
    level: 0,
    maNdung: 0,
    tongCong: 0,
    nguonNsnn: 0,
    nguonKhac: 0,
    checked: false,
  };
  validateForm!: FormGroup;
  //trang thai cac nut
  status: boolean = false;
  statusEdit: boolean = false;
  statusBtnSave: boolean = true;                      // trang thai an/hien nut luu
  statusBtnCopy: boolean = true;                      // trang thai copy
  statusBtnPrint: boolean = true;                     // trang thai print

  allChecked = false;
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};

  //file
  lstFiles: any[] = []; //show file ra man hinh
  listFile: File[] = [];                      // list file chua ten va id de hien tai o input
  fileList: NzUploadFile[] = [];
  fileDetail: NzUploadFile;
  //beforeUpload: any;
  listIdFilesDelete: any = [];                        // id file luc call chi tiet


  // before upload file
  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };

  // before upload file so quyet dinh
	beforeUploadSoQuyetDinh = (file: NzUploadFile): boolean => {
		this.fileDetail = file;
		this.soQd = {
			fileName: file.name,
			fileSize: null,
			fileUrl: null,
      id: null,
		};
		return false;
	};

  // them file vao danh sach
  handleUpload(): void {
    this.fileList.forEach((file: any) => {
      const id = file?.lastModified.toString();
      this.lstFiles.push({ id: id, fileName: file?.name });
      this.listFile.push(file);
    });
    this.fileList = [];
  }

  constructor(private router: Router,
    private routerActive: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private quanLyVonPhiService: QuanLyVonPhiService,
    private datePipe: DatePipe,
    private userService: UserService,
    private danhMucService: DanhMucHDVService,
    private notification: NzNotificationService,
    private location: Location,
    private modal: NzModalService,
  ) {
  }

  async ngOnInit() {
    this.id = this.routerActive.snapshot.paramMap.get('id');
    let userName = this.userService.getUserName();
    let userInfo: any = await this.getUserInfo(userName); //get user info
    if (this.id) {
      await this.getDetailReport();
    } else {
      this.trangThaiBanGhi = "1";
      this.nguoiNhap = userInfo?.username;
      this.maDonViTao = userInfo?.dvql;
      this.spinner.show();
      //lay danh sach danh muc don vi
      await this.danhMucService.dMDonVi().toPromise().then(
        (data) => {
          if (data.statusCode == 0) {
            this.donVis = data.data;
          } else {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          }
        },
        (err) => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      );

      // await this.danhMucService.dMKhoanMuc().toPromise().then(
      //   (data) => {
      //     if (data.statusCode == 0) {
      //       this.noiDungs = data.data?.content;
      //       console.log(this.noiDungs);

      //     } else {
      //       this.notification.error(MESSAGE.ERROR, data?.msg);
      //     }
      //   },
      //   (err) => {
      //     this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      //   }
      // );

      this.nam = this.newDate.getFullYear();
      this.spinner.hide();
    }
  }

  //get user info
  async getUserInfo(username: string) {
    let userInfo = await this.userService.getUserInfo(username).toPromise().then(
      (data) => {
        if (data?.statusCode == 0) {
          this.userInfo = data?.data
          return data?.data;
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );
    return userInfo;
  }

  //upload file
  async uploadFile(file: File) {
    // day file len server
    const upfile: FormData = new FormData();
    upfile.append('file', file);
    upfile.append('folder', 'Giao-du-toan-BTC' + '/' +this.maPhanGiao + '/' + this.maDonViTao);
    let temp = await this.quanLyVonPhiService.uploadFile(upfile).toPromise().then(
      (data) => {
        let objfile = {
          fileName: data.filename,
          fileSize: data.size,
          fileUrl: data.url,
        }
        return objfile;
      },
      err => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      },
    );
    return temp;
  }

  // xoa file trong bang file
  deleteFile(id: string): void {
    this.lstFiles = this.lstFiles.filter((a: any) => a.id !== id);
    this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
    this.listIdFilesDelete.push(id);
  }

  //download file về máy tính
  async downloadFile(id: string) {
    let file!: File;
    file = this.listFile.find(element => element?.lastModified.toString() == id);
    if (!file) {
      let fileAttach = this.lstFiles.find(element => element?.id == id);
      if (fileAttach) {
        await this.quanLyVonPhiService.downloadFile(fileAttach.fileUrl).toPromise().then(
          (data) => {
            fileSaver.saveAs(data, fileAttach.fileName);
          },
          err => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          },
        );
      }
    } else {
      const blob = new Blob([file], { type: "application/octet-stream" });
      fileSaver.saveAs(blob, file.name);
    }
  }

  //download file so quyet dinh về máy tính
	async downloadFileSoQuyetDinh() {
		if (this.soQd?.fileUrl) {
			await this.quanLyVonPhiService.downloadFile(this.soQd?.fileUrl).toPromise().then(
				(data) => {
					fileSaver.saveAs(data, this.soQd?.fileName);
				},
				err => {
					this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
				},
			);
		} else {
			let file: any = this.fileDetail;
			const blob = new Blob([file], { type: "application/octet-stream" });
			fileSaver.saveAs(blob, file.name);
		}
	}

  // luu
  async save() {
    if (this.nam >= 3000 || this.nam < 1000) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
      return;
    }
    let checkSaveEdit;
    //get list file url
    let listFile: any = [];
    for (const iterator of this.listFile) {
      listFile.push(await this.uploadFile(iterator));
    }

    if (!this.maDviTien) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
      return;
    }
    //check xem tat ca cac dong du lieu da luu chua?
    //chua luu thi bao loi, luu roi thi cho di
    this.lstCtietBcao.forEach(element => {
      if (this.editCache[element.id].edit === true) {
        checkSaveEdit = false
      }
    });
    if (checkSaveEdit == false) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
      return;
    }
    //tinh lai don vi tien va kiem tra gioi han cua chung
    let lstCtietBcaoTemp: any = [];
    let checkMoneyRange = true;
    this.lstCtietBcao.forEach(item => {
      let tongCong = mulMoney(item.tongCong, this.maDviTien);
      let nguonNsnn = mulMoney(item.nguonNsnn, this.maDviTien);
      let nguonKhac = mulMoney(item.nguonKhac, this.maDviTien);
      if (tongCong > MONEY_LIMIT || nguonNsnn > MONEY_LIMIT ||
        nguonKhac > MONEY_LIMIT) {
        checkMoneyRange = false;
        return;
      }
      lstCtietBcaoTemp.push({
        ...item,
        tongCong: tongCong,
        nguonNsnn: nguonNsnn,
        nguonKhac: nguonKhac,
      })
    })

    if (!checkMoneyRange == true) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
      return;
    }
    // replace nhung ban ghi dc them moi id thanh null
    lstCtietBcaoTemp.forEach(item => {
      if (item.id?.length == 38) {
        item.id = null;
      }
    })
    let request = {
      id: this.id,
      fileDinhKems: listFile,
			listIdFiles: this.listIdFilesDelete,                      // id file luc get chi tiet tra ra( de backend phuc vu xoa file)
      lstCtiets: lstCtietBcaoTemp,
      maPhanGiao: this.maPhanGiao,
      nam: this.nam,
      ngayQd: this.ngayQd,
      noiQd: this.noiQd,
      soQd: this.soQd,
      maDviTien: this.maDviTien,
      thuyetMinh: this.thuyetMinh,
    };
    //call service them moi
    this.spinner.show();
    if (this.id == null) {
      this.quanLyVonPhiService.giaoDuToan1(request).toPromise().then(
        async data => {
          if (data.statusCode == 0) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
              await this.getDetailReport();
          } else {
            this.notification.error(MESSAGE.ERROR, data?.msg);
          }
        },
        err => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        },
      );
    } else {
      this.quanLyVonPhiService.updateLapThamDinhGiaoDuToan1(request).toPromise().then(
        async data => {
          if (data.statusCode == 0) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            await this.getDetailReport();
          } else {
            this.notification.error(MESSAGE.ERROR, data?.msg);
          }
        }, err => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        })
    }
    this.spinner.hide();
  }

  // call chi tiet bao cao
  async getDetailReport() {
    this.spinner.show();
    await this.quanLyVonPhiService.QDGiaoChiTiet1(this.id).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          debugger
          this.lstFiles = data.data.lstFiles;
          this.listFile = [];
          // set thong tin chung bao cao
          this.maDviTien = data.data?.maDviTien;
          this.maPhanGiao = data.data?.maPhanGiao;
          this.nam = data.data?.nam;
          this.ngayQd = data.data?.ngayQD;
          this.maDonViTao = data.data?.maDvi;
          this.thuyetMinh = data.data?.thuyetMinh;
          this.soQd = data.data?.soQd;
          this.trangThaiBanGhi = data.data?.trangThai;
          this.ngayQd = this.datePipe.transform(data.data.ngayQd, Utils.FORMAT_DATE_STR);
          this.noiQd = data.data?.noiQd;
          data.data?.lstCtiets.forEach(item => {
            this.lstCtietBcao.push({
                ...item,
                tongCong: divMoney(item.thNamHienHanhN1, this.maDviTien),
                nguonKhac: divMoney(item.ncauNamDtoanN, this.maDviTien),
                nguonNsnn: divMoney(item.ncauNamN1, this.maDviTien),
            })
          })
          this.sortByIndex();
          this.updateEditCache();
          this.statusBtnCopy = false
          this.statusBtnPrint = false
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
      }
    );
    this.spinner.hide();
  }

  close() {
    this.location.back();
  }

  // chuyển đổi stt đang được mã hóa thành dạng I, II, a, b, c, ...
  getChiMuc(str: string): string {
    str = str.substring(str.indexOf('.') + 1, str.length);
    var xau: string = "";
    let chiSo: any = str.split('.');
    var n: number = chiSo.length - 1;
    var k: number = parseInt(chiSo[n], 10);
    if (n == 0) {
      for (var i = 0; i < this.soLaMa.length; i++) {
        while (k >= this.soLaMa[i].gTri) {
          xau += this.soLaMa[i].kyTu;
          k -= this.soLaMa[i].gTri;
        }
      }
    };
    if (n == 1) {
      xau = chiSo[n];
    };
    if (n == 2) {
      xau = chiSo[n - 1].toString() + "." + chiSo[n].toString();
    };
    if (n == 3) {
      xau = String.fromCharCode(k + 96);
    }
    if (n == 4) {
      xau = "-";
    }
    return xau;
  }
  // lấy phần đầu của số thứ tự, dùng để xác định phần tử cha
  getHead(str: string): string {
    return str.substring(0, str.lastIndexOf('.'));
  }
  // lấy phần đuôi của stt
  getTail(str: string): number {
    return parseInt(str.substring(str.lastIndexOf('.') + 1, str.length), 10);
  }
  //tìm vị trí cần để thêm mới
  findVt(str: string): number {
    var start: number = this.lstCtietBcao.findIndex(e => e.stt == str);
    var index: number = start;
    for (var i = start + 1; i < this.lstCtietBcao.length; i++) {
      if (this.lstCtietBcao[i].stt.startsWith(str)) {
        index = i;
      }
    }
    return index;
  }
  //thay thế các stt khi danh sách được cập nhật, heSo=1 tức là tăng stt lên 1, heso=-1 là giảm stt đi 1
  replaceIndex(lstIndex: number[], heSo: number) {
    //thay doi lai stt cac vi tri vua tim duoc
    lstIndex.forEach(item => {
      var str = this.getHead(this.lstCtietBcao[item].stt) + "." + (this.getTail(this.lstCtietBcao[item].stt) + heSo).toString();
      var nho = this.lstCtietBcao[item].stt;
      this.lstCtietBcao.forEach(item => {
        item.stt = item.stt.replace(nho, str);
      })
    })
  }
  //thêm ngang cấp
  addSame(id: any, initItem: ItemData) {
    var index: number = this.lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
    var head: string = this.getHead(this.lstCtietBcao[index].stt); // lay phan dau cua so tt
    var tail: number = this.getTail(this.lstCtietBcao[index].stt); // lay phan duoi cua so tt
    var ind: number = this.findVt(this.lstCtietBcao[index].stt); // vi tri can duoc them
    // tim cac vi tri can thay doi lai stt
    let lstIndex: number[] = [];
    for (var i = this.lstCtietBcao.length - 1; i > ind; i--) {
      if (this.getHead(this.lstCtietBcao[i].stt) == head) {
        lstIndex.push(i);
      }
    }
    this.replaceIndex(lstIndex, 1);
    // them moi phan tu
    if (initItem.id) {
      let item: ItemData = {
        ...initItem,
        stt: head + "." + (tail + 1).toString(),
      }
      this.lstCtietBcao.splice(ind + 1, 0, item);
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    } else {
      let item: ItemData = {
        ...initItem,
        id: uuid.v4() + "FE",
        stt: head + "." + (tail + 1).toString(),
      }
      this.lstCtietBcao.splice(ind + 1, 0, item);
      this.editCache[item.id] = {
        edit: true,
        data: { ...item }
      };
    }
  }

  // gan editCache.data == lstCtietBcao
  updateEditCache(): void {
    this.lstCtietBcao.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }
  //thêm cấp thấp hơn
  addLow(id: any, initItem: ItemData) {
    var data: ItemData = this.lstCtietBcao.find(e => e.id === id);
    var index: number = this.lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
    var stt: string;
    if (this.lstCtietBcao.findIndex(e => this.getHead(e.stt) == data.stt) == -1) {
      stt = data.stt + '.1';
    } else {
      index = this.findVt(data.stt);
      for (var i = this.lstCtietBcao.length - 1; i >= 0; i--) {
        if (this.getHead(this.lstCtietBcao[i].stt) == data.stt) {
          stt = data.stt + '.' + (this.getTail(this.lstCtietBcao[i].stt) + 1).toString();
          break;
        }
      }
    }

    // them moi phan tu
    if (initItem.id) {
      let item: ItemData = {
        ...initItem,
        stt: stt,
      }
      this.lstCtietBcao.splice(index + 1, 0, item);
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    } else {
      let item: ItemData = {
        ...initItem,
        id: uuid.v4() + "FE",
        stt: stt,
      }
      this.lstCtietBcao.splice(index + 1, 0, item);

      this.editCache[item.id] = {
        edit: true,
        data: { ...item }
      };
    }
  }
  //xóa dòng
  deleteLine(id: any) {
    var index: number = this.lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
    this.sum(-1, this.lstCtietBcao[index]);
    var nho: string = this.lstCtietBcao[index].stt;
    var head: string = this.getHead(this.lstCtietBcao[index].stt); // lay phan dau cua so tt
    //xóa phần tử và con của nó
    this.lstCtietBcao = this.lstCtietBcao.filter(e => !e.stt.startsWith(nho));
    //update lại số thức tự cho các phần tử cần thiết
    let lstIndex: number[] = [];
    for (var i = this.lstCtietBcao.length - 1; i >= index; i--) {
      if (this.getHead(this.lstCtietBcao[i].stt) == head) {
        lstIndex.push(i);
      }
    }

    this.replaceIndex(lstIndex, -1);

    this.updateEditCache();
  }

  // start edit
  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  // huy thay doi
  cancelEdit(id: string): void {
    const index = this.lstCtietBcao.findIndex(item => item.id === id);
    // lay vi tri hang minh sua
    this.editCache[id] = {
      data: { ...this.lstCtietBcao[index] },
      edit: false
    };
  }

  // luu thay doi
  saveEdit(id: string): void {
    this.editCache[id].data.checked = this.lstCtietBcao.find(item => item.id === id).checked; // set checked editCache = checked lstCtietBcao
    const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
    this.sum(-1, this.lstCtietBcao[index]);
    Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
    this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
    this.sum(1, this.lstCtietBcao[index]);
  }


  updateChecked(id: any) {
    var data: ItemData = this.lstCtietBcao.find(e => e.id === id);
    //đặt các phần tử con có cùng trạng thái với nó
    this.lstCtietBcao.forEach(item => {
      if (item.stt.startsWith(data.stt)) {
        item.checked = data.checked;
      }
    })
    //thay đổi các phần tử cha cho phù hợp với tháy đổi của phần tử con
    var index: number = this.lstCtietBcao.findIndex(e => e.stt == this.getHead(data.stt));
    if (index == -1) {
      this.allChecked = this.checkAllChild('0');
    } else {
      var nho: boolean = this.lstCtietBcao[index].checked;
      while (nho != this.checkAllChild(this.lstCtietBcao[index].stt)) {
        this.lstCtietBcao[index].checked = !nho;
        index = this.lstCtietBcao.findIndex(e => e.stt == this.getHead(this.lstCtietBcao[index].stt));
        if (index == -1) {
          this.allChecked = !nho;
          break;
        }
        nho = this.lstCtietBcao[index].checked;
      }
    }
  }
  //kiểm tra các phần tử con có cùng được đánh dấu hay ko
  checkAllChild(str: string): boolean {
    var nho: boolean = true;
    this.lstCtietBcao.forEach(item => {
      if ((this.getHead(item.stt) == str) && (!item.checked) && (item.stt != str)) {
        nho = item.checked;
      }
    })
    return nho;
  }


  updateAllChecked() {
    this.lstCtietBcao.forEach(item => {
      item.checked = this.allChecked;
    })
  }

  deleteAllChecked() {
    var lstId: any[] = [];
    this.lstCtietBcao.forEach(item => {
      if (item.checked) {
        lstId.push(item.id);
      }
    })
    lstId.forEach(item => {
      if (this.lstCtietBcao.findIndex(e => e.id == item) != -1) {
        this.deleteLine(item);
      }
    })
  }
  //thêm phần tử đầu tiên khi bảng rỗng
  addFirst(initItem: ItemData) {
    if (initItem.id) {
      let item: ItemData = {
        ...initItem,
        stt: "0.1",
      }
      this.lstCtietBcao.push(item);
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    } else {
      let item: ItemData = {
        ...initItem,
        id: uuid.v4() + 'FE',
        stt: "0.1",
      }
      this.lstCtietBcao.push(item);

      this.editCache[item.id] = {
        edit: true,
        data: { ...item }
      };
    }
  }

  sortByIndex() {
    this.setDetail();
    this.lstCtietBcao.sort((item1, item2) => {
      if (item1.level > item2.level) {
        return 1;
      }
      if (item1.level < item2.level) {
        return -1;
      }
      if (this.getTail(item1.stt) > this.getTail(item2.stt)) {
        return -1;
      }
      if (this.getTail(item1.stt) < this.getTail(item2.stt)) {
        return 1;
      }
      return 0;
    });
    var lstTemp: any[] = [];
    this.lstCtietBcao.forEach(item => {
      var index: number = lstTemp.findIndex(e => e.stt == this.getHead(item.stt));
      if (index == -1) {
        lstTemp.splice(0, 0, item);
      } else {
        lstTemp.splice(index + 1, 0, item);
      }
    })

    this.lstCtietBcao = lstTemp;
  }

  setDetail() {
    this.lstCtietBcao.forEach(item => {
      item.level = this.noiDungs.find(e => e.id == item.maNdung)?.level;
    })
  }

  getIdCha(maKM: any) {
    return this.noiDungs.find(e => e.id == maKM)?.idCha;
  }

  sortWithoutIndex() {
    this.setDetail();
    var level = 0;
    var lstCtietBcaoTemp: ItemData[] = this.lstCtietBcao;
    this.lstCtietBcao = [];
    var data: ItemData = lstCtietBcaoTemp.find(e => e.level == 0);
    this.addFirst(data);
    lstCtietBcaoTemp = lstCtietBcaoTemp.filter(e => e.id != data.id);
    var lstTemp: ItemData[] = lstCtietBcaoTemp.filter(e => e.level == level);
    while (lstTemp.length != 0 || level == 0) {
      lstTemp.forEach(item => {
        let idCha = this.getIdCha(item.maNdung);
        var index: number = this.lstCtietBcao.findIndex(e => e.maNdung === idCha);
        if (index != -1) {
          this.addLow(this.lstCtietBcao[index].id, item);
        } else {
          index = this.lstCtietBcao.findIndex(e => this.getIdCha(e.maNdung) === idCha);
          this.addSame(this.lstCtietBcao[index].id, item);
        }
      })
      level += 1;
      lstTemp = lstCtietBcaoTemp.filter(e => e.level == level);
    }
  }

  addLine(id: any) {
    var maNdung: any = this.lstCtietBcao.find(e => e.id == id)?.maNdung;
    let obj = {
      maKhoanMuc: maNdung,
      lstKhoanMuc: this.noiDungs,
    }

    const modalIn = this.modal.create({
      nzTitle: 'Danh sách nội dung',
      nzContent: DialogChonKeHoachPhanBoGiaoDuToanChoChiCucVanPhongCucComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '65%',
      nzFooter: null,
      nzComponentParams: {
        obj: obj
      },
    });
    modalIn.afterClose.subscribe((res) => {
      if (res) {
        var index: number = this.lstCtietBcao.findIndex(e => e.maNdung == res.maKhoanMuc);
        if (index == -1) {
          let data: any = {
            ...this.initItem,
            maNdung: res.maKhoanMuc,
            level: this.noiDungs.find(e => e.id == maNdung)?.level,
          };
          if (this.lstCtietBcao.length == 0) {
            this.addFirst(data);
          } else {
            this.addSame(id, data);
          }
        }
        id = this.lstCtietBcao.find(e => e.maNdung == res.maKhoanMuc)?.id;
        res.lstKhoanMuc.forEach(item => {
          var data: ItemData = {
            ...this.initItem,
            maNdung: item.id,
            level: item.level,
          };
          this.addLow(id, data);
        })
        this.updateEditCache();
      }
    });

  }

  getLowStatus(str: string) {
    var index: number = this.lstCtietBcao.findIndex(e => this.getHead(e.stt) == str);
    if (index == -1) {
      return false;
    }
    return true;
  }

  sum(heSo: number, item: ItemData){
      var stt: string = this.getHead(item.stt);
      while (stt != '0'){
          var index = this.lstCtietBcao.findIndex(e => e.stt == stt);
          this.lstCtietBcao[index].tongCong += heSo * item.tongCong;
          this.lstCtietBcao[index].nguonNsnn += heSo * item.nguonNsnn;
          this.lstCtietBcao[index].nguonKhac += heSo * item.nguonKhac;
          stt = this.getHead(stt);
      }
  }

  changeModel(id: string): void {
      this.editCache[id].data.tongCong = Number(this.editCache[id].data.nguonKhac) + Number(this.editCache[id].data.nguonNsnn);
      // this.editCache[id].data.bcheChuaSdung = Number(this.editCache[id].data.bcheGia0N1) - Number(this.editCache[id].data.dkienCcvcCoMat0101n1);
      // this.editCache[id].data.ccvc0101n1Cong = Number(this.editCache[id].data.ccvc0101n1Luong) + Number(this.editCache[id].data.ccvc0101n1Pcap) + Number(this.editCache[id].data.ccvc0101n1Ckdg);
      // this.editCache[id].data.tongSo = Number(this.editCache[id].data.ccvc0101n1Cong) + Number(this.editCache[id].data.quyLuongTangThemDoNangBacLuongCcvc0101n1) + Number(this.editCache[id].data.bcheChuaSdungCong);
      // this.editCache[id].data.tongQuyLuongPcapCkdgTheoLuongCcvcHdld = Number(this.editCache[id].data.tongSo) + Number(this.editCache[id].data.ccvc0101n1Ckdg) + Number(this.editCache[id].data.quyLuongTangThemDoNangBacLuongCcvc0101n1) + Number(this.editCache[id].data.bcheChuaSdungCkdg);
  }
  redirectkehoachvonphi() {
    this.location.back();
  }
}
