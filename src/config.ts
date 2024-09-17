import 'dotenv/config'

export default {
  DISCORD_TEST_GUILD_ID: process.env.DISCORD_TEST_GUILD_ID ?? '',
  DISCORD_TOKEN: process.env.DISCORD_TOKEN ?? '',
  API_BASE_URL: process.env.API_BASE_URL ?? ''
}
