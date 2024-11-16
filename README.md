# API do projeto FinderApp

## SUMARIO
* [USUARIO](#usuario)
* [GOSTO](#gosto)
* [INTERESSE](#interesse)
* [CURTIR](#curtir)
* [CHAT](#chat)
* [MENSAGEM](#mensagem)
* [LOCALIZAÇÃO](#localizacao)

# USUARIO <span id="usuario"></span>

## Cadastro

### POST - ROTA: "/usuario/cadastro"

REQUISIÇÃO:

```
{
  "nome": string,
  "email": string,
  "senha": string,
  "datanascimento": string - (yyyy-mm-dd),
  "profissao": string,
  "escolaridade": string,
  "descricao": string,
  "imgperfil": string
}
```

RETORNOS:
* 200
```
{
  "id": int,
  "msg": "Cadastrado"
}
```

* 500
```
{
  "msg": error
}
```

## Editar

### POST - ROTA: "/usuario/editar"

REQUISIÇÃO:

```
{
  "id": string, /* OBRIGATORIO
  "nome": string,
  "email": string,
  "senha": string,
  "datanascimento": string - (yyyy-mm-dd),
  "profissao": string,
  "escolaridade": string,
  "descricao": string
}
```

RETORNOS:
* 200
```
{
  "msg": "Usuario editado"
}
```

* 400
```
{
  "msg": "Nenhum valor enviado para edição"
}
```

* 500
```
{
  "msg": error
}
```

## Associar um interesse/gosto a um usuario

### POST - ROTA: "/usuario/associarInteGos"

REQUISIÇÃO:

```
{
  "usuario": int,
  "gostos": [string, string, ...],
  "interesses": [string, string, ...]
}
```

RETORNOS:
* 200
```
{
  "msg": "Associado"
}
```

* 500
```
{
  "msg": error
}
```

## Editar um interesse/gosto de um usuario

### POST - ROTA: "/usuario/editarInteGos"

REQUISIÇÃO:

```
{
  "usuario": int,
  "gostosAntigos": [int, int, ...],
  "gostos": [string, string, ...],
  "interesesAntigos": [int, int, ...],
  "interesses": [string, string, ...]
}
```

RETORNOS:
* 200
```
{
  "msg": "Editado"
}
```

* 500
```
{
  "msg": error
}
```

## LISTA

### GET - ROTA: "/usuario/lista"

REQUISIÇÃO:
```
none
```

RETORNOS:
* 200
```
{
  "usuarios": [
      {
        "id": int,
        "nome": string,
        "email": string,
        "senha": string,
        "datanascimento": string - (yyyy-mm-ddT00:00:00.000Z),
        "profissao": string,
        "escolaridade": string,
        "descricao": string,
        "imgperfil": string
      },
      ...
  ]
}
```

* 500
```
{
  "msg": error
}
```

## LOGIN

### GET - ROTA: "/usuario/login"

REQUISIÇÃO:
```
/usuario/login?email={string}&senha={string}
```

RETORNOS:
* 200
```
{
  "idUsuario": int,
  "msg": "Usuário encontrado"
}
```

* 404
```
{
  "msg": "Email ou Senha incorretos"
}
```

* 500
```
{
  "msg": error
}
```

## GET UM USUÁRIO

### GET - ROTA: "/usuario/getUmUsuario"

REQUISIÇÃO:
```
/usuario/getUmUsuario?id={int}
```

RETORNOS:
* 200
```
{
  "Usuario": {
        "id": int,
        "nome": string,
        "email": string,
        "senha": string,
        "datanascimento": string - (yyyy-mm-ddT00:00:00.000Z),
        "profissao": string,
        "escolaridade": string,
        "descricao": string,
        "imgperfil": string
      },
  "msg": "Usuário encontrado"
}
```

* 404
```
{
  "msg": "Esse usuário não existe!"
}
```

* 500
```
{
  "msg": error
}
```

## GET INTERESSES USUARIO

### GET - ROTA: "/usuario/getInteressesUsuario"

REQUISIÇÃO:
```
/usuario/getInteressesUsuario?usuarioId={int}
```

RETORNOS:
* 200
```
{
	"Interesses": [
		{
			"id": int,
			"nome": string
		}, ...
	],
	"msg": "Interesses encontrados"
}
```

* 404
```
{
  "msg": "Esse usuário não tem interesses"
}
```

* 500
```
{
  "msg": error
}
```

## GET GOSTOS USUARIO

### GET - ROTA: "/usuario/getGostosUsuario"

REQUISIÇÃO:
```
/usuario/getGostosUsuario?usuarioId={int}
```

RETORNOS:
* 200
```
{
	"Gostos": [
		{
			"id": int,
			"nome": string
		}, ...
	],
	"msg": "Gostos encontrados"
}
```

* 404
```
{
  "msg": "Esse usuário não tem gostos"
}
```

* 500
```
{
  "msg": error
}
```

# GOSTO <span id="gosto"></span>

## LISTA

### GET - ROTA: "/gosto/lista"

REQUISIÇÃO:
```
none
```

RETORNOS:
* 200
```
{
  "gostos": [
      {
        "id": int,
        "nome": string,
      },
      ...
  ]
}
```

* 500
```
{
  "msg": error
}
```

# INTERESSE <span id="interesse"></span>

## LISTA

### GET - ROTA: "/interesse/lista"

REQUISIÇÃO:
```
none
```

RETORNOS:
* 200
```
{
  "interesses": [
      {
        "id": int,
        "nome": string,
      },
      ...
  ]
}
```

* 500
```
{
  "msg": error
}
```

# CURTIR <span id="curtir"></span>

## Cadastro

### POST - ROTA: "/curtir/cadastro"

REQUISIÇÃO:

```
{
  "curtiu": int,
  "curtido": int
}
```

RETORNOS:
* 200
```
{
  "curtir": {
    "curtiu": int,
    "curtido": int
  },
  "msg": "Cadastrado"
}
```

* 500
```
{
  "msg": error
}
```

## Match

### GET - ROTA: "/curtir/match"

REQUISIÇÃO:

```
/curtir/match?curtiu={int}&curtido={int}
```

RETORNOS:
* 200
```
{
  "msg": "Match encontrado"
}
```

* 204
```
{
  "msg": "Nenhum match"
}
```

* 500
```
{
  "msg": error
}
```

## Lista Matches

### GET - ROTA: "/curtir/listaMatch"

REQUISIÇÃO:

```
/curtir/listaMatch?usuarioId={int}
```

RETORNOS:
* 200
```
{
  "matches": [
    {
      "id": int,
      "nome": string,
      "imgperfil": string
    }, ...
  ]
  "msg": "Lista de matches encontrado"
}
```

* 204
```
{
  "msg": "Nenhum match encontrado"
}
```

* 500
```
{
  "msg": error
}
```

# CHAT <span id="chat"></span>

## Criar Chat

### POST - ROTA: "/chat/criarChat"

REQUISIÇÃO:

```
{
  "idUsuario1": int,
  "idUsuario2": int
}
```

RETORNOS:
* 200
```
{
  "msg": "Chat Criado"
}
```

* 500
```
{
  "msg": error
}
```

## Lista Chats

### GET - ROTA: "/chat/listaChat"

REQUISIÇÃO:

```
/chat/listaChat?usuarioId={int}
```

RETORNOS:
* 200
```
{
  "chats": [
    {
      "id": int,
      "idUsuario1": int,
      "idUsuario2": int
    }, ...
  ]
  "msg": "Lista de chats encontrada"
}
```

* 204
```
{
  "msg": "Nenhum chat encontrado"
}
```

* 500
```
{
  "msg": error
}
```

## Pegar um chat

### GET - ROTA: "/chat/pegarUmChat"

REQUISIÇÃO:

```
/chat/pegarUmChat?usuarioId1={int}&usuarioId2={int}
```

RETORNOS:
* 200
```
{
  "chat": 
    {
      "id": int,
      "idUsuario1": int,
      "idUsuario2": int
    },
  "msg": "Chat encontrado"
}
```

* 204
```
{
  "msg": "Nenhum chat encontrado"
}
```

* 500
```
{
  "msg": error
}
```

# MENSAGEM <span id="mensagem"></span>

## Criar mensagem

### POST - ROTA: "/mensagem/criarMsg"

REQUISIÇÃO:

```
{
  "textMsg": string,
  "usuarioId": int,
  "chatId": int
}
```

RETORNOS:
* 200
```
{
  "msg": "Mensagem enviada"
}
```

* 500
```
{
  "msg": error
}
```

## Lista mensagens

### GET - ROTA: "/mensagem/listaMsg"

REQUISIÇÃO:

```
/mensagem/listaMsg?chatId={int}
```

RETORNOS:
* 200
```
{
	"mensagens": [
		{
			"id": int,
			"textmsg": string,
			"imgmsg": null,
			"audmsg": null,
			"usuario_id": int,
			"chat_id": int
		}, ...
	],
	"msg": "Lista de mensagens encontrada"
}
```

* 204
```
{
  "msg": "Nenhuma mensagem encontrada
}
```

* 500
```
{
  "msg": error
}
```

# LOCALIZAÇÃO <span id="localizacao"></span>

## Criar localização

### POST - ROTA: "/localizacao/cadastrar"

REQUISIÇÃO:

```
{
	"numero_casa": int,
  "rua": string,
  "bairro": string,
  "cidade": string,
  "estado": string,
  "regiao": string,
  "cep": string,
  "longi": float,
  "lati": float,
  "usuario_id": int
}
```

RETORNOS:
* 200
```
{
  "msg": "Criado"
}
```

* 500
```
{
  "msg": error
}
```

## Pegar localização

### GET - ROTA: "/localizacao/lista"

REQUISIÇÃO:

```
/localizacao/lista?idUsuario={int}
```

RETORNOS:
* 200
```
{
	"localizacao": {
			"numero_casa": int,
      "rua": string,
      "bairro": string,
      "cidade": string,
      "estado": string,
      "regiao": string,
      "cep": string,
      "longi": float,
      "lati": float,
      "usuario_id": int
		},
	"msg": "Localização encontrada"
}
```

* 204
```
{
  "msg": "Localização não encontrada"
}
```

* 500
```
{
  "msg": error
}
```