document.addEventListener('DOMContentLoaded', () => {

    // --- Pop-up de Boas-Vindas ---
    const welcomePopup = document.getElementById('welcome-popup');
    const welcomeButton = document.getElementById('welcome-button');

    // Mostra o pop-up ao carregar a página
    welcomePopup.classList.add('active');

    welcomeButton.addEventListener('click', () => {
        welcomePopup.classList.remove('active');
        // Opcional: remover o elemento do DOM após a animação
        welcomePopup.addEventListener('transitionend', () => {
            welcomePopup.remove();
        }, { once: true });
    });

    // --- Menu Retrátil Pop-up ---
    const menuToggleButton = document.getElementById('menu-toggle-button');
    const menuPopup = document.getElementById('menu-popup');
    const closeMenuButton = document.getElementById('close-menu-button');
    const menuLinks = document.querySelectorAll('#menu-popup nav ul li a');

    menuToggleButton.addEventListener('click', () => {
        menuPopup.classList.toggle('active');
    });

    closeMenuButton.addEventListener('click', () => {
        menuPopup.classList.remove('active');
    });

    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Impede o comportamento padrão do link
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                menuPopup.classList.remove('active'); // Fecha o menu ao clicar
                setTimeout(() => { // Pequeno atraso para a transição do menu
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }, 400); // Deve ser maior que a duração da transição do menu
            }
        });
    });

    // --- Efeito de Partículas ao Toque/Clique ---
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleColors = ['#ff004c', '#00ffff', '#a020f0', '#00ff00', '#ffcc00'];

    // Ajusta o canvas ao tamanho da janela
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 5 + 1;
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * 3 - 1.5;
            this.color = particleColors[Math.floor(Math.random() * particleColors.length)];
            this.opacity = 1;
            this.life = 100; // Vida útil da partícula
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.opacity -= 0.01;
            this.life--;
            if (this.size > 0.2) this.size -= 0.1; // Diminui o tamanho
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    const createParticles = (x, y, count) => {
        for (let i = 0; i < count; i++) {
            particles.push(new Particle(x, y));
        }
    };

    const animateParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            if (particles[i].opacity <= 0 || particles[i].life <= 0 || particles[i].size <= 0.2) {
                particles.splice(i, 1);
                i--;
            }
        }
        requestAnimationFrame(animateParticles);
    };

    animateParticles();

    // Evento de toque/clique para criar partículas
    document.body.addEventListener('click', (e) => {
        createParticles(e.clientX, e.clientY, 15); // 15 partículas por clique
    });
    document.body.addEventListener('touchstart', (e) => {
        for (let i = 0; i < e.touches.length; i++) {
            createParticles(e.touches[i].clientX, e.touches[i].clientY, 15);
        }
    });

    // --- Patinho Andando ---
    const duck = document.getElementById('duck');
    let duckX = 0;
    let duckY = 0;
    let duckDirectionX = 1; // 1 para direita, -1 para esquerda
    let duckDirectionY = 1; // 1 para baixo, -1 para cima
    const duckSpeed = 0.9; // Velocidade do patinho em px por frame
    const duckSize = 80; // Largura/altura do patinho

    const moveDuck = () => {
        // Movimento horizontal
        duckX += duckDirectionX * duckSpeed;
        if (duckX + duckSize > window.innerWidth || duckX < 0) {
            duckDirectionX *= -1; // Inverte a direção horizontal
            duckX = Math.max(0, Math.min(window.innerWidth - duckSize, duckX)); // Corrige posição
            duck.style.transform = `scaleX(${duckDirectionX})`; // Vira o patinho
        }

        // Movimento vertical (mais aleatório ou ligado ao scroll, por exemplo)
        // Por simplicidade, vamos fazer ele flutuar verticalmente um pouco aleatoriamente
        duckY += duckDirectionY * (Math.random() * 2 - 1); // Pequenas flutuações
        if (duckY + duckSize > window.innerHeight || duckY < 0) {
            duckDirectionY *= -1;
            duckY = Math.max(0, Math.min(window.innerHeight - duckSize, duckY));
        }


        // Mantém o patinho dentro da tela
        duckX = Math.max(0, Math.min(window.innerWidth - duckSize, duckX));
        duckY = Math.max(0, Math.min(window.innerHeight - duckSize, duckY));


        duck.style.left = `${duckX}px`;
        duck.style.top = `${duckY}px`;

        requestAnimationFrame(moveDuck);
    };

    // Posição inicial aleatória do patinho
    duckX = Math.random() * (window.innerWidth - duckSize);
    duckY = Math.random() * (window.innerHeight - duckSize);
    moveDuck();


    // --- Tabela Periódica Interativa ---
    const elements = document.querySelectorAll('.periodic-table-grid .element');
    const elementPopup = document.getElementById('element-popup');
    const closeElementPopup = document.getElementById('close-element-popup');
    const elementName = document.getElementById('element-name');
    const elementSymbol = document.getElementById('element-symbol');
    const elementNumber = document.getElementById('element-number');
    const elementImage = document.getElementById('element-image');

    elements.forEach(element => {
        element.addEventListener('click', () => {
            elementName.textContent = element.dataset.name;
            elementSymbol.textContent = element.dataset.symbol;
            elementNumber.textContent = element.dataset.number;
            elementImage.src = element.dataset.image;
            elementPopup.classList.add('active');
        });
    });

    closeElementPopup.addEventListener('click', () => {
        elementPopup.classList.remove('active');
    });

    // Fechar pop-up do elemento ao clicar fora
    elementPopup.addEventListener('click', (e) => {
        if (e.target === elementPopup) {
            elementPopup.classList.remove('active');
        }
    });


    // --- Quiz da Química ---
    const quizQuestion = document.getElementById('quiz-question');
    const quizOptions = document.getElementById('quiz-options');
    const quizNextButton = document.getElementById('quiz-next-button');
    const quizSkipButton = document.getElementById('quiz-skip-button');
    const quizHelpButton = document.getElementById('quiz-help-button');
    const helpCountSpan = document.getElementById('help-count');
    const currentScoreSpan = document.getElementById('current-score');
    const feedbackResult = document.getElementById('quiz-result-feedback');
    const feedbackImage = document.getElementById('feedback-image');
    const feedbackSound = document.getElementById('feedback-sound');

    let currentQuestionIndex = 0;
    let score = 0;
    let helpUses = 3;
    let quizQuestions; // Será carregado com as perguntas
    let answeredQuestions = new Set(); // Para evitar perguntas repetidas em um quiz
    let currentOptions = []; // Para armazenar as opções da pergunta atual

    // Arrays de imagens e sons para feedback
    const happyImages = [
        'acertou1.gif',
        'acertou2.gif',
        'acertou3.gif',
        'acertou5.gif',
        'acertou6.gif', 
		'acertou4.gif',
		'acertou7.gif',
        'acertou8.gif',
		'acertou9.gif',
        'acertou10.gif',
        'acertou11.gif',

        'acertou12.gif',
        'acertou13.gif', 
		
        'acertou14.gif',

        'acertou15.gif',
        'acertou16.gif',
		
        'acertou17.gif',
		
        'acertou18.gif', 
		'acertou19.gif',
        // Adicione mais URLs de imagens felizes
    ];
    const sadImages = [
        'errou1.gif',
        'errou2.gif',
        'errou3.gif',
        'errou5.gif',
        'errou6.gif',
        'errou8.gif', 
        'errou12.gif',
        'errou11.gif',
        'errou13.gif',
        'errou14.gif',
        'errou16.gif',
        'errou18.gif',
        'errou19.gif',
        'errou21.gif',
        'errou22.gif',
		'errou24.gif',
        'errou23.gif',
        'errou4.gif',
		'errou24.gif',
		'errou4.gif',
		'errou7.gif',
		'errou9.gif',
		'errou12.gif',
		'errou17.gif',
		'errou20.gif',
		
        // Adicione mais URLs de imagens tristes
    ];
    const happySounds = [
        'fsom1.mp3',  // Exemplo: som feliz
        'fsom2.mp3',
		'fsom3.mp3',  // Exemplo: som feliz
        'fsom4.mp3',
		'fsom5.mp3',  // Exemplo: som feliz
        'fsom6.mp3',
		'fsom7.mp3',  // Exemplo: som feliz
        'fsom8.mp3',
		'fsom9.mp3',  // Exemplo: som feliz
        'fsom10.mp3',
		'fsom11.mp3',  // Exemplo: som feliz
        'fsom12.mp3',
		'fsom13.mp3',  // Exemplo: som feliz
        'fsom14.mp3',
		'fsom15.mp3',  // Exemplo: som feliz
        'fsom16.mp3',
		'fsom17.mp3',  // Exemplo: som feliz
        'fsom18.mp3',  // Exemplo: som feliz
        'fsom19.mp3',
	// Exemplo: som feliz
        
        // Adicbione mais URLs de sons felizes
    ];
    const sadSounds = [
        'tsom1.mp3', // Exemplo: som triste
        'tsom2.mp3', 
		'tsom4.mp3', // Exemplo: som triste
        'tsom3.mp3',
		'tsom5.mp3', // Exemplo: som triste
        'tsom6.mp3', 
		'tsom7.mp3', // Exemplo: som triste
        'tsom8.mp3',
		'tsom9.mp3', // Exemplo: som triste
        'tsom10.mp3',
		'tsom11.mp3', // Exemplo: som triste
        'tsom12.mp3',
		'tsom13.mp3', // Exemplo: som triste
        'tsom14mp3', 
		'tsom15.mp3', // Exemplo: som triste
        'tsom16.mp3',
		'tsom17.mp3', // Exemplo: som triste
        'tsom18.mp3',
		'tsom19.mp3', // Exemplo: som triste
        'tsom20.mp3',
		'tsom21.mp3', // Exemplo: som triste
        'tsom22.mp3', 
		'tsom23.mp3', // Exemplo: som triste
        'tsom24.mp3',
        // Adicione mais URLs de sons tristes
    ];

    // Função para buscar perguntas (simulando uma API ou arquivo JSON)
    const loadQuizQuestions = async () => {
        // Em um cenário real, você buscaria de um JSON. Aqui, está hardcoded.
        quizQuestions = [
            
  {
    question: "O que é um solvente universal?",
    options: ["Ácido", "Água", "Óleo", "Álcool"],
    answer: "Água"
  },
  {
    question: "Qual é a capital do Brasil?",
    options: ["Rio de Janeiro", "São Paulo", "Brasília", "Salvador"],
    answer: "Brasília"
  },
  {
    question: "Quantos planetas existem no nosso sistema solar?",
    options: ["7", "8", "9", "10"],
    answer: "8"
  },
  {
    question: "Qual o maior oceano do mundo?",
    options: ["Atlântico", "Índico", "Ártico", "Pacífico"],
    answer: "Pacífico"
  },
  {
    question: "Quem pintou a Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    answer: "Leonardo da Vinci"
  },
  {
    question: "Qual o animal mais rápido do mundo?",
    options: ["Leopardo", "Chita", "Falcão-peregrino", "Guepardo"],
    answer: "Falcão-peregrino"
  },
  {
    question: "Qual o maior deserto do mundo?",
    options: ["Saara", "Atacama", "Gobi", "Antártico"],
    answer: "Antártico"
  },
  {
    question: "Quantos dias tem um ano bissexto?",
    options: ["365", "366", "364", "367"],
    answer: "366"
  },
  {
    question: "Qual o metal mais abundante na crosta terrestre?",
    options: ["Ferro", "Alumínio", "Cobre", "Ouro"],
    answer: "Alumínio"
  },
  {
    question: "Qual o nome do processo de transformação de água líquida em vapor?",
    options: ["Condensação", "Solidificação", "Evaporação", "Sublimação"],
    answer: "Evaporação"
  },
  {
    question: "Qual o país com maior população do mundo?",
    options: ["Índia", "Estados Unidos", "China", "Indonésia"],
    answer: "Índia"
  },
  {
    question: "Qual o nome do gás que respiramos?",
    options: ["Dióxido de carbono", "Nitrogênio", "Oxigênio", "Hidrogênio"],
    answer: "Oxigênio"
  },
  {
    question: "Qual o maior rio do mundo em volume de água?",
    options: ["Nilo", "Amazonas", "Mississippi", "Yangtzé"],
    answer: "Amazonas"
  },
  {
    question: "Quem escreveu 'Dom Quixote'?",
    options: ["William Shakespeare", "Miguel de Cervantes", "Machado de Assis", "Gabriel García Márquez"],
    answer: "Miguel de Cervantes"
  },
  {
    question: "Qual o único mamífero que voa?",
    options: ["Pássaro", "Morcego", "Borboleta", "Abelha"],
    answer: "Morcego"
  },
  {
    question: "Qual o ponto mais alto da Terra?",
    options: ["Monte Fuji", "Monte Everest", "K2", "Mont Blanc"],
    answer: "Monte Everest"
  },
  {
    question: "Em que ano o homem pisou na Lua pela primeira vez?",
    options: ["1959", "1969", "1979", "1989"],
    answer: "1969"
  },
  {
    question: "Qual o principal componente do ar que respiramos?",
    options: ["Oxigênio", "Dióxido de Carbono", "Nitrogênio", "Argônio"],
    answer: "Nitrogênio"
  },
  {
    question: "Qual o menor país do mundo?",
    options: ["Mônaco", "Vaticano", "San Marino", "Nauru"],
    answer: "Vaticano"
  },
  {
    question: "Quantos ossos tem o corpo humano adulto?",
    options: ["206", "210", "198", "220"],
    answer: "206"
  },
  {
    question: "Qual a velocidade da luz no vácuo?",
    options: ["300.000 km/s", "150.000 km/s", "400.000 km/s", "200.000 km/s"],
    answer: "300.000 km/s"
  },
  {
    question: "Qual o continente mais populoso?",
    options: ["África", "América", "Europa", "Ásia"],
    answer: "Ásia"
  },
  {
    question: "Quem foi o primeiro presidente do Brasil?",
    options: ["Getúlio Vargas", "Dom Pedro I", "Marechal Deodoro da Fonseca", "Juscelino Kubitschek"],
    answer: "Marechal Deodoro da Fonseca"
  },
  {
    question: "Qual o maior órgão do corpo humano?",
    options: ["Cérebro", "Coração", "Pele", "Fígado"],
    answer: "Pele"
  },
  {
    question: "Qual o símbolo químico da água?",
    options: ["O2", "H2O", "CO2", "N2"],
    answer: "H2O"
  },
  {
    question: "Qual o inventor da lâmpada elétrica?",
    options: ["Nikola Tesla", "Thomas Edison", "Alexander Graham Bell", "Albert Einstein"],
    answer: "Thomas Edison"
  },
  {
    question: "Quantos lados tem um hexágono?",
    options: ["5", "6", "7", "8"],
    answer: "6"
  },
  {
    question: "Qual o esporte mais popular do mundo?",
    options: ["Basquete", "Vôlei", "Futebol", "Tênis"],
    answer: "Futebol"
  },
  {
    question: "Qual a capital da França?",
    options: ["Roma", "Berlim", "Londres", "Paris"],
    answer: "Paris"
  },
  {
    question: "Qual o animal símbolo da Austrália?",
    options: ["Urso", "Canguru", "Elefante", "Coala"],
    answer: "Canguru"
  },
  {
    question: "Qual o nome da galáxia em que vivemos?",
    options: ["Andrômeda", "Via Láctea", "Triângulo", "Cigarro"],
    answer: "Via Láctea"
  },
  {
    question: "Qual a unidade de medida de energia?",
    options: ["Watt", "Ampere", "Joule", "Volt"],
    answer: "Joule"
  },
  {
    question: "Quem escreveu 'Romeu e Julieta'?",
    options: ["Charles Dickens", "Jane Austen", "William Shakespeare", "Victor Hugo"],
    answer: "William Shakespeare"
  },
  {
    question: "Qual o nome do processo pelo qual as plantas produzem seu próprio alimento?",
    options: ["Respiração", "Fotossíntese", "Transpiração", "Fermentação"],
    answer: "Fotossíntese"
  },
  {
    question: "Qual o instrumento musical mais antigo?",
    options: ["Flauta", "Tambor", "Lira", "Harpa"],
    answer: "Flauta"
  },
  {
    question: "Qual o país conhecido como a 'Terra do Sol Nascente'?",
    options: ["China", "Coreia do Sul", "Japão", "Vietnã"],
    answer: "Japão"
  },
  {
    question: "Qual o nome do satélite natural da Terra?",
    options: ["Marte", "Vênus", "Lua", "Sol"],
    answer: "Lua"
  },
  {
    question: "Qual a língua mais falada no mundo?",
    options: ["Inglês", "Espanhol", "Mandarim", "Hindi"],
    answer: "Mandarim"
  },
  {
    question: "Qual o principal gás responsável pelo efeito estufa?",
    options: ["Oxigênio", "Nitrogênio", "Dióxido de Carbono", "Metano"],
    answer: "Dióxido de Carbono"
  },
  {
    question: "Qual o animal que tem o pescoço mais longo?",
    options: ["Elefante", "Girafa", "Cobra", "Zebra"],
    answer: "Girafa"
  },
  {
    question: "Qual o nome da primeira mulher a ir ao espaço?",
    options: ["Sally Ride", "Valentina Tereshkova", "Mae Jemison", "Ellen Ochoa"],
    answer: "Valentina Tereshkova"
  },
  {
    question: "Qual o nome do menor osso do corpo humano?",
    options: ["Fêmur", "Estribo", "Tíbia", "Rádio"],
    answer: "Estribo"
  },
  {
    question: "Qual o nome do processo de queima de combustíveis?",
    options: ["Oxidação", "Combustão", "Redução", "Decomposição"],
    answer: "Combustão"
  },
  {
    question: "Qual o nome do teorema que relaciona os lados de um triângulo retângulo?",
    options: ["Teorema de Tales", "Teorema de Pitágoras", "Teorema de Fermat", "Teorema de Newton"],
    answer: "Teorema de Pitágoras"
  },
  {
    question: "Qual o nome da moeda utilizada na Europa?",
    options: ["Dólar", "Libra", "Euro", "Yen"],
    answer: "Euro"
  },
  {
    question: "Qual o nome do cientista que formulou a Lei da Gravitação Universal?",
    options: ["Albert Einstein", "Isaac Newton", "Galileu Galilei", "Stephen Hawking"],
    answer: "Isaac Newton"
  },
  {
    question: "Qual o nome da cordilheira mais longa do mundo?",
    options: ["Himalaias", "Andes", "Rochosas", "Atlas"],
    answer: "Andes"
  },
  {
    question: "Qual o nome do maior animal terrestre?",
    options: ["Baleia Azul", "Elefante", "Girafa", "Rinoceronte"],
    answer: "Elefante"
  },
  {
    question: "Qual o nome do ponto de ebulição da água em graus Celsius?",
    options: ["0°C", "50°C", "100°C", "200°C"],
    answer: "100°C"
  },
  {
    question: "Qual o nome do maior vulcão ativo do mundo?",
    options: ["Vesúvio", "Fujiyama", "Mauna Loa", "Etna"],
    answer: "Mauna Loa"
  },
  {
    question: "Qual o nome do processo de divisão celular?",
    options: ["Meiose", "Mitose", "Fecundação", "Germinação"],
    answer: "Mitose"
  },
  {
    question: "Qual o nome da primeira civilização da Mesopotâmia?",
    options: ["Egípcios", "Gregos", "Sumérios", "Romanos"],
    answer: "Sumérios"
  },
  {
    question: "Qual o nome da menor ave do mundo?",
    options: ["Beija-flor", "Pardal", "Colibri-abelha", "Pardal"],
    answer: "Colibri-abelha"
  },
  {
    question: "Qual o nome do gás que compõe a maior parte da atmosfera terrestre?",
    options: ["Oxigênio", "Nitrogênio", "Dióxido de Carbono", "Argônio"],
    answer: "Nitrogênio"
  },
  {
    question: "Qual o nome da ciência que estuda os astros e o universo?",
    options: ["Biologia", "Geografia", "Astronomia", "Geologia"],
    answer: "Astronomia"
  },
  {
    question: "Qual o nome da camada da Terra onde vivemos?",
    options: ["Manto", "Núcleo", "Crosta", "Atmosfera"],
    answer: "Crosta"
  },
  {
    question: "Qual o nome do fenômeno óptico que separa a luz em suas cores?",
    options: ["Reflexão", "Refração", "Dispersão", "Difração"],
    answer: "Dispersão"
  },
  {
    question: "Qual o nome do processo de transformação de rochas em solo?",
    options: ["Erosão", "Sedimentação", "Intemperismo", "Vulcanismo"],
    answer: "Intemperismo"
  },
  {
    question: "Qual o nome da estrutura responsável pela herança genética?",
    options: ["Proteína", "Carboidrato", "Lipídio", "DNA"],
    answer: "DNA"
  },
  {
    question: "Qual o nome do maior mamífero marinho?",
    options: ["Tubarão-branco", "Orca", "Baleia-azul", "Golfinho"],
    answer: "Baleia-azul"
  },
  {
    question: "Qual o nome da energia gerada pelo movimento das águas?",
    options: ["Solar", "Eólica", "Hidrelétrica", "Geotérmica"],
    answer: "Hidrelétrica"
  },
  {
    question: "Qual o nome do processo de respiração das plantas?",
    options: ["Fotossíntese", "Transpiração", "Respiração celular", "Evaporação"],
    answer: "Respiração celular"
  },
  {
    question: "Qual o nome do sistema que transporta o sangue pelo corpo?",
    options: ["Digestório", "Respiratório", "Circulatório", "Nervoso"],
    answer: "Circulatório"
  },
  {
    question: "Qual o nome do fenômeno natural que causa terremotos?",
    options: ["Furacão", "Tsunami", "Movimento das placas tectônicas", "Erupção vulcânica"],
    answer: "Movimento das placas tectônicas"
  },
  {
    question: "Qual o nome do metal precioso que é símbolo de riqueza?",
    options: ["Prata", "Cobre", "Ouro", "Bronze"],
    answer: "Ouro"
  },
  {
    question: "Qual o nome da força que nos mantém presos à Terra?",
    options: ["Elétrica", "Magnética", "Gravidade", "Nuclear"],
    answer: "Gravidade"
  },
  {
    question: "Qual o nome do processo de transformação de larva em borboleta?",
    options: ["Reprodução", "Crescimento", "Metamorfose", "Germinação"],
    answer: "Metamorfose"
  },
  {
    question: "Qual o nome do oceano que banha a costa leste do Brasil?",
    options: ["Pacífico", "Índico", "Atlântico", "Ártico"],
    answer: "Atlântico"
  },
  {
    question: "Qual o nome da ciência que estuda o clima?",
    options: ["Geologia", "Meteorologia", "Biologia", "Oceanografia"],
    answer: "Meteorologia"
  },
  {
    question: "Qual o nome do aparelho que mede a temperatura?",
    options: ["Balança", "Termômetro", "Régua", "Cronômetro"],
    answer: "Termômetro"
  },
  {
    question: "Qual o nome da estrela mais próxima da Terra?",
    options: ["Lua", "Marte", "Sol", "Vênus"],
    answer: "Sol"
  },
  {
    question: "Qual o nome do continente que a Índia faz parte?",
    options: ["África", "Europa", "Ásia", "Oceania"],
    answer: "Ásia"
  },
  {
    question: "Qual o nome do processo de congelamento da água?",
    options: ["Evaporação", "Condensação", "Solidificação", "Fervura"],
    answer: "Solidificação"
  },
  {
    question: "Qual o nome do instrumento musical de sopro mais comum?",
    options: ["Violino", "Guitarra", "Flauta", "Piano"],
    answer: "Flauta"
  },
  {
    question: "Qual o nome do bioma caracterizado por grandes áreas de gramíneas?",
    options: ["Floresta tropical", "Deserto", "Savana", "Tundra"],
    answer: "Savana"
  },
  {
    question: "Qual o nome do maior felino do mundo?",
    options: ["Leopardo", "Puma", "Tigre", "Leão"],
    answer: "Tigre"
  },
  {
    question: "Qual o nome do cientista que descobriu a penicilina?",
    options: ["Louis Pasteur", "Alexander Fleming", "Marie Curie", "Charles Darwin"],
    answer: "Alexander Fleming"
  },
  {
    question: "Qual o nome do processo de formação de nuvens?",
    options: ["Evaporação", "Precipitação", "Condensação", "Sublimação"],
    answer: "Condensação"
  },
  {
    question: "Qual o nome da doença causada pela falta de vitamina C?",
    options: ["Raquitismo", "Anemia", "Escorbuto", "Cegueira noturna"],
    answer: "Escorbuto"
  },
  {
    question: "Qual o nome do esporte que se joga com raquete e peteca?",
    options: ["Tênis", "Badminton", "Squash", "Vôlei"],
    answer: "Badminton"
  },
  {
    question: "Qual o nome do mineral mais duro da escala de Mohs?",
    options: ["Quartzo", "Topázio", "Coríndon", "Diamante"],
    answer: "Diamante"
  },
  {
    question: "Qual o nome do maior lago de água doce do mundo?",
    options: ["Lago Superior", "Lago Vitória", "Mar Cáspio", "Lago Baikal"],
    answer: "Lago Superior"
  },
  {
    question: "Qual o nome do processo de digestão dos alimentos?",
    options: ["Respiração", "Absorção", "Fermentação", "Digestão"],
    answer: "Digestão"
  },
  {
    question: "Qual o nome da camada de ozônio?",
    options: ["Troposfera", "Estratosfera", "Mesosfera", "Termosfera"],
    answer: "Estratosfera"
  },
  {
    question: "Qual o nome do animal que é símbolo da Nova Zelândia?",
    options: ["Canguru", "Coala", "Kiwi", "Ovelha"],
    answer: "Kiwi"
  },
  {
    question: "Qual o nome da unidade de medida de distância utilizada na astronomia?",
    options: ["Quilômetro", "Milha", "Ano-luz", "Metro"],
    answer: "Ano-luz"
  },
  {
    question: "Qual o nome da teoria que explica a origem das espécies?",
    options: ["Teoria da Relatividade", "Teoria da Evolução", "Teoria do Big Bang", "Teoria do Caos"],
    answer: "Teoria da Evolução"
  },
  {
    question: "Qual o nome do principal pigmento verde das plantas?",
    options: ["Caroteno", "Antocianina", "Clorofila", "Xantofila"],
    answer: "Clorofila"
  },
  {
    question: "Qual o nome do maior réptil do mundo?",
    options: ["Cobra", "Jacaré", "Crocodilo", "Tartaruga"],
    answer: "Crocodilo"
  },
  {
    question: "Qual o nome do cientista que formulou a Lei da Conservação da Massa?",
    options: ["Antoine Lavoisier", "John Dalton", "Dmitri Mendeleev", "Ernest Rutherford"],
    answer: "Antoine Lavoisier"
  },
  {
    question: "Qual o nome do maior bioma brasileiro?",
    options: ["Cerrado", "Mata Atlântica", "Caatinga", "Amazônia"],
    answer: "Amazônia"
  },
  {
    question: "Qual o nome do instrumento que mede a pressão atmosférica?",
    options: ["Termômetro", "Anemômetro", "Barômetro", "Higrômetro"],
    answer: "Barômetro"
  },
  {
    question: "Qual o nome do satélite artificial que orbita a Terra?",
    options: ["Marte", "Estação Espacial Internacional", "Vênus", "Lua"],
    answer: "Estação Espacial Internacional"
  },
  {
    question: "Qual o nome da guerra que marcou o fim da Idade Média?",
    options: ["Guerra dos Cem Anos", "Guerra das Rosas", "Guerra de Tróia", "Guerra Civil Americana"],
    answer: "Guerra dos Cem Anos"
  },
  {
    question: "Qual o nome do maior vulcão do sistema solar?",
    options: ["Monte Olimpo (Marte)", "Mauna Loa (Terra)", "Etna (Terra)", "Vesúvio (Terra)"],
    answer: "Monte Olimpo (Marte)"
  },
  {
    question: "Qual o nome da vitamina que ajuda na coagulação do sangue?",
    options: ["Vitamina A", "Vitamina B", "Vitamina C", "Vitamina K"],
    answer: "Vitamina K"
  },
  {
    question: "Qual o nome do esporte que se joga com tacos e bolas em um campo?",
    options: ["Basquete", "Futebol", "Golfe", "Vôlei"],
    answer: "Golfe"
  },
  {
    question: "Qual o nome do animal marinho com oito braços?",
    options: ["Estrela do mar", "Lula", "Polvo", "Caranguejo"],
    answer: "Polvo"
  },
  {
    question: "Qual o nome do maior osso do corpo humano?",
    options: ["Tíbia", "Fêmur", "Rádio", "Úmero"],
    answer: "Fêmur"
  },
  {
    question: "Qual o nome da força que atrai objetos com carga elétrica oposta?",
    options: ["Gravitacional", "Magnética", "Elétrica", "Nuclear"],
    answer: "Elétrica"
  },
  {
    question: "Qual o nome do processo de transformação de gás em líquido?",
    options: ["Evaporação", "Condensação", "Solidificação", "Sublimação"],
    answer: "Condensação"
  },
  {
    question: "Qual o nome do período da história anterior à invenção da escrita?",
    options: ["Idade Antiga", "Idade Média", "Pré-História", "Idade Moderna"],
    answer: "Pré-História"
  },
  {
    question: "Qual o nome do processo pelo qual as plantas liberam vapor d'água?",
    options: ["Fotossíntese", "Respiração", "Transpiração", "Absorção"],
    answer: "Transpiração"
  },
  {
    question: "Qual o nome do maior felino da América?",
    options: ["Leopardo", "Puma", "Onça-pintada", "Guepardo"],
    answer: "Onça-pintada"
  },
  {
    question: "Qual o nome da capital da Argentina?",
    options: ["Santiago", "Montevidéu", "Buenos Aires", "Lima"],
    answer: "Buenos Aires"
  },
  {
    question: "Qual o nome do gás mais leve?",
    options: ["Oxigênio", "Nitrogênio", "Hidrogênio", "Hélio"],
    answer: "Hidrogênio"
  },
  {
    question: "Qual o nome do processo de formação das estações do ano?",
    options: ["Rotação da Terra", "Translação da Terra", "Órbita da Lua", "Movimento das marés"],
    answer: "Translação da Terra"
  },
  {
    question: "Qual o nome do conjunto de todos os ecossistemas da Terra?",
    options: ["Bioma", "Ecossistema", "Biosfera", "Habitat"],
    answer: "Biosfera"
  },
  {
    question: "Qual o nome do cientista que descobriu a teoria da relatividade?",
    options: ["Isaac Newton", "Albert Einstein", "Marie Curie", "Stephen Hawking"],
    answer: "Albert Einstein"
  },
  {
    question: "Qual o nome do instrumento que mede a intensidade de terremotos?",
    options: ["Termômetro", "Barômetro", "Sismógrafo", "Anemômetro"],
    answer: "Sismógrafo"
  },
  {
    question: "Qual o nome da energia gerada pelo calor do interior da Terra?",
    options: ["Solar", "Eólica", "Geotérmica", "Hidrelétrica"],
    answer: "Geotérmica"
  },
  {
    question: "Qual o nome do maior inseto do mundo?",
    options: ["Joaninha", "Louva-a-deus", "Besouro-golias", "Mariposa"],
    answer: "Besouro-golias"
  },
  {
    question: "Qual o nome do processo de purificação da água por aquecimento e resfriamento?",
    options: ["Filtração", "Cloração", "Destilação", "Osmose"],
    answer: "Destilação"
  },
  {
    question: "Qual o nome da vitamina que ajuda na visão?",
    options: ["Vitamina B", "Vitamina C", "Vitamina D", "Vitamina A"],
    answer: "Vitamina A"
  },
  {
    question: "Qual o nome do esporte que se joga com um disco e bastões no gelo?",
    options: ["Patinagem no gelo", "Curling", "Hóquei no gelo", "Bobsled"],
    answer: "Hóquei no gelo"
  },
  {
    question: "Qual o nome do metal mais maleável?",
    options: ["Ferro", "Cobre", "Ouro", "Alumínio"],
    answer: "Ouro"
  },
  {
    question: "Qual o nome do maior animal da Terra em comprimento?",
    options: ["Baleia azul", "Cobra píton", "Lula colosso", "Medusa-juba-de-leão"],
    answer: "Medusa-juba-de-leão"
  },
  {
    question: "Qual o nome do processo de formação de chuvas ácidas?",
    options: ["Poluição do ar", "Aquecimento global", "Desmatamento", "Erosão"],
    answer: "Poluição do ar"
  },
  {
    question: "Qual o nome da ave que não voa e é o símbolo da Nova Zelândia?",
    options: ["Canguru", "Coala", "Kiwi", "Emu"],
    answer: "Kiwi"
  },
  {
    question: "Qual o nome do processo de transformação de luz em energia elétrica?",
    options: ["Termelétrica", "Hidrelétrica", "Solar fotovoltaica", "Eólica"],
    answer: "Solar fotovoltaica"
  },
  {
    question: "Qual o nome do cientista que descobriu o nêutron?",
    options: ["Ernest Rutherford", "Niels Bohr", "James Chadwick", "J.J. Thomson"],
    answer: "James Chadwick"
  },
  {
    question: "Qual o nome do menor planeta do nosso sistema solar?",
    options: ["Marte", "Vênus", "Mercúrio", "Netuno"],
    answer: "Mercúrio"
  },
  {
    question: "Qual o nome do processo de envelhecimento das rochas?",
    options: ["Erosão", "Intemperismo", "Sedimentação", "Metamorfismo"],
    answer: "Intemperismo"
  },
  {
    question: "Qual o nome da substância que dá a cor vermelha ao sangue?",
    options: ["Plasma", "Plaquetas", "Glóbulos brancos", "Hemoglobina"],
    answer: "Hemoglobina"
  },
  {
    question: "Qual o nome do maior vulcão do Japão?",
    options: ["Mauna Loa", "Etna", "Vesúvio", "Monte Fuji"],
    answer: "Monte Fuji"
  },
  {
    question: "Qual o nome do processo de formação de rochas sedimentares?",
    options: ["Vulcanismo", "Metamorfismo", "Erosão", "Sedimentação"],
    answer: "Sedimentação"
  },
  {
    question: "Qual o nome do sistema responsável pela coordenação do corpo?",
    options: ["Digestório", "Respiratório", "Circulatório", "Nervoso"],
    answer: "Nervoso"
  },
  {
    question: "Qual o nome do processo de congelamento rápido de alimentos para conservação?",
    options: ["Desidratação", "Fermentação", "Liofilização", "Pasteurização"],
    answer: "Liofilização"
  },
  {
    question: "Qual o nome do animal que é o mais venenoso do mundo?",
    options: ["Cobra-rei", "Aranha-marrom", "Água-viva caixa", "Escorpião-amarelo"],
    answer: "Água-viva caixa"
  },
  {
    question: "Qual o nome da força que nos impede de afundar em um líquido?",
    options: ["Gravidade", "Empuxo", "Atrito", "Tensão superficial"],
    answer: "Empuxo"
  },
  {
    question: "Qual o nome do fenômeno natural que causa tsunamis?",
    options: ["Furacão", "Terremoto submarino", "Erupção vulcânica", "Tufão"],
    answer: "Terremoto submarino"
  },
  {
    question: "Qual o nome do elemento químico mais abundante no universo?",
    options: ["Oxigênio", "Carbono", "Hidrogênio", "Hélio"],
    answer: "Hidrogênio"
  },
  {
    question: "Qual o nome da célula responsável pela defesa do organismo?",
    options: ["Glóbulo vermelho", "Glóbulo branco", "Plaqueta", "Neurônio"],
    answer: "Glóbulo branco"
  },
  {
    question: "Qual o nome do tipo de energia renovável gerada pelo vento?",
    options: ["Solar", "Hidrelétrica", "Eólica", "Geotérmica"],
    answer: "Eólica"
  },
  {
    question: "Qual o nome do processo de transformação de gás em sólido sem passar por líquido?",
    options: ["Evaporação", "Condensação", "Sublimação", "Solidificação"],
    answer: "Sublimação"
  },
  {
    question: "Qual o nome do cientista que formulou a Lei da Conservação da Energia?",
    options: ["Albert Einstein", "Isaac Newton", "James Prescott Joule", "Galileu Galilei"],
    answer: "James Prescott Joule"
  },
  {
    question: "Qual o nome da maior floresta tropical do mundo?",
    options: ["Mata Atlântica", "Floresta Amazônica", "Floresta do Congo", "Floresta Boreal"],
    answer: "Floresta Amazônica"
  },
  {
    question: "Qual o nome do instrumento que mede a umidade do ar?",
    options: ["Termômetro", "Barômetro", "Higrômetro", "Anemômetro"],
    answer: "Higrômetro"
  },
  {
    question: "Qual o nome do maior deserto de sal do mundo?",
    options: ["Deserto do Saara", "Salar de Uyuni", "Deserto do Atacama", "Grande Deserto de Areia"],
    answer: "Salar de Uyuni"
  },
  {
    question: "Qual o nome do processo de união de duas células reprodutoras?",
    options: ["Mitose", "Meiose", "Fecundação", "Germinação"],
    answer: "Fecundação"
  },
  {
    question: "Qual o nome da ave que é símbolo da paz?",
    options: ["Águia", "Coruja", "Pomba", "Pardal"],
    answer: "Pomba"
  },
  {
    question: "Qual o nome do metal líquido à temperatura ambiente?",
    options: ["Ferro", "Alumínio", "Mercúrio", "Chumbo"],
    answer: "Mercúrio"
  },
  {
    question: "Qual o nome do processo de transformação de um sólido em líquido?",
    options: ["Solidificação", "Evaporação", "Fusão", "Sublimação"],
    answer: "Fusão"
  },
  {
    question: "Qual o nome da unidade de medida de frequência?",
    options: ["Watt", "Hertz", "Volt", "Ampere"],
    answer: "Hertz"
  },
  {
    question: "Qual o nome do maior porto do Brasil?",
    options: ["Porto de Santos", "Porto do Rio de Janeiro", "Porto de Paranaguá", "Porto de Vitória"],
    answer: "Porto de Santos"
  },
  {
    question: "Qual o nome do cientista que desenvolveu a teoria do Big Bang?",
    options: ["Albert Einstein", "Stephen Hawking", "Georges Lemaître", "Edwin Hubble"],
    answer: "Georges Lemaître"
  },
  {
    question: "Qual o nome do animal que é o mais lento do mundo?",
    options: ["Tartaruga", "Lesma", "Preguiça", "Caracol"],
    answer: "Preguiça"
  },
  {
    question: "Qual o nome da arte marcial japonesa que significa 'caminho suave'?",
    options: ["Karatê", "Judô", "Taekwondo", "Jiu-Jitsu"],
    answer: "Judô"
  },
  {
    question: "Qual o nome do maior vulcão ativo da Europa?",
    options: ["Vesúvio", "Etna", "Stromboli", "Teide"],
    answer: "Etna"
  },
  {
    question: "Qual o nome da vitamina essencial para a formação dos ossos e dentes?",
    options: ["Vitamina A", "Vitamina C", "Vitamina D", "Vitamina E"],
    answer: "Vitamina D"
  },
  {
    question: "Qual o nome do esporte que se joga com bola e um cesto?",
    options: ["Futebol", "Vôlei", "Basquete", "Handebol"],
    answer: "Basquete"
  },
  {
    question: "Qual o nome do metal que enferruja com facilidade?",
    options: ["Alumínio", "Cobre", "Ferro", "Ouro"],
    answer: "Ferro"
  },
  {
    question: "Qual o nome do processo de transformação de líquido em sólido?",
    options: ["Evaporação", "Condensação", "Solidificação", "Fusão"],
    answer: "Solidificação"
  },
  {
    question: "Qual o nome do principal componente do vidro?",
    options: ["Carbonato de cálcio", "Cloreto de sódio", "Dióxido de silício", "Óxido de alumínio"],
    answer: "Dióxido de silício"
  },
  {
    question: "Qual o nome do maior arquipélago do mundo?",
    options: ["Japão", "Indonésia", "Filipinas", "Caribe"],
    answer: "Indonésia"
  },
  {
    question: "Qual o nome do processo de formação de petróleo?",
    options: ["Vulcanismo", "Decomposição de matéria orgânica", "Erosão", "Sedimentação"],
    answer: "Decomposição de matéria orgânica"
  },
  {
    question: "Qual o nome do sistema responsável pela respiração?",
    options: ["Digestório", "Circulatório", "Respiratório", "Nervoso"],
    answer: "Respiratório"
  },
  {
    question: "Qual o nome da doença causada pela falta de iodo?",
    options: ["Anemia", "Escorbuto", "Bócio", "Raquitismo"],
    answer: "Bócio"
  },
  {
    question: "Qual o nome do esporte que se joga com bola e rede, sem deixá-la cair?",
    options: ["Basquete", "Futebol", "Vôlei", "Tênis"],
    answer: "Vôlei"
  },
  {
    question: "Qual o nome do maior deserto arenoso do mundo?",
    options: ["Deserto do Saara", "Deserto do Atacama", "Gobi", "Kalahari"],
    answer: "Deserto do Saara"
  },
  {
    question: "Qual o nome da unidade de medida de força?",
    options: ["Joule", "Watt", "Newton", "Pascal"],
    answer: "Newton"
  },
  {
    question: "Qual o nome do maior oceano do mundo em extensão?",
    options: ["Atlântico", "Índico", "Ártico", "Pacífico"],
    answer: "Pacífico"
  },
  {
    question: "Qual o nome do processo de transformação de energia solar em elétrica por painéis?",
    options: ["Termelétrica", "Hidrelétrica", "Solar fotovoltaica", "Eólica"],
    answer: "Solar fotovoltaica"
  },
  {
    question: "Qual o nome do cientista que descobriu a estrutura do DNA?",
    options: ["Louis Pasteur", "Charles Darwin", "James Watson e Francis Crick", "Gregor Mendel"],
    answer: "James Watson e Francis Crick"
  },
  {
    question: "Qual o nome do menor estado do Brasil?",
    options: ["Sergipe", "Alagoas", "Espírito Santo", "Rio de Janeiro"],
    answer: "Sergipe"
  },
  {
    question: "Qual o nome do processo de formação de montanhas?",
    options: ["Erosão", "Intemperismo", "Dobramento e falhamento de placas tectônicas", "Vulcanismo"],
    answer: "Dobramento e falhamento de placas tectônicas"
  },
  {
    question: "Qual o nome da camada mais externa da Terra?",
    options: ["Manto", "Núcleo externo", "Núcleo interno", "Crosta"],
    answer: "Crosta"
  },
  {
    question: "Qual o nome do animal que tem o maior cérebro em relação ao corpo?",
    options: ["Elefante", "Golfinho", "Ser humano", "Baleia"],
    answer: "Ser humano"
  },
  {
    question: "Qual o nome do fenômeno natural que causa ventos fortes e rotação?",
    options: ["Terremoto", "Tsunami", "Tufão", "Furacão"],
    answer: "Furacão"
  },
  {
    question: "Qual o nome do elemento químico que é a base da vida?",
    options: ["Oxigênio", "Nitrogênio", "Hidrogênio", "Carbono"],
    answer: "Carbono"
  },
  {
    question: "Qual o nome da célula responsável pela transmissão de informações no sistema nervoso?",
    options: ["Glóbulo vermelho", "Glóbulo branco", "Neurônio", "Plaqueta"],
    answer: "Neurônio"
  },
  {
    question: "Qual o nome do maior desfiladeiro do mundo?",
    options: ["Cânion do Colorado", "Grand Canyon (EUA)", "Vale do Rift", "Garganta de Viko"],
    answer: "Grand Canyon (EUA)"
  },
  {
    question: "Qual o nome do processo de produção de alimentos por leveduras?",
    options: ["Digestão", "Respiração", "Fermentação", "Fotossíntese"],
    answer: "Fermentação"
  },
  {
    question: "Qual o nome da vitamina que ajuda na absorção de cálcio?",
    options: ["Vitamina A", "Vitamina B", "Vitamina C", "Vitamina D"],
    answer: "Vitamina D"
  },
  {
    question: "Qual o nome do esporte que se joga com uma bola oval?",
    options: ["Futebol", "Basquete", "Rugby", "Vôlei"],
    answer: "Rugby"
  },
  {
    question: "Qual o nome do metal mais condutor de eletricidade?",
    options: ["Alumínio", "Ferro", "Cobre", "Ouro"],
    answer: "Cobre"
  },
  {
    question: "Qual o nome do processo de transformação de líquido em gás?",
    options: ["Solidificação", "Condensação", "Evaporação", "Fusão"],
    answer: "Evaporação"
  },
  {
    question: "Qual o nome do principal componente da atmosfera terrestre?",
    options: ["Oxigênio", "Dióxido de Carbono", "Nitrogênio", "Argônio"],
    answer: "Nitrogênio"
  },
  {
    question: "Qual o nome do maior lago do Brasil?",
    options: ["Lagoa dos Patos", "Lago Paranoá", "Lagoa Rodrigo de Freitas", "Lago Titicaca"],
    answer: "Lagoa dos Patos"
  },
  {
    question: "Qual o nome do processo de formação de diamantes?",
    options: ["Sedimentação", "Vulcanismo", "Altas pressões e temperaturas", "Erosão"],
    answer: "Altas pressões e temperaturas"
  },
  {
    question: "Qual o nome do sistema responsável pelo transporte de nutrientes?",
    options: ["Digestório", "Respiratório", "Circulatório", "Nervoso"],
    answer: "Circulatório"
  },
  {
    question: "Qual o nome da doença causada pela falta de ferro?",
    options: ["Escorbuto", "Bócio", "Anemia", "Raquitismo"],
    answer: "Anemia"
  },
  {
    question: "Qual o nome do esporte que se joga com bolas e pinos?",
    options: ["Tênis", "Golfe", "Boliche", "Críquete"],
    answer: "Boliche"
  },
  {
    question: "Qual o nome do maior rio do mundo em extensão?",
    options: ["Amazonas", "Nilo", "Yangtzé", "Mississippi"],
    answer: "Nilo"
  },
  {
    question: "Qual o nome do processo de transformação de luz em energia térmica?",
    options: ["Solar fotovoltaica", "Solar térmica", "Eólica", "Hidrelétrica"],
    answer: "Solar térmica"
  },
  {
    question: "Qual o nome do cientista que descobriu a gravidade?",
    options: ["Albert Einstein", "Isaac Newton", "Galileu Galilei", "Stephen Hawking"],
    answer: "Isaac Newton"
  },
  {
    question: "Qual o nome do maior país da América do Sul em área?",
    options: ["Argentina", "Peru", "Chile", "Brasil"],
    answer: "Brasil"
  },
  {
    question: "Qual o nome do processo de formação de cavernas?",
    options: ["Erosão e dissolução de rochas", "Vulcanismo", "Sedimentação", "Intemperismo"],
    answer: "Erosão e dissolução de rochas"
  },
  {
    question: "Qual o nome da camada de gelo que cobre os polos?",
    options: ["Glaciar", "Iceberg", "Calota polar", "Permafrost"],
    answer: "Calota polar"
  },
  {
    question: "Qual o nome do animal que é o rei da selva?",
    options: ["Tigre", "Leão", "Guepardo", "Lobo"],
    answer: "Leão"
  },
  {
    question: "Qual o nome do fenômeno natural que causa nevascas?",
    options: ["Chuva", "Gelo", "Vento", "Neve"],
    answer: "Neve"
  },
  {
    question: "Qual o nome do elemento químico que compõe a maior parte do Sol?",
    options: ["Hélio", "Oxigênio", "Hidrogênio", "Ferro"],
    answer: "Hidrogênio"
  },
  {
    question: "Qual o nome da célula responsável pela coagulação do sangue?",
    options: ["Glóbulo vermelho", "Glóbulo branco", "Plaqueta", "Neurônio"],
    answer: "Plaqueta"
  },
  {
    question: "Qual o nome do tipo de energia renovável gerada pelas marés?",
    options: ["Solar", "Eólica", "Geotérmica", "Ondomotriz"],
    answer: "Ondomotriz"
  },
  {
    question: "Qual o nome do processo de transformação de sólido em gás sem passar por líquido?",
    options: ["Solidificação", "Condensação", "Sublimação", "Fusão"],
    answer: "Sublimação"
  },
  {
    question: "Qual o nome do cientista que descobriu a fissão nuclear?",
    options: ["Albert Einstein", "Marie Curie", "Otto Hahn", "Ernest Rutherford"],
    answer: "Otto Hahn"
  },
  {
    question: "Qual o nome do maior aquário do mundo?",
    options: ["Aquário de Gênova", "Aquário de Dubai", "Aquário da Geórgia", "Oceanário de Lisboa"],
    answer: "Aquário da Geórgia"
  },
  {
    question: "Qual o nome do processo de formação de fósseis?",
    options: ["Erosão", "Intemperismo", "Mineralização de restos orgânicos", "Sedimentação"],
    answer: "Mineralização de restos orgânicos"
  },
  {
    question: "Qual o nome da camada da Terra onde ocorrem os fenômenos climáticos?",
    options: ["Estratosfera", "Mesosfera", "Termosfera", "Troposfera"],
    answer: "Troposfera"
  },
  {
    question: "Qual o nome do animal que é o mais forte em relação ao seu tamanho?",
    options: ["Elefante", "Gorila", "Besouro-rinoceronte", "Formiga"],
    answer: "Besouro-rinoceronte"
  },
  {
    question: "Qual o nome do fenômeno natural que causa ressecamento do solo?",
    options: ["Enchente", "Seca", "Vendaval", "Terremoto"],
    answer: "Seca"
  },
  {
    question: "Qual o nome do elemento químico presente em todos os seres vivos?",
    options: ["Oxigênio", "Nitrogênio", "Hidrogênio", "Carbono"],
    answer: "Carbono"
  },
  {
    question: "Qual o nome da célula responsável pelo transporte de oxigênio?",
    options: ["Glóbulo branco", "Plaqueta", "Neurônio", "Glóbulo vermelho"],
    answer: "Glóbulo vermelho"
  },
  {
    question: "Qual o nome do tipo de energia renovável gerada pelo calor do Sol?",
    options: ["Hidrelétrica", "Eólica", "Solar", "Geotérmica"],
    answer: "Solar"
  },
  {
    question: "Qual o nome do processo de separação de misturas por aquecimento e resfriamento?",
    options: ["Filtração", "Decantação", "Destilação", "Centrifugação"],
    answer: "Destilação"
  },
  {
    question: "Qual o nome da vitamina que previne o raquitismo?",
    options: ["Vitamina A", "Vitamina B", "Vitamina C", "Vitamina D"],
    answer: "Vitamina D"
  },
  {
    question: "Qual o nome do esporte que se joga com bolas coloridas e um taco em uma mesa?",
    options: ["Golfe", "Boliche", "Sinuca", "Críquete"],
    answer: "Sinuca"
  },
  {
    question: "Qual o nome do metal mais resistente à corrosão?",
    options: ["Ferro", "Alumínio", "Ouro", "Cobre"],
    answer: "Ouro"
  },
  {
    question: "Qual o nome do processo de transformação de gás em plasma?",
    options: ["Ionização", "Condensação", "Solidificação", "Evaporação"],
    answer: "Ionização"
  },
  {
    question: "Qual o nome do principal componente do mármore?",
    options: ["Dióxido de silício", "Carbonato de cálcio", "Óxido de alumínio", "Sulfato de cálcio"],
    answer: "Carbonato de cálcio"
  },
  {
    question: "Qual o nome do maior vulcão extinto do mundo?",
    options: ["Monte Fuji", "Vesúvio", "Monte Kilimanjaro", "Mauna Kea"],
    answer: "Monte Kilimanjaro"
  },
  {
    question: "Qual o nome do processo de formação de ilhas vulcânicas?",
    options: ["Erosão", "Movimento de placas tectônicas", "Acúmulo de sedimentos", "Intemperismo"],
    answer: "Movimento de placas tectônicas"
  },
  {
    question: "Qual o nome do sistema responsável pela reprodução?",
    options: ["Digestório", "Respiratório", "Circulatório", "Reprodutor"],
    answer: "Reprodutor"
  },
  {
    question: "Qual o nome da doença causada pela falta de vitamina A?",
    options: ["Escorbuto", "Cegueira noturna", "Raquitismo", "Anemia"],
    answer: "Cegueira noturna"
  },
  {
    question: "Qual o nome do esporte que se joga com cavalo e bola?",
    options: ["Hipismo", "Polo", "Corrida de cavalos", "Rodeio"],
    answer: "Polo"
  },
  {
    question: "Qual o nome do maior animal terrestre em altura?",
    options: ["Elefante", "Girafa", "Rinoceronte", "Camelo"],
    answer: "Girafa"
  },
  {
    question: "Qual o nome do processo de transformação de energia química em elétrica em uma bateria?",
    options: ["Combustão", "Eletrólise", "Reação eletroquímica", "Fissão nuclear"],
    answer: "Reação eletroquímica"
  },
  {
    question: "Qual o nome do cientista que descobriu o elétron?",
    options: ["Ernest Rutherford", "Niels Bohr", "J.J. Thomson", "James Chadwick"],
    answer: "J.J. Thomson"
  },
  {
    question: "Qual o nome do maior oceano do mundo em profundidade?",
    options: ["Atlântico", "Índico", "Ártico", "Pacífico"],
    answer: "Pacífico"
  },
  {
    question: "Qual o nome do processo de formação de tornados?",
    options: ["Ventos fortes", "Tempestades severas com correntes de ar ascendentes e descendentes", "Terremotos", "Erupções vulcânicas"],
    answer: "Tempestades severas com correntes de ar ascendentes e descendentes"
  },
  {
    question: "Qual o nome da camada da Terra onde se forma a aurora boreal?",
    options: ["Troposfera", "Estratosfera", "Mesosfera", "Termosfera"],
    answer: "Termosfera"
  },
  {
    question: "Qual o nome do animal que é o maior predador terrestre?",
    options: ["Leão", "Tigre", "Urso polar", "Crocodilo"],
    answer: "Urso polar"
  },
  {
    question: "Qual o nome do fenômeno natural que causa inundações?",
    options: ["Seca", "Vendaval", "Chuva intensa", "Terremoto"],
    answer: "Chuva intensa"
  },
  {
    question: "Qual o nome do elemento químico presente em maior quantidade no corpo humano?",
    options: ["Carbono", "Hidrogênio", "Oxigênio", "Nitrogênio"],
    answer: "Oxigênio"
  },
  {
    question: "Qual o nome da célula responsável pela formação dos ossos?",
    options: ["Condrócito", "Osteoblasto", "Miócito", "Adipócito"],
    answer: "Osteoblasto"
  },
  {
    question: "Qual o nome do tipo de energia renovável gerada a partir da biomassa?",
    options: ["Solar", "Eólica", "Hidrelétrica", "Biomassa"],
    answer: "Biomassa"
  },
  {
    question: "Qual o nome do processo de tratamento de esgoto para remover impurezas?",
    options: ["Filtração", "Cloração", "Decantação", "Estação de tratamento de esgoto"],
    answer: "Estação de tratamento de esgoto"
  },
  {
    question: "Qual o nome da vitamina que fortalece o sistema imunológico?",
    options: ["Vitamina A", "Vitamina B", "Vitamina C", "Vitamina E"],
    answer: "Vitamina C"
  },
  {
    question: "Qual o nome do esporte que se joga com uma rede e uma bola que não pode cair no chão do próprio campo?",
    options: ["Basquete", "Futebol", "Vôlei", "Handebol"],
    answer: "Vôlei"
  },
  {
    question: "Qual o nome do metal mais leve?",
    options: ["Ferro", "Alumínio", "Titânio", "Chumbo"],
    answer: "Alumínio"
  },
  {
    question: "Qual o nome do processo de transformação de plasma em gás?",
    options: ["Ionização", "Recombinação", "Condensação", "Solidificação"],
    answer: "Recombinação"
  },
  {
    question: "Qual o nome do principal componente do calcário?",
    options: ["Dióxido de silício", "Carbonato de cálcio", "Óxido de alumínio", "Sulfato de cálcio"],
    answer: "Carbonato de cálcio"
  },
  {
    question: "Qual o nome do maior vulcão ativo no mundo em área da base?",
    options: ["Mauna Loa", "Etna", "Vesúvio", "Monte Fuji"],
    answer: "Mauna Loa"
  },
  {
    question: "Qual o nome do processo de formação de rochas magmáticas?",
    options: ["Erosão", "Sedimentação", "Cristalização de magma", "Metamorfismo"],
    answer: "Cristalização de magma"
  },
  {
    question: "Qual o nome do sistema responsável pela excreção de resíduos?",
    options: ["Digestório", "Respiratório", "Circulatório", "Excretor"],
    answer: "Excretor"
  },
  {
    question: "Qual o nome da doença causada pela falta de vitamina B1?",
    options: ["Escorbuto", "Beribéri", "Raquitismo", "Anemia"],
    answer: "Beribéri"
  },
  {
    question: "Qual o nome do esporte que se joga com uma bola e um bastão em um campo com bases?",
    options: ["Futebol", "Basquete", "Beisebol", "Hóquei"],
    answer: "Beisebol"
  },
  {
    question: "Qual o nome do maior oceano do mundo em temperatura média?",
    options: ["Pacífico", "Atlântico", "Índico", "Ártico"],
    answer: "Índico"
  },
  {
    question: "Qual o nome do processo de transformação de energia potencial em cinética?",
    options: ["Combustão", "Fissão nuclear", "Queda de um objeto", "Fotossíntese"],
    answer: "Queda de um objeto"
  },
  {
    question: "Qual o nome do cientista que formulou as leis da hereditariedade?",
    options: ["Charles Darwin", "Gregor Mendel", "Louis Pasteur", "Marie Curie"],
    answer: "Gregor Mendel"
  },
  {
    question: "Qual o nome do maior estado do Brasil em área?",
    options: ["Minas Gerais", "Bahia", "Pará", "Amazonas"],
    answer: "Amazonas"
  },
  {
    question: "Qual o nome do processo de formação de ventos?",
    options: ["Diferença de pressão atmosférica", "Movimento de placas tectônicas", "Erupções vulcânicas", "Marés"],
    answer: "Diferença de pressão atmosférica"
  },
  {
    question: "Qual o nome da camada da Terra onde ocorrem as estrelas cadentes?",
    options: ["Troposfera", "Estratosfera", "Mesosfera", "Termosfera"],
    answer: "Mesosfera"
  },
  {
    question: "Qual o nome do animal que é o mais inteligente?",
    options: ["Macaco", "Cão", "Golfinho", "Polvo"],
    answer: "Golfinho"
  },
  {
    question: "Qual o nome do fenômeno natural que causa deslizamentos de terra?",
    options: ["Seca", "Inundação", "Chuva intensa em encostas", "Terremoto"],
    answer: "Chuva intensa em encostas"
  },
  {
    question: "Qual o nome do elemento químico usado em lâmpadas fluorescentes?",
    options: ["Oxigênio", "Nitrogênio", "Argônio", "Hélio"],
    answer: "Argônio"
  },
  {
    question: "Qual o nome da célula responsável pela contração muscular?",
    options: ["Neurônio", "Glóbulo vermelho", "Miócito", "Osteoblasto"],
    answer: "Miócito"
  },
  {
    question: "Qual o nome do tipo de energia renovável gerada a partir da água?",
    options: ["Solar", "Eólica", "Hidrelétrica", "Geotérmica"],
    answer: "Hidrelétrica"
  },
  {
    question: "Qual o nome do processo de separação de misturas por densidade?",
    options: ["Filtração", "Decantação", "Destilação", "Centrifugação"],
    answer: "Decantação"
  },
  {
    question: "Qual o nome da vitamina que previne o escorbuto?",
    options: ["Vitamina A", "Vitamina B", "Vitamina C", "Vitamina D"],
    answer: "Vitamina C"
  },
  {
    question: "Qual o nome do esporte que se joga com um bastão e uma bola, com o objetivo de acertar bases?",
    options: ["Futebol", "Basquete", "Beisebol", "Hóquei"],
    answer: "Beisebol"
  },
  {
    question: "Qual o nome do metal usado em fios elétricos?",
    options: ["Ferro", "Alumínio", "Cobre", "Ouro"],
    answer: "Cobre"
  },
  {
    question: "Qual o nome do processo de transformação de sólido em plasma?",
    options: ["Sublimação", "Fusão", "Ionização", "Vaporização"],
    answer: "Ionização"
  },
  {
    question: "Qual o nome do principal componente do granito?",
    options: ["Carbonato de cálcio", "Dióxido de silício", "Feldspato e quartzo", "Óxido de alumínio"],
    answer: "Feldspato e quartzo"
  },
  {
    question: "Qual o nome do maior vulcão em escudo do mundo?",
    options: ["Mauna Loa", "Etna", "Vesúvio", "Monte Fuji"],
    answer: "Mauna Loa"
  },
  {
    question: "Qual o nome do processo de formação de dunas?",
    options: ["Erosão pelo vento", "Deposição de sedimentos pelo vento", "Atividade vulcânica", "Movimento de placas tectônicas"],
    answer: "Deposição de sedimentos pelo vento"
  },
  {
    question: "Qual o nome do sistema responsável pela defesa do organismo contra doenças?",
    options: ["Digestório", "Respiratório", "Circulatório", "Imunológico"],
    answer: "Imunológico"
  },
  {
    question: "Qual o nome da doença causada pela falta de vitamina D?",
    options: ["Escorbuto", "Beribéri", "Raquitismo", "Anemia"],
    answer: "Raquitismo"
  },
  {
    question: "Qual o nome do esporte que se joga com um disco e bastões em um campo de grama?",
    options: ["Hóquei no gelo", "Golfe", "Hóquei sobre grama", "Críquete"],
    answer: "Hóquei sobre grama"
  },
  {
    question: "Qual o nome do maior oceano do mundo em biodiversidade?",
    options: ["Atlântico", "Índico", "Pacífico", "Ártico"],
    answer: "Pacífico"
  },
  {
    question: "Qual o nome do processo de transformação de energia eólica em elétrica?",
    options: ["Termelétrica", "Hidrelétrica", "Eólica", "Solar fotovoltaica"],
    answer: "Eólica"
  },
  {
    question: "Qual o nome do cientista que descobriu a radioatividade?",
    options: ["Albert Einstein", "Marie Curie", "Ernest Rutherford", "Henri Becquerel"],
    answer: "Henri Becquerel"
  },
  {
    question: "Qual o nome do maior país da África em área?",
    options: ["Egito", "Nigéria", "Argélia", "Sudão"],
    answer: "Argélia"
  },
  {
    question: "Qual o nome do processo de formação de geleiras?",
    options: ["Congelamento de água do mar", "Acúmulo e compactação de neve", "Chuvas intensas", "Movimento de placas tectônicas"],
    answer: "Acúmulo e compactação de neve"
  },
  {
    question: "Qual o nome da camada da Terra que protege contra a radiação solar?",
    options: ["Troposfera", "Estratosfera (camada de ozônio)", "Mesosfera", "Termosfera"],
    answer: "Estratosfera (camada de ozônio)"
  },
  {
    question: "Qual o nome do animal que tem o maior tempo de gestação?",
    options: ["Elefante", "Baleia", "Rinoceronte", "Girafa"],
    answer: "Elefante"
  },
  {
    question: "Qual o nome do fenômeno natural que causa secas?",
    options: ["Chuvas intensas", "Falta de chuva por longo período", "Inundações", "Terremotos"],
    answer: "Falta de chuva por longo período"
  },
  {
    question: "Qual o nome do elemento químico mais pesado encontrado na natureza?",
    options: ["Ferro", "Chumbo", "Urânio", "Plutônio"],
    answer: "Urânio"
  },
  {
    question: "Qual o nome da célula responsável pela transmissão de características hereditárias?",
    options: ["Glóbulo vermelho", "Neurônio", "Gameta", "Plaqueta"],
    answer: "Gameta"
  },
  {
    question: "Qual o nome do tipo de energia renovável gerada a partir do calor interno da Terra?",
    options: ["Solar", "Eólica", "Hidrelétrica", "Geotérmica"],
    answer: "Geotérmica"
  },
  {
    question: "Qual o nome do processo de separação de misturas por diferença de ponto de ebulição?",
    options: ["Filtração", "Decantação", "Destilação fracionada", "Centrifugação"],
    answer: "Destilação fracionada"
  },
  {
    question: "Qual o nome da vitamina que atua como antioxidante?",
    options: ["Vitamina A", "Vitamina B", "Vitamina C", "Vitamina E"],
    answer: "Vitamina E"
  },
  {
    question: "Qual o nome do esporte que se joga com um bastão e uma bola pequena, com o objetivo de rebater a bola o mais longe possível?",
    options: ["Beisebol", "Golfe", "Críquete", "Hóquei"],
    answer: "Críquete"
  },
  {
    question: "Qual o nome do metal usado em baterias de carro?",
    options: ["Ferro", "Alumínio", "Chumbo", "Cobre"],
    answer: "Chumbo"
  },
  {
    question: "Qual o nome do processo de transformação de gás em sólido?",
    options: ["Evaporação", "Condensação", "Solidificação", "Sublimação"],
    answer: "Solidificação"
  },
  {
    question: "Qual o nome do principal componente do sal de cozinha?",
    options: ["Dióxido de silício", "Carbonato de cálcio", "Cloreto de sódio", "Sulfato de cálcio"],
    answer: "Cloreto de sódio"
  },
  {
    question: "Qual o nome do maior arquipélago do Brasil?",
    options: ["Fernando de Noronha", "Abrolhos", "Ilha Grande", "Arquipélago de São Pedro e São Paulo"],
    answer: "Fernando de Noronha"
  },
  {
    question: "Qual o nome do processo de formação de petróleo e gás natural?",
    options: ["Vulcanismo", "Decomposição de matéria orgânica em condições de alta pressão e temperatura", "Erosão", "Sedimentação"],
    answer: "Decomposição de matéria orgânica em condições de alta pressão e temperatura"
  },
  {
    question: "Qual o nome do sistema responsável pela locomoção?",
    options: ["Digestório", "Respiratório", "Circulatório", "Esquelético e muscular"],
    answer: "Esquelético e muscular"
  },
  {
    question: "Qual o nome da doença causada pela falta de vitamina B3 (Niacina)?",
    options: ["Escorbuto", "Beribéri", "Pellagra", "Anemia"],
    answer: "Pellagra"
  },
  {
    question: "Qual o nome do esporte que se joga com um disco e uma cesta, jogando o disco em direção à cesta?",
    options: ["Futebol Americano", "Basquete", "Frisbee Golfe", "Hóquei"],
    answer: "Frisbee Golfe"
  },
  {
    question: "Qual o nome do maior oceano do mundo em área?",
    options: ["Atlântico", "Índico", "Pacífico", "Ártico"],
    answer: "Pacífico"
  },
  {
    question: "Qual o nome do processo de transformação de energia luminosa em elétrica?",
    options: ["Solar fotovoltaica", "Solar térmica", "Eólica", "Hidrelétrica"],
    answer: "Solar fotovoltaica"
  },
  {
    question: "Qual o nome do cientista que descobriu a penicilina?",
    options: ["Louis Pasteur", "Alexander Fleming", "Marie Curie", "Charles Darwin"],
    answer: "Alexander Fleming"
  },
  {
    question: "Qual o nome do maior país da América do Norte em área?",
    options: ["Estados Unidos", "México", "Canadá", "Groenlândia"],
    answer: "Canadá"
  },
  {
    question: "Qual o nome do processo de formação de rochas metamórficas?",
    options: ["Erosão", "Sedimentação", "Transformação de rochas existentes por calor e pressão", "Vulcanismo"],
    answer: "Transformação de rochas existentes por calor e pressão"
  },
  {
    question: "Qual o nome da camada da Terra que contém a maioria dos gases?",
    options: ["Estratosfera", "Mesosfera", "Termosfera", "Troposfera"],
    answer: "Troposfera"
  },
  {
    question: "Qual o nome do animal que é o mais venenoso entre os aracnídeos?",
    options: ["Aranha-marrom", "Viúva-negra", "Escorpião-amarelo", "Caranguejeira"],
    answer: "Escorpião-amarelo"
  },
  {
    question: "Qual o nome do fenômeno natural que causa maremotos?",
    options: ["Terremoto submarino", "Furacão", "Tufão", "Erupção vulcânica"],
    answer: "Terremoto submarino"
  },
  {
    question: "Qual o nome do elemento químico essencial para a vida, presente na água?",
    options: ["Nitrogênio", "Carbono", "Oxigênio", "Hidrogênio"],
    answer: "Oxigênio"
  },
  {
    question: "Qual o nome da célula responsável pela visão?",
    options: ["Neurônio", "Fotorreceptor", "Miócito", "Osteoblasto"],
    answer: "Fotorreceptor"
  },
  {
    question: "Qual o nome do tipo de energia renovável gerada a partir da luz solar?",
    options: ["Hidrelétrica", "Eólica", "Solar", "Geotérmica"],
    answer: "Solar"
  },
  {
    question: "Qual o nome do processo de separação de misturas por centrifugação?",
    options: ["Filtração", "Decantação", "Destilação", "Centrifugação"],
    answer: "Centrifugação"
  },
  {
    question: "Qual o nome da vitamina que auxilia na coagulação do sangue?",
    options: ["Vitamina A", "Vitamina B", "Vitamina C", "Vitamina K"],
    answer: "Vitamina K"
  },
  {
    question: "Qual o nome do esporte que se joga com um remo e uma canoa?",
    options: ["Natação", "Remo", "Canoagem", "Surfe"],
    answer: "Canoagem"
  },
  {
    question: "Qual o nome do metal usado em embalagens de alimentos?",
    options: ["Ferro", "Cobre", "Alumínio", "Chumbo"],
    answer: "Alumínio"
  },
  {
    question: "Qual o nome do processo de transformação de líquido em plasma?",
    options: ["Vaporização e ionização", "Condensação", "Solidificação", "Sublimação"],
    answer: "Vaporização e ionização"
  },
  {
    question: "Qual o nome do principal componente da madeira?",
    options: ["Carbonato de cálcio", "Celulose", "Dióxido de silício", "Óxido de alumínio"],
    answer: "Celulose"
  },
  {
    question: "Qual o nome do maior vulcão em atividade na América do Norte?",
    options: ["Monte Santa Helena", "Popocatépetl", "Kilauea", "Mauna Loa"],
    answer: "Kilauea"
  },
  {
    question: "Qual o nome do processo de formação de vulcões?",
    options: ["Erosão", "Sedimentação", "Atividade magmática", "Intemperismo"],
    answer: "Atividade magmática"
  },
  {
    question: "Qual o nome do sistema responsável pela absorção de nutrientes?",
    options: ["Digestório", "Respiratório", "Circulatório", "Excretor"],
    answer: "Digestório"
  },
  {
    question: "Qual o nome da doença causada pela falta de vitamina B12?",
    options: ["Anemia perniciosa", "Escorbuto", "Beribéri", "Pellagra"],
    answer: "Anemia perniciosa"
  },
  {
    question: "Qual o nome do esporte que se joga com um arco e flechas?",
    options: ["Tiro", "Arco e flecha", "Dardos", "Bumerangue"],
    answer: "Arco e flecha"
  },
  {
    question: "Qual o nome do maior oceano do mundo em área e volume?",
    options: ["Atlântico", "Índico", "Pacífico", "Ártico"],
    answer: "Pacífico"
  },
  {
    question: "Qual o nome do processo de transformação de energia sonora em elétrica?",
    options: ["Gerador", "Microfone", "Painel solar", "Turbina eólica"],
    answer: "Microfone"
  },
  {
    question: "Qual o nome do cientista que descobriu o núcleo atômico?",
    options: ["Niels Bohr", "Ernest Rutherford", "J.J. Thomson", "James Chadwick"],
    answer: "Ernest Rutherford"
  },
  {
    question: "Qual o nome do maior país da Ásia em área?",
    options: ["Índia", "China", "Rússia", "Mongólia"],
    answer: "Rússia"
  },
  {
    question: "Qual o nome do processo de formação de rios?",
    options: ["Erosão e acúmulo de água", "Atividade vulcânica", "Movimento de placas tectônicas", "Sedimentação"],
    answer: "Erosão e acúmulo de água"
  },
  {
    question: "Qual o nome da camada da Terra onde se localiza a maior parte da massa da atmosfera?",
    options: ["Estratosfera", "Mesosfera", "Termosfera", "Troposfera"],
    answer: "Troposfera"
  },
  {
    question: "Qual o nome do animal que é o mais rápido nadador?",
    options: ["Golfinho", "Tubarão", "Atum", "Peixe-espada"],
    answer: "Peixe-espada"
  },
  {
    question: "Qual o nome do fenômeno natural que causa ventos fortes e destruidores?",
    options: ["Terremoto", "Tsunami", "Tufão", "Furacão"],
    answer: "Furacão"
  },
  {
    question: "Qual o nome do elemento químico usado para desinfetar a água?",
    options: ["Oxigênio", "Nitrogênio", "Cloro", "Flúor"],
    answer: "Cloro"
  },
  {
    question: "Qual o nome da célula responsável pela audição?",
    options: ["Neurônio", "Fotorreceptor", "Célula ciliada", "Miócito"],
    answer: "Célula ciliada"
  },
  {
    question: "Qual o nome do tipo de energia renovável gerada a partir da diferença de temperatura da água do oceano?",
    options: ["Solar", "Eólica", "Oceanotérmica", "Hidrelétrica"],
    answer: "Oceanotérmica"
  },
  {
    question: "Qual o nome do processo de separação de misturas por filtração?",
    options: ["Decantação", "Destilação", "Filtração", "Centrifugação"],
    answer: "Filtração"
  },
  {
    question: "Qual o nome da vitamina que previne doenças cardíacas?",
    options: ["Vitamina A", "Vitamina B", "Vitamina C", "Vitamina E"],
    answer: "Vitamina E"
  },
  {
    question: "Qual o nome do esporte que se joga com uma espada e um escudo?",
    options: ["Esgrima", "Boxe", "Judo", "Taekwondo"],
    answer: "Esgrima"
  },
  {
    question: "Qual o nome do metal usado em moedas?",
    options: ["Ferro", "Alumínio", "Cobre", "Níquel"],
    answer: "Níquel"
  },
  {
    question: "Qual o nome do processo de transformação de energia mecânica em elétrica?",
    options: ["Bateria", "Gerador", "Painel solar", "Microfone"],
    answer: "Gerador"
  },
  {
    question: "Qual o nome do principal componente do giz?",
    options: ["Dióxido de silício", "Carbonato de cálcio", "Óxido de alumínio", "Sulfato de cálcio"],
    answer: "Carbonato de cálcio"
  },
  {
    question: "Qual o nome do maior vulcão ativo do mundo em tamanho?",
    options: ["Mauna Loa", "Etna", "Vesúvio", "Monte Fuji"],
    answer: "Mauna Loa"
  },
  {
    question: "Qual o nome do processo de formação de oceanos?",
    options: ["Erosão", "Sedimentação", "Movimento de placas tectônicas e acúmulo de água", "Vulcanismo"],
    answer: "Movimento de placas tectônicas e acúmulo de água"
  },
  {
    question: "Qual o nome do sistema responsável pela produção de hormônios?",
    options: ["Digestório", "Respiratório", "Circulatório", "Endócrino"],
    answer: "Endócrino"
  },
  {
    question: "Qual o nome da doença causada pela falta de vitamina B9 (Ácido Fólico)?",
    options: ["Anemia megaloblástica", "Escorbuto", "Beribéri", "Pellagra"],
    answer: "Anemia megaloblástica"
  },
  {
    question: "Qual o nome do esporte que se joga com um bastão e uma bola pequena em um campo com um buraco?",
    options: ["Beisebol", "Golfe", "Críquete", "Hóquei"],
    answer: "Golfe"
  },
  {
    question: "Qual o nome do maior deserto do mundo em área?",
    options: ["Saara", "Atacama", "Gobi", "Antártico"],
    answer: "Antártico"
  },
  {
    question: "Qual o nome do processo de transformação de energia química em calor?",
    options: ["Fotossíntese", "Respiração celular", "Combustão", "Fissão nuclear"],
    answer: "Combustão"
  },
  {
    question: "Qual o nome do cientista que descobriu o oxigênio?",
    options: ["Antoine Lavoisier", "Joseph Priestley", "John Dalton", "Dmitri Mendeleev"],
    answer: "Joseph Priestley"
  },
  {
    question: "Qual o nome do maior país da Europa em área?",
    options: ["França", "Alemanha", "Ucrânia", "Rússia"],
    answer: "Rússia"
  },
  {
    question: "Qual o nome do processo de formação de lagos?",
    options: ["Erosão glacial, tectônica ou vulcânica", "Sedimentação", "Atividade vulcânica", "Intemperismo"],
    answer: "Erosão glacial, tectônica ou vulcânica"
  },
  {
    question: "Qual o nome da camada da Terra mais quente?",
    options: ["Crosta", "Manto", "Núcleo externo", "Núcleo interno"],
    answer: "Núcleo interno"
  },
  {
    question: "Qual o nome do animal que é o mais rápido em terra?",
    options: ["Leopardo", "Chita", "Guepardo", "Falcão-peregrino"],
    answer: "Guepardo"
  },
  {
    question: "Qual o nome do fenômeno natural que causa neblina?",
    options: ["Chuva", "Nuvens baixas próximas ao solo", "Vento", "Gelo"],
    answer: "Nuvens baixas próximas ao solo"
  },
  {
    question: "Qual o nome do elemento químico usado em pneus de carro?",
    options: ["Carbono", "Nitrogênio", "Enxofre", "Silício"],
    answer: "Enxofre"
  },
  {
    question: "Qual o nome da célula responsável pelo olfato?",
    options: ["Neurônio", "Fotorreceptor", "Célula olfativa", "Miócito"],
    answer: "Célula olfativa"
  },
  {
    question: "Qual o nome do tipo de energia renovável gerada a partir das ondas do mar?",
    options: ["Solar", "Eólica", "Ondomotriz", "Geotérmica"],
    answer: "Ondomotriz"
  },
  {
    question: "Qual o nome do processo de separação de misturas por evaporação?",
    options: ["Filtração", "Decantação", "Destilação", "Evaporação"],
    answer: "Evaporação"
  },
  {
    question: "Qual o nome da vitamina que ajuda na cicatrização?",
    options: ["Vitamina A", "Vitamina B", "Vitamina C", "Vitamina D"],
    answer: "Vitamina C"
  },
  {
    question: "Qual o nome do esporte que se joga com um bastão e uma bola em um campo de grama, com duas equipes tentando marcar pontos?",
    options: ["Beisebol", "Críquete", "Golfe", "Hóquei"],
    answer: "Críquete"
  },
  {
    question: "Qual o nome do metal usado em cabos elétricos?",
    options: ["Ferro", "Alumínio", "Cobre", "Chumbo"],
    answer: "Cobre"
  },
  {
    question: "Qual o nome do processo de transformação de plasma em sólido?",
    options: ["Ionização", "Recombinação", "Solidificação", "Deposição"],
    answer: "Deposição"
  },
  {
    question: "Qual o nome do principal componente do cimento?",
    options: ["Dióxido de silício", "Carbonato de cálcio", "Calcário e argila", "Óxido de alumínio"],
    answer: "Calcário e argila"
  },
  {
    question: "Qual o nome do maior vulcão ativo do mundo em volume?",
    options: ["Mauna Loa", "Etna", "Vesúvio", "Monte Fuji"],
    answer: "Mauna Loa"
  },
  {
    question: "Qual o nome do processo de formação de ilhas de coral?",
    options: ["Acúmulo de sedimentos", "Crescimento de corais", "Atividade vulcânica", "Movimento de placas tectônicas"],
    answer: "Crescimento de corais"
  },
  {
    question: "Qual o nome do sistema responsável pela regulação da temperatura corporal?",
    options: ["Digestório", "Respiratório", "Circulatório", "Tegumentar"],
    answer: "Tegumentar"
  },
  {
    question: "Qual o nome da doença causada pela falta de vitamina B6 (Piridoxina)?",
    options: ["Anemia", "Dermatite", "Neuropatia periférica", "Glosse"],
    answer: "Neuropatia periférica"
  },
  {
    question: "Qual o nome do esporte que se joga com um cavalo e um jogador que tenta pegar uma bola com uma raquete?",
    options: ["Hipismo", "Polo aquático", "Polo", "Equitação"],
    answer: "Polo"
  },
  {
    question: "Qual o nome do maior deserto do mundo em extensão latitudinal?",
    options: ["Saara", "Atacama", "Gobi", "Antártico"],
    answer: "Antártico"
  },
  {
    question: "Qual o nome do processo de transformação de energia mecânica em calor devido ao atrito?",
    options: ["Combustão", "Fissão nuclear", "Atrito", "Fotossíntese"],
    answer: "Atrito"
  },
  {
    question: "Qual o nome do cientista que descobriu o elétron?",
    options: ["Ernest Rutherford", "Niels Bohr", "J.J. Thomson", "James Chadwick"],
    answer: "J.J. Thomson"
  },
  {
    question: "Qual o nome do maior país da Oceania em área?",
    options: ["Nova Zelândia", "Austrália", "Papua Nova Guiné", "Indonésia"],
    answer: "Austrália"
  },
  {
    question: "Qual o nome do processo de formação de cachoeiras?",
    options: ["Erosão diferencial de rochas", "Sedimentação", "Atividade vulcânica", "Intemperismo"],
    answer: "Erosão diferencial de rochas"
  },
  {
    question: "Qual o nome da camada da Terra mais densa?",
    options: ["Crosta", "Manto", "Núcleo externo", "Núcleo interno"],
    answer: "Núcleo interno"
  },
  {
    question: "Qual o nome do animal que é o mais rápido no ar?",
    options: ["Águia", "Falcão-peregrino", "Andorinha", "Coruja"],
    answer: "Falcão-peregrino"
  },
  {
    question: "Qual o nome do fenômeno natural que causa tsunamis?",
    options: ["Terremoto submarino", "Furacão", "Tufão", "Erupção vulcânica"],
    answer: "Terremoto submarino"
  },
  {
    question: "Qual o nome do elemento químico que é o principal componente do ar?",
    options: ["Oxigênio", "Carbono", "Nitrogênio", "Hidrogênio"],
    answer: "Nitrogênio"
  },
  {
    question: "Qual o nome da célula responsável pelo paladar?",
    options: ["Neurônio", "Célula gustativa", "Fotorreceptor", "Miócito"],
    answer: "Célula gustativa"
  },
  {
    question: "Qual o nome do tipo de energia renovável gerada a partir do movimento da água?",
    options: ["Solar", "Eólica", "Hidrelétrica", "Geotérmica"],
    answer: "Hidrelétrica"
  },
  {
    question: "Qual o nome do processo de separação de misturas por decantação?",
    options: ["Filtração", "Decantação", "Destilação", "Centrifugação"],
    answer: "Decantação"
  },
  {
    question: "Qual o nome da vitamina que previne a cegueira noturna?",
    options: ["Vitamina A", "Vitamina B", "Vitamina C", "Vitamina D"],
    answer: "Vitamina A"
  },
  {
    question: "Qual o nome do esporte que se joga com um bastão e uma bola, com o objetivo de lançar a bola o mais longe possível e correr?",
    options: ["Beisebol", "Críquete", "Golfe", "Hóquei"],
    answer: "Beisebol"
  },
  {
    question: "Qual o nome do metal usado em jóias?",
    options: ["Ferro", "Alumínio", "Prata", "Chumbo"],
    answer: "Prata"
  },
  {
    question: "Qual o nome do processo de transformação de energia luminosa em calor?",
    options: ["Fotossíntese", "Aquecimento por irradiação solar", "Combustão", "Fissão nuclear"],
    answer: "Aquecimento por irradiação solar"
  },
  {
    question: "Qual o nome do principal componente do vidro temperado?",
    options: ["Dióxido de silício", "Carbonato de cálcio", "Óxido de alumínio", "Sulfato de cálcio"],
    answer: "Dióxido de silício"
  },
  {
    question: "Qual o nome do maior vulcão inativo do mundo?",
    options: ["Monte Kilimanjaro", "Mauna Kea", "Vesúvio", "Monte Fuji"],
    answer: "Mauna Kea"
  },
  {
    question: "Qual o nome do processo de formação de grutas?",
    options: ["Erosão e dissolução de rochas", "Sedimentação", "Atividade vulcânica", "Intemperismo"],
    answer: "Erosão e dissolução de rochas"
  },
  {
    question: "Qual o nome do sistema responsável pela proteção contra impactos?",
    options: ["Digestório", "Respiratório", "Circulatório", "Esquelético"],
    answer: "Esquelético"
  },
  {
    question: "Qual o nome da doença causada pela falta de vitamina B2 (Riboflavina)?",
    options: ["Queilose", "Glossite", "Dermatite seborreica", "Todas as anteriores"],
    answer: "Todas as anteriores"
  },
  {
    question: "Qual o nome do esporte que se joga com uma prancha e ondas?",
    options: ["Natação", "Remo", "Canoagem", "Surfe"],
    answer: "Surfe"
  },
  {
    question: "Qual o nome do maior lago do mundo em volume de água doce?",
    options: ["Lago Superior", "Lago Baikal", "Lago Vitória", "Mar Cáspio"],
    answer: "Lago Baikal"
  },
  {
    question: "Qual o nome do processo de transformação de energia nuclear em elétrica?",
    options: ["Fissão nuclear em usinas nucleares", "Combustão", "Fotossíntese", "Respiração celular"],
    answer: "Fissão nuclear em usinas nucleares"
  },
  {
    question: "Qual o nome do cientista que descobriu o núcleo atômico?",
    options: ["Niels Bohr", "Ernest Rutherford", "J.J. Thomson", "James Chadwick"],
    answer: "Ernest Rutherford"
  },
  {
    question: "Qual o nome do maior país da América do Sul em população?",
    options: ["Argentina", "Colômbia", "Brasil", "Peru"],
    answer: "Brasil"
  },
  {
    question: "Qual o nome do processo de formação de deltas?",
    options: ["Erosão fluvial", "Deposição de sedimentos por rios na foz", "Atividade vulcânica", "Movimento de placas tectônicas"],
    answer: "Deposição de sedimentos por rios na foz"
  },
  {
    question: "Qual o nome da camada da Terra mais fria?",
    options: ["Troposfera", "Estratosfera", "Mesosfera", "Termosfera"],
    answer: "Mesosfera"
  },
  {
    question: "Qual o nome do animal que é o mais venenoso entre os peixes?",
    options: ["Peixe-pedra", "Baiacu", "Moreia", "Enguia elétrica"],
    answer: "Peixe-pedra"
  },
  {
    question: "Qual o nome do fenômeno natural que causa arco-íris?",
    options: ["Reflexão da luz", "Refração e dispersão da luz em gotículas de água", "Absorção de luz", "Difração da luz"],
    answer: "Refração e dispersão da luz em gotículas de água"
  },
  {
    question: "Qual o nome do elemento químico que é o principal componente do diamante?",
    options: ["Oxigênio", "Nitrogênio", "Carbono", "Silício"],
    answer: "Carbono"
  },
  {
    question: "Qual o nome da célula responsável pelo tato?",
    options: ["Neurônio", "Receptor tátil", "Fotorreceptor", "Célula gustativa"],
    answer: "Receptor tátil"
  },
  {
    question: "Qual o nome do tipo de energia renovável gerada a partir do calor residual?",
    options: ["Solar", "Eólica", "Hidrelétrica", "Recuperação de calor"],
    answer: "Recuperação de calor"
  },
  {
    question: "Qual o nome do processo de separação de misturas por peneiração?",
    options: ["Filtração", "Decantação", "Peneiração", "Centrifugação"],
    answer: "Peneiração"
  },
  {
    question: "Qual o nome da vitamina que atua na formação do colágeno?",
    options: ["Vitamina A", "Vitamina B", "Vitamina C", "Vitamina D"],
    answer: "Vitamina C"
  },
  {
    question: "Qual o nome do esporte que se joga com um disco em uma pista de gelo?",
    options: ["Hóquei no gelo", "Patinação artística", "Curling", "Bobsled"],
    answer: "Curling"
  },
  {
    question: "Qual o nome do metal mais valioso?",
    options: ["Ouro", "Prata", "Platina", "Ródio"],
    answer: "Ródio"
  },
  {
    question: "Qual o nome do processo de transformação de energia elétrica em luz?",
    options: ["Lâmpada", "Gerador", "Bateria", "Painel solar"],
    answer: "Lâmpada"
  },
  {
    question: "Qual o nome do principal componente do carvão mineral?",
    options: ["Dióxido de silício", "Carbono", "Sulfato de cálcio", "Óxido de alumínio"],
    answer: "Carbono"
  },
  {
    question: "Qual o nome do maior vulcão ativo no mundo em altura?",
    options: ["Mauna Loa", "Etna", "Ojos del Salado", "Monte Fuji"],
    answer: "Ojos del Salado"
  },
  {
    question: "Qual o nome do processo de formação de fiordes?",
    options: ["Erosão glacial", "Sedimentação", "Atividade vulcânica", "Intemperismo"],
    answer: "Erosão glacial"
  },
  {
    question: "Qual o nome do sistema responsável pela produção de gametas?",
    options: ["Digestório", "Respiratório", "Circulatório", "Reprodutor"],
    answer: "Reprodutor"
  },
  {
    question: "Qual o nome da doença causada pela falta de vitamina B5 (Ácido Pantotênico)?",
    options: ["Parestesias", "Dermatite", "Fadiga", "Todas as anteriores"],
    answer: "Todas as anteriores"
  },
  {
    question: "Qual o nome do esporte que se joga com um trenó em uma pista de gelo?",
    options: ["Patinação", "Bobsled", "Luge", "Skeleton"],
    answer: "Bobsled"
  },
  {
    question: "Qual o nome do maior mar do mundo?",
    options: ["Mar Mediterrâneo", "Mar do Caribe", "Mar Arábico", "Mar da China Meridional"],
    answer: "Mar da China Meridional"
  },
  {
    question: "Qual o nome do processo de transformação de energia potencial elástica em cinética?",
    options: ["Mola comprimida se soltando", "Combustão", "Fissão nuclear", "Fotossíntese"],
    answer: "Mola comprimida se soltando"
  },
  {
    question: "Qual o nome do cientista que formulou a Lei de Ohm?",
    options: ["Isaac Newton", "Georg Ohm", "Albert Einstein", "Nikola Tesla"],
    answer: "Georg Ohm"
  },
  {
    question: "Qual o nome do maior país da América do Norte em população?",
    options: ["Canadá", "México", "Estados Unidos", "Cuba"],
    answer: "Estados Unidos"
  },
  {
    question: "Qual o nome do processo de formação de canyons?",
    options: ["Erosão fluvial", "Sedimentação", "Atividade vulcânica", "Intemperismo"],
    answer: "Erosão fluvial"
  },
  {
    question: "Qual o nome da camada da Terra mais externa?",
    options: ["Manto", "Núcleo externo", "Núcleo interno", "Crosta"],
    answer: "Crosta"
  },
  {
    question: "Qual o nome do animal que é o maior herbívoro terrestre?",
    options: ["Elefante", "Girafa", "Rinoceronte", "Hipopótamo"],
    answer: "Elefante"
  },
  {
    question: "Qual o nome do fenômeno natural que causa a seca?",
    options: ["Chuvas intensas", "Ausência prolongada de chuvas", "Inundações", "Terremotos"],
    answer: "Ausência prolongada de chuvas"
  },
  {
    question: "Qual o nome do elemento químico usado em baterias de celular?",
    options: ["Lítio", "Cobre", "Alumínio", "Ferro"],
    answer: "Lítio"
  },
  {
    question: "Qual o nome da célula responsável pelo equilíbrio?",
    options: ["Neurônio", "Célula ciliada do ouvido interno", "Fotorreceptor", "Miócito"],
    answer: "Célula ciliada do ouvido interno"
  },
  {
    question: "Qual o nome do tipo de energia renovável gerada a partir da energia das ondas?",
    options: ["Solar", "Eólica", "Ondomotriz", "Geotérmica"],
    answer: "Ondomotriz"
  },
  {
    question: "Qual o nome do processo de separação de misturas por levigação?",
    options: ["Filtração", "Decantação", "Levigação", "Centrifugação"],
    answer: "Levigação"
  },
  {
    question: "Qual o nome da vitamina que auxilia na visão noturna?",
    options: ["Vitamina A", "Vitamina B", "Vitamina C", "Vitamina D"],
    answer: "Vitamina A"
  },
  {
    question: "Qual o nome do esporte que se joga com um bastão e uma bola, com o objetivo de lançar a bola e correr para as bases?",
    options: ["Beisebol", "Críquete", "Golfe", "Hóquei"],
    answer: "Beisebol"
  },
  {
    question: "Qual o nome do metal usado em implantes médicos?",
    options: ["Ferro", "Alumínio", "Titânio", "Cobre"],
    answer: "Titânio"
  },
  {
    question: "Qual o nome do processo de transformação de energia térmica em mecânica?",
    options: ["Motor a vapor", "Gerador", "Painel solar", "Microfone"],
    answer: "Motor a vapor"
  },
  {
    question: "Qual o nome do principal componente do vidro de quartzo?",
    options: ["Dióxido de silício", "Carbonato de cálcio", "Óxido de alumínio", "Sulfato de cálcio"],
    answer: "Dióxido de silício"
  },
  {
    question: "Qual o nome do maior vulcão ativo na América do Sul?",
    options: ["Ojos del Salado", "Cotopaxi", "Nevado del Ruiz", "Tupungatito"],
    answer: "Ojos del Salado"
  },
  {
    question: "Qual o nome do processo de formação de cânions submarinos?",
    options: ["Erosão submarina por correntes de turbidez", "Sedimentação", "Atividade vulcânica", "Intemperismo"],
    answer: "Erosão submarina por correntes de turbidez"
  },
  {
    question: "Qual o nome do sistema responsável pelo controle da respiração?",
    options: ["Digestório", "Respiratório", "Circulatório", "Nervoso"],
    answer: "Nervoso"
  },
  {
    question: "Qual o nome da doença causada pela falta de vitamina B1 (Tiamina)?",
    options: ["Escorbuto", "Beribéri", "Raquitismo", "Anemia"],
    answer: "Beribéri"
  },
  {
    question: "Qual o nome do esporte que se joga com um trenó e uma pessoa deitada de bruços, com a cabeça para a frente?",
    options: ["Bobsled", "Luge", "Skeleton", "Patinação"],
    answer: "Skeleton"
  },
  {
    question: "Qual o nome do maior lago salgado do mundo?",
    options: ["Mar Cáspio", "Mar Morto", "Grande Lago Salgado", "Lago Aral"],
    answer: "Mar Cáspio"
  },
  {
    question: "Qual o nome do processo de transformação de energia hidráulica em elétrica?",
    options: ["Usina hidrelétrica", "Gerador", "Painel solar", "Turbina eólica"],
    answer: "Usina hidrelétrica"
  },
  {
    question: "Qual o nome do cientista que descobriu a relatividade geral?",
    options: ["Isaac Newton", "Albert Einstein", "Galileu Galilei", "Stephen Hawking"],
    answer: "Albert Einstein"
  },
  {
    question: "Qual o nome do maior país da África em população?",
    options: ["Egito", "Nigéria", "Etiópia", "África do Sul"],
    answer: "Nigéria"
  },
  {
    question: "Qual o nome do processo de formação de planícies?",
    options: ["Erosão e sedimentação", "Atividade vulcânica", "Movimento de placas tectônicas", "Intemperismo"],
    answer: "Erosão e sedimentação"
  },
  {
    question: "Qual o nome da camada da Terra mais profunda?",
    options: ["Crosta", "Manto", "Núcleo externo", "Núcleo interno"],
    answer: "Núcleo interno"
  },
  {
    question: "Qual o nome do animal que é o mais venenoso entre os anfíbios?",
    options: ["Sapo-flecha-dourado", "Salamandra-de-fogo", "Rã-touro", "Axolote"],
    answer: "Sapo-flecha-dourado"
  },
  {
    question: "Qual o nome do fenômeno natural que causa ventos frios e secos?",
    options: ["Brisa marítima", "Monções", "Ventos polares", "Vendaval"],
    answer: "Ventos polares"
  },
  {
    question: "Qual o nome do elemento químico usado em lâmpadas incandescentes?",
    options: ["Oxigênio", "Nitrogênio", "Argônio", "Tungstênio"],
    answer: "Tungstênio"
  },
  {
    question: "Qual o nome da célula responsável pelo sentido do olfato?",
    options: ["Neurônio", "Fotorreceptor", "Célula olfativa", "Miócito"],
    answer: "Célula olfativa"
  },
  {
    question: "Qual o nome do tipo de energia renovável gerada a partir da energia do hidrogênio?",
    options: ["Solar", "Eólica", "Hidrogênio verde", "Geotérmica"],
    answer: "Hidrogênio verde"
  },
  {
    question: "Qual o nome do processo de separação de misturas por destilação simples?",
    options: ["Filtração", "Decantação", "Destilação simples", "Centrifugação"],
    answer: "Destilação simples"
  },
  {
    question: "Qual o nome da vitamina que auxilia na absorção do ferro?",
    options: ["Vitamina A", "Vitamina B", "Vitamina C", "Vitamina D"],
    answer: "Vitamina C"
  },
  {
    question: "Qual o nome do esporte que se joga com um cavalo e um cavaleiro que salta obstáculos?",
    options: ["Polo", "Hipismo", "Corrida de cavalos", "Rodeio"],
    answer: "Hipismo"
  },
  {
    question: "Qual o nome do metal usado em aviões?",
    options: ["Ferro", "Cobre", "Alumínio", "Titânio"],
    answer: "Alumínio"
  },
  {
    question: "Qual o nome do processo de transformação de energia elétrica em energia sonora?",
    options: ["Lâmpada", "Gerador", "Alto-falante", "Microfone"],
    answer: "Alto-falante"
  },
  {
    question: "Qual o nome do principal componente do talco?",
    options: ["Dióxido de silício", "Carbonato de cálcio", "Silicato de magnésio hidratado", "Óxido de alumínio"],
    answer: "Silicato de magnésio hidratado"
  },
  {
    question: "Qual o nome do maior vulcão ativo na Oceania?",
    options: ["Mauna Loa", "Mt. Ruapehu", "Ambrym", "Yasur"],
    answer: "Ambrym"
  },
  {
    question: "Qual o nome do processo de formação de ilhas oceânicas?",
    options: ["Atividade vulcânica", "Erosão", "Sedimentação", "Movimento de placas tectônicas"],
    answer: "Atividade vulcânica"
  },
  {
    question: "Qual o nome do sistema responsável pela visão?",
    options: ["Digestório", "Respiratório", "Circulatório", "Sensorial (olhos)"],
    answer: "Sensorial (olhos)"
  },
  {
    question: "Qual o nome da doença causada pela falta de vitamina B9 (Ácido Fólico) em grávidas?",
    options: ["Anemia megaloblástica", "Defeitos do tubo neural", "Escorbuto", "Beribéri"],
    answer: "Defeitos do tubo neural"
  },
  {
    question: "Qual o nome do esporte que se joga com uma bola e um taco em um campo de grama, com o objetivo de acertar a bola em um buraco?",
    options: ["Beisebol", "Golfe", "Críquete", "Hóquei"],
    answer: "Golfe"
  },
  {
    question: "Qual o nome do maior lago do mundo em superfície?",
    options: ["Lago Superior", "Mar Cáspio", "Lago Vitória", "Lago Baikal"],
    answer: "Mar Cáspio"
  },
  {
    question: "Qual o nome do processo de transformação de energia solar em térmica para aquecer água?",
    options: ["Painel solar fotovoltaico", "Coletor solar térmico", "Usina hidrelétrica", "Turbina eólica"],
    answer: "Coletor solar térmico"
  },
  {
    question: "Qual o nome do cientista que descobriu a estrutura do DNA?",
    options: ["Louis Pasteur", "Charles Darwin", "James Watson e Francis Crick", "Gregor Mendel"],
    answer: "James Watson e Francis Crick"
  },
  {
    question: "Qual o nome do maior país da América do Sul em área?",
    options: ["Argentina", "Peru", "Chile", "Brasil"],
    answer: "Brasil"
  },
  {
    question: "Qual o nome do processo de formação de ilhas vulcânicas em cadeia?",
    options: ["Pontos quentes (hotspots)", "Erosão", "Sedimentação", "Movimento de placas tectônicas"],
    answer: "Pontos quentes (hotspots)"
  },
  {
    question: "Qual o nome da camada da Terra onde ocorre a maioria dos fenômenos meteorológicos?",
    options: ["Estratosfera", "Mesosfera", "Termosfera", "Troposfera"],
    answer: "Troposfera"
  },
  {
    question: "Qual o nome do animal que tem o maior olho em relação ao seu tamanho corporal?",
    options: ["Elefante", "Coruja", "Lula gigante", "Cavalo"],
    answer: "Lula gigante"
  },
  {
    question: "Qual o nome do fenômeno natural que causa a aurora boreal?",
    options: ["Descarga elétrica", "Interação de partículas solares com a atmosfera terrestre", "Terremoto", "Erupção vulcânica"],
    answer: "Interação de partículas solares com a atmosfera terrestre"
  },
  {
    question: "Qual o nome do elemento químico usado em lâmpadas LED?",
    options: ["Oxigênio", "Nitrogênio", "Gálio", "Silício"],
    answer: "Gálio"
  },
  {
    question: "Qual o nome da célula responsável pelo sentido do paladar?",
    options: ["Neurônio", "Fotorreceptor", "Célula gustativa", "Miócito"],
    answer: "Célula gustativa"
  },
  {
    question: "Qual o nome do tipo de energia renovável gerada a partir da biomassa para produzir eletricidade?",
    options: ["Solar", "Eólica", "Termelétrica a biomassa", "Hidrelétrica"],
    answer: "Termelétrica a biomassa"
  },
  {
    question: "Qual o nome do processo de separação de misturas por filtração a vácuo?",
    options: ["Decantação", "Destilação", "Filtração a vácuo", "Centrifugação"],
    answer: "Filtração a vácuo"
  },
  {
    question: "Qual o nome da vitamina que previne a anemia?",
    options: ["Vitamina A", "Vitamina B12", "Vitamina C", "Vitamina D"],
    answer: "Vitamina B12"
  },
  {
    question: "Qual o nome do esporte que se joga com um cavalo e uma bola em uma piscina?",
    options: ["Polo aquático", "Nado sincronizado", "Hipismo aquático", "Pentatlo moderno"],
    answer: "Polo aquático"
  },
  {
    question: "Qual o nome do metal usado em latas de refrigerante?",
    options: ["Ferro", "Cobre", "Alumínio", "Chumbo"],
    answer: "Alumínio"
  },
  {
    question: "Qual o nome do processo de transformação de energia elétrica em energia térmica?",
    options: ["Lâmpada", "Chuveiro elétrico", "Gerador", "Microfone"],
    answer: "Chuveiro elétrico"
  },
  {
    question: "Qual o nome do principal componente do gesso?",
    options: ["Dióxido de silício", "Carbonato de cálcio", "Sulfato de cálcio hidratado", "Óxido de alumínio"],
    answer: "Sulfato de cálcio hidratado"
  },
  {
    question: "Qual o nome do maior vulcão inativo do mundo em volume?",
    options: ["Monte Kilimanjaro", "Mauna Kea", "Vesúvio", "Monte Fuji"],
    answer: "Mauna Kea"
  },
  {
    question: "Qual o nome do processo de formação de glaciares?",
    options: ["Acúmulo e compactação de neve", "Erosão", "Sedimentação", "Atividade vulcânica"],
    answer: "Acúmulo e compactação de neve"
  },
  {
    question: "Qual o nome do sistema responsável pela sensação de dor?",
    options: ["Digestório", "Respiratório", "Circulatório", "Nervoso"],
    answer: "Nervoso"
  },
  {
    question: "Qual o nome da doença causada pela falta de vitamina B7 (Biotina)?",
    options: ["Dermatite", "Queda de cabelo", "Unhas quebradiças", "Todas as anteriores"],
    answer: "Todas as anteriores"
  },
  {
    question: "Qual o nome do esporte que se joga com uma rede e uma bola que é lançada por cima da rede?",
    options: ["Basquete", "Futebol", "Vôlei", "Handebol"],
    answer: "Vôlei"
  },
  {
    question: "Qual o nome do maior continente do mundo em área?",
    options: ["África", "América", "Europa", "Ásia"],
    answer: "Ásia"
  },
  {
    question: "Qual o nome do processo de transformação de energia luminosa em energia química?",
    options: ["Respiração celular", "Combustão", "Fotossíntese", "Fissão nuclear"],
    answer: "Fotossíntese"
  },
  {
    question: "Qual o nome do cientista que formulou a Lei da Conservação da Energia?",
    options: ["Albert Einstein", "Isaac Newton", "James Prescott Joule", "Galileu Galilei"],
    answer: "James Prescott Joule"
  },
  {
    question: "Qual o nome do maior país da Ásia em população?",
    options: ["Índia", "China", "Indonésia", "Paquistão"],
    answer: "Índia"
  },
  {
    question: "Qual o nome do processo de formação de cânions?",
    options: ["Erosão fluvial profunda", "Sedimentação", "Atividade vulcânica", "Intemperismo"],
    answer: "Erosão fluvial profunda"
  },
  {
    question: "Qual o nome da camada da Terra mais quente do interior?",
    options: ["Crosta", "Manto", "Núcleo externo", "Núcleo interno"],
    answer: "Núcleo interno"
  },
  {
    question: "Qual o nome do animal que é o mais venenoso entre as aranhas?",
    options: ["Aranha-marrom", "Viúva-negra", "Armadeira", "Tarântula"],
    answer: "Armadeira"
  },
  {
    question: "Qual o nome do fenômeno natural que causa a maré alta?",
    options: ["Vento", "Atração gravitacional da Lua e do Sol", "Chuvas", "Terremoto"],
    answer: "Atração gravitacional da Lua e do Sol"
  },
  {
    question: "Qual o nome do elemento químico usado em fósforos?",
    options: ["Oxigênio", "Carbono", "Enxofre", "Fósforo"],
    answer: "Fósforo"
  },
  {
    question: "Qual o nome da célula responsável pelo sentido da audição?",
    options: ["Neurônio", "Fotorreceptor", "Célula ciliada", "Miócito"],
    answer: "Célula ciliada"
  },
  {
    question: "Qual o nome do tipo de energia renovável gerada a partir do movimento da Terra?",
    options: ["Solar", "Eólica", "Geotérmica", "Hidrelétrica"],
    answer: "Geotérmica"
  },
  {
    question: "Qual o nome do processo de separação de misturas por sublimação?",
    options: ["Filtração", "Decantação", "Sublimação", "Centrifugação"],
    answer: "Sublimação"
  },
  {
    question: "Qual o nome da vitamina que auxilia na formação dos glóbulos vermelhos?",
    options: ["Vitamina A", "Vitamina B12", "Vitamina C", "Vitamina D"],
    answer: "Vitamina B12"
  },
  {
    question: "Qual o nome do esporte que se joga com um bastão e uma bola, com o objetivo de rebater a bola em um campo e marcar pontos?",
    options: ["Beisebol", "Críquete", "Golfe", "Hóquei"],
    answer: "Beisebol"
  },
  {
    question: "Qual o nome do metal usado em termômetros?",
    options: ["Ferro", "Alumínio", "Mercúrio", "Chumbo"],
    answer: "Mercúrio"
  },
  {
    question: "Qual o nome do processo de transformação de energia eólica em energia mecânica?",
    options: ["Painel solar", "Turbina eólica", "Gerador", "Bateria"],
    answer: "Turbina eólica"
  },
  {
    question: "Qual o nome do principal componente do granito?",
    options: ["Dióxido de silício", "Carbonato de cálcio", "Feldspato e quartzo", "Óxido de alumínio"],
    answer: "Feldspato e quartzo"
  },
  {
    question: "Qual o nome do maior vulcão ativo na Antártida?",
    options: ["Monte Erebus", "Vesúvio", "Mauna Loa", "Etna"],
    answer: "Monte Erebus"
  },
  {
    question: "Qual o nome do processo de formação de atóis?",
    options: ["Crescimento de corais em vulcões submarinos afundados", "Erosão", "Sedimentação", "Movimento de placas tectônicas"],
    answer: "Crescimento de corais em vulcões submarinos afundados"
  },
  {
    question: "Qual o nome do sistema responsável pela filtração do sangue?",
    options: ["Digestório", "Respiratório", "Circulatório", "Urinário"],
    answer: "Urinário"
  },
  {
    question: "Qual o nome da doença causada pela falta de vitamina B3 (Niacina)?",
    options: ["Escorbuto", "Beribéri", "Pellagra", "Anemia"],
    answer: "Pellagra"
  },
  {
    question: "Qual o nome do esporte que se joga com um remo e uma embarcação em um rio ou lago?",
    options: ["Natação", "Canoagem", "Remo", "Surfe"],
    answer: "Remo"
  },

  {
    question: "Qual o maior país em área territorial do mundo?",
    options: ["Canadá", "China", "Estados Unidos", "Rússia"],
    answer: "Rússia"
  },
  {
    question: "Qual o nome do processo pelo qual as plantas produzem seu próprio alimento?",
    options: ["Respiração", "Fotossíntese", "Transpiração", "Germinação"],
    answer: "Fotossíntese"
  },
  {
    question: "Qual o país com a maior população do mundo (2024)?",
    options: ["Índia", "Estados Unidos", "China", "Indonésia"],
    answer: "Índia" // Dados atualizados
  },
  {
    question: "Qual a capital do Brasil?",
    options: ["Rio de Janeiro", "São Paulo", "Brasília", "Salvador"],
    answer: "Brasília"
  },
  {
    question: "Quem foi o primeiro homem a pisar na Lua?",
    options: ["Buzz Aldrin", "Yuri Gagarin", "Neil Armstrong", "Michael Collins"],
    answer: "Neil Armstrong"
  },
  {
    question: "Qual o nome da moeda utilizada no Japão?",
    options: ["Yuan", "Dólar", "Euro", "Iene"],
    answer: "Iene"
  },
  {
    question: "Qual o maior deserto do mundo?",
    options: ["Deserto do Saara", "Deserto do Atacama", "Deserto de Gobi", "Deserto da Antártica"],
    answer: "Deserto da Antártica" // O maior deserto polar
  },
  {
    question: "Quantos continentes existem no mundo?",
    options: ["5", "6", "7", "8"],
    answer: "6" // Considerando Europa e Ásia como Eurásia, ou 7 se separados. O mais comum é 6 (Américas, Europa, Ásia, África, Oceania, Antártida)
  },
  {
    question: "Qual o animal terrestre mais rápido?",
    options: ["Leão", "Antílope", "Guepardo", "Cavalo"],
    answer: "Guepardo"
  },
  {
    question: "Qual o maior órgão do corpo humano?",
    options: ["Coração", "Cérebro", "Pele", "Fígado"],
    answer: "Pele"
  },
  {
    question: "Qual o nome do satélite natural da Terra?",
    options: ["Fobos", "Deimos", "Lua", "Titã"],
    answer: "Lua"
  },
  {
    question: "Qual o esporte mais popular do mundo?",
    options: ["Basquete", "Futebol", "Tênis", "Vôlei"],
    answer: "Futebol"
  },
  {
    question: "Qual o nome da doença causada pela deficiência de vitamina C?",
    options: ["Raquitismo", "Escorbuto", "Beribéri", "Anemia"],
    answer: "Escorbuto"
  },
  {
    question: "Qual o animal símbolo da paz?",
    options: ["Leão", "Águia", "Pomba", "Golfinho"],
    answer: "Pomba"
  },
  {
    question: "Qual o nome do processo de transformação da água em vapor?",
    options: ["Condensação", "Solidificação", "Evaporação", "Sublimação"],
    answer: "Evaporação"
  },
  {
    question: "Qual o nome do fenômeno natural que causa tsunamis?",
    options: ["Vulcões", "Terremotos submarinos", "Furacões", "Tornados"],
    answer: "Terremotos submarinos"
  },
  {
    question: "Qual o nome da estrutura que protege o cérebro?",
    options: ["Medula espinhal", "Crânio", "Coluna vertebral", "Costelas"],
    answer: "Crânio"
  },
  {
    question: "Qual o elemento mais abundante na crosta terrestre?",
    options: ["Ferro", "Alumínio", "Silício", "Oxigênio"],
    answer: "Oxigênio"
  },
  {
    question: "Qual o país conhecido como 'Terra do Sol Nascente'?",
    options: ["China", "Coreia do Sul", "Japão", "Vietnã"],
    answer: "Japão"
  },
  {
    question: "Qual o nome da maior floresta tropical do mundo?",
    options: ["Floresta Amazônica", "Floresta do Congo", "Floresta Boreal", "Floresta Negra"],
    answer: "Floresta Amazônica"
  },
  {
    question: "Qual o principal gás responsável pelo efeito estufa?",
    options: ["Oxigênio", "Nitrogênio", "Dióxido de Carbono", "Hidrogênio"],
    answer: "Dióxido de Carbono"
  },
  {
    question: "Qual o nome do instrumento usado para medir a temperatura?",
    options: ["Barômetro", "Anemômetro", "Termômetro", "Higrômetro"],
    answer: "Termômetro"
  },
  {
    question: "Qual o nome do pigmento que dá cor à pele, cabelo e olhos?",
    options: ["Hemoglobina", "Melanina", "Clorofila", "Queratina"],
    answer: "Melanina"
  },
  {
    question: "Qual o nome da galáxia onde se encontra o nosso Sistema Solar?",
    options: ["Andrômeda", "Triângulo", "Via Láctea", "Grande Nuvem de Magalhães"],
    answer: "Via Láctea"
  },
  {
    question: "Qual o nome da camada da atmosfera mais próxima da Terra?",
    options: ["Estratosfera", "Mesosfera", "Troposfera", "Termosfera"],
    answer: "Troposfera"
  },
  {
    question: "Qual o nome do processo de decomposição de matéria orgânica por fungos e bactérias?",
    options: ["Fossilização", "Erosão", "Decomposição", "Fermentação"],
    answer: "Decomposição"
  },
  {
    question: "Qual o continente mais populoso do mundo?",
    options: ["África", "Europa", "América", "Ásia"],
    answer: "Ásia"
  },
  {
    question: "Qual o nome do instrumento que amplifica sons pequenos?",
    options: ["Telescópio", "Microscópio", "Estetoscópio", "Binóculo"],
    answer: "Estetoscópio"
  },
  {
    question: "Qual o nome do processo de corte e queima de florestas para uso agrícola?",
    options: ["Reflorestamento", "Desmatamento", "Cultivo", "Irrigação"],
    answer: "Desmatamento"
  },
  {
    question: "Qual o nome do fenômeno óptico que separa a luz branca em suas cores componentes?",
    options: ["Reflexão", "Refração", "Dispersão", "Difração"],
    answer: "Dispersão"
  },

  // Cinema (aproximadamente 30 questões)
  {
    question: "Qual filme ganhou o Oscar de Melhor Filme em 2024?",
    options: ["Oppenheimer", "Barbie", "Vidas Passadas", "Pobres Criaturas"],
    answer: "Oppenheimer"
  },
  {
    question: "Quem dirigiu 'Titanic' e 'Avatar'?",
    options: ["Steven Spielberg", "George Lucas", "James Cameron", "Christopher Nolan"],
    answer: "James Cameron"
  },
  {
    question: "Qual ator é conhecido por interpretar Homem de Ferro no UCM?",
    options: ["Chris Evans", "Mark Ruffalo", "Robert Downey Jr.", "Chris Hemsworth"],
    answer: "Robert Downey Jr."
  },
  {
    question: "Qual filme de animação da Pixar se passa majoritariamente dentro da mente de uma garota?",
    options: ["Toy Story", "Up - Altas Aventuras", "Divertida Mente", "Viva - A Vida É uma Festa"],
    answer: "Divertida Mente"
  },
  {
    question: "Quem interpretou o Coringa em 'Batman: O Cavaleiro das Trevas'?",
    options: ["Jack Nicholson", "Jared Leto", "Joaquin Phoenix", "Heath Ledger"],
    answer: "Heath Ledger"
  },
  {
    question: "Qual a franquia de filmes de espionagem estrelada por Tom Cruise?",
    options: ["007", "Jason Bourne", "Missão: Impossível", "Kingsman"],
    answer: "Missão: Impossível"
  },
  {
    question: "Qual filme se passa em um hotel assombrado e é baseado em um livro de Stephen King?",
    options: ["It: A Coisa", "O Iluminado", "Carrie, a Estranha", "Cemitério Maldito"],
    answer: "O Iluminado"
  },
  {
    question: "Qual diretor é famoso por seus filmes com reviravoltas e finais surpreendentes, como 'O Sexto Sentido'?",
    options: ["Alfred Hitchcock", "M. Night Shyamalan", "David Fincher", "Quentin Tarantino"],
    answer: "M. Night Shyamalan"
  },
  {
    question: "Qual a atriz que ganhou o Oscar de Melhor Atriz por 'A Rainha' e 'Philomena'?",
    options: ["Meryl Streep", "Judi Dench", "Helen Mirren", "Cate Blanchett"],
    answer: "Helen Mirren"
  },
  {
    question: "Qual a cidade cenário principal do filme 'Central do Brasil'?",
    options: ["São Paulo", "Rio de Janeiro", "Salvador", "Belo Horizonte"],
    answer: "Rio de Janeiro"
  },
  {
    question: "Qual o nome da nave espacial em 'Star Wars' pilotada por Han Solo?",
    options: ["Estrela da Morte", "Millennium Falcon", "Destruidor Estelar", "X-Wing"],
    answer: "Millennium Falcon"
  },
  {
    question: "Qual o filme que popularizou a frase 'E.T. phone home'?",
    options: ["Contatos Imediatos de Terceiro Grau", "Alien", "E.T. - O Extraterrestre", "O Dia da Independência"],
    answer: "E.T. - O Extraterrestre"
  },
  {
    question: "Qual a saga de filmes de fantasia baseada nos livros de J.R.R. Tolkien?",
    options: ["Harry Potter", "As Crônicas de Nárnia", "O Senhor dos Anéis", "Percy Jackson"],
    answer: "O Senhor dos Anéis"
  },
  {
    question: "Quem é o diretor por trás do clássico 'Psicose'?",
    options: ["Stanley Kubrick", "Orson Welles", "Alfred Hitchcock", "Martin Scorsese"],
    answer: "Alfred Hitchcock"
  },
  {
    question: "Qual atriz interpretou Hermione Granger na saga 'Harry Potter'?",
    options: ["Bonnie Wright", "Evanna Lynch", "Emma Watson", "Katie Leung"],
    answer: "Emma Watson"
  },
  {
    question: "Qual o nome do ator principal em 'Forrest Gump - O Contador de Histórias'?",
    options: ["Tom Hanks", "Robin Williams", "Brad Pitt", "Johnny Depp"],
    answer: "Tom Hanks"
  },
  {
    question: "Qual o primeiro filme de animação longa-metragem da Disney?",
    options: ["Cinderela", "Branca de Neve e os Sete Anões", "Pinóquio", "Dumbo"],
    answer: "Branca de Neve e os Sete Anões"
  },
  {
    question: "Qual o gênero cinematográfico de 'Blade Runner' e 'Matrix'?",
    options: ["Fantasia", "Faroeste", "Ficção Científica", "Terror"],
    answer: "Ficção Científica"
  },
  {
    question: "Qual o nome do robô protagonista do filme 'Wall-E'?",
    options: ["Eve", "Johnny 5", "R2-D2", "Wall-E"],
    answer: "Wall-E"
  },
  {
    question: "Qual o nome do famoso musical que se passa em Nova York e tem como protagonistas Tony e Maria?",
    options: ["Grease", "La La Land", "Amor, Sublime Amor", "Os Miseráveis"],
    answer: "Amor, Sublime Amor"
  },
  {
    question: "Qual o nome do vilão principal no filme 'O Rei Leão'?",
    options: ["Scar", "Hienas", "Zira", "Nala"],
    answer: "Scar"
  },
  {
    question: "Qual o diretor japonês famoso por filmes de animação como 'A Viagem de Chihiro' e 'Princesa Mononoke'?",
    options: ["Akira Kurosawa", "Hayao Miyazaki", "Satoshi Kon", "Makoto Shinkai"],
    answer: "Hayao Miyazaki"
  },
  {
    question: "Qual o nome da escola de bruxaria em 'Harry Potter'?",
    options: ["Beauxbatons", "Durmstrang", "Hogwarts", "Ilvermorny"],
    answer: "Hogwarts"
  },
  {
    question: "Qual o filme de 1994 que tem como tema a fuga de uma prisão e é aclamado pela crítica?",
    options: ["Um Sonho de Liberdade", "À Espera de um Milagre", "A Vida É Bela", "Pulp Fiction"],
    answer: "Um Sonho de Liberdade"
  },
  {
    question: "Quem interpretou o icônico personagem Tony Montana em 'Scarface'?",
    options: ["Robert De Niro", "Al Pacino", "Marlon Brando", "Jack Nicholson"],
    answer: "Al Pacino"
  },
  {
    question: "Qual o nome da cidade fictícia onde se passa grande parte dos filmes do Batman?",
    options: ["Metrópolis", "Central City", "Star City", "Gotham City"],
    answer: "Gotham City"
  },
  {
    question: "Qual o nome do famoso estúdio de animação conhecido por 'Shrek' e 'Kung Fu Panda'?",
    options: ["Pixar", "Walt Disney Animation Studios", "DreamWorks Animation", "Studio Ghibli"],
    answer: "DreamWorks Animation"
  },
  {
    question: "Qual o filme que narra a história de um jovem que encontra um gênio e tem três desejos?",
    options: ["A Bela e a Fera", "Cinderela", "Aladdin", "Peter Pan"],
    answer: "Aladdin"
  },
  {
    question: "Qual o nome do robô que se torna amigo de um menino em 'O Gigante de Ferro'?",
    options: ["Optimus Prime", "Bumblebee", "Gigante de Ferro", "Baymax"],
    answer: "Gigante de Ferro"
  },
  {
    question: "Qual o filme de suspense de 1960 dirigido por Alfred Hitchcock?",
    options: ["Janela Indiscreta", "Os Pássaros", "Psicose", "Intriga Internacional"],
    answer: "Psicose"
  },

  // Artes (aproximadamente 30 questões)
  {
    question: "Quem pintou a 'Mona Lisa'?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    answer: "Leonardo da Vinci"
  },
  {
    question: "Qual o movimento artístico caracterizado por formas geométricas e a representação de objetos de múltiplos ângulos?",
    options: ["Impressionismo", "Surrealismo", "Cubismo", "Expressionismo"],
    answer: "Cubismo"
  },
  {
    question: "Quem esculpiu 'Davi' e pintou o teto da Capela Sistina?",
    options: ["Donatello", "Bernini", "Michelangelo", "Rodin"],
    answer: "Michelangelo"
  },
  {
    question: "Qual museu abriga a 'Noite Estrelada' de Van Gogh?",
    options: ["Louvre", "Metropolitan Museum of Art", "Museum of Modern Art (MoMA)", "British Museum"],
    answer: "Museum of Modern Art (MoMA)"
  },
  {
    question: "Qual o nome da técnica de pintura que utiliza pigmentos misturados com água e goma arábica?",
    options: ["Óleo sobre tela", "Afresco", "Aquarela", "Guache"],
    answer: "Aquarela"
  },
  {
    question: "Quem é a autora da obra 'Frida Kahlo: The Paintings'?",
    options: ["Marina Abramović", "Yayoi Kusama", "Frida Kahlo", "Hayden Herrera"],
    answer: "Hayden Herrera" // A biógrafa de Frida Kahlo
  },
  {
    question: "Qual o nome da famosa ópera composta por Georges Bizet?",
    options: ["A Flauta Mágica", "Carmen", "La Traviata", "O Barbeiro de Sevilha"],
    answer: "Carmen"
  },
  {
    question: "Qual o estilo arquitetônico predominante na Idade Média, caracterizado por arcos ogivais e vitrais?",
    options: ["Românico", "Gótico", "Renascimento", "Barroco"],
    answer: "Gótico"
  },
  {
    question: "Quem compôs a 'Nona Sinfonia'?",
    options: ["Wolfgang Amadeus Mozart", "Johann Sebastian Bach", "Ludwig van Beethoven", "Richard Wagner"],
    answer: "Ludwig van Beethoven"
  },
  {
    question: "Qual o nome da arte japonesa de dobrar papel?",
    options: ["Ikebana", "Bonsai", "Origami", "Kendo"],
    answer: "Origami"
  },
  {
    question: "Quem pintou 'Guernica'?",
    options: ["Salvador Dalí", "Pablo Picasso", "Joan Miró", "Henri Matisse"],
    answer: "Pablo Picasso"
  },
  {
    question: "Qual o estilo musical que surgiu em Nova Orleans e é caracterizado pela improvisação?",
    options: ["Blues", "Rock", "Jazz", "Soul"],
    answer: "Jazz"
  },
  {
    question: "Qual a artista performática famosa por suas longas performances e colaborações, como 'The Artist is Present'?",
    options: ["Cindy Sherman", "Yoko Ono", "Marina Abramović", "Louise Bourgeois"],
    answer: "Marina Abramović"
  },
  {
    question: "Qual o nome da escultura famosa de Auguste Rodin que representa um homem em profunda reflexão?",
    options: ["Vênus de Milo", "Davi", "O Pensador", "Vitória de Samotrácia"],
    answer: "O Pensador"
  },
  {
    question: "Qual o período artístico que valorizava a emoção, o individualismo e a natureza selvagem, surgindo no final do século XVIII?",
    options: ["Classicismo", "Romantismo", "Realismo", "Barroco"],
    answer: "Romantismo"
  },
  {
    question: "Qual o nome do famoso tenor italiano que popularizou a ópera para um público mais amplo?",
    options: ["Plácido Domingo", "José Carreras", "Luciano Pavarotti", "Andrea Bocelli"],
    answer: "Luciano Pavarotti"
  },
  {
    question: "Qual o pintor surrealista espanhol famoso por suas imagens oníricas e relógios derretidos?",
    options: ["René Magritte", "Max Ernst", "Joan Miró", "Salvador Dalí"],
    answer: "Salvador Dalí"
  },
  {
    question: "Qual o nome da dança clássica que se originou nas cortes italianas renascentistas e se desenvolveu na França e Rússia?",
    options: ["Salsa", "Tango", "Ballet", "Flamenco"],
    answer: "Ballet"
  },
  {
    question: "Qual o termo para a arte de desenhar em paredes ou outras superfícies públicas?",
    options: ["Escultura", "Grafite", "Pintura a óleo", "Gravura"],
    answer: "Grafite"
  },
  {
    question: "Qual o nome da famosa peça de teatro de William Shakespeare sobre dois amantes de famílias rivais?",
    options: ["Hamlet", "Macbeth", "Otelo", "Romeu e Julieta"],
    answer: "Romeu e Julieta"
  },
  {
    question: "Qual o nome da escultura egípcia com corpo de leão e cabeça humana?",
    options: ["Obelisco", "Pirâmide", "Esfinge", "Colosso de Rodes"],
    answer: "Esfinge"
  },
  {
    question: "Qual o movimento artístico que buscava representar a realidade de forma objetiva, sem idealizações?",
    options: ["Impressionismo", "Simbolismo", "Realismo", "Expressionismo"],
    answer: "Realismo"
  },
  {
    question: "Qual o nome do famoso arquiteto espanhol conhecido por suas obras modernistas e orgânicas, como a Sagrada Família?",
    options: ["Oscar Niemeyer", "Frank Lloyd Wright", "Antoni Gaudí", "Le Corbusier"],
    answer: "Antoni Gaudí"
  },
  {
    question: "Qual o nome da arte de representar cenas com fantoches ou marionetes?",
    options: ["Mímica", "Teatro de sombras", "Ventriloquia", "Teatro de fantoches"],
    answer: "Teatro de fantoches"
  },
  {
    question: "Qual o instrumento musical que é tocado por um arco e tem cordas?",
    options: ["Guitarra", "Piano", "Flauta", "Violino"],
    answer: "Violino"
  },
  {
    question: "Qual a pintora mexicana conhecida por seus autorretratos e por explorar temas como dor e identidade?",
    options: ["Tamara de Lempicka", "Frida Kahlo", "Georgia O'Keeffe", "Yayoi Kusama"],
    answer: "Frida Kahlo"
  },
  {
    question: "Qual o nome da arte de contar histórias ou sentimentos através do movimento do corpo, sem palavras?",
    options: ["Música", "Pintura", "Dança", "Escultura"],
    answer: "Dança"
  },
  {
    question: "Qual o período da história da arte europeia que valorizou a razão, a clareza e o equilíbrio, influenciado pela Antiguidade Clássica?",
    options: ["Barroco", "Rococó", "Neoclassicismo", "Romantismo"],
    answer: "Neoclassicismo"
  },
  {
    question: "Qual o famoso músico e compositor alemão conhecido como o 'Pai da Música Ocidental'?",
    options: ["Wolfgang Amadeus Mozart", "Johann Sebastian Bach", "Ludwig van Beethoven", "Frédéric Chopin"],
    answer: "Johann Sebastian Bach"
  },
  {
    question: "Qual o nome da peça teatral que satiriza a sociedade e seus costumes?",
    options: ["Tragédia", "Drama", "Comédia", "Musical"],
    answer: "Comédia"
  },

  // Música (aproximadamente 30 questões)
  {
    question: "Qual banda é famosa pela música 'Bohemian Rhapsody'?",
    options: ["Led Zeppelin", "The Beatles", "Queen", "Pink Floyd"],
    answer: "Queen"
  },
  {
    question: "Quem é conhecido como o 'Rei do Pop'?",
    options: ["Elvis Presley", "Michael Jackson", "Prince", "Freddie Mercury"],
    answer: "Michael Jackson"
  },
  {
    question: "Qual instrumento é fundamental em uma orquestra sinfônica?",
    options: ["Guitarra", "Bateria", "Violino", "Saxofone"],
    answer: "Violino"
  },
  {
    question: "Quem é a cantora por trás do álbum '21'?",
    options: ["Beyoncé", "Rihanna", "Adele", "Taylor Swift"],
    answer: "Adele"
  },
  {
    question: "Qual gênero musical surgiu nos Estados Unidos e é caracterizado pelo uso de improvisação e swing?",
    options: ["Rock", "Pop", "Jazz", "Blues"],
    answer: "Jazz"
  },
  {
    question: "Qual o nome da banda de rock britânica formada por John Lennon, Paul McCartney, George Harrison e Ringo Starr?",
    options: ["The Rolling Stones", "Queen", "Led Zeppelin", "The Beatles"],
    answer: "The Beatles"
  },
  {
    question: "Qual o famoso cantor de reggae conhecido por músicas como 'One Love' e 'No Woman, No Cry'?",
    options: ["Peter Tosh", "Bob Marley", "Jimmy Cliff", "Toots Hibbert"],
    answer: "Bob Marley"
  },
  {
    question: "Qual o instrumento musical de sopro que se assemelha a um tubo com furos e chaves?",
    options: ["Trompete", "Clarinete", "Flauta", "Saxofone"],
    answer: "Flauta"
  },
  {
    question: "Quem é a 'Rainha do Pop'?",
    options: ["Janet Jackson", "Britney Spears", "Madonna", "Mariah Carey"],
    answer: "Madonna"
  },
  {
    question: "Qual o nome do famoso festival de música que aconteceu em 1969, no estado de Nova York?",
    options: ["Rock in Rio", "Lollapalooza", "Woodstock", "Glastonbury"],
    answer: "Woodstock"
  },
  {
    question: "Qual o tipo de voz feminina mais aguda na ópera?",
    options: ["Contralto", "Mezzo-soprano", "Soprano", "Coloratura"],
    answer: "Soprano"
  },
  {
    question: "Qual o nome do compositor alemão conhecido por suas marchas e valsas, como 'O Danúbio Azul'?",
    options: ["Ludwig van Beethoven", "Johann Strauss II", "Johannes Brahms", "Franz Schubert"],
    answer: "Johann Strauss II"
  },
  {
    question: "Qual o gênero musical brasileiro que surgiu no Rio de Janeiro e é famoso por suas letras poéticas e batida rítmica?",
    options: ["Samba", "Forró", "Axé", "MPB"],
    answer: "Samba"
  },
  {
    question: "Quem é o guitarrista lendário conhecido por sua inovação e por tocar a guitarra com os dentes?",
    options: ["Eric Clapton", "Jimi Hendrix", "Jimmy Page", "Slash"],
    answer: "Jimi Hendrix"
  },
  {
    question: "Qual o nome da cantora brasileira conhecida como a 'Pequena Notável'?",
    options: ["Elis Regina", "Gal Costa", "Maria Bethânia", "Carmen Miranda"],
    answer: "Carmen Miranda"
  },
  {
    question: "Qual o instrumento musical que possui 88 teclas?",
    options: ["Órgão", "Acordeão", "Piano", "Cravo"],
    answer: "Piano"
  },
  {
    question: "Qual a banda de rock australiana famosa por hits como 'Highway to Hell' e 'Back in Black'?",
    options: ["Guns N' Roses", "Metallica", "AC/DC", "Led Zeppelin"],
    answer: "AC/DC"
  },
  {
    question: "Quem compôs a famosa ópera 'As Bodas de Fígaro'?",
    options: ["Giuseppe Verdi", "Giacomo Puccini", "Wolfgang Amadeus Mozart", "Richard Wagner"],
    answer: "Wolfgang Amadeus Mozart"
  },
  {
    question: "Qual o nome do gênero musical que mistura rock com ritmos caribenhos, popularizado por Bob Marley?",
    options: ["Ska", "Dancehall", "Reggae", "Calypso"],
    answer: "Reggae"
  },
  {
    question: "Qual o cantor norte-americano conhecido como 'The Voice'?",
    options: ["Frank Sinatra", "Nat King Cole", "Dean Martin", "Bing Crosby"],
    answer: "Frank Sinatra"
  },
  {
    question: "Qual o nome do instrumento de percussão que consiste em uma caixa de madeira com hastes metálicas?",
    options: ["Bateria", "Pandeiro", "Xilofone", "Triângulo"],
    answer: "Xilofone"
  },
  {
    question: "Qual o nome da cantora americana que ficou famosa por sua voz potente e hits como 'I Will Always Love You'?",
    options: ["Mariah Carey", "Celine Dion", "Whitney Houston", "Aretha Franklin"],
    answer: "Whitney Houston"
  },
  {
    question: "Qual o grupo musical sueco famoso por hits como 'Dancing Queen' e 'Mamma Mia'?",
    options: ["Bee Gees", "Queen", "ABBA", "Fleetwood Mac"],
    answer: "ABBA"
  },
  {
    question: "Qual o gênero musical eletrônico que se originou em Detroit e Chicago nos anos 80?",
    options: ["Hip Hop", "House", "Techno", "Disco"],
    answer: "Techno"
  },
  {
    question: "Quem é o compositor brasileiro conhecido como 'Maestro Soberano' e autor de 'Aquarela do Brasil'?",
    options: ["Tom Jobim", "Vinicius de Moraes", "Ary Barroso", "Chico Buarque"],
    answer: "Ary Barroso"
  },
  {
    question: "Qual o nome do movimento cultural e musical que surgiu nos anos 60, com ênfase na paz e no amor?",
    options: ["Punk", "Disco", "Hippie", "Grunge"],
    answer: "Hippie"
  },
  {
    question: "Qual o famoso cantor de ópera italiano que ficou cego na juventude e se tornou um dos tenores mais amados do mundo?",
    options: ["Luciano Pavarotti", "Plácido Domingo", "José Carreras", "Andrea Bocelli"],
    answer: "Andrea Bocelli"
  },
  {
    question: "Qual o nome da banda irlandesa liderada por Bono Vox?",
    options: ["Coldplay", "Radiohead", "U2", "Oasis"],
    answer: "U2"
  },
  {
    question: "Qual o instrumento musical que produz som ao vibrar cordas percutidas por martelos?",
    options: ["Violão", "Harpa", "Violoncelo", "Piano"],
    answer: "Piano"
  },
  {
    question: "Qual o gênero musical caracterizado por rimas e batidas, surgido nas comunidades afro-americanas e latinas dos EUA?",
    options: ["R&B", "Soul", "Rap", "Funk"],
    answer: "Rap"
  },

  // Química (aproximadamente 30 questões)
  {
    question: "O que é um solvente universal?",
    options: ["Ácido", "Água", "Óleo", "Álcool"],
    answer: "Água"
  },
  {
    question: "Qual o símbolo químico do ouro?",
    options: ["Au", "Ag", "Fe", "Cu"],
    answer: "Au"
  },
  {
    question: "Qual o gás nobre mais leve?",
    options: ["Argônio", "Hélio", "Neônio", "Criptônio"],
    answer: "Hélio"
  },
  {
    question: "Qual a fórmula química da água?",
    options: ["H2O2", "CO2", "H2O", "NH3"],
    answer: "H2O"
  },
  {
    question: "Qual o tipo de ligação química em que há compartilhamento de elétrons?",
    options: ["Iônica", "Metálica", "Covalente", "Vander Waals"],
    answer: "Covalente"
  },
  {
    question: "Qual o elemento químico presente em todos os compostos orgânicos?",
    options: ["Oxigênio", "Hidrogênio", "Carbono", "Nitrogênio"],
    answer: "Carbono"
  },
  {
    question: "Qual o nome do processo de transformação de líquido para gás?",
    options: ["Condensação", "Solidificação", "Evaporação", "Fusão"],
    answer: "Evaporação"
  },
  {
    question: "Qual o nome da escala que mede o grau de acidez ou basicidade de uma substância?",
    options: ["Escala Kelvin", "Escala Celsius", "Escala pH", "Escala Richter"],
    answer: "Escala pH"
  },
  {
    question: "Qual o principal componente do gás natural?",
    options: ["Etano", "Propano", "Metano", "Butano"],
    answer: "Metano"
  },
  {
    question: "Qual o metal líquido à temperatura ambiente?",
    options: ["Ferro", "Alumínio", "Mercúrio", "Cobre"],
    answer: "Mercúrio"
  },
  {
    question: "Qual o gás utilizado na fotossíntese pelas plantas?",
    options: ["Oxigênio", "Nitrogênio", "Dióxido de Carbono", "Hidrogênio"],
    answer: "Dióxido de Carbono"
  },
  {
    question: "Qual o nome da teoria que explica a estrutura e o comportamento dos átomos?",
    options: ["Teoria da Relatividade", "Teoria da Evolução", "Teoria Atômica", "Teoria do Big Bang"],
    answer: "Teoria Atômica"
  },
  {
    question: "Qual o nome do processo de união de átomos para formar moléculas?",
    options: ["Dissociação", "Ionização", "Ligação Química", "Decomposição"],
    answer: "Ligação Química"
  },
  {
    question: "Qual o ácido presente no estômago humano que ajuda na digestão?",
    options: ["Ácido Sulfúrico", "Ácido Nítrico", "Ácido Clorídrico", "Ácido Acético"],
    answer: "Ácido Clorídrico"
  },
  {
    question: "Qual o nome do sal de cozinha?",
    options: ["Sulfato de Sódio", "Cloreto de Potássio", "Cloreto de Sódio", "Carbonato de Cálcio"],
    answer: "Cloreto de Sódio"
  },
  {
    question: "Qual o número atômico de um elemento?",
    options: ["Número de nêutrons", "Número de prótons", "Massa atômica", "Número de elétrons"],
    answer: "Número de prótons"
  },
  {
    question: "Qual o principal metal presente na hemoglobina do sangue?",
    options: ["Cobre", "Zinco", "Ferro", "Cálcio"],
    answer: "Ferro"
  },
  {
    question: "Qual o tipo de reação química que libera calor?",
    options: ["Endotérmica", "Exotérmica", "Redox", "Neutralização"],
    answer: "Exotérmica"
  },
  {
    question: "Qual o nome do processo de separação de misturas heterogêneas por diferença de densidade?",
    options: ["Destilação", "Filtração", "Decantação", "Evaporação"],
    answer: "Decantação"
  },
  {
    question: "Qual a substância que acelera uma reação química sem ser consumida?",
    options: ["Inibidor", "Reagente", "Produto", "Catalisador"],
    answer: "Catalisador"
  },
  {
    question: "Qual o gás responsável pelo cheiro característico de ovos podres?",
    options: ["Amônia", "Metano", "Gás sulfídrico", "Dióxido de enxofre"],
    answer: "Gás sulfídrico"
  },
  {
    question: "Qual o nome do composto que forma a maior parte das rochas e minerais na crosta terrestre?",
    options: ["Carbonato de cálcio", "Sulfato de cálcio", "Silicato de alumínio", "Óxido de ferro"],
    answer: "Silicato de alumínio" // Silicatos em geral
  },
  {
    question: "Qual o nome da transição de fase de sólido diretamente para gás?",
    options: ["Fusão", "Vaporização", "Sublimação", "Condensação"],
    answer: "Sublimação"
  },
  {
    question: "Qual o nome da energia que é liberada ou absorvida durante uma reação química?",
    options: ["Energia cinética", "Energia potencial", "Energia térmica", "Energia nuclear"],
    answer: "Energia térmica" // Mais especificamente entalpia de reação
  },
  {
    question: "Qual o grupo da tabela periódica que contém os gases nobres?",
    options: ["Metais Alcalinos", "Halogênios", "Metais de Transição", "Gases Nobres (Grupo 18)"],
    answer: "Gases Nobres (Grupo 18)"
  },
  {
    question: "Qual o nome da substância que é a base da vida, compondo grande parte dos seres vivos?",
    options: ["Lipídios", "Proteínas", "Carboidratos", "Água"],
    answer: "Água"
  },
  {
    question: "Qual o processo de separação de líquidos com diferentes pontos de ebulição?",
    options: ["Filtração", "Decantação", "Destilação", "Centrifugação"],
    answer: "Destilação"
  },
  {
    question: "Qual o nome da reação química que ocorre quando uma substância reage com o oxigênio e libera energia?",
    options: ["Fermentação", "Oxidação", "Redução", "Neutralização"],
    answer: "Oxidação" // Mais especificamente Combustão (tipo de oxidação)
  },
  {
    question: "Qual o nome da camada de ozônio?",
    options: ["Estratosfera", "Troposfera", "Mesosfera", "Termosfera"],
    answer: "Estratosfera"
  },
  {
    question: "Qual o nome da reação que envolve a formação de um sal e água a partir de um ácido e uma base?",
    options: ["Oxirredução", "Combustão", "Neutralização", "Decomposição"],
    answer: "Neutralização"
  },

  // Matemática (aproximadamente 30 questões)
  {
    question: "Quanto é 9 x 7?",
    options: ["54", "63", "72", "81"],
    answer: "63"
  },
  {
    question: "Qual o valor de 2² + 3²?",
    options: ["10", "13", "25", "36"],
    answer: "13"
  },
  {
    question: "Se um triângulo tem base 6 e altura 4, qual sua área?",
    options: ["10", "12", "24", "48"],
    answer: "12"
  },
  {
    question: "Qual o resultado de 10 dividido por 2 mais 3?",
    options: ["5", "8", "7", "6"],
    answer: "8" // (10/2) + 3 = 5 + 3 = 8
  },
  {
    question: "Em uma equação, qual é o valor de 'x' se x - 8 = 12?",
    options: ["4", "20", "10", "16"],
    answer: "20"
  },
  {
    question: "Qual o próximo número na sequência: 1, 4, 9, 16...?",
    options: ["20", "25", "30", "36"],
    answer: "25" // Quadrados perfeitos
  },
  {
    question: "Qual o nome do polígono com 5 lados?",
    options: ["Quadrilátero", "Hexágono", "Pentágono", "Heptágono"],
    answer: "Pentágono"
  },
  {
    question: "Quanto é 0,5 + 0,25?",
    options: ["0,7", "0,75", "1,0", "0,20"],
    answer: "0,75"
  },
  {
    question: "Qual a raiz quadrada de 144?",
    options: ["10", "11", "12", "13"],
    answer: "12"
  },
  {
    question: "Se um círculo tem raio 7, qual seu diâmetro?",
    options: ["7", "14", "21", "28"],
    answer: "14"
  },
  {
    question: "Qual o resultado de 5! (5 fatorial)?",
    options: ["10", "25", "120", "720"],
    answer: "120" // 5*4*3*2*1
  },
  {
    question: "Quantos graus tem a soma dos ângulos internos de um triângulo?",
    options: ["90", "180", "270", "360"],
    answer: "180"
  },
  {
    question: "Qual a porcentagem correspondente a 1/4?",
    options: ["10%", "20%", "25%", "40%"],
    answer: "25%"
  },
  {
    question: "Qual o valor de |-5|?",
    options: ["-5", "0", "5", "10"],
    answer: "5" // Módulo ou valor absoluto
  },
  {
    question: "Se um carro percorre 100 km em 2 horas, qual sua velocidade média?",
    options: ["25 km/h", "50 km/h", "75 km/h", "100 km/h"],
    answer: "50 km/h"
  },
  {
    question: "Qual o maior divisor comum entre 12 e 18?",
    options: ["2", "3", "6", "9"],
    answer: "6"
  },
  {
    question: "Qual o menor múltiplo comum entre 4 e 6?",
    options: ["12", "18", "24", "6"],
    answer: "12"
  },
  {
    question: "Qual o tipo de número que não pode ser escrito como uma fração (p/q, com q≠0)?",
    options: ["Inteiro", "Racional", "Irracional", "Natural"],
    answer: "Irracional"
  },
  {
    question: "Qual o nome da reta que toca uma circunferência em apenas um ponto?",
    options: ["Secante", "Diâmetro", "Raio", "Tangente"],
    answer: "Tangente"
  },
  {
    question: "Qual o valor de 'x' se 3x = 21?",
    options: ["5", "6", "7", "8"],
    answer: "7"
  },
  {
    question: "Quanto é 1/2 + 1/3?",
    options: ["2/5", "1/6", "5/6", "3/4"],
    answer: "5/6"
  },
  {
    question: "Qual o nome do gráfico que representa dados usando barras retangulares?",
    options: ["Gráfico de linhas", "Gráfico de setores", "Histograma", "Gráfico de dispersão"],
    answer: "Histograma" // ou Gráfico de Barras
  },
  {
    question: "Qual a probabilidade de tirar um número ímpar ao jogar um dado de 6 faces?",
    options: ["1/6", "1/3", "1/2", "2/3"],
    answer: "1/2" // 3/6
  },
  {
    question: "Qual o volume de um cubo com lado 3 cm?",
    options: ["9 cm³", "12 cm³", "27 cm³", "36 cm³"],
    answer: "27 cm³"
  },
  {
    question: "Qual o nome do teorema que relaciona os lados de um triângulo retângulo?",
    options: ["Teorema de Tales", "Teorema de Pitágoras", "Teorema de Fermat", "Teorema de Bolzano"],
    answer: "Teorema de Pitágoras"
  },
  {
    question: "Se a temperatura é de 20°C e sobe 5°C, qual a nova temperatura?",
    options: ["15°C", "20°C", "25°C", "30°C"],
    answer: "25°C"
  },
  {
    question: "Qual o número que vem depois de 99?",
    options: ["98", "100", "101", "990"],
    answer: "100"
  },
  {
    question: "Quantos milímetros tem 1 centímetro?",
    options: ["1", "10", "100", "1000"],
    answer: "10"
  },
  {
    question: "Qual o resultado de 15 - 7 + 3?",
    options: ["5", "8", "11", "13"],
    answer: "11" // 15-7=8; 8+3=11
  },
  {
    question: "Qual o nome da operação inversa da multiplicação?",
    options: ["Adição", "Subtração", "Divisão", "Potenciação"],
    answer: "Divisão"
  },

  // História (aproximadamente 30 questões)
  {
    question: "Quem foi o primeiro presidente do Brasil?",
    options: ["Getúlio Vargas", "Dom Pedro II", "Marechal Deodoro da Fonseca", "Floriano Peixoto"],
    answer: "Marechal Deodoro da Fonseca"
  },
  {
    question: "Em que ano o Brasil declarou sua independência?",
    options: ["1808", "1822", "1888", "1889"],
    answer: "1822"
  },
  {
    question: "Quem foi o líder da Revolução Russa de 1917?",
    options: ["Joseph Stalin", "Leon Trotsky", "Vladimir Lenin", "Karl Marx"],
    answer: "Vladimir Lenin"
  },
  {
    question: "Qual império construiu as pirâmides do Egito?",
    options: ["Romano", "Grego", "Egípcio", "Persa"],
    answer: "Egípcio"
  },
  {
    question: "Em que ano a Segunda Guerra Mundial terminou?",
    options: ["1939", "1941", "1945", "1950"],
    answer: "1945"
  },
  {
    question: "Qual o nome do famoso navegador que chegou às Américas em 1492?",
    options: ["Vasco da Gama", "Fernão de Magalhães", "Cristóvão Colombo", "Pedro Álvares Cabral"],
    answer: "Cristóvão Colombo"
  },
  {
    question: "Qual a cidade onde ocorreu a Queda do Muro em 1989?",
    options: ["Moscou", "Berlim", "Paris", "Londres"],
    answer: "Berlim"
  },
  {
    question: "Qual o imperador romano conhecido por legalizar o cristianismo no Império?",
    options: ["Júlio César", "Augusto", "Constantino", "Nero"],
    answer: "Constantino"
  },
  {
    question: "Qual o nome da batalha que marcou o fim do império de Napoleão Bonaparte?",
    options: ["Batalha de Austerlitz", "Batalha de Borodino", "Batalha de Waterloo", "Batalha de Trafalgar"],
    answer: "Batalha de Waterloo"
  },
  {
    question: "Em que ano a escravidão foi abolida no Brasil?",
    options: ["1822", "1850", "1888", "1889"],
    answer: "1888"
  },
  {
    question: "Qual o nome da dinastia chinesa responsável pela construção da Grande Muralha?",
    options: ["Han", "Tang", "Ming", "Qin"],
    answer: "Qin"
  },
  {
    question: "Quem foi a rainha que governou a Inglaterra por mais tempo antes de Elizabeth II?",
    options: ["Maria I", "Elizabeth I", "Vitória", "Ana"],
    answer: "Vitória"
  },
  {
    question: "Qual a civilização antiga que desenvolveu a escrita cuneiforme?",
    options: ["Egípcia", "Grega", "Mesopotâmica", "Romana"],
    answer: "Mesopotâmica"
  },
  {
    question: "Qual o evento que marcou o início da Primeira Guerra Mundial?",
    options: ["Ataque a Pearl Harbor", "Invasão da Polônia", "Assassinato do Arquiduque Franz Ferdinand", "Queda do Muro de Berlim"],
    answer: "Assassinato do Arquiduque Franz Ferdinand"
  },
  {
    question: "Quem foi o líder do movimento pelos direitos civis nos EUA, famoso pelo discurso 'Eu Tenho um Sonho'?",
    options: ["Malcolm X", "Martin Luther King Jr.", "Rosa Parks", "Nelson Mandela"],
    answer: "Martin Luther King Jr."
  },
  {
    question: "Qual o nome do período histórico anterior à invenção da escrita?",
    options: ["Antiguidade", "Idade Média", "Pré-História", "Idade Moderna"],
    answer: "Pré-História"
  },
  {
    question: "Qual o tratado que encerrou oficialmente a Primeira Guerra Mundial?",
    options: ["Tratado de Tordesilhas", "Tratado de Versalhes", "Paz de Vestfália", "Tratado de Paris"],
    answer: "Tratado de Versalhes"
  },
  {
    question: "Qual o nome do movimento cultural e artístico que surgiu na Europa no século XIV, caracterizado pelo renascimento dos valores clássicos?",
    options: ["Barroco", "Iluminismo", "Renascimento", "Romantismo"],
    answer: "Renascimento"
  },
  {
    question: "Quem foi a última rainha do Egito Antigo, famosa por sua relação com Júlio César e Marco Antônio?",
    options: ["Nefertiti", "Hatshepsut", "Cleópatra", "Ankhesenamun"],
    answer: "Cleópatra"
  },
  {
    question: "Qual o nome do famoso explorador português que realizou a primeira circunavegação da Terra?",
    options: ["Vasco da Gama", "Bartolomeu Dias", "Pedro Álvares Cabral", "Fernão de Magalhães"],
    answer: "Fernão de Magalhães"
  },
  {
    question: "Qual a data da Proclamação da República no Brasil?",
    options: ["7 de setembro de 1822", "13 de maio de 1888", "15 de novembro de 1889", "21 de abril de 1792"],
    answer: "15 de novembro de 1889"
  },
  {
    question: "Qual o nome do líder nazista da Alemanha durante a Segunda Guerra Mundial?",
    options: ["Benito Mussolini", "Joseph Stalin", "Winston Churchill", "Adolf Hitler"],
    answer: "Adolf Hitler"
  },
  {
    question: "Qual o principal motivo da Revolução Francesa?",
    options: ["Disputas religiosas", "Crise econômica e desigualdade social", "Invasão estrangeira", "Ascensão da burguesia"],
    answer: "Crise econômica e desigualdade social"
  },
  {
    question: "Qual o nome da rota comercial que ligava o Ocidente ao Oriente na Antiguidade?",
    options: ["Rota da Pólvora", "Rota das Especiarias", "Rota da Seda", "Rota do Ouro"],
    answer: "Rota da Seda"
  },
  {
    question: "Quem foi o fundador do Império Mongol?",
    options: ["Kublai Khan", "Timur", "Átila, o Huno", "Genghis Khan"],
    answer: "Genghis Khan"
  },
  {
    question: "Qual a religião predominante no Império Romano antes do cristianismo?",
    options: ["Islamismo", "Judaísmo", "Politeísmo romano", "Budismo"],
    answer: "Politeísmo romano"
  },
  {
    question: "Qual o nome da Guerra Civil nos Estados Unidos?",
    options: ["Guerra de Secessão", "Guerra da Independência", "Guerra Fria", "Guerra do Vietnã"],
    answer: "Guerra de Secessão"
  },
  {
    question: "Qual a importância da Batalha de Maratona na história da Grécia Antiga?",
    options: ["Marcar o fim das Guerras Púnicas", "Vitória grega sobre os persas", "Unificação das cidades-estado gregas", "Início da Guerra do Peloponeso"],
    answer: "Vitória grega sobre os persas"
  },
  {
    question: "Quem foi o famoso imperador francês que liderou a França durante as Guerras Napoleônicas?",
    options: ["Luís XIV", "Robespierre", "Napoleão Bonaparte", "Carlos Magno"],
    answer: "Napoleão Bonaparte"
  },
  {
    question: "Qual o nome do famoso pensador grego, aluno de Platão e tutor de Alexandre, o Grande?",
    options: ["Sócrates", "Platão", "Aristóteles", "Heráclito"],
    answer: "Aristóteles"
  },

  // Geografia (aproximadamente 30 questões)
  {
    question: "Qual a capital do Canadá?",
    options: ["Toronto", "Montreal", "Vancouver", "Ottawa"],
    answer: "Ottawa"
  },
  {
    question: "Qual o nome da cordilheira mais alta do mundo?",
    options: ["Andes", "Rochosas", "Himalaias", "Alpes"],
    answer: "Himalaias"
  },
  {
    question: "Qual o rio mais longo do mundo?",
    options: ["Amazonas", "Nilo", "Yangtzé", "Mississippi"],
    answer: "Nilo"
  },
  {
    question: "Qual o nome do deserto mais árido do mundo?",
    options: ["Saara", "Gobi", "Atacama", "Kalahari"],
    answer: "Atacama"
  },
  {
    question: "Qual o nome do canal que liga o Oceano Atlântico ao Oceano Pacífico, localizado no Panamá?",
    options: ["Canal de Suez", "Canal da Mancha", "Canal do Panamá", "Estreito de Gibraltar"],
    answer: "Canal do Panamá"
  },
  {
    question: "Qual o nome do ponto mais alto da Terra?",
    options: ["Monte Fuji", "Monte Everest", "K2", "Monte Kilimanjaro"],
    answer: "Monte Everest"
  },
  {
    question: "Qual o país conhecido como 'País da Bota'?",
    options: ["Portugal", "Espanha", "Grécia", "Itália"],
    answer: "Itália"
  },
  {
    question: "Qual o nome do oceano que banha a costa leste do Brasil?",
    options: ["Oceano Pacífico", "Oceano Índico", "Oceano Atlântico", "Oceano Ártico"],
    answer: "Oceano Atlântico"
  },
  {
    question: "Qual o nome do conjunto de ilhas no Oceano Pacífico, famoso por suas praias paradisíacas?",
    options: ["Caribe", "Maldivas", "Polinésia Francesa", "Ilhas Galápagos"],
    answer: "Polinésia Francesa"
  },
  {
    question: "Qual a maior ilha do mundo?",
    options: ["Madagascar", "Nova Guiné", "Groenlândia", "Bornéu"],
    answer: "Groenlândia"
  },
  {
    question: "Qual o nome da linha imaginária que divide a Terra em hemisfério Norte e Sul?",
    options: ["Trópico de Câncer", "Círculo Polar Ártico", "Linha do Equador", "Meridiano de Greenwich"],
    answer: "Linha do Equador"
  },
  {
    question: "Qual o nome do estreito que separa a Ásia da América do Norte?",
    options: ["Estreito de Magalhães", "Estreito de Bering", "Estreito de Gibraltar", "Estreito de Sunda"],
    answer: "Estreito de Bering"
  },
  {
    question: "Qual a capital da Argentina?",
    options: ["Santiago", "Montevidéu", "Lima", "Buenos Aires"],
    answer: "Buenos Aires"
  },
  {
    question: "Qual o nome do fenômeno climático caracterizado pelo aquecimento anormal das águas do Oceano Pacífico?",
    options: ["La Niña", "El Niño", "Monções", "Ciclone"],
    answer: "El Niño"
  },
  {
    question: "Qual o país que possui a maior quantidade de vulcões ativos?",
    options: ["Japão", "Indonésia", "Estados Unidos", "Itália"],
    answer: "Indonésia"
  },
  {
    question: "Qual o nome do bioma caracterizado por grandes extensões de gramíneas, com árvores e arbustos esparsos, comum na África?",
    options: ["Tundra", "Floresta Temperada", "Savana", "Deserto"],
    answer: "Savana"
  },
  {
    question: "Qual o nome do mar que está localizado entre a Europa e a África?",
    options: ["Mar Negro", "Mar Vermelho", "Mar Mediterrâneo", "Mar Báltico"],
    answer: "Mar Mediterrâneo"
  },
  {
    question: "Qual o nome do conjunto de grandes massas de gelo que cobrem extensas áreas continentais?",
    options: ["Geleiras", "Icebergs", "Calotas polares", "Fiordes"],
    answer: "Calotas polares"
  },
  {
    question: "Qual a capital da África do Sul?",
    options: ["Cairo", "Joanesburgo", "Cidade do Cabo", "Nairóbi"],
    answer: "Cidade do Cabo" // África do Sul tem 3 capitais: Pretória (administrativa), Cidade do Cabo (legislativa) e Bloemfontein (judiciária). Cidade do Cabo é a mais comum em questões de conhecimento geral.
  },
  {
    question: "Qual o nome do fenômeno natural que cria as auroras boreais e austrais?",
    options: ["Tufões", "Erupções vulcânicas", "Tempestades solares", "Terremotos"],
    answer: "Tempestades solares"
  },
  {
    question: "Qual o nome do deserto que abrange grande parte do norte da África?",
    options: ["Deserto de Gobi", "Deserto do Atacama", "Deserto do Saara", "Deserto da Arábia"],
    answer: "Deserto do Saara"
  },
  {
    question: "Qual a principal atividade econômica da região amazônica?",
    options: ["Indústria", "Pecuária", "Agricultura de subsistência", "Exploração de recursos naturais"],
    answer: "Exploração de recursos naturais" // e agronegócio atualmente
  },
  {
    question: "Qual o nome do processo de desgaste e transporte de rochas e solos por agentes naturais?",
    options: ["Vulcanismo", "Tectonismo", "Erosão", "Sedimentação"],
    answer: "Erosão"
  },
  {
    question: "Qual o nome da península que engloba Portugal e Espanha?",
    options: ["Península Balcânica", "Península Itálica", "Península Ibérica", "Península Arábica"],
    answer: "Península Ibérica"
  },
  {
    question: "Qual o nome do fenômeno natural que causa a subida e descida do nível do mar?",
    options: ["Correntes marítimas", "Ondas", "Marés", "Tsunamis"],
    answer: "Marés"
  },
  {
    question: "Qual a capital do Egito?",
    options: ["Alexandria", "Luxor", "Cairo", "Gizé"],
    answer: "Cairo"
  },
  {
    question: "Qual o nome do ponto mais profundo dos oceanos?",
    options: ["Fossa das Marianas", "Fossa de Porto Rico", "Fossa de Java", "Fossa de Kermadec"],
    answer: "Fossa das Marianas"
  },
  {
    question: "Qual o país com maior número de fusos horários?",
    options: ["China", "Rússia", "Estados Unidos", "França (com territórios ultramarinos)"],
    answer: "França (com territórios ultramarinos)"
  },
  {
    question: "Qual o nome da linha imaginária que marca o início de um novo dia?",
    options: ["Meridiano de Greenwich", "Linha do Equador", "Linha Internacional da Data", "Trópico de Capricórnio"],
    answer: "Linha Internacional da Data"
  },
  {
    question: "Qual o nome do processo de formação de montanhas?",
    options: ["Vulcanismo", "Erosão", "Orogênese", "Intemperismo"],
    answer: "Orogênese"
  },

  // Ciências (aproximadamente 30 questões)
  {
    question: "Qual a unidade básica da vida?",
    options: ["Molécula", "Átomo", "Célula", "Tecido"],
    answer: "Célula"
  },
  {
    question: "Qual planeta é conhecido como 'Planeta Vermelho'?",
    options: ["Vênus", "Marte", "Júpiter", "Saturno"],
    answer: "Marte"
  },
  {
    question: "Qual a força que nos puxa para o centro da Terra?",
    options: ["Força centrífuga", "Força magnética", "Gravidade", "Força de atrito"],
    answer: "Gravidade"
  },
  {
    question: "Qual o principal componente do ar que respiramos?",
    options: ["Dióxido de carbono", "Oxigênio", "Nitrogênio", "Vapor d'água"],
    answer: "Nitrogênio"
  },
  {
    question: "Qual o nome do processo de transformação da lagarta em borboleta?",
    options: ["Evolução", "Adaptação", "Metamorfose", "Reprodução"],
    answer: "Metamorfose"
  },
  {
    question: "Qual o órgão responsável pela respiração nos seres humanos?",
    options: ["Coração", "Estômago", "Pulmões", "Rins"],
    answer: "Pulmões"
  },
  {
    question: "Qual o nome da estrela que é o centro do nosso Sistema Solar?",
    options: ["Alfa Centauri", "Sirius", "Sol", "Polaris"],
    answer: "Sol"
  },
  {
    question: "Qual o nome da camada da Terra onde ocorrem as placas tectônicas?",
    options: ["Núcleo", "Manto", "Crosta", "Atmosfera"],
    answer: "Crosta"
  },
  {
    question: "Qual o nome do processo pelo qual a água retorna à atmosfera em forma de vapor?",
    options: ["Precipitação", "Infiltração", "Transpiração", "Condensação"],
    answer: "Transpiração" // Nas plantas, e evaporação em geral
  },
  {
    question: "Qual o nome do cientista que formulou a Teoria da Relatividade?",
    options: ["Isaac Newton", "Charles Darwin", "Albert Einstein", "Marie Curie"],
    answer: "Albert Einstein"
  },
  {
    question: "Qual a função dos glóbulos vermelhos no sangue?",
    options: ["Combater infecções", "Coagulação do sangue", "Transportar oxigênio", "Produzir anticorpos"],
    answer: "Transportar oxigênio"
  },
  {
    question: "Qual o nome do fenômeno em que a luz se curva ao passar de um meio para outro?",
    options: ["Reflexão", "Absorção", "Refração", "Difração"],
    answer: "Refração"
  },
  {
    question: "Qual o principal gás presente na atmosfera de Vênus?",
    options: ["Oxigênio", "Nitrogênio", "Dióxido de carbono", "Metano"],
    answer: "Dióxido de carbono"
  },
  {
    question: "Qual o nome do processo pelo qual as rochas são quebradas em pedaços menores pela ação do vento, água ou gelo?",
    options: ["Sedimentação", "Erosão", "Intemperismo", "Vulcanismo"],
    answer: "Intemperismo"
  },
  {
    question: "Qual o nome da energia liberada pela divisão do núcleo de um átomo?",
    options: ["Energia solar", "Energia eólica", "Energia nuclear", "Energia geotérmica"],
    answer: "Energia nuclear"
  },
  {
    question: "Qual o nome do aparelho que nos permite ver objetos muito pequenos, como células?",
    options: ["Telescópio", "Microscópio", "Binóculo", "Estetoscópio"],
    answer: "Microscópio"
  },
  {
    question: "Qual o nome do sistema do corpo humano responsável pelo transporte de sangue e nutrientes?",
    options: ["Sistema nervoso", "Sistema respiratório", "Sistema circulatório", "Sistema digestório"],
    answer: "Sistema circulatório"
  },
  {
    question: "Qual o nome do cientista que propôs a teoria da evolução por seleção natural?",
    options: ["Gregor Mendel", "Louis Pasteur", "Charles Darwin", "Isaac Newton"],
    answer: "Charles Darwin"
  },
  {
    question: "Qual o nome da estrela mais próxima do Sol (além do próprio Sol)?",
    options: ["Sirius", "Proxima Centauri", "Alpha Centauri", "Vega"],
    answer: "Proxima Centauri"
  },
  {
    question: "Qual o nome do processo de formação de novas espécies a partir de uma espécie ancestral?",
    options: ["Adaptação", "Mutação", "Evolução", "Hibridização"],
    answer: "Evolução"
  },
  {
    question: "Qual o principal tipo de energia produzida pelo Sol?",
    options: ["Energia química", "Energia térmica", "Energia nuclear", "Energia eólica"],
    answer: "Energia nuclear" // via fusão nuclear
  },
  {
    question: "Qual o nome da camada protetora da atmosfera que filtra a radiação ultravioleta do Sol?",
    options: ["Troposfera", "Estratosfera (camada de ozônio)", "Mesosfera", "Ionosfera"],
    answer: "Estratosfera (camada de ozônio)"
  },
  {
    question: "Qual o tipo de rocha formada pelo resfriamento e solidificação do magma?",
    options: ["Rocha Sedimentar", "Rocha Metamórfica", "Rocha Ígnea", "Rocha Carbonática"],
    answer: "Rocha Ígnea"
  },
  {
    question: "Qual o nome do processo de liberação de energia dos alimentos nas células?",
    options: ["Fotossíntese", "Digestão", "Respiração celular", "Fermentação"],
    answer: "Respiração celular"
  },
  {
    question: "Qual o nome do gás essencial para a combustão?",
    options: ["Dióxido de Carbono", "Nitrogênio", "Hidrogênio", "Oxigênio"],
    answer: "Oxigênio"
  },
  {
    question: "Qual o nome da ciência que estuda os seres vivos?",
    options: ["Física", "Química", "Biologia", "Geologia"],
    answer: "Biologia"
  },
  {
    question: "Qual o principal sentido que o morcego usa para se locomover e caçar?",
    options: ["Visão", "Olfato", "Audição (ecolocalização)", "Tato"],
    answer: "Audição (ecolocalização)"
  },
  {
    question: "Qual o nome do fenômeno em que um objeto afunda ou flutua na água?",
    options: ["Tensão superficial", "Capilaridade", "Densidade", "Viscosidade"],
    answer: "Densidade"
  },
  {
    question: "Qual o nome da estrutura celular que armazena o material genético (DNA)?",
    options: ["Mitocôndria", "Cloroplasto", "Núcleo", "Ribossomo"],
    answer: "Núcleo"
  },
  {
    question: "Qual o nome do maior osso do corpo humano?",
    options: ["Tíbia", "Fíbula", "Fêmur", "Úmero"],
    answer: "Fêmur"
  },

  // Outras matérias / Variados (Língua Portuguesa, Atualidades, etc. - aproximadamente 30 questões)
  {
    question: "Qual o substantivo coletivo de abelhas?",
    options: ["Manada", "Cardume", "Colmeia", "Alcateia"],
    answer: "Colmeia"
  },
  {
    question: "Qual a classe gramatical da palavra 'bonito'?",
    options: ["Substantivo", "Verbo", "Adjetivo", "Advérbio"],
    answer: "Adjetivo"
  },
  {
    question: "Qual a função do adjetivo em uma frase?",
    options: ["Indicar ação", "Nomear seres", "Caracterizar substantivos", "Ligar palavras"],
    answer: "Caracterizar substantivos"
  },
  {
    question: "Qual o plural de 'cão'?",
    options: ["cães", "cãos", "cões", "canes"],
    answer: "cães"
  },
  {
    question: "Qual o nome da figura de linguagem que consiste em atribuir características humanas a seres inanimados?",
    options: ["Metáfora", "Comparação", "Personificação", "Hipérbole"],
    answer: "Personificação"
  },
  {
    question: "Quem escreveu 'Dom Casmurro'?",
    options: ["Machado de Assis", "José de Alencar", "Monteiro Lobato", "Clarice Lispector"],
    answer: "Machado de Assis"
  },
  {
    question: "Qual a capital da União Europeia?",
    options: ["Paris", "Roma", "Berlim", "Bruxelas"],
    answer: "Bruxelas"
  },
  {
    question: "Qual o maior produtor de café do mundo?",
    options: ["Colômbia", "Vietnã", "Brasil", "Etiópia"],
    answer: "Brasil"
  },
  {
    question: "Qual o nome da organização internacional que zela pela paz e segurança mundial?",
    options: ["OTAN", "Mercosul", "ONU", "OMS"],
    answer: "ONU"
  },
  {
    question: "Qual o nome da rede social mais usada para compartilhamento de vídeos?",
    options: ["Facebook", "Instagram", "TikTok", "YouTube"],
    answer: "YouTube"
  },
  {
    question: "Qual o nome do processo de votação popular para decidir sobre uma lei ou tema importante?",
    options: ["Eleição", "Plebiscito", "Referendo", "Debate"],
    answer: "Plebiscito"
  },
  {
    question: "Qual a sigla do Produto Interno Bruto?",
    options: ["PIB", "IPC", "IDH", "PPA"],
    answer: "PIB"
  },
  {
    question: "Qual o nome do cientista que criou a vacina contra a raiva?",
    options: ["Alexander Fleming", "Louis Pasteur", "Edward Jenner", "Robert Koch"],
    answer: "Louis Pasteur"
  },
  {
    question: "Qual o nome do dispositivo eletrônico usado para guardar informações e executar programas?",
    options: ["Celular", "Televisão", "Computador", "Rádio"],
    answer: "Computador"
  },
  {
    question: "Qual o nome do programa de computador que permite navegar na internet?",
    options: ["Word", "Excel", "Navegador (Browser)", "PowerPoint"],
    answer: "Navegador (Browser)"
  },
  {
    question: "Qual o nome da lei que garante os direitos autorais de obras artísticas e intelectuais?",
    options: ["Lei de Patentes", "Lei da Propriedade Industrial", "Lei de Direitos Autorais", "Lei de Marcas"],
    answer: "Lei de Direitos Autorais"
  },
  {
    question: "Qual o nome da doença que se espalhou rapidamente pelo mundo em 2020?",
    options: ["Gripe Suína", "Ebola", "COVID-19", "Zika"],
    answer: "COVID-19"
  },
  {
    question: "Qual o nome da organização que regulamenta o comércio internacional?",
    options: ["FMI", "Banco Mundial", "OMC", "G7"],
    answer: "OMC"
  },
  {
    question: "Qual o nome do processo de uso da internet para comprar e vender produtos?",
    options: ["Comércio justo", "Marketing digital", "E-commerce", "Telemarketing"],
    answer: "E-commerce"
  },
  {
    question: "Qual o nome do instrumento musical de cordas que é tocado com os dedos ou palheta?",
    options: ["Violino", "Violoncelo", "Guitarra", "Piano"],
    answer: "Guitarra"
  },
  {
    question: "Qual o nome do símbolo que representa a paz e o desarmamento nuclear?",
    options: ["Estrela de Davi", "Cruz", "Símbolo da Paz (Peace Sign)", "Yin e Yang"],
    answer: "Símbolo da Paz (Peace Sign)"
  },
  {
    question: "Qual o nome do tipo de energia gerada pelo movimento do vento?",
    options: ["Solar", "Hidrelétrica", "Eólica", "Geotérmica"],
    answer: "Eólica"
  },
  {
    question: "Qual o nome da disciplina que estuda o comportamento humano em sociedade?",
    options: ["Economia", "Antropologia", "Sociologia", "Psicologia"],
    answer: "Sociologia"
  },
  {
    question: "Qual o nome da estrutura que armazena água em uma planta?",
    options: ["Cloroplasto", "Núcleo", "Vacúolo", "Parede celular"],
    answer: "Vacúolo"
  },
  {
    question: "Qual o nome do bioma brasileiro caracterizado por árvores de pequeno porte e arbustos retorcidos?",
    options: ["Floresta Amazônica", "Pantanal", "Cerrado", "Mata Atlântica"],
    answer: "Cerrado"
  },
  {
    question: "Qual o nome da ciência que estuda o universo e os corpos celestes?",
    options: ["Geologia", "Meteorologia", "Astronomia", "Oceanografia"],
    answer: "Astronomia"
  },
  {
    question: "Qual o nome da primeira mulher a viajar para o espaço?",
    options: ["Valentina Tereshkova", "Sally Ride", "Mae C. Jemison", "Ellen Ochoa"],
    answer: "Valentina Tereshkova"
  },
  {
    question: "Qual o nome do tipo de energia gerada pelo calor do interior da Terra?",
    options: ["Energia solar", "Energia eólica", "Energia hidrelétrica", "Energia geotérmica"],
    answer: "Energia geotérmica"
  },
  {
    question: "Qual o nome da tecnologia que permite a conexão de dispositivos sem fio em curtas distâncias?",
    options: ["Wi-Fi", "Ethernet", "Bluetooth", "NFC"],
    answer: "Bluetooth"
  },
  {
    question: "Qual o nome do tipo de governo em que o poder é exercido pelo povo, diretamente ou por meio de representantes eleitos?",
    options: ["Monarquia", "Ditadura", "Oligarquia", "Democracia"],
    answer: "Democracia"
  },


  {
    question: "Qual o nome do maior deserto do mundo em precipitação anual?",
    options: ["Saara", "Atacama", "Gobi", "Antártico"],
    answer: "Atacama"
  }



			
            // Adicione mais perguntas aqui para chegar a mais de 50
        ];
        // Embaralha as perguntas
        quizQuestions = quizQuestions.sort(() => Math.random() - 0.5);
    };


    const displayQuestion = () => {
        if (currentQuestionIndex >= quizQuestions.length) {
            endQuiz();
            return;
        }

        const questionData = quizQuestions[currentQuestionIndex];
        quizQuestion.textContent = questionData.question;
        quizOptions.innerHTML = ''; // Limpa as opções anteriores
        currentOptions = [...questionData.options]; // Copia as opções para manipulação

        // Embaralha as opções para que a resposta não esteja sempre na mesma posição
        currentOptions.sort(() => Math.random() - 0.5);

        currentOptions.forEach(option => {
            const optionDiv = document.createElement('div');
            optionDiv.classList.add('quiz-option');
            optionDiv.textContent = option;
            optionDiv.addEventListener('click', () => selectOption(optionDiv, option, questionData.answer));
            quizOptions.appendChild(optionDiv);
        });

        // Habilita/desabilita botão de ajuda
        quizHelpButton.disabled = helpUses === 0;
        quizHelpButton.classList.toggle('disabled', helpUses === 0);
        helpCountSpan.textContent = helpUses;

        // Reinicia o estado dos botões de controle
        quizNextButton.disabled = true; // Desabilita até uma resposta ser selecionada
        quizSkipButton.disabled = false;
    };

    const selectOption = (selectedOptionDiv, selectedAnswer, correctAnswer) => {
        // Desabilita todas as opções após uma seleção
        Array.from(quizOptions.children).forEach(option => {
            option.classList.add('disabled');
            option.style.pointerEvents = 'none';
        });

        quizNextButton.disabled = false; // Habilita o botão "Próxima Pergunta"

        if (selectedAnswer === correctAnswer) {
            score += Math.round(780/ quizQuestions.length); // Pontuação proporcional
            if (score > 780) score = 780; // Garante que a nota não passe de 100
            currentScoreSpan.textContent = score;
            selectedOptionDiv.classList.add('correct');
            showFeedback(true);
        } else {
            selectedOptionDiv.classList.add('wrong');
            // Encontrar e marcar a resposta correta
            Array.from(quizOptions.children).forEach(option => {
                if (option.textContent === correctAnswer) {
                    option.classList.add('correct');
                }
            });
            showFeedback(false);
        }
    };

    const showFeedback = (isCorrect) => {
        const images = isCorrect ? happyImages : sadImages;
        const sounds = isCorrect ? happySounds : sadSounds;

        feedbackImage.src = images[Math.floor(Math.random() * images.length)];
        feedbackSound.src = sounds[Math.floor(Math.random() * sounds.length)];

        feedbackResult.classList.add('active');
        feedbackSound.play();

        // Esconde o feedback após alguns segundos
        setTimeout(() => {
            feedbackResult.classList.remove('active');
            feedbackSound.pause();
            feedbackSound.currentTime = 0; // Reseta o som
        }, 3000); // 2 segundos
    };

    const nextQuestion = () => {
        currentQuestionIndex++;
        displayQuestion();
    };

    const skipQuestion = () => {
        score -= Math.round(780 / quizQuestions.length / 2); // Penalidade por pular
        if (score < 0) score = 0;
        currentScoreSpan.textContent = score;
        nextQuestion();
    };

    const useHelp = () => {
        if (helpUses > 0) {
            helpUses--;
            helpCountSpan.textContent = helpUses;
            quizHelpButton.classList.toggle('disabled', helpUses === 0);

            let wrongOptions = Array.from(quizOptions.children).filter(option =>
                option.textContent !== quizQuestions[currentQuestionIndex].answer &&
                !option.classList.contains('disabled') // Apenas opções não desabilitadas
            );

            // Se houver mais de 2 opções erradas, remova 2
            if (wrongOptions.length > 2) {
                // Remove duas opções erradas aleatoriamente
                for (let i = 0; i < 2; i++) {
                    const randomIndex = Math.floor(Math.random() * wrongOptions.length);
                    wrongOptions[randomIndex].classList.add('disabled');
                    wrongOptions[randomIndex].style.pointerEvents = 'none';
                    wrongOptions.splice(randomIndex, 1); // Remove do array temporário para não selecionar novamente
                }
            } else if (wrongOptions.length > 0) { // Se houver 1 ou 2 opções erradas, remove todas
                 wrongOptions.forEach(option => {
                    option.classList.add('disabled');
                    option.style.pointerEvents = 'none';
                });
            }
        }
    };

    const endQuiz = () => {
        quizQuestion.textContent = `Quiz Finalizado! Sua pontuação final foi: ${score} / 780`;
        quizOptions.innerHTML = '';
        quizControls.innerHTML = ''; // Remove os botões
    };

    quizNextButton.addEventListener('click', nextQuestion);
    quizSkipButton.addEventListener('click', skipQuestion);
    quizHelpButton.addEventListener('click', useHelp);

    // Inicia o quiz
    loadQuizQuestions().then(() => {
        displayQuestion();
    });
});
