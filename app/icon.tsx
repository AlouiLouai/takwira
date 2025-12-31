import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 512, height: 512 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f4d2d',
          borderRadius: '20%',
        }}
      >
        <div style={{ fontSize: 320 }}>⚽</div>
      </div>
    ),
    { ...size }
  )
}
