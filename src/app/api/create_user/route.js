import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await dbConnect();
    const { walletAddress, name, aadharNumber, phone, address } = await request.json();

    if (!walletAddress || !name || !aadharNumber || !phone || !address) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let user = await User.findOne({ walletAddress });

    if (user) {
      user.name = name;
      user.aadharNumber = aadharNumber;
      user.phone = phone;
      user.address = address;
    } else {
      user = new User({ walletAddress, name, aadharNumber, phone, address });
    }

    await user.save();
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Error updating user profile" }, { status: 500 });
  }
}
