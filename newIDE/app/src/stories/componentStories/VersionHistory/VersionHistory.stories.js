// @flow

import * as React from 'react';

import { action } from '@storybook/addon-actions';
import { type FilledCloudProjectVersion } from '../../../Utils/GDevelopServices/Project';

import muiDecorator from '../../ThemeDecorator';
import paperDecorator from '../../PaperDecorator';
import VersionHistory from '../../../VersionHistory';
import MockAdapter from 'axios-mock-adapter';

import { apiClient as projectApiAxiosClient } from '../../../Utils/GDevelopServices/User';
import { GDevelopUserApi } from '../../../Utils/GDevelopServices/ApiConfigs';

export default {
  title: 'VersionHistory',
  component: VersionHistory,
  decorators: [paperDecorator, muiDecorator],
};

const projectId = 'fb4d878a-1935-4916-b681-f9235475d354';
const versions: Array<FilledCloudProjectVersion> = [
  {
    id: '8e067d2d-6f08-4f93-ad2d-f3ad5ca3c69c',
    projectId,
    createdAt: '2022-12-14T10:11:49.305Z',
    previousVersion: '9f9f50a3-1bb2-41c3-9ddb-feaf9be45648',
    userId: 'a9bc54be-07e1-4f29-9739-5fbec2b04da7'
  },
  {
    id: '9f9f50a3-1bb2-41c3-9ddb-feaf9be45648',
    projectId,
    createdAt: '2022-12-13T10:11:49.305Z',
    previousVersion: '5280e344-bd36-4662-9948-cb0d18928d03',
    userId: 'c73c4d69-86a2-441b-a8b7-afe6b8fce810',
  },
  {
    id: '5280e344-bd36-4662-9948-cb0d18928d03',
    projectId,
    createdAt: '2022-12-12T10:11:49.305Z',
    previousVersion: null,
  },
];

const userPublicProfilesByIds = {
  'c73c4d69-86a2-441b-a8b7-afe6b8fce810': {
    id: 'c73c4d69-86a2-441b-a8b7-afe6b8fce810',
    username: 'alex_',
    description: null,
    donateLink: null,
    discordUsername: null,
    communityLinks: {},
    iconUrl:
      'https://www.gravatar.com/avatar/6079a3eba0dc05f12034c55bbce6aaa3?s=40&d=retro',
  },
  'a9bc54be-07e1-4f29-9739-5fbec2b04da7': {
    id: '9bc54be-07e1-4f29-9739-5fbec2b04da7',
    username: 'LuniMoon',
    description: null,
    donateLink: null,
    discordUsername: null,
    communityLinks: {},
    iconUrl:
      'https://www.gravatar.com/avatar/6079a3eba0dc05f12034c55bbce65aa3?s=40&d=retro',
  },
};

export const Default = () => {
  const projectServiceMock = new MockAdapter(projectApiAxiosClient, {
    delayResponse: 1000,
  });
  projectServiceMock
    .onGet(`${GDevelopUserApi.baseUrl}/user-public-profile`)
    .reply(200, userPublicProfilesByIds)
    .onAny()
    .reply(config => {
      console.error(`Unexpected call to ${config.url} (${config.method})`);
      return [504, null];
    });

  return <VersionHistory versions={versions} />;
};