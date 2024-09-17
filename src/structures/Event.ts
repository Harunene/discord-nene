import type { Events } from 'discord.js'
import type Bot from './Client'
import { TriggerBase } from './TriggerBase'

export default abstract class Event extends TriggerBase {
  public readonly type: string

  constructor (client: Bot, type: Events) {
    super(client)
    this.type = type
  }
}
