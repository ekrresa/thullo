import sanityClient from '@sanity/client';

export const client = sanityClient({
  projectId: '4h795d2n',
  dataset: 'production',
  apiVersion: '2019-01-29', // use current UTC date - see "specifying API version"!
  token: 'sanity-auth-token', // or leave blank for unauthenticated usage
  useCdn: true, // `false` if you want to ensure fresh data
});
