"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composeEmailTemplate = composeEmailTemplate;
function composeEmailTemplate({ subject, title, subtitle, body1, body2, closingRemark = "Best regards,<br/>The TicTask Team" }) {
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
            }

            .header {
              background: #000;
              padding: 16px;
              height: 33px;
            }

            .title {
              margin: 10px 0;
              font-size: 24px;
              font-weight: 600;
              text-align: center;
            }

            .subtitle {
              margin: 5px 0;
              font-size: 18px;
              text-align: center;
            }

            .divider {
              margin: 20px auto;
              width: 200px;
              display: block;
              justify-content: center;
              border-top: 1px solid #000;
            }

            .logo {
              margin: 5px 0;
              font-size: 20px;
              font-weight: bold;
            }
            .logo span { 
              color: #fff; 
            }
            .logo .custom-dull { 
              color: #999; 
            }

            .main { 
              padding: 20px 10px 0; 
            }

            .content {
              font-size: 15px;
              line-height: 1.6;
            }

            a.button {
              height: auto;
              min-width: 100px;
              max-width: max-content;
              padding: 0.75rem 1.5rem;
              margin: 1rem 0;
              background: #000;
              color: #fff !important;
              font-size: 15px;
              font-weight: bold;
              text-decoration: none;
              display: flex;
              text-align: center;
              align-items: center;
              justify-content: space-around;
              cursor: pointer;
              border-radius: 9999px !important;
            }
            a.button:hover {
              background: #f0f0f0;
              color: #000 !important;
            }

            .footer {
              margin-top: 20px;
              font-size: 12px;
              color: #888;
              padding: 15px;
              text-align: center;
              background: #000;
            }
          </style>
        </head>

        <body>
          <div class="container">
            <div class="header">
              <div class="logo">
                <span>Tic</span><span class="custom-dull">Task</span>
              </div>
            </div>

            <div class="main">
              ${title ? `<h2 class="title">${title}</h2>` : ""}
              ${subtitle ? `<h4 class="subtitle">${subtitle}</h4>` : ""}
              ${subtitle || title ? `</hr class="divider">` : ""}

              <div class="content"> ${body1}</div>

              ${body2 ? `<div class="content" style="margin-top:16px;">${body2}</div>` : ""}
              ${closingRemark ? `<div class="content" style="margin-top:24px;">${closingRemark}</div>`
        : `<p>Warm regards,<br/>The TicTask Team</p>`}
            </div>
            
            <div class="footer">
              © ${new Date().getFullYear()} TicTask. All rights reserved.
            </div>
          </div>
        </body>
      </html>
  `;
}
