import { Client, ClientConfig } from '@line/bot-sdk'

const config: ClientConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
  channelSecret: process.env.LINE_CHANNEL_SECRET || '',
}

export const lineClient = new Client(config)
