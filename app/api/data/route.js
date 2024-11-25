import startDB from "@/lib/db";
import Quiz from "@/models/quiz";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await startDB();

    const quiz = await Quiz.findOne();

    return NextResponse.json(
      {
        success: true,
        data: quiz,
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
          "Surrogate-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.log("get quiz error", error);
    return NextResponse.json(error, {
      status: 500,
    });
  }
}

export async function POST(req) {
  const body = await req.json();
  if (
    (!body?.pass && body.pass !== process.env.NEXT_PUBLIC_PASS) ||
    !body?._id
  ) {
    return NextResponse.json(
      { success: false, error: new Error("invalid params") },
      { status: 401 }
    );
  }

  try {
    await startDB();

    const quiz = await Quiz.findOne({ _id: body._id });

    if (!quiz) {
      return NextResponse.json(
        { success: false, error: new Error("quiz not found") },
        { status: 404 }
      );
    }

    if (body.topic) quiz.topic = body.topic;
    if (body.questions) quiz.questions = body.questions;

    await quiz.save();

    return NextResponse.json(
      {
        success: true,
        data: quiz,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("get quiz error", error);
    return NextResponse.json(error, {
      status: 500,
    });
  }
}
