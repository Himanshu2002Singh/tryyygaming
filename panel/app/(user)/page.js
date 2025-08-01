import Image from "next/image";
import Panlecreate from "./components/PanelCreateLine/Panlecreate";
import SportsBettingInterface from "./components/List/PanelList";
import { RiWhatsappFill } from "react-icons/ri";
import MobileDownloadBanner from "./components/downloadapp";
import GameGrid from "./game/gamegrid";
import MyPanleHome from "./components/PanelCreateLine/mypanelhome";
import Link from "next/link";
import { IoIosAddCircle } from "react-icons/io";
import { FaArrowRight } from "react-icons/fa";
import BannerCreate from "./components/banner/banner";
import Infocomponent from "./components/infocomponent";

export default function Home() {
  return (
    <div className="relative flex flex-col h-full">
      <MobileDownloadBanner />
      <Panlecreate />
      {/* <BannerCreate /> */}
      <div className="overflow-y-auto">
        <div className="flex-grow">
          {/* panel create  */}
          <MyPanleHome />
          {/* <BannerCreate /> */}
          <Infocomponent />
          {/* Panel Purchases Grid */}

          <SportsBettingInterface />
        </div>
        {/* <GameGrid /> */}
      </div>
    </div>
  );
}
