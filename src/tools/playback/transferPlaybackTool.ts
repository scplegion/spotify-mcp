import {z} from 'zod'
import {createSuccessResponse, withErrorHandling} from '../../utils/response.js'
import {getDefaultSpotifyClient} from '../../config/spotify.js'

export const TransferPlaybackToolParams = z.object({
  device_id: z
    .string()
    .describe('Spotify device id to transfer playback to.'),
  play: z
    .boolean()
    .optional()
    .default(false)
    .describe(
      'If true, ensure playback starts on the new device. If false, preserve the current play/pause state.',
    ),
})

type Params = z.infer<typeof TransferPlaybackToolParams>

async function tool(params: Params) {
  const spotifyClient = getDefaultSpotifyClient()
  await spotifyClient.transferMyPlayback([params.device_id], {play: params.play})
  return createSuccessResponse('Playback transferred', {
    device_id: params.device_id,
    play: params.play,
  })
}

export const transferPlaybackTool = withErrorHandling(
  tool,
  'Error transferring playback',
)
