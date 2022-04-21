import { SubheaderText } from 'components/Text'

// TODO:
// Checks the url of the page for ID (e.g. invites.dosu.io/50)
// Assumes ID 0
// If ID 0 doesn't exist, shows the "no invites minted yet" message
// Should listen to url changes and update ID with the image here
// We will be changing the /:id without reload, so `location` should be a hook

export default function NFTPicture() {
  return <SubheaderText>NFT picture goes here</SubheaderText>
}
