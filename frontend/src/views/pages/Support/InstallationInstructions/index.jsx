import React from 'react'

export default function InstallationInstructions() {
  return (
    <section>
      <h2>Installation and Configuration Instructions</h2>

      <h3>Installation Steps</h3>
      <ol>
        <li>Download the product and extract the files:</li>
        <li>
          Navigate to the project's root directory:
          <pre>
            <code>cd path/to/project</code>
          </pre>
        </li>
        <li>
          Install dependencies using npm or yarn:
          <pre>
            <code>npm install</code>
          </pre>
        </li>
      </ol>

      <h3>Environment Configuration</h3>
      <p>
        Create a <code>.env</code> file in the project's root and configure the
        environment variables as needed:
      </p>
      <pre>
        <code>
          REACT_APP_API_URL=https://api.example.com
          <br />
          NODE_ENV=development
        </code>
      </pre>

      <h3>Starting the Development Server</h3>
      <pre>
        <code>npm start</code>
      </pre>
      <p>
        The development server will be available at{' '}
        <code>http://localhost:3000</code>.
      </p>
    </section>
  )
}
