import Web3 from 'web3'
interface Ethereum {
  request: (request: { method: string }) => Promise<string[]>
}

declare global {
  interface Window {
    ethereum: Ethereum
    web3: Web3
  }
}
