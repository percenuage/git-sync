const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { Gitlab } = require('@gitbeaker/node');
const _ = require('lodash');

const REPOSITORIES_PATH = './repositories';
const ORIGIN_BITBUCKET = 'bitbucket.org:supertec-alpha';
const ORIGIN_GITLAB = 'gitlab.com:supertec-alpha';
const SUPERTEC_GITLAB_GROUP_ID = 4510012;

const gitlab = new Gitlab({ token: process.env.GITLAB_TOKEN });

let repositories = {};

const sync = async () => {
    console.time('test')

    // get repo from file
    const names = parseRepoToJsonArray();

    // get origin from gitlab
    // const gitlabOrigins = await getOriginsFromGitlab(names);

    // Update repository map
    // updateOrCreateRepositories(gitlabOrigins, names);

    // console.log(repositories)

    // sync
    await gitClone();


    console.timeEnd('test')

};

const parseRepoToJsonArray = (path = REPOSITORIES_PATH) => {
    return fs.readFileSync(path, {encoding: 'utf8'}).trim().split('\n');
};

const getOriginsFromGitlab = async (names) => {
    const promises = _.map(names, getProjectFromName);
    const repos = await Promise.all(promises);
    return _.map(repos, repo => repo && repo.ssh_url_to_repo);
};

const getProjectFromName = async (name) => {
    const projects = await gitlab.Projects.all({
        membership: true,
        simple: true,
        search: name
    });
    return projects.find(e => e.path === name);
};

const updateOrCreateRepositories = (gitlabOrigins, names) => {
    _.each(gitlabOrigins, (origin, index) => {
        const name = names[index];
        if (!origin) {
            createRepository(name);
        }
        repositories[name] = {
            bitbucketOrigin: `git@${ORIGIN_BITBUCKET}/${name}.git`,
            gitlabOrigin: origin || `git@${ORIGIN_GITLAB}/${name}.git`
        }
    });
};

const createRepository = async (name, namespace_id = SUPERTEC_GITLAB_GROUP_ID) => {
    return gitlab.Projects.create({ name, namespace_id });
};

const gitClone = async () => {
    try {
        const { stdout } = await exec('dir')
        console.log(stdout);
    } catch (e) {
        console.error(e)
    }

}

sync();





