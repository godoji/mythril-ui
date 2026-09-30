# Publishing to npm

- Package: `@godoji/mythril-ui`
- Registry: `https://registry.npmjs.org`
- Repository: `https://github.com/godoji/mythril-ui`

The npm organization `godoji` owns the package scope. Public installs do not
require registry credentials:

```sh
npm install @godoji/mythril-ui
```

## Release process

Version `0.3.0` is the first release on npmjs.org. Earlier versions were
published through GitHub Packages.

1. Update the version in `package.json` and `package-lock.json`. Do not reuse an
   already published version.
2. Run `npm run check` and inspect `npm publish --dry-run` from this checkout.
   The package check validates a local tarball in an isolated consumer.
3. Commit and push the verified release changes.
4. Sign in to npm with an account that can publish under `@godoji`.
5. Run `npm publish --access public`. npm may request browser authorization or a
   second factor.
6. Verify `npm view @godoji/mythril-ui version --registry=https://registry.npmjs.org`.
7. Publish a GitHub release tagged `v` followed by that version to record the
   release notes.

Never commit npm credentials or tokens.

GitHub Actions runs CI checks for pushes and pull requests. GitHub releases do
not trigger npm publishing.
