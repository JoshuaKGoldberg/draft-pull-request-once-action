import type * as github from "@actions/github";

import * as core from "@actions/core";

import { draftPullRequestOnceAction } from "../index.js";

export async function runDraftPullRequestOnceAction(
	context: typeof github.context,
) {
	console.log("Got context:", context);
	console.log("Got context.payload:", context.payload);

	await draftPullRequestOnceAction({
		indicator: core.getInput("indicator"),
		message: core.getInput("message"),
		owner: context.repo.owner,
		repo: context.repo.repo,
	});
}
