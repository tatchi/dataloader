const wait = (ms: number): Promise<void> =>
	new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, ms);
	});

export interface User {
	id: string;
	name: string;
}

export interface Post {
	id: string;
	title: string;
	authorId: string;
	statsId: string;
}

export interface Stats {
	id: string;
	viewCount: number;
}

export const toUserId = (id: number | string) => `user:${id}`;
export const toPostId = (id: number | string) => `post:${id}`;
export const toStatsId = (id: number | string) => `stats:${id}`;

// Sample Users
export const users: User[] = [
	{ id: toUserId(1), name: 'Alice' },
	{ id: toUserId(2), name: 'Bob' },
	{ id: toUserId(3), name: 'Charlie' },
];

const posts: Post[] = [
	// Posts for User 1 (Alice)
	...Array.from({ length: 5 }, (_, i) => ({
		id: toPostId(i + 1),
		title: `Post ${i + 1} by Alice`,
		authorId: 'user:1',
		statsId: toStatsId(i + 1),
	})),
	// Posts for User 2 (Bob)
	...Array.from({ length: 5 }, (_, i) => ({
		id: toPostId(i + 6),
		title: `Post ${i + 1} by Bob`,
		authorId: 'user:2',
		statsId: toStatsId(i + 6),
	})),
	// Posts for User 3 (Charlie)
	...Array.from({ length: 5 }, (_, i) => ({
		id: toPostId(i + 11),
		title: `Post ${i + 1} by Charlie`,
		authorId: 'user:3',
		statsId: toStatsId(i + 11),
	})),
];

// Sample Stats with Corresponding Entries for Each Post
const stats: Stats[] = [
	...Array.from({ length: 15 }, (_, i) => ({
		id: toStatsId(i + 1),
		viewCount: i + 1,
	})),
];

export const makeDb = ({ enableLog }: { enableLog: boolean }) => {
	const log: Console['log'] = (msg) => {
		if (!enableLog) return;
		console.log(msg);
	};

	const getUserById = async (id: string): Promise<User> => {
		log(`getUserById ${id}`);
		await wait(200);
		return users.find((u) => u.id === id)!;
	};

	const getUserByIds = async (ids: string[]): Promise<User[]> => {
		log(`getUserByIds [${ids.join(', ')}]`);
		await wait(200);
		// log(`SELECT * FROM USERS WHERE id in [${ids.join(',')}]`);
		return ids.map((id) => users.find((u) => u.id === id)!);
	};

	const getStatsById = async (id: string): Promise<Stats> => {
		log(`getStatsById ${id}`);
		await wait(200);
		return stats.find((st) => st.id === id)!;
	};

	const getStatsByIds = async (ids: string[]): Promise<Stats[]> => {
		log(`getStatsByIds [${ids.join(', ')}]`);
		await wait(200);
		return ids.map((id) => stats.find((st) => st.id === id)!);
	};

	const getPosts = async (): Promise<Post[]> => {
		log(`getPosts`);
		await wait(200);

		return posts;
	};

	const getFunFact = async (n: number): Promise<string> => {
		wait(200);
		return `Funfatch for viewcount = ${n}`;
	};

	const getFunFacts = async (n: number[]): Promise<string[]> => {
		wait(200);
		return n.map((n) => `Funfatch for viewcount = ${n}`);
	};

	return {
		getUserById,
		getUserByIds,
		getStatsById,
		getPosts,
		getFunFact,
		getStatsByIds,
		getFunFacts,
	};
};
