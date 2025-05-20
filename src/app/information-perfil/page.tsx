"use client";

import { Button } from "@/components/ui/button";
import { Cabecalho } from "../_components/cabecalho";
import { StatusPerfil } from "./status-perfil";
import { Header } from "../_components/header";
import axios from "axios";
import { useEffect, useState } from "react";
import { UserProps } from "../_components/sidebar";

export default function InformationUserPerfil() {
  const [userPerfil, setUserPerfil] = useState<UserProps | null>(null);

  const getDataUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("Token não encontrado no localStorage.");
    }

    try {
      const response = await axios.get(
        `https://api.rankme.live/api/usersPlan`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserPerfil(response.data);
      console.log(response.data);
      return;
    } catch (error) {
      console.error("Erro ao buscar informaaçõe do user", error);
    }
  };

  const getSessionStatus = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("Token não encontrado no localStorage.");
    }

    try {
      const response = await axios.get(
        `https://api.rankme.live/api/sessionuser`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      return;
    } catch (error) {
      console.error("Erro ao buscar informaaçõe do user", error);
    }
  };

  useEffect(() => {
    getDataUser();
    getSessionStatus();
  }, []);

  return (
    <div>
      <Header />
      <div className="flex flex-col gap-2 p-4 mt-4 md:w-5xl md:m-auto md:mt-8">
        <Cabecalho
          title="Informações da Conta"
          description="Acompanhe todos os seus dados pessoais."
        />

        <div className="flex flex-col gap-2 md:w-5xl md:m-auto md:grid md:grid-cols-2 md:items-start">
          <div className="border-2 border-slate-200 p-4 rounded-lg">
            <div className="flex flex-col space-y-1">
              <StatusPerfil
                title="Assinatura"
                description={
                  userPerfil?.nameplano
                    ? userPerfil.nameplano
                    : "Nenhum plano adicionado"
                }
              />
            </div>

            <div className="flex flex-col items-start space-y-2 mt-4 border-t-2 border-slate-200 pt-2">
              <Button
                className="w-full h-12 rounded-lg bg-slate-700 hover:bg-slate-800 transition-all duration-500 cursor-pointer"
                type="button"
                disabled={true}
              >
                Mudar Plano
              </Button>
              <Button
                className="w-full h-12 roudend-lg hover:bg-red-600 transition-all duration-500 cursor-pointer"
                type="button"
              >
                Cancelar Assinatura
              </Button>
            </div>
          </div>

          <div className="border-2 border-slate-200 p-4 rounded-lg ">
            <div className="flex flex-col items-start space-y-1 border-b border-slate-200 pb-4 mb-4 ">
              <h2 className="font-semibold text-base text-slate-700">Perfil</h2>
              <p className="text-base text-slate-400 ">
                Veja todos os seus dados pessoais.
              </p>
            </div>

            <div className="flex flex-col space-y-1">
              <StatusPerfil
                title="Nome"
                description={userPerfil?.name ? userPerfil.name : ""}
              />
              <StatusPerfil
                title="Email"
                description={userPerfil?.email ? userPerfil.email : ""}
              />
            </div>
            <Button
              className="w-full h-12 roudend-lg hover:bg-red-600 transition-all duration-500 cursor-pointer mt-4"
              type="button"
            >
              Excluir Conta
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
