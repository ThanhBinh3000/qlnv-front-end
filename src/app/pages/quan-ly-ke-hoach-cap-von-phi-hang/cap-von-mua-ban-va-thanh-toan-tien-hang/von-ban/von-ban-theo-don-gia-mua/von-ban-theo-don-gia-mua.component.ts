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
import { BtnStatus, Cvmb, Doc, Report, ThanhToan } from '../../cap-von-mua-ban-va-thanh-toan-tien-hang.constant';
import { Tab, Vb } from '../von-ban.constant';
import * as XLSX from 'xlsx-js-style';

@Component({
    selector: 'app-von-ban-theo-don-gia-mua',
    templateUrl: './von-ban-theo-don-gia-mua.component.html',
    styleUrls: ['../von-ban.component.scss'],
})
export class VonBanTheoDonGiaMuaComponent implements OnInit {
    @Input() dataInfo;
    @Output() dataChange = new EventEmitter();
    Status = Status;
    Op = new Operator('1');
    Utils = Utils;
    Cvmb = Cvmb;
    Vb = Vb;
    //thong tin dang nhap
    userInfo: any;
    //thong tin chung bao cao
    baoCao: Report = new Report();
    lstCtiets: ThanhToan[] = [];
    editCache: { [key: string]: { edit: boolean; data: ThanhToan } } = {};
    maDviTien: string = '1';
    scrollX: string;
    capDvi: number;
    //trang thai cac nut
    status: BtnStatus = new BtnStatus();
    isReceive: boolean;
    isDataAvailable: boolean = false;
    editMoneyUnit: boolean = false;
    isParent: boolean = false;
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
                await this.onSubmit(Status.TT_04).then(() => {
                    this.isDataAvailable = true;
                })
                break;
            case 'nonapprove':
                await this.tuChoi(Status.TT_05).then(() => {
                    this.isDataAvailable = true;
                })
                break;
            case 'approve':
                await this.onSubmit(Status.TT_07).then(() => {
                    this.isDataAvailable = true;
                })
                break;
            case 'nonaccept':
                await this.tuChoi(Status.TT_08).then(() => {
                    this.isDataAvailable = true;
                })
                break;
            case 'accept':
                await this.onSubmit(Status.TT_09).then(() => {
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
            this.lstCtiets = Table.sortByIndex(this.lstCtiets)
            this.setLevel()
            if (this.lstCtiets.length > 1) {
                this.sum('0.1')
            }
            this.updateEditCache();
        }
        this.capDvi = parseInt(this.userInfo.CAP_DVI, 10);
        if (this.userInfo.MA_DVI == this.baoCao.maDviCha) {
            this.capDvi += 1;
        }
        this.getStatusButton();
    }

    setLevel() {
        this.lstCtiets.forEach(item => {
            item.level = item.stt.split('.').length - 2;
        })
    }

    //check role cho các nut trinh duyet
    getStatusButton() {
        const isChild = this.baoCao.maDvi == this.userInfo?.MA_DVI;
        this.isParent = this.baoCao.maDviCha == this.userInfo?.MA_DVI;
        this.status.save = Status.check('saveWHist', this.baoCao.trangThai) && isChild;
        this.status.submit = Status.check('submit', this.baoCao.trangThai) && isChild && !(!this.baoCao.id);
        this.status.pass = Status.check('pass', this.baoCao.trangThai) && isChild;
        this.status.approve = Status.check('approve', this.baoCao.trangThai) && isChild;
        this.status.accept = Status.check('accept', this.baoCao.trangThai) && this.isParent;
        // this.status.export = Status.TT_09 == this.baoCao.trangThai || (Status.TT_07 == this.baoCao.trangThai && this.capDvi == 1);

        this.status.save = this.status.save && this.userService.isAccessPermisson(Roles.CVMB.EDIT_VB);
        this.status.submit = this.status.submit && this.userService.isAccessPermisson(Roles.CVMB.SUBMIT_VB);
        this.status.pass = this.status.pass && this.userService.isAccessPermisson(Roles.CVMB.PASS_VB);
        this.status.approve = this.status.approve && this.userService.isAccessPermisson(Roles.CVMB.APPROVE_VB);
        this.status.accept = this.status.accept && this.userService.isAccessPermisson(Roles.CVMB.ACCEPT_VB);
        this.status.export = this.userService.isAccessPermisson(Roles.CVMB.EXPORT_VB) && (isChild || this.isParent) && !(!this.baoCao.id);

        this.isReceive = this.baoCao.trangThai == Status.TT_09 || (this.baoCao.trangThai == Status.TT_07 && this.isParent);
        this.scrollX = this.status.save ? Table.tableWidth(350, 13, 1, 60) : Table.tableWidth(350, 13, 1, 0);
    }

    back() {
        if (this.dataInfo?.preData) {
            this.dataChange.emit(this.dataInfo?.preData)
        } else {
            const obj = {
                tabSelected: this.dataInfo?.preTab,
            }
            this.dataChange.emit(obj);
        }
    }

    // call chi tiet bao cao
    async getDetailReport() {
        await this.capVonMuaBanTtthService.ctietVonMuaBan(this.baoCao.id).toPromise().then(
            async (data) => {
                if (data.statusCode == 0) {
                    this.baoCao = data.data;
                    this.lstCtiets = [];
                    data.data.lstCtiets.forEach(item => {
                        this.lstCtiets.push(new ThanhToan(item));
                    })
                    this.lstCtiets = Table.sortByIndex(this.lstCtiets)
                    this.setLevel();
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
    async onSubmit(mcn: string, lyDoTuChoi?: string) {
        if (mcn == Status.TT_09) {
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
        const requestGroupButtons = {
            id: this.baoCao.id,
            maChucNang: mcn,
            lyDoTuChoi: lyDoTuChoi,
            ngayNhanLenhChuyenCo: this.baoCao.ngayNhanLenhChuyenCo,
            tkNhan: this.baoCao.tkNhan,
        };
        await this.capVonMuaBanTtthService.trinhDuyetVonMuaBan(requestGroupButtons).toPromise().then(async (data) => {
            if (data.statusCode == 0) {
                this.baoCao.trangThai = mcn;
                this.baoCao.ngayTrinh = data.data.ngayTrinh;
                this.baoCao.ngayDuyet = data.data.ngayDuyet;
                this.baoCao.ngayPheDuyet = data.data.ngayPheDuyet;
                this.baoCao.ngayTraKq = data.data.ngayTraKq;
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
        if (this.lstCtiets.some(e => this.editCache[e.id].edit)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }

        if (this.baoCao.lstFiles.some(e => e.isEdit)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOT_SAVE_FILE);
            return;
        }

        if (this.lstCtiets.some(e => e.upperBound())) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
            return;
        }

        if (this.listFile.some(file => file.size > Utils.FILE_SIZE)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
            return;
        }

        const lstCtietTemp: ThanhToan[] = [];
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
                data: new ThanhToan(item)
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
            data: new ThanhToan(this.lstCtiets[index]),
            edit: false
        };
    }

    getIndex(data: ThanhToan) {
        if (data.level == 0) {
            return null;
        }
        return Table.subIndex(data.stt);
    }

    // luu thay doi
    saveEdit(id: string): void {
        const index = this.lstCtiets.findIndex(item => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstCtiets[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
    }

    changeTien(id: string) {
        this.editCache[id].data.gtKeHoach = Operator.mul(this.editCache[id].data.slKeHoach, this.editCache[id].data.donGia);
        this.editCache[id].data.gtThucHien = Operator.mul(this.editCache[id].data.slThucHien, this.editCache[id].data.donGia);
        this.editCache[id].data.soConPhaiNop = Operator.sum([this.editCache[id].data.gtThucHien, -this.editCache[id].data.lkSauLanNay]);
    }

    changeVon(id: string) {
        this.editCache[id].data.cong = Operator.sum([this.editCache[id].data.ung, this.editCache[id].data.cap]);
        this.editCache[id].data.lkSauLanNay = Operator.sum([this.editCache[id].data.cong, this.editCache[id].data.lkCong]);
        this.editCache[id].data.soConPhaiNop = Operator.sum([this.editCache[id].data.gtThucHien, -this.editCache[id].data.lkSauLanNay]);
    }

    sum(stt: string) {
        while (stt != '0') {
            const index = this.lstCtiets.findIndex(e => e.stt == stt);
            this.lstCtiets[index].slKeHoach = null;
            this.lstCtiets[index].slThucHien = null;
            this.lstCtiets[index].gtKeHoach = null;
            this.lstCtiets[index].gtThucHien = null;
            this.lstCtiets.forEach(item => {
                if (Table.preIndex(item.stt) == stt) {
                    this.lstCtiets[index].slKeHoach = Operator.sum([this.lstCtiets[index].slKeHoach, item.slKeHoach]);
                    this.lstCtiets[index].slThucHien = Operator.sum([this.lstCtiets[index].slThucHien, item.slThucHien]);
                    this.lstCtiets[index].gtKeHoach = Operator.sum([this.lstCtiets[index].gtKeHoach, item.gtKeHoach]);
                    this.lstCtiets[index].gtThucHien = Operator.sum([this.lstCtiets[index].gtThucHien, item.gtThucHien]);
                }
            })
            stt = Table.preIndex(stt)
        }
    }

    viewDetail(id: string) {
        const obj = {
            id: id,
            preData: this.dataInfo,
            tabSelected: this.dataInfo.tabSelected == Tab.VB_DON_GIA ? Tab.VB_DON_GIA_1 : Tab.VB_DON_GIA,
        }
        this.dataChange.emit(obj);
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
        if (this.capDvi == 1) {
            header = [
                { t: 0, b: 5, l: 0, r: 16, val: null },
                { t: 0, b: 0, l: 0, r: 8, val: "Vốn bán nộp lên đơn vị cấp trên" },
                { t: 1, b: 1, l: 0, r: 4, val: 'Trạng thái báo cáo: ' + Status.reportStatusName(this.baoCao.trangThai, this.isParent) },
                { t: 4, b: 5, l: 0, r: 0, val: 'STT' },
                { t: 4, b: 5, l: 1, r: 1, val: 'Đơn vị' },
                { t: 4, b: 4, l: 2, r: 3, val: 'Số lượng' },
                { t: 5, b: 5, l: 2, r: 2, val: 'Kế hoạch' },
                { t: 5, b: 5, l: 3, r: 3, val: 'Thực hiện (lũy kế đến thời điểm báo cáo)' },
                { t: 4, b: 5, l: 4, r: 4, val: 'Đơn giá (theo quyết định)' },
                { t: 4, b: 5, l: 5, r: 5, val: 'Giá trị theo kế hoạch' },
                { t: 4, b: 5, l: 6, r: 6, val: 'Giá trị thực hiện' },
                { t: 4, b: 4, l: 7, r: 9, val: 'Số đã nộp đơn vị cấp trên (lũy kế)' },
                { t: 5, b: 5, l: 7, r: 7, val: 'Nộp vốn' },
                { t: 5, b: 5, l: 8, r: 8, val: 'Nộp hoàn ứng' },
                { t: 5, b: 5, l: 9, r: 9, val: 'Tổng nộp' },
                { t: 4, b: 4, l: 10, r: 13, val: 'Nộp lần này' },
                { t: 5, b: 5, l: 10, r: 10, val: 'Ngày' },
                { t: 5, b: 5, l: 11, r: 11, val: 'Nộp vốn' },
                { t: 5, b: 5, l: 12, r: 12, val: 'Nộp hoàn ứng' },
                { t: 5, b: 5, l: 13, r: 13, val: 'Tổng nộp' },
                { t: 4, b: 5, l: 14, r: 14, val: 'Lũy kế sau lần nộp này' },
                { t: 4, b: 5, l: 15, r: 15, val: 'Số còn phải nộp' },
                { t: 4, b: 5, l: 16, r: 16, val: 'Ghi chú' },
            ]
            const fieldOrder = ['stt', 'tenDvi', 'slKeHoach', 'slThucHien', 'donGia', 'gtKeHoach', 'gtThucHien', 'lkUng', 'lkCap', 'lkCong', 'uncNgay',
                'ung', 'cap', 'cong', 'lkSauLanNay', 'soConPhaiNop', 'ghiChu'];
            filterData = this.lstCtiets.map(item => {
                const row: any = {};
                fieldOrder.forEach(field => {
                    switch (field) {
                        case 'stt':
                            row[field] = this.getIndex(item);
                            break;
                        case 'uncNgay':
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
            const calHeader = ['A', 'B', '1', '2', '3', '4=1x3', '5=2x3', '6', '7', '8=6+7', '', '9', '10', '11=9+10', '12=8+11', '13=5-12', 'C'];
            let cal = {};
            fieldOrder.forEach((field, index) => {
                cal[field] = calHeader[index];
            })
            filterData.unshift(cal);
        } else {
            header = [
                { t: 0, b: 5, l: 0, r: 15, val: null },
                { t: 0, b: 0, l: 0, r: 8, val: "Vốn bán nộp lên đơn vị cấp trên" },
                { t: 1, b: 1, l: 0, r: 4, val: 'Trạng thái báo cáo: ' + Status.reportStatusName(this.baoCao.trangThai, this.isParent) },
                { t: 4, b: 5, l: 0, r: 0, val: 'STT' },
                { t: 4, b: 5, l: 1, r: 1, val: 'Đơn vị' },
                { t: 4, b: 4, l: 2, r: 3, val: 'Số lượng' },
                { t: 5, b: 5, l: 2, r: 2, val: 'Kế hoạch' },
                { t: 5, b: 5, l: 3, r: 3, val: 'Thực hiện (lũy kế đến thời điểm báo cáo)' },
                { t: 4, b: 5, l: 4, r: 4, val: 'Đơn giá (theo quyết định)' },
                { t: 4, b: 5, l: 5, r: 5, val: 'Giá trị theo kế hoạch' },
                { t: 4, b: 5, l: 6, r: 6, val: 'Giá trị thực hiện' },
                { t: 4, b: 4, l: 7, r: 9, val: 'Số đã nộp đơn vị cấp trên (lũy kế)' },
                { t: 5, b: 5, l: 7, r: 7, val: 'Nộp vốn' },
                { t: 5, b: 5, l: 8, r: 8, val: 'Nộp hoàn ứng' },
                { t: 5, b: 5, l: 9, r: 9, val: 'Tổng nộp' },
                { t: 4, b: 4, l: 10, r: 12, val: 'Nộp lần này' },
                { t: 5, b: 5, l: 10, r: 10, val: 'Nộp vốn' },
                { t: 5, b: 5, l: 11, r: 11, val: 'Nộp hoàn ứng' },
                { t: 5, b: 5, l: 12, r: 12, val: 'Tổng nộp' },
                { t: 4, b: 5, l: 13, r: 13, val: 'Lũy kế sau lần nộp này' },
                { t: 4, b: 5, l: 14, r: 14, val: 'Số còn phải nộp' },
                { t: 4, b: 5, l: 15, r: 15, val: 'Ghi chú' },
            ]
            const fieldOrder = ['stt', 'tenDvi', 'slKeHoach', 'slThucHien', 'donGia', 'gtKeHoach', 'gtThucHien', 'lkUng', 'lkCap', 'lkCong',
                'ung', 'cap', 'cong', 'lkSauLanNay', 'soConPhaiNop', 'ghiChu'];
            filterData = this.lstCtiets.map(item => {
                const row: any = {};
                fieldOrder.forEach(field => {
                    row[field] = field == 'stt' ? this.getIndex(item) : Utils.getValue(item[field]);
                })
                return row;
            })
            // thêm công thức tính cho biểu mẫu
            const calHeader = ['A', 'B', '1', '2', '3', '4=1x3', '5=2x3', '6', '7', '8=6+7', '9', '10', '11=9+10', '12=8+11', '13=5-12', 'C'];
            let cal = {};
            fieldOrder.forEach((field, index) => {
                cal[field] = calHeader[index];
            })
            filterData.unshift(cal);
        }
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
