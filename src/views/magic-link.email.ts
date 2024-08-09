import handlebars from "handlebars";

const magicLinkEmail = `
<!DOCTYPE html>
<html
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  lang="en"
>
  <head>
    <title>Magic Link Login</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!--[if mso
      ]><xml
        ><o:OfficeDocumentSettings
          ><o:PixelsPerInch>96</o:PixelsPerInch
          ><o:AllowPNG /></o:OfficeDocumentSettings></xml
    ><![endif]-->
    <!--[if !mso]><!-->
    <link
      href="https://fonts.googleapis.com/css2?family=Nunito:wght@100;200;300;400;500;600;700;800;900"
      rel="stylesheet"
      type="text/css"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@100;200;300;400;500;600;700;800;900"
      rel="stylesheet"
      type="text/css"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Cabin:wght@100;200;300;400;500;600;700;800;900"
      rel="stylesheet"
      type="text/css"
    />
    <!--<![endif]-->
    <style>
      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        padding: 0;
      }

      a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: inherit !important;
      }

      #MessageViewBody a {
        color: inherit;
        text-decoration: none;
      }

      p {
        line-height: inherit;
      }

      .desktop_hide,
      .desktop_hide table {
        mso-hide: all;
        display: none;
        max-height: 0px;
        overflow: hidden;
      }

      .image_block img + div {
        display: none;
      }

      #converted-body .list_block ul,
      #converted-body .list_block ol,
      .body [class~="x_list_block"] ul,
      .body [class~="x_list_block"] ol,
      u + .body .list_block ul,
      u + .body .list_block ol {
        padding-left: 20px;
      }

      @media (max-width: 620px) {
        .desktop_hide table.icons-inner,
        .social_block.desktop_hide .social-table {
          display: inline-block !important;
        }

        .icons-inner {
          text-align: center;
        }

        .icons-inner td {
          margin: 0 auto;
        }

        .mobile_hide {
          display: none;
        }

        .row-content {
          width: 100% !important;
        }

        .stack .column {
          width: 100%;
          display: block;
        }

        .mobile_hide {
          min-height: 0;
          max-height: 0;
          max-width: 0;
          overflow: hidden;
          font-size: 0px;
        }

        .desktop_hide,
        .desktop_hide table {
          display: table !important;
          max-height: none !important;
        }
      }
    </style>
  </head>

  <body
    class="body"
    style="
      background-color: #ffffff;
      margin: 0;
      padding: 0;
      -webkit-text-size-adjust: none;
      text-size-adjust: none;
    "
  >
    <table
      border="0"
      cellpadding="0"
      cellspacing="0"
      width="100%"
      style="background-color: #ffffff"
    >
      <tr>
        <td align="center">
          <table
            border="0"
            cellpadding="0"
            cellspacing="0"
            width="600"
            class="row-content"
            style="background-color: #f9f9f9; color: #000000"
          >
            <tr>
              <td align="center" style="padding: 20px 30px">
                <h1>Welcome, {{email}}</h1>
                <p>
                  Click the link below to log in to your account:
                </p>
                <p>
                  <a href="{{magicLinkUrl}}" target="_blank">Log in with this link</a>
                </p>
                <div style="">
                  <p> or copy this link and paste it in your browser. </p>
                  <p> {{magicLinkUrl}} </p>
                </div>
                <p>This link will expire on {{expirationTime}}.</p>
                <p>
                  If you did not request this link, you can safely ignore this
                  email.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

function generateMagicLinkEmail(
  magicLinkUrl: string,
  userEmail: string,
  expiresAt: string = new Date(
    Date.now() + 24 * 60 * 60 * 1000,
  ).toLocaleString(),
) {
  const template = handlebars.compile(magicLinkEmail);
  const htmlBody = template({
    magicLinkUrl,
    expirationTime: expiresAt,
    email: userEmail,
  });

  return htmlBody;
}

export { generateMagicLinkEmail, magicLinkEmail };
