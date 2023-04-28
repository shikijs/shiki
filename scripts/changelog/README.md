# Generate Changelog

You can use scripts in this folder to generate a changelog.

- Create an `.env` file at the project root folder with your [GH personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token). Only the `repo:status` and `repo:public_repo` scopes are needed: 
    ```env
    GITHUB_SECRET=<YOUR_SECRET>
    ```
- Ensure `CHANGELOG.md` contains no new entries since last commit. For example, if last release was `0.14.0`, ensure no log is above `### 0.14.0`
- `pnpm run changelog`
- Change the new entry's version `0.x.x` to the to-be-released new version, and make other changes as you see fit
- That's it! Commit the changes with a message like `chore: changelog`