export interface DraftPullRequestOnceActionOptions {
	body: string;
	drafted?: boolean;
	githubToken: string;
	indicator?: string;
	message?: string;
	number: number;
	owner: string;
	repo: string;
}
export declare function draftPullRequestOnceAction({
	body,
	drafted,
	githubToken,
	indicator,
	message,
	number,
	owner,
	repo,
}: DraftPullRequestOnceActionOptions): Promise<void>;
