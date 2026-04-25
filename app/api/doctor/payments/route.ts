import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const user_id = searchParams.get("user_id");

    // In a real application, you would fetch payments from a database
    // with pagination support and filtering by user_id
    // For now, we'll return mock data
    const mockPayments = [
      {
        id: "1",
        user_id: "user_123",
        user: {
          id: "user_123",
          email: "doctor@example.com",
          first_name: "John",
          last_name: "Doe",
          company_name: "Medical Practice",
          title: "Dr.",
          phone: "+1234567890",
          address: "123 Medical St",
          role: "doctor" as const,
          status: "active" as const,
          must_change_password: false,
          language_pref: "en",
          is_deactivated: false,
          last_login: "2024-01-15T10:00:00Z",
          failed_login_attempts: 0,
          last_login_failed: null,
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2024-01-15T10:00:00Z",
          created_by: null,
          full_name: "Dr. John Doe",
          permissions: [],
          admin_profile: [],
          creator_info: {
            id: "admin_123",
            first_name: "Admin",
            last_name: "User",
          },
        },
        batch_id: "batch_001",
        platform: "Platform A",
        amount: 1500.5,
        submitted_at: "2024-01-10T14:30:00Z",
        notes: "Payment for January services",
        source: "manual",
        invoice_ref: "INV-2024-001",
        created_at: "2024-01-10T12:00:00Z",
        updated_at: "2024-01-10T12:00:00Z",
      },
      {
        id: "2",
        user_id: "user_123",
        user: {
          id: "user_123",
          email: "doctor@example.com",
          first_name: "John",
          last_name: "Doe",
          company_name: "Medical Practice",
          title: "Dr.",
          phone: "+1234567890",
          address: "123 Medical St",
          role: "doctor" as const,
          status: "active" as const,
          must_change_password: false,
          language_pref: "en",
          is_deactivated: false,
          last_login: "2024-01-15T10:00:00Z",
          failed_login_attempts: 0,
          last_login_failed: null,
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2024-01-15T10:00:00Z",
          created_by: null,
          full_name: "Dr. John Doe",
          permissions: [],
          admin_profile: [],
          creator_info: {
            id: "admin_123",
            first_name: "Admin",
            last_name: "User",
          },
        },
        batch_id: "batch_002",
        platform: "Platform B",
        amount: 2200.75,
        submitted_at: "2024-01-15T09:15:00Z",
        notes: "Payment for February services",
        source: "automatic",
        invoice_ref: "INV-2024-002",
        created_at: "2024-01-15T08:00:00Z",
        updated_at: "2024-01-15T08:00:00Z",
      },
    ];

    // Filter by user_id if provided
    const filteredPayments = user_id
      ? mockPayments.filter((payment) => payment.user_id === user_id)
      : mockPayments;

    return Response.json(
      {
        payments: filteredPayments,
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredPayments.length,
        total_page: Math.ceil(filteredPayments.length / parseInt(limit)),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching payments:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
