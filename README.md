# [invites.dosu.io](https://invites.dosu.io) code

## Environment variables

| Name                                 | Description                                                                                        |
| ------------------------------------ | -------------------------------------------------------------------------------------------------- |
| `VITE_DOSU_INVITES_CONTRACT_ADDRESS` | Dosu Invites contract address (defaults to @bwl/constants)                                         |
| `VITE_FORTMATIC_KEY`                 | Create a project and get one [here](https://dashboard.fortmatic.com/) (defaults to @bwl/constants) |
| `VITE_APP_NAME`                      | App name which is displayed in some wallets                                                        |
| `VITE_ETH_NETWORK`                   | Eth network for your providers and contract (defaults to @bwl/constants)                           |
| `VITE_ETH_RPC`                       | Ethereum node RPC URI (defaults to @bwl/constants)                                                 |
| `VITE_ALLOWLIST_ENDPOINT`            | An address, where we fetch the allowlist                                                           |
| `VITE_IPFS_ENDPOINT`                 | An endpoint provided by `dosu-invites-backend` and configured at the hosting                       |
| `BASE_URL`                           | _Optional_: base url for IPFS hosted website                                                       |

## Local launch

1. Install dependencies with `yarn`
2. Run the server with `yarn start`

## Available Scripts

- `yarn start` — runs the app in the development mode
- `yarn build` — builds the app for production to the `docs` folder
- `yarn lint` — checks if the code is linted and formatted
- `yarn generate-css-types` — generates the CSS types for `tailwind-css`
