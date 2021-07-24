export default {
  title: 'Board',
  name: 'board',
  type: 'document',
  fields: [
    { title: 'Title', name: 'title', type: 'string' },
    { title: 'Image', name: 'image', type: 'image' },
    {
      title: 'Description',
      name: 'description',
      type: 'text',
      validation: Rule => [Rule.required()],
    },
    {
      title: 'Members',
      name: 'members',
      type: 'array',
      of: [{ type: 'user' }],
      validation: Rule => Rule.unique(),
    },
    {
      title: 'Visibility',
      name: 'visibility',
      readOnly: true,
      type: 'string',
      options: { list: ['private', 'public'] },
    },
    { title: 'Owner', name: 'createdBy', type: 'reference', to: [{ type: 'user' }] },
    {
      title: 'Date Created',
      name: 'createdAt',
      type: 'datetime',
      readOnly: true,
      initialValue: new Date().toUTCString(),
    },
  ],
};
