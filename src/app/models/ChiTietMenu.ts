import { IconConfig } from "ng-zorro-antd/core/config";

export class Menu {
    icon: string;
    title: string;
    url: string;
    hasChild: boolean;
    children?: Array<ChiTietMenu>;
}

export class ChiTietMenu {
    icon: string;
    title: string;
    loaiVthh?: string;
    url: string;
    dropdown: string;
    idHover: string;
    hasTab: boolean;
    caps?: any [];
    accessPermisson?: string;
    children?: Array<ChiTietMenuItem>;
}

export class ChiTietMenuItem {
    title: string;
    loaiVthh?: string;
    icon: string;
    hasChild: boolean;
    url: string;
    urlTongCuc: string;
    urlCuc: string;
    urlChiCuc: string;
    children?: Array<ChiTietTabMenuItem>;
}

export class ChiTietTabMenuItem {
    title: string;
    icon: string;
    url: string;
    urlTongCuc: string;
    urlCuc: string;
    urlChiCuc: string;
}
