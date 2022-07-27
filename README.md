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

2. Add `funpack` to your package.json like so:

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

## Recommendations

When used together with TypeScript, [esbuild will not perform type checking](https://esbuild.github.io/content-types/#typescript), so it's recommended to run `tsc --noEmit` before using `funpack`.
