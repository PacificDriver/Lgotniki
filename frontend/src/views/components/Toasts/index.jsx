import React, { useState } from 'react'

import Button from '../../../components/BaseUI/Button'
import {
  Panel,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from '../../../components/BaseUI/Tabs'
import AppPage from '../../../components/CustomUI/AppPage'
import {
  ComponentInfo,
  Description,
  Preview,
  Snippet,
} from '../../../components/CustomUI/ComponentInfo'
import { Toast, ToastContainer } from '../../../components/CustomUI/Toast'

export default function Toasts() {
  const [toasts, setToasts] = useState([])
  const [toastsAutoDismiss, setToastsAutoDismiss] = useState([])

  const getRandomDescription = () => {
    const descriptions = [
      'Possimus, deserunt sunt voluptatibus fugit aliquam enim mollitia.',
      'Deleniti nisi velit esse, consequuntur tempore amet porro optio ea sint perferendis.',
      "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.",
      'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.',
      'The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested.',
      'Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).',
    ]

    return descriptions[Math.floor(Math.random() * descriptions.length)]
  }

  const getRandomTitle = () => {
    const descriptions = [
      'There was a problem with your connection',
      'Your commit to the master branch failed',
      'We have received a vulnerability report',
      'There was a failure during processing',
      "Follow the platform's news and launches",
      'Your request was rejected',
    ]

    return descriptions[Math.floor(Math.random() * descriptions.length)]
  }

  const getRandomAppearance = () => {
    const descriptions = ['default', 'warning', 'danger', 'info', 'link']

    return descriptions[Math.floor(Math.random() * descriptions.length)]
  }

  const addToast = () => {
    setToasts([
      {
        description: getRandomDescription(),
        id: toasts?.length,
        key: toasts?.length,
        title: `#${toasts?.length + 1} New posts published`,
      },
      ...toasts,
    ])
  }

  const addToastWithAppearance = appearance => {
    setToasts([
      {
        description: getRandomDescription(),
        id: toasts?.length,
        key: toasts?.length,
        title: getRandomTitle(),
        appearance,
      },
      ...toasts,
    ])
  }

  const addToastAutoDismiss = () => {
    setToastsAutoDismiss([
      {
        description: 'We will destroy this toast after 8s',
        id: toastsAutoDismiss?.length,
        key: toastsAutoDismiss?.length,
        title: `#${toastsAutoDismiss.length + 1} ${getRandomTitle()}`,
        appearance: getRandomAppearance(),
      },
      ...toastsAutoDismiss,
    ])
  }

  const removeToast = () => {
    toasts?.shift()

    setToasts([...toasts])
  }

  const removeToastAutoDismiss = () => {
    toastsAutoDismiss?.shift()

    setToastsAutoDismiss([...toastsAutoDismiss])
  }

  return (
    <AppPage title="Toast">
      <Tabs>
        <TabList>
          <Tab>Examples</Tab>
        </TabList>

        <TabPanel>
          <Panel>
            <div className="mt-3">
              <ComponentInfo title="Default">
                <Description>
                  <p>This is the standard form of toast.</p>
                </Description>

                <Preview>
                  <Button appearance="primary" onClick={addToast}>
                    Add toast
                  </Button>
                </Preview>

                <Snippet>
                  {`
                                        import React, { useState } from 'react';

                                        import { ToastContainer, Toast } from '../../../components/CustomUI/Toast';
                                        import Button from '../../../components/BaseUI/Button';

                                        const ToastDefaultExample = () => {
                                            const [toasts, setToasts] = useState([]);

                                            const addToast = () => {
                                                setToasts([{
                                                    description: getRandomDescription(),
                                                    id: toasts?.length,
                                                    key: toasts?.length,
                                                    title: New posts published
                                                }, ...toasts])
                                            }

                                            const getRandomDescription = () => {
                                                const descriptions = [
                                                "Possimus, deserunt sunt voluptatibus fugit aliquam enim mollitia.",
                                                "Deleniti nisi velit esse, consequuntur tempore amet porro optio ea sint perferendis.",
                                                "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.",
                                                "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.",
                                                "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested.",
                                                "Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
                                                ]
                                            
                                                return descriptions[Math.floor(Math.random() * descriptions.length)]
                                            }
                                        
                                            return <div>
                                                <Button onClick={addToast}>Default</Button>

                                                <ToastContainer onDismiss={removeToast}>
                                                    {toasts?.map(toast => (
                                                        <Toast {...toast} />
                                                    ))}
                                                </ToastContainer>
                                            </div>
                                        };

                                        export default ToastDefaultExample;
                                    `}
                </Snippet>
              </ComponentInfo>
            </div>

            <div className="mt-3">
              <ComponentInfo title="Warning">
                <Preview>
                  <Button
                    appearance="primary"
                    onClick={() => addToastWithAppearance('warning')}
                  >
                    Add toast
                  </Button>
                </Preview>

                <Snippet>
                  {`
                                        import React, { useState } from 'react';

                                        import { ToastContainer, Toast } from '../../../components/CustomUI/Toast';
                                        import Button from '../../../components/BaseUI/Button';

                                        const ToastWarningExample = () => {
                                            const [toasts, setToasts] = useState([]);

                                            const getRandomDescription = () => {
                                                const descriptions = [
                                                "Possimus, deserunt sunt voluptatibus fugit aliquam enim mollitia.",
                                                "Deleniti nisi velit esse, consequuntur tempore amet porro optio ea sint perferendis.",
                                                "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.",
                                                "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.",
                                                "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested.",
                                                "Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
                                                ]
                                            
                                                return descriptions[Math.floor(Math.random() * descriptions.length)]
                                            }

                                            const getRandomTitle = () => {
                                                const descriptions = [
                                                    "There was a problem with your connection",
                                                    "Your commit to the master branch failed",
                                                    "We have received a vulnerability report",
                                                    "There was a failure during processing",
                                                    "Follow the platform's news and launches",
                                                    "Your request was rejected"
                                                ]
                                            
                                                return descriptions[Math.floor(Math.random() * descriptions.length)]
                                            }

                                            const addToastWithAppearance = appearance => {
                                                setToasts([{
                                                    description: getRandomDescription(),
                                                    id: toasts?.length,
                                                    key: toasts?.length,
                                                    title: getRandomTitle(),
                                                    appearance
                                                }, ...toasts])
                                            }
                                        
                                            return <div>
                                                <Button onClick={() => addToastWithAppearance('warning')}>Default</Button>

                                                <ToastContainer>
                                                    {toasts?.map(toast => (
                                                        <Toast 
                                                            {...toast}
                                                            actions={[
                                                                {content: 'Subscribe', onClick: removeToast},
                                                                {content: 'Dismiss', onClick: removeToast},
                                                            ]}
                                                        />
                                                    ))}
                                                </ToastContainer>
                                            </div>
                                        };

                                        export default ToastWarningExample;
                                    `}
                </Snippet>
              </ComponentInfo>
            </div>

            <div className="mt-3">
              <ComponentInfo title="Danger">
                <Preview>
                  <Button
                    appearance="primary"
                    onClick={() => addToastWithAppearance('danger')}
                  >
                    Add toast
                  </Button>
                </Preview>

                <Snippet>
                  {`
                                        import React, { useState } from 'react';

                                        import { ToastContainer, Toast } from '../../../components/CustomUI/Toast';
                                        import Button from '../../../components/BaseUI/Button';

                                        const ToastDangerExample = () => {
                                            const [toasts, setToasts] = useState([]);

                                            const getRandomDescription = () => {
                                                const descriptions = [
                                                "Possimus, deserunt sunt voluptatibus fugit aliquam enim mollitia.",
                                                "Deleniti nisi velit esse, consequuntur tempore amet porro optio ea sint perferendis.",
                                                "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.",
                                                "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.",
                                                "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested.",
                                                "Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
                                                ]
                                            
                                                return descriptions[Math.floor(Math.random() * descriptions.length)]
                                            }

                                            const getRandomTitle = () => {
                                                const descriptions = [
                                                    "There was a problem with your connection",
                                                    "Your commit to the master branch failed",
                                                    "We have received a vulnerability report",
                                                    "There was a failure during processing",
                                                    "Follow the platform's news and launches",
                                                    "Your request was rejected"
                                                ]
                                            
                                                return descriptions[Math.floor(Math.random() * descriptions.length)]
                                            }

                                            const addToastWithAppearance = appearance => {
                                                setToasts([{
                                                    description: getRandomDescription(),
                                                    id: toasts?.length,
                                                    key: toasts?.length,
                                                    title: getRandomTitle(),
                                                    appearance
                                                }, ...toasts])
                                            }
                                        
                                            return <div>
                                                <Button onClick={() => addToastWithAppearance('danger')}>Default</Button>

                                                <ToastContainer>
                                                    {toasts?.map(toast => (
                                                        <Toast 
                                                            {...toast}
                                                            actions={[
                                                                {content: 'Try again', onClick: removeToast},
                                                            ]}
                                                        />
                                                    ))}
                                                </ToastContainer>
                                            </div>
                                        };

                                        export default ToastDangerExample;
                                    `}
                </Snippet>
              </ComponentInfo>
            </div>

            <div className="mt-3">
              <ComponentInfo title="Information">
                <Preview>
                  <Button
                    appearance="primary"
                    onClick={() => addToastWithAppearance('info')}
                  >
                    Add toast
                  </Button>
                </Preview>

                <Snippet>
                  {`
                                        import React, { useState } from 'react';

                                        import { ToastContainer, Toast } from '../../../components/CustomUI/Toast';
                                        import Button from '../../../components/BaseUI/Button';

                                        const ToastInformationExample = () => {
                                            const [toasts, setToasts] = useState([]);

                                            const getRandomDescription = () => {
                                                const descriptions = [
                                                "Possimus, deserunt sunt voluptatibus fugit aliquam enim mollitia.",
                                                "Deleniti nisi velit esse, consequuntur tempore amet porro optio ea sint perferendis.",
                                                "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.",
                                                "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.",
                                                "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested.",
                                                "Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
                                                ]
                                            
                                                return descriptions[Math.floor(Math.random() * descriptions.length)]
                                            }

                                            const getRandomTitle = () => {
                                                const descriptions = [
                                                    "There was a problem with your connection",
                                                    "Your commit to the master branch failed",
                                                    "We have received a vulnerability report",
                                                    "There was a failure during processing",
                                                    "Follow the platform's news and launches",
                                                    "Your request was rejected"
                                                ]
                                            
                                                return descriptions[Math.floor(Math.random() * descriptions.length)]
                                            }

                                            const addToastWithAppearance = appearance => {
                                                setToasts([{
                                                    description: getRandomDescription(),
                                                    id: toasts?.length,
                                                    key: toasts?.length,
                                                    title: getRandomTitle(),
                                                    appearance
                                                }, ...toasts])
                                            }
                                        
                                            return <div>
                                                <Button onClick={() => addToastWithAppearance('info')}>Default</Button>

                                                <ToastContainer>
                                                    {toasts?.map(toast => (
                                                        <Toast 
                                                            {...toast}
                                                            actions={[
                                                                {content: 'Subscribe', onClick: removeToast},
                                                                {content: 'Dismiss', onClick: removeToast},
                                                            ]}
                                                        />
                                                    ))}
                                                </ToastContainer>
                                            </div>
                                        };

                                        export default ToastInformationExample;
                                    `}
                </Snippet>
              </ComponentInfo>
            </div>

            <div className="mt-3">
              <ComponentInfo title="Success">
                <Preview>
                  <Button
                    appearance="primary"
                    onClick={() => addToastWithAppearance('success')}
                  >
                    Add toast
                  </Button>
                </Preview>

                <Snippet>
                  {`
                                        import React, { useState } from 'react';

                                        import { ToastContainer, Toast } from '../../../components/CustomUI/Toast';
                                        import Button from '../../../components/BaseUI/Button';

                                        const ToastSuccessExample = () => {
                                            const [toasts, setToasts] = useState([]);

                                            const getRandomDescription = () => {
                                                const descriptions = [
                                                "Possimus, deserunt sunt voluptatibus fugit aliquam enim mollitia.",
                                                "Deleniti nisi velit esse, consequuntur tempore amet porro optio ea sint perferendis.",
                                                "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.",
                                                "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.",
                                                "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested.",
                                                "Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
                                                ]
                                            
                                                return descriptions[Math.floor(Math.random() * descriptions.length)]
                                            }

                                            const getRandomTitle = () => {
                                                const descriptions = [
                                                    "There was a problem with your connection",
                                                    "Your commit to the master branch failed",
                                                    "We have received a vulnerability report",
                                                    "There was a failure during processing",
                                                    "Follow the platform's news and launches",
                                                    "Your request was rejected"
                                                ]
                                            
                                                return descriptions[Math.floor(Math.random() * descriptions.length)]
                                            }

                                            const addToastWithAppearance = appearance => {
                                                setToasts([{
                                                    description: getRandomDescription(),
                                                    id: toasts?.length,
                                                    key: toasts?.length,
                                                    title: getRandomTitle(),
                                                    appearance
                                                }, ...toasts])
                                            }
                                        
                                            return <div>
                                                <Button onClick={() => addToastWithAppearance('info')}>Default</Button>

                                                <ToastContainer>
                                                    {toasts?.map(toast => (
                                                        <Toast 
                                                            {...toast}
                                                            actions={[
                                                                {content: 'Start task', onClick: removeToast},
                                                            ]}
                                                        />
                                                    ))}
                                                </ToastContainer>
                                            </div>
                                        };

                                        export default ToastSuccessExample;
                                    `}
                </Snippet>
              </ComponentInfo>
            </div>

            <div className="mt-3">
              <ComponentInfo title="Link">
                <Preview>
                  <Button
                    appearance="primary"
                    onClick={() => addToastWithAppearance('link')}
                  >
                    Add toast
                  </Button>
                </Preview>

                <Snippet>
                  {`
                                        import React, { useState } from 'react';

                                        import { ToastContainer, Toast } from '../../../components/CustomUI/Toast';
                                        import Button from '../../../components/BaseUI/Button';

                                        const ToastLinkExample = () => {
                                            const [toasts, setToasts] = useState([]);

                                            const getRandomDescription = () => {
                                                const descriptions = [
                                                "Possimus, deserunt sunt voluptatibus fugit aliquam enim mollitia.",
                                                "Deleniti nisi velit esse, consequuntur tempore amet porro optio ea sint perferendis.",
                                                "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.",
                                                "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.",
                                                "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested.",
                                                "Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
                                                ]
                                            
                                                return descriptions[Math.floor(Math.random() * descriptions.length)]
                                            }

                                            const getRandomTitle = () => {
                                                const descriptions = [
                                                    "There was a problem with your connection",
                                                    "Your commit to the master branch failed",
                                                    "We have received a vulnerability report",
                                                    "There was a failure during processing",
                                                    "Follow the platform's news and launches",
                                                    "Your request was rejected"
                                                ]
                                            
                                                return descriptions[Math.floor(Math.random() * descriptions.length)]
                                            }

                                            const addToastWithAppearance = appearance => {
                                                setToasts([{
                                                    description: getRandomDescription(),
                                                    id: toasts?.length,
                                                    key: toasts?.length,
                                                    title: getRandomTitle(),
                                                    appearance
                                                }, ...toasts])
                                            }
                                        
                                            return <div>
                                                <Button onClick={() => addToastWithAppearance('link')}>Default</Button>

                                                <ToastContainer>
                                                    {toasts?.map(toast => (
                                                        <Toast 
                                                            {...toast}
                                                            actions={[
                                                                {content: 'Subscribe', onClick: removeToast},
                                                                {content: 'Dismiss', onClick: removeToast},
                                                            ]}
                                                        />
                                                    ))}
                                                </ToastContainer>
                                            </div>
                                        };

                                        export default ToastLinkExample;
                                    `}
                </Snippet>
              </ComponentInfo>
            </div>

            <div className="mt-3">
              <ComponentInfo title="Auto dismiss">
                <Description>
                  <p>
                    Using this property allows toasts to automatically destroy
                    themselves after 8s.
                  </p>
                </Description>

                <Preview>
                  <Button appearance="primary" onClick={addToastAutoDismiss}>
                    Add toast
                  </Button>
                </Preview>

                <Snippet>
                  {`
                                        import React, { useState } from 'react';

                                        import { ToastContainer, Toast } from '../../../components/CustomUI/Toast';
                                        import Button from '../../../components/BaseUI/Button';

                                        const ToastAutoDismissExample = () => {
                                            const [toastsAutoDismiss, setToastsAutoDismiss] = useState([]);

                                            const getRandomDescription = () => {
                                                const descriptions = [
                                                "Possimus, deserunt sunt voluptatibus fugit aliquam enim mollitia.",
                                                "Deleniti nisi velit esse, consequuntur tempore amet porro optio ea sint perferendis.",
                                                "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.",
                                                "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.",
                                                "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested.",
                                                "Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
                                                ]
                                            
                                                return descriptions[Math.floor(Math.random() * descriptions.length)]
                                            }

                                            const getRandomTitle = () => {
                                                const descriptions = [
                                                    "There was a problem with your connection",
                                                    "Your commit to the master branch failed",
                                                    "We have received a vulnerability report",
                                                    "There was a failure during processing",
                                                    "Follow the platform's news and launches",
                                                    "Your request was rejected"
                                                ]
                                            
                                                return descriptions[Math.floor(Math.random() * descriptions.length)]
                                            }

                                            const getRandomAppearance = () => {
                                                const descriptions = [
                                                "default",
                                                "warning",
                                                "danger",
                                                "info",
                                                "link",
                                                ]
                                            
                                                return descriptions[Math.floor(Math.random() * descriptions.length)]
                                            }

                                            const addToastAutoDismiss = () => {
                                                setToastsAutoDismiss([{
                                                    description: 'We will destroy this toast after 8s',
                                                    id: toastsAutoDismiss?.length,
                                                    key: toastsAutoDismiss?.length,
                                                    title: getRandomTitle(),
                                                    appearance: getRandomAppearance(),
                                                }, ...toastsAutoDismiss])
                                            }
                                        
                                            return <div>
                                                <Button onClick={() => addToastWithAppearance('warning')}>Default</Button>

                                                <ToastContainer autoDismiss onDismissed={removeToastAutoDismiss}>
                                                    {toasts?.map(toast => (
                                                        <Toast 
                                                            {...toast}
                                                    ))}
                                                </ToastContainer>
                                            </div>
                                        };

                                        export default ToastAutoDismissExample;
                                    `}
                </Snippet>
              </ComponentInfo>
            </div>
          </Panel>
        </TabPanel>
      </Tabs>

      {toasts?.filter(toast => !toast.appearance)?.length > 0 && (
        <ToastContainer onDismiss={removeToast}>
          {toasts
            ?.filter(toast => !toast.appearance)
            ?.map((toast, index) => (
              <Toast {...toast} key={index} />
            ))}
        </ToastContainer>
      )}

      {toasts?.filter(toast =>
        ['warning', 'info', 'link']?.includes(toast.appearance)
      )?.length > 0 && (
        <ToastContainer>
          {toasts
            ?.filter(toast =>
              ['warning', 'info', 'link']?.includes(toast.appearance)
            )
            ?.map((toast, index) => (
              <Toast
                {...toast}
                key={index}
                actions={[
                  { content: 'Subscribe', onClick: removeToast },
                  { content: 'Dismiss', onClick: removeToast },
                ]}
              />
            ))}
        </ToastContainer>
      )}

      {toasts?.filter(toast =>
        ['danger', 'success']?.includes(toast.appearance)
      )?.length > 0 && (
        <ToastContainer>
          {toasts
            ?.filter(toast => ['danger', 'success']?.includes(toast.appearance))
            ?.map((toast, index) => (
              <Toast
                {...toast}
                key={index}
                actions={[
                  {
                    content:
                      toast.appearance === 'danger'
                        ? 'Try again'
                        : 'Start task',
                    onClick: removeToast,
                  },
                ]}
              />
            ))}
        </ToastContainer>
      )}

      {toastsAutoDismiss?.length > 0 && (
        <ToastContainer autoDismiss onDismissed={removeToastAutoDismiss}>
          {toastsAutoDismiss?.map((toast, index) => (
            <Toast {...toast} key={index} />
          ))}
        </ToastContainer>
      )}
    </AppPage>
  )
}
