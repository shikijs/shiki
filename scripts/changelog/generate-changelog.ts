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

const MAINTAINER_LOGINS = ['octref', 'orta', 'antfu']

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
      Authorization: 'bearer ' + (process.env.GITHUB_SECRET || process.env.GITHUB_TOKEN),
      'User-Agent': 'Shiki'
    }
  })

  if (200 < res.status && res.status >= 300)
    throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`)

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
  maintainerCommits: Commit[],
  maintainerPRs: PR[],
  coauthoredCommits: Commit[],
  contributedPRs: PR[]
) => {
  const date = new Date().toISOString().split('T')[0]

  let outMd = `## 0.x.x | ${date}\n\n`

  if (
    maintainerCommits.some(c => c.message.startsWith('feat') || c.message.startsWith('fix')) ||
    maintainerPRs.length > 0
  ) {
    outMd += `${FEAT_N_FIX_HEADER}\n\n`

    maintainerCommits.forEach(c => {
      outMd += `- ${c.message}\n`
    })

    maintainerPRs.forEach(pr => {
      outMd += `- ${pr.title}\n`
    })

    outMd += '\n'
  }

  if (coauthoredCommits.length + contributedPRs.length > 0) {
    outMd += `${CONTRIB_HEADER}\n\n`

    coauthoredCommits.map(c => {
      outMd += `- ${c.message} | [@${c.authors.nodes[0].user.login}](https://github.com/${c.authors.nodes[0].user.login})\n`
    })

    contributedPRs.map(pr => {
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

  const maintainerCommits: Commit[] = []
  const maintainerPRs: PR[] = []
  /**
   * Commits authored by others and pushed by a maintainer through PR
   * This happens if a PR is merged through squashing commits
   */
  const coauthoredCommits: Commit[] = []
  const contributedCommits: Commit[] = []
  const contributedPRs: PR[] = []

  commitsSinceLastTag.forEach(c => {
    if (c.message.startsWith('🤖')) {
      return
    }

    if (c.associatedPullRequests.edges.length === 0) {
      if (c.authoredByCommitter) {
        if (c.message.startsWith('feat') || c.message.startsWith('fix')) {
          maintainerCommits.push(c)
        }
      } else {
        coauthoredCommits.push(c)
      }
      return
    }

    if (c.associatedPullRequests.edges.length > 0) {
      if (MAINTAINER_LOGINS.includes(c.associatedPullRequests.edges[0].node.author.login)) {
        maintainerPRs.push(c.associatedPullRequests.edges[0].node)
      } else {
        contributedCommits.push(c)
      }
      return
    }
  })

  const seenPRIds = new Set()
  contributedCommits.forEach(c => {
    c.associatedPullRequests.edges.forEach(({ node: pr }) => {
      if (!seenPRIds.has(pr.id)) {
        seenPRIds.add(pr.id)
        contributedPRs.push(pr)
      }
    })
  })

  const changelog = fs.readFileSync(getFilePath('CHANGELOG.md'), 'utf-8')
  const changelogDelta = generateChangelogMd(
    maintainerCommits,
    maintainerPRs,
    coauthoredCommits,
    contributedPRs
  )

  const newChangelog = changelog.replace('# Changelog', `# Changelog\n\n${changelogDelta}`)

  fs.writeFileSync(getFilePath('CHANGELOG.md'), newChangelog)
}

const go = async () => {
  const latestTagNameData = await getGithubGraphql(readQuery('latest-tag-name.gql'))
  const latestCommitsData = await getGithubGraphql(readQuery('latest-commits.gql'))

  generateChangelog(latestTagNameData, latestCommitsData)
}

go()
