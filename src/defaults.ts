/*!
* Contentstack Sync Manager
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/

/**
 * @description Default application's internal config
 */
export const config = {
  'contentstack': {
    MAX_RETRY_LIMIT: 6,
    actions: {
      delete: 'delete',
      publish: 'publish',
      unpublish: 'unpublish',
    },
    apis: {
      content_types: '/v3/content_types/',
      sync: '/v3/stacks/sync',
    },
    host: 'cdn.contentstack.io',
    port: 443,
    protocol: 'https:',
    verbs: {
      get: 'GET',
    },
  },
  'locales': [],
  'sync-manager': {
    cooloff: 3000,
    enableAssetReferences: true,
    enableContentReferences: true,
    limit: 100,
    // max file sizes in bytes
    maxsize: 2097152,
    saveFailedItems: true,
    saveFilteredItems: true,
  },
}
