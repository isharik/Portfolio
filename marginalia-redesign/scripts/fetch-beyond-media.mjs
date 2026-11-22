import { writeFile, mkdir } from 'node:fs/promises'
import sharp from 'sharp'

const imageDirectory = new URL('../public/images/', import.meta.url)
await mkdir(imageDirectory, { recursive: true })

const tracks = [
  ['the-beatles', 'The Beatles', 'Here Comes the Sun'],
  ['eminem', 'Eminem', 'Lose Yourself'],
  ['don-toliver', 'Don Toliver', 'No Idea'],
  ['raye', 'RAYE', 'Escapism.'],
  ['justin-bieber', 'Justin Bieber', 'Ghost'],
  ['j-cole', 'J. Cole', 'No Role Modelz'],
  ['joji', 'Joji', 'SLOW DANCING IN THE DARK'],
  ['brent-faiyaz', 'Brent Faiyaz', 'ALL MINE'],
  ['daniel-caesar', 'Daniel Caesar', 'Best Part (feat. H.E.R.)'],
  ['the-neighbourhood', 'The Neighbourhood', 'Sweater Weather'],
  ['cigarettes-after-sex', 'Cigarettes After Sex', 'Apocalypse'],
]

const output = []
for (const [slug, artist, song] of tracks) {
  const search = new URL('https://itunes.apple.com/search')
  search.searchParams.set('term', `${artist} ${song.replace(/[^\w\s]/g, '')}`)
  search.searchParams.set('entity', 'song')
  search.searchParams.set('limit', '25')
  const response = await fetch(search)
  if (!response.ok) throw new Error(`iTunes search ${artist}: ${response.status}`)
  const { results } = await response.json()
  const normalized = text => text.toLowerCase().replace(/[^a-z0-9]/g, '')
  const match = results.find(item => normalized(item.artistName).startsWith(normalized(artist)) && normalized(item.trackName) === normalized(song))
    ?? results.find(item => normalized(item.artistName) === normalized(artist) && normalized(item.trackName).startsWith(normalized(song)))
  if (!match?.previewUrl || !match?.artworkUrl100) throw new Error(`No exact preview for ${artist} / ${song}`)
  const artUrl = match.artworkUrl100.replace(/100x100bb\.[a-z]+(?:\?.*)?$/i, '600x600bb.jpg')
  const artwork = await fetch(artUrl)
  if (!artwork.ok) throw new Error(`Cover download ${artist}: ${artwork.status}`)
  const image = await sharp(Buffer.from(await artwork.arrayBuffer())).resize(600, 600, { fit: 'cover' }).webp({ quality: 86 }).toBuffer()
  await writeFile(new URL(`spotify-album-${slug}.webp`, imageDirectory), image)
  output.push({ label: artist, track: match.trackName, album: match.collectionName, previewUrl: match.previewUrl, href: match.trackViewUrl, image: `/images/spotify-album-${slug}.webp` })
  process.stdout.write(`${artist} — ${match.trackName} (${match.collectionName})\n`)
}
await writeFile(new URL('../src/musicRotation.json', import.meta.url), JSON.stringify(output, null, 2) + '\n')
