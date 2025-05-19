import Image from "next/image";
import Sidebar from "./sidebar";


export function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-red-600 h-15 md:justify-around">
      <Image alt="Logo Mr Bot" src="/logo-light.svg" width={85} height={25} />
      <Sidebar/>
    </header>
  );
}
