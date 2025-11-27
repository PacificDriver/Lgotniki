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
import ButtonGroup from '../../../components/BaseUI/ButtonGroup'
import Button from '../../../components/BaseUI/Button'

import { MdOutlineMail } from 'react-icons/md'
import { MdOutlineBugReport } from 'react-icons/md'
import { MdOutlineWorkOutline } from 'react-icons/md'

export default function ButtonGroups() {
  return (
    <AppPage title="Button Group">
      <Tabs>
        <TabList>
          <Tab>Examples</Tab>
        </TabList>

        <TabPanel>
          <Panel>
            <div className="mt-3">
              <ComponentInfo title="Default">
                <Preview>
                  <ButtonGroup>
                    <Button title="Submit" appearance="primary" />
                    <Button title="Cancel" />
                  </ButtonGroup>
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import ButtonGroup from "../../../components/BaseUI/ButtonGroup";
                                        import Button from "../../../components/BaseUI/Button";

                                        const ButtonGroupDefaultExample = () => {
                                            return <ButtonGroup>
                                                <Button title="Submit" appearance="primary"/>
                                                <Button title="Cancel"/>
                                            </ButtonGroup>

                                        export default ButtonGroupDefaultExample;
                                    `}
                </Snippet>
              </ComponentInfo>
            </div>

            <div className="mt-3">
              <ComponentInfo title="Placement">
                <Description>
                  Determines the placement of the buttons.
                </Description>

                <Preview>
                  <ButtonGroup placement="end">
                    <Button title="Submit" appearance="primary" />
                    <Button title="Cancel" />
                  </ButtonGroup>
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import ButtonGroup from "../../../components/BaseUI/ButtonGroup";
                                        import Button from "../../../components/BaseUI/Button";

                                        const ButtonGroupPlacementExample = () => {
                                            return <ButtonGroup placement="end">
                                                <Button title="Submit" appearance="primary"/>
                                                <Button title="Cancel"/>
                                            </ButtonGroup>

                                        export default ButtonGroupPlacementExample;
                                    `}
                </Snippet>
              </ComponentInfo>
            </div>

            <div className="mt-3">
              <ComponentInfo title="Reverse">
                <Description>Reverses the order of the buttons.</Description>

                <Preview>
                  <ButtonGroup reverse>
                    <Button title="Submit" appearance="primary" />
                    <Button title="Cancel" />
                  </ButtonGroup>
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import ButtonGroup from "../../../components/BaseUI/ButtonGroup";
                                        import Button from "../../../components/BaseUI/Button";

                                        const ButtonGroupReverseExample = () => {
                                            return <ButtonGroup reverse>
                                                <Button title="Submit" appearance="primary"/>
                                                <Button title="Cancel"/>
                                            </ButtonGroup>

                                        export default ButtonGroupReverseExample;
                                    `}
                </Snippet>
              </ComponentInfo>
            </div>

            <div className="mt-3">
              <ComponentInfo title="Appearance">
                <Description>
                  Determines the appearance of the buttons.
                </Description>

                <Preview>
                  <ButtonGroup appearance="primary">
                    <Button
                      title="Request feedback"
                      useIcon={{
                        direction: 'left',
                        icon: <MdOutlineMail />,
                      }}
                    />
                    <Button
                      title="Create new project"
                      useIcon={{
                        direction: 'left',
                        icon: <MdOutlineWorkOutline />,
                      }}
                    />
                    <Button
                      title="Report problem"
                      useIcon={{
                        direction: 'left',
                        icon: <MdOutlineBugReport />,
                      }}
                    />
                  </ButtonGroup>
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import ButtonGroup from "../../../components/BaseUI/ButtonGroup";
                                        import Button from "../../../components/BaseUI/Button";

                                        import { MdOutlineMail } from "react-icons/md";
                                        import { MdOutlineBugReport } from "react-icons/md";
                                        import { MdOutlineWorkOutline } from "react-icons/md";

                                        const ButtonGroupAppearanceExample = () => {
                                            return  <ButtonGroup appearance="primary">
                                                <Button 
                                                    title="Request feedback" 
                                                    useIcon={{
                                                        direction: 'left',
                                                        icon: <MdOutlineMail />
                                                    }}
                                                />
                                                <Button 
                                                    title="Create new project"
                                                    useIcon={{
                                                        direction: 'left',
                                                        icon: <MdOutlineWorkOutline />
                                                    }}
                                                />
                                                <Button 
                                                    title="Report problem" 
                                                    useIcon={{
                                                        direction: 'left',
                                                        icon: <MdOutlineBugReport />
                                                    }}
                                                />
                                            </ButtonGroup>

                                        export default ButtonGroupAppearanceExample;
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
