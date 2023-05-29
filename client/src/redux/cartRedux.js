import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
	name: "cart",
	initialState: {
		products: [],
		quantity: 0,
		total: 0,
		cep: undefined,
	},
	reducers: {
		addProduct: (state, action) => {
			state.quantity += 1;
			state.products.push(action.payload);
			state.total += action.payload.price * action.payload.quantity;
		},
		removeProduct: (state, action) => {
			state.quantity -= 1;
			state.products.splice(action.payload.index, 1);
			state.total -=
				action.payload.product.price * action.payload.product.quantity;
		},
		removeUnit: (state, action) => {
			state.products[action.payload.index].quantity -= 1;
			state.total -= action.payload.product.price;
		},
		addMultiple: (state, action) => {
			state.products[action.payload.index].quantity += action.payload.addN;
			state.total += action.payload.product.price;
		},
		addUnit: (state, action) => {
			state.products[action.payload.index].quantity += 1;
			state.total += action.payload.product.price;
		},
		verifyProduct: (state, action) => {
			let tempSum = 0;
			state.products = action.payload;
			state.quantity = action.payload.length;
			for (let i = 0; i < action.payload.length; i++) {
				tempSum += action.payload[i].price * action.payload[i].quantity;
			}
			state.total = tempSum;
		},
		addCep: (state, action) => {
			state.cep = action.payload;
		},
		removeCep: (state) => {
			state.cep = undefined;
		},
		emptyCart: (state) => {
			state.products = [];
			state.quantity = 0;
			state.total = 0;
		},
	},
});

export const {
	addProduct,
	removeProduct,
	removeUnit,
	addMultiple,
	verifyProduct,
	addUnit,
	addCep,
	removeCep,
	emptyCart,
} = cartSlice.actions;
export default cartSlice.reducer;
