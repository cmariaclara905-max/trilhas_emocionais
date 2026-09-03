# Trilhas Socioemocionais

Protótipo responsivo para o acompanhamento pedagógico socioemocional de estudantes. A aplicação foi construída para demonstrar os fluxos principais de professores e da equipe gestora, usando somente dados fictícios.

## Como abrir

Abra o arquivo `index.html` em qualquer navegador moderno. Não há instalação nem servidor necessário para esta versão.

## Publicação para a comunidade UNIS

O projeto já possui o fluxo de publicação em GitHub Pages em `.github/workflows/deploy-pages.yml`.

1. Crie um repositório no GitHub e envie estes arquivos para a branch `main`.
2. Em **Settings → Pages**, selecione **GitHub Actions** como fonte de publicação.
3. Crie um projeto no Firebase e ative Authentication para o provedor institucional escolhido.
4. Copie `firebase-config.example.js` para `firebase-config.js` e preencha as credenciais públicas do Firebase.
5. No Firebase Authentication, restrinja o login aos domínios `unis.edu.br` e `alunos.edu.br`.

GitHub Pages hospeda o site, mas a restrição por domínio precisa ser aplicada pela autenticação Firebase; uma verificação feita apenas no navegador não protege dados pedagógicos.

Na tela inicial, escolha **Professor(a)** ou **Direção**. O perfil de professor vê apenas a turma 2º ano A; a direção visualiza toda a escola demonstrativa.

## Recursos disponíveis

- Painéis diferentes para professor e direção;
- Listagem de alunos e histórico pedagógico;
- Formulário quinzenal de acompanhamento;
- Planejamento de 15 dias gerado por regras pedagógicas simples;
- Sugestões de atividades, leitura infantil, roda de conversa e relação com a BNCC;
- Relatórios de habilidades socioemocionais;
- Avisos de confidencialidade e linguagem de observação pedagógica contextualizada.

## Estrutura

- `index.html`: estrutura da aplicação;
- `style.css`: identidade visual e adaptação para telas menores;
- `app.js`: dados fictícios, telas, permissões demonstrativas, navegação e recomendações.

Os registros criados durante a demonstração são mantidos no armazenamento local do navegador. Em uma versão de produção, esse armazenamento deve ser substituído por uma base de dados protegida, autenticação real e regras de acesso alinhadas à LGPD.

