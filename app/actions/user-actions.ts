"use server";

import { getUserByEmail, setResetToken } from "@/lib/mongodb"
import crypto from "crypto";
import { sendEmail } from "./mail";
import User from "@/models/user";
import bcrypt from 'bcryptjs';
import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth";


export const forgotPassword = async (email: string) => {
    try {
        const user: any = await getUserByEmail(email);

        if (!user) {
            return;
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        
        await setResetToken(email, resetToken);

        const resetLink = `${process.env.BASE_URL}/reset-password/${resetToken}`;

        await sendEmail({
            to: email,
            subject: "Reset your password",
            html: `
                <h1>Reset your password</h1>
                <p>Click the link below to reset your password</p>
                <a href="${resetLink}">Reset password</a>
            `
        })

        return;
    } catch (error) {
        console.error(error);
        throw new Error("Error sending email");
    }
}

export const resetPassword = async (resetToken: string, password: string) => {
    try {
        const user = await User.findOne({
            resetToken
        });

        if (!user) {
            return false;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetToken = null;

        await user.save();
        
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export const sendMailNotification = async (name: string, grade: number, subject: string, gradeName: string) => {
    const currentSession = await getServerSession();

    const callingUser = await getUserByEmail(currentSession?.user?.email || '');

    if (!callingUser) {
        throw new Error('Kein User gefunden');
    }

    // Get all users that have callingUser.user._id in their receivesMailNotifications array
    const notificationUsers = await User.find({ receivesMailNotifications: callingUser.user._id });

    notificationUsers.forEach(async (user: any) => {
        await sendEmail({
            to: user.email,
            subject: `myGrades - ${name} hat eine neue Note hinzugefügt`,
            html: `
                <h1>Neue Note wurde hinzugefügt</h1>
                <p>${name} hat eine neue Note im Fach ${subject} hinzugefügt.</p>
                <p>Hinzugefügte Note: ${gradeName}</p>
                <p>Notenwert: ${grade}</p>
                <p>Einloggen und ansehen: <a href="https://mygrades.ch/dashboard/">myGrades</a></p>
            `
        })
    })
}