export default function AppBar({ icon: Icon, children }) {
  return (
    <>
      <div className="mb-2 p-1 flex items-center">
        <button className="px-2" title="Back">
          <Icon />
        </button>
        <h2 className="text-xl font-medium">{children}</h2>
      </div>
      <hr className="mb-3" />
    </>
  );
}
