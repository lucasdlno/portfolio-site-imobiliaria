'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import authFetch from '@/lib/authFetch';

export default function EditarImovelPage({ params }) {
  const [imovel, setImovel] = useState(null);
  const [formData, setFormData] = useState({});
  const [novasImagensFiles, setNovasImagensFiles] = useState([]);
  const [status, setStatus] = useState({ loading: true, error: null });
  const router = useRouter();
  const { id } = params;

  const fetchImovel = useCallback(async () => {
    setStatus({ loading: true, error: null });
    try {
      const res = await authFetch(`/api/imoveis/${id}`);
      if (!res.ok) throw new Error('Falha ao buscar dados do imóvel.');
      const data = await res.json();
      setImovel(data);
      setFormData(data);
    } catch (error) {
      setStatus({ loading: false, error: error.message });
    } finally {
      setStatus(prev => ({ ...prev, loading: false }));
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchImovel();
  }, [id, fetchImovel]);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleFileChange = (e) => {
    if (e.target.files) setNovasImagensFiles(Array.from(e.target.files));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setStatus(prev => ({ ...prev, loading: true }));
    try {
      const res = await authFetch(`/api/imoveis/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Falha ao salvar alterações.');
      alert('Alterações salvas com sucesso!');
      fetchImovel();
    } catch (error) {
      alert(error.message);
    } finally {
      setStatus(prev => ({ ...prev, loading: false }));
    }
  };

  const handleAddImages = async (e) => {
    e.preventDefault();
    if (novasImagensFiles.length === 0) return alert('Selecione um ou mais arquivos de imagem.');
    setStatus(prev => ({ ...prev, loading: true }));
    try {
      const uploadFormData = new FormData();
      novasImagensFiles.forEach(file => {
        uploadFormData.append('imagens', file);
      });
      
      const uploadRes = await authFetch('/api/imoveis/upload', { method: 'POST', body: uploadFormData });
      if (!uploadRes.ok) throw new Error('Falha no upload das imagens.');
      const { urls } = await uploadRes.json();

      const addImagesRes = await authFetch(`/api/imoveis/${id}/imagens`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls }),
      });
      if (!addImagesRes.ok) throw new Error('Falha ao adicionar imagens à galeria.');

      alert(`${urls.length} imagem(ns) adicionada(s) com sucesso!`);
      document.getElementById('file-input-gallery').value = "";
      setNovasImagensFiles([]);
      fetchImovel();
    } catch (error) {
      alert(error.message);
    } finally {
      setStatus(prev => ({ ...prev, loading: false }));
    }
  };

  const handleDeleteImage = async (imagemId) => {
    if (!window.confirm('Tem certeza que deseja deletar esta imagem da galeria?')) return;
    try {
      const res = await authFetch(`/api/imoveis/imagens/${imagemId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Falha ao deletar imagem.');
      alert('Imagem deletada com sucesso!');
      fetchImovel();
    } catch (error) {
      alert(error.message);
    }
  };

  if (status.loading && !imovel) return <div className="text-center p-10">Carregando...</div>;
  if (status.error) return <div className="text-center p-10 text-red-500">{status.error}</div>;
  if (!imovel) return null;

  return (
    <div className="container mx-auto p-8 bg-gray-50">
      <Link href="/admin" className="text-blue-600 hover:underline mb-6 inline-block">&larr; Voltar para o Dashboard</Link>
      <h1 className="text-3xl font-bold mb-6">Editar Imóvel: {imovel.titulo}</h1>
      
      {/* Formulário de Dados Principais */}
      <form onSubmit={handleUpdateSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4 mb-8">
        <h2 className="text-2xl font-semibold">Dados Principais</h2>
        
        <input name="titulo" type="text" placeholder="Título do Imóvel" value={formData.titulo || ''} onChange={handleChange} required className="w-full p-2 border rounded" />
        <textarea name="descricao" placeholder="Descrição" value={formData.descricao || ''} onChange={handleChange} className="w-full p-2 border rounded" rows="6"></textarea>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input name="preco" type="number" step="0.01" placeholder="Preço" value={formData.preco || ''} onChange={handleChange} required className="w-full p-2 border rounded" />
            <input name="quartos" type="number" placeholder="Quartos" value={formData.quartos || ''} onChange={handleChange} required className="w-full p-2 border rounded" />
            <input name="banheiros" type="number" placeholder="Banheiros" value={formData.banheiros || ''} onChange={handleChange} required className="w-full p-2 border rounded" />
            <input name="area_total" type="number" placeholder="Área Total (m²)" value={formData.area_total || ''} onChange={handleChange} required className="w-full p-2 border rounded" />
            <input name="cidade" type="text" placeholder="Cidade" value={formData.cidade || ''} onChange={handleChange} required className="w-full p-2 border rounded" />
            <input name="bairro" type="text" placeholder="Bairro" value={formData.bairro || ''} onChange={handleChange} required className="w-full p-2 border rounded" />
        </div>
        <select name="status" value={formData.status || 'Venda'} onChange={handleChange} className="w-full p-2 border rounded bg-white">
            <option value="Venda">Venda</option>
            <option value="Aluguel">Aluguel</option>
        </select>
        <input name="imagem_principal" type="text" placeholder="URL da Imagem Principal" value={formData.imagem_principal || ''} onChange={handleChange} required className="w-full p-2 border rounded bg-gray-100" />
        
        <button type="submit" disabled={status.loading} className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300">
          {status.loading ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>

      {/* Gerenciador da Galeria */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Galeria de Imagens</h2>
        <div className="flex flex-wrap gap-4">
          <div className="relative">
            <img src={imovel.imagem_principal} className="w-40 h-40 object-cover rounded-lg border-2 border-blue-500" alt="Imagem Principal" />
            <span className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">Principal</span>
          </div>
          {imovel.imagens && imovel.imagens.map(img => (
            <div key={img.id} className="relative group">
              <img src={img.url} className="w-40 h-40 object-cover rounded-lg" alt={`Imagem da galeria ${img.id}`} />
              <button type="button" onClick={() => handleDeleteImage(img.id)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">X</button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Formulário para Adicionar Novas Imagens */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Adicionar Nova(s) Imagem(ns)</h2>
        <form onSubmit={handleAddImages} className="flex items-center gap-4">
          <input id="file-input-gallery" type="file" onChange={handleFileChange} multiple required className="flex-grow p-2 border rounded" />
          <button type="submit" disabled={status.loading} className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 disabled:bg-green-300">
            {status.loading ? 'Enviando...' : `Adicionar ${novasImagensFiles.length > 0 ? novasImagensFiles.length : ''} Imagem(ns)`}
          </button>
        </form>
      </div>
    </div>
  );
}