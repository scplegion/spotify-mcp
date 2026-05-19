import {z} from 'zod'
import {createSuccessResponse, withErrorHandling} from '../../utils/response.js'
import {getDefaultSpotifyClient} from '../../config/spotify.js'

export const GetDevicesToolParams = z.object({})

type Params = z.infer<typeof GetDevicesToolParams>

async function tool(_params: Params) {
  const spotifyClient = getDefaultSpotifyClient()
  const response = await spotifyClient.getMyDevices()

  const devices = response.body.devices.map((d) => ({
    id: d.id,
    name: d.name,
    type: d.type,
    is_active: d.is_active,
    is_private_session: d.is_private_session,
    is_restricted: d.is_restricted,
    volume_percent: d.volume_percent,
  }))

  return createSuccessResponse(`Retrieved ${devices.length} device(s)`, {
    devices,
  })
}

export const getDevicesTool = withErrorHandling(
  tool,
  'Error getting available devices',
)
