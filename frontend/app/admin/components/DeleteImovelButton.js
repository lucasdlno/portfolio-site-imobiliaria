'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Cookies from 'js-cookie'; // ✅ Importa
import apiUrl from '@/lib/api';

export default function DeleteImovelButton({ imovelId }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja deletar este imóvel?')) {
      setIsDeleting(true);
      const token = Cookies.get('token'); // ✅ Pega o token dos cookies

      try {
        const res = await fetch(`${apiUrl}/api/imoveis/${imovelId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}` // ✅ Envia o token no cabeçalho
          }
        });
        if (!res.ok) throw new Error('Falha ao deletar o imóvel');

        alert('Imóvel deletado com sucesso!');
        router.refresh();
      } catch (error) {
        console.error(error);
        alert('Ocorreu um erro ao deletar o imóvel.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <button onClick={handleDelete} disabled={isDeleting} className="bg-red-500 text-white px-3 py-1 text-sm rounded-md hover:bg-red-600 disabled:bg-red-300">
      {isDeleting ? 'Deletando...' : 'Deletar'}
    </button>
  );
}