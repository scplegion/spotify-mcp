import type {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js'
import {getCurrentPlaybackTool, GetCurrentPlaybackToolParams} from './getCurrentPlaybackTool.js'
import {getDevicesTool, GetDevicesToolParams} from './getDevicesTool.js'
import {playTool, PlayToolParams} from './playTool.js'
import {pauseTool, PauseToolParams} from './pauseTool.js'
import {skipTool, SkipToolParams} from './skipTool.js'
import {setVolumeTool, SetVolumeToolParams} from './setVolumeTool.js'
import {addToQueueTool, AddToQueueToolParams} from './addToQueueTool.js'
import {transferPlaybackTool, TransferPlaybackToolParams} from './transferPlaybackTool.js'

export function registerPlaybackTools(server: McpServer) {
  server.tool(
    'get_current_playback',
    'Get the user’s current playback state, including the active device, currently playing track, progress, shuffle/repeat state, and playback context. Returns an empty result if no active session.',
    GetCurrentPlaybackToolParams.shape,
    getCurrentPlaybackTool,
  )

  server.tool(
    'get_devices',
    'List the user’s available Spotify Connect devices along with their id, name, type, active state, and current volume. Use the returned device id with other playback tools to target a specific device.',
    GetDevicesToolParams.shape,
    getDevicesTool,
  )

  server.tool(
    'play',
    'Start or resume playback on the active or specified device. Optionally play a specific context (album/playlist/artist URI) or a list of track URIs, with optional starting offset and position. Requires a Spotify Premium account.',
    PlayToolParams.shape,
    playTool,
  )

  server.tool(
    'pause',
    'Pause playback on the active or specified device. Requires a Spotify Premium account.',
    PauseToolParams.shape,
    pauseTool,
  )

  server.tool(
    'skip',
    'Skip to the next or previous track on the active or specified device. Requires a Spotify Premium account.',
    SkipToolParams.shape,
    skipTool,
  )

  server.tool(
    'set_volume',
    'Set the playback volume (0–100) on the active or specified device. Requires a Spotify Premium account. Not all device types support remote volume control.',
    SetVolumeToolParams.shape,
    setVolumeTool,
  )

  server.tool(
    'add_to_queue',
    'Add a track or episode (by Spotify URI) to the end of the user’s playback queue on the active or specified device. Requires a Spotify Premium account.',
    AddToQueueToolParams.shape,
    addToQueueTool,
  )

  server.tool(
    'transfer_playback',
    'Transfer playback to a specific device. Use `play: true` to ensure playback starts on the target device, or leave it false to preserve the current play/pause state. Requires a Spotify Premium account.',
    TransferPlaybackToolParams.shape,
    transferPlaybackTool,
  )
}
