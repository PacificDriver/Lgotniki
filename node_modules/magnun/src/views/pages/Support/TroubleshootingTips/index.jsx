import React from 'react'
import {
  Accordion,
  AccordionItem,
} from '../../../../components/BaseUI/Accordion'

export default function TroubleshootingTips() {
  const items = [
    { title: 'Error during dependency installation' },
    { title: 'Blank page after starting the server' },
    { title: "Components' styles are not being applied" },
    { title: 'API calls are not working' },
    { title: 'Components are not rendering correctly' },
  ]

  return (
    <section>
      <h2>Troubleshooting Tips</h2>

      <Accordion items={items} gap={12}>
        <AccordionItem>
          <p>
            Ensure you are using the correct version of Node.js and npm. Use{' '}
            <code>nvm</code> to manage multiple Node.js versions if needed.
          </p>
        </AccordionItem>

        <AccordionItem>
          <p>
            Check the browser console for error messages. Ensure all
            dependencies are properly installed and the development server is
            running without errors.
          </p>
        </AccordionItem>

        <AccordionItem>
          <p>
            Check if the <code>.scss</code> files are correctly imported in the
            components. Ensure Webpack (or another build tool) is configured to
            process SCSS files.
          </p>
        </AccordionItem>

        <AccordionItem>
          <p>
            Check CORS settings on the backend. Ensure API URLs are correct and
            the backend server is running. Use tools like Postman to test APIs
            directly.
          </p>
        </AccordionItem>

        <AccordionItem>
          <p>
            Check for errors in the browser console. Ensure all dependencies and
            imports are correct. Use React DevTools to inspect the component
            tree, state, and props.
          </p>
        </AccordionItem>
      </Accordion>
    </section>
  )
}
