import {z} from 'zod'
import {createSuccessResponse, withErrorHandling} from '../../utils/response.js'
import {getDefaultSpotifyClient} from '../../config/spotify.js'

export const PauseToolParams = z.object({
  device_id: z
    .string()
    .optional()
    .describe(
      'Target Spotify device id. If omitted, pauses the user’s currently active device.',
    ),
})

type Params = z.infer<typeof PauseToolParams>

async function tool(params: Params) {
  const spotifyClient = getDefaultSpotifyClient()
  await spotifyClient.pause(params.device_id ? {device_id: params.device_id} : {})
  return createSuccessResponse('Playback paused')
}

export const pauseTool = withErrorHandling(tool, 'Error pausing playback')
