'use client'; 

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SearchBar from "@/components/SearchBar";
import apiUrl from '@/lib/api'; // ✅ IMPORTADO

export default function Home() {
  const [imoveis, setImoveis] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchImoveis = async (pageNum) => {
    try {
      // ✅ CORRIGIDO
      const res = await fetch(`${apiUrl}/api/imoveis?page=${pageNum}&limit=6`);
      if (!res.ok) throw new Error('Falha ao buscar dados');
      
      const data = await res.json();
      if (data.imoveis.length === 0 || pageNum >= data.totalPages) {
        setHasMore(false);
      }
      return data.imoveis;
    } catch (error) {
      console.error("Home: Erro de conexão com o backend.", error);
      setHasMore(false);
      return [];
    }
  };

  useEffect(() => {
    fetchImoveis(1).then(initialImoveis => {
      setImoveis(initialImoveis);
      setLoading(false);
    });
  }, []);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    const nextPage = page + 1;
    const newImoveis = await fetchImoveis(nextPage);
    setImoveis(prevImoveis => [...prevImoveis, ...newImoveis]);
    setPage(nextPage);
    setLoadingMore(false);
  };

  return (
    <>
      <section className="relative bg-gray-800 text-white h-96 flex flex-col justify-center items-center">
        <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: "url('/images/banner.jpg')" }}></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-lg">Encontre o Imóvel dos Seus Sonhos</h1>
          <p className="mt-4 text-lg md:text-xl drop-shadow-lg">A melhor assessoria para comprar ou alugar na região.</p>
        </div>
      </section>
      <div className="container mx-auto px-4 -mt-8 relative z-20"><SearchBar /></div>
      <section className="bg-gray-100 pt-16 pb-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Imóveis Recentes</h2>
          {loading ? (
            <p className="text-center text-gray-600">Carregando imóveis...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {imoveis.map((imovel) => (
                <Link key={imovel.id} href={`/imovel/${imovel.id}`} className="block group">
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full flex flex-col transform hover:-translate-y-2 transition-transform duration-300">
                    <div className="relative">
                      <img src={imovel.imagem_principal} alt={imovel.titulo} className="w-full h-56 object-cover"/>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-gray-800 truncate">{imovel.titulo}</h3>
                      <p className="text-gray-600 mt-1">{imovel.bairro}, {imovel.cidade}</p>
                      <p className="text-2xl font-light text-blue-600 my-4 flex-grow">R$ {imovel.preco.toLocaleString('pt-BR')}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="text-center mt-12">
            {loadingMore ? (
              <p className="text-blue-600">Carregando...</p>
            ) : (
              hasMore && (
                <button
                  onClick={handleLoadMore}
                  className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                  disabled={loadingMore}
                >
                  Carregar Mais Imóveis
                </button>
              )
            )}
          </div>
        </div>
      </section>
    </>
  );
}