import { defineConfig } from "@hanfani/guard/config";

/**
 * Minimal Hanfani Guard configuration for this repository.
 *
 * Enabled: Conventional Commits, no commit bodies, no AI co-author trailers,
 * pre-commit validation, and blocking obvious mistakes (debug statements,
 * secrets, syntax errors).
 *
 * Disabled / left off: optional style, duplication, testing, CI, regression,
 * and pre-push hooks that would pressure unrelated application changes.
 */
export default defineConfig({
  commits: {
    conventional: true,
    body: false,
    coAuthors: false,
  },

  comments: {
    style: "off",
  },

  testing: {
    required: false,
    changedFilesOnly: true,
  },

  github: {
    requireCI: false,
  },

  code: {
    todos: "off",
    debugStatements: "error",
    duplication: "off",
    syntax: "error",
  },

  security: {
    secrets: "error",
  },

  regression: {
    enabled: false,
  },

  hooks: {
    preCommit: true,
    commitMsg: true,
    prePush: false,
  },
});
