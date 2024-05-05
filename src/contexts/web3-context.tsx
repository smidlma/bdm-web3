import React, { PropsWithChildren, createContext, useState } from 'react'
import Web3 from 'web3'

interface IWeb3Context {
  web3: Web3 | null
  account: string
  connectToMetamask: () => Promise<void>
}

export const Web3Context = createContext<IWeb3Context | undefined>(undefined)

export const Web3Provider = ({ children }: PropsWithChildren) => {
  const [web3, setWeb3] = useState<Web3 | null>(null)
  const [account, setAccount] = useState('')

  const connectToMetamask = async () => {
    if (window.ethereum) {
      try {
        const web3Instance = new Web3(window.ethereum)
        setWeb3(web3Instance)

        await window.ethereum.request({ method: 'eth_requestAccounts' })

        const accounts = await web3Instance.eth.getAccounts()
        setAccount(accounts[0])
      } catch (err) {
        console.error(err)
      }
    } else {
      alert(
        'Metamask is not installed. Please consider installing it: https://metamask.io/download.html'
      )
    }
  }

  return (
    <Web3Context.Provider value={{ web3, account, connectToMetamask }}>
      {children}
    </Web3Context.Provider>
  )
}
