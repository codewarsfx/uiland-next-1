import { NextApiRequest, NextApiResponse } from "next/types";
import { supabase } from "../../supabase";
const crypto = require('crypto');


async function handler(req, res) {
    const secret    = process.env.LEMON_SECRET;
    const hmac      = crypto.createHmac('sha256', secret);
    const digest    = Buffer.from(hmac.update(req.rawBody).digest('hex'), 'utf8');
    const signature = Buffer.from(req.get('X-Signature') || '', 'utf8');
    
    if (!crypto.timingSafeEqual(digest, signature)) {
        return res.status(403).json({
            message:"Error Invalid Credentials"
        })
    }

    if (req.body.meta["event_name"] === 'subscription.created') {
        // update the profile table when a "subscription.create" is available
        const insertToProfile = async () => {
            const { data, error } = await supabase
                .from('profile')
                .update({
                    event: 'subscription.create',
                    status: 'subscription.create',
                    amount: req.body.data.attributes.total,
                    currency: req.body.data.attributes.currency,
                    authorization_code:'',
                    next_payment_date: req.body.data.attributes.ends_at,
                    created_date_at:req.body.data.attributes.created_at,
                    exp_month: req.body.data.attributes.ends_at,
                    plan_name:req.body.data.attributes.product_name,
                    plan_interval:'',
                    signature:'',
                    bank: req.body.data.attributes.card_brand,
                    card_type:  req.body.data.attributes.card_brand,
                    brand: req.body.data.attributes.card_brand,
                    subscription_code:'',
                })
                //This is the bridge between the response from paystack and our database (the email is the same in both)
                .eq('email', req.body.data.attributes.user_email)
                .select();
            await  insertToProfile();
            return res.status(200).json({
                status: true,
                message: 'Order placed successfully!',
            });
        };

    } 
}

export default handler;
