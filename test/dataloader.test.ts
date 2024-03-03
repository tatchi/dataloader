import { expect, test, describe, spyOn } from 'bun:test';
import { makeLoader } from '~/dataloader';
import * as db from '~/db';

describe('dataloader', () => {
	test('getUserByIds', async () => {
		const spy = spyOn(db, 'getUserByIds');

		const userLoader = makeLoader((ids) => db.getUserByIds(ids));

		const ids = [1, 2, 3, 4, 5];

		const result = await Promise.all(ids.map((id) => userLoader.load(id)));

		expect(spy).toHaveBeenCalledTimes(1);
		expect(spy).toHaveBeenCalledWith(ids);

		expect(result).toEqual(
			ids.map((id) => ({
				userId: id,
			}))
		);
	});
});
