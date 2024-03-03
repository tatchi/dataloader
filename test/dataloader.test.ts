import { expect, test, describe } from 'bun:test';
import { makeLoader } from '~/dataloader';
import { getUserByIds } from '~/db';

describe('dataloader', () => {
	test('getUserByIds', async () => {
		const userLoader = makeLoader((ids) => getUserByIds(ids));

		const ids = [1, 2, 3, 4, 5];

		const result = await Promise.all(ids.map((id) => userLoader.load(id)));

		expect(result).toEqual(
			ids.map((id) => ({
				userId: id,
			}))
		);
	});
});
