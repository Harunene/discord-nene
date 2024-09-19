import type { ApplicationCommandData, AutocompleteInteraction, CommandInteraction } from 'discord.js'
import type Bot from './Client'
import { TriggerBase } from './TriggerBase'

export default abstract class Command extends TriggerBase {
  public readonly data: ApplicationCommandData
  abstract run: (interaction: CommandInteraction, args?: string[]) => Promise<void>
  abstract autocomplete: (interaction: AutocompleteInteraction) => Promise<void>

  constructor (client: Bot, data: ApplicationCommandData) {
    super(client)
    this.data = data
  }

  isOwner = (interaction: CommandInteraction): boolean => {
    console.log(interaction.user.id, interaction.guild?.ownerId)
    return interaction.user.id === interaction.guild?.ownerId
  }
}
