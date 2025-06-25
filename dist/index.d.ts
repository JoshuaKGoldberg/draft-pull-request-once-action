export interface DraftPullRequestOnceActionOptions {
	body: string;
	drafted?: boolean;
	githubToken: string;
	indicator: string;
	message?: string;
	nodeId: string;
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
	nodeId,
	number,
	owner,
	repo,
}: DraftPullRequestOnceActionOptions): Promise<void>;
