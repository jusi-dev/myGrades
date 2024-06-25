import { connectMongoDB } from "@/lib/mongodb"
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req: any) {
    try {
        await connectMongoDB();
        const { email } = await req.json()
        const user = await User.findOne({ email }).select("_id");

        return NextResponse.json({ user })

    } catch (error) {
        return NextResponse.json({ message: "An error occured" }, { status: 500 })
    }
}