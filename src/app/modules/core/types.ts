import { InjectionToken } from '@angular/core';
import { ApiConstant } from '../types';

export type Role = 'user' | 'admin';
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