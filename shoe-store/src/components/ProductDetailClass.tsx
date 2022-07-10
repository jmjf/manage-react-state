import React, { Dispatch } from 'react';

import { IUseFetchResult, useFetch } from 'hooks/useFetch';
import { NavigateFunction, useNavigate, useParams } from 'react-router';

import { PageNotFound } from './PageNotFound';
import Spinner from './Spinner';

import { IProduct } from 'models/Product';
import { useCartContext } from 'hooks/useCartContext';
import { CartReducerAction } from 'reducers/cartReducer';

interface IProductDetailState {
	selectedSku: string;
}

interface IProductDetailProps {
	dispatchCartItemsAction: Dispatch<CartReducerAction>;
	fetchResponse: IUseFetchResult<IProduct>;
	navigate: NavigateFunction;
}

class ProductDetail extends React.Component<
	IProductDetailProps,
	IProductDetailState
> {
	state = {
		selectedSku: '',
	};

	render() {
		const { navigate, dispatchCartItemsAction } = this.props;
		const { isLoading, data, error } = this.props.fetchResponse;

		if (isLoading) return <Spinner />;
		if (!data) return <PageNotFound />;
		if (error) throw error;

		const onAddToCart = async (ev: React.MouseEvent<HTMLButtonElement>) => {
			ev.preventDefault();
			dispatchCartItemsAction({
				type: 'AddItemToCart',
				id: product.id,
				sku: this.state.selectedSku,
			});
			navigate('/cart', { replace: true });
		};

		const product = Array.isArray(data) ? data[0] : data;

		return (
			<div id="product-detail">
				<h1>{product.name}</h1>
				<p>{product.description}</p>
				<p id="price">${product.price}</p>
				<select
					id="size"
					value={this.state.selectedSku}
					onChange={(e) => {
						this.setState({ selectedSku: e.target.value });
					}}
				>
					<option value="">What size?</option>
					{product.skus.map((sku) => {
						return (
							<option
								key={sku.sku}
								value={sku.sku}
							>
								{sku.size}
							</option>
						);
					})}
				</select>
				<p>
					<button
						className="btn btn-primary"
						disabled={this.state.selectedSku.length === 0}
						onClick={onAddToCart}
					>
						Add to cart
					</button>
				</p>
				<img
					src={`/images/${product.image}`}
					alt={product.category}
				/>
			</div>
		);
	}
}

export function ProductDetailWrapper() {
	const { dispatchCartItemsAction } = useCartContext();
	const { id } = useParams();
	const fetchResponse = useFetch<IProduct>(`products/${id}`);

	return (
		<ProductDetail
			fetchResponse={fetchResponse}
			navigate={useNavigate()}
			dispatchCartItemsAction={dispatchCartItemsAction}
		/>
	);
}
