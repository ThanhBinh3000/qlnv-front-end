import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { FileManip, Roles, Operator, Status, Table, Utils } from 'src/app/Utility/utils';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { BtnStatus, CoeffIns, Insurance } from '../lap-ke-hoach-va-tham-dinh-du-toan.constant';

@Component({
    selector: 'app-he-so-bao-hiem',
    templateUrl: './he-so-bao-hiem.component.html',
    styleUrls: ['./he-so-bao-hiem.component.scss'],
})

export class HeSoBaoHiemComponent implements OnInit {
    @Input() data;
    @Output() dataChange = new EventEmitter();
    Op = new Operator('1');
    Utils = Utils;
    Status = Status;
    //thong tin dang nhap
    userInfo: any;
    //thong tin chung bao cao
    baoCao: Insurance = new Insurance();
    editCache: { [key: string]: { edit: boolean; data: CoeffIns } } = {};
    khoiTich: number;
    maDviTien = '1';
    scrollX: string;
    //trang thai cac nut
    status: BtnStatus = new BtnStatus();
    isDataAvailable = false;
    //file
    listFile: File[] = [];                      // list file chua ten va id de hien tai o input
    fileList: NzUploadFile[] = [];
    fileDetail: NzUploadFile;

    beforeUpload = (file: NzUploadFile): boolean => {
        this.fileList = this.fileList.concat(file);
        return false;
    };

    // them file vao danh sach
    handleUpload(): void {
        this.fileList.forEach((file: any) => {
            const id = file?.lastModified.toString();
            this.baoCao.lstFiles.push({ id: id, fileName: file?.name });
            this.listFile.push(file);
        });
        this.fileList = [];
    }

    constructor(
        private lapThamDinhService: LapThamDinhService,
        private spinner: NgxSpinnerService,
        private userService: UserService,
        private notification: NzNotificationService,
        private modal: NzModalService,
        public globals: Globals,
        public fileManip: FileManip,
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
        if (this.data?.id) {
            this.baoCao.id = this.data?.id;
            await this.getDetailReport();
        } else {
            this.baoCao = this.data?.baoCao;
        }
        this.baoCao.lstCtiets = Table.sortByIndex(this.baoCao.lstCtiets);
        this.updateEditCache();
        this.getStatusButton();
    }

    //check role cho các nut trinh duyet
    getStatusButton() {
        const isChild = this.userInfo.MA_DVI == this.baoCao.maDvi;
        //kiem tra quyen cua cac user
        const checkSave = this.userService.isAccessPermisson(Roles.LTD.EDIT_COEF_INS);
        const checkSunmit = this.userService.isAccessPermisson(Roles.LTD.SUBMIT_COEF_INS);
        const checkPass = this.userService.isAccessPermisson(Roles.LTD.PASS_COEF_INS);
        const checkApprove = this.userService.isAccessPermisson(Roles.LTD.APPROVE_COEF_INS);

        this.status.general = Status.check('saveWOHist', this.baoCao.trangThai) && checkSave;
        this.status.save = Status.check('saveWOHist', this.baoCao.trangThai) && checkSave && isChild;
        this.status.submit = Status.check('submit', this.baoCao.trangThai) && checkSunmit && isChild && !(!this.baoCao.id);
        this.status.pass = Status.check('pass', this.baoCao.trangThai) && checkPass && isChild;
        this.status.approve = Status.check('approve', this.baoCao.trangThai) && checkApprove && isChild;
        if (this.status.general) {
            this.scrollX = Table.tableWidth(400, 3, 1, 60);
        } else {
            this.scrollX = Table.tableWidth(400, 3, 1, 0);
        }
    }

    back() {
        const obj = {
            tabSelected: this.data?.preTab,
        }
        this.dataChange.emit(obj);
    }

    // call chi tiet bao cao
    async getDetailReport() {
        await this.lapThamDinhService.chiTietTyLeBh(this.baoCao.id).toPromise().then(
            async (data) => {
                if (data.statusCode == 0) {
                    this.baoCao = data.data;
                    this.baoCao.listIdDeleteFiles = [];
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
        const requestGroupButtons = {
            id: this.baoCao.id,
            maChucNang: mcn,
            lyDoTuChoi: lyDoTuChoi,
        };
        await this.lapThamDinhService.trangThaiTyLeBh(requestGroupButtons).toPromise().then(async (data) => {
            if (data.statusCode == 0) {
                this.baoCao.trangThai = mcn;
                this.getStatusButton();
                if (Status.check('reject', mcn)) {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.REJECT_SUCCESS);
                } else {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
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
        if (this.listFile.some(item => item.size > Utils.FILE_SIZE)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
            return;
        }

        if (this.baoCao.lstCtiets.some(item => this.editCache[item.id].edit)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE)
        }

        const baoCaoTemp = JSON.parse(JSON.stringify(this.baoCao));

        baoCaoTemp.fileDinhKems = [];
        for (const iterator of this.listFile) {
            baoCaoTemp.fileDinhKems.push(await this.fileManip.uploadFile(iterator, this.baoCao.maDvi + '/' + this.baoCao.maBaoHiem));
        }

        // replace nhung ban ghi dc them moi id thanh null
        baoCaoTemp.lstCtiets.forEach(item => {
            if (item.id?.length == 38) {
                item.id = null;
            }
        })

        //call service them moi
        if (!this.baoCao.id) {
            this.lapThamDinhService.themMoiTyLeBh(baoCaoTemp).toPromise().then(
                async data => {
                    if (data.statusCode == 0) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
                        this.baoCao.id = data.data.id;
                        this.getDetailReport();
                    } else {
                        this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
                },
                err => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                },
            );
        } else {
            this.lapThamDinhService.capNhatTyLeBh(baoCaoTemp).toPromise().then(
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
    }

    updateEditCache(): void {
        this.baoCao.lstCtiets.forEach(item => {
            this.editCache[item.id] = {
                edit: false,
                data: {
                    ...item,
                }
            };
        });
    }

    // chuyển đổi stt đang được mã hóa thành dạng I, II, a, b, c, ...
    getChiMuc(stt: string): string {
        let str = stt.substring(stt.indexOf('.') + 1, stt.length);
        const chiSo: string[] = str.split('.');
        const n: number = chiSo.length - 1;
        let k: number = parseInt(chiSo[n], 10);
        switch (n) {
            case 0:
                return Utils.laMa(k);
            case 1:
                return chiSo[n];
            case 2:
                if (this.baoCao.lstCtiets.findIndex(e => Table.preIndex(e.maDmuc) == stt) == -1) {
                    return null;
                }
                return chiSo[n - 1].toString() + "." + chiSo[n].toString();
            default:
                return null;
        }
    }

    startEdit(id: string): void {
        this.editCache[id].edit = true;
    }

    // huy thay doi
    cancelEdit(id: string): void {
        const index = this.baoCao.lstCtiets.findIndex(item => item.id === id);
        // lay vi tri hang minh sua
        this.editCache[id] = {
            data: { ...this.baoCao.lstCtiets[index] },
            edit: false
        };
    }

    // luu thay doi
    saveEdit(id: string): void {
        const index = this.baoCao.lstCtiets.findIndex(item => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.baoCao.lstCtiets[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
    }

    updateKhoiTich() {
        this.baoCao.khoiTich = this.khoiTich;
    }

    isEdit(id: string) {
        const stt = this.baoCao.lstCtiets.find(e => e.id == id).stt;
        const index = this.baoCao.lstCtiets.findIndex(e => e.stt.startsWith(stt) && e.stt != stt);
        return index == -1;
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
        await this.fileManip.downloadFile(file, doc);
    }
}
