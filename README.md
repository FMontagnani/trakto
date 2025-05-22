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

Vale destacar que a implemetação do API Gateway foi meramente ilustrativa no diagrama, no repositório a solução está configurada para executar localmente por meio de containers.

### Stack utilizada

- Docker para containerização do APP
- Typescript para desenvolvimento da aplicação

### Estrutura do Diretório

```
.
├── src
    ├── adapters
    │   ├── api
    │   ├── lambda
    │   ├── mongo
    │   ├── rabbitmq
    │   └── s3
    ├── config
    ├── core
    │   ├── entities
    │   ├── errors
    │   ├── factories
    │   └── image-processor
    ├── ports
    │   ├── input
    │   └── output
    └── types
```

- **adapters**: componentes que se comunicam com a infra/tecnologia utilizada, implementam portas de entrada/saída que foram definidas no diretório "ports".
- **config**: arquivos de configuração do app.
- **core**: camada de aplicação, implementam regras de negócio de forma agnóstica a infraestrutura utilizada.
- **ports**: definem interfaces de comunicação entre a camada core e as tecnologias, uma mesma porta pode ser utilizada para dois tipos de tecnologia (exemplo, uma interface de repositório pode ter um adapter para MongoDB e outro para Postgres)
- **types**: tipos específicos do projeto.

### Configuração

1. Clonar o repositório.
2. Instalar a CLI [awslocal](https://github.com/localstack/awscli-local) (opcional) ou a CLI da [aws](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html) (obrigatório).
2. Instalar as dependências: `$ npm i` .
3. Adicionar permissão de execução para o arquivo scripts.sh: `$ sudo chmod +ux scripts.sh` .
4. Executar o script de setup: `$ ./scripts.sh setup` .
5. Compilar o projeto: `$ npm run build` .
5. Executar localmente: `$ npm run build` .

### Testando a aplicação

Após as etapas de configuração:

1. Realizar o upload de uma imagem:

  `$ curl -F fileName={nome_arquivo.extensao_arquivo} -F file=@{caminho_para_arquivo} -X POST http://localhost:3000/api/tasks`

2. Consultar o status do processamento:

 `$ curl http://localhost:3000/api/tasks/idDaImagem`

3. Consultar arquivos no bucket local:

`$ awslocal s3 cp s3://trakto/low_{id_da_imagem}.jpeg low_copy.jpeg` -> baixa resolução
`$ awslocal s3 cp s3://trakto/mid_{id_da_imagem}.jpeg low_copy.jpeg` -> média resolução
`$ awslocal s3 cp s3://trakto/high_optimized_{id_da_imagem}.jpeg low_copy.jpeg` -> alta resolução

## Considerações

A solução não está completa, o prazo encerrou e não tive mais tempo para trabalhar nesse desafio, mesmo assim gostei bastante da proposta pois me permitiu revisitar algumas tecnologias que não trabalhava a algum tempo.

A idéia inicial era de usar AWS Mq, porém o serviço não existe na versão community do Localstack, fui descobrir isso um pouco tarde e acabou comprometendo o tempo para a entrega final.

Também tive alguns problemas para executar o APP dentro do container do Docker, embora o código transpilado rode na máquina local.
