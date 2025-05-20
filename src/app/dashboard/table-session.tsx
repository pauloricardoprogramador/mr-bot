"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CircleAlert, QrCode, Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { QrCodeProps } from "./type-qrcode";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export interface SessionProps {
  id: string;
  name: string;
  authenticated: boolean;
  qr_code_url: string;
  created_at: string;
}

export default function TableSession() {
  const [isTrueSession, setIsTrueSession] = useState<SessionProps[]>([]);
  const [qrCode, setQrCode] = useState<QrCodeProps | null>(null);
  const qrCodeRef = useRef<HTMLInputElement>(null);
  const [copyButtonText, setCopyButtonText] = useState("Copiar");
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) {
      console.warn("Token não encontrado no localStorage.");
      return;
    }

    async function getSession() {
      const response = await axios.get(
        "https://api.rankme.live/api/sessionuser",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsTrueSession(response.data);
    }

    getSession();
  }, [token]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  function copyQrCode() {
    if (qrCodeRef.current) {
      navigator.clipboard
        .writeText(qrCodeRef.current.value)
        .then(() => {
          setCopyButtonText("Copiado!");
          setTimeout(() => {
            setCopyButtonText("Copiar");
          }, 3000);
        })
        .catch((err) => {
          console.error("Erro ao copiar QR code: ", err);
        });
    }
  }

  function handleOpenQrCode(session: SessionProps) {
    setQrCode({
      id: session.id,
      name: session.name,
      qr_code_url: session.qr_code_url,
      created_at: session.created_at,
      message: "QR Code carregado com sucesso.",
      status: session.authenticated,
    });
  }

  async function handleDeleteSession(sessionId: string) {
    if (!token) return;

    try {
      await axios.delete(`https://api.rankme.live/api/session/${sessionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIsTrueSession((prev) =>
        prev.filter((session) => session.id !== sessionId)
      );
    } catch (error) {
      console.error("Erro ao excluir sessão: ", error);
    }
  }

  return (
    <div className="mt-4 shadow-2xl">
      {isTrueSession.length > 0 ? (
        <Table className="bg-white">
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isTrueSession.map((session) => (
              <TableRow key={session.id}>
                <TableCell className="text-sm text-slate-800 font-medium">
                  {session.name}
                </TableCell>

                <TableCell
                  className={
                    session.authenticated
                      ? "text-green-600 text-sm font-medium"
                      : "text-red-600 text-sm font-medium"
                  }
                >
                  {session.authenticated ? "Ativo" : "Inativo"}
                </TableCell>

                <TableCell className="text-sm text-slate-800 font-medium">
                  {formatDate(session.created_at)}
                </TableCell>

                <TableCell className="flex gap-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="bg-slate-100 hover:bg-slate-300 transition-all duration-300 border-0 text-slate-700 p-0 px-0"
                        onClick={() => handleOpenQrCode(session)}
                      >
                        <QrCode />
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="gap-0">
                      <DialogHeader className="border-b border-slate-200 pb-4">
                        <DialogTitle>Qr Code da Sessão</DialogTitle>
                        <DialogDescription>
                          Escaneie o QR Code abaixo para conectar sua sessão.
                        </DialogDescription>
                      </DialogHeader>

                      {qrCode ? (
                        <div className="flex flex-col items-center justify-center my-4 w-full">
                          <Image
                            src={qrCode.qr_code_url}
                            alt="Qr Code"
                            height={320}
                            width={320}
                            className="w-30 h-30 md:w-80 md:h-80"
                          />

                          <div className="flex items-center gap-2 mt-2 w-full">
                            <Input
                              ref={qrCodeRef}
                              readOnly
                              value={
                                qrCode.qr_code_url
                                  ? qrCode.qr_code_url.replace(
                                      "data:image/png;base64,",
                                      ""
                                    )
                                  : ""
                              }
                              className="w-full h-12 flex-1"
                              type="text"
                            />

                            <Button
                              variant="outline"
                              className="h-12"
                              onClick={copyQrCode}
                            >
                              {copyButtonText}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p>QR Code não disponível.</p>
                      )}

                      <DialogClose asChild>
                        <Button
                          variant="outline"
                          className="w-full h-12 cursor-pointer mt-3"
                          type="button"
                        >
                          Fechar
                        </Button>
                      </DialogClose>
                    </DialogContent>
                  </Dialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        className="bg-slate-100 hover:bg-slate-300 transition-all duration-300 border-0 text-slate-700 p-0 px-0"
                        onClick={() => setSessionToDelete(session.id)}
                      >
                        <Trash />
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Tem certeza disso?</AlertDialogTitle>
                        <AlertDialogDescription>
                          A exclusão da sessão é permanente e não pode ser
                          desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          className="cursor-pointer"
                          onClick={() =>
                            sessionToDelete &&
                            handleDeleteSession(sessionToDelete)
                          }
                        >
                          Apagar Sessão
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className=" flex flex-col items-center text-center justify-center gap-2 text-slate-500 py-8 bg-white rounded-md md:flex-row">
          <CircleAlert />
          Você ainda não tem sessões. Crie uma nova para começar.
        </p>
      )}
    </div>
  );
}
