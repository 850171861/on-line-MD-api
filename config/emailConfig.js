import nodemailer from 'nodemailer'
import qs from 'qs'
async function send(sendInfo) {
  let transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',
    port: 587,
    secure: false,// false表示其他端口
    auth: {
      user: '', // 使用者邮箱
      pass: '', // 使用者邮箱密钥
    },
  })

  const route = sendInfo.type === 'email'? 'confirm':'reset'

  // 定义的对象发送邮件内容
  let info = await transporter.sendMail({
    from: '"认证邮件" <850171861@qq.com>', // 发送者的邮箱
    to: sendInfo.email, // 接收者邮箱
    subject: sendInfo.type == 'reg'?'《on line MD》注册码' : '《on line MD》重置密码',  //邮箱主题
    html: sendInfo.type == 'reg'? `
        <div style="border: 1px solid #dcdcdc;color: #676767;width: 600px; margin: 0 auto; padding-bottom: 50px;position: relative;">
        <div style="height: 60px; background: #393d49; line-height: 60px; color: #58a36f; font-size: 18px;padding-left: 10px;">欢迎使用on line MD</div>
        <div style="padding: 25px">
          <div>您好，${sendInfo.email}用户，验证码:<span style="color:#1890ff;border-bottom: 1px solid #1890ff">${sendInfo.ver}</span>,验证码有效时间10分钟，请在${sendInfo.expire}之前使用验证码</div>
          <div style="padding: 5px; background: #f2f2f2;">如非本人操作。请忽略此邮件</div>
        </div>
        <div style="background: #fafafa; color: #b4b4b4;text-align: center; line-height: 45px; height: 45px; position: absolute; left: 0; bottom: 0;width: 100%;">系统邮件，请勿直接回复</div>
    </div>
    ` : ` <div style="border: 1px solid #dcdcdc;color: #676767;width: 600px; margin: 0 auto; padding-bottom: 50px;position: relative;">
        <div style="height: 60px; background: #393d49; line-height: 60px; color: #58a36f; font-size: 18px;padding-left: 10px;">on line MD重置密码</div>
        <div style="padding: 25px">
          <div>您好，${sendInfo.email}用户，验证码:<span style="color:#1890ff;border-bottom: 1px solid #1890ff">${sendInfo.ver}</span>,验证码有效时间10分钟，请在${sendInfo.expire}之前使用验证码</div>
          <div style="padding: 5px; background: #f2f2f2;">如非本人操作。请忽略此邮件</div>
        </div>
        <div style="background: #fafafa; color: #b4b4b4;text-align: center; line-height: 45px; height: 45px; position: absolute; left: 0; bottom: 0;width: 100%;">系统邮件，请勿直接回复</div>
    </div>`, 
  })

  return 'Message sent: %s', info.messageId
}

export default send
