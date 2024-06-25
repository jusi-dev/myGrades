import { connectMongoDB } from "@/lib/mongodb"
import { NextResponse } from "next/server"

export async function POST(req: any) {
    try {
        const { email, password } = await req.json()
        if (!email || !password) {
            return NextResponse.json({ message: "An error occured"}, {status: 500})
        }

        await connectMongoDB();

        return NextResponse.json({ message: "User registered"}, {status: 201})
    } catch (error) {
        return NextResponse.json({ message: "An error occured"}, {status: 500})
    }
}