import {
  Button,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from '@nextui-org/react'
import { LuckyBoxCard } from './components/lucky-box-card'
import { useWeb3 } from './contexts/use-web3'
import { Player } from './types'

const players: Player[] = [
  { address: 'asdf' },
  { address: '23444asd64' },
  { address: 'xxx232744x' },
]

const App = () => {
  const { connectToMetamask, account } = useWeb3()
  console.log(account)
  const isRunning = false

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
              onPress={connectToMetamask}
              color='primary'
              href='#'
              variant='flat'
            >
              Connect the wallet
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <div className='flex flex-col items-center gap-5 pt-10 pb-10'>
        {/* {!isRunning && <LuckyBoxCard players={players} status='new' />} */}
        <LuckyBoxCard players={players} />
      </div>
    </>
  )
}

export default App
