#!/bin/sh

PROJECT_NAME=inovhub-server
#PROJECT_NAME=sync-test
GITLAB=gitlab.com:percenuage
#GITLAB=gitlab.com:supertec-alpha
BITBUCKET=bitbucket.org:supertec-alpha
#BITBUCKET=bitbucket.org:agendillard

ORIGIN_GITLAB=git@${GITLAB}/${PROJECT_NAME}.git
ORIGIN_BITBUCKET=git@${BITBUCKET}/${PROJECT_NAME}.git

FOLDER_NAME_GITLAB=gitlab-${PROJECT_NAME}.git
FOLDER_NAME_BITBUCKET=bitbucket-${PROJECT_NAME}.git

#####################################
### FOR SINGLE WAY SYNC (BITBUCKET -> GITLAB)
#####################################

echo "=> [Git | Clone] $ORIGIN_BITBUCKET"
git clone --bare $ORIGIN_BITBUCKET $FOLDER_NAME_BITBUCKET

echo "=> [Git | Push] $ORIGIN_GITLAB"
git -C $FOLDER_NAME_BITBUCKET push --mirror $ORIGIN_GITLAB

echo "=> [Git | Remove] $FOLDER_NAME_BITBUCKET"
yes | rm -r $FOLDER_NAME_BITBUCKET

#####################################
### FOR SINGLE WAY SYNC (GITLAB -> BITBUCKET)
#####################################

#echo "=> [Git | Clone] $ORIGIN_GITLAB"
#git clone --bare $ORIGIN_GITLAB $FOLDER_NAME_GITLAB
#
#echo "=> [Git | Push] $ORIGIN_BITBUCKET"
#git -C $FOLDER_NAME_GITLAB push --mirror $ORIGIN_BITBUCKET
#
#echo "=> [Git | Remove] $FOLDER_NAME_GITLAB"
#yes | rm -r $FOLDER_NAME_GITLAB

#####################################
### FOR DOUBLE WAY SYNC
#####################################

#echo "=> [Git | Clone] $ORIGIN_GITLAB"
#git clone --bare $ORIGIN_GITLAB $FOLDER_NAME_GITLAB

#echo "=> [Git | Clone] $ORIGIN_BITBUCKET"
#git clone --bare $ORIGIN_BITBUCKET $FOLDER_NAME_BITBUCKET

#echo "=> [Git | Latest Commit]"
#LATEST_GITLAB=`git -C $FOLDER_NAME_GITLAB for-each-ref --count=1 --sort=-committerdate --format='%(committerdate:unix)' refs/heads/`
#LATEST_BITBUCKET=`git -C $FOLDER_NAME_BITBUCKET for-each-ref --count=1 --sort=-committerdate --format='%(committerdate:unix)' refs/heads/`
#
#echo $LATEST_GITLAB
#echo $LATEST_BITBUCKET
#
#if [ "$LATEST_GITLAB" -gt "$LATEST_BITBUCKET" ]; then
#  FOLDER_NAME=$FOLDER_NAME_GITLAB
#  ORIGIN=$ORIGIN_BITBUCKET
##elif [ "LATEST_GITLAB" -lt "LATEST_BITBUCKET" ]; then
#else
#  FOLDER_NAME=$FOLDER_NAME_BITBUCKET
#  ORIGIN=$ORIGIN_GITLAB
#fi
#
#echo "PROJECT: $FOLDER_NAME_BITBUCKET"
#echo "ORIGIN: $ORIGIN_GITLAB"

#echo "=> [Git | Push] $ORIGIN"
#git -C $FOLDER_NAME push --mirror $ORIGIN

#echo "=> [Git | Remove] $FOLDER_NAME_GITLAB"
#yes | rm -r $FOLDER_NAME_GITLAB
#
#echo "=> [Git | Remove] $FOLDER_NAME_BITBUCKET"
#yes | rm -r $FOLDER_NAME_BITBUCKET