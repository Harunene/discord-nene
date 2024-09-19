import { Emoji, Events, type Message, Sticker, StickerResolvable } from 'discord.js'
import type Bot from '../../structures/Client'
import Event from '../../structures/Event'


const forbiddenStickerIdList = [
  '1276503786763976724',
  '1286334639446954018',
]


type RejectMessageContent = RejectComment | RejectSticker
type RejectComment = string
type RejectSticker = {
  stickers: StickerResolvable[]
}

const getRandomRejectMessageContent = (message: Message) => {
  const authorPlaceholder = '%AUTHOR%'
  const rejectCommentList: RejectComment[] = [
    `${authorPlaceholder} 💢`,
    `${authorPlaceholder} <a:ui_no:845321450415980556>`,
    `${authorPlaceholder} <:nacho_ded:1247421429041991750>`,
    `${authorPlaceholder} <:mahjong_kuso_game:617986913110065162>`,
  ].map(comment => comment.replace(authorPlaceholder, `<@${message.author.id}>`)) 

  const rejectStickerList: RejectSticker[] = [
    // "1238848559466680390",
    // "1264805290872672270",
    // "1238849538618429460",
    // "1276514003325292649",
    // "1279379917183913985",
    // "1282974859869290537",
  ].map(stickerId => ({
    stickers: [
      message.guild?.stickers.cache.get(stickerId)
    ].filter(Boolean) as StickerResolvable[]
  })) 
  
  const rejectMessageContentList: RejectMessageContent[] = [
    ...rejectCommentList,
    ...rejectStickerList,
  ]

  return rejectMessageContentList[Math.floor(Math.random() * rejectMessageContentList.length)]
}

export default class FilterStickerEvent extends Event {

  constructor (client: Bot) {
    super(client, Events.MessageCreate)
  }

  private sendRejectMessage = async (message: Message) => {
    const rejectMessageContent = getRandomRejectMessageContent(message)
    await message.channel.send(rejectMessageContent)
  }

  run = async (message: Message): Promise<void> => {
    if (message.stickers.size > 0) {
      for (const [_, sticker] of message.stickers) {
        if (forbiddenStickerIdList.includes(sticker.id)) {
          await message.delete()
          await this.sendRejectMessage(message)
        }
      }
    }
  }
}
