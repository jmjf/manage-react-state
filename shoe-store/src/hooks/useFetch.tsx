import { SetStateAction, useEffect, useState } from 'react';

interface IUseFetchResult<DataType> {
	data: DataType | DataType[];
	error: any;
	isLoading: boolean;
}

const baseUrl = process.env.REACT_APP_API_BASE_URL;

export function useFetch<DataType>(url: string): IUseFetchResult<DataType> {
	const [data, setData] = useState(null as unknown as DataType[]);
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function loadData() {
			setIsLoading(true);

			try {
				const response = await fetch(baseUrl + url);
				if (response.ok) {
					const json = await response.json();
					setData(json);
				} else {
					// HTTP error statuses go to the catch
					throw response;
				}
			} catch (err) {
				// network errors
				setError(err as SetStateAction<any>);
			}

			setIsLoading(false);
		}

		loadData();
	}, [url]);

	return { data, error, isLoading };
}
