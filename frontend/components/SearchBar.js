// frontend/components/SearchBar.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [filtros, setFiltros] = useState({ termo: '', status: '' });
  const router = useRouter();

  const handleChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (filtros.termo) params.append('termo', filtros.termo);
    if (filtros.status) params.append('status', filtros.status);
    
    router.push(`/imoveis?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="bg-white p-4 rounded-lg shadow-lg flex flex-col sm:flex-row gap-3 items-center -mt-16 relative z-10">
      <input 
        type="text" 
        name="termo" 
        placeholder="Busque por cidade ou bairro..." 
        value={filtros.termo} 
        onChange={handleChange} 
        className="w-full sm:flex-grow p-3 border border-gray-300 rounded-md"
      />
      <select 
        name="status" 
        value={filtros.status} 
        onChange={handleChange} 
        className="w-full sm:w-auto p-3 border border-gray-300 rounded-md bg-white"
      >
        <option value="">Venda ou Aluguel?</option>
        <option value="Venda">Venda</option>
        <option value="Aluguel">Aluguel</option>
      </select>
      <button type="submit" className="w-full sm:w-auto bg-blue-600 text-white font-bold p-3 px-8 rounded-md hover:bg-blue-700 transition-colors">
        Buscar
      </button>
    </form>
  );
}