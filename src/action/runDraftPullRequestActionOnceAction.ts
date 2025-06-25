import type * as github from "@actions/github";

import * as core from "@actions/core";

import { defaultIndicator } from "../defaults.js";
import { draftPullRequestOnceAction } from "../index.js";
import { getTokenInput } from "./getTokenInput.js";

type PayloadData = typeof github.context.payload.pull_request & {
	body: string;
	draft: boolean;
	node_id: string;
	number: number;
};

export async function runDraftPullRequestOnceAction(
	context: typeof github.context,
) {
	const payloadData = (context.payload.pull_request ??
		context.payload.pull_request_target) as PayloadData;
	if (typeof payloadData !== "object") {
		core.setFailed(
			"This action can only be used in a pull_request or pull_request_target event.",
		);
		return;
	}

	await draftPullRequestOnceAction({
		body: payloadData.body,
		drafted: payloadData.draft,
		githubToken: getTokenInput("github-token", "GITHUB_TOKEN"),
		indicator: core.getInput("indicator") || defaultIndicator,
		message: core.getInput("message"),
		nodeId: payloadData.node_id,
		number: payloadData.number,
		owner: context.repo.owner,
		repo: context.repo.repo,
	});
}
