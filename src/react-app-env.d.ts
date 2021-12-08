/// <reference types="react-scripts" />

interface Window {
  ethereum: ExternalProvider | JsonRpcFetchFunc
  web3: ExternalProvider | JsonRpcFetchFunc
}
