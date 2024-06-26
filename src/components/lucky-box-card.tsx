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
import { differenceInSeconds, formatDistance } from 'date-fns'
import { useEffect, useState } from 'react'
import { Player } from '../types'

type LuckyBoxCardProps = {
  title: string
  players: Player[]
  endDateTime: Date
  status: 'running' | 'finished' | 'new'
  totalFunds?: number
  onDepositFunds?: (funds: number, name: string) => Promise<void>
}

const GAME_INTERVAL_SEC = 60
const PROGRESS_NORMALIZED = 100 / GAME_INTERVAL_SEC

export const LuckyBoxCard = ({
  title = 'New game',
  players = [],
  endDateTime,
  onDepositFunds,
  status = 'new',
  totalFunds = 0,
}: LuckyBoxCardProps) => {
  const [value, setValue] = useState('0')
  const [name, setName] = useState('')

  const [timeLeft, setTimeLeft] = useState(0)
  const [loading, setLoading] = useState(false)

  const winner = players.find((p) => p.isWinner)

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = differenceInSeconds(endDateTime, new Date())
      if (diff < 0) {
        clearInterval(timer)
      }
      setTimeLeft(diff)
    }, 1000)

    // Cleanup function
    return () => {
      clearInterval(timer)
    }
  }, [endDateTime]) // Recreate the interval whenever endDateTime changes

  const handleSend = async () => {
    const funds = parseInt(value)
    console.log(funds)

    if (funds > 0 && name.length > 0 && name.length < 8) {
      setLoading(true)
      await onDepositFunds?.(parseInt(value), name)
      setLoading(false)
    }
  }

  return (
    <Card
      isBlurred
      className='border-none bg-background/60 dark:bg-default-100/50 w-[610px] '
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
        <div className='flex items-center gap-5'>
          <div>Game Price: {totalFunds ?? 0} Wei</div>
          <Chip color='success' variant='shadow'>
            {status.toUpperCase()}
          </Chip>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className='flex flex-col gap-2'>
          {players.map((x, idx) => (
            <PlayerDetail
              key={x.adr}
              player={x}
              id={idx}
              totalFunds={totalFunds}
            />
          ))}

          {status == 'new' ? (
            <Progress
              label='Game is ready!'
              value={100}
              className='w-full pt-4'
            />
          ) : (
            <Progress
              label={
                timeLeft <= 0
                  ? status === 'running'
                    ? 'Pick The Winner'
                    : 'Game has finished'
                  : `${timeLeft} sec...`
              }
              value={timeLeft <= 0 ? 0 : PROGRESS_NORMALIZED * timeLeft}
              className='w-full pt-4'
            />
          )}
        </div>
      </CardBody>
      <Divider />

      <CardFooter className='gap-4'>
        {!winner ? (
          <>
            <Input
              type='text'
              value={name}
              onValueChange={setName}
              label='Nick'
              placeholder='Enter your name'
            />
            <Input
              type='number'
              value={value}
              onValueChange={setValue}
              label='Gwei'
              placeholder='Enter your deposit'
            />
            <Button
              color='primary'
              variant='shadow'
              onPress={handleSend}
              isLoading={loading}
              isDisabled={!(parseInt(value) > 0 && name.length > 0)}
            >
              Send
            </Button>
          </>
        ) : (
          <p>{formatDistance(endDateTime, new Date(), { addSuffix: true })}</p>
        )}
      </CardFooter>
    </Card>
  )
}

export const PlayerDetail = ({
  player,
  id = 1,
  totalFunds,
}: {
  player: Player
  id?: number
  totalFunds?: number
  isRunning?: boolean
}) => {
  return (
    <div
      className={`flex items-center gap-4 ${
        player.isWinner && 'border-success-300 border-2 rounded-lg'
      } p-1 `}
    >
      <Avatar src={`https://i.pravatar.cc/15${id}`} />
      <div className='justify-between flex gap-3'>
        <p className='w-40'>{player.name} </p>
        <p>Bet: {Number(player.funds)} Wei</p>
        {totalFunds && (
          <p> Chance: {(Number(player.funds) / totalFunds) * 100} %</p>
        )}
      </div>
    </div>
  )
}
