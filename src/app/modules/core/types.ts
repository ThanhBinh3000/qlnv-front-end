import { InjectionToken } from '@angular/core';
import { ApiConstant } from '../types';

export type Role = 'user' | 'admin';
export type ScoreOutcome = 'none' | 'accepted' | 'rejected';

export interface DirtyComponent {
    isDirty: boolean;
}

export interface CommonDirtyComponent {
    childComponent: DirtyComponent;
}

export interface AgencyInfo {
    id: string;
    name: string;
}

export interface GenericUserInfo {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    role: Role;
    lastLoginTime?: string;
    status: {
        id: number;
        value: string;
    };
    geography: GeographyInfo;
    region: {
        id: string;
        value: string;
    };
    managerId?: string;
    language?: {
        id: number;
        code: string;
        name: string;
    };
}

export interface UserInfo {
    id: string;
    username: string;
    firstname: string;
    lastname: string;
    fullname?: string;
    email: string;
    role: string;
    lastLoginTime: string;
    status: string;
    genderId: string;
    genderName: string;
    countryId: string;
    countryName: string;
    educationId: string;
    educationName: string;
    address: string;
    dob: string;
    phoneNumber: string;
}

export interface BookingInfo {
    id: string;
    dateBook: string;
    timeBookingId: string;
    timeBooking: string;
    containerId?: string;
    containerName: string;
    nurseId: string;
    nurseName: string;
    patientId: string;
    patientName: string;
    products: ProductsInfo[];
    status: string;
    statusBook: string;
    bookingCount: number;
}

export interface ProductsInfo {
    id: string;
    createdAt: string;
    updatedAt: string;
    createdDate: string;
    updatedDate: string;
    isDelete?: boolean;
    product: ProductTableInfo;
}
export interface ProductTableInfo {
    id: string;
    name: string;
    sku: string;
    image: string;
    categoryId?: string;
    categoryName?: string;
    createdDate: string;
    updatedDate: string;
    createdAt?: string;
    updatedAt?: string;
    isDelete?: boolean;
}

export interface WareHouseTableInfo {
    id: string;
    name: string;
    address: string;
    countryId: string;
    countryName: string;
    createdDate: string;
    updatedDate: string;
}

export interface WareHouseProductTableInfo {
    id: string;
    quantity: string;
    productId: string;
    productName: string;
    warehouseId: string;
    warehouseName: string;
    createdDate: string;
    updatedDate: string;
}

export interface ContainerTableInfo {
    id: string;
    name: string;
    description: string;
    location: string;
    longitude: string;
    latitude: string;
    warehouseId: string;
    warehouseName: string;
    nurseId: string;
    nurseName: string;
    phoneNumber: string;
}

export interface UserInfoCollection {
    users: UserInfo[];
    userCount: number;
    startAtPage?: { pageIndex: number };
}

export interface ProductInfoCollection {
    products: ProductTableInfo[];
    productCount: number;
    startAtPage?: { pageIndex: number };
}

export interface WareHouseInfoCollection {
    warehouses: WareHouseTableInfo[];
    warehouseCount: number;
    startAtPage?: { pageIndex: number };
}

export interface WareHouseProductInfoCollection {
    warehouseproducts: WareHouseProductTableInfo[];
    warehouseproductCount: number;
    startAtPage?: { pageIndex: number };
}

export interface BookingInfoCollection {
    bookings: BookingInfo[];
    bookingCount: number;
    startAtPage?: { pageIndex: number };
}

export interface ContainerInfoCollection {
    containers: ContainerTableInfo[];
    containerCount: number;
    startAtPage?: { pageIndex: number };
}
export interface BreadCrumbItem {
    name: string;
    path: string;
    context?: any;
}

export interface BreadcrumbAction {
    name: string;
    iconCls: string;
    actionFn: Function;
}

export interface GeographyInfo {
    id: string;
    value: string;
    region: StringValuePair;
}

export interface StringValuePair {
    id: string;
    value: string;
}

export const REGION_API_TOKEN = new InjectionToken<ApiConstant>('api.constant');

export interface RegionGeographies {
    id: string;
    value: string;
    geographies: StringValuePair[];
}

export interface Login {
    response: {
        accessToken: string;
    };
}

export interface UserReponse {
    response: {
        user: UserInfo;
    };
}

export interface Gender {
    id: string,
    name: string,
    value: string,
}

export interface Category {
    id: string,
    name: string,
    value: string,
}

export interface Education {
    id: string,
    name: string,
    value: string,
}

export interface General {
    id: string,
    name: string,
    value: string,
    parentId: string
}

export interface Container {
    id: string,
    name: string,
}

export interface Nurse {
    id: string,
    username: string,
}

export interface PatientRecordsInfo {
    name: string;
	patientCode: string;
    age: number;
    tags: string;
    sexId: string;
    sex: string;
}

export interface PatientRecordsInfoCollection {
    patientRecords: PatientRecordsInfo[];
    patientRecordsCount: number;
    startAtPage?: { pageIndex: number };
}
