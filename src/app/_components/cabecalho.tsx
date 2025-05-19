interface CabecalhoProps {
  title: string;
  description: string;
}

export function Cabecalho({ title, description }: CabecalhoProps) {
  return (
    <div className="flex flex-col items-start space-y-1 border-b border-slate-200 pb-6 mb-4 ">
      <h2 className="font-semibold text-2xl text-slate-700">{title}</h2>
      <p className="text-base text-slate-400 ">{description}</p>
    </div>
  );
}
