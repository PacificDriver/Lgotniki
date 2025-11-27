import React from 'react'

import AppPage from '../../../components/CustomUI/AppPage'
import {
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Panel,
} from '../../../components/BaseUI/Tabs'
import {
  ComponentInfo,
  Description,
  Preview,
  Snippet,
} from '../../../components/CustomUI/ComponentInfo'
import Avatar from '../../../components/CustomUI/Avatar'

export default function Avatars() {
  return (
    <AppPage title="Avatar">
      <Tabs>
        <TabList>
          <Tab>Examples</Tab>
        </TabList>

        <TabPanel>
          <Panel>
            <div className="mt-3">
              <ComponentInfo title="Default">
                <Description>
                  <p>
                    When no image or name is provided, the avatar component will
                    display a default image.
                  </p>
                </Description>

                <Preview>
                  <Avatar />
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import Avatar from '../../../components/CustomUI/Avatar';

                                        const AvatarDefaultExample = () => {
                                            return <Avatar />;
                                        };

                                        export default AvatarDefaultExample;
                                    `}
                </Snippet>
              </ComponentInfo>

              <ComponentInfo title="Simple">
                <Description>
                  <p>
                    By providing an image and name, if the image fails to load,
                    the initials of the name will be displayed as a fallback.
                  </p>
                </Description>

                <Preview>
                  <div className="d-flex gap-1">
                    <Avatar
                      src="https://images.unsplash.com/photo-1545912453-db258ca9b7b7?w=400"
                      name="Emmilly Jordan"
                    />

                    <Avatar
                      src="https://images.unsplash.com/photo-154591245j3-db258ca9b7b7?w=500"
                      name="Emmilly Jordan"
                    />
                  </div>
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import Avatar from '../../../components/CustomUI/Avatar';

                                        const AvatarSimpleExample = () => {
                                            return <Avatar 
                                                src='https://images.unsplash.com/photo-1545912453-db258ca9b7b7?w=400'
                                                name="Emmilly Jordan"
                                            />;
                                        };

                                        export default AvatarSimpleExample;
                                    `}
                </Snippet>
              </ComponentInfo>

              <ComponentInfo title="Offline">
                <Preview>
                  <div className="d-flex gap-1">
                    <Avatar
                      src="https://images.unsplash.com/photo-1545912453-db258ca9b7b7?w=400"
                      name="Emmilly Jordan"
                      status="offline"
                    />
                  </div>
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import Avatar from '../../../components/CustomUI/Avatar';

                                        const AvatarOfflineExample = () => {
                                            return <Avatar 
                                                src='https://images.unsplash.com/photo-1545912453-db258ca9b7b7?w=400'
                                                name='Emmilly Jordan'
                                                status='offline'
                                            />;
                                        };

                                        export default AvatarOfflineExample;
                                    `}
                </Snippet>
              </ComponentInfo>

              <ComponentInfo title="Online">
                <Preview>
                  <div className="d-flex gap-1">
                    <Avatar
                      src="https://images.unsplash.com/photo-1545912453-db258ca9b7b7?w=400"
                      name="Emmilly Jordan"
                      status="online"
                    />
                  </div>
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import Avatar from '../../../components/CustomUI/Avatar';

                                        const AvatarOnlineExample = () => {
                                            return <Avatar 
                                                src='https://images.unsplash.com/photo-1545912453-db258ca9b7b7?w=400'
                                                name='Emmilly Jordan'
                                                status='online'
                                            />;
                                        };

                                        export default AvatarOnlineExample;
                                    `}
                </Snippet>
              </ComponentInfo>

              <ComponentInfo title="Large">
                <Preview>
                  <div className="d-flex gap-1">
                    <Avatar
                      src="https://images.unsplash.com/photo-1545912453-db258ca9b7b7?w=400"
                      name="Emmilly Jordan"
                      size="large"
                    />
                  </div>
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import Avatar from '../../../components/CustomUI/Avatar';

                                        const AvatarLargeExample = () => {
                                            return <Avatar 
                                                src='https://images.unsplash.com/photo-1545912453-db258ca9b7b7?w=400'
                                                name='Emmilly Jordan'
                                                size='large'
                                            />;
                                        };

                                        export default AvatarLargeExample;
                                    `}
                </Snippet>
              </ComponentInfo>

              <ComponentInfo title="Medium">
                <Preview>
                  <div className="d-flex gap-1">
                    <Avatar
                      src="https://images.unsplash.com/photo-1545912453-db258ca9b7b7?w=400"
                      name="Emmilly Jordan"
                      size="medium"
                    />
                  </div>
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import Avatar from '../../../components/CustomUI/Avatar';

                                        const AvatarMediumExample = () => {
                                            return <Avatar 
                                                src='https://images.unsplash.com/photo-1545912453-db258ca9b7b7?w=400'
                                                name='Emmilly Jordan'
                                                size='medium'
                                            />;
                                        };

                                        export default AvatarMediumExample;
                                    `}
                </Snippet>
              </ComponentInfo>

              <ComponentInfo title="Small">
                <Preview>
                  <div className="d-flex gap-1">
                    <Avatar
                      src="https://images.unsplash.com/photo-1545912453-db258ca9b7b7?w=400"
                      name="Emmilly Jordan"
                      size="small"
                    />
                  </div>
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import Avatar from '../../../components/CustomUI/Avatar';

                                        const AvatarSmallExample = () => {
                                            return <Avatar 
                                                src='https://images.unsplash.com/photo-1545912453-db258ca9b7b7?w=400'
                                                name='Emmilly Jordan'
                                                size='small'
                                            />;
                                        };

                                        export default AvatarSmallExample;
                                    `}
                </Snippet>
              </ComponentInfo>
            </div>
          </Panel>
        </TabPanel>
      </Tabs>
    </AppPage>
  )
}
