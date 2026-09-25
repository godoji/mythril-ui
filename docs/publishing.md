# Private GitHub Packages

- Package: `@aelbrecht/mythril-ui`
- Repository: `https://github.com/aelbrecht/mythril-ui`
- Registry: `https://npm.pkg.github.com`

The local configuration does not create the repository or publish a package.
Create the repository as private and push this project there before releasing.

## Publish a release

1. Update `version` in `package.json` and the lockfile together, for example with
   `npm version patch --no-git-tag-version`. The initial version is `0.1.0`.
2. Run `npm run check`, commit, and push the changes.
3. Create and publish a GitHub release tagged `v0.1.0` (or `v` followed by the new
   package version), pointing at the commit with that version.

The release workflow rejects a mismatched tag, runs the full check, and publishes
using GitHub's built-in `GITHUB_TOKEN` with `packages:write`. No personal publishing
token is needed in repository secrets. Prereleases are skipped. Each release needs
a new package version; publishing an existing version will fail.

`publishConfig` targets GitHub Packages with `access: restricted`. The manifest's
`private: true` flag is removed because it prevents publishing to any registry;
it is not a registry visibility setting. New GitHub npm packages default to private.
Keep the package's visibility private in GitHub Package settings. This workflow
does not change the visibility of an existing package. The package remains
`UNLICENSED`.

See GitHub's [npm registry guide](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)
and [publishing workflow documentation](https://docs.github.com/en/actions/tutorials/publish-packages/publish-nodejs-packages).

## Install locally

In Anvil or another consumer, add this scope mapping to the project's `.npmrc`:

```ini
@aelbrecht:registry=https://npm.pkg.github.com
```

Authenticate with your GitHub username and a **personal access token (classic)**
with `read:packages`, belonging to an account that can access this package:

```sh
npm login --scope=@aelbrecht --auth-type=legacy --registry=https://npm.pkg.github.com
npm install @aelbrecht/mythril-ui
```

Enter the token at the password prompt. Keep credentials in your per-user npm
configuration; never commit a token to the project. The checked-in `.npmrc`
contains only the scope mapping. Other dependencies continue using npmjs.org.

```tsx
import { Button, TextField } from "@aelbrecht/mythril-ui";
import "@aelbrecht/mythril-ui/styles.css";
```

## Install in another repository's GitHub Actions

In this package's GitHub settings, use **Manage Actions access** to grant the
consumer repository read access. Then configure its install job as follows:

```yaml
permissions:
  contents: read
  packages: read

steps:
  - uses: actions/checkout@v6
  - uses: actions/setup-node@v7
    with:
      node-version: "24"
      registry-url: https://npm.pkg.github.com
      scope: "@aelbrecht"
  - run: npm ci
    env:
      NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Commit the consumer's dependency and lockfile after installing locally. Repository
access must be granted to the package; `packages:read` alone does not grant access
to a different repository's private package. See [GitHub package access controls](https://docs.github.com/en/packages/learn-github-packages/configuring-a-packages-access-control-and-visibility).
