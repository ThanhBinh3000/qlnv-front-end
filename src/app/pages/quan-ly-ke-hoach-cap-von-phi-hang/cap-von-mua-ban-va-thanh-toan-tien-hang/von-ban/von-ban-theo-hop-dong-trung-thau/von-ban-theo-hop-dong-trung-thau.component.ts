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
import * as XLSX from 'xlsx-js-style';
import { BtnStatus, Cvmb, Doc, Report, ThanhToan } from '../../cap-von-mua-ban-va-thanh-toan-tien-hang.constant';
import { Tab, Vb } from '../von-ban.constant';

@Component({
    selector: 'app-von-ban-theo-hop-dong-trung-thau',
    templateUrl: './von-ban-theo-hop-dong-trung-thau.component.html',
    styleUrls: ['../von-ban.component.scss'],
})
export class VonBanTheoHopDongTrungThauComponent implements OnInit {
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
    capDvi: number;
    scrollHD: string;
    scrollVB: string;
    //trang thai cac nut
    status: BtnStatus = new BtnStatus();
    isDataAvailable: boolean = false;
    editMoneyUnit: boolean = false;
    isParent: boolean = false;
    isReceive: boolean;
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
            console.log(this.lstCtiets);
            this.setLevel()
            this.sum('0.1');
            this.updateEditCache();
        }
        this.capDvi = parseInt(this.userInfo.CAP_DVI, 10);
        if (this.userInfo.MA_DVI == this.baoCao.maDviCha) {
            this.capDvi += 1;
        }
        this.getStatusButton();
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
        if (this.capDvi == 1) {
            this.scrollHD = Table.tableWidth(700, 9, 1, 0);
            this.scrollVB = this.status.save ? Table.tableWidth(300, 18, 1, 60) : Table.tableWidth(500, 18, 1, 0);
        } else {
            this.scrollHD = this.status.save ? Table.tableWidth(500, 9, 1, 60) : Table.tableWidth(500, 9, 1, 0);;
            this.scrollVB = this.status.save ? Table.tableWidth(300, 16, 1, 60) : Table.tableWidth(500, 16, 1, 0);
        }

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

    setLevel() {
        this.lstCtiets.forEach(item => {
            item.level = item.stt.split('.').length - 2;
        })
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

    // luu thay doi
    saveEdit(id: string): void {
        const index = this.lstCtiets.findIndex(item => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstCtiets[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        this.sum(Table.preIndex(this.lstCtiets[index].stt));
        this.updateEditCache()
    }

    changeModel(data: ThanhToan) {
        this.editCache[data.id].data.changeModel(false, data);
    }

    sum(stt: string) {
        while (stt != '0') {
            const index = this.lstCtiets.findIndex(e => e.stt == stt);
            this.lstCtiets[index].slKeHoach = null;
            this.lstCtiets[index].slHopDong = null;
            this.lstCtiets[index].slThucHien = null;
            this.lstCtiets[index].gtHopDong = null;
            this.lstCtiets[index].gtThucHien = null;
            this.lstCtiets[index].phatViPham = null;
            this.lstCtiets[index].tlSoluong = null;
            this.lstCtiets[index].tlThanhTien = null;
            this.lstCtiets.forEach(item => {
                if (Table.preIndex(item.stt) == stt) {
                    this.lstCtiets[index].slKeHoach = Operator.sum([this.lstCtiets[index].slKeHoach, item.slKeHoach]);
                    this.lstCtiets[index].slHopDong = Operator.sum([this.lstCtiets[index].slHopDong, item.slHopDong]);
                    this.lstCtiets[index].slThucHien = Operator.sum([this.lstCtiets[index].slThucHien, item.slThucHien]);
                    this.lstCtiets[index].gtHopDong = Operator.sum([this.lstCtiets[index].gtHopDong, item.gtHopDong]);
                    this.lstCtiets[index].gtThucHien = Operator.sum([this.lstCtiets[index].gtThucHien, item.gtThucHien]);
                    this.lstCtiets[index].phatViPham = Operator.sum([this.lstCtiets[index].phatViPham, item.phatViPham]);
                    this.lstCtiets[index].tlSoluong = Operator.sum([this.lstCtiets[index].tlSoluong, item.tlSoluong]);
                    this.lstCtiets[index].tlThanhTien = Operator.sum([this.lstCtiets[index].tlThanhTien, item.tlThanhTien]);
                }
            })
            stt = Table.preIndex(stt)
        }
    }

    changeHd(id: string) {
        this.editCache[id].data.gtThucHien = Operator.mul(this.editCache[id].data.slThucHien, this.editCache[id].data.donGia);
    }

    changeVb(id: string) {
        this.editCache[id].data.cong = Operator.sum([this.editCache[id].data.ung, this.editCache[id].data.cap]);
        this.editCache[id].data.lkSauLanNay = Operator.sum([this.editCache[id].data.lkCong, this.editCache[id].data.cong]);
        this.editCache[id].data.soConPhaiNop = Operator.sum([this.editCache[id].data.gtThucHien, -this.editCache[id].data.lkSauLanNay]);
    }

    viewDetail(id: string) {
        const obj = {
            id: id,
            preData: this.dataInfo,
            tabSelected: this.dataInfo.tabSelected == Tab.VB_HOP_DONG ? Tab.VB_HOP_DONG_1 : Tab.VB_HOP_DONG,
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
        const head = [
            { t: 0, b: 5, l: 0, r: 12, val: null },
            { t: 0, b: 0, l: 0, r: 8, val: "Hợp đồng vốn bán nộp lên đơn vị cấp trên" },
            { t: 4, b: 5, l: 0, r: 0, val: 'Đơn vị' },
            { t: 4, b: 5, l: 1, r: 1, val: 'Tên khách hàng' },
            { t: 4, b: 5, l: 2, r: 2, val: 'Quyết định phê duyệt kết quả lựa chọn nhà thầu / Hợp đồng' },
            { t: 4, b: 4, l: 3, r: 5, val: 'Số lượng' },
            { t: 5, b: 5, l: 3, r: 3, val: 'Kế hoạch' },
            { t: 5, b: 5, l: 4, r: 4, val: 'Hợp đồng' },
            { t: 5, b: 5, l: 5, r: 5, val: 'Thực hiện' },
            { t: 4, b: 5, l: 6, r: 6, val: 'Đơn giá (đồng/kg)' },
            { t: 4, b: 5, l: 7, r: 7, val: 'Giá trị hợp đồng (đã bao gồm VAT (đồng)' },
            { t: 4, b: 5, l: 8, r: 8, val: 'Giá trị thực hiện (lũy kế)' },
            { t: 4, b: 5, l: 9, r: 9, val: 'Vi phạm hợp đồng' },
            { t: 4, b: 4, l: 10, r: 11, val: 'Thanh lý hợp đồng' },
            { t: 5, b: 5, l: 10, r: 10, val: 'Số lượng' },
            { t: 5, b: 5, l: 11, r: 11, val: 'Thành tiền' },
            { t: 4, b: 5, l: 12, r: 12, val: 'Công văn' },
        ]
        const fieldHD = ['tenDvi', 'tenKhachHang', 'qdPheDuyet', 'slKeHoach', 'slHopDong', 'slThucHien', 'donGia', 'gtHopDong', 'gtThucHien',
            'phatViPham', 'tlSoluong', 'tlThanhTien', 'congVan'];
        const filterHD = this.lstCtiets.filter(e => e.level > (this.capDvi == 1 ? 1 : 0)).map(item => {
            const row: any = {};
            fieldHD.forEach(field => {
                row[field] = Utils.getValue(item[field]);
            })
            return row;
        })
        // thêm công thức tính cho biểu mẫu
        const calHeaderHd = ['', 'A', 'B', '1', '2', '3', '4', '5=2x4', '6=2x4', '7', '8', '9', '10'];
        let calHd = {};
        fieldHD.forEach((field, index) => {
            calHd[field] = calHeaderHd[index];
        })
        filterHD.unshift(calHd);
        const workbook = XLSX.utils.book_new();
        const worksheetHD = Table.initExcel(head);
        XLSX.utils.sheet_add_json(worksheetHD, filterHD, { skipHeader: true, origin: Table.coo(head[0].l, head[0].b + 1) })
        //Thêm khung viền cho bảng
        for (const cell in worksheetHD) {
            if (cell.startsWith('!') || XLSX.utils.decode_cell(cell).r < 4) continue;
            worksheetHD[cell].s = Table.borderStyle;
        }

        XLSX.utils.book_append_sheet(workbook, worksheetHD, 'Hợp đồng');

        let header = [];
        let filterData = [];
        if (this.capDvi == 1) {
            header = [
                { t: 0, b: 5, l: 0, r: 18, val: null },
                { t: 0, b: 0, l: 0, r: 8, val: "Vốn bán nộp lên đơn vị cấp trên" },
                { t: 4, b: 5, l: 0, r: 0, val: 'Đơn vị' },
                { t: 4, b: 4, l: 1, r: 3, val: 'Số lượng' },
                { t: 5, b: 5, l: 1, r: 1, val: 'Kế hoạch' },
                { t: 5, b: 5, l: 2, r: 2, val: 'Hợp đồng' },
                { t: 5, b: 5, l: 3, r: 3, val: 'Thực hiện' },
                { t: 4, b: 5, l: 4, r: 4, val: 'Giá trị hợp đồng (đã bao gồm VAT (đồng)' },
                { t: 4, b: 5, l: 5, r: 5, val: 'Giá trị thực hiện (lũy kế)' },
                { t: 4, b: 5, l: 6, r: 6, val: 'Vi phạm hợp đồng' },
                { t: 4, b: 4, l: 7, r: 8, val: 'Thanh lý hợp đồng' },
                { t: 5, b: 5, l: 7, r: 7, val: 'Số lượng' },
                { t: 5, b: 5, l: 8, r: 8, val: 'Thành tiền' },
                { t: 4, b: 4, l: 9, r: 11, val: 'Số đã nộp lên đơn vị cấp trên (lũy kế)' },
                { t: 5, b: 5, l: 9, r: 9, val: 'Nộp vốn' },
                { t: 5, b: 5, l: 10, r: 10, val: 'Nộp hoàn ứng' },
                { t: 5, b: 5, l: 11, r: 11, val: 'Tổng nộp' },
                { t: 4, b: 4, l: 12, r: 15, val: 'Số nộp lần này' },
                { t: 5, b: 5, l: 12, r: 12, val: 'Ngày' },
                { t: 5, b: 5, l: 13, r: 13, val: 'Nộp vốn' },
                { t: 5, b: 5, l: 14, r: 14, val: 'Nộp hoàn ứng' },
                { t: 5, b: 5, l: 15, r: 15, val: 'Tổng nộp' },
                { t: 4, b: 5, l: 16, r: 16, val: 'Lũy kế sau lần nộp này' },
                { t: 4, b: 5, l: 17, r: 17, val: 'Số còn phải nộp' },
                { t: 4, b: 5, l: 18, r: 18, val: 'Ghi chú' },
            ]
            const fieldOrder = ['tenDvi', 'slKeHoach', 'slHopDong', 'slThucHien', 'gtHopDong', 'gtThucHien', 'phatViPham', 'tlSoluong', 'tlThanhTien',
                'lkUng', 'lkCap', 'lkCong', 'uncNgay', 'ung', 'cap', 'cong', 'lkSauLanNay', 'soConPhaiNop', 'ghiChu'];
            filterData = this.lstCtiets.filter(e => e.level < 2).map(item => {
                const row: any = {};
                fieldOrder.forEach(field => {
                    row[field] = field == 'uncNgay' ? Utils.fmtDate(item[field]) : Utils.getValue(item[field]);
                })
                return row;
            })
            // thêm công thức tính cho biểu mẫu
            const calHeader = ['A', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11=9+10', '', '12', '13', '14=12+13', '15=11+14', '16=5-6-12', 'E'];
            let cal = {};
            fieldOrder.forEach((field, index) => {
                cal[field] = calHeader[index];
            })
            filterData.unshift(cal);
        } else {
            header = [
                { t: 0, b: 5, l: 0, r: 17, val: null },
                { t: 0, b: 0, l: 0, r: 8, val: "Vốn bán nộp lên đơn vị cấp trên" },
                { t: 4, b: 5, l: 0, r: 0, val: 'Đơn vị' },
                { t: 4, b: 4, l: 1, r: 3, val: 'Số lượng' },
                { t: 5, b: 5, l: 1, r: 1, val: 'Kế hoạch' },
                { t: 5, b: 5, l: 2, r: 2, val: 'Hợp đồng' },
                { t: 5, b: 5, l: 3, r: 3, val: 'Thực hiện' },
                { t: 4, b: 5, l: 4, r: 4, val: 'Giá trị hợp đồng (đã bao gồm VAT (đồng)' },
                { t: 4, b: 5, l: 5, r: 5, val: 'Giá trị thực hiện (lũy kế)' },
                { t: 4, b: 5, l: 6, r: 6, val: 'Vi phạm hợp đồng' },
                { t: 4, b: 4, l: 7, r: 8, val: 'Thanh lý hợp đồng' },
                { t: 5, b: 5, l: 7, r: 7, val: 'Số lượng' },
                { t: 5, b: 5, l: 8, r: 8, val: 'Thành tiền' },
                { t: 4, b: 4, l: 9, r: 11, val: 'Số đã nộp lên đơn vị cấp trên (lũy kế)' },
                { t: 5, b: 5, l: 9, r: 9, val: 'Nộp vốn' },
                { t: 5, b: 5, l: 10, r: 10, val: 'Nộp hoàn ứng' },
                { t: 5, b: 5, l: 11, r: 11, val: 'Tổng nộp' },
                { t: 4, b: 4, l: 12, r: 14, val: 'Số nộp lần này' },
                { t: 5, b: 5, l: 12, r: 12, val: 'Nộp vốn' },
                { t: 5, b: 5, l: 13, r: 13, val: 'Nộp hoàn ứng' },
                { t: 5, b: 5, l: 14, r: 14, val: 'Tổng nộp' },
                { t: 4, b: 5, l: 15, r: 15, val: 'Lũy kế sau lần nộp này' },
                { t: 4, b: 5, l: 16, r: 16, val: 'Số còn phải nộp' },
                { t: 4, b: 5, l: 17, r: 17, val: 'Ghi chú' },
            ]
            const fieldOrder = ['tenDvi', 'slKeHoach', 'slHopDong', 'slThucHien', 'gtHopDong', 'gtThucHien', 'phatViPham', 'tlSoluong', 'tlThanhTien',
                'lkUng', 'lkCap', 'lkCong', 'ung', 'cap', 'cong', 'lkSauLanNay', 'soConPhaiNop', 'ghiChu'];
            filterData = this.lstCtiets.filter(e => e.level < 1).map(item => {
                const row: any = {};
                fieldOrder.forEach(field => {
                    row[field] = Utils.getValue(item[field]);
                })
                return row;
            })
            // thêm công thức tính cho biểu mẫu
            const calHeader = ['A', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11=9+10', '12', '13', '14=12+13', '15=11+14', '16=5-6-12', 'E'];
            let cal = {};
            fieldOrder.forEach((field, index) => {
                cal[field] = calHeader[index];
            })
            filterData.unshift(cal);
        }
        const worksheet = Table.initExcel(header);
        XLSX.utils.sheet_add_json(worksheet, filterData, { skipHeader: true, origin: Table.coo(header[0].l, header[0].b + 1) })
        //Thêm khung viền cho bảng
        for (const cell in worksheet) {
            if (cell.startsWith('!') || XLSX.utils.decode_cell(cell).r < 4) continue;
            worksheet[cell].s = Table.borderStyle;
        }

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Vốn bán');
        XLSX.writeFile(workbook, this.baoCao.maCapUng + '.xlsx');
    }
}
