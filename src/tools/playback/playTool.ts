import {z} from 'zod'
import {createSuccessResponse, withErrorHandling} from '../../utils/response.js'
import {getDefaultSpotifyClient} from '../../config/spotify.js'

export const PlayToolParams = z.object({
  device_id: z
    .string()
    .optional()
    .describe(
      'Target Spotify device id. If omitted, plays on the user’s currently active device.',
    ),
  context_uri: z
    .string()
    .optional()
    .describe(
      'Spotify URI of the album, playlist, or artist to play (e.g. spotify:album:..., spotify:playlist:...). Mutually exclusive with `uris`.',
    ),
  uris: z
    .array(z.string())
    .max(100)
    .optional()
    .describe(
      'Array of Spotify track URIs to play (e.g. spotify:track:...). Mutually exclusive with `context_uri`.',
    ),
  offset_position: z
    .number()
    .min(0)
    .optional()
    .describe(
      'Zero-based index of the track to start from within the context. Use with `context_uri`.',
    ),
  offset_uri: z
    .string()
    .optional()
    .describe(
      'Spotify URI of the track to start from within the context. Use with `context_uri`.',
    ),
  position_ms: z
    .number()
    .min(0)
    .optional()
    .describe('Position within the track to start playback, in milliseconds.'),
})

type Params = z.infer<typeof PlayToolParams>

async function tool(params: Params) {
  if (params.context_uri && params.uris) {
    throw new Error('Provide either `context_uri` or `uris`, not both.')
  }

  const spotifyClient = getDefaultSpotifyClient()

  const options: Record<string, unknown> = {}
  if (params.device_id) options.device_id = params.device_id
  if (params.context_uri) options.context_uri = params.context_uri
  if (params.uris) options.uris = params.uris
  if (params.position_ms !== undefined) options.position_ms = params.position_ms
  if (params.offset_position !== undefined) {
    options.offset = {position: params.offset_position}
  } else if (params.offset_uri) {
    options.offset = {uri: params.offset_uri}
  }

  await spotifyClient.play(options)

  return createSuccessResponse('Playback started', {
    device_id: params.device_id ?? null,
    context_uri: params.context_uri ?? null,
    uris_count: params.uris?.length ?? 0,
  })
}

export const playTool = withErrorHandling(tool, 'Error starting playback')
