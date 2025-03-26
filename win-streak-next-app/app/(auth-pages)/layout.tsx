export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-6 items-center px-4">
      {children}
    </div>
  );
}
