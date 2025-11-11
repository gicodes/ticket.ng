import { composeEmailTemplate } from "../../lib/emailTemp";
import { sendEmail } from "../../lib/sendEmail";
import { Request, Response } from "express";

export const sendEmailAPI = async (req: Request, res: Response) => {
  try {
    const { to, subject, title, subtitle, body1, body2,  } = req.body;
    await sendEmail({
      from: `"TicTask - Naija's Number One HR App" <${process.env.MAIL_USER}>`,
       to,
        subject,
        html: composeEmailTemplate({
          subject,
          title,
          subtitle,
          body1,
          body2,
          closingRemark: `
            <p>Warm regards,<br/>The TicTask Team</p>
          `
        }),
    });   
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};