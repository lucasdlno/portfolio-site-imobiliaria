// frontend/lib/authFetch.js

import Cookies from 'js-cookie';
import apiUrl from './api'; // Importa a URL base da API (http://localhost:3001 ou a do Render)

const authFetch = async (url, options = {}) => {
  const token = Cookies.get('token');

  // Cria os cabeçalhos (headers), começando com os que já podem existir nas opções
  const headers = {
    ...options.headers,
  };

  // Adiciona o token de autorização se ele existir
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Monta a requisição completa, combinando a URL da API com o caminho do recurso
  const response = await fetch(`${apiUrl}${url}`, {
    ...options,
    headers,
  });

  // Se a resposta for 401 ou 403 (não autorizado), o token é inválido ou expirou.
  // Limpamos o cookie e forçamos o logout para a página de login.
  if (response.status === 401 || response.status === 403) {
    Cookies.remove('token');
    // Verifica se o código está rodando no navegador antes de redirecionar
    if (typeof window !== 'undefined') {
        window.location.href = '/login';
    }
    // Lança um erro para parar a execução do código que chamou o fetch
    throw new Error('Sessão expirada. Por favor, faça o login novamente.');
  }

  return response;
};

export default authFetch;