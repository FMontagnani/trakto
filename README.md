# Trakto - Processador de Imagens

## Objetivo

O presente repositório tem por objetivo resolver o problema descrito no arquivo [DESAFIO.md](./DESAFIO.md).

### Arquitetura da Solução

A arquitetura da solução se deu conforme diagrama abaixo:

![Diagrama](Tratko_Image.drawio.svg)

1. Clientes iniciam o fluxo por meio de requisição HTTP (tanto web clientes como outros servidores).
2. API Gateway recebe a requisição, autentica os usuários e encaminha para o App (express).
3. App recebe requisição, gera e persiste uma id no banco e carrega o arquivo recebido no S3.
4. Banco de dados persiste inicialmente o id e o status da task, e será futuramente hidratado com os dados do consumer. 
5. O Bucket recebe o arquivo temporário e invoca uma Lambda Function que atua como producer, 
6. Producer envia uma mensagem contendo apenas a id do objeto criado no bucket ao broker.
7.Broker encaminha menagem ao consumer.
8. Consumer recebe a mensagem, consume o arquivo temporário do bucket, gera as imagens otimizadas e finaliza o processo atualizando os dados no banco e fazendo upload das imagens processadas no bucket. O arquivo original é excluído após o término da operação.

No desafio nada foi especificidado sobre o client da aplicação, muito menos requisitos mínimos de segurança, por este motivo apenas para fins de ilustração foram incluídos 2 possíveis _clients_ da aplicação: um web-app e outro servidor de aplicação, com formatos de autenticação sugeridos no diagrama.

O objetivo de carregar a imagem imediatamente no Bucket S3 utilizando o **CLAIM-CHECK** _pattern_ visa mitigar uma possível perda de dados, caso o a instância que recebeu a requisição por algum motivo venha a "morrer" antes do processamento ser concluído pelo consumer existe a possibilidade de perder os dados de forma irreparável.
