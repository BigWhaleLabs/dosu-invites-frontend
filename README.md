# Frontend code for dosu-invites

## Features

- State management + persistence with `valtio` and `PersistableStore`
- Less than 16kb after brotli compression (this includes **everything**) 😱
- `preact` under the hood with `preact/compat` makes it compatible with virtually any `react` library but still makes it faster
- Full TypeScript support — no dangling types
- `vite` packager and devtools make building and development lightning fast
- Localization out of the box
- `tailwind-css` built-in with type-safe class names
- GitHub Actions that lint and check the code on pull requests
- `prettier` and `eslint` configured, enabled and formatting your code on save
- List of recommended extensions for VSCode
- It is important to keep the bundle small, so a `stats.html` file is generated on `yarn build` to visually show you the bundle size

## Environment variables

| Name                     | Description                                                             |
| ------------------------ | ----------------------------------------------------------------------- |
| VITE_BACKEND             | API root URL                                                            |
| VITE_CONTRACT_ADDRESS    | Dosu invites contract address                                           |
| VITE_INFURA_ID           | Create an app and get one [here][infura-dev]                            |
| VITE_FORTMATIC_KEY       | Create a project and get one [here][formatic-dev]                       |
| VITE_BITSKI_CLIENT_ID    | [Register][bitski-wallet], confirm your email and [get one][bitski-dev] |
| VITE_BITSKI_CALLBACK_URL | You need a domain for [your app][bitski-dev], then you can use this URL |

=123
=123
=123
=https://www.myapp.com

## Local launch

1. Install dependencies with `yarn`
2. Run the server with `yarn start`

## Available Scripts

- `yarn start` — runs the app in the development mode
- `yarn build` — builds the app for production to the `docs` folder
- `yarn lint` — checks if the code is linted and formatted
- `yarn generate-css-types` — generates the CSS types for `tailwind-css`

[infura-dev]: https://infura.io/dashboard
[formatic-dev]: https://dashboard.fortmatic.com/
[bitski-wallet]: https://wallet.bitski.com/
[bitski-dev]: https://developer.bitski.com/
