import { PropsWithChildren, createContext, useEffect, useState } from 'react'
import Web3, { Contract, ContractAbi } from 'web3'
import contractAbi from '../contracts/contractAbi.json'
import { CONTRACT_ADDRESS } from '../types'

interface Web3Context {
  web3: Web3 | undefined
  account: string
  contract: Contract<ContractAbi> | undefined
  isConnected: boolean
  connectToMetamask: () => Promise<void>
}

export const Web3Context = createContext<Web3Context | undefined>(undefined)

export const Web3Provider = ({ children }: PropsWithChildren) => {
  const [web3, setWeb3] = useState<Web3 | undefined>(undefined)
  const [account, setAccount] = useState('')
  const [contract, setContract] = useState<Contract<ContractAbi> | undefined>(
    undefined
  )
  const [isConnected, setConnected] = useState(false)

  const connectToContract = async (web3Inst: Web3) => {
    const contractInstance = new web3Inst.eth.Contract(
      contractAbi,
      CONTRACT_ADDRESS
    )
    setContract(contractInstance)
  }

  useEffect(() => {
    const checkConnection = async () => {
      // Check if browser is running Metamask
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum)
        const accounts = await web3Instance.eth.getAccounts()
        if (account) {
          setAccount(accounts[0])
          setConnected(true)
        }

        await connectToContract(web3Instance)
      }
    }
    checkConnection()
  }, [])

  const connectToMetamask = async () => {
    if (window.ethereum) {
      try {
        const web3Instance = new Web3(window.ethereum)
        setWeb3(web3Instance)

        // await contractInstance?.events
        //   .GameChanged()
        //   .on('data', (event) => {
        //     console.log('data', event)
        //   })
        //   //@ts-expect-error TS issue
        //   .on('connected', (id) => {
        //     console.log('connected', id)
        //   })

        await window.ethereum.request({ method: 'eth_requestAccounts' })

        const accounts = await web3Instance.eth.getAccounts()
        setAccount(accounts[0])
        await connectToContract(web3Instance)
        setConnected(true)
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
    <Web3Context.Provider
      value={{ web3, account, contract, isConnected, connectToMetamask }}
    >
      {children}
    </Web3Context.Provider>
  )
}
