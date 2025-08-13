import { Status } from '../types/index';

export default function StatusPill({ status }: { status: Status }) {
  const cls = status === "IN RANGE" ? "ok" : "bad";
  return (
    <span className={`status-pill ${cls}`}>
      <span className="dot" />
      {status}
    </span>
  );
}