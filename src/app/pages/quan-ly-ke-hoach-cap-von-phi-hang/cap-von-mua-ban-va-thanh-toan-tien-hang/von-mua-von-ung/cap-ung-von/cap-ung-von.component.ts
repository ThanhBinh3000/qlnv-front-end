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
import { BtnStatus, CapUng, Cvmb, Doc, Report } from '../../cap-von-mua-ban-va-thanh-toan-tien-hang.constant';
import * as XLSX from 'xlsx-js-style';

@Component({
    selector: 'app-cap-ung-von',
    templateUrl: './cap-ung-von.component.html',
    styleUrls: ['../von-mua-von-ung.component.scss'],
})
export class CapUngVonComponent implements OnInit {
    @Input() dataInfo;
    @Output() dataChange = new EventEmitter();
    Status = Status;
    Op = new Operator('1');
    Utils = Utils;
    Cvmb = Cvmb;
    //thong tin dang nhap
    userInfo: any;
    //thong tin chung bao cao
    baoCao: Report = new Report();
    lstCtiets: CapUng[] = [];
    editCache: { [key: string]: { edit: boolean; data: CapUng } } = {};
    title: string;
    maDviTien: string = '1';
    //danh muc
    // donVis: any[] = [];
    scrollX: string;
    //trang thai cac nut
    status: BtnStatus = new BtnStatus();
    isDataAvailable: boolean = false;
    editMoneyUnit: boolean = false;
    isEdit: boolean = true;
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
                ... new Doc(),
                id: id,
                fileName: file?.name
            });
            this.listFile.push(file);
        });
        this.fileList = [];
    };

    constructor(
        private quanLyVonPhiService: QuanLyVonPhiService,
        private capVonMuaBanTtthService: CapVonMuaBanTtthService,
        private spinner: NgxSpinnerService,
        private userService: UserService,
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
        //lay id cua de nghi
        this.userInfo = this.userService.getUserLogin();
        if (this.dataInfo?.id) {
            this.baoCao.id = this.dataInfo?.id;
            await this.getDetailReport();
        } else {
            this.baoCao = this.dataInfo?.baoCao;
            this.lstCtiets = this.baoCao.lstCtiets;
        }
        if (this.baoCao.maLoai == Cvmb.CU_VON_DVCD) {
            this.title = 'Cấp ứng vốn cho đơn vị cấp dưới';
        } else {
            this.title = 'Ghi nhận cấp ứng vốn từ đơn vị cấp trên';
            this.isEdit = this.userService.isTongCuc();
        }
        this.updateEditCache();
        this.getStatusButton();
    }

    //check role cho các nut trinh duyet
    getStatusButton() {
        const isChild = this.baoCao.maDvi == this.userInfo?.MA_DVI;
        this.status.save = Status.check('saveWHist', this.baoCao.trangThai) && isChild;
        this.status.submit = Status.check('submit', this.baoCao.trangThai) && isChild && !(!this.baoCao.id);
        this.status.pass = Status.check('pass', this.baoCao.trangThai) && isChild;
        this.status.approve = Status.check('approve', this.baoCao.trangThai) && isChild;
        // this.status.export = this.baoCao.trangThai == Status.TT_07 && isChild;
        this.status.export = isChild;
        if (this.baoCao.maLoai == Cvmb.CU_VON_DVCD) {
            this.status.save = this.status.save && this.userService.isAccessPermisson(Roles.CVMB.EDIT_CV);
            this.status.submit = this.status.submit && this.userService.isAccessPermisson(Roles.CVMB.SUBMIT_CV);
            this.status.pass = this.status.pass && this.userService.isAccessPermisson(Roles.CVMB.PASS_CV);
            this.status.approve = this.status.approve && this.userService.isAccessPermisson(Roles.CVMB.APPROVE_CV);
            this.status.export = this.status.export && this.userService.isAccessPermisson(Roles.CVMB.EXPORT_CV) && !(!this.baoCao.id);
            this.scrollX = this.status.save ? Table.tableWidth(350, 6, 6, 60) : Table.tableWidth(350, 6, 6, 0);
        } else {
            this.status.save = this.status.save && this.userService.isAccessPermisson(Roles.CVMB.EDIT_GNV);
            this.status.submit = this.status.submit && this.userService.isAccessPermisson(Roles.CVMB.SUBMIT_GNV);
            this.status.pass = this.status.pass && this.userService.isAccessPermisson(Roles.CVMB.PASS_GNV);
            this.status.approve = this.status.approve && this.userService.isAccessPermisson(Roles.CVMB.APPROVE_GNV);
            this.status.export = this.status.export && this.userService.isAccessPermisson(Roles.CVMB.EXPORT_GNV) && !(!this.baoCao.id);
            this.scrollX = Table.tableWidth(350, 6, 6, 0);
        }
    }

    back() {
        const obj = {
            tabSelected: this.dataInfo?.preTab,
        }
        this.dataChange.emit(obj);
    }

    // call chi tiet bao cao
    async getDetailReport() {
        await this.capVonMuaBanTtthService.ctietVonMuaBan(this.baoCao.id).toPromise().then(
            async (data) => {
                if (data.statusCode == 0) {
                    this.baoCao = data.data;
                    this.lstCtiets = [];
                    data.data.lstCtiets.forEach(item => {
                        this.lstCtiets.push(new CapUng(item));
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

    // chuc nang check role
    async onSubmit(mcn: string, lyDoTuChoi: string) {
        if (this.baoCao.maLoai == Cvmb.GHI_NHAN_CU_VON) {
            if (!this.baoCao.ngayNhanLenhChuyenCo || !this.baoCao.tkNhan) {
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
                return;
            }
        }
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
                this.getStatusButton();
                this.notification.success(MESSAGE.SUCCESS, Status.notiMessage(mcn));
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
        //kiem tra ca trg thon tin nhan da duoc nhap du chua
        if (this.baoCao.maLoai == Cvmb.GHI_NHAN_CU_VON) {
            if (!this.baoCao.ngayNhanLenhChuyenCo || !this.baoCao.tkNhan) {
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
                return;
            }
            //kiem tra ca ky tu trong tai khoan nhan cos phai deu la so ko
            if (!Operator.numOnly(this.baoCao.tkNhan)) {
                this.notification.warning(MESSAGE.WARNING, 'Trường tài khoản nhận chỉ chứa ký tự số');
                return;
            }
        }

        if (this.lstCtiets.some(e => this.editCache[e.id].edit)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }

        if (this.baoCao.lstFiles.some(e => e.isEdit)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOT_SAVE_FILE);
            return;
        }

        if (this.lstCtiets.some(e => e.lkCong > Utils.MONEY_LIMIT || e.uncCong > Utils.MONEY_LIMIT)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
            return;
        }

        if (this.listFile.some(file => file.size > Utils.FILE_SIZE)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
            return;
        }

        const lstCtietTemp: CapUng[] = [];
        this.lstCtiets.forEach(item => {
            lstCtietTemp.push(item.request())
        })
        const request = JSON.parse(JSON.stringify(this.baoCao));
        request.lstCtiets = lstCtietTemp;
        request.fileDinhKems = [];
        for (let iterator of this.listFile) {
            const id = iterator?.lastModified.toString();
            const noiDung = this.baoCao.lstFiles.find(e => e.id == id)?.noiDung;
            request.fileDinhKems.push(await this.quanLyVonPhiService.upFile(iterator, this.baoCao.maDvi + '/' + this.baoCao.maCapUng, noiDung));
        }
        request.fileDinhKems = request.fileDinhKems.concat(this.baoCao.lstFiles.filter(e => typeof e.id == 'number'))

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
                data: new CapUng(item)
            };
        });
    }

    startEdit(id: string): void {
        this.editCache[id].edit = true;
    }

    // huy thay doi
    cancelEdit(id: string): void {
        const index = this.lstCtiets.findIndex(item => item.id === id);
        // lay vi tri hang minh sua
        this.editCache[id] = {
            data: new CapUng(this.lstCtiets[index]),
            edit: false
        };
    }

    // luu thay doi
    saveEdit(id: string): void {
        const index = this.lstCtiets.findIndex(item => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstCtiets[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
    }

    changeModel(id: string) {
        const index = this.lstCtiets.findIndex(e => e.id == id);
        this.editCache[id].data.changeModel(this.lstCtiets[index]);
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
        const header = [
            { t: 0, b: 5, l: 0, r: 13, val: null },
            { t: 0, b: 0, l: 0, r: 8, val: this.title },
            { t: 1, b: 1, l: 0, r: 4, val: 'Trạng thái báo cáo: ' + Status.reportStatusName(this.baoCao.trangThai) },
            { t: 4, b: 5, l: 0, r: 0, val: 'STT' },
            { t: 4, b: 5, l: 1, r: 1, val: 'Đơn vị' },
            { t: 4, b: 4, l: 2, r: 9, val: 'Thông tin Ủy nhiệm chi bên gửi đợt ' + this.baoCao.dot.toString() },
            { t: 5, b: 5, l: 2, r: 2, val: 'Số lệnh chi tiền' },
            { t: 5, b: 5, l: 3, r: 3, val: 'Ngày lập' },
            { t: 5, b: 5, l: 4, r: 4, val: 'Nội dung' },
            { t: 5, b: 5, l: 5, r: 5, val: 'Niên độ NS' },
            { t: 5, b: 5, l: 6, r: 6, val: 'Từ tài khoản' },
            { t: 5, b: 5, l: 7, r: 7, val: 'Vốn ứng' },
            { t: 5, b: 5, l: 8, r: 8, val: 'Vốn cấp' },
            { t: 5, b: 5, l: 9, r: 9, val: 'Cộng' },
            { t: 4, b: 4, l: 10, r: 12, val: 'Lũy kế cấp vốn đến thời điểm báo cáo (cộng cả đợt hiện tại)' },
            { t: 5, b: 5, l: 10, r: 10, val: 'Vốn ứng' },
            { t: 5, b: 5, l: 11, r: 11, val: 'Vốn cấp' },
            { t: 5, b: 5, l: 12, r: 12, val: 'Cộng' },
            { t: 4, b: 5, l: 13, r: 13, val: 'Ghi chú' },
        ]
        const fieldOrder = ['stt', 'tenDvi', 'soLenhChiTien', 'ngayLap', 'noiDung', 'nienDoNs', 'tuTk', 'uncVonUng', 'uncVonCap', 'uncCong', 'lkVonUng',
            'lkVonCap', 'lkCong', 'ghiChu']
        const filterData = this.lstCtiets.map((item, index) => {
            const row: any = {};
            fieldOrder.forEach(field => {
                switch (field) {
                    case 'stt':
                        row[field] = index + 1;
                        break;
                    case 'ngayLap':
                        row[field] = Utils.getValue(Utils.fmtDate(item[field]));
                        break;
                    default:
                        row[field] = Utils.getValue(item[field]);
                        break;
                }
            })
            return row;
        })
        // thêm công thức tính cho biểu mẫu
        const calHeader = ['A', 'B', 'C', 'D', 'E', 'F', 'G', '1', '2', '3=1+2', '4', '5', '6=4+5', ''];
        let cal = {};
        fieldOrder.forEach((field, index) => {
            cal[field] = calHeader[index];
        })
        filterData.unshift(cal);
        const workbook = XLSX.utils.book_new();
        const worksheet = Table.initExcel(header);
        XLSX.utils.sheet_add_json(worksheet, filterData, { skipHeader: true, origin: Table.coo(header[0].l, header[0].b + 1) })
        //Thêm khung viền cho bảng
        for (const cell in worksheet) {
            if (cell.startsWith('!') || XLSX.utils.decode_cell(cell).r < 4) continue;
            worksheet[cell].s = Table.borderStyle;
        }

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Dữ liệu');
        XLSX.writeFile(workbook, this.baoCao.maCapUng + '.xlsx');
    }
}
