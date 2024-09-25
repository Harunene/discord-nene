import { Events, type Message, TextChannel } from 'discord.js'
import type Bot from '../../structures/Client'
import Event from '../../structures/Event'

export default class FilterStickerEvent extends Event {
  private notiBotChannel = this.client.channels.cache.get("1288344400925163593") as TextChannel
  
  constructor (client: Bot) {
    super(client, Events.MessageCreate)
  }

  private sendRejectMessage = async (message: Message) => {
    this.notiBotChannel.send({
      content: `${message.author.username}, ${message.stickers.map(sticker => sticker.name).join(', ')}`
    })
  }

  run = async (message: Message): Promise<void> => {
    if (message.stickers.size > 0) {
      for (const [_, sticker] of message.stickers) {
        if (this.client.forbiddenStickers.some(forbiddenSticker => forbiddenSticker.id === sticker.id )) {
          await message.delete()
          await this.sendRejectMessage(message)
        }
      }
    }
  }
}
