import { createContext, Dispatch } from 'react';

import { ICartItem } from 'models/CartItem';
import { CartReducerAction } from 'reducers/cartReducer';

interface ICartContextState {
	cartItems: ICartItem[];
	dispatchCartItemsAction: Dispatch<CartReducerAction>;
}

export const CartContext = createContext<ICartContextState>(
	null as unknown as ICartContextState
);
