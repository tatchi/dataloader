export let makeLoader = <K, T>(batch: (keys: K[]) => Promise<T[]>) => {
	let _pending: [K, (value: T) => void][] = [];
	let isRunnig = false;

	const reset = () => {
		_pending = [];
		isRunnig = false;
	};

	let run = () => {
		isRunnig = true;
		setImmediate(async () => {
			let pending = _pending;
			reset();
			let keys = pending.map(([k, _]) => k);
			let results = await batch(keys);

			results.forEach((user, i) => {
				const [_, resolve] = pending[i]!;
				resolve(user);
			});
		});
	};

	const load = async (k: K): Promise<T> => {
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
