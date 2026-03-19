type LoaderProps = {
  text?: string;
};

export default function Loader({ text }: LoaderProps) {
  return (
    <div className="flex size-full items-center justify-center p-2">
      <div className="w-full max-w-150.25">
        <p className="text-center text-sm font-medium text-black">
          {text || "Getting data..."}
        </p>
      </div>
    </div>
  );
}
