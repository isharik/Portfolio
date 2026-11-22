import { mkdir, writeFile } from 'node:fs/promises'
import sharp from 'sharp'

const films = [
  ['Interstellar', 'Science fiction'], ['The Odyssey', 'Epic'], ['Blade Runner 2049', 'Neo-noir'],
  ['Arrival', 'Science fiction'], ['Stalker', 'Science fiction'], ['Coherence', 'Mystery'],
  ['Predestination', 'Science fiction'], ['The Fall', 'Fantasy'], ['The Fountain', 'Drama'],
  ['Moon', 'Science fiction'], ['Enemy', 'Thriller'], ['The Endless', 'Mystery'],
  ['Annihilation', 'Science fiction'], ['The Lobster', 'Satire'], ['Primer', 'Science fiction'],
  ['The Prestige', 'Mystery'],
]
const shows = [
  ['Severance', 'Psychological'], ['Dark', 'Science fiction'], ['The Leftovers', 'Drama'],
  ['Station Eleven', 'Post-apocalyptic'], ['Mr. Robot', 'Thriller'], ['Utopia', 'Thriller'],
  ['The OA', 'Mystery'], ['Devs', 'Science fiction'], ['Tales from the Loop', 'Science fiction'],
  ['Counterpart', 'Spy thriller'], ['The Expanse', 'Science fiction'], ['Undone', 'Drama'],
  ['True Detective', 'Crime'], ['Black Mirror', 'Anthology'],
]
const imageDirectory = new URL('../public/images/', import.meta.url)
await mkdir(imageDirectory, { recursive: true })
const slug = title => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

async function fetchOne([title, genre], kind) {
  const fixedUrl = title === 'Stalker' ? 'https://www.themoviedb.org/movie/1398-stalker' : null
  const searchUrl = new URL(fixedUrl ?? 'https://www.themoviedb.org/search')
  if (!fixedUrl) searchUrl.searchParams.set('query', title)
  const page = await fetch(searchUrl, { headers: { 'Accept-Language': 'en-US,en;q=.9' } })
  if (!page.ok) throw new Error(`Search failed for ${title}: ${page.status}`)
  const html = await page.text()
  const pattern = new RegExp(`data-media-type="${kind}"[^>]*href="([^"]+)"`, 'g')
  const matches = [...html.matchAll(pattern)]
  const normalized = slug(title)
  const found = matches.find(match => match[1].split('/').at(-1).replace(/^\d+-/, '') === normalized)
    ?? matches[0]
  if (!found && !fixedUrl) throw new Error(`No ${kind} result for ${title}`)
  const imageTag = fixedUrl
    ? html.match(/<meta property="og:image" content="([^"]+)"/)
    : html.slice(found.index, found.index + 1500).match(/<img[^>]+src="([^"]+)"/)
  if (!imageTag) throw new Error(`No poster for ${title}`)
  const posterPath = imageTag[1].match(/\/t\/p\/[^/]+(\/[^"?]+)/)?.[1]
  if (!posterPath) throw new Error(`No image path for ${title}`)
  const poster = await fetch(`https://image.tmdb.org/t/p/w500${posterPath}`)
  if (!poster.ok) throw new Error(`Poster failed for ${title}: ${poster.status}`)
  const image = await sharp(Buffer.from(await poster.arrayBuffer())).resize(300, 450, { fit: 'cover' }).webp({ quality: 82 }).toBuffer()
  const filename = `shelf-${slug(title)}.webp`
  await writeFile(new URL(filename, imageDirectory), image)
  process.stdout.write(`${title}\n`)
  return { title, genre, kind: kind === 'tv' ? 'TV' : 'Film', image: `/images/${filename}`, href: fixedUrl ?? `https://www.themoviedb.org${found[1]}` }
}

const titles = [...films.map(item => [item, 'movie']), ...shows.map(item => [item, 'tv'])]
const results = []
for (let start = 0; start < titles.length; start += 5) {
  const batch = await Promise.all(titles.slice(start, start + 5).map(([item, kind]) => fetchOne(item, kind)))
  results.push(...batch)
}
await writeFile(new URL('../src/screenShelf.json', import.meta.url), JSON.stringify(results, null, 2) + '\n')
