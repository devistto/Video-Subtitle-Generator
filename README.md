## Video Subtitle Generator

Geração automática de legendas em vídeos utilizando transcrição local com Whisper e processamento assíncrono baseado em filas.

[Vídeo demonstração](https://www.linkedin.com/posts/devistto_fala-galera-desenvolvi-essa-api-com-nodejs-ugcPost-7450981626425077760-PZ5l/)

### Introdução
O objetivo deste projeto é automatizar todo o processo de legendagem de vídeos.

O usuário envia um vídeo para a API, que realiza o processamento em segundo plano através de uma fila. O sistema extrai o áudio, gera a transcrição utilizando Whisper executado localmente, cria um arquivo .srt, incorpora as legendas ao vídeo original e disponibiliza o resultado final para download.

Durante todo o processo, o cliente recebe atualizações de status em tempo real via WebSocket.

### Funcionalidades
- Upload de vídeos
- Processamento assíncrono utilizando filas
- Extração automática de áudio
- Transcrição local com Whisper
- Geração de arquivos .srt
- Inserção ("burn-in") de legendas no vídeo
- Atualização de status em tempo real
- Limpeza automática de arquivos temporários
- Execução isolada via Docker

### Tecnologias
#### Backend
- NestJS
- Node.js
- TypeScript
- Socket.IO

#### Processamento Assíncrono
- Redis
- BullMQ

#### Processamento de Mídia
- FFmpeg
- FFprobe
- Whisper

#### Infraestrutura-  
- Docker
- Docker Compose

#### Ferramentas
- Git
#### Frontend
- HTML
- CSS
- JavaScript

### Instalação
Clonar o repositório
```bash
git clone https://github.com/devistto/video-subtitle-generator.git
```
Acessar o diretório
```bash
cd video-subtitle-generator
```

Subir os containers
```bash
docker compose up --build
```

### Licença
Este projeto foi desenvolvido para fins de estudo e portfólio.
