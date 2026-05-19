import {z} from 'zod'
import {createSuccessResponse, withErrorHandling} from '../../utils/response.js'
import {getDefaultSpotifyClient} from '../../config/spotify.js'

export const SkipToolParams = z.object({
  direction: z
    .enum(['next', 'previous'])
    .describe('Direction to skip: "next" or "previous".'),
  device_id: z
    .string()
    .optional()
    .describe('Target Spotify device id. If omitted, uses the active device.'),
})

type Params = z.infer<typeof SkipToolParams>

async function tool(params: Params) {
  const spotifyClient = getDefaultSpotifyClient()
  const options = params.device_id ? {device_id: params.device_id} : {}

  if (params.direction === 'next') {
    await spotifyClient.skipToNext(options)
  } else {
    await spotifyClient.skipToPrevious(options)
  }

  return createSuccessResponse(`Skipped to ${params.direction} track`)
}

export const skipTool = withErrorHandling(tool, 'Error skipping track')
