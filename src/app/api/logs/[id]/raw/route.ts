import { db } from "@zapcron/server/db";
import { logs } from "@zapcron/server/db/schema";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

export const GET = async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const log = await db
    .select({
      response: logs.response,
    })
    .from(logs)
    .where(eq(logs.id, parseInt((await params).id)));

  if (log.length === 0)
    return NextResponse.json(
      {
        statusCode: 404,
        status: "NOT_FOUND",
        message: "Log not found",
      },
      {
        status: 404,
      },
    );

  return NextResponse.json(log[0]?.response as JSON);
};
