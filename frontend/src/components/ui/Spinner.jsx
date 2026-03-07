export default function Spinner({ size = 24 }) {
  return (
    <div
      className="rounded-full border-2 border-current border-t-transparent animate-spin mh-text-accent"
      style={{ width: size, height: size }}
    />
  );
}
