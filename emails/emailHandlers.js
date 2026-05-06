
import { EMAIL_FROM, EMAIL_FROM_NAME } from "../config/env.js";
import { resendClient } from "../src/lib/resend.js"
import { createWelcomeEmailTemplate } from "./emailTemplate.js"


export const sendWelcomeEmail= async (email,fullName,clientUrl)=>{


const {data,error} = await resendClient.emails.send({
    from:`${EMAIL_FROM_NAME} <${EMAIL_FROM}>`,
    to:email,
    subject: "Bienvenid@ a QuickTalk",
    html: createWelcomeEmailTemplate(fullName,clientUrl)
})

if(error){
    console.error("Error sending welcome email")
    throw new Error ("Error al enviar correo de bienvenida"+ error)
}

    console.error("Email sent")


}