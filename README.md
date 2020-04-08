# Git Sync

A simple node script to synchronize Bitbucket remote repositories to Gitlab periodically.

It's a unidirectional synchronization from Bitbucket to Gitlab. 

By default, the script will run once. If you want it to run periodically (eg. every minutes), you need to add `CRONTAB=* * * * *` environment variable.

Script steps:

1. Get the name of the repositories to synchronize from `REPOSITORIES=repo1,repo2,...` environment variable.
2. Check if these names exist on your bitbucket account.
3. Get the paths of the repositories on your Gitlab account.
4. If there is no Gitlab repository matching the name, the repository will be created.
5. Clone (bare) from Bitbucket and push (mirror) to Gitlab.
6. Done

## Getting Started

### Environment Variables

| Variable           | Default | Example   |
|--------------------|---------|-----------|
| BITBUCKET_USERNAME | -       | jdoe      |
| BITBUCKET_PASSWORD | -       | xxxx      |
| BITBUCKET_GROUP_ID | -       | johndoe   |
| GITLAB_TOKEN       | -       | xxxx      |
| GITLAB_GROUP_ID    | -       | 0000000   |
| REPOSITORIES       | -       | rep1,rep2 |
| EXEC_CWD           | /tmp    | /tmp      |
| CRONTAB            | -       | * * * * * |

### Docker

```sh
$ docker run -e GITLAB_TOKEN=xxxxx -e REPOSITORIES=git-sync -e CRONTAB="* * * * *" percenuage/get-sync:latest

or

$ docker run --env-file=.env percenuage/get-sync:latest
```

## Sources

- [Node-Bitbucket](https://github.com/MunifTanjim/node-bitbucket)
- [Bitbucketjs Docs](https://bitbucketjs.netlify.com/#api-_)
- [Bitbucket API Docs](https://developer.atlassian.com/bitbucket/api/2/reference/)
- [Gitbeaker](https://github.com/jdalrymple/gitbeaker)
- [Gitlap Api Docs](https://gitlab.com/gitlab-org/gitlab/tree/master/doc/api#personal-access-tokens)
