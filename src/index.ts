import * as core from "@actions/core";
import * as github from "@actions/github";

export interface DraftPullRequestOnceActionOptions {
	body: string;
	drafted?: boolean;
	githubToken: string;
	indicator: string;
	message?: string;
	number: number;
	owner: string;
	repo: string;
}

export async function draftPullRequestOnceAction({
	body,
	drafted,
	githubToken,
	indicator,
	message,
	number,
	owner,
	repo,
}: DraftPullRequestOnceActionOptions) {
	if (drafted) {
		core.info("Pull request is already a draft.");
		return;
	}

	console.log({ indicator });
	if (body.includes(indicator)) {
		core.info("Pull request already contains the indicator.");
		return;
	}

	if (!message) {
		core.info("Skipping comment creation as no message is provided.");
		return;
	}

	const octokit = github.getOctokit(githubToken);

	const data = await octokit.rest.issues.createComment({
		body: message,
		issue_number: number,
		owner,
		repo,
	});

	core.info(`Comment created: ${data.data.html_url}`);
}
