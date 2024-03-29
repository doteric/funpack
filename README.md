# funpack

Your **fun**ction **pack**ager (for example for AWS Lambdas).

What this package does for you:

- Bundles your code using [esbuild](https://esbuild.github.io/)
- Generates proper package.json invidually for every function
- ZIPs your functions

## Why?

The problem I faced is a simple way to compile code for AWS Lambda's and then deploy them with Terraform, I wanted to make it easier and faster hence I created this package. This might be your case aswell, but I assume there are many different use cases so feel free to create issues if you're having any problems with your use case.

## Setup

1.

```
npm install --save-dev funpack
yarn add -D funpack
```

2. Add `funpack` to your package.json, for example like so:

```json
// package.json
{
  ...
  "funpack": {
    "settings": {},
    "functions": {
      "myfunc1": "./src/myfunc1/index.ts",
      "otherFunction": "./src/otherFunction/index.ts"
    }
  }
}
```

Settings are described under the [Settings](#settings) section.

3. Run the `funpack` cli.
   For example:

```json
{
  ...
  "scripts": {
    "prepackage": "tsc --noEmit",
    "package": "funpack"
  },
  ...
}
```

The `funpack` cli accepts `--packageJsonPath` (defaults to directory of script execution so your main `package.json`) that accepts the path of the `package.json` that contains the funpack config.

### Settings

Each option inside `settings` is optional. Below you can view what exactly is needed in the funpack object as well as which settings are available.

[configSchema that represents the funpack config](./src/parts/parseConfig.ts)

For example you can use ESM with the following setup:

```json
// package.json
{
  ...
  "funpack": {
    "settings": {
      "esbuildConfigOverride": {
        "format": "esm",
        "target": "node16"
      },
      "packageFieldsToCopy": [
        "type"
      ],
      "zip": true
    },
    "functions": {
      "main": "./src/main/index.ts"
    }
  }
}
```

Example of using custom package.json values:

```json
{
  "settings": {
    "customPackageFields": {
      "repository": {
        "type": "git",
        "url": "${YOUR_ENV_VARIABLE}"
      }
    }
  }
}
```

## Recommendations

When used together with TypeScript, [esbuild will not perform type checking](https://esbuild.github.io/content-types/#typescript), so it's recommended to run `tsc --noEmit` before using `funpack`.
