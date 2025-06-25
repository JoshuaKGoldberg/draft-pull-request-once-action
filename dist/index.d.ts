export interface DraftPullRequestOnceActionOptions {
	indicator: string;
	message: string;
	owner: string;
	repo: string;
}
export declare function draftPullRequestOnceAction({
	indicator,
	message,
	owner,
	repo,
}: DraftPullRequestOnceActionOptions): Promise<void>;
