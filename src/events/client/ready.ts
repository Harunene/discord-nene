import { Events } from 'discord.js'
import type Bot from '../../structures/Client'
import Event from '../../structures/Event'

export default class ReadyEvent extends Event {
  constructor (client: Bot) {
    super(client, Events.ClientReady)
  }

  run = async (): Promise<void> => {
    console.log(
      this.chalk.green(
        `Logged in as ${this.client.user?.tag} (${this.client.user?.id})!\n`
      )
    )

    this.client
      .registryCommands(this.client.config.DISCORD_TEST_GUILD_ID.length === 0)
      .catch(() => {})

    this.client.defaultEmbeds?.setClient(this.client)
  }
}
