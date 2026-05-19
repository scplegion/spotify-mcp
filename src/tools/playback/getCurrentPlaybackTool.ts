import {z} from 'zod'
import {createSuccessResponse, withErrorHandling} from '../../utils/response.js'
import {getDefaultSpotifyClient} from '../../config/spotify.js'

export const GetCurrentPlaybackToolParams = z.object({})

type Params = z.infer<typeof GetCurrentPlaybackToolParams>

async function tool(_params: Params) {
  const spotifyClient = getDefaultSpotifyClient()
  const response = await spotifyClient.getMyCurrentPlaybackState()

  if (!response.body || Object.keys(response.body).length === 0) {
    return createSuccessResponse('No active playback session')
  }

  const state = response.body
  const item = state.item as
    | {
        id?: string
        name?: string
        uri?: string
        duration_ms?: number
        artists?: Array<{name: string; id: string}>
        album?: {name: string; id: string}
      }
    | null
    | undefined

  return createSuccessResponse('Current playback state', {
    is_playing: state.is_playing,
    progress_ms: state.progress_ms,
    shuffle_state: state.shuffle_state,
    repeat_state: state.repeat_state,
    device: state.device
      ? {
          id: state.device.id,
          name: state.device.name,
          type: state.device.type,
          is_active: state.device.is_active,
          volume_percent: state.device.volume_percent,
        }
      : null,
    context: state.context
      ? {type: state.context.type, uri: state.context.uri}
      : null,
    item: item
      ? {
          id: item.id,
          name: item.name,
          uri: item.uri,
          duration_ms: item.duration_ms,
          artists: item.artists?.map((a) => ({id: a.id, name: a.name})),
          album: item.album
            ? {id: item.album.id, name: item.album.name}
            : undefined,
        }
      : null,
  })
}

export const getCurrentPlaybackTool = withErrorHandling(
  tool,
  'Error getting current playback',
)
