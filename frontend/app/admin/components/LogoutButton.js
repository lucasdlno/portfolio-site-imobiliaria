'use client';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'; // ✅ Importa a biblioteca

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // ✅ MUDANÇA: Apenas remove o cookie do navegador
    Cookies.remove('token');
    router.push('/login');
    router.refresh();
  };

  return (
    <button onClick={handleLogout} className="bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700">
      Sair
    </button>
  );
}