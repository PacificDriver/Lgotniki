import React, { useState } from 'react'

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
import Checkbox from '../../../components/BaseUI/Checkbox'

export default function Checkboxes() {
  const [valid, setValid] = useState(false)

  return (
    <AppPage title="Checkbox">
      <Tabs>
        <TabList>
          <Tab>Examples</Tab>
        </TabList>

        <TabPanel>
          <Panel>
            <div className="mt-3">
              <ComponentInfo title="Default">
                <Description>
                  <p>This is the default checkbox.</p>
                </Description>

                <Preview>
                  <Checkbox label="Default checkbox" value="subscribe" />
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import Checkbox from "../../../components/BaseUI/Checkbox";

                                        const CheckboxDefaultExample = () => {
                                            return <Checkbox 
                                                label='My checkbox'
                                                value='subscribe'
                                            />
                                        };

                                        export default CheckboxDefaultExample;
                                    `}
                </Snippet>
              </ComponentInfo>
            </div>

            <div className="mt-3">
              <ComponentInfo title="Is checked">
                <Description>
                  <p>Initializes the checkbox as checked if true.</p>
                </Description>

                <Preview>
                  <Checkbox
                    label="Is checked checkbox"
                    value="subscribe"
                    isChecked={true}
                  />
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import Checkbox from "../../../components/BaseUI/Checkbox";

                                        const CheckboxIsCheckedExample = () => {
                                            return <Checkbox 
                                                label='My checkbox'
                                                value='subscribe'
                                                isChecked={true}
                                            />
                                        };

                                        export default CheckboxIsCheckedExample;
                                    `}
                </Snippet>
              </ComponentInfo>
            </div>

            <div className="mt-3">
              <ComponentInfo title="Disabled">
                <Description>
                  <p>Disables the checkbox if true.</p>
                </Description>

                <Preview>
                  <Checkbox
                    label="Disabled checkbox"
                    value="subscribe"
                    disabled={true}
                  />
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import Checkbox from "../../../components/BaseUI/Checkbox";

                                        const CheckboxDisabledExample = () => {
                                            return <Checkbox 
                                                label='My checkbox'
                                                value='subscribe'
                                                disabled={true}
                                            />
                                        };

                                        export default CheckboxDisabledExample;
                                    `}
                </Snippet>
              </ComponentInfo>
            </div>

            <div className="mt-3">
              <ComponentInfo title="Indeterminate">
                <Description>
                  <p>
                    The indeterminate state is a special condition signaling
                    that the checkbox is in an intermediate state, neither fully
                    checked nor fully unchecked.
                  </p>
                </Description>

                <Preview>
                  <Checkbox
                    label="Indeterminate checkbox"
                    value="subscribe"
                    isIndeterminate={true}
                  />
                </Preview>

                <Snippet>
                  {`
                                        import React from 'react';

                                        import Checkbox from "../../../components/BaseUI/Checkbox";

                                        const CheckboxIndeterminateExample = () => {
                                            return <Checkbox 
                                                label='Indeterminate checkbox'
                                                value='subscribe'
                                                isIndeterminate={true}
                                            />
                                        };

                                        export default CheckboxIndeterminateExample;
                                    `}
                </Snippet>
              </ComponentInfo>
            </div>

            <div className="mt-3">
              <ComponentInfo title="Invalid">
                <Description>
                  <p>
                    Displays an indication that the element has not been
                    selected.
                  </p>
                </Description>

                <Preview>
                  <Checkbox
                    label="Invalid checkbox"
                    value="subscribe"
                    onChange={({ checked }) => setValid(checked)}
                    inValid={!valid}
                    message="This field is required"
                  />
                </Preview>

                <Snippet>
                  {`
                                        import React, { useState } from 'react';

                                        import Checkbox from "../../../components/BaseUI/Checkbox";

                                        const CheckboxInvalidExample = () => {
                                            const [valid, setValid] = useState(false)

                                            return  <Checkbox 
                                                label='Invalid checkbox'
                                                value='subscribe'
                                                onChange={({ checked }) => setValid(checked)}
                                                inValid={!valid}
                                                message='This field is required'
                                            />
                                        };

                                        export default CheckboxInvalidExample;
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
