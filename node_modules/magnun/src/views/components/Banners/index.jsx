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
import Banner from '../../../components/BaseUI/Banner'

import { MdInfo } from 'react-icons/md'
import { MdOutlineWarning } from 'react-icons/md'
import { MdOutlineError } from 'react-icons/md'

export default function Banners() {
  return (
    <AppPage title="Banners">
      <Tabs>
        <TabList>
          <Tab>Examples</Tab>
        </TabList>

        <TabPanel>
          <Panel>
            <div className="mt-3">
              <ComponentInfo title="Default">
                <Description>
                  <p>This is the default banner.</p>
                </Description>

                <Preview>
                  <Banner>
                    Please be advised of upcoming system maintenance. Some
                    services may experience temporary disruptions.
                  </Banner>
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import Banner from "../../../components/BaseUI/Banner";

                                        const BannerDefaultExample = () => {
                                            return <Banner>
                                                Please be advised of upcoming system maintenance. Some services may experience temporary disruptions.
                                            </Banner>
                                        };

                                        export default BannerDefaultExample;
                                    `}
                </Snippet>
              </ComponentInfo>
            </div>

            <div className="mt-3">
              <ComponentInfo title="Info">
                <Preview>
                  <Banner appearance="info" icon={<MdInfo />}>
                    The rapid advancements in technology have significantly
                    reshaped the landscape of our daily lives, influencing the
                    way we communicate, work, and navigate the world around us.
                  </Banner>
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import Banner from "../../../components/BaseUI/Banner";

                                        import { MdInfo } from "react-icons/md";

                                        const BannerInfoExample = () => {
                                            return <Banner
                                                    appearance='info'
                                                    icon={<MdInfo />}
                                                >
                                                    The rapid advancements in technology have significantly reshaped the landscape of our daily lives, influencing the way we communicate, work, and navigate the world around us.
                                                </Banner>
                                            };

                                        export default BannerInfoExample;
                                    `}
                </Snippet>
              </ComponentInfo>
            </div>

            <div className="mt-3">
              <ComponentInfo title="Warning">
                <Preview>
                  <Banner appearance="warning" icon={<MdOutlineWarning />}>
                    Critical security breach detected! Unusual activity has been
                    identified on the network, posing a potential threat to
                    sensitive information. Immediate action is strongly advised
                    to safeguard data and prevent further unauthorized access.
                  </Banner>
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import Banner from "../../../components/BaseUI/Banner";

                                        import { MdOutlineWarning } from "react-icons/md";

                                        const BannerWarningExample = () => {
                                            return <Banner
                                                appearance='warning'
                                                icon={<MdOutlineWarning />}
                                            >
                                                Critical security breach detected! Unusual activity has been identified on the network, posing a potential threat to sensitive information. Immediate action is strongly advised to safeguard data and prevent further unauthorized access.
            
                                            </Banner>
                                        };

                                        export default BannerWarningExample;
                                    `}
                </Snippet>
              </ComponentInfo>
            </div>

            <div className="mt-3">
              <ComponentInfo title="Danger">
                <Preview>
                  <Banner appearance="danger" icon={<MdOutlineError />}>
                    System Failure Imminent! A severe issue has been identified
                    that poses an imminent threat to the stability and
                    functionality of the system. Immediate intervention is
                    essential to prevent irreversible damage and ensure the
                    continuity of operations.
                  </Banner>
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import Banner from "../../../components/BaseUI/Banner";

                                        import { MdOutlineError } from "react-icons/md";

                                        const BannerDangerExample = () => {
                                            return <Banner
                                                appearance='danger'
                                                icon={<MdOutlineError />}
                                            >
                                                System Failure Imminent! A severe issue has been identified that poses an imminent threat to the stability and functionality of the system. Immediate intervention is essential to prevent irreversible damage and ensure the continuity of operations.
            
                                            </Banner>
                                        };

                                        export default BannerDangerExample;
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
