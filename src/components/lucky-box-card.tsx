import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  Image,
  Input,
  Progress,
} from '@nextui-org/react'
import { useState } from 'react'
import { Player } from '../types'

type LuckyBoxCardProps = {
  title: string
  players: Player[]
  timeLeft: number
  status: 'running' | 'finished' | 'new'
  onDepositFunds: (funds: number) => void
}

const GAME_INTERVAL_SEC = 120
const PROGRESS_NORMALIZED = 100 / GAME_INTERVAL_SEC

export const LuckyBoxCard = ({
  title = 'Game 1',
  players = [],
  timeLeft = 60,
  onDepositFunds,
  status = 'running',
}: LuckyBoxCardProps) => {
  const [value, setValue] = useState('0')

  const handleSend = () => {
    const funds = parseInt(value)
    if (funds > 0) {
      onDepositFunds(parseInt(value))
    }
  }

  return (
    <Card
      isBlurred
      className='border-none bg-background/60 dark:bg-default-100/50 max-w-[610px] min-w-[480px]'
      shadow='sm'
    >
      <CardHeader className='flex gap-4'>
        <Image
          alt='nextui logo'
          height={36}
          radius='sm'
          src='https://ethereum.org/_next/image/?url=%2F_next%2Fstatic%2Fmedia%2Feth-glyph-colored.434446fa.png&w=828&q=75'
          width={36}
        />
        <div className='flex flex-col flex-grow'>
          <p className='text-md'>#{title}</p>
          <p className='text-small text-default-500'>velke-penize.org</p>
        </div>
        <div className=''>
          <Chip color='success' variant='shadow'>
            {status.toUpperCase()}
          </Chip>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className='flex flex-col gap-2'>
          {players.map((x, idx) => (
            <div key={idx} className='flex items-center gap-4'>
              <Avatar src={`https://i.pravatar.cc/15${idx}`} />
              <p className='text'>{x.address}</p>
            </div>
          ))}
        </div>
        <Progress
          label={`${timeLeft} sec...`}
          value={PROGRESS_NORMALIZED * timeLeft}
          className='max-w-md pt-4'
        />
      </CardBody>
      <Divider />
      <CardFooter className='gap-4'>
        <Input
          type='number'
          value={value}
          onValueChange={setValue}
          label='Gwei'
          placeholder='Enter your deposit'
        />
        <Button color='primary' variant='shadow' onPress={handleSend}>
          Send
        </Button>
      </CardFooter>
    </Card>
  )
}
