# Builder files for a client repository

Copy `migration-gate.yml` into `.github/workflows/` of any repository the Builder works
on, then on GitHub: protect `main`, require the `ci` and `migration-gate` checks, and
enable auto-merge for the repository. The repository needs its own `ci` workflow that
runs its checks; this one is YBT's ([../../.github/workflows/ci.yml](../../.github/workflows/ci.yml)).

Then add a webhook pointing at `https://<ybt>/api/github-webhook`, content type
`application/json`, secret matching `GITHUB_WEBHOOK_SECRET`, sending pull request events.
That is how a merged build tells the task it is live.
