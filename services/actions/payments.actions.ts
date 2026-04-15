"use server";

import { CreatePaymentParams } from "@/types/payments";
import {
  createPaymentApi,
  deletePaymentApi,
  getAdminPaymentsApi,
  getDoctorsApi,
  getInvoicesApi,
} from "../apis/payments.api";

export const getDoctorsAction = async () => {
  const response = await getDoctorsApi({ role: "doctor" });

  if (!response.ok) {
    return {
      error: true,
      message: response.body.message,
      doctors: [],
    };
  }

  return {
    error: false,
    doctors: response.body.users,
  };
};

export const getInvoicesAction = async (doctor_id: string) => {
  const response = await getInvoicesApi({ doctor_id });

  if (!response.ok) {
    return {
      error: true,
      message: response.body.message,
      invoices: [],
    };
  }

  return {
    error: false,
    invoices: response.body.invoices,
  };
};

export const getAdminPaymentsAction = async (params: {
  page?: string;
  limit?: string;
  platform?: string;
  start_date?: string;
  end_date?: string;
}) => {
  const response = await getAdminPaymentsApi(params);

  if (!response.ok) {
    return {
      error: true,
      message: response.body.message,
    };
  }

  return {
    error: false,
    data: response.body,
  };
};

export const createPaymentAction = async (data: CreatePaymentParams) => {
  const response = await createPaymentApi(data);

  if (!response.ok) {
    return {
      error: true,
      message: response.body.message,
    };
  }

  return {
    error: false,
    message: "Payment created successfully",
    data: response.body,
  };
};

export const deletePaymentAction = async (payment_id: string) => {
  const response = await deletePaymentApi({ payment_id });

  if (!response.ok) {
    return {
      error: true,
      message: response.body.message,
    };
  }

  return {
    error: false,
    message: response.body.message || "Payment deleted successfully",
  };
};