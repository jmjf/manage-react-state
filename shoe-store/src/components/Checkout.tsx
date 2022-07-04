import { BaseSyntheticEvent, useState } from 'react';

import { saveShippingAddress } from 'services/shippingService';

import { ICartItem } from 'models/CartItem';

// I want to filter the list of states by country
interface ICountryStates {
	countryCode: string;
	stateCode: string;
	stateName: string;
}
const countryStates = [
	{ countryCode: 'US', stateCode: 'CA', stateName: 'California' },
	{ countryCode: 'US', stateCode: 'FL', stateName: 'Florida' },
	{ countryCode: 'US', stateCode: 'NC', stateName: 'North Carolina' },
	{ countryCode: 'CA', stateCode: 'ON', stateName: 'Ontario' },
	{
		countryCode: 'CA',
		stateCode: 'NL',
		stateName: 'Newfoundland and Labrador',
	},
	{ countryCode: 'CA', stateCode: 'BC', stateName: 'British Columbia' },
	{ countryCode: 'JP', stateCode: 'Aichi', stateName: 'Aichi' },
	{ countryCode: 'JP', stateCode: 'Saitama', stateName: 'Saitama' },
	{ countryCode: 'JP', stateCode: 'Aomori', stateName: 'Aomori' },
];

const countries = [
	{ countryCode: 'US', countryName: 'United States' },
	{ countryCode: 'CA', countryName: 'Canada' },
	{ countryCode: 'JP', countryName: 'Japan' },
];
export interface IAddress {
	shipToName: string;
	addressLine1Text: string;
	addressLine2Text: string;
	cityName: string;
	stateCode: string; // or any other second level division of a country
	postalCode: string;
	countryCode: string;
}

const emptyAddress: IAddress = {
	shipToName: '',
	addressLine1Text: '',
	addressLine2Text: '',
	cityName: '',
	stateCode: '',
	postalCode: '',
	countryCode: '',
};

const CHECKOUT_STATUS = {
	NOT_SUBMITTED: 'NOT_SUBMITTED',
	IS_SUBMITTING: 'IS_SUBMITTING',
	FAILED_SUBMIT: 'FAILED_SUBMITTED',
	SUCCESSFUL_SUBMIT: 'SUCCESSFUL_SUBMIT',
};

interface ICheckoutProps {
	cartItems: ICartItem[];
	emptyCartItems: () => void;
}

export function Checkout({ cartItems, emptyCartItems }: ICheckoutProps) {
	const [address, setAddress] = useState(emptyAddress);
	const [checkoutStatus, setCheckoutStatus] = useState(
		CHECKOUT_STATUS.NOT_SUBMITTED
	);
	const [saveError, setSaveError] = useState(null as unknown as Error);

	// derived state
	const errors = getErrors(address);
	const isFormValid = Object.values(errors).every(
		(error) => error.length === 0
	);

	function handleChange(ev: BaseSyntheticEvent) {
		ev.preventDefault();

		setAddress((oldAddress) => {
			const newAddress = { ...oldAddress, [ev.target.id]: ev.target.value };
			if (ev.target.id === 'countryCode') {
				newAddress.stateCode = '';
			}
			return newAddress as IAddress;
		});
	}
	function handleBlur(e: any) {
		//TODO
	}
	async function handleSubmit(ev: any) {
		ev.preventDefault();
		setCheckoutStatus(CHECKOUT_STATUS.IS_SUBMITTING);
		if (!isFormValid) {
			setCheckoutStatus(CHECKOUT_STATUS.FAILED_SUBMIT);
			return;
		}
		try {
			const saveResult = await saveShippingAddress(address);
			console.log('saveResult', saveResult);
			if (saveResult.ok) {
				setCheckoutStatus(CHECKOUT_STATUS.SUCCESSFUL_SUBMIT);
				emptyCartItems();
			} else {
				setCheckoutStatus(CHECKOUT_STATUS.FAILED_SUBMIT);
			}
		} catch (err) {
			console.log('saveError', err);
			setSaveError(err as Error);
			// will throw an error, so don't need to set status
		}
	}

	function getValidStatesForCountry(): ICountryStates[] {
		return (
			countryStates.filter(
				(countryState) => countryState.countryCode === address.countryCode
			) ?? ([] as unknown as ICountryStates[])
		);
	}

	function getErrors(address: IAddress): IAddress {
		return {
			shipToName:
				address.shipToName.length > 0 ? '' : 'Ship to name is required',
			addressLine1Text:
				address.addressLine1Text.length > 0
					? ''
					: 'Address line 1 is required',
			addressLine2Text: '',
			cityName: address.cityName.length > 0 ? '' : 'City name is required',
			stateCode: getValidStatesForCountry().find(
				(state) => address.stateCode === state.stateCode
			)
				? ''
				: 'State code is required',
			postalCode:
				address.postalCode.length > 0 ? '' : 'Postal/ZIP code is required',
			countryCode: countries.find(
				(country) => address.countryCode === country.countryCode
			)
				? ''
				: 'Country code is required',
		};
	}

	console.log(errors);

	if (saveError) throw saveError;
	if (checkoutStatus === CHECKOUT_STATUS.SUCCESSFUL_SUBMIT) {
		return <h1>Order submitted</h1>;
	}

	return (
		<>
			<h1>Shipping Information</h1>
			{!isFormValid && checkoutStatus === CHECKOUT_STATUS.FAILED_SUBMIT && (
				<div role="alert">
					<p>Please fix these errors:</p>
					<ul>
						{Object.entries(errors).map(([key, value]) => {
							return value.length > 0 ? (
								<li key={key}>{value}</li>
							) : null;
						})}
					</ul>
				</div>
			)}
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="shipToName">Ship To</label>
					<br />
					<input
						id="shipToName"
						type="text"
						value={address.shipToName}
						onBlur={handleBlur}
						onChange={handleChange}
					/>
				</div>
				<div>
					<label htmlFor="addressLine1Text">Address Line 1</label>
					<br />
					<input
						id="addressLine1Text"
						type="text"
						value={address.addressLine1Text}
						onBlur={handleBlur}
						onChange={handleChange}
					/>
				</div>
				<div>
					<label htmlFor="addressLine2Text">Address Line 2</label>
					<br />
					<input
						id="addressLine2Text"
						type="text"
						value={address.addressLine2Text}
						onBlur={handleBlur}
						onChange={handleChange}
					/>
				</div>
				<div>
					<label htmlFor="cityName">City</label>
					<br />
					<input
						id="cityName"
						type="text"
						value={address.cityName}
						onBlur={handleBlur}
						onChange={handleChange}
					/>
				</div>
				<div>
					<label htmlFor="postalCode">Postal/ZIP code</label>
					<br />
					<input
						id="postalCode"
						type="text"
						value={address.postalCode}
						onBlur={handleBlur}
						onChange={handleChange}
					/>
				</div>
				<div>
					<label htmlFor="countryCode">Country</label>
					<br />
					<select
						id="countryCode"
						value={address.countryCode}
						onBlur={handleBlur}
						onChange={handleChange}
					>
						<option
							key=""
							value=""
						>
							Select Country
						</option>
						{countries.map((country) => (
							<option
								key={country.countryCode}
								value={country.countryCode}
							>
								{country.countryName}
							</option>
						))}
					</select>
				</div>
				<div>
					<label htmlFor="stateCode">State/Province</label>
					<br />
					<select
						id="stateCode"
						value={address.stateCode}
						onBlur={handleBlur}
						onChange={handleChange}
						disabled={address.countryCode === ''}
					>
						<option
							key=""
							value=""
						>
							Select State/Province
						</option>
						{getValidStatesForCountry().map((countryState) => (
							<option
								key={countryState.stateCode}
								value={countryState.stateCode}
							>
								{countryState.stateName}
							</option>
						))}
					</select>
				</div>
				<div>
					<input
						type="submit"
						className="btn btn-primary"
						value="Save shipping info"
						disabled={checkoutStatus === CHECKOUT_STATUS.IS_SUBMITTING}
					/>
				</div>
			</form>
		</>
	);
}
