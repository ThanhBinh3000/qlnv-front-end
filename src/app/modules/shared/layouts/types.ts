import { BreadCrumbItem } from "../../core";

export interface CommonLayoutData {
    pageTitle: string;
    pageDes: string;
    enableInvite?: boolean;
    enableRequestLink?: boolean;
    isAddUser?: boolean;
    isIOM_AddUser?: boolean;
    breadcrumb: BreadCrumbItem[];
}

export const DEFAULT_COMMON_LAYOUT_DATA: CommonLayoutData = {
    pageTitle: '',
    pageDes: '',
    enableInvite: false,
    enableRequestLink: false,
    isAddUser: false,
    isIOM_AddUser: false,
    breadcrumb: [],
};
