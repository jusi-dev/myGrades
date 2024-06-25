import { connectMongoDB } from "@/lib/mongodb"
import User from "@/models/user";
import { NextResponse } from "next/server"
import bcrypt from 'bcryptjs';

export async function POST(req: any) {
    try {
        const { email, password, name } = await req.json()
        if (!email || !password) {
            return NextResponse.json({ message: "An error occured"}, {status: 500})
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await connectMongoDB();
        await User.create({ name, email, password: hashedPassword })

        return NextResponse.json({ message: "User registered"}, {status: 201})
    } catch (error) {
        return NextResponse.json({ message: "An error occured"}, {status: 500})
    }
}