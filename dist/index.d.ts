export interface DraftPullRequestOnceActionOptions {
	body: string;
	drafted?: boolean;
	githubToken: string;
	id: number;
	indicator: string;
	message?: string;
	number: number;
	owner: string;
	repo: string;
}
export declare function draftPullRequestOnceAction({
	body,
	drafted,
	githubToken,
	id,
	indicator,
	message,
	number,
	owner,
	repo,
}: DraftPullRequestOnceActionOptions): Promise<void>;
