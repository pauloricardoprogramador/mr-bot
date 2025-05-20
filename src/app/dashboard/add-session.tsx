"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { Spinner } from "../_components/spinner";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { QrCodeProps } from "./type-qrcode";
import axios from "axios";

export function AddSession() {
  const [isLoading, setIsLoading] = useState(false);
  const [valueInput, setValueInput] = useState("");
  const [openSuccessSession, setOpenSuccessSession] = useState(false);
  const [isCloseModal, setIsCloseModal] = useState(false);
  const [qrCode, setQrCode] = useState<QrCodeProps | null>(null);
  const qrCodeRef = useRef<HTMLInputElement>(null);
  const [copyButtonText, setCopyButtonText] = useState("Copiar");

  async function handleSession() {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("Token não encontrado no localStorage.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `https://api.rankme.live/api/session/${valueInput}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setQrCode(response.data);
      setOpenSuccessSession(true);
      setIsCloseModal(false);
      setValueInput("");
      console.log(response.data);
    } catch (error) {
      console.error("Erro ao cadastrar sessão", error);
    } finally {
      setIsLoading(false);
    }
  }

  function copyQrCode() {
    if (qrCodeRef.current) {
      navigator.clipboard
        .writeText(qrCodeRef.current.value)
        .then(() => {
          setCopyButtonText("Copiado!");
          setTimeout(() => {
            setCopyButtonText("Copiar");
          }, 10000);
        })
        .catch((err) => {
          console.error("Erro ao copiar QR code: ", err);
        });
    }
  }

  return (
    <div>
      <div>
        <Dialog open={isCloseModal} onOpenChange={setIsCloseModal}>
          <DialogTrigger className="md:w-auto w-full" asChild>
            <Button
              variant="destructive"
              className="w-full h-12 cursor-pointer"
            >
              Nova Sessão
            </Button>
          </DialogTrigger>
          <DialogContent className="gap-0">
            <DialogHeader>
              <DialogTitle>Criar Nova Sessão</DialogTitle>
              <DialogDescription>
                Insira o número ou nome da sessão que deseja criar.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col items-start space-y-4 border-t border-slate-200 pt-4 mt-4">
              <Label>Nome da sessão</Label>
              <Input
                placeholder="Escolha um numero para sua sessão"
                className="h-12 w-full"
                type="number"
                value={valueInput}
                onChange={(e) => setValueInput(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 items-center justify-center gap-2 mt-3">
              <DialogClose asChild>
                <Button variant="outline" className="w-full h-12" type="button">
                  Cancelar
                </Button>
              </DialogClose>

              <Button
                className="w-full h-12 hover:bg-red-700 transition-all duration-500"
                type="submit"
                onClick={handleSession}
                disabled={valueInput.trim().length === 0 || isLoading}
              >
                {isLoading ? <Spinner /> : "Cadastrar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={openSuccessSession} onOpenChange={setOpenSuccessSession}>
        <DialogContent className="gap-0">
          <DialogHeader className="border-b border-slate-200 pb-4">
            <DialogTitle>Qr Code da Sessão</DialogTitle>
            <DialogDescription>
              Escaneie o QR Code abaixo para conectar sua sessão.
            </DialogDescription>
          </DialogHeader>

          {qrCode?.qr_code_url ? (
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
                    qrCode?.qr_code_url
                      ? qrCode.qr_code_url.replace("data:image/png;base64,", "")
                      : ""
                  }
                  className="w-full h-12 flex-1"
                  type="text"
                />

                <Button variant="outline" className="h-12" onClick={copyQrCode}>
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
    </div>
  );
}
