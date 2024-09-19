import type { AutocompleteInteraction, CommandInteraction } from 'discord.js'
import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder } from 'discord.js'

import supabase from '../services/supabase'

import type Bot from '../structures/Client'
import Command from '../structures/Command'

export default class RemoveForbiddenStickerCommand extends Command {
  constructor (client: Bot) {
    super(client, {
      name: 'remove-forbidden-sticker',
      description: '금지스티커를 제거합니다.',
      options: [
        {
          name: 'sticker',
          description: '제거할 스티커',
          type: ApplicationCommandOptionType.String,
          required: true,
          autocomplete: true
        }
      ]
    })
  }

  run = async (interaction: CommandInteraction): Promise<void> => {
    await interaction.deferReply({ ephemeral: true })

    const stickerId = interaction.options.get('sticker')?.value as string
    if (!stickerId) {
      await interaction.editReply({
        content: '스티커 ID를 입력해주세요.'
      })
      return
    } 

    const stickerItem = this.client.forbiddenStickers.find((item) => item.id === stickerId)
    if (!stickerItem) {
      await interaction.editReply({
        content: '해당 스티커는 금지되지 않았습니다.'
      })
      return
    } 

    try { 
      await supabase.removeForbiddenSticker(stickerId)
    } catch (error) {
      console.error(error)
      await interaction.editReply({
        content: '오류가 발생했습니다.'
      })
      return
    }

    await interaction.editReply({
      content: `완료! 이제부터 "${stickerItem.name}"은 사용할 수 있습니다.`
    })
  }

  autocomplete = async (interaction: AutocompleteInteraction): Promise<void> => {
    if (interaction.user.id !== interaction.guild?.ownerId) {
      return
    }

    const focusedOption = interaction.options.getFocused(true)
    if (focusedOption.name === 'sticker') {
      const stickers = this.client.forbiddenStickers.filter((sticker) => {
        return sticker.name.includes(focusedOption.value)
      })
      await interaction.respond(
        stickers.map((sticker) => ({ 
          name: `${sticker.name} (${sticker.id})` , 
          value: sticker.id
        }))
      )
    }
  }
}
