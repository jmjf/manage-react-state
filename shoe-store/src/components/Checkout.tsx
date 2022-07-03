import { BaseSyntheticEvent, useState } from 'react';

import { ICartItem } from 'models/CartItem';

// I want to filter the list of states by country
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
interface IAddress {
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
}

export function Checkout({ cartItems }: ICheckoutProps) {
	const [address, setAddress] = useState(emptyAddress);
	const [checkoutStatus, setCheckoutStatus] = useState(
		CHECKOUT_STATUS.NOT_SUBMITTED
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
	function handleSubmit(ev: any) {
		ev.preventDefault();
		setCheckoutStatus(CHECKOUT_STATUS.IS_SUBMITTING);
		// if submitted but failed setCheckoutStatus(CHECKOUT_STATUS.FAILED_SUBMIT);
		// if submitted ok setCheckoutStatus(CHECKOUT_STATUS.SUCCESSFUL_SUBMIT);
	}

	return (
		<>
			<h1>Shipping Information</h1>
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
						{countryStates
							.filter(
								(countryState) =>
									countryState.countryCode === address.countryCode
							)
							.map((countryState) => (
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
