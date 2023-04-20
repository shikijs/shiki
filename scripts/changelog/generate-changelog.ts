import * as dotenv from 'dotenv'
dotenv.config()

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT_DIR = path.resolve(__dirname, '../../')
const getFilePath = (p: string) => path.resolve(ROOT_DIR, p)

const FEAT_N_FIX_HEADER = `### 🚀 Features & Fixes`
const CONTRIB_HEADER = `### 🙌 Contributions`

const readQuery = (filename: string) => {
  return fs.readFileSync(path.resolve(__dirname, `./${filename}`), 'utf-8')
}

const getGithubGraphql = async (query: string) => {
  const data = JSON.stringify({ query })

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    body: data,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': `${data.length}`,
      Authorization: 'bearer ' + process.env.GITHUB_SECRET,
      'User-Agent': 'Shiki'
    }
  })

  return await res.json()
}

interface PR {
  id: string
  title: string
  number: number
  url: string
  author: {
    login: string
  }
}
interface Commit {
  message: string
  authoredByCommitter: boolean
  authors: {
    nodes: { user: { login: string } }[]
  }
  associatedPullRequests: {
    edges: { node: PR }[]
  }
}

const generateChangelogMd = (
  pureCommits: Commit[],
  coauthoredCommits: Commit[],
  contributedCommits: Commit[]
) => {
  const date = new Date().toISOString().split('T')[0]

  let outMd = `## 0.x.x | ${date}\n\n`

  if (pureCommits.some(c => c.message.startsWith('feat') || c.message.startsWith('fix'))) {
    outMd += `${FEAT_N_FIX_HEADER}\n\n`

    pureCommits.forEach(c => {
      if (c.message.startsWith('feat') || c.message.startsWith('fix')) {
        outMd += `- ${c.message}\n`
      }
    })

    outMd += '\n'
  }

  const prMap: { [prId: string]: PR } = {}
  contributedCommits.forEach(c => {
    c.associatedPullRequests.edges.forEach(({ node: pr }) => {
      if (!(pr.id in prMap)) {
        prMap[pr.id] = pr
      }
    })
  })

  const prs = Object.values(prMap)

  if (coauthoredCommits.length + prs.length > 0) {
    outMd += `${CONTRIB_HEADER}\n\n`

    coauthoredCommits.map(c => {
      outMd += `- ${c.message} | [@${c.authors.nodes[0].user.login}](https://github.com/${c.authors.nodes[0].user.login})\n`
    })

    prs.map(pr => {
      outMd += `- ${pr.title} | [#${pr.number}](${pr.url}) | [@${pr.author.login}](https://github.com/${pr.author.login})\n`
    })
  }

  return outMd
}

const generateChangelog = (latestTagNameData: any, latestCommitsData: any) => {
  const latestTag: string = latestTagNameData.data.repository.refs.edges[0].node.name
  const latestCommits: Commit[] =
    latestCommitsData.data.repository.defaultBranchRef.target.history.edges.map(e => {
      return e.node
    })

  const targetCommitIndex = latestCommits.findIndex(c => c.message === latestTag)
  const commitsSinceLastTag = latestCommits.slice(0, targetCommitIndex)

  let pureCommits: Commit[] = []
  /**
   * Commits authored by others and pushed by me
   */
  let coauthoredCommits: Commit[] = []
  let contributedCommits: Commit[] = []

  commitsSinceLastTag.forEach(c => {
    if (c.message.startsWith('🤖')) {
      return
    }

    if (c.associatedPullRequests.edges.length === 0) {
      if (c.authoredByCommitter) {
        pureCommits.push(c)
      } else {
        coauthoredCommits.push(c)
      }
      return
    }

    if (c.associatedPullRequests.edges.length > 0) {
      contributedCommits.push(c)
      return
    }
  })

  const changelog = fs.readFileSync(getFilePath('CHANGELOG.md'), 'utf-8')
  const changelogDelta = generateChangelogMd(pureCommits, coauthoredCommits, contributedCommits)

  const newChangelog = changelog.replace('# Changelog', `# Changelog\n\n${changelogDelta}`)

  fs.writeFileSync(getFilePath('CHANGELOG.md'), newChangelog)
}

const go = async () => {
  const latestTagNameData = await getGithubGraphql(readQuery('latest-tag-name.gql'))
  const latestCommitsData = await getGithubGraphql(readQuery('latest-commits.gql'))

  generateChangelog(latestTagNameData, latestCommitsData)
}

go()
