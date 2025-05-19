"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import axios from "axios";
import { Cog, LayoutDashboard, LogOut, Menu, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export interface UserProps {
  id: number;
  plan_id: number;
  name: string;
  nameplano: string;
  max_sessions: number;
  email: string;
  start_date: string;
  end_date: string;
  active: boolean;
}

export default function Sidebar() {
  const [user, setUser] = useState<UserProps | null>(null);

  useEffect(() => {
    async function getUser() {
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("Token não encontrado no localStorage.");
        return;
      }

      try {
        const response = await axios.get<UserProps>(
          "https://api.rankme.live/api/usersPlan",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Erro ao buscar usuário", error);
      }
    }

    getUser();
  }, []);
  

  return (
    <Sheet>
      <SheetTrigger>
        <Menu className="h-7 w-7 cursor-pointer text-slate-50" />
      </SheetTrigger>

      <SheetContent>
        <SheetHeader className="h-full">
          <SheetTitle>Menu</SheetTitle>

          <div className="flex items-center gap-2 mt-6">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-red-600 text-slate-50">
                {user?.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col items-start leading-5 truncate">
              <span className="text-md font-semibold text-slate-700">
                {user?.name}
              </span>
              <span className="text-sx font-normal text-slate-400 truncate">
                {user?.email}
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-between h-full border-t border-slate-200 pt-4 mt-4">
            <div className="flex flex-col gap-1">
              <SheetClose asChild>
                <Link href="/dashboard">
                  <Button
                    className="w-full flex items-center justify-start text-slate-700 cursor-pointer"
                    type="button"
                    variant="ghost"
                  >
                    <LayoutDashboard className="mr-2" />
                    Dashboard
                  </Button>
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link href="/information-perfil">
                  <Button
                    className="w-full flex items-center justify-start text-slate-700 cursor-pointer"
                    type="button"
                    variant="ghost"
                  >
                    <User className="mr-2" />
                    Perfil
                  </Button>
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link href="/configuracoes">
                  <Button
                    className="w-full flex items-center justify-start text-slate-700 cursor-pointer"
                    type="button"
                    variant="ghost"
                  >
                    <Cog className="mr-2" />
                    Configurações
                  </Button>
                </Link>
              </SheetClose>
            </div>

            <div className="border-t border-slate-200 pt-4 mt-4">
              <SheetClose asChild>
                <Link href="/">
                  <Button
                    className="w-full flex items-center justify-start text-slate-700 cursor-pointer"
                    type="button"
                    variant="ghost"
                  >
                    <LogOut className="mr-2" />
                    Sair da conta
                  </Button>
                </Link>
              </SheetClose>
            </div>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
