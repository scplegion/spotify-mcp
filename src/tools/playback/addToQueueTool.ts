import {z} from 'zod'
import {createSuccessResponse, withErrorHandling} from '../../utils/response.js'
import {getDefaultSpotifyClient} from '../../config/spotify.js'

export const AddToQueueToolParams = z.object({
  uri: z
    .string()
    .describe(
      'Spotify URI of the track or episode to queue (e.g. spotify:track:...).',
    ),
  device_id: z
    .string()
    .optional()
    .describe('Target Spotify device id. If omitted, uses the active device.'),
})

type Params = z.infer<typeof AddToQueueToolParams>

async function tool(params: Params) {
  const spotifyClient = getDefaultSpotifyClient()
  await spotifyClient.addToQueue(
    params.uri,
    params.device_id ? {device_id: params.device_id} : {},
  )
  return createSuccessResponse('Added item to queue', {uri: params.uri})
}

export const addToQueueTool = withErrorHandling(tool, 'Error adding to queue')
