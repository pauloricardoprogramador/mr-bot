interface StatusPerfilProps {
  title: string;
  description: string
}

export function StatusPerfil({ title, description }: StatusPerfilProps) {
  return (
    <div className="flex items-center justify-between ">
      <span className="text-base text-slate-700 font-semibold">{title}</span>
      <span className="text-base text-slate-400 ">{description}</span>
    </div>
  );
}
