interface PlanProps {
  title: string;
  description: string;
  session_plan: string;
}

export function Plan({ title, description, session_plan }: PlanProps) {
  return (
    <div>
      <span>{description}</span>
      <h3>{title}</h3>
      <p>{session_plan}</p>
    </div>
  );
}
