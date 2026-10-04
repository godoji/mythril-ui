# Publishing Mythril UI

- Package: `@godoji/mythril-ui`
- Registry: `https://registry.npmjs.org`
- Repository: `https://github.com/godoji/mythril-ui`

Use the commands below exactly. Stop on an error; use only the documented
authentication recovery for that error. npm publication and a public GitHub
release are separate required steps. Login, dry runs, pushed tags, and drafts
do not complete a release.

## 1. Prepare once

Set an unpublished version in `package.json` and `package-lock.json`, stage
only the reviewed release files, and save release notes to
`/private/tmp/mythril-release-notes.md`. Do not repeat this block when the
release commit, tag, and GitHub draft already exist.

```sh
(
  set -eu
  cd ~/Projects/mythril
  release_version="$(node -p 'require("./package.json").version')"
  release_tag="v${release_version}"

  npm run check
  npm publish --dry-run --access public --registry=https://registry.npmjs.org
  git diff --cached --check
  git commit -S -m "Release Mythril UI v${release_version}"
  git tag -s "$release_tag" -m "Mythril UI v${release_version}"
  git push origin main "$release_tag"
  gh release create "$release_tag" --repo godoji/mythril-ui --verify-tag --draft --title "$release_tag" --notes-file /private/tmp/mythril-release-notes.md
)
```

## 2. Publish npm

Use existing CLI credentials. Skip this step if a fresh registry lookup already
confirms the exact version exists; npm versions cannot be republished.

```sh
cd ~/Projects/mythril
npm publish --access public --registry=https://registry.npmjs.org
```

## 3. Verify npm, publish GitHub, verify GitHub

Run this after npm succeeds, including when the user published manually.
The checks use fresh npm metadata and stop before GitHub publication if npm
does not expose the expected version as `latest`.

```sh
(
  set -eu
  cd ~/Projects/mythril
  release_version="$(node -p 'require("./package.json").version')"
  release_tag="v${release_version}"

  test "$(npm view "@godoji/mythril-ui@${release_version}" version --prefer-online --registry=https://registry.npmjs.org)" = "$release_version"
  test "$(npm view @godoji/mythril-ui dist-tags.latest --prefer-online --registry=https://registry.npmjs.org)" = "$release_version"
  gh release edit "$release_tag" --repo godoji/mythril-ui --draft=false --latest
  gh release view "$release_tag" --repo godoji/mythril-ui --json tagName,isDraft,isPrerelease,url
  test "$(gh api repos/godoji/mythril-ui/releases/latest --jq .tag_name)" = "$release_tag"
)
```

Confirm `isDraft` and `isPrerelease` are both `false` before reporting success.
Do not rely on cached npm output or an earlier failed attempt when the user
reports publication. Do not leave the GitHub release as a draft after npm succeeds.

## Exact manual authentication commands

For **`E401` / `401 Unauthorized`**, give the user this complete list:

```sh
cd ~/Projects/mythril
npm login --registry=https://registry.npmjs.org
npm publish --access public --registry=https://registry.npmjs.org
```

For **`EOTP`**, login may already have succeeded. Give the user only:

```sh
cd ~/Projects/mythril
npm publish --access public --registry=https://registry.npmjs.org
```

The user completes npm's authentication prompt in their terminal. Afterward,
the agent runs step 3. Do not substitute other authentication commands, try
different auth flags, or ask for publishing permission again when it was
already granted. If the documented command still fails, report the exact
operation and error instead of experimenting.

Agents must not start login flows, open authentication links, access signed-in
browser sessions, or extract or reuse cookies or tokens. Existing authenticated
npm and GitHub CLI/API access is permitted for requested release work. Never
commit registry credentials.

GitHub Actions runs checks; it does not publish npm packages. Publishing either
service does not automatically publish the other.
