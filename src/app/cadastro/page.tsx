"use client";

import Image from "next/image";
import { Cabecalho } from "../_components/cabecalho";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Spinner } from "../_components/spinner";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "O nome precisa ter no mínimo 2 caracteres",
  }),
  email: z.string().email("Informe um e-mail válido."),
  password: z.string().min(6, {
    message: "A senha precisa ter no mínimo 6 caracteres",
  }),
});

export default function Cadastro() {
  const navigate = useRouter();
  const [planId, setPlanId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setPlanId(params.get("planId"));
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const dataToSend = {
        ...data,
        plan_id: planId ? Number(planId) : null,
      };

      const response = await axios.post(
        "https://api.rankme.live/api/users/register",
        dataToSend
      );
      console.log(response.data);
      navigate.push("/dashboard");
    } catch (error) {
      console.error("Erro ao fazer login", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col justify-center px-4 py-8 md:min-h-screen md:w-md md:m-auto">
      <div className="flex items-center justify-center mb-3">
        <Image alt="Logo Mr Bot" src="/logo.svg" width={85} height={25} />
      </div>

      <div className="border border-slate-200 p-4 rounded-md mt-3">
        <Cabecalho
          title="Login"
          description="Preencha os dados e faça login na plataforma."
        />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite o seu nome"
                      {...field}
                      type="text"
                      className="h-12"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite o seu email"
                      {...field}
                      type="email"
                      className="h-12"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite a sua senha"
                      {...field}
                      type="password"
                      className="h-12"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-12 text-base rounded-lg cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? <Spinner /> : "Entrar"}
            </Button>
          </form>
        </Form>

        <div className="flex justify-center mt-4 mb-2 ">
          <span className="text-base text-slate-700">
            Já tem uma conta?
            <Link
              href="/login"
              className="text-red-600 font-medium hover:text-red-500 ml-1"
            >
              Faça Login
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
