import "./App.css";
import logo from "./assets/logo.png";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { FaInstagram, FaYoutube, FaTwitch } from "react-icons/fa";

const itens = [
  { titulo: "Item 1", descricao: "Descrição do item 1" },
  { titulo: "Item 2", descricao: "Descrição do item 2" },
  { titulo: "Item 3", descricao: "Descrição do item 3" },
];

const historias = [
  {
    titulo: "Título da História",
    descricao:
      '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."',
    tags: [
      "universo alternativo",
      "universo alternativo",
      "universo alternativo",
    ],
  },
  {
    titulo: "Título da História",
    descricao:
      '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."',
    tags: [
      "universo alternativo",
      "universo alternativo",
      "universo alternativo",
    ],
  },
];

function App() {
  return (
    <div>
      {/* Header */}
      <header className="relative flex items-center justify-center bg-[#EEE7D5] h-[60px] px-6">
        <img src={logo} alt="logo" className="h-8" />
        <div className="absolute right-6 flex gap-4 text-sm text-gray-500">
          <span className="cursor-pointer">pt.br</span>
          <span className="cursor-pointer">eng</span>
        </div>
      </header>

      {/* Seção principal escura */}
      <section className="bg-[#0d1526] py-10">
        <div className="max-w-[880px] mx-auto">
          {/* Boas-vindas */}
          <div className="mx-4 mb-10 bg-[rgba(255,255,255,0.07)] border border-white/20 rounded-[20px] p-6">
            <h2 className="text-2xl font-bold text-[#EEE7D5] mb-3 flex items-center gap-2">
              <span>✦</span> Boas-vindas!
            </h2>
            <p className="text-[#EEE7D5]/70 text-sm max-w-xs leading-relaxed">
              Este é o portal oficial Daraverso, onde você encontra todos os
              materiais oficiais do universo de Arin Derano.
            </p>
          </div>

          {/* Carrossel */}
          <Carousel className="w-full mb-10">
            <CarouselContent>
              {itens.map((item, index) => (
                <CarouselItem key={index} className="basis-full">
                  <div className="mx-4 bg-[rgba(255,255,255,0.07)] border border-white/20 rounded-[20px] p-6 h-[200px]">
                    <h3 className="text-lg font-bold text-[#EEE7D5] mb-1">
                      {item.titulo}
                    </h3>
                    <p className="text-[#EEE7D5]/60 text-sm">
                      {item.descricao}
                    </p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 text-[#EEE7D5] border-none bg-transparent hover:bg-transparent shadow-none" />
            <CarouselNext className="right-2 text-[#EEE7D5] border-none bg-transparent hover:bg-transparent shadow-none" />
          </Carousel>

          {/* Catálogo */}
          <div className="mx-4 mb-8 bg-[rgba(255,255,255,0.07)] border border-white/20 rounded-[20px] p-6">
            <h2 className="text-center text-2xl font-bold text-[#EEE7D5] mb-6 flex items-center justify-center gap-3">
              <span>✦</span> Catálogo <span>✦</span>
            </h2>

            <div className="grid grid-cols-2 gap-6 mb-4">
              <div className="flex items-center justify-between border-b border-white pb-2 cursor-pointer">
                <span className="text-white text-sm">gênero</span>
                <ChevronDown className="text-white w-4 h-4" />
              </div>
              <div className="flex items-center justify-between border-b border-white pb-2 cursor-pointer">
                <span className="text-white text-sm">tipo</span>
                <ChevronDown className="text-white w-4 h-4" />
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-white pb-2 mb-6 cursor-pointer">
              <span className="text-white text-sm">personagens</span>
              <ChevronDown className="text-white w-4 h-4" />
            </div>

            <div className="border-t border-dashed border-[#C97C5D]/40 mb-6" />

            <div className="grid grid-cols-2 gap-6 mb-6">
              {historias.map((historia, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-[110px] h-[140px] bg-white/10 rounded-[12px] flex-shrink-0" />
                  <div className="flex flex-col gap-2">
                    <h3 className="text-white font-bold text-sm uppercase tracking-wide">
                      {historia.titulo}
                    </h3>
                    <p className="text-white text-xs leading-relaxed">
                      {historia.descricao}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {historia.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="bg-[#C97C5D]/80 text-white text-xs px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-3">
              <ChevronLeft className="text-white w-4 h-4 cursor-pointer" />
              {[1, 2, 3, 4].map((n) => (
                <span
                  key={n}
                  className="text-white text-sm cursor-pointer px-1"
                >
                  {n}
                </span>
              ))}
              <ChevronRight className="text-white w-4 h-4 cursor-pointer" />
            </div>
          </div>

          {/* Sobre o autor */}
          <div className="mx-4 mb-10 bg-[#C97C5D] border border-[#c9a96e]/30 rounded-[20px] p-6 flex gap-6 items-start">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-[#EEE7D5] mb-4 flex items-center gap-2">
                <span>✦</span> Sobre o autor
              </h2>
              <div className="flex flex-col gap-3 text-[#EEE7D5]/90 text-sm leading-relaxed">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit.
                </p>
              </div>
            </div>
            <div className="w-[140px] h-[140px] bg-white/20 rounded-full flex-shrink-0 self-center" />
          </div>

          {/* Apoio */}
          <div className="mx-4 mb-10 flex gap-8 items-start">
            {/* Logos */}
            <div className="flex flex-col gap-6 items-start min-w-[160px]">
              <span className="text-[#C97C5D] font-black text-2xl tracking-tight">
                APOIA.se
              </span>
              <span className="text-[#3b7bbf] font-black text-2xl italic tracking-tight">
                PayPal
              </span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#C97C5D] rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">V</span>
                </div>
                <span className="text-[#EEE7D5] font-bold text-lg">
                  vakinha
                </span>
              </div>
            </div>

            {/* Texto */}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-[#EEE7D5] mb-4 flex items-center gap-2">
                Gostou do Daraverso e gostaria de apoiar? <span>✦</span>
              </h2>
              <div className="flex flex-col gap-3 text-[#EEE7D5]/80 text-sm leading-relaxed">
                <p>
                  Primeiramente, agradeço imensamente a você por ter aparecido
                  por aqui! Meu universo é meu maior projeto e ver pessoas que
                  gostam e apoiam me dá mais inspiração para continuar criando
                  mais e mais.
                </p>
                <p>
                  Criei o site com o intuito de reunir tudo do meu universo em
                  um só canto da internet e com zero anúncios por praticidade e
                  estética. Ou seja, eu não recebo nada por manter o site no
                  ar... e na verdade, nem por criar nada do Daraverso. Eu crio
                  minhas histórias e mantenho o site no ar única e
                  exclusivamente por minha própria vontade.
                </p>
                <p>
                  Portanto, se você gostou do projeto e gostaria de me apoiar
                  financeiramente, eu possuo uma Vakinha para doações pontuais,
                  Paypal para sonhadores internacionais e Apoia-se para quem
                  quer apoiar de forma recorrente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#51596C] py-8">
        <div className="max-w-[880px] mx-auto flex flex-col items-center gap-4 px-4">
          <p className="text-[#EEE7D5]/80 text-sm text-center">
            Fique por dentro de todas as novidades do universo nas redes
            sociais!
          </p>
          <div className="flex gap-6 text-[#EEE7D5]/70 text-sm">
            <FaInstagram
              className="w-6 h-6 text-[#EEE7D5]/70 cursor-pointer hover:text-[#EEE7D5]"
              href=""
            ></FaInstagram>
            <FaYoutube
              className="w-6 h-6 text-[#EEE7D5]/70 cursor-pointer hover:text-[#EEE7D5]"
              href=""
            ></FaYoutube>
            <FaTwitch
              className="w-6 h-6 text-[#EEE7D5]/70 cursor-pointer hover:text-[#EEE7D5]"
              href=""
            ></FaTwitch>
          </div>
          <p className="text-[#EEE7D5]/50 text-xs">
            © Todos os direitos reservados
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
