import { MAIN_ROUTES } from 'src/app/layout/main/main-routing.constant';
import { ChiTietMenu } from 'src/app/models/ChiTietMenu';

export const MAIN_ROUTE_CAPVON = MAIN_ROUTES.capVon;
export const CAP_VON_NGUON_CHI = 'cap-nguon-von-chi';
export const CAP_VON_CHI = 'cap-von-chi';
export const CAP_PHI_CHI = 'cap-phi-chi';
export const CAP_VON_MUA_BAN = 'quan-ly-cap-von-mua-ban-thanh-toan-tien-hang-dtqg';

export const ROUTE_LIST_CAP_VON: Array<any> = [
	// {
	// 	icon: 'htvbdh_tcdt_chitieukehoachnam',
	// 	title: 'Cấp vốn chi DTQG',
	// 	url: `/${MAIN_ROUTE_CAPVON}/${CAP_VON_NGUON_CHI}`,
	// 	dropdown: 'giao-chi-tieu',
	// 	idHover: 'giao-chi-tieu',
	// 	hasTab: false,
	// },
	{
		icon: 'htvbdh_tcdt_chitieukehoachnam',
		title: 'Cấp vốn chi DTQG',
		url: `/${MAIN_ROUTE_CAPVON}/${CAP_VON_CHI}`,
		dropdown: 'giao-chi-tieu',
		idHover: 'giao-chi-tieu',
		hasTab: false,
		code: 'VONPHIHANG_VONCHIDTQG'
	},
	{
		icon: 'htvbdh_tcdt_chitieukehoachnam',
		title: 'Cấp phí chi nghiệp vụ DTQG',
		url: `/${MAIN_ROUTE_CAPVON}/${CAP_PHI_CHI}`,
		dropdown: 'giao-chi-tieu',
		idHover: 'giao-chi-tieu',
		hasTab: false,
		code: 'VONPHIHANG_PHICHINGVU'
	},
	{
		icon: 'htvbdh_tcdt_kehoachvonphi',
		title: 'Cấp vốn mua, bán và thanh toán tiền hàng',
		url: `/${MAIN_ROUTE_CAPVON}/${CAP_VON_MUA_BAN}`,
		dropdown: 'giao-chi-tieu',
		idHover: 'giao-chi-tieu',
		hasTab: false,
		code: 'VONPHIHANG_VONMBANTT'
	},
]
