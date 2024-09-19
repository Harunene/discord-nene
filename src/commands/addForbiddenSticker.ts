import type { AutocompleteInteraction, CommandInteraction } from 'discord.js'
import { ApplicationCommandOptionType } from 'discord.js'

import supabase from '../services/supabase'

import type Bot from '../structures/Client'
import Command from '../structures/Command'

export default class AddForbiddenStickerCommand extends Command {
  constructor(client: Bot) {
    super(client, {
      name: 'add-forbidden-sticker',
      description: '금지스티커를 추가합니다.',
      options: [
        {
          name: 'sticker-id',
          description: '추가할 스티커 ID (숫자)',
          type: ApplicationCommandOptionType.String,
          required: true
        },
        {
          name: 'sticker-name',
          description: '스티커 이름',
          type: ApplicationCommandOptionType.String,
          required: true
        }
      ]
    })
  }

  run = async (interaction: CommandInteraction): Promise<void> => {
    await interaction.deferReply({ ephemeral: true })

    if (!this.isOwner(interaction)) {
      await interaction.editReply({
        content: '금지야!!!!!!!'
      })
      return
    }
    
    const stickerId = interaction.options.get('sticker-id')?.value as string
    const stickerName = interaction.options.get('sticker-name')?.value as string
    if (!stickerId || !stickerName) {
      await interaction.editReply({
        content: '스티커 ID와 이름을 입력해주세요.'
      })
      return
    }

    const stickerItem = this.client.forbiddenStickers.find((item) => item.id === stickerId)
    if (stickerItem) {
      await interaction.editReply({
        content: '해당 스티커는 이미 금지되어 있습니다.'
      })
      return
    }

    try {
      await supabase.addForbiddenSticker(stickerId, stickerName)
    } catch (error) {
      console.error(error)
      await interaction.editReply({
        content: '오류가 발생했습니다.'
      })
      return
    }

    await interaction.editReply({
      content: `완료! 이제부터 "${stickerName}"은 사용할 수 없습니다.`
    })
  }

  autocomplete = async (interaction: AutocompleteInteraction): Promise<void> => {}
}