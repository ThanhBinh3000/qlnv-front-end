
import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucTaiSanService } from 'src/app/services/danh-muc-tai-san.service';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { TaiSan } from './dialogSelectTaiSan.type';

@Component({
    selector: 'app-dialogSelectTaiSan',
    templateUrl: './dialogSelectTaiSan.component.html',
    styleUrls: ['./dialogSelectTaiSan.component.scss']
})
export class DialogSelectTaiSanComponent implements OnInit {
    data: any;
    radioValue: string = 'trung';
    listOfMapData: TaiSan[];
    listOfMapDataClone: TaiSan[];
    mapOfExpandedData: { [key: string]: TaiSan[] } = {};
    isCaseSpecial: boolean = false;
    onlyLuongThuc: boolean = false;
    onlyVatTu: boolean = false;
    options = {
        luongThuc: false,
        muoi: false,
        vatTu: false,
    };
    listDmTaiSan: any[] = [];

    constructor(
        private _modalRef: NzModalRef,
        private danhMucService: DanhMucService,
        private dmTaiSanService: DanhMucTaiSanService,
        private notification: NzNotificationService,
        private spinner: NgxSpinnerService,
    ) { }

    ngOnInit(): void {
        // this.loadDanhMucHang()
        this.getAllDmTaiSan();
    }

    handleOk() {
        this._modalRef.close();
    }

    handleCancel() {
        this._modalRef.close();
    }

    // loadDanhMucHang() {
    //     this.danhMucService.loadDanhMucHangHoa().subscribe((hangHoa) => {
    //         if (hangHoa.msg == MESSAGE.SUCCESS) {
    //             if (this.data) {
    //                 this.listOfMapData = hangHoa.data.filter(item => item.ma == this.data.slice(0, 2));
    //             } else {
    //                 if (this.onlyLuongThuc) {
    //                     this.listOfMapData = hangHoa.data.filter(item => item.ma != "02");
    //                 } else if (this.onlyVatTu) {
    //                     this.listOfMapData = hangHoa.data.filter(item => item.ma == "02");
    //                 } else {
    //                     this.listOfMapData = hangHoa.data;
    //                 }
    //             }
    //             this.listOfMapDataClone = [...this.listOfMapData];
    //             this.listOfMapData.forEach((item) => {
    //                 // Với TH là thóc và gạo
    //                 if (this.data && this.data.length > 2) {
    //                     item.child = item.child.filter(item => item.ma == this.data);
    //                 }
    //                 if (this.isCaseSpecial) {
    //                     item.child.forEach(item => {
    //                         if (item.ma.startsWith("02")) {
    //                             item.child = [];
    //                         }
    //                     })
    //                 }
    //                 this.mapOfExpandedData[item.id] = this.convertTreeToList(item);
    //             });
    //         }
    //     });
    // }


    async getAllDmTaiSan() {
        this.spinner.show();
        let body = {
            "moTa": "",
            "paggingReq": {
                "limit": 10,
                "page": 0
            },
            "tenTaiSan": "",
            "trangThai": ""
        }
        let res = await this.dmTaiSanService.search(body);
        this.spinner.hide();
        if (res.msg == MESSAGE.SUCCESS) {
            if (res.data && res.data.content && res.data.content.length > 0) {
                this.listDmTaiSan = res.data.content;
                // console.log(this.listDmTaiSan);

                this.listOfMapData = this.listDmTaiSan;
                this.listOfMapDataClone = [...this.listOfMapData];
                this.listOfMapData.forEach((item) => {
                    this.mapOfExpandedData[item.id] = this.convertTreeToList(item);
                })
            }
        } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
        }
    }

    //treeview func
    convertTreeToList(root: TaiSan): TaiSan[] {
        const stack: TaiSan[] = [];
        const array: TaiSan[] = [];
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
        node: TaiSan,
        hashMap: { [id: string]: boolean },
        array: TaiSan[],
    ): void {
        if (!hashMap[node.id]) {
            hashMap[node.id] = true;
            array.push(node);
        }
    }

    collapse(array: TaiSan[], data: TaiSan, $event: boolean): void {
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

    search(e: Event) {
        const value = (e.target as HTMLInputElement).value;
        if (!value || value.indexOf('@') >= 0) {
            this.listOfMapData = this.listOfMapDataClone;
        } else {
            this.listOfMapData = this.listOfMapDataClone.filter(
                (x) => x.tenTaiSan.toLowerCase().indexOf(value.toLowerCase()) != -1,
            );
        }
    }

    selectHangHoa(vatTu: any) {
        this._modalRef.close(vatTu);
    }

    isSelect(item: any) {
        if (item.maTaiSan.startsWith('02')) {
            if (item?.child?.length == 0 || !item?.child || item.level == 2) {
                return true
            } else {
                return false;
            }
        } else {
            if (item?.child?.length == 0 || !item?.child || item.level == 1) {
                return true
            } else {
                return false;
            }
        }
    }

    isExpand(item) {
        if (item.maTaiSan.startsWith('02')) {
            if ((!!item.child && item.child.length !== 0) && item.level < 2) {
                return true;
            } else {
                return false;
            }
        } else {
            if ((!!item.child && item.child.length !== 0) && item.level < 1) {
                return true;
            } else {
                return false;
            }
        }
    }
}
