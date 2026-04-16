import CreatePaymentModal from "./modals/create-payment-modal";

export default function SubHeader() {
  return (
    <div className="flex items-center gap-4">
      <p className="py-2 text-base font-bold">Payments</p>

      <CreatePaymentModal />
    </div>
  );
}
