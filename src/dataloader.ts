export let makeLoader = <T>(batch: (keys: number[]) => Promise<T[]>) => {
	let _pending: [number, (value: T) => void][] = [];
	let isRunnig = false;

	const reset = () => {
		_pending = [];
		isRunnig = false;
	};

	let run = () => {
		isRunnig = true;
		setTimeout(async () => {
			let pending = _pending;
			reset();
			let keys = pending.map(([k, _]) => k);
			let results = await batch(keys);

			results.forEach((user, i) => {
				const [_, resolve] = pending[i]!;
				resolve(user);
			});
		}, 0);
	};

	const load = async (k: number): Promise<T> => {
		const promise = new Promise((r) => {
			_pending.push([k, r]);
		});
		if (!isRunnig) {
			run();
		}

		return promise as any;
	};

	return {
		load,
	};
};
