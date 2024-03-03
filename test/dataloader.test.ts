import { expect, test, describe, spyOn } from 'bun:test';
import { makeLoader } from '~/dataloader';
import { makeDb, toUserId, users, type Post, type Stats } from '~/db';

describe('dataloader', () => {
	test('getUserByIds', async () => {
		const db = makeDb({ enableLog: false });

		const spy = spyOn(db, 'getUserByIds');

		const userLoader = makeLoader((ids: string[]) => db.getUserByIds(ids));

		const ids = [1, 2, 3, 4, 5].map(toUserId);

		const result = await Promise.all(ids.map((id) => userLoader.load(id)));

		expect(spy).toHaveBeenCalledTimes(1);
		expect(spy).toHaveBeenCalledWith(ids);

		expect(result).toEqual(users);
	});
	test.skip('buildPostsSummary serial', async () => {
		const db = makeDb({ enableLog: true });

		const spyGetPosts = spyOn(db, 'getPosts');
		const spyGetUserById = spyOn(db, 'getUserById');
		const spyGetStatsById = spyOn(db, 'getStatsById');
		const spyGetFunFact = spyOn(db, 'getFunFact');

		async function buildPostsSummary() {
			let posts = await db.getPosts();
			let summary = [];
			for (let post of posts) {
				let author = await db.getUserById(post.authorId);
				let stats = await db.getStatsById(post.statsId);
				let funFact =
					stats.viewCount > 0
						? await db.getFunFact(stats.viewCount)
						: undefined;
				summary.push({
					title: post.title,
					authorName: author.name,
					viewCount: stats.viewCount,
					funFact,
				});
			}
			return summary;
		}

		console.time('buildPostsSummary');
		await buildPostsSummary();
		console.timeEnd('buildPostsSummary');

		expect(spyGetPosts).toHaveBeenCalledTimes(1);
		expect(spyGetUserById).toHaveBeenCalledTimes(15);
		expect(spyGetStatsById).toHaveBeenCalledTimes(15);
		expect(spyGetFunFact).toHaveBeenCalledTimes(15);
	});
	test('buildPostsSummary parallel', async () => {
		const db = makeDb({ enableLog: true });

		const spyGetPosts = spyOn(db, 'getPosts');
		const spyGetUserById = spyOn(db, 'getUserById');
		const spyGetStatsById = spyOn(db, 'getStatsById');
		const spyGetFunFact = spyOn(db, 'getFunFact');

		async function buildPostsSummary() {
			let posts = await db.getPosts();
			let summary = Promise.all(posts.map((post) => buildPostSummary(post)));
			return summary;
		}

		async function buildPostSummary(post: Post) {
			let [author, [stats, funFact]] = await Promise.all([
				db.getUserById(post.authorId),
				fetchStatsAndFunFact(),
			]);

			async function fetchStatsAndFunFact(): Promise<
				[Stats, string | undefined]
			> {
				let stats = await db.getStatsById(post.statsId);
				let funFact =
					stats.viewCount > 0
						? await db.getFunFact(stats.viewCount)
						: undefined;
				return [stats, funFact];
			}

			return {
				title: post.title,
				authorName: author.name,
				viewCount: stats.viewCount,
				funFact,
			};
		}

		console.time('buildPostsSummary');
		await buildPostsSummary();
		console.timeEnd('buildPostsSummary');

		expect(spyGetPosts).toHaveBeenCalledTimes(1);
		expect(spyGetUserById).toHaveBeenCalledTimes(15);
		expect(spyGetStatsById).toHaveBeenCalledTimes(15);
		expect(spyGetFunFact).toHaveBeenCalledTimes(15);
	});
});
