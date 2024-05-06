export type Player = {
  adr: string
  funds: number
  name: string
  isWinner: boolean
}

export const CONTRACT_ADDRESS = '0x1dCC8fAda594D6EA38a56fF4171fc29c2d98AF49'

export type Game = {
  players: Player[]
  boxId: number
  endTime: number
  isActive: boolean
  totalFunds: number
}
