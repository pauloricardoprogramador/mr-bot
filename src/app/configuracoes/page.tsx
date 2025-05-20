"use client";

import { Input } from "@/components/ui/input";
import { CabecalhoConfig } from "../_components/cabecalho-config";
import { Header } from "../_components/header";
import { Button } from "@/components/ui/button";
import { EyeOff, Eye, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { SessionProps } from "../dashboard/table-session";
import { toast } from "sonner";


export default function Configuration() {
  const [session, setSession] = useState<SessionProps[]>([]);
  const [selectedSession, setSelectedSession] = useState<number | null>(null);
  const [prompt, setPrompt] = useState("");
  const [message, setMessage] = useState("");
  const [api, setApi] = useState("");
  const [showApi, setShowApi] = useState(false);
  const [ignoredNumbers, setIgnoredNumbers] = useState<string[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    async function getSession() {
      try {
        const response = await axios.get(
          `https://api.rankme.live/api/sessionuser`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSession(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados da sessão", error);
      }
    }

    getSession();
  }, []);

  const handleAddNumber = () => {
    setIgnoredNumbers([...ignoredNumbers, ""]);
  };

  const handleRemoveNumber = (index: number) => {
    const updatedNumbers = ignoredNumbers.filter((_, i) => i !== index);
    setIgnoredNumbers(updatedNumbers);
  };

  const handleChangeNumber = (value: string, index: number) => {
    const updatedNumbers = [...ignoredNumbers];
    updatedNumbers[index] = value;
    setIgnoredNumbers(updatedNumbers);
  };

  const handleSaveConfig = async () => {
    if (!selectedSession) {
      toast("Selecione uma sessão antes de salvar!");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `https://api.rankme.live/api/user-settings/${selectedSession}`,
        {
          prompt,
          delay: Number(message),
          ignoredNumbers,
          apiKey: api,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast("Suas alterações foram aplicadas com sucesso.");
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast("Ocorreu um erro ao salvar. Tente novamente.");
    }
  };

  const handleResetConfig = () => {
    setPrompt("");
    setMessage("");
    setApi("");
    setIgnoredNumbers([]);
    setShowApi(false);
    toast("Suas alterações foram aplicadas com sucesso.");
  };

  return (
    <div>
      <Header />

      <div className="flex flex-col space-y-4 p-4 md:w-5xl md:m-auto md:mt-8 md:bg-slate-100">
        <div>
          <CabecalhoConfig
            title="Selecione uma sessão"
            description="Ao escolher uma sessão, você informa para o seu agente qual persona ele deverá incorporar. "
          />
          <select
            className="w-full border border-slate-200 p-2 mt-2"
            onChange={(e) => setSelectedSession(Number(e.target.value))}
          >
            <option value="">Selecione uma sessão</option>
            {session.map((session) => (
              <option key={session.id} value={session.id}>
                {session.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <CabecalhoConfig
            title="Prompt Personalizado"
            description="Escreva um texto  descritivo de como o seu agente deverá incorporar a persona. Este prompt será usado como base para as respostas do seu bot. "
          />
          <textarea
            className="h-40 w-full border border-slate-200 p-2 resize-none mt-2"
            placeholder="Digite o seu prompt personalizado para seu bot..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          ></textarea>
        </div>

        <div>
          <CabecalhoConfig
            title="Atraso de Mensagem"
            description="Ao escolher um tempo, você informa ao seu agente  o t empo de espera entre o recebimento e o envio de mensagens."
          />
          <Input
            className="h-12 w-full"
            type="number"
            placeholder="Ex: 20 Segundos"
            value={message}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value >= 0 && value <= 30) {
                setMessage(e.target.value);
              }
            }}
          />
        </div>

        <div>
          <CabecalhoConfig
            title="Números Ignorados"
            description="Informe os números de telefone que você quer que o agente(bot) ignore."
          />
          {ignoredNumbers.map((number, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <Input
                className="h-12 flex-1"
                type="text"
                placeholder="(99) 91234-5678"
                value={number}
                onChange={(e) => handleChangeNumber(e.target.value, index)}
              />
              <Button
                variant="destructive"
                type="button"
                className="h-12 cursor-pointer"
                onClick={() => handleRemoveNumber(index)}
              >
                <Trash size={18} />
              </Button>
            </div>
          ))}
          <Button
            className="h-12 mt-2 w-full bg-green-600 hover:bg-green-700 text-slate-50 cursor-pointer"
            onClick={handleAddNumber}
            type="button"
          >
            Adicionar Número
          </Button>
        </div>

        <div>
          <CabecalhoConfig
            title="Chave de API"
            description="Adicione uma chave de API para integração com serviços externos"
          />
          <div className="flex items-center gap-2 w-full">
            <Input
              className="w-full h-12 flex-1"
              placeholder="Insira sua chave de api"
              type={showApi ? "text" : "password"}
              value={api}
              onChange={(e) => setApi(e.target.value)}
            />
            <Button
              className="h-12 cursor-pointer"
              variant="outline"
              type="button"
              onClick={() => setShowApi(!showApi)}
            >
              {showApi ? <Eye /> : <EyeOff />}
            </Button>
          </div>
        </div>

        <div>
          <CabecalhoConfig
            title="Ultima Etapa"
            description="Clique no botão de salvar configurações para salvar os dados do seu agente, ou resetar, se quiser configurar novamente"
          />
          <div className="flex flex-col items-center gap-2 w-full mt-4 md:grid md:grid-cols-2">
            <Button
              variant="outline"
              className="h-12 w-full cursor-pointer"
              onClick={handleResetConfig}
            >
              Resetar configurações
            </Button>
            <Button
              className="h-12 w-full cursor-pointer bg-green-600 hover:bg-green-700"
              onClick={handleSaveConfig}
            >
              Salvar Configurações
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
