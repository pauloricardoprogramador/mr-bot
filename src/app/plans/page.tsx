"use client";

import Image from "next/image";
import { Cabecalho } from "../_components/cabecalho";
import { PlansCard } from "../_components/plans";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";

interface PlansProps {
  id: number;
  name: string;
  price: string;
}

export default function Plans() {
  const [plans, setPlans] = useState<PlansProps[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const navigate = useRouter();

  const descriptionsPlans: Record<string, string> = {
    "Plano Básico": "Até 2 sessões",
    "Plano Premium": "Até 5 sessões",
    "Plano Platinum": "Até 20 sessões",
  };

  async function getPlans() {
    try {
      const response = await axios.get("https://api.rankme.live/api/plans");
      setPlans(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Erro ao buscar dados", error);
    }
  }

  useEffect(() => {
    getPlans();
  }, []);

  function handleContinue() {
    if (selectedPlanId) {
      navigate.push(`/cadastro?planId=${selectedPlanId}`);
    }
  }

  function handleGoBack() {
    navigate.push("/login");
  }

  return (
    <div className="flex flex-col justify-center px-4 py-8 md:min-h-screen md:w-xl md:m-auto">
      <div className="flex items-center justify-center mb-3">
        <Image alt="Logo Mr Bot" src="/logo.svg" width={85} height={25} />
      </div>

      <div className="border border-slate-200 p-4 rounded-md mt-3">
        <Cabecalho
          title="Escolha um Plano"
          description="Selecione uma opção para finalizar seu cadastro."
        />

        <div className="space-y-3 mt-4">
          {plans.map((item: PlansProps) => (
            <PlansCard
              key={item.id}
              plan={item.name}
              price={`R$ ${item.price}`}
              description={
                descriptionsPlans[item.name] || "Descrição indisponível"
              }
              isSelected={selectedPlanId === item.id}
              onSelect={() => setSelectedPlanId(item.id)}
            />
          ))}
        </div>

        <div className="flex flex-col items-start gap-2">
          <Button
            variant="outline"
            className="w-full h-12 text-base rounded-lg cursor-pointer"
            onClick={handleGoBack}
          >
            Voltar
          </Button>

          <Button
            type="button"
            disabled={!selectedPlanId}
            className={`w-full h-12 text-base rounded-lg cursor-pointer`}
            onClick={handleContinue}
          >
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
}
