// frontend/components/Footer.js

import Link from 'next/link';

export default function Footer() {
  // ✅ ADICIONE A ID AQUI
  return (
    <footer id="contato" className="bg-gray-800 text-gray-300 py-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Gomes Imóveis</h3>
          <p>Sua casa dos sonhos está aqui. A melhor assessoria imobiliária da região.</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Links Úteis</h3>
          <ul>
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li><Link href="/imoveis" className="hover:text-white">Imóveis</Link></li>
            {/* O link de contato aqui também pode usar a âncora */}
            <li><Link href="/#contato" className="hover:text-white">Contato</Link></li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Contato</h3>
          <p>
            <a href="mailto:gomesegomes538@gmail.com" className="hover:text-white">
              gomesegomes538@gmail.com
            </a>
          </p>
          <p className="mt-1">
            <a href="https://wa.me/5515996612039" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              (15) 99661-2039
            </a>
          </p>
        </div>

      </div>
      <div className="text-center mt-8 border-t border-gray-700 pt-4">
        <p>&copy; {new Date().getFullYear()} Gomes Imóveis. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}