import type { AutocompleteInteraction, CommandInteraction } from 'discord.js'
import { ActionRowBuilder, ButtonBuilder } from 'discord.js'

import type Bot from '../structures/Client'
import Command from '../structures/Command'

export default class PingCommand extends Command {
  constructor (client: Bot) {
    super(client, {
      name: 'ping',
      description: 'Pong!'
    })
  }

  run = async (interaction: CommandInteraction): Promise<void> => {
    await interaction.deferReply({ ephemeral: true })

    await interaction.editReply({
      content: 'Pong!'
    })
  }

  autocomplete = async (interaction: AutocompleteInteraction): Promise<void> => {}
}
