import { useEffect, useState } from 'react';
import { IUseFetchResult } from './useFetch';

export function useFetchAll<DataType>(
	urls: string[]
): IUseFetchResult<DataType> {
	const [data, setData] = useState(null as unknown as DataType[]);
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const promises = urls.map((url) =>
			fetch(process.env.REACT_APP_API_BASE_URL + url).then((res) => {
				if (res.ok) return res.json();
				throw res;
			})
		);

		// Promise.all().then() gets an array of all the Promise resolved values
		Promise.all(promises)
			.then((dataItems) => setData(dataItems))
			.catch((e) => {
				console.error(e);
				setError(e);
			})
			.finally(() => setIsLoading(false));
		// eslint-disable-next-line
	}, []);

	return { data, isLoading, error };
}
