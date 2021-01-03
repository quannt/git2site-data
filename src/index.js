require('dotenv').config()
const { Octokit } = require("@octokit/rest")
const fs = require('fs')

const octokit = new Octokit({
  auth: process.env.AUTH,
  userAgent: process.env.USER_AGENT
})

async function fetchData () {
  const labels = (process.env.REPO_LABELS && process.env.REPO_LABELS.split(',').map(x => x.trim())) || []
  return octokit
    .paginate(octokit.issues.listForRepo, {
      owner: process.env.REPO_OWNER,
      repo: process.env.REPO_NAME,
      labels,
      state: 'open'
    })
}

function generateSites (data) {
  fs.writeFileSync(`./data/data.json`, JSON.stringify(data))
}


fetchData().then((data) => {
  generateSites(data)
}).catch((error) => {
  console.error(error)
})