"use client";

import { Input } from "@/components/ui/input";
import { CabecalhoConfig } from "../../_components/cabecalho-config";
import { Header } from "../../_components/header";
import { Button } from "@/components/ui/button";
import { EyeOff, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Cabecalho } from "@/app/_components/cabecalho";

interface UserSettings {
  id: number;
  user_id: number;
  custom_prompt: string;
  message_delay: number;
  ignored_numbers: string[];
  api_key: string;
  created_at: string;
  updated_at: string;
  session_id: string;
}

export default function ConfigurationDetails() {
  const { id: userIdParam } = useParams();
  const id = userIdParam ? Number(userIdParam) : undefined;

  const [config, setConfig] = useState<UserSettings | null>(null);
  const [showApi, setShowApi] = useState(false);

  useEffect(() => {
    if (!id) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Token não encontrado.");
      return;
    }

    async function fetchConfig() {
      try {
        const response = await axios.get(
          `https://api.rankme.live/api/user-settings/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setConfig(response.data);
        console.log("Configuração carregada:", response.data);
      } catch (error) {
        console.error("Erro ao buscar configurações:", error);
        toast.error("Configuração não encontrada.");
      }
    }

    fetchConfig();
  }, [id]);

  if (!config) {
    return (
      <div className="p-4 text-center text-slate-600">
        Carregando configurações...
      </div>
    );
  }

  return (
    <div>
      <Header />

      <div className="flex flex-col space-y-4 p-4 md:w-5xl md:m-auto md:mt-8 md:bg-slate-100">
        <Cabecalho
          title="Detalhes da Sessão"
          description="Veja todos os dados da sua sessão"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <strong>ID: </strong> {config.id}
          </div>
          <div>
            <strong>User ID: </strong> {config.user_id}
          </div>
          <div>
            <strong>Session ID: </strong> {config.session_id}
          </div>
          <div>
            <strong>Criado em: </strong>
            {new Date(config.created_at).toLocaleString()}
          </div>
          <div>
            <strong>Atualizado em: </strong>
            {new Date(config.updated_at).toLocaleString()}
          </div>
        </div>

        <CabecalhoConfig
          title="Prompt Personalizado"
          description="Descreva como o agente deve se comportar."
        />
        <textarea
          className="h-40 w-full border border-slate-200 p-2 resize-none mt-2"
          value={config.custom_prompt}
          readOnly
        />

        <CabecalhoConfig
          title="Atraso de Mensagem"
          description="Tempo de espera entre o recebimento e o envio."
        />
        <Input
          className="h-12 w-full"
          type="number"
          value={config.message_delay}
          readOnly
        />

        <CabecalhoConfig
          title="Números Ignorados"
          description="Números de telefone que o agente deve ignorar."
        />
        {config.ignored_numbers.length === 0 ? (
          <div className="text-slate-500">Nenhum número adicionado.</div>
        ) : (
          config.ignored_numbers.map((number: string, index: number) => (
            <Input
              key={index}
              className="h-12 mb-2"
              type="text"
              value={number}
              readOnly
            />
          ))
        )}

        <CabecalhoConfig
          title="Chave de API"
          description="Chave de API para integrações."
        />
        <div className="flex items-center gap-2 w-full">
          <Input
            className="w-full h-12 flex-1"
            type={showApi ? "text" : "password"}
            value={config.api_key}
            readOnly
          />
          <Button
            className="h-12"
            variant="outline"
            type="button"
            onClick={() => setShowApi(!showApi)}
          >
            {showApi ? <Eye /> : <EyeOff />}
          </Button>
        </div>

        <div className="flex flex-col items-center gap-2 w-full mt-1">
          <Button
            className="h-12 w-full bg-slate-200"
            variant="outline"
            asChild
          >
            <Link href="/dashboard">Voltar</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
