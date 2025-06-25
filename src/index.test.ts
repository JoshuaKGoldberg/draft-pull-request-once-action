import { describe, expect, it, vi } from "vitest";

import { draftPullRequestOnceAction } from "./index.js";

const mockInfo = vi.fn();

vi.mock("@actions/core", () => ({
	get info() {
		return mockInfo;
	},
}));

const mockOctokit = {
	graphql: vi.fn(),
	rest: {
		issues: {
			createComment: vi.fn(),
		},
		pulls: {
			update: vi.fn(),
		},
	},
};

vi.mock("@actions/github", () => ({
	getOctokit: () => mockOctokit,
}));

const body = "PR body.";
const githubToken = "gho-abc123";
const indicator = "example indicator";
const nodeId = "node-id-456";
const number = 789;
const owner = "test-owner";
const repo = "test-repo";

describe(draftPullRequestOnceAction, () => {
	it("does nothing if the pull request is already a draft", async () => {
		await draftPullRequestOnceAction({
			body,
			drafted: true,
			githubToken,
			indicator,
			nodeId,
			number,
			owner,
			repo,
		});

		expect(mockInfo).toHaveBeenCalledWith("Pull request is already a draft.");
		expect(mockOctokit.graphql).not.toHaveBeenCalled();
		expect(mockOctokit.rest.issues.createComment).not.toHaveBeenCalled();
		expect(mockOctokit.rest.pulls.update).not.toHaveBeenCalled();
	});

	it("does nothing if the pull request body already contains the indicator", async () => {
		await draftPullRequestOnceAction({
			body: `${body}\n\n<!-- ${indicator} -->`,
			drafted: false,
			githubToken,
			indicator,
			nodeId,
			number,
			owner,
			repo,
		});

		expect(mockInfo).toHaveBeenCalledWith(
			"Pull request already contains the indicator.",
		);
		expect(mockOctokit.graphql).not.toHaveBeenCalled();
		expect(mockOctokit.rest.issues.createComment).not.toHaveBeenCalled();
		expect(mockOctokit.rest.pulls.update).not.toHaveBeenCalled();
	});

	it("updates body and status without creating a comment when the pull request is not a draft nor has the indicator, and message is not provided", async () => {
		await draftPullRequestOnceAction({
			body,
			drafted: false,
			githubToken,
			indicator,
			nodeId,
			number,
			owner,
			repo,
		});

		expect(mockInfo).toHaveBeenCalledWith(
			`PR body updated to include comment with indicator: ${indicator}`,
		);
		expect(mockInfo).toHaveBeenCalledWith(
			"Skipping comment creation as no message is provided.",
		);
		expect(mockOctokit.graphql.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "
							mutation ($nodeId: ID!) {
								convertPullRequestToDraft(input: {pullRequestId: $nodeId}) {
									pullRequest {
										id
										isDraft
									}
								}
							}
						",
			    {
			      "nodeId": "node-id-456",
			    },
			  ],
			]
		`);
		expect(mockOctokit.rest.pulls.update.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    {
			      "body": "PR body.

			<!-- example indicator -->",
			      "draft": true,
			      "owner": "test-owner",
			      "pull_number": 789,
			      "repo": "test-repo",
			    },
			  ],
			]
		`);
		expect(mockOctokit.rest.issues.createComment).not.toHaveBeenCalled();
	});

	it("updates body and status and creates a comment when the pull request is not a draft nor has the indicator, and message is provided", async () => {
		const message = "This is a comment message.";
		const htmlUrl = "/fake/comment/url";

		mockOctokit.rest.issues.createComment.mockResolvedValueOnce({
			data: {
				html_url: htmlUrl,
			},
		});

		await draftPullRequestOnceAction({
			body,
			drafted: false,
			githubToken,
			indicator,
			message,
			nodeId,
			number,
			owner,
			repo,
		});

		expect(mockInfo).toHaveBeenCalledWith(
			`PR body updated to include comment with indicator: ${indicator}`,
		);
		expect(mockInfo).toHaveBeenCalledWith(`Comment created: ${htmlUrl}`);
		expect(mockOctokit.graphql.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "
							mutation ($nodeId: ID!) {
								convertPullRequestToDraft(input: {pullRequestId: $nodeId}) {
									pullRequest {
										id
										isDraft
									}
								}
							}
						",
			    {
			      "nodeId": "node-id-456",
			    },
			  ],
			]
		`);
		expect(mockOctokit.rest.pulls.update.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    {
			      "body": "PR body.

			<!-- example indicator -->",
			      "draft": true,
			      "owner": "test-owner",
			      "pull_number": 789,
			      "repo": "test-repo",
			    },
			  ],
			]
		`);
		expect(mockOctokit.rest.issues.createComment.mock.calls)
			.toMatchInlineSnapshot(`
			[
			  [
			    {
			      "body": "This is a comment message.",
			      "issue_number": 789,
			      "owner": "test-owner",
			      "repo": "test-repo",
			    },
			  ],
			]
		`);
	});
});
