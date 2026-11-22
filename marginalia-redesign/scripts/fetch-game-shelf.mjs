import { mkdir, readFile, writeFile } from 'node:fs/promises'
import sharp from 'sharp'

const games = [
  ['Valorant', 'Tactical'], ['Counter-Strike 2', 'Tactical'],
  ['Far Cry 2', 'Open world'], ['Far Cry 3', 'Open world'], ['Far Cry 3: Blood Dragon', 'Retro FPS'],
  ['Far Cry 4', 'Open world'], ['Far Cry Primal', 'Survival'], ['Far Cry 5', 'Open world'],
  ['Far Cry New Dawn', 'Open world'], ['Far Cry 6', 'Open world'],
  ['Watch Dogs', 'Hacking'], ['Watch Dogs 2', 'Hacking'], ['Watch Dogs: Legion', 'Hacking'],
  ['Ghost of Tsushima', 'Adventure'], ['Ghost of Yōtei', 'Adventure'],
  ['Outer Wilds', 'Mystery'], ['Disco Elysium', 'RPG'], ['Return of the Obra Dinn', 'Mystery'],
  ['Control', 'Paranormal'], ['Sekiro: Shadows Die Twice', 'Action'], ['Red Dead Redemption 2', 'Open world'],
  ['Cyberpunk 2077', 'RPG'], ['Elden Ring', 'Soulslike'], ['Hollow Knight', 'Metroidvania'],
  ['Death Stranding', 'Adventure'], ['Deathloop', 'Immersive sim'], ['S.T.A.L.K.E.R. 2', 'Survival'],
  ['Kingdom Come: Deliverance II', 'RPG'], ['NieR: Automata', 'Action RPG'],
]

const directory = new URL('../public/images/', import.meta.url)
await mkdir(directory, { recursive: true })
const slug = value => value.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const normalize = value => value.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g, '')
const steamIds = { 'Watch Dogs':243470, Control:870780, 'Death Stranding':1850570 }

async function getPoster(title, searchTerm) {
  if (title === 'Valorant') {
    return { imageUrls:[new URL('./assets/valorant-poster.webp', import.meta.url).href], href: 'https://playvalorant.com/en-us/media/' }
  }
  if (title === 'Ghost of Yōtei') {
    const pageUrl = title === 'Valorant' ? 'https://playvalorant.com/en-us/media/' : 'https://www.playstation.com/en-us/games/ghost-of-yotei/'
    const html = await (await fetch(pageUrl)).text()
    const imageUrl = html.match(/<meta[^>]+(?:property|name)="og:image"[^>]+content="([^"]+)"/)?.[1]
      ?? html.match(/<meta[^>]+content="([^"]+)"[^>]+(?:property|name)="og:image"/)?.[1]
    if (!imageUrl) throw new Error(`No official art for ${title}`)
    return { imageUrls:[imageUrl.replaceAll('&amp;', '&')], href: pageUrl }
  }
  const query = encodeURIComponent(searchTerm ?? title)
  const response = await fetch(`https://store.steampowered.com/api/storesearch/?term=${query}&l=english&cc=US`)
  if (!response.ok) throw new Error(`Steam search ${title}: ${response.status}`)
  const items = (await response.json()).items ?? []
  const wanted = normalize(searchTerm ?? title)
  const match = steamIds[title] ? { id:steamIds[title], name:title } : items.find(item => normalize(item.name) === wanted) ?? items.find(item => normalize(item.name).startsWith(wanted)) ?? items[0]
  if (!match) throw new Error(`No Steam result for ${title}`)
  const portrait = `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${match.id}/library_600x900.jpg`
  const fallback = `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${match.id}/header.jpg`
  return { imageUrls:[portrait, fallback, match.tiny_image].filter(Boolean), href: `https://store.steampowered.com/app/${match.id}/`, matched:match.name }
}

const output = []
for (let start = 0; start < games.length; start += 5) {
  const batch = await Promise.all(games.slice(start, start + 5).map(async ([title, genre, searchTerm]) => {
    const { imageUrls, href, matched } = await getPoster(title, searchTerm)
    let imageBuffer
    for (const imageUrl of imageUrls) {
      if (imageUrl.startsWith('file:')) {
        imageBuffer = await readFile(new URL(imageUrl))
        break
      }
      const response = await fetch(imageUrl)
      if (response.ok && response.headers.get('content-type')?.startsWith('image/')) { imageBuffer = Buffer.from(await response.arrayBuffer()); break }
    }
    if (!imageBuffer) throw new Error(`No artwork for ${title}`)
    const image = await sharp(imageBuffer).resize(340, 460, { fit: 'contain', background: { r: 20, g: 19, b: 19, alpha: 1 } }).webp({ quality: 88 }).toBuffer()
    const filename = `game-${slug(title)}.webp`
    await writeFile(new URL(filename, directory), image)
    process.stdout.write(`${title} ← ${matched ?? 'official art'}\n`)
    return { title, genre, image:`/images/${filename}`, href }
  }))
  output.push(...batch)
}
await writeFile(new URL('../src/gameShelf.json', import.meta.url), JSON.stringify(output, null, 2) + '\n')
