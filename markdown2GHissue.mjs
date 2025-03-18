import { Octokit } from "@octokit/rest";
import fs from "fs/promises";
import matter from "gray-matter";
import { parse } from 'yaml';
import 'dotenv/config';

// Access the environment variable
const githubToken = process.env.GITHUB_TOKEN;

const octokit = new Octokit({
  auth: githubToken, // Replace with your GitHub token
});

const variables = {
  gcp_project: 'musa5090s25_team1',
};

async function main() {
  // Read the file in issues/to-upload/issue-slugs.yml
  const issues = await fs.readFile('to-upload/issue-slugs.yaml', 'utf-8');
  const issueSlugs = parse(issues).issues;

  // For each issue, read the file in issues/to-upload/{issueSlug}.md; parse the front matter.
  for (const issueSlug of issueSlugs) {
    const filePath = `to-upload/${issueSlug}.md`;
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const { data: frontMatter, content: body } = matter(fileContent);

    // Extract relevant fields from the front matter
    const { title, labels } = frontMatter;

    try {
      // Try to update the issue if it already exists
      await octokit.request('PATCH /repos/{owner}/{repo}/issues/{issue_number}', {
        owner: 'junyi2022', // Replace with your GitHub username or organization
        repo: 'GitHubAPI-test', // Replace with your repository name
        issue_number: issueSlug, // Assuming the issue slug is the issue number
        title,
        body,
        labels,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });
      console.log(`Updated issue: ${title}`);
    } catch (error) {
      if (error.status === 404) {
        // If the issue doesn't exist, create a new one
        await octokit.request('POST /repos/{owner}/{repo}/issues', {
          owner: 'OWNER', // Replace with your GitHub username or organization
          repo: 'REPO', // Replace with your repository name
          title,
          body,
          labels,
          headers: {
            'X-GitHub-Api-Version': '2022-11-28'
          }
        });
        console.log(`Created issue: ${title}`);
      } else {
        throw error;
      }
    }
  }
}

main().catch(console.error);