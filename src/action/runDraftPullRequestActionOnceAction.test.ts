import type * as github from "@actions/github";

import { describe, expect, it, vi } from "vitest";

import { defaultIndicator } from "../defaults.js";
import { runDraftPullRequestOnceAction } from "./runDraftPullRequestActionOnceAction.js";

const mockGetInput = vi.fn();
const mockSetFailed = vi.fn();

vi.mock("@actions/core", () => ({
	get getInput() {
		return mockGetInput;
	},
	get setFailed() {
		return mockSetFailed;
	},
}));

const mockDraftPullRequestOnceAction = vi.fn();

vi.mock("../index.js", () => ({
	get draftPullRequestOnceAction() {
		return mockDraftPullRequestOnceAction;
	},
}));

const body = "PR body.";
const githubToken = "gho-abc123";
const drafted = false;
const nodeId = "node-id-456";
const number = 789;
const owner = "test-owner";
const repo = "test-repo";

describe(runDraftPullRequestOnceAction, () => {
	it("sets a failure if there is no pull_request or pull_request_target in the payload", async () => {
		const context = {
			payload: {},
		} as typeof github.context;

		await runDraftPullRequestOnceAction(context);

		expect(mockSetFailed).toHaveBeenCalledWith(
			"This action can only be used in a pull_request or pull_request_target event.",
		);
		expect(mockDraftPullRequestOnceAction).not.toHaveBeenCalled();
	});

	it("calls draftPullRequestOnceAction with the indicator and message when both exist", async () => {
		const indicator = "example indicator";
		const message = "This is a test message.";

		const context = {
			payload: {
				pull_request: {
					body,
					draft: drafted,
					node_id: nodeId,
					number,
				},
			},
			repo: { owner, repo },
		} as unknown as typeof github.context;

		mockGetInput
			.mockReturnValueOnce(githubToken)
			.mockReturnValueOnce(indicator)
			.mockReturnValueOnce(message);

		await runDraftPullRequestOnceAction(context);

		expect(mockDraftPullRequestOnceAction).toHaveBeenCalledWith({
			body,
			drafted,
			githubToken,
			indicator,
			message,
			nodeId,
			number,
			owner,
			repo,
		});
	});

	it("calls draftPullRequestOnceAction with the default indicator and no message when neither exist", async () => {
		const context = {
			payload: {
				pull_request: {
					body,
					draft: drafted,
					node_id: nodeId,
					number,
				},
			},
			repo: { owner, repo },
		} as unknown as typeof github.context;

		mockGetInput
			.mockReturnValueOnce(githubToken)
			.mockReturnValueOnce(undefined)
			.mockReturnValueOnce(undefined);

		await runDraftPullRequestOnceAction(context);

		expect(mockDraftPullRequestOnceAction).toHaveBeenCalledWith({
			body,
			drafted,
			githubToken,
			indicator: defaultIndicator,
			message: undefined,
			nodeId,
			number,
			owner,
			repo,
		});
	});
});
