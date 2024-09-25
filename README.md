# API do projeto FinderApp

## SUMARIO
* [USUARIO](#usuario)
* [GOSTO](#gosto)
* [INTERESSE](#interesse)

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
  "descricao": string
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
  "id": string,
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
        "imgperfil": string -> (null por enquanto)
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