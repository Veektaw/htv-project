import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const invoiceId = searchParams.get("invoice_id");
    const reconciliationId = searchParams.get("reconciliation_id");

    if (!invoiceId && !reconciliationId) {
      return Response.json(
        { message: "Invoice ID or reconciliation ID is required" },
        { status: 400 },
      );
    }

    // In a real application, you would fetch comments from a database
    // with pagination support. For now, we return mock data.
    const mockComments = [
      {
        id: "1",
        author: "Dr. Johnson",
        message: "Please review the payment details for this invoice.",
        created_at: "2025-08-01T14:00:00Z",
      },
      {
        id: "2",
        author: "Dr. Smith",
        message: "Invoice has been processed successfully.",
        created_at: "2025-08-02T10:30:00Z",
      },
    ];

    return Response.json(
      {
        comments: mockComments,
        page: parseInt(page),
        limit: parseInt(limit),
        total: mockComments.length,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching comments:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, invoice_id, reconciliation_id } = body;

    if (
      !message ||
      typeof message !== "string" ||
      message.trim().length === 0
    ) {
      return Response.json(
        { message: "Message is required and cannot be empty" },
        { status: 400 },
      );
    }

    if (!invoice_id && !reconciliation_id) {
      return Response.json(
        { message: "Invoice ID or reconciliation ID is required" },
        { status: 400 },
      );
    }

    // In a real application, save the comment to the database.
    console.log(
      "Adding doctor comment:",
      message,
      invoice_id ? { invoice_id } : { reconciliation_id },
    );

    return Response.json(
      { message: "Comment added successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating comment:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
