---
name: git-commit
description: Create a git commit from the current changes, writing the commit message from the actual diff. Use when the user asks to commit, make a commit, commit the changes, or save changes to git. Commits only; never pushes.
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git add:*), Bash(git commit:*), Bash(git show:*), Bash(git branch:*), Bash(git rev-parse:*)
---

# Git commit

Turn the current working-tree changes into one commit with a clear message written from the diff. Do not push. Do not amend, rebase or create branches unless the user asks.

## Steps

1. **Check the repository state.**
   - Run `git status --short` and `git branch --show-current`.
   - If there are no changes (staged, unstaged or untracked), say so and stop.
   - If the branch is `main` or `master` and the user did not say to commit there, mention it in your final message. Do not block on it unless the user asked for a branch.

2. **Read the changes.**
   - Run `git diff --staged` for anything already staged, and `git diff` for unstaged edits.
   - For new untracked files, read the file or its first part to understand what it is.
   - Run `git log -10 --format=%s` to match the repo's subject style (for example, a `type:` prefix if the history uses one).

3. **Decide what goes in the commit.**
   - If something is already staged, commit only the staged content. Do not add more without saying so.
   - If nothing is staged, stage everything that belongs to the change with `git add <paths>`. Name the paths explicitly rather than using `git add -A` blindly.
   - Never stage these, even if they show as changed or untracked:
     - `.env`, `.env.*` (except `.env.example`), `*.pem`, `*.key`, credentials or token files
     - `node_modules/`, `dist/`, `*.log`, editor folders, OS junk such as `.DS_Store`
   - If you leave out a file that looks related, tell the user which one and why.
   - If the changes cover clearly unrelated topics, ask the user whether to split them into separate commits before committing. This is the only case where you stop to ask.

4. **Write the message from the diff.** The message is a single line of plain text that tells a reader what changed. Do not write a body or bullet points.
   - Use the imperative mood, no trailing period, and 72 characters or fewer.
   - Name the change, not the files. Say what it does for the user or the codebase, and include the key detail a reader would search for.
   - Good: `Trim narrative before length validation so blank input is rejected`
   - Good: `Add retry with backoff to claim submission`
   - Poor: `Update files`, `Fix bug`, `Changes`, `WIP`
   - Follow the repo's prefix style if `git log` shows one (for example `fix:`), and keep the rest of the line meaningful.
   - If the change really covers two unrelated things, ask the user whether to split it (step 3). Do not join them with "and" or semicolons to cram them into one line.
   - **Trailer:** add one blank line after the subject, then the attribution trailer as the last line. The trailer is not part of the message; it is required attribution.
     `Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>`

5. **Commit.** Write the message to a file in the scratchpad directory, then run `git commit -F <that file>`. Using a file avoids quoting problems with backticks and quotes in the message. Do not use `--no-verify` or `--no-gpg-sign`. If a hook fails, read the output, fix the cause, stage the fix and create a new commit. Do not amend.

6. **Verify.** Run `git status --short` and `git log -1 --stat`. Confirm the commit contains what you expected and the working tree is clean, apart from anything you deliberately left out.

7. **Report.** Give the user the short hash, the subject line, the list of files committed, and anything left uncommitted and why. Say that it has not been pushed, and offer to push only if they ask.

## Example message

```
Trim narrative before length validation so blank input is rejected

Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
```
