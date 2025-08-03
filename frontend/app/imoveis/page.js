'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import apiUrl from '@/lib/api'; // ✅ IMPORTADO

function Pagination({ currentPage, totalPages, searchParams }) {
  const createPageURL = (pageNumber) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `/imoveis?${params.toString()}`;
  };

  return (
    <div className="flex justify-center items-center mt-12 space-x-4">
      {currentPage > 1 && (
        <Link href={createPageURL(currentPage - 1)} className="px-4 py-2 bg-white text-gray-700 rounded-md shadow-md hover:bg-blue-500 hover:text-white transition-colors">
          Anterior
        </Link>
      )}
      <span className="text-gray-600">Página {currentPage} de {totalPages}</span>
      {currentPage < totalPages && (
        <Link href={createPageURL(currentPage + 1)} className="px-4 py-2 bg-white text-gray-700 rounded-md shadow-md hover:bg-blue-500 hover:text-white transition-colors">
          Próxima
        </Link>
      )}
    </div>
  );
}

function ImoveisPageContent() {
  const searchParams = useSearchParams();
  const [data, setData] = useState({ imoveis: [], total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  
  const currentPage = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const queryString = searchParams.toString();
      try {
        // ✅ CORRIGIDO
        const res = await fetch(`${apiUrl}/api/imoveis?${queryString}`);
        if (!res.ok) throw new Error('Falha ao buscar imóveis');
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error("Imóveis Page:", error);
        setData({ imoveis: [], total: 0, totalPages: 1 });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchParams]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Nossos Imóveis</h1>
        {!loading && (
          <p className="text-gray-600 mb-8">Encontramos {data.total} imóveis para você. Use a busca para refinar os resultados.</p>
        )}
        <SearchBar />
        {loading ? (
          <p className="text-center py-16">Carregando...</p>
        ) : data.imoveis.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {data.imoveis.map((imovel) => (
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
            {data.totalPages > 1 && <Pagination currentPage={currentPage} totalPages={data.totalPages} searchParams={searchParams} />}
          </>
        ) : (
          <div className="col-span-full text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-700">Nenhum imóvel encontrado</h2>
            <p className="text-gray-500 mt-2">Tente ajustar os filtros ou pesquisar por outro termo.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ImoveisPage() {
  return (
    <Suspense fallback={<div className="text-center p-8">Carregando página...</div>}>
      <ImoveisPageContent />
    </Suspense>
  )
}