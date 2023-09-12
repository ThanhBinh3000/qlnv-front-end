import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { Operator, Roles, Status, Table, Utils } from 'src/app/Utility/utils';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { CapVonMuaBanTtthService } from 'src/app/services/quan-ly-von-phi/capVonMuaBanTtth.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { BtnStatus, Report, TienThua } from '../../cap-von-mua-ban-va-thanh-toan-tien-hang.constant';
import * as XLSX from 'xlsx';

@Component({
    selector: 'app-nop-tien-thua',
    templateUrl: './nop-tien-thua.component.html',
    styleUrls: ['../von-mua-von-ung.component.scss'],
})

export class NopTienThuaComponent implements OnInit {
    @Input() dataInfo;
    @Output() dataChange = new EventEmitter();
    Status = Status;
    Op = new Operator('1');
    Utils = Utils;
    //thong tin dang nhap
    userInfo: any;
    //thong tin chung bao cao
    baoCao: Report = new Report();
    lstCtiets: TienThua[] = [];
    trangThais: any[] = [];
    editCache: { [key: string]: { edit: boolean; data: TienThua } } = {};
    title: string;
    maDviTien: string = '1';
    scrollX: string;
    capDvi: number;
    //trang thai cac nut
    status: BtnStatus = new BtnStatus();
    isParent: boolean = false;
    editMoneyUnit: boolean = false;
    isDataAvailable: boolean = false;
    //file
    fileList: NzUploadFile[] = [];
    listFile: File[] = [];
    listIdDeleteFiles: string[] = [];

    beforeUpload = (file: NzUploadFile): boolean => {
        this.fileList = this.fileList.concat(file);
        return false;
    };

    // them file vao danh sach
    handleUpload(): void {
        this.fileList.forEach((file: any) => {
            const id = file?.lastModified.toString();
            this.baoCao.lstFiles.push({
                id: id,
                fileName: file?.name
            });
            this.listFile.push(file);
        });
        this.fileList = [];
    };

    constructor(
        private capVonMuaBanTtthService: CapVonMuaBanTtthService,
        private quanLyVonPhiService: QuanLyVonPhiService,
        private spinner: NgxSpinnerService,
        public userService: UserService,
        private notification: NzNotificationService,
        private modal: NzModalService,
        public globals: Globals,
    ) { }

    async ngOnInit() {
        this.action('init');
    }

    async action(code: string) {
        this.spinner.show();
        this.isDataAvailable = false;
        switch (code) {
            case 'init':
                await this.initialization().then(() => {
                    this.isDataAvailable = true;
                });
                break;
            case 'detail':
                await this.getDetailReport().then(() => {
                    this.isDataAvailable = true;
                });
                break;
            case 'save':
                await this.save().then(() => {
                    this.isDataAvailable = true;
                })
                break;
            case 'submit':
                await this.submitReport().then(() => {
                    this.isDataAvailable = true;
                })
                break;
            case 'nonpass':
                await this.tuChoi(Status.TT_03).then(() => {
                    this.isDataAvailable = true;
                })
                break;
            case 'pass':
                await this.onSubmit(Status.TT_04, null).then(() => {
                    this.isDataAvailable = true;
                })
                break;
            case 'nonapprove':
                await this.tuChoi(Status.TT_05).then(() => {
                    this.isDataAvailable = true;
                })
                break;
            case 'approve':
                await this.onSubmit(Status.TT_07, null).then(() => {
                    this.isDataAvailable = true;
                })
                break;
            default:
                break;
        }
        this.spinner.hide();
    }

    async initialization() {
        this.userInfo = this.userService.getUserLogin();
        if (this.dataInfo?.id) {
            this.baoCao.id = this.dataInfo?.id;
            await this.getDetailReport();
        } else {
            this.baoCao = this.dataInfo?.baoCao;
            this.lstCtiets = this.baoCao.lstCtiets;
        }
        this.updateEditCache();
        this.getStatusButton();
    }

    getStatusButton() {
        const isChild = this.userInfo.MA_DVI == this.baoCao.maDvi;
        this.isParent = this.userInfo.MA_DVI == this.baoCao.maDviCha;
        this.status.save = Status.check('saveWHist', this.baoCao.trangThai) && this.userService.isAccessPermisson(Roles.CVMB.EDIT_NTT) && isChild;
        this.status.submit = Status.check('submit', this.baoCao.trangThai) && this.userService.isAccessPermisson(Roles.CVMB.SUBMIT_NTT) && isChild && !(!this.baoCao.id);
        this.status.pass = Status.check('pass', this.baoCao.trangThai) && this.userService.isAccessPermisson(Roles.CVMB.PASS_NTT) && isChild;
        this.status.approve = Status.check('approve', this.baoCao.trangThai) && this.userService.isAccessPermisson(Roles.CVMB.APPROVE_NTT) && isChild;
        this.status.approve = Status.check('accept', this.baoCao.trangThai) && this.userService.isAccessPermisson(Roles.CVMB.ACCEPT_NTT) && this.isParent;
        this.status.export = this.userService.isAccessPermisson(Roles.CVMB.EXPORT_NTT) && (isChild || this.isParent) && !(!this.baoCao.id);
        this.scrollX = this.status.save ? Table.tableWidth(200, 7, 0, 60) : Table.tableWidth(200, 7, 0, 0);
    }

    back() {
        const obj = {
            tabSelected: this.dataInfo?.preTab,
        }
        this.dataChange.emit(obj);
    }

    async getDetailReport() {
        await this.capVonMuaBanTtthService.ctietVonMuaBan(this.baoCao.id).toPromise().then(
            async (data) => {
                if (data.statusCode == 0) {
                    this.baoCao = data.data;
                    this.lstCtiets = []
                    data.data.lstCtiets.forEach(item => {
                        this.lstCtiets.push(new TienThua(item));
                    })
                    this.baoCao.listIdDeleteFiles = [];
                    this.listFile = [];
                    this.updateEditCache();
                    this.getStatusButton();
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            },
        );
    }

    async submitReport() {
        this.modal.confirm({
            nzClosable: false,
            nzTitle: 'Xác nhận',
            nzContent: 'Bạn có chắc chắn muốn trình duyệt?<br/>(Trình duyệt trước khi lưu báo cáo có thể gây mất dữ liệu)',
            nzOkText: 'Đồng ý',
            nzCancelText: 'Không',
            nzOkDanger: true,
            nzWidth: 500,
            nzOnOk: () => {
                this.onSubmit(Status.TT_02, '')
            },
        });
    }

    async onSubmit(mcn: string, lyDoTuChoi: string) {
        const requestGroupButtons = {
            id: this.baoCao.id,
            maChucNang: mcn,
            lyDoTuChoi: lyDoTuChoi,
        };
        await this.capVonMuaBanTtthService.trinhDuyetVonMuaBan(requestGroupButtons).toPromise().then(async (data) => {
            if (data.statusCode == 0) {
                this.baoCao.trangThai = mcn;
                this.baoCao.ngayTrinh = data.data.ngayTrinh;
                this.baoCao.ngayDuyet = data.data.ngayDuyet;
                this.baoCao.ngayPheDuyet = data.data.ngayPheDuyet;
                this.baoCao.ngayTraKq = data.data.ngayTraKq;
                this.getStatusButton();
                if (Status.check('reject', mcn)) {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.REJECT_SUCCESS);
                } else {
                    this.notification.success(MESSAGE.SUCCESS, mcn == Status.TT_02 ? MESSAGE.SUBMIT_SUCCESS : MESSAGE.APPROVE_SUCCESS);
                }
            } else {
                this.notification.error(MESSAGE.ERROR, data?.msg);
            }
        }, err => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }

    //show popup tu choi
    async tuChoi(mcn: string) {
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
                this.onSubmit(mcn, text);
            }
        });
    }

    // luu
    async save() {
        if (this.lstCtiets.some(e => this.editCache[e.id].edit)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }

        if (this.lstCtiets.some(e => e.nopTong > Utils.MONEY_LIMIT || e.daNopTong > Utils.MONEY_LIMIT)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
            return;
        }

        if (this.listFile.some(file => file.size > Utils.FILE_SIZE)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
            return;
        }

        const lstCtietTemp: TienThua[] = [];
        this.lstCtiets.forEach(item => {
            lstCtietTemp.push(item.request())
        })
        const request = JSON.parse(JSON.stringify(this.baoCao));
        request.lstCtiets = lstCtietTemp;
        request.fileDinhKems = [];
        for (let iterator of this.listFile) {
            request.fileDinhKems.push(await this.quanLyVonPhiService.upFile(iterator, this.baoCao.maDvi + '/' + this.baoCao.maCapUng));
        }

        if (!this.baoCao.id) {
            this.capVonMuaBanTtthService.themMoiVonMuaBan(request).toPromise().then(
                async (data) => {
                    if (data.statusCode == 0) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
                        this.baoCao.id = data.data.id;
                        this.action('detail');
                    } else {
                        this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
                },
                (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                },
            );
        } else {
            this.capVonMuaBanTtthService.capNhatVonMuaBan(request).toPromise().then(
                async (data) => {
                    if (data.statusCode == 0) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
                        this.action('detail');
                    } else {
                        this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
                },
                (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                },
            );
        }
    }

    updateEditCache(): void {
        this.lstCtiets.forEach(item => {
            this.editCache[item.id] = {
                edit: false,
                data: new TienThua(item),
            };
        });
    }

    startEdit(id: string): void {
        this.editCache[id].edit = true;
    }

    // huy thay doi
    cancelEdit(id: string): void {
        const index = this.lstCtiets.findIndex(item => item.id === id);
        this.editCache[id] = {
            data: new TienThua(this.lstCtiets[index]),
            edit: false
        };
    }

    // luu thay doi
    saveEdit(id: string): void {
        const index = this.lstCtiets.findIndex(item => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstCtiets[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
    }

    // xoa file trong bang file
    deleteFile(id: string): void {
        this.baoCao.lstFiles = this.baoCao.lstFiles.filter((a: any) => a.id !== id);
        this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
        this.baoCao.listIdDeleteFiles.push(id);
    }

    async downloadFile(id: string) {
        let file: any = this.listFile.find(element => element?.lastModified.toString() == id);
        let doc: any = this.baoCao.lstFiles.find(element => element?.id == id);
        await this.quanLyVonPhiService.downFile(file, doc);
    }

    exportToExcel() {
        if (this.lstCtiets.some(e => this.editCache[e.id].edit)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }
        let header = [];
        let filterData = [];
        let fieldOrder = [];
        let calHeader = [];
        if (this.capDvi != 3) {
            header = [
                { t: 0, b: 6, l: 0, r: 23, val: null },
                { t: 0, b: 0, l: 0, r: 8, val: 'Nộp tiền thừa lên đơn vị cấp trên' },
                { t: 4, b: 6, l: 0, r: 0, val: 'STT' },
                { t: 4, b: 6, l: 1, r: 1, val: 'Hàng DTQG' },
                { t: 4, b: 5, l: 2, r: 4, val: 'Nhận' },
                { t: 6, b: 6, l: 2, r: 2, val: 'Tổng vốn ứng' },
                { t: 6, b: 6, l: 3, r: 3, val: 'Tổng vốn cấp' },
                { t: 6, b: 6, l: 4, r: 4, val: 'Tổng vốn' },
                { t: 4, b: 4, l: 5, r: 13, val: 'Chi' },
                { t: 5, b: 5, l: 5, r: 7, val: 'Giao cho đơn vị cấp dưới' },
                { t: 6, b: 6, l: 5, r: 5, val: 'Tổng cấp ứng' },
                { t: 6, b: 6, l: 6, r: 6, val: 'Tổng cấp vốn' },
                { t: 6, b: 6, l: 7, r: 7, val: 'Tổng cấp' },
                { t: 5, b: 5, l: 8, r: 10, val: 'Tổng thanh toán cho khách hàng' },
                { t: 6, b: 6, l: 8, r: 8, val: 'Tổng vốn ứng' },
                { t: 6, b: 6, l: 9, r: 9, val: 'Tổng vốn vốn' },
                { t: 6, b: 6, l: 10, r: 10, val: 'Tổng vốn' },
                { t: 5, b: 5, l: 11, r: 13, val: 'Số dư' },
                { t: 6, b: 6, l: 11, r: 11, val: 'Tổng vốn ứng' },
                { t: 6, b: 6, l: 12, r: 12, val: 'Tổng vốn vốn' },
                { t: 6, b: 6, l: 13, r: 13, val: 'Tổng vốn' },
                { t: 4, b: 4, l: 14, r: 22, val: 'Nộp lên đơn vị cấp trên' },
                { t: 5, b: 5, l: 14, r: 16, val: 'Số đã nộp lên đơn vị cấp trên (lũy kế đến trước lần nộp này)' },
                { t: 6, b: 6, l: 14, r: 14, val: 'Vốn ứng' },
                { t: 6, b: 6, l: 15, r: 15, val: 'Vốn cấp' },
                { t: 6, b: 6, l: 16, r: 16, val: 'Tổng vốn' },
                { t: 5, b: 5, l: 17, r: 20, val: 'Nộp đợt ' + this.baoCao.dot.toString() },
                { t: 6, b: 6, l: 17, r: 17, val: 'Ủy nhiệm chi ngày' },
                { t: 6, b: 6, l: 18, r: 18, val: 'Vốn ứng' },
                { t: 6, b: 6, l: 19, r: 19, val: 'Vốn cấp' },
                { t: 6, b: 6, l: 20, r: 20, val: 'Tổng vốn' },
                { t: 5, b: 6, l: 21, r: 21, val: 'Lũy kế sau lần nộp này' },
                { t: 5, b: 6, l: 22, r: 22, val: 'Số còn phải nộp' },
                { t: 4, b: 6, l: 23, r: 23, val: 'Ghi chú' },
            ]
            fieldOrder = ['stt', 'tenHangDtqg', 'nhanVonUng', 'nhanVonCap', 'nhanTong', 'giaoCapUng', 'giaoCapVon', 'giaoTong', 'ttVonUng', 'ttVonCap', 'ttTong',
                'duVonUng', 'duVonCap', 'duTong', 'daNopVonUng', 'daNopVonCap', 'daNopTong', 'nopUncNgay', 'nopVonUng', 'nopVonCap', 'nopTong', 'lkSauLanNay', 'soConPhaiNop', 'ghiChu'];
            calHeader = ['A', 'B', '1', '2', '3=1+2', '4', '5', '6=4+6', '7', '8', '9=7+8', '10=1-4-7', '11=2-5-8', '12=10+11', '13', '14', '15', '16',
                '17', '18', '19', '20=15+19', '21=12-20', 'C'];
        } else {
            header = [
                { t: 0, b: 6, l: 0, r: 23, val: null },
                { t: 0, b: 0, l: 0, r: 8, val: 'Nộp tiền thừa lên đơn vị cấp trên' },
                { t: 4, b: 6, l: 0, r: 0, val: 'STT' },
                { t: 4, b: 6, l: 1, r: 1, val: 'Hàng DTQG' },
                { t: 4, b: 5, l: 2, r: 4, val: 'Nhận' },
                { t: 6, b: 6, l: 2, r: 2, val: 'Tổng vốn ứng' },
                { t: 6, b: 6, l: 3, r: 3, val: 'Tổng vốn cấp' },
                { t: 6, b: 6, l: 4, r: 4, val: 'Tổng vốn' },
                { t: 4, b: 4, l: 5, r: 10, val: 'Chi' },
                { t: 5, b: 5, l: 5, r: 7, val: 'Tổng thanh toán cho khách hàng' },
                { t: 6, b: 6, l: 5, r: 5, val: 'Tổng vốn ứng' },
                { t: 6, b: 6, l: 6, r: 6, val: 'Tổng vốn vốn' },
                { t: 6, b: 6, l: 7, r: 7, val: 'Tổng vốn' },
                { t: 5, b: 5, l: 8, r: 10, val: 'Số dư' },
                { t: 6, b: 6, l: 8, r: 8, val: 'Tổng vốn ứng' },
                { t: 6, b: 6, l: 9, r: 9, val: 'Tổng vốn vốn' },
                { t: 6, b: 6, l: 10, r: 10, val: 'Tổng vốn' },
                { t: 4, b: 4, l: 11, r: 19, val: 'Nộp lên đơn vị cấp trên' },
                { t: 5, b: 5, l: 11, r: 13, val: 'Số đã nộp lên đơn vị cấp trên (lũy kế đến trước lần nộp này)' },
                { t: 6, b: 6, l: 11, r: 11, val: 'Vốn ứng' },
                { t: 6, b: 6, l: 12, r: 12, val: 'Vốn cấp' },
                { t: 6, b: 6, l: 13, r: 13, val: 'Tổng vốn' },
                { t: 5, b: 5, l: 14, r: 17, val: 'Nộp đợt ' + this.baoCao.dot.toString() },
                { t: 6, b: 6, l: 14, r: 14, val: 'Ủy nhiệm chi ngày' },
                { t: 6, b: 6, l: 15, r: 15, val: 'Vốn ứng' },
                { t: 6, b: 6, l: 16, r: 16, val: 'Vốn cấp' },
                { t: 6, b: 6, l: 17, r: 17, val: 'Tổng vốn' },
                { t: 5, b: 6, l: 18, r: 18, val: 'Lũy kế sau lần nộp này' },
                { t: 5, b: 6, l: 19, r: 19, val: 'Số còn phải nộp' },
                { t: 4, b: 6, l: 20, r: 20, val: 'Ghi chú' },
            ]
            fieldOrder = ['stt', 'tenHangDtqg', 'nhanVonUng', 'nhanVonCap', 'nhanTong', 'ttVonUng', 'ttVonCap', 'ttTong', 'duVonUng', 'duVonCap', 'duTong',
                'daNopVonUng', 'daNopVonCap', 'daNopTong', 'nopUncNgay', 'nopVonUng', 'nopVonCap', 'nopTong', 'lkSauLanNay', 'soConPhaiNop', 'ghiChu'];
            calHeader = ['A', 'B', '1', '2', '3=1+2', '7', '8', '9=7+8', '10=1-7', '11=2-8', '12=10+11', '13', '14', '15', '16',
                '17', '18', '19', '20=15+19', '21=12-20', 'C'];
        }
        filterData = this.lstCtiets.map((item, index) => {
            const row: any = {};
            fieldOrder.forEach(field => {
                switch (field) {
                    case 'stt':
                        row[field] = index + 1;
                        break;
                    case 'nopUncNgay':
                        row[field] = Utils.fmtDate(item[field]);
                        break;
                    default:
                        row[field] = item[field];
                        break;
                }
            })
            return row;
        })
        // thêm công thức tính cho biểu mẫu
        let cal = {};
        fieldOrder.forEach((field, index) => {
            cal[field] = calHeader[index];
        })
        filterData.unshift(cal);
        const workbook = XLSX.utils.book_new();
        const worksheet = Table.initExcel(header);
        XLSX.utils.sheet_add_json(worksheet, filterData, { skipHeader: true, origin: Table.coo(header[0].l, header[0].b + 1) })
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Dữ liệu');
        XLSX.writeFile(workbook, this.baoCao.maCapUng + '.xlsx');
    }
}
