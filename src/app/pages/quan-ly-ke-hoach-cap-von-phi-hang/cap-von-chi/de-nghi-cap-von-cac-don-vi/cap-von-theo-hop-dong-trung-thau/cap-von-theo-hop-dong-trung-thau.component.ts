import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { Operator, Roles, Status, Table, Utils } from 'src/app/Utility/utils';
import { DialogCongVanComponent } from 'src/app/components/dialog/dialog-cong-van/dialog-cong-van.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { CapVonNguonChiService } from 'src/app/services/quan-ly-von-phi/capVonNguonChi.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { BtnStatus, CapVon, Cvnc, Doc, Report } from '../de-nghi-cap-von-cac-don-vi.constant';
import * as XLSX from 'xlsx-js-style';

@Component({
    selector: 'app-cap-von-theo-hop-dong-trung-thau',
    templateUrl: './cap-von-theo-hop-dong-trung-thau.component.html',
    styleUrls: ['../de-nghi-cap-von-cac-don-vi.component.scss'],
})
export class CapVonTheoHopDongTrungThauComponent implements OnInit {
    @Input() dataInfo;
    @Output() dataChange = new EventEmitter();
    Status = Status;
    Op = new Operator('1');
    Utils = Utils;
    Cvnc = Cvnc;
    //thong tin dang nhap
    userInfo: any;
    //thong tin chung bao cao
    baoCao: Report = new Report();
    lstCtiets: CapVon[] = [];
    editCache: { [key: string]: { edit: boolean; data: CapVon } } = {};
    maDviTien: string = '1';
    scrollHD: string;
    scrollCV: string;
    //trang thai cac nut
    status: BtnStatus = new BtnStatus();
    isDataAvailable: boolean = false;
    editMoneyUnit: boolean = false;
    isParent: boolean = false;
    isSynth: boolean = false;
    //file
    fileDetail: NzUploadFile;
    fileList: NzUploadFile[] = [];
    listFile: File[] = [];
    listIdDeleteFiles: string[] = [];

    beforeUpload = (file: NzUploadFile): boolean => {
        this.fileList = this.fileList.concat(file);
        return false;
    };

    // before uploaf file
    beforeUploadCV = (file: NzUploadFile): boolean => {
        const modalAppendix = this.modal.create({
            nzTitle: 'Thêm mới công văn',
            nzContent: DialogCongVanComponent,
            nzWidth: '60%',
            nzFooter: null,
            nzComponentParams: {
                soCv: this.baoCao.congVan?.fileName,
                ngayCv: this.baoCao.ngayCongVan,
            },
        });
        modalAppendix.afterClose.toPromise().then(async (res) => {
            if (res) {
                this.baoCao.ngayCongVan = res.ngayCongVan;
                this.baoCao.congVan = {
                    ...new Doc(),
                    fileName: res.soCongVan,
                };
                this.fileDetail = file;
            }
        });
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
        private CapVonNguonChiService: CapVonNguonChiService,
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
            default:
                break;
        }
        this.spinner.hide();
    }
    // khởi tạo bản ghi khi vào màn hình
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
            this.sum('0.1')
        }
        this.updateEditCache();
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
        // this.status.export = this.baoCao.trangThai == Status.TT_07 && this.userService.isAccessPermisson(Roles.CVNC.EXPORT_CV) && isChild;
        this.status.export = this.userService.isAccessPermisson(Roles.CVNC.EXPORT_CV) && isChild && !(!this.baoCao.id);

        this.status.save = this.status.save && this.userService.isAccessPermisson(Roles.CVNC.EDIT_CV);
        this.status.submit = this.status.submit && this.userService.isAccessPermisson(Roles.CVNC.SUBMIT_CV);
        this.status.pass = this.status.pass && this.userService.isAccessPermisson(Roles.CVNC.PASS_CV);
        this.status.approve = this.status.approve && this.userService.isAccessPermisson(Roles.CVNC.APPROVE_CV);

        this.isSynth = isChild && this.userService.isTongCuc() && this.baoCao.loaiDnghi != Cvnc.VTU;
        if (this.baoCao.loaiDnghi != Cvnc.VTU) {
            this.scrollHD = this.status.save ? Table.tableWidth(500, 7, 1, 60) : Table.tableWidth(500, 7, 1, 0);
            this.scrollCV = this.status.save ? Table.tableWidth(300, 17, 1, 60) : Table.tableWidth(500, 17, 1, 0);
        } else {
            this.scrollHD = this.status.save ? Table.tableWidth(500, 9, 1, 60) : Table.tableWidth(500, 9, 1, 0);;
            this.scrollCV = this.status.save ? Table.tableWidth(300, 19, 1, 60) : Table.tableWidth(300, 19, 1, 0);
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
    // set lại level cho từng hàng theo số thứ tự
    setLevel() {
        this.lstCtiets.forEach(item => {
            item.level = item.stt.split('.').length - 2;
        })
    }
    // call chi tiet bao cao
    async getDetailReport() {
        await this.CapVonNguonChiService.ctietDeNghi(this.baoCao.id).toPromise().then(
            async (data) => {
                if (data.statusCode == 0) {
                    this.baoCao = data.data;
                    this.lstCtiets = [];
                    data.data.lstCtiets.forEach(item => {
                        this.lstCtiets.push(new CapVon(item));
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
    // trình duyệt
    async submitReport() {
        // kiểm tra file công văn có được upload thành công không
        // if (!this.baoCao.congVan?.fileUrl) {
        //     this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
        //     return;
        // }
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
        const requestGroupButtons = {
            id: this.baoCao.id,
            maChucNang: mcn,
            lyDoTuChoi: lyDoTuChoi,
        };
        await this.CapVonNguonChiService.trinhDeNghi(requestGroupButtons).toPromise().then(async (data) => {
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
        // kiểm tra còn hàng nào ở trạng thái edit không
        if (this.lstCtiets.some(e => this.editCache[e.id].edit)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }
        if (this.baoCao.lstFiles.some(e => e.isEdit)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOT_SAVE_FILE);
            return;
        }
        // kiểm tra giới hạn của các trường
        if (this.lstCtiets.some(e => e.upperBound())) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
            return;
        }
        // kiểm tra giới hạn của kích cỡ file
        if (this.listFile.some(file => file.size > Utils.FILE_SIZE)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
            return;
        }

        const lstCtietTemp: CapVon[] = [];
        this.lstCtiets.forEach(item => {
            lstCtietTemp.push(item.request())
        })
        const request = JSON.parse(JSON.stringify(this.baoCao));
        request.lstCtiets = lstCtietTemp;
        // upload file đính kèm
        request.fileDinhKems = [];
        for (let iterator of this.listFile) {
            const id = iterator?.lastModified.toString();
            const noiDung = this.baoCao.lstFiles.find(e => e.id == id)?.noiDung;
            request.fileDinhKems.push(await this.quanLyVonPhiService.upFile(iterator, this.baoCao.maDvi + '/' + this.baoCao.maDnghi, noiDung));
        }
        request.fileDinhKems = request.fileDinhKems.concat(this.baoCao.lstFiles.filter(e => typeof e.id == 'number'))
        //upload file công văn
        // const file: any = this.fileDetail;
        // if (file) {
        //     if (file.size > Utils.FILE_SIZE) {
        //         this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
        //         return;
        //     } else {
        //         request.congVan = {
        //             ...await this.quanLyVonPhiService.upFile(file, this.baoCao.maDvi + '/' + this.baoCao.maDnghi),
        //             fileName: this.baoCao.congVan.fileName,
        //         }
        //     }
        // }

        // nếu không tồn tại id thì thêm mới, ngược lại thì cập nhật
        if (!this.baoCao.id) {
            this.CapVonNguonChiService.taoMoiDeNghi(request).toPromise().then(
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
            this.CapVonNguonChiService.updateDeNghi(request).toPromise().then(
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
    // update ;ại editCache khi dữ liệu thay đổi
    updateEditCache(): void {
        this.lstCtiets.forEach(item => {
            this.editCache[item.id] = {
                edit: false,
                data: new CapVon(item)
            };
        });
    }
    // chuyển hàng được chọn sang trạng thái edit
    startEdit(id: string): void {
        this.editCache[id].edit = true;
    }
    // huy thay doi
    cancelEdit(id: string): void {
        const index = this.lstCtiets.findIndex(item => item.id === id);
        // lay vi tri hang minh sua
        this.editCache[id] = {
            data: new CapVon(this.lstCtiets[index]),
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
    // tính toán các giá trị khi thay đổi về số lượng
    changeTien(id: string) {
        this.editCache[id].data.gtThucHien = Operator.mul(this.editCache[id].data.slThucHien, this.editCache[id].data.donGia);
    }
    // tính toán lại các trường khi thay đổi vốn
    changeModel(id: string) {
        const gt = this.baoCao.loaiDnghi == Cvnc.VTU ? this.editCache[id].data.gtThucHien : this.editCache[id].data.gtHopDong;
        this.editCache[id].data.tongVonVaDtoanDaCap = Operator.sum([this.editCache[id].data.lkCong, this.editCache[id].data.dtoanDaGiao]);
        this.editCache[id].data.vonDnCapLanNay = Operator.sum([gt, -this.editCache[id].data.tongVonVaDtoanDaCap]);
        this.editCache[id].data.cong = Operator.sum([this.editCache[id].data.ung, this.editCache[id].data.cap]);
        this.editCache[id].data.tongTien = Operator.sum([this.editCache[id].data.tongVonVaDtoanDaCap, this.editCache[id].data.cong]);
        this.editCache[id].data.soConDuocCap = Operator.sum([gt, -this.editCache[id].data.tongTien]);
    }
    // cộng từ mức con lên mức cha
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
            if (stt == '0.1') {
                const gt = this.baoCao.loaiDnghi == Cvnc.VTU ? this.lstCtiets[index].gtThucHien : this.lstCtiets[index].gtHopDong;
                this.lstCtiets[index].tongVonVaDtoanDaCap = Operator.sum([this.lstCtiets[index].lkCong, this.lstCtiets[index].dtoanDaGiao]);
                this.lstCtiets[index].vonDnCapLanNay = Operator.sum([gt, -this.lstCtiets[index].tongVonVaDtoanDaCap]);
                this.lstCtiets[index].cong = Operator.sum([this.lstCtiets[index].ung, this.lstCtiets[index].cap]);
                this.lstCtiets[index].tongTien = Operator.sum([this.lstCtiets[index].tongVonVaDtoanDaCap, this.lstCtiets[index].cong]);
                this.lstCtiets[index].soConDuocCap = Operator.sum([gt, -this.lstCtiets[index].tongTien]);
            }
            stt = Table.preIndex(stt)
        }
    }
    // xem chi tiết đề nghị cấp vốn được tổng hợp
    viewDetail(id: string) {
        const obj = {
            id: id,
            preData: this.dataInfo,
            tabSelected: Cvnc.DN_HOP_DONG,
        }
        this.dataChange.emit(obj);
    }
    // xoa file trong bang file
    deleteFile(id: string): void {
        this.baoCao.lstFiles = this.baoCao.lstFiles.filter((a: any) => a.id !== id);
        this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
        this.baoCao.listIdDeleteFiles.push(id);
    }
    // download file về máy
    async downloadFile(id: string) {
        let file: any;
        let doc: any;
        if (!id) {
            file = this.fileDetail;
            doc = this.baoCao.congVan
        } else {
            file = this.listFile.find(element => element?.lastModified.toString() == id);
            doc = this.baoCao.lstFiles.find(element => element?.id == id);
        }
        await this.quanLyVonPhiService.downFile(file, doc);
    }
    // export báo cáo thành excel
    exportToExcel() {
        if (this.lstCtiets.some(e => this.editCache[e.id].edit)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }
        const congVan = this.baoCao.congVan?.fileName ? Utils.getDocName(this.baoCao.congVan.fileName, this.baoCao.ngayCongVan, this.baoCao.tenDvi) : '';
        const workbook = XLSX.utils.book_new();
        // export sheet hợp đồng
        let headerHD = [];
        let fieldHD = [];
        let calHeaderHd = [];
        if (this.baoCao.loaiDnghi == Cvnc.VTU) {
            headerHD = [
                { t: 0, b: 5, l: 0, r: 11, val: null },
                { t: 0, b: 0, l: 0, r: 8, val: "Hợp đồng" },
                { t: 1, b: 1, l: 0, r: 8, val: congVan },
                { t: 4, b: 5, l: 0, r: 0, val: 'Tên khách hàng' },
                { t: 4, b: 5, l: 1, r: 1, val: 'Quyết định phê duyệt kết quả lựa chọn nhà thầu / Hợp đồng' },
                { t: 4, b: 4, l: 2, r: 4, val: 'Số lượng' },
                { t: 5, b: 5, l: 2, r: 2, val: 'Kế hoạch' },
                { t: 5, b: 5, l: 3, r: 3, val: 'Hợp đồng' },
                { t: 5, b: 5, l: 4, r: 4, val: 'Thực hiện' },
                { t: 4, b: 5, l: 5, r: 5, val: 'Đơn giá (đồng / kg)' },
                { t: 4, b: 5, l: 6, r: 6, val: 'Giá trị hợp đồng (đã bao gồm VAT) (đồng)' },
                { t: 4, b: 5, l: 7, r: 7, val: 'Giá trị thực hiện' },
                { t: 4, b: 5, l: 8, r: 8, val: 'Vi phạm hợp đồng' },
                { t: 4, b: 4, l: 9, r: 10, val: 'Thanh lý hợp đồng' },
                { t: 5, b: 5, l: 9, r: 9, val: 'Số lượng' },
                { t: 5, b: 5, l: 10, r: 10, val: 'Thành tiền' },
                { t: 4, b: 5, l: 11, r: 11, val: 'Công văn' },
            ]
            fieldHD = ['tenKhachHang', 'qdPheDuyet', 'slKeHoach', 'slHopDong', 'slThucHien', 'donGia', 'gtHopDong', 'gtThucHien', 'phatViPham',
                'tlSoluong', 'tlThanhTien', 'congVan'];
            calHeaderHd = ['B', 'C', '1', '2', '3', '4', '5=2x4', '6=3x4', '7', '8', '9', '10'];
        } else {
            headerHD = [
                { t: 0, b: 5, l: 0, r: 9, val: null },
                { t: 0, b: 0, l: 0, r: 8, val: "Hợp đồng" },
                { t: 1, b: 1, l: 0, r: 8, val: congVan },
                { t: 4, b: 5, l: 0, r: 0, val: 'Đơn vị' },
                { t: 4, b: 5, l: 1, r: 1, val: 'Quyết định phê duyệt kết quả lựa chọn nhà thầu / Hợp đồng' },
                { t: 4, b: 4, l: 2, r: 3, val: 'Số lượng' },
                { t: 5, b: 5, l: 2, r: 2, val: 'Kế hoạch' },
                { t: 5, b: 5, l: 3, r: 3, val: 'Hợp đồng' },
                { t: 4, b: 5, l: 4, r: 4, val: 'Đơn giá (đồng / kg)' },
                { t: 4, b: 5, l: 5, r: 5, val: 'Giá trị hợp đồng (đã bao gồm VAT) (đồng)' },
                { t: 4, b: 5, l: 6, r: 6, val: 'Vi phạm hợp đồng' },
                { t: 4, b: 4, l: 7, r: 8, val: 'Thanh lý hợp đồng' },
                { t: 5, b: 5, l: 7, r: 7, val: 'Số lượng' },
                { t: 5, b: 5, l: 8, r: 8, val: 'Thành tiền' },
                { t: 4, b: 5, l: 9, r: 9, val: 'Công văn' },
            ]
            fieldHD = ['tenDvi', 'qdPheDuyet', 'slKeHoach', 'slHopDong', 'donGia', 'gtHopDong', 'phatViPham',
                'tlSoluong', 'tlThanhTien', 'congVan'];
            calHeaderHd = ['A', 'C', '1', '2', '4', '5=2x4', '7', '8', '9', '10'];
        }
        const filterDataHD = this.lstCtiets.filter(e => e.level > (this.isSynth ? 1 : 0)).map(item => {
            const row: any = {};
            fieldHD.forEach(field => {
                row[field] = Utils.getValue(item[field]);
            })
            return row;
        })
        // thêm công thức tính cho biểu mẫu
        const calHd = {};
        fieldHD.forEach((field, index) => {
            calHd[field] = calHeaderHd[index];
        })
        filterDataHD.unshift(calHd);
        const worksheetHD = Table.initExcel(headerHD);
        XLSX.utils.sheet_add_json(worksheetHD, filterDataHD, { skipHeader: true, origin: Table.coo(headerHD[0].l, headerHD[0].b + 1) })
        //Thêm khung viền cho bảng
        for (const cell in worksheetHD) {
            if (cell.startsWith('!') || XLSX.utils.decode_cell(cell).r < 4) continue;
            worksheetHD[cell].s = Table.borderStyle;
        }
        XLSX.utils.book_append_sheet(workbook, worksheetHD, 'Hợp đồng');
        // export sheet cap von
        let header = [];
        let fieldOrder = [];
        let calHeader = [];
        if (this.baoCao.loaiDnghi == Cvnc.VTU) {
            header = [
                { t: 0, b: 5, l: 0, r: 22, val: null },
                { t: 0, b: 0, l: 0, r: 8, val: "Cấp vốn" },
                { t: 1, b: 1, l: 0, r: 8, val: congVan },
                { t: 4, b: 5, l: 0, r: 0, val: 'Đơn vị' },
                { t: 4, b: 4, l: 1, r: 3, val: 'Số lượng' },
                { t: 5, b: 5, l: 1, r: 1, val: 'Kế hoạch' },
                { t: 5, b: 5, l: 2, r: 2, val: 'Hợp đồng' },
                { t: 5, b: 5, l: 3, r: 3, val: 'Thực hiện' },
                { t: 4, b: 5, l: 4, r: 4, val: 'Giá trị hợp đồng (đã bao gồm VAT) (đồng)' },
                { t: 4, b: 5, l: 5, r: 5, val: 'Giá trị thực hiện' },
                { t: 4, b: 5, l: 6, r: 6, val: 'Dự toán đã giao' },
                { t: 4, b: 4, l: 7, r: 9, val: 'Lũy kế vốn cấp đến thời điểm báo cáo' },
                { t: 5, b: 5, l: 7, r: 7, val: 'Vốn ứng' },
                { t: 5, b: 5, l: 8, r: 8, val: 'Vốn cấp' },
                { t: 5, b: 5, l: 9, r: 9, val: 'Cộng' },
                { t: 4, b: 5, l: 10, r: 10, val: 'Tổng vốn và dự toán đã cấp đến thời điểm báo cáo' },
                { t: 4, b: 5, l: 11, r: 11, val: 'Vốn đề nghị cấp lần này' },
                { t: 4, b: 4, l: 12, r: 16, val: 'Vốn duyệt cấp lần này' },
                { t: 5, b: 5, l: 12, r: 12, val: 'Ngày' },
                { t: 5, b: 5, l: 13, r: 13, val: 'Niên độ NS' },
                { t: 5, b: 5, l: 14, r: 14, val: 'Vốn ứng' },
                { t: 5, b: 5, l: 15, r: 15, val: 'Vốn cấp' },
                { t: 5, b: 5, l: 16, r: 16, val: 'Cộng' },
                { t: 4, b: 5, l: 17, r: 17, val: 'Tổng cấp (tổng tiền được cấp sau lần này)' },
                { t: 4, b: 5, l: 18, r: 18, val: 'Số còn được cấp' },
                { t: 4, b: 5, l: 19, r: 19, val: 'Vi phạm hợp đồng' },
                { t: 4, b: 4, l: 20, r: 21, val: 'Thanh lý hợp đồng' },
                { t: 5, b: 5, l: 20, r: 20, val: 'Số lượng' },
                { t: 5, b: 5, l: 21, r: 21, val: 'Thành tiền' },
                { t: 4, b: 5, l: 22, r: 22, val: 'Ghi chú' },
            ]
            fieldOrder = ['tenDvi', 'slKeHoach', 'slHopDong', 'slThucHien', 'gtHopDong', 'gtThucHien', 'dtoanDaGiao', 'lkUng', 'lkCap', 'lkCong',
                'tongVonVaDtoanDaCap', 'vonDnCapLanNay', 'uncNgay', 'uncNienDo', 'ung', 'cap', 'cong', 'tongTien', 'soConDuocCap', 'phatViPham', 'tlSoluong', 'tlThanhTien', 'ghiChu'];
            calHeader = ['A', '1', '2', '3', '4', '5', '6', '7', '8', '9=7+8', '10=6+9', '11=5-10', '12', '13', '14', '15', '16=14+15', '17=10+16', '18=5-17', '19', '20', '21', 'D'];
        } else {
            header = [
                { t: 0, b: 5, l: 0, r: 18, val: null },
                { t: 0, b: 0, l: 0, r: 8, val: "Cấp vốn" },
                { t: 1, b: 1, l: 0, r: 8, val: congVan },
                { t: 4, b: 5, l: 0, r: 0, val: 'Đơn vị' },
                { t: 4, b: 4, l: 1, r: 2, val: 'Số lượng' },
                { t: 5, b: 5, l: 1, r: 1, val: 'Kế hoạch' },
                { t: 5, b: 5, l: 2, r: 2, val: 'Hợp đồng' },
                { t: 4, b: 5, l: 3, r: 3, val: 'Giá trị hợp đồng (đã bao gồm VAT) (đồng)' },
                { t: 4, b: 5, l: 4, r: 4, val: 'Dự toán đã giao' },
                { t: 4, b: 4, l: 5, r: 7, val: 'Lũy kế vốn cấp đến thời điểm báo cáo' },
                { t: 5, b: 5, l: 5, r: 5, val: 'Vốn ứng' },
                { t: 5, b: 5, l: 6, r: 6, val: 'Vốn cấp' },
                { t: 5, b: 5, l: 7, r: 7, val: 'Cộng' },
                { t: 4, b: 5, l: 8, r: 8, val: 'Tổng vốn và dự toán đã cấp đến thời điểm báo cáo' },
                { t: 4, b: 5, l: 9, r: 9, val: 'Vốn đề nghị cấp lần này' },
                { t: 4, b: 4, l: 10, r: 12, val: 'Vốn duyệt cấp lần này' },
                { t: 5, b: 5, l: 10, r: 10, val: 'Vốn ứng' },
                { t: 5, b: 5, l: 11, r: 11, val: 'Vốn cấp' },
                { t: 5, b: 5, l: 12, r: 12, val: 'Cộng' },
                { t: 4, b: 5, l: 13, r: 13, val: 'Tổng cấp (tổng tiền được cấp sau lần này)' },
                { t: 4, b: 5, l: 14, r: 14, val: 'Số còn được cấp' },
                { t: 4, b: 5, l: 15, r: 15, val: 'Vi phạm hợp đồng' },
                { t: 4, b: 4, l: 16, r: 17, val: 'Thanh lý hợp đồng' },
                { t: 5, b: 5, l: 16, r: 16, val: 'Số lượng' },
                { t: 5, b: 5, l: 17, r: 17, val: 'Thành tiền' },
                { t: 4, b: 5, l: 18, r: 18, val: 'Ghi chú' },
            ]
            fieldOrder = ['tenDvi', 'slKeHoach', 'slHopDong', 'gtHopDong', 'dtoanDaGiao', 'lkUng', 'lkCap', 'lkCong', 'tongVonVaDtoanDaCap', 'vonDnCapLanNay',
                'ung', 'cap', 'cong', 'tongTien', 'soConDuocCap', 'phatViPham', 'tlSoluong', 'tlThanhTien', 'ghiChu'];
            calHeader = ['A', '1', '2', '4', '6', '7', '8', '9=7+8', '10=6+9', '11=4-10', '14', '15', '16=14+15', '17=10+16', '18=4-17', '19', '20', '21', 'D'];
        }
        const filterData = this.lstCtiets.filter(e => e.level < (this.isSynth ? 2 : 1)).map(item => {
            const row: any = {};
            fieldOrder.forEach(field => {
                row[field] = field == 'uncNgay' ? Utils.fmtDate(item[field]) : Utils.getValue(item[field]);
            })
            return row;
        })
        // thêm công thức tính cho biểu mẫu
        const cal = {};
        fieldOrder.forEach((field, index) => {
            cal[field] = calHeader[index];
        })
        filterData.unshift(cal);
        const worksheet = Table.initExcel(header);
        XLSX.utils.sheet_add_json(worksheet, filterData, { skipHeader: true, origin: Table.coo(header[0].l, header[0].b + 1) })
        //Thêm khung viền cho bảng
        for (const cell in worksheet) {
            if (cell.startsWith('!') || XLSX.utils.decode_cell(cell).r < 4) continue;
            worksheet[cell].s = Table.borderStyle;
        }

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Cấp vốn');
        XLSX.writeFile(workbook, this.baoCao.maDnghi + '.xlsx');
    }
}
