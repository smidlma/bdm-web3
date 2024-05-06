import {
  Button,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from '@nextui-org/react'
import { differenceInSeconds } from 'date-fns'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { LuckyBoxCard } from './components/lucky-box-card'
import { useWeb3 } from './contexts/use-web3'
import { Game } from './types'

const App = () => {
  const { connectToMetamask, account, contract, web3, isConnected } = useWeb3()

  const [games, setGames] = useState<Game[]>([])

  const addFunds = async (value: number, name: string) => {
    try {
      const amountInWei = web3?.utils.toWei(value, 'wei')
      const result = await contract?.methods
        .addFunds(name) // replace with username
        .send({ from: account, value: amountInWei })

      console.log('adding res: ', result)

      toast.success('Your bet is placed', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      })

      await getAllGames()
    } catch (err) {
      toast.error('Unable to add funds', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      })
    }
  }

  const getAllGames = useCallback(async () => {
    const games = await contract?.methods.getAllGames().call()

    console.log(games)

    setGames(games as Game[])
  }, [contract])

  useEffect(() => {
    getAllGames()
  }, [getAllGames])

  const isGameActive = games?.some((g) => g.isActive) ?? false

  return (
    <>
      <Navbar isBordered>
        <NavbarBrand>
          <p className='font-bold text-inherit'>WEB3</p>
        </NavbarBrand>
        <NavbarContent className='hidden sm:flex gap-4' justify='center'>
          <NavbarItem>
            <Link color='foreground' href='#'>
              Main
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify='end'>
          <NavbarItem>
            <Button
              onPress={getAllGames}
              color='secondary'
              href='#'
              variant='flat'
            >
              Refresh
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button
              onPress={connectToMetamask}
              color='primary'
              href='#'
              variant='flat'
              isDisabled={isConnected}
            >
              {isConnected ? 'Wallet connected' : 'Connect the wallet'}
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <div className='flex flex-col items-center gap-5 pt-10 pb-10'>
        {!isGameActive && (
          <LuckyBoxCard
            players={[]}
            title='Start a new Game!'
            status='new'
            endDateTime={new Date()}
            onDepositFunds={addFunds}
          />
        )}
        {games?.map((g) => (
          <LuckyBoxCard
            key={g.boxId}
            players={g.players}
            status={
              differenceInSeconds(
                new Date(Number(g.endTime) * 1000),
                new Date()
              ) <= 0
                ? 'finished'
                : 'running'
            }
            endDateTime={new Date(Number(g.endTime) * 1000)}
            title={`Game #${g.boxId}`}
            totalFunds={Number(g.totalFunds)}
            onDepositFunds={addFunds}
          />
        ))}
      </div>
    </>
  )
}

export default App
