# TikTok Shop Magic Prompt Generator ✨

Uma aplicação web moderna para gerar prompts de vídeo otimizados para TikTok Shop usando Google Gemini Vision AI.

## 🆕 Novidades - Versão 2.0

### Três Geradores em Um!
- **👩🦳 Criar Influencer**: Gere templates JSON para influencers virtuais hiper-realistas
- **👗 Moda & Look**: Upload de foto da roupa + análise automática para vídeos de mirror selfie
- **✋ POV Produto**: Upload do produto + análise visual para vídeos POV/unboxing

### Gemini Vision AI
- Análise automática de imagens
- Identificação de produtos, cores, texturas e materiais
- Prompts personalizados baseados no conteúdo visual

### Upload de Imagens
- Drag & drop intuitivo
- Validação automática (JPG/PNG, máx 5MB)
- Preview em tempo real

---

## 🚀 Instalação

### Pré-requisitos
- Node.js 18+ e npm instalados

### Passo 1: Instalar Node.js
Se você ainda não tem o Node.js instalado, baixe e instale de:
https://nodejs.org/

### Passo 2: Instalar Dependências
```bash
npm install
```

**Dependências principais:**
- Next.js 14 (App Router)
- Google Generative AI SDK
- React Dropzone (upload de imagens)
- Framer Motion (animações)
- Lucide React (ícones)

### Passo 3: Configurar API Key
1. Crie um arquivo `.env.local` na raiz do projeto
2. Adicione sua chave API do Gemini:

```
GEMINI_API_KEY=sua_chave_api_aqui
```

Para obter uma chave API gratuita do Google Gemini:
https://aistudio.google.com/app/apikey

> ⚠️ **Importante**: Certifique-se de que sua chave tem acesso aos modelos com visão (gemini-1.5-flash ou gemini-2.5-flash).

### Passo 4: Executar
```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 📋 Como Usar

### Tab 1: Criar Influencer 👩🦳
1. Selecione a aba "Criar Influencer"
2. Preencha:
   - **Idade**: ex: "25-30"
   - **Cor do Cabelo**: ex: "Castanho claro"
   - **Estilo**: Escolha no dropdown (Clean, Fitness, Fashion, etc.)
3. Clique em **"Gerar Influencer AI"**
4. Copie o template JSON gerado
5. Use em geradores de imagem (Midjourney, DALL-E, Leonardo AI)

### Tab 2: Moda & Look 👗
1. Selecione a aba "Moda & Look"
2. **Faça upload** de uma foto da roupa/look (arraste ou clique)
3. (Opcional) Adicione notas de estilo
4. Clique em **"Gerar Vídeo Fashion"**
5. Gemini analisa a imagem e gera um prompt de mirror selfie
6. Copie e cole em Kling, Luma, Runway, etc.

### Tab 3: POV Produto ✋
1. Selecione a aba "POV Produto"
2. **Faça upload** de uma foto do produto
3. **Digite o benefício principal** (ex: "Qualidade incrível!")
4. Clique em **"Gerar POV Produto"**
5. Gemini identifica o produto e cria um prompt POV
6. Copie e use em geradores de vídeo AI

---

## 🛠️ Stack Tecnológica

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (animações)
- **Google Gemini Vision AI** (análise multimodal)
- **React Dropzone** (upload de imagens)
- **Lucide Icons**

---

## 📦 Build para Produção

```bash
npm run build
npm start
```

---

## 🎨 Features

✨ UI Premium com Dark Mode  
🎯 Três geradores especializados  
📸 Upload de imagens com drag & drop  
🤖 Análise automática com Gemini Vision  
🎬 Prompts otimizados para vídeos virais  
📱 Design Mobile-First responsivo  
⚡ Respostas rápidas com Gemini Flash  
📋 Copiar com um clique  
🌊 Animações suaves com Framer Motion  
🔄 Navegação por abas fluida

---

## 🎯 Casos de Uso

### Influencer Virtual
Crie personas consistentes para sua marca com especificações técnicas detalhadas em JSON.

### Vídeos de Moda
Transforme fotos de looks em prompts para vídeos de provador/mirror selfie com análise automática do outfit.

### Demonstração de Produtos
Gere vídeos POV profissionais com análise visual do produto e script em português.

---

## 🔧 Personalização

Você pode facilmente customizar:
- **Cores**: Edite os gradientes em `tailwind.config.ts` e `globals.css`
- **Prompts do Sistema**: Modifique a lógica em `app/api/generate/route.ts`
- **Animações**: Ajuste as configurações do Framer Motion em `app/page.tsx`
- **Fontes**: Altere a fonte em `app/layout.tsx`
- **Limite de Upload**: Modifique `maxSize` em `components/ImageUpload.tsx`

---

## 📄 Estrutura de Arquivos

```
app/
├── api/generate/route.ts    # API com Gemini Vision
├── page.tsx                 # Interface com tabs
├── layout.tsx               # Layout raiz
└── globals.css              # Estilos globais

components/
├── TabNavigation.tsx        # Navegação por abas
├── ImageUpload.tsx          # Upload de imagens
└── tabs/
    ├── InfluencerTab.tsx    # Tab 1
    ├── FashionTab.tsx       # Tab 2
    └── POVProductTab.tsx    # Tab 3
```

---

## ⚠️ Notas Importantes

- **Tamanho de Arquivo**: Limite de 5MB para imagens
- **Formatos Aceitos**: JPG, PNG
- **Qualidade das Fotos**: Use imagens claras e bem iluminadas para melhor análise
- **API Key**: Nunca commite o arquivo `.env.local` no Git

---

## 🌐 Deploy

Recomendado: [Vercel](https://vercel.com) (criadores do Next.js)

1. Push o código para GitHub
2. Conecte no Vercel
3. Adicione `GEMINI_API_KEY` nas variáveis de ambiente
4. Deploy automático!

---

**Desenvolvido com 💜 para criadores de conteúdo TikTok Shop**

Versão 2.0 - Agora com Gemini Vision AI! 🚀✨
