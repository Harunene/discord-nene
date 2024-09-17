import './instrument'
import { GatewayIntentBits } from 'discord.js'
import config from './config'
import Client from './structures/Client'
import * as Sentry from '@sentry/bun'

const client = new Client({ 
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildEmojisAndStickers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	] 
})

client.login(config.DISCORD_TOKEN).catch(console.error)

process.on('unhandledRejection', (err) => {
  console.log(client.chalk.red('Unhandled Rejection:'))
  console.error(err)
	Sentry.captureException(err)
})

process.on('uncaughtException', (err) => {
  console.log(client.chalk.red('Uncaught Exception:'))
  console.error(err)
	Sentry.captureException(err)
})
