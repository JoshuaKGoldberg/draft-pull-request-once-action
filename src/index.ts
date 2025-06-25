import * as core from "@actions/core";
import * as github from "@actions/github";

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

export async function draftPullRequestOnceAction({
	body,
	drafted,
	githubToken,
	indicator,
	message,
	nodeId,
	number,
	owner,
	repo,
}: DraftPullRequestOnceActionOptions) {
	if (drafted) {
		core.info("Pull request is already a draft.");
		return;
	}

	console.log({ body, indicator });
	if (body.includes(indicator)) {
		core.info("Pull request already contains the indicator.");
		return;
	}

	const octokit = github.getOctokit(githubToken);

	await Promise.all([
		octokit.graphql(
			`
				mutation ($nodeId: ID!) {
					convertPullRequestToDraft(input: {pullRequestId: $nodeId}) {
						pullRequest {
							id
							isDraft
						}
					}
				}
			`,
			{ nodeId },
		),
		octokit.rest.pulls.update({
			body: `${body}\n\n<!-- ${indicator} -->`,
			draft: true,
			owner,
			pull_number: number,
			repo,
		}),
	]);

	core.info(`PR body updated to include comment with indicator: ${indicator}`);

	if (!message) {
		core.info("Skipping comment creation as no message is provided.");
		return;
	}

	const data = await octokit.rest.issues.createComment({
		body: message,
		issue_number: number,
		owner,
		repo,
	});

	core.info(`Comment created: ${data.data.html_url}`);
}
