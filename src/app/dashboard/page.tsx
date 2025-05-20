"use client";

import { Header } from "../_components/header";
import { AddSession } from "./add-session";
import TableSession from "./table-session";

export default function Dashboard() {
  return (
    <div>
      <Header />

      <div className="px-4 py-6 md:w-5xl md:m-auto">
        <div className="flex flex-col w-full items-center justify-between md:flex-row">
          <div className="flex flex-col items-start space-y-1 md:my-4  w-full">
            <h2 className="font-semibold text-2xl text-slate-700">
              Gerenciar sessões
            </h2>
            <p className="text-base text-slate-400 ">
              Acompanhe todas as suas sessões
            </p>
          </div>

          <div className="w-full my-2  md:w-auto">
            <AddSession />
          </div>
        </div>
        <div>
          <TableSession />
        </div>
      </div>
    </div>
  );
}
