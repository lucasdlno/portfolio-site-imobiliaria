'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // ✅ Importa o useRouter
import Cookies from 'js-cookie'; // ✅ Importa a biblioteca de cookies
import apiUrl from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // ✅ Inicializa o router

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Falha no login');
      }

      // ✅ MUDANÇA: Salva o token recebido nos cookies do navegador
      Cookies.set('token', data.token, { expires: 1/3 }); // Expira em 8 horas (1/3 de um dia)

      // ✅ MUDANÇA: Usa o router para navegar para a página de admin
      router.push('/admin');

    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="p-8 bg-white rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Login do Administrador</h1>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-2 mb-4 border rounded" />
        <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-2 mb-4 border rounded" />
        
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        
        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 disabled:bg-blue-300" disabled={isLoading}>
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}