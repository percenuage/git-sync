# Git Sync

> A script to synchronize Bitbucket remote repositories to Gitlab.

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
