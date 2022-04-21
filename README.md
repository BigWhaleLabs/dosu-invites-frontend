# [invites.dosu.io](https://invites.dosu.io) code

## Environment variables

| Name                      | Description                                                                  |
| ------------------------- | ---------------------------------------------------------------------------- |
| `VITE_CONTRACT_ADDRESS`   | Dosu invites contract address                                                |
| `VITE_FORTMATIC_KEY`      | Create a project and get one [here](https://dashboard.fortmatic.com/)        |
| `VITE_APP_NAME`           | App name which is displayed in some wallets                                  |
| `VITE_INFURA_ID`          | Create an app and get one [here](https://infura.io/dashboard)                |
| `VITE_BITSKI_CLIENT_ID`   | Bitski client id                                                             |
| `VITE_ETH_NETWORK`        | Eth network for your providers and contract                                  |
| `VITE_ALLOWLIST_ENDPOINT` | An address, where we fetch the allowlist                                     |
| `VITE_IPFS_ENDPOINT`      | An endpoint provided by `dosu-invites-backend` and configured at the hosting |

## Obtaining `VITE_BITSKI_CLIENT_ID`

[Register a wallet](https://wallet.bitski.com/), confirm your email and [create a project](https://developer.bitski.com/). Use `localhost` as homepage in your app + redirect to `localhost/callback.html` in auth section.

## Local launch

1. Install dependencies with `yarn`
2. Run the server with `yarn start`

## Available Scripts

- `yarn start` — runs the app in the development mode
- `yarn build` — builds the app for production to the `docs` folder
- `yarn lint` — checks if the code is linted and formatted
- `yarn generate-css-types` — generates the CSS types for `tailwind-css`
