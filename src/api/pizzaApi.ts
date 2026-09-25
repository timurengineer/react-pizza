import axios from "axios";
import type { Pizza } from "../types";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/pizzas`;

export const getPizzas = async (): Promise<Pizza[]> => {
	const response = await axios.get<Pizza[]>(API_URL);

	return response.data;
};

export type PizzaInput = Omit<Pizza, "id">;

export const createPizza = async (pizza: PizzaInput): Promise<Pizza> => {
	const response = await axios.post<Pizza>(API_URL, pizza);
	return response.data;
};

export const updatePizza = async (
	id: number,
	pizza: PizzaInput
): Promise<Pizza> => {
	const response = await axios.put<Pizza>(`${API_URL}/${id}`, pizza);
	return response.data;
};

export const deletePizza = async (id: number): Promise<void> => {
	await axios.delete(`${API_URL}/${id}`);
};
