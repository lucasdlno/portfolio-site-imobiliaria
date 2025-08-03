// frontend/components/Header.js

import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Gomes Imóveis
        </Link>

        {/* Links de Navegação */}
        <nav>
          <ul className="flex items-center space-x-6">
            <li>
              <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                Home
              </Link>
            </li>
            <li>
              {/* ✅ CORREÇÃO: Link para a página de busca */}
              <Link href="/imoveis" className="text-gray-600 hover:text-blue-600 transition-colors">
                Imóveis
              </Link>
            </li>
            <li>
              {/* ✅ CORREÇÃO: Link com âncora para rolar a tela */}
              <Link href="/#contato" className="text-gray-600 hover:text-blue-600 transition-colors">
                Contato
              </Link>
            </li>
            <li>
              <Link href="/admin" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Admin
              </Link>
            </li>
          </ul>
        </nav>

      </div>
    </header>
  );
}