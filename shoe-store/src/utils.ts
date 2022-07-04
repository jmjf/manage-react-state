export function arrayify<T>(data: T | T[]) {
	return Array.isArray(data) ? data : Array.of(data);
}

export function areArraysEqual(array1: any[], array2: any[]): boolean {
	return (
		array1.length === array2.length && array1.every((v, i) => v === array2[i])
	);
}
