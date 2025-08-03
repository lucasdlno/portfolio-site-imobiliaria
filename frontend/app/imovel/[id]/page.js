'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import apiUrl from '@/lib/api'; // ✅ IMPORTADO

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}

export default function ImovelPage({ params }) {
  const [imovel, setImovel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState('');

  useEffect(() => {
    const fetchImovel = async () => {
      try {
        setLoading(true);
        // ✅ CORRIGIDO
        const res = await fetch(`${apiUrl}/api/imoveis/${params.id}`);
        if (!res.ok) throw new Error('Imóvel não encontrado');
        
        const data = await res.json();
        setImovel(data);
        setMainImage(data.imagem_principal);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if(params.id) fetchImovel();
  }, [params.id]);

  if (loading) return <LoadingSpinner />;

  if (error || !imovel) {
    return (
      <div className="container mx-auto text-center py-20">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Erro!</h1>
        <p className="text-xl text-gray-700">O imóvel que você está procurando não foi encontrado.</p>
        <Link href="/imoveis" className="mt-8 inline-block bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700">
          Ver todos os imóveis
        </Link>
      </div>
    );
  }

  const todasAsImagens = [imovel.imagem_principal, ...imovel.imagens.map(img => img.url)];

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-4">
          <Link href="/imoveis" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Voltar para a lista de imóveis
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <div className="mb-3">
              <img src={mainImage} alt={`Imagem principal de ${imovel.titulo}`} className="w-full h-auto object-cover rounded-lg shadow-md max-h-[450px]" />
            </div>
            <div className="grid grid-cols-5 gap-2">
              {todasAsImagens.map((imageUrl, index) => (
                <div key={index} className="cursor-pointer" onClick={() => setMainImage(imageUrl)}>
                  <img src={imageUrl} alt={`Miniatura ${index + 1}`} className={`w-full h-20 object-cover rounded-md transition-all duration-200 ${mainImage === imageUrl ? 'border-2 border-blue-500 shadow-lg' : 'border-2 border-transparent hover:opacity-80'}`} />
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm sticky top-6">
              <h1 className="text-3xl font-bold text-gray-900">{imovel.titulo}</h1>
              <p className="text-md text-gray-600 mt-1">{imovel.bairro}, {imovel.cidade}</p>
              <hr className="my-4" />
              <p className="text-3xl font-light text-blue-700">R$ {imovel.preco.toLocaleString('pt-BR')}</p>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mt-2">{imovel.status}</span>
              <h3 className="text-xl font-semibold text-gray-800 mt-5 mb-3">Características</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex items-center justify-between"><span>Quartos:</span> <span className="font-semibold">{imovel.quartos}</span></li>
                <li className="flex items-center justify-between"><span>Banheiros:</span> <span className="font-semibold">{imovel.banheiros}</span></li>
                <li className="flex items-center justify-between"><span>Área Total:</span> <span className="font-semibold">{imovel.area_total} m²</span></li>
              </ul>
              <a href={`https://wa.me/5515996612039?text=Olá! Tenho interesse no imóvel: ${imovel.titulo}`} target="_blank" rel="noopener noreferrer" className="block text-center mt-6 w-full bg-green-500 text-white font-bold py-3 rounded-lg text-md hover:bg-green-600">
                Entrar em Contato via WhatsApp
              </a>
            </div>
          </div>
        </div>
        {imovel.descricao && (
          <div className="bg-gray-50 p-6 rounded-lg mt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Descrição do Imóvel</h3>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{imovel.descricao}</p>
          </div>
        )}
      </div>
    </div>
  );
}