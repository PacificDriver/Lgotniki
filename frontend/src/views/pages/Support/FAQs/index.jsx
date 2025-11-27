import React from 'react'
import {
  Accordion,
  AccordionItem,
} from '../../../../components/BaseUI/Accordion'

export default function FAQs() {
  const items = [
    { title: 'How can I add a new UI component?' },
    { title: 'Can I use this project with another backend?' },
    { title: "How can I modify a component's style?" },
    { title: 'How to manage user authentication?' },
    { title: 'How can I implement automated tests?' },
  ]

  return (
    <section>
      <h2>FAQs</h2>

      <Accordion items={items} gap={12}>
        <AccordionItem>
          <p>
            To add a new UI component, create a new directory for the component
            under <code>src/components/BaseUI/</code>. Add the necessary{' '}
            <code>.jsx</code> and <code>.scss</code> files and import the
            component in the main components file.
          </p>
        </AccordionItem>

        <AccordionItem>
          <p>
            Yes, the frontend is independent of the backend. You can create an{' '}
            <code>api.js</code> file and configure API calls to communicate with
            any backend.
          </p>
        </AccordionItem>

        <AccordionItem>
          <p>
            Component styles are defined in <code>.scss</code> files located in
            the same folder as the components. Edit these files to customize
            styles.
          </p>
        </AccordionItem>

        <AccordionItem>
          <p>
            User authentication can be managed using libraries like{' '}
            <code>jsonwebtoken</code> for token-based authentication. Integrate
            authentication on the frontend through secure API calls to the
            backend that verifies tokens.
          </p>
        </AccordionItem>

        <AccordionItem>
          <p>
            Use libraries like <code>Jest</code> and{' '}
            <code>React Testing Library</code> to create unit and integration
            tests for your components and pages. Configure test scripts in{' '}
            <code>package.json</code> to facilitate test execution.
          </p>
        </AccordionItem>
      </Accordion>
    </section>
  )
}
