const blogPosts = [
    {
        id: 1,
        title: "Entendendo o Autismo",
        excerpt: "Um guia completo sobre o Transtorno do Espectro Autista e suas características principais.",
        content: `
            <p>O Transtorno do Espectro Autista (TEA) é uma condição neurológica que afeta o desenvolvimento do cérebro, 
            impactando principalmente a comunicação social e o comportamento.</p>
            
            <h2>Características Principais</h2>
            <ul>
                <li>Dificuldades na comunicação social</li>
                <li>Padrões restritos e repetitivos de comportamento</li>
                <li>Interesses específicos e intensos</li>
                <li>Dificuldades na interação social</li>
            </ul>

            <h2>Diagnóstico Precoce</h2>
            <p>O diagnóstico precoce é fundamental para iniciar as intervenções adequadas o quanto antes. 
            Os primeiros sinais podem aparecer já nos primeiros anos de vida.</p>

            <h2>Tratamento</h2>
            <p>A Terapia ABA (Análise do Comportamento Aplicada) é considerada uma das intervenções mais 
            eficazes para o tratamento do autismo, ajudando no desenvolvimento de habilidades sociais, 
            comunicação e comportamento adaptativo.</p>
        `,
        image: "/src/assets/images/blog/autismo.jpg",
        date: "2024-03-15",
        author: "Dra. Anizia",
        category: "Autismo",
        tags: ["autismo", "TEA", "desenvolvimento", "terapia"],
        featured: true
    },
    {
        id: 2,
        title: "TDAH: Mitos e Verdades",
        excerpt: "Desvendando os principais mitos e verdades sobre o Transtorno do Déficit de Atenção e Hiperatividade.",
        content: `
            <p>O Transtorno do Déficit de Atenção e Hiperatividade (TDAH) é um dos transtornos neurobiológicos 
            mais comuns na infância, afetando cerca de 5% das crianças em idade escolar.</p>

            <h2>Mitos Comuns</h2>
            <ul>
                <li>"TDAH é apenas falta de disciplina"</li>
                <li>"É uma condição que desaparece na idade adulta"</li>
                <li>"É causado por excesso de açúcar"</li>
                <li>"É apenas uma desculpa para mau comportamento"</li>
            </ul>

            <h2>Verdades</h2>
            <ul>
                <li>É um transtorno neurobiológico real</li>
                <li>Pode persistir na vida adulta</li>
                <li>Tem forte componente genético</li>
                <li>Pode ser tratado efetivamente</li>
            </ul>

            <h2>Tratamento</h2>
            <p>O tratamento do TDAH geralmente envolve uma combinação de terapia comportamental, 
            intervenções educacionais e, quando necessário, medicação.</p>
        `,
        image: "/src/assets/images/blog/tdah.jpg",
        date: "2024-03-10",
        author: "Dra. Anizia",
        category: "TDAH",
        tags: ["TDAH", "atenção", "hiperatividade", "desenvolvimento"],
        featured: true
    },
    {
        id: 3,
        title: "A Importância da Terapia ABA",
        excerpt: "Como a Análise do Comportamento Aplicada pode transformar vidas e promover desenvolvimento.",
        content: `
            <p>A Terapia ABA (Análise do Comportamento Aplicada) é uma abordagem científica que utiliza 
            princípios da análise do comportamento para promover mudanças significativas e duradouras.</p>

            <h2>Princípios Fundamentais</h2>
            <ul>
                <li>Análise funcional do comportamento</li>
                <li>Reforço positivo</li>
                <li>Generalização de habilidades</li>
                <li>Coleta de dados e avaliação contínua</li>
            </ul>

            <h2>Benefícios</h2>
            <ul>
                <li>Desenvolvimento de habilidades sociais</li>
                <li>Melhora na comunicação</li>
                <li>Redução de comportamentos inadequados</li>
                <li>Promoção de independência</li>
            </ul>

            <h2>Aplicações</h2>
            <p>A Terapia ABA é eficaz não apenas para o tratamento do autismo, mas também para diversos 
            outros transtornos do desenvolvimento e comportamentais.</p>
        `,
        image: "/src/assets/images/blog/aba.jpg",
        date: "2024-03-05",
        author: "Dra. Anizia",
        category: "Terapia ABA",
        tags: ["ABA", "terapia", "comportamento", "desenvolvimento"],
        featured: false
    }
];

export default blogPosts; 