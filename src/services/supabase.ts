import config from '../config'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '../structures/database-generated.types'
import type { StickerItem } from '../structures/StickerItem'
import { REALTIME_LISTEN_TYPES, REALTIME_POSTGRES_CHANGES_LISTEN_EVENT, RealtimePostgresChangesPayload } from '@supabase/supabase-js'

const supabaseUrl = config.SUPABASE_URL
const supabaseAnonKey = config.SUPABASE_ANON_KEY

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

export default class Supabase {
  static readonly supabase = supabase

  static readonly subscribeForbiddenStickers = async (
    onUpdateForbiddenStickers: (stickers: StickerItem[]) => void
  ): Promise<void> => {
    supabase.channel('custom-all-channel').on(
      REALTIME_LISTEN_TYPES.POSTGRES_CHANGES, 
      {
        event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.ALL,
        schema: 'public',
        table: 'forbidden_stickers',
      }, 
      async (payload: RealtimePostgresChangesPayload<any>) => {
        console.log('Change received!', payload)
        onUpdateForbiddenStickers(await this.getForbiddenStickers())
      }
    ).subscribe(() => {
      this.getForbiddenStickers().then((stickerItems) => {
        onUpdateForbiddenStickers(stickerItems)
      })
    })

  }

  static readonly getForbiddenStickers = async (): Promise<StickerItem[]> => {
    try {
      const { data, error } = await supabase
        .from('forbidden_stickers')
        .select('sticker_id, sticker_name')

      if (error) {
        console.error(error)
      }

      return data?.map(({ sticker_id, sticker_name }) => ({ id: sticker_id, name: sticker_name })) ?? []
    } catch (error) {
      console.error(error)
      return []
    }
  }

  static readonly addForbiddenSticker = async (stickerId: string, stickerName: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('forbidden_stickers')
        .insert([{ sticker_id: stickerId, sticker_name: stickerName }])

      if (error) {
        console.error(error)
      }
    } catch (error) {
      console.error(error)
    }
  } 

  static readonly removeForbiddenSticker = async (stickerId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('forbidden_stickers')
        .delete()
        .eq('sticker_id', stickerId)

      if (error) {
        console.error(error)
      }
    } catch (error) {
      console.error(error)
    }
  }
}
