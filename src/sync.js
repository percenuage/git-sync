const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const _ = require('lodash');
const { Gitlab } = require('@gitbeaker/node');
const { Bitbucket } = require('bitbucket');

const { BITBUCKET_USERNAME, BITBUCKET_PASSWORD, BITBUCKET_GROUP_ID, GITLAB_TOKEN, GITLAB_GROUP_ID } = process.env;
const EXEC_CWD = process.env.EXEC_CWD || '.';
const BITBUCKET_ORIGIN = `https://${BITBUCKET_USERNAME}:"${BITBUCKET_PASSWORD}"@bitbucket.org`;
const GITLAB_ORIGIN = `https://oauth2:${GITLAB_TOKEN}@gitlab.com`;

const gitlab = new Gitlab({ token: GITLAB_TOKEN });
const bitbucket = new Bitbucket({
    auth: {
        username: BITBUCKET_USERNAME,
        password: BITBUCKET_PASSWORD
    }
});

const sync = async () => {
    let names = getRepositoryNames();
    names = await filterExistedNamesFromBitbucket(names);
    const repositories = initRepositories(names);
    await addGitlabOrigins(repositories);
    await createMissingGitlabRepositories(repositories);
    await updateGitlabRemoteRepositories(repositories);
};

const getRepositoryNames = () => {
    return process.env.REPOSITORIES.trim().split(',');
};

const filterExistedNamesFromBitbucket = async (names) => {
    const promises = _.map(names, getBitbucketProjectFromName);
    try {
        const results = await Promise.allSettled(promises);
        return results.filter(res => res.status === 'fulfilled').map(res => res.value.data.slug);
    } catch (e) {
        console.error(e);
    }
};

const getBitbucketProjectFromName = async (name) => {
    return bitbucket.repositories.get({
        repo_slug: name,
        workspace: BITBUCKET_GROUP_ID
    });
};

const initRepositories = (names) => {
    return _.map(names, (name) => ({ name, bitbucketPath: `${BITBUCKET_GROUP_ID}/${name}.git` }));
};

const addGitlabOrigins = async (repositories) => {
    const promises = _.map(repositories, repo => getGitlabProjectFromName(repo.name));
    const gitlabRepos = await Promise.all(promises);
    _.each(repositories, (repos, index) => {
        const repo = gitlabRepos[index];
        repos.gitlabPath = repo && `${repo.path_with_namespace}.git`;
    });
    return repositories;
};

const getGitlabProjectFromName = async (name) => {
    const projects = await gitlab.Projects.all({
        membership: true,
        simple: true,
        search: name
    });
    return projects.find(e => e.path === name);
};

const createMissingGitlabRepositories = async (repositories) => {
    const repoToCreate =_.filter(repositories, { gitlabPath: undefined }).map(e => e.name);
    const promises = _.map(repoToCreate, createGitlabRepository);
    const createdRepos = await Promise.all(promises);
    _.each(createdRepos, (e) => {
        const repo = _.find(repositories, { name: e.path });
        repo.gitlabPath = `${e.path_with_namespace}.git`;
    });
    return repositories;
};

const createGitlabRepository = async (name) => {
    const description = ":warning: Do not push here :warning: Auto Update from Bitbucket :exclamation: " +
        "You can fully migrate to Gitlab by deleting the repository on Bitbucket (and this message).";
    return gitlab.Projects.create({ name, namespace_id: GITLAB_GROUP_ID, description, default_branch: 'master' });
};

const updateGitlabRemoteRepositories = async (repositories) => {
    return _.map(repositories, gitSyncBitbucketToGitlab);
};

const gitSyncBitbucketToGitlab = async (repo) => {
    console.info(`> Clone from Bitbucket ${repo.bitbucketPath}`);
    await execCommand(`git clone --bare ${BITBUCKET_ORIGIN}/${repo.bitbucketPath}`);

    console.info(`> Push ${repo.name}.git to Gitlab ${repo.gitlabPath}`);
    await execCommand(`git -C ${EXEC_CWD}/${repo.name}.git push --mirror ${GITLAB_ORIGIN}/${repo.gitlabPath}`);

    console.info(`> Delete ${repo.name}.git`);
    fs.rmdir(`${EXEC_CWD}/${repo.name}.git`,{ recursive: true }, console.error);
};

const execCommand = async (cmd) => {
    try {
        const { stdout, stderr } = await exec(cmd, { cwd: EXEC_CWD });
        console.info(stdout);
        if (stderr) console.error(stderr);
    } catch (e) {
        console.error(e)
    }
};

module.exports = sync;