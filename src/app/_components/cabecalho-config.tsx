interface CabecalhoProps {
  title: string;
  description: string;
}

export function CabecalhoConfig({ title, description }: CabecalhoProps) {
  return (
    <div className="flex flex-col items-start space-y-1  mb-2 ">
      <h2 className="font-semibold text-lg text-slate-700">{title}</h2>
      <p className="text-base text-slate-400 ">{description}</p>
    </div>
  );
}
