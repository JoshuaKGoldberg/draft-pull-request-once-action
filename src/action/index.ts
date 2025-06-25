import * as github from "@actions/github";

import { runDraftPullRequestOnceAction } from "./runDraftPullRequestActionOnceAction.js";

await runDraftPullRequestOnceAction(github.context);
