import { SubheaderText } from 'components/Text'

// Todo:
// Should fetch the allowlist from https://allowlist.dosu.io/allowlist (url should come from .env)
// Should check if the WalletStore.userAddress is in the allowlist
// If not, show the "You are not allowlisted to mint a Dosu Invite, sorry!" message
// If yes, check if WalletStore.tokenId is there
// If not, show the mint button
// If yes, show the "Your Dosu Invite is #5!" message + a button on the bottom to go to this url (/5) if not there yet
// When the mint button is clicked, run WalletStore.mint

export default function MintingBlock() {
  return <SubheaderText>Minting block goes here</SubheaderText>
}
