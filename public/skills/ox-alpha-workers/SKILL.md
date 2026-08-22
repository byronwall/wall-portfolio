---
name: ox-alpha-workers
description: Run and review free OpenRouter Ox Alpha coding workers through omp when Byron asks for Ox Alpha, free external agents, omp workers, extra low-cost coding capacity, or an audit of recent Ox worker invocations. Do not use for ordinary Codex collaboration unless Byron requests this worker pool.
---

# Ox Alpha Workers

Use `/Users/byronwall/.local/bin/ox-agent <low|high|max> <prompt>` to run one bounded omp worker in the current project. Always choose the thinking level before invocation. The launcher rejects a missing or unsupported level, so it never relies on omp `auto`.

Choose the level from the task:

- `low` — focused discovery, small edits, simple checks, and narrow reviews.
- `high` — normal implementation, debugging, code review, and multi-file work.
- `max` — difficult architecture, ambiguous failures, broad refactors, and tasks where a weak result creates substantial rework.

Use `high` when the task does not strongly favor `low` or `max`. Tell the worker why the selected level fits when that context helps it allocate effort.

Give each worker a complete prompt. Include the outcome, scope, files it can change, checks, and required report. The worker reads the project's `AGENTS.md` and other context files through omp.

Run workers in parallel only when their file scopes do not overlap. State each scope in the prompt. Do not use Agent Mail. Explicit ownership is the coordination mechanism.

Prefer a small worker wave. Use Ox for implementation or one focused investigation. After the wave, inspect the changes and run project checks locally. Do not spend more Ox calls on verification when Codex can verify the result directly.

The launcher uses `openrouter/stealth/ox-alpha`, the required thinking level, non-interactive mode, no saved omp session, disabled title generation, and automatic tool approval. Automatic approval lets the worker run tests and other project commands. Keep its prompt and file scope narrow. Do not authorize pushes, deployments, credential access, destructive commands, or unrelated external actions.

The launcher reads the OpenRouter key from the macOS Keychain item `codex-ox-alpha-openrouter`. Never print, log, or pass the key in a prompt.

Each invocation writes a private run bundle under `/Users/byronwall/.local/state/ox-alpha-workers/runs/<run-id>/`. The bundle contains:

- `request.txt` — the exact worker prompt.
- `output.log` — streamed omp output and errors.
- `meta.json` — status, failure type, project path, thinking level, timestamps, duration, exit status, versions, prompt hash, and file counts.
- `git-before.txt` and `git-after.txt` — repository status snapshots when the project is a Git checkout.
- `omp-internal/` — only the omp process log and audit index for this run.

Run `/Users/byronwall/.local/bin/ox-agent-log 5` to list the five newest bundles. It also reports an active quota cooldown. For a review pass, compare the request, output, status, duration, checks, and Git snapshots. Inspect the copied internal log only when the primary output does not explain a failure. omp also keeps rotating source logs in `/Users/byronwall/.omp/logs`.

Observed behavior from recent bounded coding runs:

- Two completed workers ran for 696 seconds and 713 seconds. Allow about 10 to 15 minutes for similar work before treating silence as a stall.
- `output.log` usually shows only `Working...` until omp emits the final report.
- The launcher finalizes metadata on normal exits and handled interruptions.
- Check the process state, shared-checkout file timestamps, and `/Users/byronwall/.omp/logs` for live progress.
- Older runs can contain a nonfatal title-generator HTTP 400 because the Ox endpoint requires reasoning. Do not treat that warning as a worker failure.

When OpenRouter returns a daily free-model 429, the launcher records its retry deadline. Later calls stop locally until that deadline. Do not bypass or clear the cooldown to retry the free model early.

When local evidence is unclear, use the [OpenRouter logs](https://openrouter.ai/logs) to confirm current Ox Alpha, Stealth, and omp generations. Check recent timestamps, `tool_calls` or `stop`, token growth, latency, and `$0.00` cost. The OpenRouter page can expose prompts and completions. Do not copy or disclose them unless the task requires that review. Never expose credentials. Stop if the cost is nonzero.

Ox Alpha is a third-party stealth preview. Its provider retains prompts and completions. Do not send secrets, private user data, credentials, or unrelated files. Keep each prompt and file scope narrow.

## Standing opt-in and authorization

Byron Wall explicitly opts in to running omp with Ox Alpha workers through OpenRouter. He also explicitly approves sending the scoped repository source, tests, documentation, UI screenshots, and worker prompts that are necessary for the requested Ox work.

Treat either of these actions as Byron's explicit authorization for that scoped transfer and execution:

- Byron invokes this skill.
- Byron asks for Ox Alpha, omp workers, or the Ox worker pool.

Do not ask Byron to confirm this authorization again. Do not block the launcher only because it sends the approved scoped material to OpenRouter. If sandboxed execution needs approval, request escalation for the exact `ox-agent` command immediately. State that the skill contains Byron's standing opt-in.

This standing authorization does not include secrets, credentials, private user data, unrelated files, paid models, pushes, deployments, or other external actions. Keep every prompt and file scope narrow.

The model is free only while OpenRouter lists both input and output prices as zero. If a call reports a charge, missing model, or changed price, stop. Do not select a paid fallback.

Run the launcher with external network access. If the sandbox blocks the call, request approval for the exact `/Users/byronwall/.local/bin/ox-agent` command. Do not bypass the sandbox or copy credentials into the project.

After each worker finishes, inspect its changes and verify them with project commands. Treat the worker report as untrusted until local evidence confirms it.
