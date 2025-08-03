import Link from 'next/link';
import DeleteImovelButton from './components/DeleteImovelButton';
import LogoutButton from './components/LogoutButton';
import apiUrl from '@/lib/api'; // ✅ IMPORTADO

// Busca os dados no servidor, de forma mais eficiente
async function getTodosImoveis() {
  try {
    // ✅ CORRIGIDO para usar a URL de produção ou local
    const res = await fetch(`${apiUrl}/api/imoveis?limit=999`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.imoveis || [];
  } catch (error) {
    console.error("Admin Dashboard: Erro ao buscar imóveis.", error);
    return [];
  }
}

export default async function AdminDashboardPage() {
  const imoveis = await getTodosImoveis();

  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Gerencie os imóveis cadastrados no site.</p>
        </div>
        <LogoutButton />
      </div>
      <div className="mb-6">
        <Link href="/admin/adicionar" className="inline-block bg-blue-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-700">
          + Adicionar Novo Imóvel
        </Link>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 border-b pb-3">Lista de Imóveis ({imoveis.length})</h2>
        {imoveis.length > 0 ? (
          <ul className="space-y-4">
            {imoveis.map((imovel) => (
              <li key={imovel.id} className="flex flex-wrap justify-between items-center p-3 rounded-md hover:bg-gray-50">
                <div className="flex items-center mb-2 sm:mb-0">
                  <img src={imovel.imagem_principal} alt={imovel.titulo} className="w-16 h-12 object-cover rounded-md mr-4"/>
                  <div>
                    <span className="font-semibold text-gray-800">{imovel.titulo}</span>
                    <p className="text-sm text-gray-500">{imovel.bairro} - R$ {imovel.preco.toLocaleString('pt-BR')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Link href={`/admin/editar/${imovel.id}`} className="bg-green-500 text-white px-3 py-1 text-sm rounded-md hover:bg-green-600">
                    Editar
                  </Link>
                  <DeleteImovelButton imovelId={imovel.id} />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 py-8">Nenhum imóvel cadastrado.</p>
        )}
      </div>
    </div>
  );
}