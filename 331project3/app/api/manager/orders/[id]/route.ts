import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';
import { PoolClient } from 'pg';
import nodemailer from 'nodemailer';

interface Params {
    params: Promise<{ id: string }>;
}

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', 
    port: 465,              
    secure: true,           
    auth: {
        user: process.env.EMAIL_SENDER_USER,
        pass: process.env.EMAIL_SENDER_PASS,
    },
});


//mark order as ready and send notifcation
export async function POST(request: Request, { params }: Params) {
    let client: PoolClient | undefined;
    const { id: orderId } = await params;
    let customerEmail: string = ''; 
    let notificationStatus = 'SKIPPED (No Email Address)';

    //email config check
    if (!process.env.EMAIL_SENDER_USER || !process.env.EMAIL_SENDER_PASS) {
        return NextResponse.json({ 
            message: 'Email system configuration missing. Status updated, but no notification sent.',
            error: 'Missing EMAIL_SENDER_USER/PASS env variables.'
        }, { status: 500 });
    }

    try {
        const pool = getDbPool();
        client = await pool.connect();

        //change order status to ready
        const updateQuery = `
            UPDATE orders
            SET order_status = 'READY'
            WHERE order_id = $1 AND order_status != 'READY'
            RETURNING customer_email
        `;
        const updateResult = await client.query(updateQuery, [orderId]);

        if (updateResult.rowCount === 0) {
            return NextResponse.json({ message: 'Order not found or already ready.' }, { status: 404 });
        }

        customerEmail = updateResult.rows[0].customer_email;
        
        //try and send email
        if (customerEmail && customerEmail.includes('@')) {
             try {
                await transporter.sendMail({
                    from: `"Boba POS System" <${process.env.EMAIL_SENDER_USER}>`,
                    to: customerEmail,
                    subject: `Boba Order #${orderId} is READY for Pickup!`,
                    text: `Hello! Your order #${orderId} is finished and ready to be picked up at the counter. Thank you for your patience!`,
                    html: `
                        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                            <h2 style="color: #007bff;">Your Order is Ready!</h2>
                            <p style="font-size: 16px;">
                                Order Number: <strong>#${orderId}</strong>
                            </p>
                            <p style="font-size: 18px; color: #28a745; font-weight: bold;">
                                Please head to the counter for pickup.
                            </p>
                            <p style="font-size: 14px; color: #6c757d;">
                                Thank you for your patience!
                            </p>
                        </div>
                    `,
                });
                
                console.log(`Notification email sent for Order ${orderId} to ${customerEmail}`);
                notificationStatus = 'SENT via Email';
             } catch (mailError) {
                 console.error(`EMAIL FAILURE: Failed to send notification for Order ${orderId}. Error: ${(mailError as Error).message}`);
                 notificationStatus = 'FAILED (SMTP Server Error)';
             }
        } else {
            notificationStatus = 'SKIPPED (No Email Provided)';
        }

        return NextResponse.json({ 
            message: `Order ${orderId} marked ready.`,
            notification_result: notificationStatus
        }, { status: 200 });

    } catch (error) {
        console.error('Order completion error:', error);
        return NextResponse.json({
            message: 'Failed to complete order.',
            error: (error as Error).message,
        }, { status: 500 });
    } finally {
        if (client) {
            client.release();
        }
    }
}