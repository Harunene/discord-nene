import { Emoji, Events, type Message, Sticker } from 'discord.js'
import type Bot from '../../structures/Client'
import Event from '../../structures/Event'


const forbiddenStickerIdList = [
  '1276503786763976724'
]

export default class FilterStickerEvent extends Event {

  constructor (client: Bot) {
    super(client, Events.MessageCreate)
  }

  run = async (message: Message): Promise<void> => {
    if (message.stickers.size > 0) {
      for (const [snowflake, sticker] of message.stickers) {
        if (forbiddenStickerIdList.includes(sticker.id)) {
          await message.delete()
          await message.channel.send("<a:ui_no:845321450415980556>")
        }
      }
    }
  }
}
