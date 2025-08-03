// frontend/app/test/page.js

async function testarConexao() {
  try {
    console.log("TESTE: Tentando buscar em http://127.0.0.1:3001/api/imoveis");
    
    const res = await fetch('http://127.0.0.1:3001/api/imoveis', {
      cache: 'no-store',
    });
    
    console.log("TESTE: Status da resposta:", res.status);

    if (!res.ok) {
      return { erro: `A API respondeu com erro. Status: ${res.status}` };
    }
    
    const data = await res.json();
    console.log("TESTE: Dados recebidos:", data);
    return { sucesso: data }; // <-- CORREÇÃO AQUI

  } catch (error) {
    console.error("TESTE: Erro de conexão:", error);
    return { erro: `Falha de conexão com o backend. Mensagem: ${error.message}` };
  }
}

export default async function TestPage() {
  const resultado = await testarConexao();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold">Página de Teste de API com Imagens</h1>
      <hr className="my-4" />
      
      {resultado.erro && (
        <div className="text-red-600 font-mono">
          <h2 className="text-xl font-semibold">FALHA NA CONEXÃO</h2>
          <p>{resultado.erro}</p>
        </div>
      )}

      {resultado.sucesso && (
        <div>
          <h2 className="text-xl font-semibold text-green-600 mb-4">SUCESSO! DADOS RECEBIDOS:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resultado.sucesso.map((imovel) => (
              <div key={imovel.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img src={imovel.imagem_principal} alt={imovel.titulo} className="w-full h-56 object-cover"/>
                <div className="p-4">
                  <h3 className="text-xl font-bold">{imovel.titulo}</h3>
                  <p className="text-gray-600">{imovel.bairro}, {imovel.cidade}</p>
                  <p className="text-lg font-semibold text-blue-600 mt-2">R$ {imovel.preco.toLocaleString('pt-BR')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}