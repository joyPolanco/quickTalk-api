import {Resend} from 'resend'
import { EMAIL_API_KEY, EMAIL_FROM, EMAIL_FROM_NAME } from '../../config/env.js'

export const resendClient= new Resend(EMAIL_API_KEY);

export const sender= {
    email: EMAIL_FROM,
    name: EMAIL_FROM_NAME
}