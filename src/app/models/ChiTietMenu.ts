export class ChiTietMenu {
    icon: string;
    title: string;
    url: string;
    dropdown: string;
    idHover: string;
    hasTab: boolean;
    children?: Array<ChiTietMenuItem>;
}

export class ChiTietMenuItem {
    title: string;
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
