# **🧠 1. Visão do Produto**

- Qual é o objetivo principal do app?
    - Online as vezes é muito burocratico, banco, quero criar uma solução rapida que com dois cliques voce esta no app, sem login chato, sem nada, mas moderno, com design minimalista que com ou sem internet ele roda normalmente.
- Qual problema ele resolve melhor que outros?
    - As vezes estou com sinal ruim e demora para funcionar, ou carrega demorado, pesado demais na web, login chato, configurando banco, algo que eu como dev quero fazer para uso própio de primeiro momento.
- O foco é simplicidade ou poder (feature-rich)?
    - Quando juntamos os dois temos uma solução bem inovadora, quero algo intuitivo, mas com poder de tecnologia mais recente, como pedir para IA fazer coisas dentro do app, mas é uma Feature mais para frente.
- Qual é o perfil do usuário (no teu caso: você, mas detalhe seu comportamento)?
    - Perfil é um estudante, dev junior, obvio publico alvo é um programador que trabalha home office, mas pode ser usado por qualquer pessoa, ideia é centralizar todas atividades de um programador, no meu caso, preciso ir academia, tenho entrevistas, entregas, fazer almoço, preciso de timer, gostaria de metrificar meus rendimentos, dividir por cadeiras, quanto tempo preciso estudar de tempo de cada materia, qual materia mais dificil, quanto tempo eu tenho ocioso depois de colocar todas minhas atividades do dia, da semana, lembretes um dia antes.

---

# **🎯 2. Escopo do MVP**

- Qual é o mínimo necessário para o app funcionar bem?
    - Criar tarefas, ser notificado de tarefas um dia antes, como um planejamento do próximo dia, criar lembretes, criar atividades cotidianas, um timer.
- O que NÃO vai entrar na versão 1?
    - Algo que envolva IA

---

## **1. 📌 Nome do Projeto**

*Nook*

---

## **2. 🧠 Visão Geral**

Este projeto consiste no desenvolvimento de um aplicativo desktop de gerenciamento de tarefas, construído com Electron, com foco em desempenho, simplicidade e funcionamento offline.

A proposta é oferecer uma alternativa às ferramentas tradicionais baseadas em web, eliminando dependências como login, conexão constante com a internet e carregamentos lentos. O sistema será projetado para iniciar rapidamente e permitir que o usuário organize suas atividades de forma direta e eficiente.

---

## **3. 🎯 Objetivo**

Desenvolver uma aplicação que permita:

- Gerenciar tarefas de forma simples e rápida
- Planejar atividades diárias e semanais
- Monitorar o tempo gasto em tarefas
- Melhorar a produtividade pessoal
- Funcionar totalmente offline

---

## **4. 👤 Público-Alvo**

- Estudantes universitários
- Desenvolvedores (principal foco)
- Profissionais em home office
- Usuários que buscam produtividade sem distrações

---

## **5. 🚨 Problema**

Aplicações atuais de gerenciamento de tarefas apresentam:

- Dependência de internet
- Necessidade de login e autenticação
- Interfaces complexas ou sobrecarregadas
- Baixo desempenho em conexões instáveis

---

## **6. 💡 Solução**

O sistema propõe:

- Aplicação desktop local (offline-first)
- Interface minimalista e intuitiva
- Inicialização rápida (baixo tempo de abertura)
- Experiência fluida inspirada em apps nativos

---

## **7. 🧩 Funcionalidades**

### **7.1 Funcionalidades Principais (MVP)**

- Criar, editar e excluir tarefas
- Marcar tarefas como concluídas
- Definir datas para tarefas
- Criar lembretes (ex: 1 dia antes)
- Timer para controle de tempo
- Visualização de tarefas do dia

---

### **7.2 Funcionalidades Futuras**

- Métricas de produtividade
- Estatísticas de tempo por atividade
- Classificação de dificuldade de tarefas
- Planejamento automático
- Integração com inteligência artificial

---

## **8. 🏗️ Arquitetura do Sistema**

O sistema será dividido em:

### **🔹 Frontend**

- Responsável pela interface do usuário
- Desenvolvido com React + TypeScript

### **🔹 Backend Local (Electron)**

- Gerenciamento da aplicação desktop
- Comunicação com o sistema operacional

### **🔹 Armazenamento**

- Banco local SQLite
- Persistência de dados offline

---

## **9. 💾 Modelo de Dados (visão inicial)**

### **Tarefa:**

- id
- título
- descrição
- data
- status (pendente/concluída)
- tempo estimado
- tempo gasto

### **Sessão de Tempo:**

- id
- taskId
- início
- fim

---

## **10. 🎨 Design e Experiência do Usuário**

O design será baseado em:

- Minimalismo (baixo ruído visual)
- Inspiração em aplicações nativas do macOS
- Uso de dark mode com cores suaves
- Tipografia clara e legível
- Foco em usabilidade e rapidez

---

## **11. ⚡ Requisitos Não Funcionais**

- Tempo de inicialização rápido (< 1s ideal)
- Funcionar 100% offline
- Interface responsiva e fluida
- Baixo consumo de recursos
- Facilidade de uso (UX simples)

---

## **12. 🛠️ Tecnologias**

- Electron
- React
- TypeScript
- Tailwind CSS
- SQLite (ou alternativa local)

---

## **13. 🚀 Diferenciais**

- Funcionamento offline completo
- Sem necessidade de autenticação
- Interface inspirada em apps nativos
- Integração entre tarefas e controle de tempo
- Foco em produtividade real

---

## **14. 📈 Possíveis Evoluções**

- Versão mobile
- Sincronização opcional (cloud)
- Inteligência artificial para sugestões
- Dashboard avançado de produtividade