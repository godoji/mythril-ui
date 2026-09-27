# Public GitHub Package

- Package: `@godoji/mythril-ui`
- Repository: `https://github.com/godoji/mythril-ui`
- Registry: `https://npm.pkg.github.com`

Create the repository under `godoji` as public and push this project there. The
local configuration does not create the repository or publish a package. The
package is MIT licensed; see [LICENSE](../LICENSE).

## Publish a release

1. Confirm that the `godoji` organization allows public package creation and
   that the release workflow has permission to publish packages.
2. Update `version` in `package.json` and the lockfile together, for example with
   `npm version patch --no-git-tag-version`. The initial version is `0.1.0`.
3. Run `npm run check`, commit, and push the changes.
4. Create and publish a GitHub release tagged `v0.1.0` (or `v` followed by the new
   package version), pointing at the commit with that version.
5. After the first publish, open the package settings in the `godoji` organization
   and set **Change visibility → Public**. Verify the package page shows Public.

The release workflow checks the repository, package name, version, and registry;
runs the full check; and publishes with GitHub's built-in `GITHUB_TOKEN` and
`packages: write`. No personal publishing token is needed in repository secrets.
Prereleases are skipped. Each release needs a new package version.

GitHub npm packages start private, even when the repository is public. The
manifest's `publishConfig.access: "public"` expresses the intended access but does
not replace the visibility change in GitHub package settings. Making a GitHub
package public cannot be undone. See [GitHub package visibility](https://docs.github.com/en/packages/learn-github-packages/configuring-a-packages-access-control-and-visibility)
and the [npm registry guide](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry).

## Install locally

In a consuming project, map the scope to GitHub Packages in `.npmrc`:

```ini
@godoji:registry=https://npm.pkg.github.com
```

GitHub's npm registry requires authentication even for public packages. Log in
with your GitHub username and a **personal access token (classic)** with
`read:packages`:

```sh
npm login --scope=@godoji --auth-type=legacy --registry=https://npm.pkg.github.com
npm install @godoji/mythril-ui
```

Enter the token at the password prompt. Keep credentials in your per-user npm
configuration; never commit a token to the project. The checked-in `.npmrc`
contains only the scope mapping. Other dependencies continue using npmjs.org.

```tsx
import { Button, TextField } from "@godoji/mythril-ui";
import "@godoji/mythril-ui/styles.css";
```

## Install in another repository's GitHub Actions

Grant that repository read access in the package's **Manage Actions access**
settings. Then configure its install job:

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
      scope: "@godoji"
  - run: npm ci
    env:
      NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Commit the consumer's dependency and lockfile after installing locally. For
package access details, see [GitHub package access controls](https://docs.github.com/en/packages/learn-github-packages/configuring-a-packages-access-control-and-visibility).
