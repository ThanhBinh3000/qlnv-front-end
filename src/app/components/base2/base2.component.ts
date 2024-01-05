import {HttpClient} from '@angular/common/http';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import dayjs from 'dayjs';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {PAGE_SIZE_DEFAULT, STATUS_DA_DUYET} from 'src/app/constants/config';
import {MESSAGE} from 'src/app/constants/message';
import {STATUS, STATUS_LABEL} from 'src/app/constants/status';
import {UserLogin} from 'src/app/models/userlogin';
import {BaseService} from 'src/app/services/base.service';
import {HelperService} from 'src/app/services/helper.service';
import {StorageService} from 'src/app/services/storage.service';
import {UserService} from 'src/app/services/user.service';
import {Globals} from 'src/app/shared/globals';
import {cloneDeep} from 'lodash';
import {saveAs} from 'file-saver';
import {DialogTuChoiComponent} from '../dialog/dialog-tu-choi/dialog-tu-choi.component';
import {UploadFileService} from 'src/app/services/uploaFile.service';
import {endOfMonth} from 'date-fns';
import printJS from "print-js";
import {PREVIEW} from "../../constants/fileType";

@Component({
  selector: 'app-base2',
  templateUrl: './base2.component.html',
})
export class Base2Component implements OnInit {

  @Output()
  showListEvent = new EventEmitter<any>();

  // User Info
  userInfo: UserLogin;

  // Const
  listNam: any[] = [];
  fileDinhKem: any[] = []
  fileCanCu: any[] = []
  canCuPhapLy: any[] = []
  STATUS = STATUS

  // Form search and dataTable
  formData: FormGroup
  dataTable: any[] = [];
  dataTableAll: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  allChecked = false;
  indeterminate = false;

  @Input() isDetail: boolean = false;
  @Input() dataInit: any = {};
  @Input() idSelected: number = 0;

  // Service
  modal: NzModalService
  filterTable: any = {}
  fb: FormBuilder = new FormBuilder();
  globals: Globals = new Globals();
  helperService: HelperService
  userService: UserService
  spinner: NgxSpinnerService
  notification: NzNotificationService
  uploadFileService: UploadFileService
  service: BaseService;
  ranges = {'Hôm nay': [new Date(), new Date()], 'Tháng hiện tại': [new Date(), endOfMonth(new Date())]};
  showDlgPreview = false;
  pdfSrc: any;
  printSrc: any;
  wordSrc: any;
  pdfBlob: any;
  reportTemplate: any = {
    typeFile: "",
    fileName: "",
    tenBaoCao: "",
    trangThai: ""
  };
  selectedFile: File | null = null;
  templateName: any
  dataImport: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private baseService: BaseService,
  ) {
    this.service = baseService;
    this.notification = notification
    this.spinner = spinner;
    this.modal = modal
    this.helperService = new HelperService(httpClient, notification);
    this.userService = new UserService(httpClient, storageService);
    this.userInfo = this.userService.getUserLogin();
    this.uploadFileService = new UploadFileService(httpClient);
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
  }

  ngOnInit(): void {

  }

  // SEARCH
  async search(roles?) {
    if (!this.checkPermission(roles)) {
      return
    }
    await this.spinner.show();
    try {
      let body = this.formData.value
      body.paggingReq = {
        limit: this.pageSize,
        page: this.page - 1
      }
      let res = await this.service.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        this.dataTable = data.content;
        this.totalRecord = data.totalElements;
        if (this.dataTable && this.dataTable.length > 0) {
          this.dataTable.forEach((item) => {
            item.checked = false;
          });
        }
        this.dataTableAll = cloneDeep(this.dataTable);
      } else {
        this.dataTable = [];
        this.totalRecord = 0;
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  clearForm(currentSearch?: any) {
    this.formData.reset();
    if (currentSearch) {
      this.formData.patchValue(currentSearch)
    }
    this.search();
  }

  showList() {
    this.isDetail = false;
    this.search();
    this.showListEvent.emit();
  }

  goBack() {
    this.showListEvent.emit();
  }

  goDetail(id: number, roles?: any) {
    if (!this.checkPermission(roles)) {
      return
    }
    this.idSelected = id;
    this.isDetail = true;
  }

  async changePageIndex(event) {
    this.page = event;
    await this.search();
  }

  async changePageSize(event) {
    this.pageSize = event;
    await this.search();
  }

  expandSet = new Set<number>();

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  expandSet2 = new Set<number>();

  onExpandChange2(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet2.add(id);
    } else {
      this.expandSet2.delete(id);
    }
  }


  expandSet3 = new Set<number>();

  onExpandChange3(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet3.add(id);
    } else {
      this.expandSet3.delete(id);
    }
  }

  filterInTable(key: string, value: string, type?: string) {
    if (value && value != '') {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        this.dataTableAll.forEach((item) => {
          if (type == 'date' || ['ngayKy', 'ngayLapKh', 'ngayDuyetLdcc', 'ngayGiaoNhan', 'ngayHieuLuc', 'ngayHetHieuLuc', 'ngayDeXuat', 'ngayTongHop', 'ngayTao', 'ngayQd', 'tgianNhang', 'tgianThien', 'ngayDx', 'ngayPduyet', 'ngayThop', 'thoiGianGiaoNhan', 'ngayKyQd', 'ngayNhanCgia', 'ngayKyDc', 'tgianGnhan', 'ngayDuyet', 'ngayNhapKho', 'ngayKyQdinh', 'ngayMkho'].includes(key)) {
            if (item[key] && dayjs(item[key]).format('DD/MM/YYYY').indexOf(value.toString()) != -1) {
              temp.push(item)
            }
          } else {
            if (type) {
              if ('eq' == type) {
                if (item[key] && item[key].toString().toLowerCase() == value.toString().toLowerCase()) {
                  temp.push(item)
                }
              } else {
                if (item[key] && item[key].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1) {
                  temp.push(item)
                }
              }
            } else {
              if (item[key] && item[key].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1) {
                temp.push(item)
              }
            }
          }
        });
      }
      this.dataTable = [...this.dataTable, ...temp];
    } else {
      this.dataTable = cloneDeep(this.dataTableAll);
    }
  }

  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          if (item.trangThai == this.STATUS.DU_THAO || item.trangThai == this.STATUS.DANG_NHAP_DU_LIEU) {
            item.checked = true;
          }
        });
      }
    } else {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          item.checked = false;
        });
      }
    }
  }

  updateSingleChecked(): void {
    if (this.dataTable.every((item) => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.dataTable.every((item) => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }


  // DELETE 1 item table
  delete(item: any, roles?) {
    if (!this.checkPermission(roles)) {
      return
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.spinner.show();
        try {
          let body = {
            id: item.id
          };
          this.service.delete(body).then(async () => {
            await this.search();
            this.spinner.hide();
          });
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  // DELETE 1 multi
  deleteMulti(roles?) {
    if (!this.checkPermission(roles)) {
      return
    }
    let dataDelete = [];
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable.forEach((item) => {
        if (item.checked) {
          dataDelete.push(item.id);
        }
      });
    }
    if (dataDelete && dataDelete.length > 0) {
      this.modal.confirm({
        nzClosable: false,
        nzTitle: 'Xác nhận',
        nzContent: 'Bạn có chắc chắn muốn xóa các bản ghi đã chọn?',
        nzOkText: 'Đồng ý',
        nzCancelText: 'Không',
        nzOkDanger: true,
        nzWidth: 310,
        nzOnOk: async () => {
          this.spinner.show();
          try {
            let res = await this.service.deleteMuti({idList: dataDelete});
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
              await this.search();
              this.allChecked = false;
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
          } catch (e) {
            console.log('error: ', e);
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          } finally {
            this.spinner.hide();
          }
        },
      });
    } else {
      this.notification.error(MESSAGE.ERROR, "Không có dữ liệu phù hợp để xóa.");
    }
  }

  // Export data
  exportData(fileName?: string) {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        this.service
          .export(this.formData.value)
          .subscribe((blob) =>
            saveAs(blob, fileName ? fileName : 'data.xlsx'),
          );
        this.spinner.hide();
      } catch (e) {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY);
    }
  }

  // Save
  async createUpdate(body, roles?: any, isHideMessage?: boolean, ignoreFields?: Array<string>) {
    if (!this.checkPermission(roles)) {
      return
    }
    await this.spinner.show();
    try {
      this.helperService.markFormGroupTouched(this.formData, ignoreFields);
      if (this.formData.invalid) {
        return;
      }
      let res = null;
      if (body.id && body.id > 0) {
        res = await this.service.update(body);
      } else {
        res = await this.service.create(body);
      }
      if (res.msg == MESSAGE.SUCCESS) {
        if (body.id && body.id > 0) {
          !isHideMessage && this.notification.success(MESSAGE.NOTIFICATION, MESSAGE.UPDATE_SUCCESS);
          return res.data;
        } else {
          this.formData.patchValue({id: res.data.id});
          !isHideMessage && this.notification.success(MESSAGE.NOTIFICATION, MESSAGE.ADD_SUCCESS);
          return res.data;
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
        return null;
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e);
    } finally {
      await this.spinner.hide();
    }

  }

  async detail(id, roles?: any) {
    if (!this.checkPermission(roles)) {
      return
    }
    this.spinner.show();
    try {
      let res = await this.service.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, data);
          this.fileDinhKem = data.fileDinhKem
          this.fileCanCu = data.fileCanCu
          return data;
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
        this.spinner.hide();
        return null;
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e);
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }

  }

  // Approve
  async approve(id: number, trangThai: string, msg: string, roles?: any, msgSuccess?: string) {
    if (roles && !this.checkPermission(roles)) {
      return
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: msg,
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: id,
            trangThai: trangThai,
          }
          let res = await this.service.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.NOTIFICATION, msgSuccess ? msgSuccess : MESSAGE.UPDATE_SUCCESS);
            this.spinner.hide();
            this.goBack();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
            this.spinner.hide();
          }
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        } finally {
          this.spinner.hide();
        }
      },
    });
  }

  async reject(id: number, trangThai: string, roles?) {
    if (!this.checkPermission(roles)) {
      return
    }
    const modalTuChoi = this.modal.create({
      nzTitle: 'Từ chối phê duyệt',
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
            id: id,
            lyDoTuChoi: text,
            trangThai: trangThai,
          };
          const res = await this.service.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TU_CHOI_SUCCESS);
            this.spinner.hide();
            this.goBack();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
            this.spinner.hide();
          }
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        } finally {
          this.spinner.hide();
        }
      }
    });
  }


  checkPermission(roles): boolean {
    if (roles) {
      let type = typeof (roles);
      if (type == 'object') {
        roles.forEach(x => {
          if (!this.userService.isAccessPermisson(x)) {
            console.error(x);
            this.notification.error(MESSAGE.ERROR, MESSAGE.ACCESS_DENIED);
            return false;
          }
        })
      }
      if (type == 'string') {
        if (!this.userService.isAccessPermisson(roles)) {
          console.error(roles);
          this.notification.error(MESSAGE.ERROR, MESSAGE.ACCESS_DENIED);
          return false;
        }
      }
      return true
    }
    return true;
  }

  // Approve
  async saveAndSend(body: any, trangThai: string, msg: string, msgSuccess?: string, ignoreFields?: Array<string>) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: msg,
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        await this.spinner.show();
        try {
          this.helperService.markFormGroupTouched(this.formData, ignoreFields);
          if (this.formData.invalid) {
            return;
          }
          let res: any = {};
          if (body.id && body.id > 0) {
            res = await this.service.update(body);
          } else {
            res = await this.service.create(body);
          }
          if (res.msg == MESSAGE.SUCCESS) {
            let res1 = await this.service.approve({id: res.data.id, trangThai: trangThai});
            if (res1.msg == MESSAGE.SUCCESS) {
              this.notification.success(MESSAGE.NOTIFICATION, msgSuccess ? msgSuccess : MESSAGE.SUCCESS);
              this.goBack();
              return res1;
            } else {
              this.notification.error(MESSAGE.ERROR, res1.msg);
              return null;
            }
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
            return null;
          }
        } catch (e) {
          console.log('error: ', e);
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          return null;
        } finally {
          await this.spinner.hide();
        }
      },
    });
  }

  convertDateToString(event: any): string {
    let result = '';
    if (event) {
      result = dayjs(event).format('DD/MM/YYYY').toString()
    }
    return result;
  }

  nvl(item: number) {
    if (item == undefined || item == null) {
      return 0;
    }
    return item;
  }

  convertToRoman(number) {
    var romanNumerals = [
      {value: 1000, symbol: 'M'},
      {value: 900, symbol: 'CM'},
      {value: 500, symbol: 'D'},
      {value: 400, symbol: 'CD'},
      {value: 100, symbol: 'C'},
      {value: 90, symbol: 'XC'},
      {value: 50, symbol: 'L'},
      {value: 40, symbol: 'XL'},
      {value: 10, symbol: 'X'},
      {value: 9, symbol: 'IX'},
      {value: 5, symbol: 'V'},
      {value: 4, symbol: 'IV'},
      {value: 1, symbol: 'I'}
    ];

    var romanNumber = '';

    for (var i = 0; i < romanNumerals.length; i++) {
      while (number >= romanNumerals[i].value) {
        romanNumber += romanNumerals[i].symbol;
        number -= romanNumerals[i].value;
      }
    }

    return romanNumber;
  }

  disabledNgayTu = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayTu) {
      return startValue.getTime() > this.formData.value.ngayTu.getTime();
    }
    return false;
  };

  disabledNgayDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayDen) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayDen.getTime();
  };

  async preview(fileName: string) {
    let body = this.formData.value;
    this.reportTemplate.fileName = fileName + '.docx';
    body.reportTemplateRequest = this.reportTemplate;
    await this.service.preview(body).then(async s => {
      if (s.data) {
        this.pdfSrc = PREVIEW.PATH_PDF + s.data.pdfSrc;
        this.printSrc = s.data.pdfSrc;
        this.wordSrc = PREVIEW.PATH_WORD + s.data.wordSrc;
        this.showDlgPreview = true;
      } else {
        this.notification.info(MESSAGE.NOTIFICATION, MESSAGE.TEMPLATE_NULL);
      }

    });
  }

  downloadPdf(fileName: string) {
    saveAs(this.pdfSrc, fileName + '.pdf');
  }

  downloadWord(fileName: string) {
    saveAs(this.wordSrc, fileName + '.docx');
  }

  closeDlg() {
    this.showDlgPreview = false;
  }

  printPreview() {
    printJS({printable: this.printSrc, type: 'pdf', base64: true})
  }

  async xemTruoc(id, tenBaoCao) {
    await this.service.preview({
      tenBaoCao: tenBaoCao + '.docx',
      id: id
    }).then(async res => {
      if (res.data) {
        this.printSrc = res.data.pdfSrc;
        this.pdfSrc = PREVIEW.PATH_PDF + res.data.pdfSrc;
        this.wordSrc = PREVIEW.PATH_WORD + res.data.wordSrc;
        this.showDlgPreview = true;
      } else {
        this.notification.error(MESSAGE.ERROR, "Lỗi trong quá trình tải file.");
      }
    });
  }

  downloadTemplate(templateName: any) {
    this.service.downloadTemplate(templateName).then(s => {
      const blob = new Blob([s], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      saveAs(blob, templateName);
    });
  }

  async onFileSelected(event: any) {
    await this.spinner.show();
    this.selectedFile = event.target.files[0] as File;
    if (await this.isExcelFile(this.selectedFile)) {
      await this.uploadFile();
      await this.spinner.hide();
    } else{
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, 'Chọn file đuôi .xlsx');
    }
  }

  async isExcelFile(file: File) {
    const allowedExtensions = ['.xlsx'];
    const fileName = file.name.toLowerCase();

    return allowedExtensions.some(ext => fileName.endsWith(ext));
  }

  async uploadFile() {
    if (this.selectedFile) {
      const formData = new FormData();
      Object.keys(this.formData.value).forEach(key => {
        formData.append(key, this.formData.value[key]);
      });
      formData.append('file', this.selectedFile);
      await this.service.importExcel(formData).then(res => {
        if (res.msg == MESSAGE.SUCCESS) {
          console.log(res.data, "res.data")
          this.dataImport = res.data
          console.log(this.dataImport, "this.dataImport")
        }
      })
    }
  }

  showButtonPheDuyet(trangThai, permisson) {
    if (this.userService.isCuc()) {
      return (trangThai == STATUS.CHO_DUYET_TP && this.userService.isAccessPermisson(permisson + '_DUYETTP')) ||
        (trangThai == STATUS.CHO_DUYET_LDC && this.userService.isAccessPermisson(permisson + '_DUYETLDC'));
    }
    if (this.userService.isTongCuc()) {
      return (trangThai == STATUS.CHO_DUYET_LDV && this.userService.isAccessPermisson(permisson + '_DUYETLDV')) ||
        (trangThai == STATUS.CHO_DUYET_LDTC && this.userService.isAccessPermisson(permisson + '_DUYETLDTC')) ||
        (trangThai == STATUS.CHODUYET_BTC && this.userService.isAccessPermisson(permisson + '_DUYETBTC'));
    }

  }

  onKetQuaChange(event: any, index: number, dataTable: any): void {
    if (event.length == 0){
      dataTable[index].danhGia = "";
      return;
    }
    let kq = parseFloat(event.replace(",", "."));
    if (dataTable[index].chiSoClToiThieu && dataTable[index].chiSoClToiDa && kq !== null && index !== null) {
      let toiThieu = parseFloat(dataTable[index].chiSoClToiThieu.replace(",", "."));
      let toiDa = parseFloat(dataTable[index].chiSoClToiDa.replace(",", "."));
      let tt = parseFloat(dataTable[index].toanTu);

      if ((tt === 1 || tt === 2) && toiThieu < kq && kq < toiDa) {
        dataTable[index].danhGia = "Đạt";
      } else {
        dataTable[index].danhGia = "Không đạt";
      }

      if (tt === 3 && toiThieu == kq && kq == toiDa) {
        dataTable[index].danhGia = "Đạt";
      } else {
        dataTable[index].danhGia = "Không đạt";
      }

      if ((tt === 4 || tt === 5) && toiThieu <= kq && kq <= toiDa) {
        dataTable[index].danhGia = "Đạt";
      } else {
        dataTable[index].danhGia = "Không đạt";
      }

    }
  }

  getStrTenLoaiHinh(strMaLoaiHinh) {
    let str = '';
    if (strMaLoaiHinh) {
      let arrLoaiHinh = strMaLoaiHinh.split(",");
      arrLoaiHinh.forEach((item) => {
        switch (item) {
          case '00' : {
            if (arrLoaiHinh.indexOf(item) == arrLoaiHinh.length - 1) {
              str = str + 'Nhập'
            } else {
              str = str + 'Nhập' + ', '
            }
            break;
          }
          case '01' : {
            if (arrLoaiHinh.indexOf(item) == arrLoaiHinh.length - 1) {
              str = str + 'Xuất'
            } else {
              str = str + 'Xuất' + ', '
            }
            break;
          }
          case '02' : {
            if (arrLoaiHinh.indexOf(item) == arrLoaiHinh.length - 1) {
              str = str + 'Bảo quản'
            } else {
              str = str + 'Bảo quản' + ', '
            }
            break;
          }
        }
      })
    }
    return str;
  }

  pheDuyetBcBn(data: any) {
    let trangThai = '';
    let msg = '';
    switch (this.formData.get('trangThai').value) {
      case this.STATUS.DU_THAO: {
        trangThai = this.STATUS.DA_KY;
        msg = 'Bạn có muốn ký số và ban hành ?'
        break;
      }
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: msg,
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          await this.kySo();
          if(this.formData.value.kySo) {
            data.kySo = this.formData.value.kySo
            const res = await this.service.approve(data);
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.SIGNE_APPROVE_SUCCESS);
              this.goBack();
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
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

  async kySo() {
    let data = this.formData.value;
    this.helperService.exc_sign_xml(this, data, (sender, rv)=>{
      var received_msg = JSON.parse(rv);
      if (received_msg.Status == 0) {
        this.formData.patchValue({
          kySo: received_msg.Signature
        })
      } else {
        this.notification.error(MESSAGE.ERROR, "Ký số không thành công:" + received_msg.Status + ":" + received_msg.Error);
      }
    });
  }
}
