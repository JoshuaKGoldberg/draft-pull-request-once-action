import * as github from "@actions/github";

import { runDraftPullRequestOnceAction } from "./runDraftPullRequestActionOnceAction.ts";

await runDraftPullRequestOnceAction(github.context);
