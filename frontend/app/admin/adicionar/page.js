'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import authFetch from '@/lib/authFetch'; // ✅ USA O NOVO ASSISTENTE

export default function AdicionarImovelPage() {
  const [formData, setFormData] = useState({
    titulo: '', descricao: '', preco: '', quartos: '', banheiros: '',
    area_total: '', cidade: '', bairro: '', status: 'Venda'
  });
  const [imagemFile, setImagemFile] = useState(null);
  const [status, setStatus] = useState({ loading: false, error: null, success: false });
  const router = useRouter();

  const handleChange = (e) => setFormData(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
  const handleFileChange = (e) => setImagemFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imagemFile) {
      setStatus({ ...status, error: 'Por favor, selecione uma imagem principal.' });
      return;
    }
    setStatus({ loading: true, error: null, success: false });

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('imagens', imagemFile);
      
      // ✅ USA O authFetch (muito mais limpo)
      const uploadResponse = await authFetch('/api/imoveis/upload', { 
        method: 'POST', 
        body: uploadFormData 
      });
      
      if (!uploadResponse.ok) throw new Error('Falha no upload da imagem.');
      
      const uploadResult = await uploadResponse.json();
      const finalFormData = { ...formData, imagem_principal: uploadResult.url };
      
      // ✅ USA O authFetch AQUI TAMBÉM
      const createResponse = await authFetch('/api/imoveis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalFormData),
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        throw new Error(errorData.message || 'Erro ao cadastrar imóvel.');
      }

      alert('Imóvel cadastrado com sucesso!');
      router.push('/admin');

    } catch (error) {
      setStatus({ loading: false, error: error.message, success: false });
    }
  };

  return (
    <div className="container mx-auto p-8">
      <Link href="/admin" className="text-blue-600 hover:underline mb-6 inline-block">&larr; Voltar para o Dashboard</Link>
      <h1 className="text-3xl font-bold mb-6">Adicionar Novo Imóvel</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <input name="titulo" type="text" placeholder="Título do Imóvel" onChange={handleChange} required className="w-full p-2 border rounded" />
        <textarea name="descricao" placeholder="Descrição" onChange={handleChange} className="w-full p-2 border rounded" rows="4"></textarea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="preco" type="number" step="0.01" placeholder="Preço" onChange={handleChange} required className="w-full p-2 border rounded" />
            <input name="quartos" type="number" placeholder="Quartos" onChange={handleChange} required className="w-full p-2 border rounded" />
            <input name="banheiros" type="number" placeholder="Banheiros" onChange={handleChange} required className="w-full p-2 border rounded" />
            <input name="area_total" type="number" placeholder="Área Total (m²)" onChange={handleChange} required className="w-full p-2 border rounded" />
            <input name="cidade" type="text" placeholder="Cidade" onChange={handleChange} required className="w-full p-2 border rounded" />
            <input name="bairro" type="text" placeholder="Bairro" onChange={handleChange} required className="w-full p-2 border rounded" />
        </div>
        <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded bg-white">
            <option value="Venda">Venda</option>
            <option value="Aluguel">Aluguel</option>
        </select>
        <input type="file" onChange={handleFileChange} required className="w-full p-2 border rounded" />
        {status.error && <p className="text-red-500 text-sm">{status.error}</p>}
        <button type="submit" disabled={status.loading} className="bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-700 disabled:bg-blue-300">
          {status.loading ? 'Salvando...' : 'Salvar Imóvel'}
        </button>
      </form>
    </div>
  );
}