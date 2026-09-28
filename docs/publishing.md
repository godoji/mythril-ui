# Publishing to npm

- Package: `@godoji/mythril-ui`
- Registry: `https://registry.npmjs.org`
- Repository: `https://github.com/godoji/mythril-ui`

The npm organization `godoji` owns the package scope. Public installs do not
require registry credentials:

```sh
npm install @godoji/mythril-ui
```

## First npm release

Version `0.3.0` is the first release on npmjs.org. Earlier versions were
published through GitHub Packages.

1. Sign in to npm with an account that can publish under `@godoji`.
2. Run `npm run check` and inspect `npm publish --dry-run` from this checkout.
3. Run `npm publish --access public`. npm may request a second factor.
4. Verify `npm view @godoji/mythril-ui version --registry=https://registry.npmjs.org`.

Never commit npm credentials or tokens.

## Later releases

Before relying on automated publishing, configure the npm package's trusted
publisher for GitHub Actions: organization `godoji`, repository `mythril-ui`,
workflow `publish.yml`, with direct `npm publish` allowed. The workflow uses
GitHub's OIDC identity, so it does not need an npm token secret.

Update the version in `package.json` and `package-lock.json`, run `npm run check`,
commit and push. Publish a GitHub release tagged `v` followed by that version.
The release workflow checks the tag and package metadata, then publishes to npm.
Do not reuse an already published version.
