const emailTemplate = `
<!DOCTYPE html>
<html>
<body style="margin:0; padding:0; background:#f4f6f8; font-family:Arial;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table width="600" style="background:#fff; border-radius:8px;">
          
          <tr>
            <td style="background:#0d6efd; padding:20px; text-align:center;">
              <img src="https://yourdomain.com/logo.png" width="140" />
            </td>
          </tr>

          <tr>
            <td style="padding:30px;">
              <h2>Hello Deepak</h2>
              <p>Your document has been successfully uploaded.</p>

              <a href="#" style="
                display:inline-block;
                margin-top:20px;
                padding:12px 20px;
                background:#0d6efd;
                color:#fff;
                text-decoration:none;
                border-radius:6px;">
                View Details
              </a>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;



module.exports =emailTemplate;