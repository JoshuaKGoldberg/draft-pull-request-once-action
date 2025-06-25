import { describe, expect, it, vi } from "vitest";

import { draftPullRequestOnceAction } from "./index.js";

const mockInfo = vi.fn();

vi.mock("@actions/core", () => ({
	get info() {
		return mockInfo;
	},
}));

const owner = "test-owner";
const refBase = "abc123";
const refHead = "def456";
const repo = "test-repo";

describe(draftPullRequestOnceAction, () => {
	it("TODO", async () => {
		// ...
	});
});
