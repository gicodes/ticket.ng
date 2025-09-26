export function composeEmailTemplate({
  subject,
  bodyHtml,
}: {
  subject: string;
  bodyHtml: string;
}) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>${subject}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      :root {
        --background: #ffffff;
        --foreground: rgb(17, 16, 23);
      }
      @media (prefers-color-scheme: dark) {
        :root {
          --foreground: #ededed;
          --background: rgb(17, 16, 23);
        }
      }

      body {
        margin: 0;
        padding: 0;
        font-family: Arial, Helvetica, sans-serif;
        background-color: var(--background);
        color: var(--foreground);
      }

      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 24px;
        background: var(--background);
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      }

      .logo {
        font-weight: bold;
        font-size: 22px;
        margin-bottom: 24px;
      }

      .logo span:first-child {
        color: #000;
      }
      .logo .custom-dull {
        color: #888;
      }

      .content {
        font-size: 15px;
        line-height: 1.6;
      }

      a.button {
        display: inline-block;
        margin-top: 16px;
        padding: 12px 20px;
        background: #007bff;
        color: #fff !important;
        text-decoration: none;
        font-weight: bold;
        border-radius: 6px;
      }

      .footer {
        margin-top: 32px;
        font-size: 12px;
        color: #888;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo">
        <span>Tic</span><span class="custom-dull">Task</span>
      </div>
      <div class="content">
        ${bodyHtml}
      </div>
      <div class="footer">
        © ${new Date().getFullYear()} TicTask. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
}
