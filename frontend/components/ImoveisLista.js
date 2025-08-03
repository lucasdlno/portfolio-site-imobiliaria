// frontend/components/ImoveisLista.js
import Link from 'next/link';

export default function ImoveisLista({ imoveis }) {
  if (!imoveis || imoveis.length === 0) {
    return <p className="text-center text-gray-600 col-span-full">Nenhum imóvel encontrado.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {imoveis.map((imovel) => (
        <Link key={imovel.id} href={`/imovel/${imovel.id}`} className="block group">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full flex flex-col">
            <div className="relative">
              <img src={imovel.imagem_principal} alt={imovel.titulo} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"/>
              <div className="absolute top-3 left-3 bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
                {imovel.status || 'Venda'}
              </div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-bold text-gray-800 truncate">{imovel.titulo}</h3>
              <p className="text-gray-600 mt-1">{imovel.bairro}, {imovel.cidade}</p>
              <p className="text-2xl font-light text-blue-600 my-4 flex-grow">
                R$ {imovel.preco.toLocaleString('pt-BR')}
              </p>
              <div className="flex justify-around text-gray-600 border-t mt-4 pt-4 text-sm">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>
                  <span>{imovel.quartos} quartos</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9zM4 21.5a3.5 3.5 0 013.5-3.5h9A3.5 3.5 0 0120 21.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M4 18a2 2 0 00-2 2v.5h20v-.5a2 2 0 00-2-2M13 11V4.5A2.5 2.5 0 0010.5 2h-1A2.5 2.5 0 007 4.5V11" /></svg>
                  <span>{imovel.banheiros} banheiros</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5" /></svg>
                  <span>{imovel.area_total} m²</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}