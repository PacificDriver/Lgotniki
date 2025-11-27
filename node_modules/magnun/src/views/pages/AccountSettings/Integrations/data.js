import { useRequire as getImage } from '../../../../utils/utils'

const integrations = [
  {
    name: 'Trello',
    description: 'Project and task organization in a visual and intuitive way.',
    isConnected: false,
    image: getImage('brands/trello.png'),
  },
  {
    name: 'Mailchimp',
    description:
      'Email marketing platform that helps manage campaigns and connect with customers.',
    isConnected: true,
    image: getImage('brands/mailchimp.jpg'),
  },
  {
    name: 'Bitbucket',
    description:
      'Code hosting platform with version control and collaboration, focused on teams.',
    isConnected: true,
    image: getImage('brands/bitbucket.jpg'),
  },
  {
    name: 'Dropbox',
    description:
      'Cloud storage service to facilitate file sharing and collaboration.',
    isConnected: false,
    image: getImage('brands/dropbox.png'),
  },
  {
    name: 'Firebase',
    description:
      'Platform for mobile and web app development with cloud services.',
    isConnected: false,
    image: getImage('brands/firebase.webp'),
  },
  {
    name: 'Slack',
    description:
      'Team communication tool that integrates different services and facilitates collaboration.',
    isConnected: true,
    image: getImage('brands/slack.png'),
  },
  {
    name: 'Figma',
    description:
      'Collaborative design tool for prototyping and interface design.',
    isConnected: true,
    image: getImage('brands/figma.png'),
  },
  {
    name: 'Mixpanel',
    description: 'Product analytics to understand user behavior.',
    isConnected: false,
    image: getImage('brands/mixpanel.webp'),
  },
]

export { integrations }
