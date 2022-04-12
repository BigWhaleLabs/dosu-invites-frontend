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

| Name                    | Description                                                                                                                                                                                                                |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `VITE_BACKEND`          | API root URL                                                                                                                                                                                                               |
| `VITE_CONTRACT_ADDRESS` | Dosu invites contract address                                                                                                                                                                                              |
| `VITE_FORTMATIC_KEY`    | Create a project and get one [here](https://dashboard.fortmatic.com/)                                                                                                                                                      |
| `VITE_APP_NAME`         | App name which is displayed in some wallets                                                                                                                                                                                |
| `VITE_INFURA_ID`        | Create an app and get one [here](https://infura.io/dashboard)                                                                                                                                                              |
| `VITE_BITSKI_CLIENT_ID` | [Register a wallet](https://wallet.bitski.com/), confirm your email and [create a project](https://developer.bitski.com/). Use `localhost` as homepage in your app + redirect to `localhost/callback.html` in auth section |
| `VITE_ETH_NETWORK`      | Eth network for your providers and contract                                                                                                                                                                                |

## Local launch

1. Install dependencies with `yarn`
2. Run the server with `yarn start`

## Available Scripts

- `yarn start` — runs the app in the development mode
- `yarn build` — builds the app for production to the `docs` folder
- `yarn lint` — checks if the code is linted and formatted
- `yarn generate-css-types` — generates the CSS types for `tailwind-css`
