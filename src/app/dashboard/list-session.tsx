"use client";

import { Button } from "@/components/ui/button";
import { ChevronRight, CircleAlert } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SessionProps } from "./table-session";
import axios from "axios";

export function ListSession() {
  const [session, setSession] = useState<SessionProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const getSesseion = async () => {
      try {
        const response = await axios.get(
          "https://api.rankme.live/api/sessionuser",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSession(response.data);
      } catch (error) {
        console.error("Erro buscar dados", error);
      } finally {
        setLoading(false);
      }
    };

    getSesseion();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-gray-500">Carregando sessões...</div>
    );
  }

  return (
    <div className="flex flex-col space-y-2">
      {session.length === 0 ? (
        <div className="flex  flex-col items-center justify-center gap-2 text-red-500 p-4 font-medium md:flex-row">
          <CircleAlert />
          <span>
            Nenhum agente cadastrado! Crie uma sessão e configure seu agente.
          </span>
        </div>
      ) : (
        session.map((session) => (
          <Link
            key={session.id}
            href={`/detalhes/${session.id}`}
            className="flex items-center justify-between gap-2"
          >
            <span className="flex-1 flex items-center pl-2 bg-slate-400 h-12 rounded-md text-white">
              {session.name}
            </span>

            <Button
              size="icon"
              className="bg-slate-400 hover:bg-slate-600 text-white h-12 w-12 cursor-pointer"
            >
              <ChevronRight />
            </Button>
          </Link>
        ))
      )}
    </div>
  );
}
