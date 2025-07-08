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
    },
    {
        id: 4,
        title: "Saúde Mental: Depressão, Ansiedade e TDAH",
        excerpt: "Um guia completo sobre três dos transtornos mentais mais comuns e como buscar ajuda profissional.",
        content: `
            <div class="card mb-4">
                <div class="card-body">
                    <h2 class="h4 mb-3">Entendendo a Saúde Mental</h2>
                    <p class="mb-0">A saúde mental é uma parte fundamental do nosso bem-estar geral. Entender os transtornos mais comuns é o primeiro passo para buscar ajuda e tratamento adequado. Vamos explorar três condições que afetam milhões de pessoas em todo o mundo.</p>
                </div>
            </div>

            <div class="card mb-4">
                <div class="card-body">
                    <h2 class="h4 mb-4">
                        <i class="bi bi-cloud-rain me-2 text-primary"></i>Depressão
                    </h2>
                    
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <div class="card h-100">
                                <div class="card-body">
                                    <h3 class="h5 text-primary mb-3">O que é?</h3>
                                    <p>É um transtorno mental caracterizado por tristeza persistente e perda de interesse em atividades que normalmente são prazerosas. Pode afetar pensamentos, comportamento, humor e saúde física.</p>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-6 mb-3">
                            <div class="card h-100">
                                <div class="card-body">
                                    <h3 class="h5 text-primary mb-3">Sintomas Comuns</h3>
                                    <ul class="list-unstyled">
                                        <li class="mb-2"><i class="bi bi-dot me-2"></i>Tristeza persistente</li>
                                        <li class="mb-2"><i class="bi bi-dot me-2"></i>Perda de interesse</li>
                                        <li class="mb-2"><i class="bi bi-dot me-2"></i>Alterações no sono</li>
                                        <li class="mb-2"><i class="bi bi-dot me-2"></i>Fadiga e falta de energia</li>
                                        <li class="mb-2"><i class="bi bi-dot me-2"></i>Dificuldade de concentração</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card mb-4">
                <div class="card-body">
                    <h2 class="h4 mb-4">
                        <i class="bi bi-lightning me-2 text-warning"></i>Ansiedade
                    </h2>
                    
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <div class="card h-100">
                                <div class="card-body">
                                    <h3 class="h5 text-primary mb-3">O que é?</h3>
                                    <p>É uma resposta natural do corpo ao estresse, mas quando excessiva, pode se tornar um transtorno que interfere na vida diária. Caracteriza-se por preocupação e medo intensos, excessivos e persistentes.</p>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-6 mb-3">
                            <div class="card h-100">
                                <div class="card-body">
                                    <h3 class="h5 text-primary mb-3">Sintomas Comuns</h3>
                                    <ul class="list-unstyled">
                                        <li class="mb-2"><i class="bi bi-dot me-2"></i>Preocupação excessiva</li>
                                        <li class="mb-2"><i class="bi bi-dot me-2"></i>Inquietação</li>
                                        <li class="mb-2"><i class="bi bi-dot me-2"></i>Dificuldade para relaxar</li>
                                        <li class="mb-2"><i class="bi bi-dot me-2"></i>Problemas de concentração</li>
                                        <li class="mb-2"><i class="bi bi-dot me-2"></i>Sintomas físicos (taquicardia, sudorese)</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card mb-4">
                <div class="card-body">
                    <h2 class="h4 mb-4">
                        <i class="bi bi-lightning-charge me-2 text-danger"></i>TDAH
                    </h2>
                    
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <div class="card h-100">
                                <div class="card-body">
                                    <h3 class="h5 text-primary mb-3">O que é?</h3>
                                    <p>O Transtorno do Déficit de Atenção e Hiperatividade (TDAH) é um transtorno neurobiológico que afeta o desenvolvimento e funcionamento do cérebro, impactando a atenção, o controle de impulsos e a atividade motora.</p>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-6 mb-3">
                            <div class="card h-100">
                                <div class="card-body">
                                    <h3 class="h5 text-primary mb-3">Sintomas Comuns</h3>
                                    <ul class="list-unstyled">
                                        <li class="mb-2"><i class="bi bi-dot me-2"></i>Dificuldade de concentração</li>
                                        <li class="mb-2"><i class="bi bi-dot me-2"></i>Hiperatividade</li>
                                        <li class="mb-2"><i class="bi bi-dot me-2"></i>Impulsividade</li>
                                        <li class="mb-2"><i class="bi bi-dot me-2"></i>Desorganização</li>
                                        <li class="mb-2"><i class="bi bi-dot me-2"></i>Dificuldade em seguir instruções</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card mb-4">
                <div class="card-body">
                    <h2 class="h4 mb-4">Tratamentos Disponíveis</h2>
                    <div class="row">
                        <div class="col-md-4 mb-3">
                            <div class="card h-100">
                                <div class="card-body">
                                    <h3 class="h5 text-primary mb-3">
                                        <i class="bi bi-heart-pulse me-2"></i>Psicoterapia
                                    </h3>
                                    <ul class="list-unstyled">
                                        <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>Terapia Cognitivo-Comportamental</li>
                                        <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>Terapia Comportamental</li>
                                        <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>Aconselhamento</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-4 mb-3">
                            <div class="card h-100">
                                <div class="card-body">
                                    <h3 class="h5 text-primary mb-3">
                                        <i class="bi bi-capsule me-2"></i>Medicamentos
                                    </h3>
                                    <ul class="list-unstyled">
                                        <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>Antidepressivos</li>
                                        <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>Ansiolíticos</li>
                                        <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>Estimulantes (TDAH)</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-4 mb-3">
                            <div class="card h-100">
                                <div class="card-body">
                                    <h3 class="h5 text-primary mb-3">
                                        <i class="bi bi-activity me-2"></i>Mudanças no Estilo de Vida
                                    </h3>
                                    <ul class="list-unstyled">
                                        <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>Exercícios físicos</li>
                                        <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>Alimentação saudável</li>
                                        <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>Técnicas de relaxamento</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card mb-4">
                <div class="card-body">
                    <h2 class="h4 mb-3">Recursos de Ajuda</h2>
                    <div class="list-group">
                        <a href="#" class="list-group-item list-group-item-action">
                            <i class="bi bi-telephone me-2"></i>Centro de Valorização da Vida (CVV) - 188
                        </a>
                        <a href="#" class="list-group-item list-group-item-action">
                            <i class="bi bi-hospital me-2"></i>CAPS - Centros de Atenção Psicossocial
                        </a>
                        <a href="#" class="list-group-item list-group-item-action">
                            <i class="bi bi-people me-2"></i>Grupos de Apoio
                        </a>
                        <a href="#" class="list-group-item list-group-item-action">
                            <i class="bi bi-book me-2"></i>Materiais Educativos
                        </a>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-body">
                    <h2 class="h4 mb-3">Busque Ajuda Profissional</h2>
                    <p class="mb-0">Se você ou alguém que você conhece está enfrentando algum desses transtornos, não hesite em buscar ajuda profissional. Estamos aqui para ajudar:</p>
                    <div class="mt-3">
                        <a href="mailto:contato@exemplo.com" class="btn btn-primary me-2">
                            <i class="bi bi-envelope me-2"></i>Email
                        </a>
                        <a href="tel:+5511999999999" class="btn btn-success">
                            <i class="bi bi-telephone me-2"></i>Telefone
                        </a>
                    </div>
                </div>
            </div>
        `,
        image: "/src/assets/images/blog/saude-mental.jpg",
        date: "2024-03-20",
        author: "Dra. Anizia",
        category: "Saúde Mental",
        tags: ["depressão", "ansiedade", "TDAH", "saúde mental", "psicologia", "terapia"],
        featured: true
    }
];

export default blogPosts; 