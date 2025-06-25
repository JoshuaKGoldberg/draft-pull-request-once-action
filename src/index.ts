import * as core from "@actions/core";

import { defaultIndicator } from "./defaults.js";

export interface DraftPullRequestOnceActionOptions {
	indicator?: string;
	message?: string;
	owner: string;
	repo: string;
}

export async function draftPullRequestOnceAction({
	indicator = defaultIndicator,
	message,
	owner,
	repo,
}: DraftPullRequestOnceActionOptions) {
	console.log("Got:", { indicator, message });
	const isDraft = await Promise.resolve(false);
	if (isDraft) {
		core.info("Pull request is already a draft.");
		return;
	}

	const currentBody = await Promise.resolve("TODO");

	if (currentBody.includes(indicator)) {
		core.info("Pull request already contains the indicator.");
		return;
	}

	// TODO: Comment with message if needed
}
