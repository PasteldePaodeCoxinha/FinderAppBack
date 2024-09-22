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
  "msg": "Cadastrado"
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

# INTERESSE <span id="intesse"></span>

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