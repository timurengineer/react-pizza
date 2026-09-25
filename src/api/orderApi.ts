import axios from "axios";
import type { CartItem } from "../types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ORDERS_URL = `${BASE_URL}/orders`;

export interface OrderPayload {
	fullName: string;
	address: string;
	phone: string;
	items: CartItem[];
	totalPrice: number;
}

export interface Order extends OrderPayload {
	id: string;
	createdAt: string;
	delivered: boolean;
	cancelled: boolean;
}

export const submitOrder = async (order: OrderPayload): Promise<Order> => {
	const response = await axios.post<Order>(ORDERS_URL, {
		...order,
		createdAt: new Date().toISOString(),
		delivered: false,
		cancelled: false
	});

	return response.data;
};

export const getOrders = async (): Promise<Order[]> => {
	const response = await axios.get<Order[]>(ORDERS_URL);
	return response.data;
};

export const getOrderById = async (id: string): Promise<Order> => {
	const response = await axios.get<Order>(`${ORDERS_URL}/${id}`);
	return response.data;
};

export const setOrderDelivered = async (
	id: string,
	delivered: boolean
): Promise<Order> => {
	const response = await axios.put<Order>(`${ORDERS_URL}/${id}`, { delivered });
	return response.data;
};

export const cancelOrder = async (id: string): Promise<Order> => {
	const response = await axios.put<Order>(`${ORDERS_URL}/${id}`, {
		cancelled: true
	});
	return response.data;
};

// ===== Mijoz o'z buyurtmalarini kuzatishi uchun (localStorage) =====
const MY_ORDERS_KEY = "myOrderIds";

export const saveMyOrderId = (id: string) => {
	const ids = getMyOrderIds();
	if (!ids.includes(id)) {
		localStorage.setItem(MY_ORDERS_KEY, JSON.stringify([id, ...ids]));
	}
};

export const getMyOrderIds = (): string[] => {
	try {
		const raw = localStorage.getItem(MY_ORDERS_KEY);
		return raw ? (JSON.parse(raw) as string[]) : [];
	} catch {
		return [];
	}
};
