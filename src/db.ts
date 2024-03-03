export const getUserByIds = (ids: number[]): Promise<{ userId: number }[]> =>
	new Promise((resolve) => {
		setTimeout(() => {
			console.log(`SELECT * FROM USERS WHERE id in [${ids.join(',')}]`);
			resolve(ids.map((id) => ({ userId: id })));
		}, 200);
	});
