import {z} from 'zod'
import {createSuccessResponse, withErrorHandling} from '../../utils/response.js'
import {getDefaultSpotifyClient} from '../../config/spotify.js'

export const SetVolumeToolParams = z.object({
  volume_percent: z
    .number()
    .min(0)
    .max(100)
    .describe('Volume level from 0 (mute) to 100 (max).'),
  device_id: z
    .string()
    .optional()
    .describe('Target Spotify device id. If omitted, uses the active device.'),
})

type Params = z.infer<typeof SetVolumeToolParams>

async function tool(params: Params) {
  const spotifyClient = getDefaultSpotifyClient()
  await spotifyClient.setVolume(
    params.volume_percent,
    params.device_id ? {device_id: params.device_id} : {},
  )
  return createSuccessResponse(`Volume set to ${params.volume_percent}%`)
}

export const setVolumeTool = withErrorHandling(tool, 'Error setting volume')
